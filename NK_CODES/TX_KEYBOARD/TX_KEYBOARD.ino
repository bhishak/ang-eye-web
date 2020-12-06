#include <Wire.h>
#include <MPU6050.h>

MPU6050 mpu;
int16_t ax, ay, az, gx, gy, gz;

int Keyboard_Mapper(int a)
{
  if (a < -80)
    return -50;
  else if (a < -65) 
    return -40;
  else if (a < -45) 
    return -30;
  else if (a < -25) 
    return -20;
  else if (a < -15) 
    return -10;
  else if (a > 85) 
    return 50;
  else if (a > 65) 
    return 40;
  else if (a > 45)
    return 30;
  else if (a > 25)
    return 20;
  else if (a > 15)
    return 10;
  else
  return 0;
}

void setup() 
{
  Serial.begin(9600);    // initialize serial communications at 9600 bps:
  Wire.begin();          
  mpu.initialize();     // initialize I2c communication 
  if (!mpu.testConnection()) {
    while (1);
  }
}

void loop() {
  // Fetch the values from accelerometer
  mpu.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);
//  Serial.print(ax);
//  Serial.print(" : ");  
//  Serial.println(ay);
  
  int vx = map(ax, -10000, 3000, 1920, 0);
  int vy = map(ay, -4000, 10000, 1080, 0);
  
  int constrained_x = constrain(vx,0,1920);
  int constrained_y = constrain(vy,0,1080);
//
  Serial.print(constrained_x);
  Serial.print(" : ");  
  Serial.println(constrained_y);
//  Serial.print(Keyboard_Mapper(vx));
//  Serial.print(":");  
//  Serial.println(Keyboard_Mapper(vy));
  delay(20);
}
