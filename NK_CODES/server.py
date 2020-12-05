# This is server code
import autocomplete
autocomplete.load()
from flask import Flask, request, jsonify, abort
app = Flask(__name__)

is_new = False
resArr = [0, 0]
final_state = ""

@app.route('/')
def hello():
    #sentence = request.args.get('sentence')
    f_read = open("demofile.txt", "r")
    final_state = f_read.readlines()
    f_read.close()
    f = open("demofile.txt", "w+")
    f.write("")
    f.close()
    print(final_state)
    if final_state is None or len(final_state) == 0:
        final_state = None

    response = jsonify(final_state)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


@app.route('/keyboard')
def keyboard():
    global resArr
    f_read = open("demofile_1.txt", "r")
    xy_coord = f_read.readlines()
    f_read.close()
    f = open("demofile_1.txt", "w+")
    f.write("")
    f.close()
    if xy_coord is None or len(xy_coord) == 0:
        resArr = None
    else:
        resArr = [0, 0]
        temp = xy_coord[0].split('\n')
        resArr[0], resArr[1] = temp[0].split("  ")
        print(resArr)

    response = jsonify(resArr)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

# ***************************************** KEYBOARD ************************
@app.route('/autosuggest')
def autosuggest():
    sentence = request.args.get('sentence')
    if (sentence is None):
      abort(404, description="Resource not found")
    if (not isinstance(sentence, str)):
      abort(404, description="Resource not found")
    sentence = sentence.lower()
    words = sentence.split()
    responseArr = []
    # print(words)
    if (sentence=='' or len(words)==0):
      responseArr = [['i'], ['the'], ['ok']]
    elif (len(words)==1):
      # print('test')
      if sentence[-1] == ' ':
        responseArr = autocomplete.predict_currword_given_lastword(words[0], '', top_n= 3)
      else:
        responseArr = autocomplete.predict_currword(words[0], top_n= 3)
    else:
      responseArr = autocomplete.predict_currword_given_lastword(words[-2], words[-1], top_n= 3)
    finalArray = []
    for i in responseArr:
      finalArray.append(i[0])
    response = jsonify(finalArray)

    # Enable Access-Control-Allow-Origin
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=7000)


