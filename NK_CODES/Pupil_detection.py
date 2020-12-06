import cv2
import dlib
import time
import numpy as np
from scipy.spatial import distance as dist
import memcache
import os
from flask import Flask, request, jsonify, abort
app = Flask(__name__)
shared = memcache.Client(['127.0.0.1:11211'], debug=0)
##########################################################
# import socket
#
# HOST = '127.0.0.1'  # Standard loop back interface address (localhost)
# PORT = 9000      # Port to listen on (non-privileged ports are > 1023)


is_new = False
resArr = [0, 0]
final_state = ""

#************************************************************************************
#################### IMAGE PROCESSING FUNCTIONS #####################################

detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor('shape_68.dat')
left = [36, 37, 38, 39, 40, 41]
right = [42, 43, 44, 45, 46, 47]
EYE_AR_THRESH = 0.2
PREVIOUS = "center"

def shape_to_np(shape, dtype="int"):
    coords = np.zeros((68, 2), dtype=dtype)
    for i in range(0, 68):
        coords[i] = (shape.part(i).x, shape.part(i).y)
    return coords


def eye_on_mask(mask, side, shape):
    points = [shape[i] for i in side]
    points = np.array(points, dtype=np.int32)
    mask = cv2.fillConvexPoly(mask, points, 255)
    return mask


def eye_aspect_ratio(eye):
    A = dist.euclidean(eye[1], eye[5])
    B = dist.euclidean(eye[2], eye[4])
    C = dist.euclidean(eye[0], eye[3])
    ear = (A + B) / (2.0 * C)
    return ear


def calculate_gaze(left_points, right_points, leftxy, rightxy):
    try:
        gaze = 0
        A = (dist.euclidean(left_points[0], leftxy) + dist.euclidean(right_points[0], rightxy)) / 2.0
        B = (dist.euclidean(left_points[3], leftxy) + dist.euclidean(right_points[3], rightxy)) / 2.0
        if (0.75 * B > A):
            gaze = 1  # left
        elif (0.75 * A > B):
            gaze = 2  # right
        else:
            gaze = 3  # center
        return gaze
    except:
        return 0


def contouring(thresh, mid, img, right=False):
    cnts, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    try:
        cnt = max(cnts, key=cv2.contourArea)
        M = cv2.moments(cnt)
        cx = int(M['m10'] / M['m00'])
        cy = int(M['m01'] / M['m00'])
        if right:
            cx += mid
        cv2.circle(img, (cx, cy), 4, (0, 255,0), 2)
        return [cx, cy]

    except:
        pass


def my_server():

    # with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    #     print("Server Started waiting for client to connect ")
    #     s.bind((HOST, PORT))
    #     s.listen(5)
    #     address = ""
        # while True:
        #     conn, address = s.accept()
        #     if conn is not None:
        #         break

        # with conn:
        #     print('Connected by', address)
    cap = cv2.VideoCapture(0)
    ret, img = cap.read()
    thresh = img.copy()
    kernel = np.ones((9, 9), np.uint8)
    while True:
        ret, img = cap.read()
        img = cv2.flip(img, 1)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        rects = detector(gray, 1)
        for rect in rects:
            shape = predictor(gray, rect)
            shape = shape_to_np(shape)
            mask = np.zeros(img.shape[:2], dtype=np.uint8)
            mask = eye_on_mask(mask, left, shape)
            mask = eye_on_mask(mask, right, shape)
            mask = cv2.dilate(mask, kernel, 5)
            eyes = cv2.bitwise_and(img, img, mask=mask)
            mask = (eyes == [0, 0, 0]).all(axis=2)
            eyes[mask] = [255, 255, 255]
            mid = (shape[42][0] + shape[39][0]) // 2
            eyes_gray = cv2.cvtColor(eyes, cv2.COLOR_BGR2GRAY)
            threshold = 75  # cv2.getTrackbarPos('threshold', 'image')
            _, thresh = cv2.threshold(eyes_gray, threshold, 255, cv2.THRESH_BINARY)
            thresh = cv2.erode(thresh, None, iterations=2)  # 1
            thresh = cv2.dilate(thresh, None, iterations=4)  # 2
            thresh = cv2.medianBlur(thresh, 3)  # 3
            thresh = cv2.bitwise_not(thresh)
            leftxy = contouring(thresh[:, 0:mid], mid, img)
            rightxy = contouring(thresh[:, mid:], mid, img, True)
            earleft = eye_aspect_ratio(shape[36:42])
            earright = eye_aspect_ratio(shape[42:48])
            ear = (earleft + earright) / 2.0
            blink = 0
            state = ""
            gaze = calculate_gaze(shape[36:42], shape[42:48], leftxy, rightxy)
            time.sleep(1)
            if ear < EYE_AR_THRESH:
                blink = 1
            if blink:
                state = "BLINK"
            elif gaze == 1:
                state = "LEFT"
            elif gaze == 2:
                state = "RIGHT"
            elif gaze == 3:
                state = "CENTER"
            else:
                state = "Not detected"

            #print(state)
            PREVIOUS = state

            #print("Ok Sending data ")
            if state is None:
                continue
            my_data = state
            global final_state
            final_state = state
            #shared.set('Value', state)
            is_new = True
            # x_encoded_data = my_data.encode('utf-8')
            # new_data = "HTTP/1.1 200 OK\n" + "Content-Type: text/html\n"  + "\n" + "<html><body>Hello World</body></html>\n"
            # conn.send(bytes(new_data, 'utf-8'))
            # #conn.send(bytes(state, 'utf-8'))
            f = open("demofile.txt", "w+")
            f.write(state)
            f.close()
            print(final_state)


if __name__ == '__main__':
    my_server()

