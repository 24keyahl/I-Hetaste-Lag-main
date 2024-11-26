#include <Wire.h>
#include <AM2320.h>
#include <Firebase.h>
#include <ESP8266WiFi.h>
#include <WiFiUdp.h>
#include <TimeLib.h>

#define FIREBASE_HOST "https://i-hetaste-lag-default-rtdb.europe-west1.firebasedatabase.app/"
#define FIREBASE_AUTH "VVVKYUy9LgbXWa07mVLxiZmH9L2l6UVzgdTwj6rE"
#define WIFI_SSID "Hitachigymnasiet_2.4"
#define WIFI_PASSWORD "mittwifiarsabra"

AM2320 sensor;

Firebase fb(FIREBASE_HOST, FIREBASE_AUTH);


float SensorTemp = 0;
float SensorHum = 0;
float delay1;

float hour1;

const int timeZone = 1;
static const char ntpServerName[] = "time-a.timefreq.bldrdoc.gov";
WiFiUDP Udp;
unsigned int localPort = 8888;



void setup() {
  Serial.begin(115200);
  Wire.begin(14, 12);

  delay(2000);


  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED){
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();
  
  delay1 = 2000;

  Udp.begin(localPort);
  Serial.print("local port: ");
  Serial.println(Udp.localPort());
  Serial.println("Waiting for sync");
  setSyncProvider(getNtpTime);
  setSyncInterval(300);

  hour1 = 25;
  delay(2000);
}

void getTempHum() {
  if (sensor.measure()){
    SensorTemp = sensor.getTemperature();
    SensorHum = sensor.getHumidity();

    Serial.print("Hum: ");
    Serial.print(SensorHum);
    Serial.println("%");

    Serial.print("Temp: ");
    Serial.print(SensorTemp);
    Serial.println("°C");
  }
  else {
   int errorCode = sensor.getErrorCode();
    switch (errorCode) {
      case 1: Serial.println("ERR: Sensor is offline"); break;
      case 2: Serial.println("ERR: CRC validation failed."); break;
    }
  }
}

void sendTempHum(){
  if (hour1 == hour()){
    char output1[256];
    sprintf(output1, "{\"temp\":%.2f,\"hum\":%.2f}", SensorTemp, SensorHum);
    fb.setJson("/therm/value/", output1);
  }
  else {
    char path[22];
    sprintf(path, "chart/%d/%d/%d/%d", year(), month(), day(), hour());
  
    char output[256];
    sprintf(output, "{\"temp\":%.2f,\"hum\":%.2f}", SensorTemp, SensorHum);
  
    fb.setJson(path, output);
    hour1 = hour();
  }
}

void loop(){
  getTempHum();
  sendTempHum();
  delay1 = fb.getFloat("/therm/input/delay");
  if (!delay1) {
    delay1 = 2000;
  }
  if (delay1 < 2000){
    delay1 = 2000;
  }
  else if(delay1 > 300000){
    delay1 = 300000;
  }
  Serial.println(delay1);
  delay(delay1);
}

const int NTP_PACKET_SIZE = 48; // NTP time is in the first 48 bytes of message
byte packetBuffer[NTP_PACKET_SIZE]; //buffer to hold incoming & outgoing packets
 
time_t getNtpTime()
{
  IPAddress ntpServerIP; // NTP server's ip address
 
  while (Udp.parsePacket() > 0) ; // discard any previously received packets
  Serial.println("Transmit NTP Request");
  // get a random server from the pool
  WiFi.hostByName(ntpServerName, ntpServerIP);
  Serial.print(ntpServerName);
  Serial.print(": ");
  Serial.println(ntpServerIP);
  sendNTPpacket(ntpServerIP);
  uint32_t beginWait = millis();
  while (millis() - beginWait < 1500) {
    int size = Udp.parsePacket();
    if (size >= NTP_PACKET_SIZE) {
      Serial.println("Receive NTP Response");
      Udp.read(packetBuffer, NTP_PACKET_SIZE);  // read packet into the buffer
      unsigned long secsSince1900;
      // convert four bytes starting at location 40 to a long integer
      secsSince1900 =  (unsigned long)packetBuffer[40] << 24;
      secsSince1900 |= (unsigned long)packetBuffer[41] << 16;
      secsSince1900 |= (unsigned long)packetBuffer[42] << 8;
      secsSince1900 |= (unsigned long)packetBuffer[43];
      return secsSince1900 - 2208988800UL + timeZone * SECS_PER_HOUR;
    }
  }
  Serial.println("No NTP Response :-(");
  return 0; // return 0 if unable to get the time
}
 
void sendNTPpacket(IPAddress &address)
{
  // set all bytes in the buffer to 0
  memset(packetBuffer, 0, NTP_PACKET_SIZE);
  // Initialize values needed to form NTP request
  // (see URL above for details on the packets)
  packetBuffer[0] = 0b11100011;   // LI, Version, Mode
  packetBuffer[1] = 0;     // Stratum, or type of clock
  packetBuffer[2] = 6;     // Polling Interval
  packetBuffer[3] = 0xEC;  // Peer Clock Precision
  // 8 bytes of zero for Root Delay & Root Dispersion
  packetBuffer[12] = 49;
  packetBuffer[13] = 0x4E;
  packetBuffer[14] = 49;
  packetBuffer[15] = 52;
  // all NTP fields have been given values, now
  // you can send a packet requesting a timestamp:
  Udp.beginPacket(address, 123); //NTP requests are to port 123
  Udp.write(packetBuffer, NTP_PACKET_SIZE);
  Udp.endPacket();
}
