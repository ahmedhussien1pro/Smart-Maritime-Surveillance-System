/*
 * Smart Maritime Surveillance Boat - ESP8266 Main Controller Firmware
 * Based on Hardware Design Specification (HDS) v1.0
 * Batch 170 - Reserve Officers Academy
 * 
 * Hardware Modules:
 * - ESP8266 NodeMCU (Main Controller)
 * - TB6612FNG Dual H-Bridge Motor Driver
 * - MG90S / MG996R Servo Motor (Rudder Steering)
 * - Active Buzzer + Red/Green Status LEDs
 * - Battery Voltage Divider (Analog Input A0)
 * 
 * Communication Topics / Events:
 * - boat/status (Telemetry: Speed, Heading, Voltage, Status)
 * - boat/control (Commands: Forward, Backward, Left, Right, Stop, Emergency)
 */

#include <ESP8266WiFi.h>
#include <WebSocketsClient.h>
#include <Servo.h>
#include <ArduinoJson.h>

// WiFi Configuration
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* ws_host = "192.168.1.50";
const int   ws_port = 4000;

// TB6612FNG Motor Driver Pins
#define PIN_PWMA  5  // D1 (PWM Speed Motor A)
#define PIN_AIN1  4  // D2 (Dir 1 Motor A)
#define PIN_AIN2  0  // D3 (Dir 2 Motor A)
#define PIN_STBY  2  // D4 (Standby - MUST BE HIGH)

// Servo Pin (Rudder)
#define PIN_SERVO 14 // D5 (Rudder Servo PWM)

// Alarm & Status Pins
#define PIN_BUZZER 12 // D6 (Active Buzzer)
#define PIN_LED_RED 13 // D7 (Red Threat Alert LED)
#define PIN_LED_GREEN 15 // D8 (Green System Nominal LED)

// Analog Battery Sensor
#define PIN_BAT_SENS A0 // Analog Voltage Input

Servo rudderServo;
WebSocketsClient webSocket;

int currentSpeed = 0;
int currentRudderAngle = 90; // Center Rudder Angle
bool emergencyStopped = false;

void setMotor(int speed, bool forward) {
  if (emergencyStopped) {
    analogWrite(PIN_PWMA, 0);
    digitalWrite(PIN_AIN1, LOW);
    digitalWrite(PIN_AIN2, LOW);
    return;
  }

  digitalWrite(PIN_STBY, HIGH); // Enable Motor Driver
  speed = constrain(speed, 0, 1023);

  if (forward) {
    digitalWrite(PIN_AIN1, HIGH);
    digitalWrite(PIN_AIN2, LOW);
  } else {
    digitalWrite(PIN_AIN1, LOW);
    digitalWrite(PIN_AIN2, HIGH);
  }
  analogWrite(PIN_PWMA, speed);
}

void setup() {
  Serial.begin(115200);

  // Configure Motor Pins
  pinMode(PIN_PWMA, OUTPUT);
  pinMode(PIN_AIN1, OUTPUT);
  pinMode(PIN_AIN2, OUTPUT);
  pinMode(PIN_STBY, OUTPUT);

  digitalWrite(PIN_STBY, HIGH);

  // Configure Alarm & Status Pins
  pinMode(PIN_BUZZER, OUTPUT);
  pinMode(PIN_LED_RED, OUTPUT);
  pinMode(PIN_LED_GREEN, OUTPUT);

  digitalWrite(PIN_BUZZER, LOW);
  digitalWrite(PIN_LED_RED, LOW);
  digitalWrite(PIN_LED_GREEN, HIGH); // Green Nominal

  // Attach Servo
  rudderServo.attach(PIN_SERVO);
  rudderServo.write(currentRudderAngle);

  // Connect to WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting WiFi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi Connected! IP: " + WiFi.localIP().toString());

  // Setup WebSocket Client
  webSocket.begin(ws_host, ws_port, "/socket.io/?EIO=4&transport=websocket");
  webSocket.onEvent(webSocketEvent);
}

void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
  switch (type) {
    case WStype_DISCONNECTED:
      Serial.println("[WS] Disconnected!");
      digitalWrite(PIN_LED_GREEN, LOW);
      digitalWrite(PIN_LED_RED, HIGH);
      break;

    case WStype_CONNECTED:
      Serial.println("[WS] Connected to Central Backend Hub");
      digitalWrite(PIN_LED_GREEN, HIGH);
      digitalWrite(PIN_LED_RED, LOW);
      break;

    case WStype_TEXT: {
      String text = String((char*)payload);
      if (text.startsWith("42")) { // Socket.IO message prefix
        text = text.substring(2);
        StaticJsonDocument<512> doc;
        DeserializationError err = deserializeJson(doc, text);
        if (!err) {
          String eventName = doc[0];
          if (eventName == "command") {
            JsonObject cmdObj = doc[1];
            String cmd = cmdObj["command"];

            if (cmd == "forward") {
              currentSpeed = min(1023, currentSpeed + 150);
              setMotor(currentSpeed, true);
            } else if (cmd == "backward") {
              currentSpeed = min(1023, currentSpeed + 150);
              setMotor(currentSpeed, false);
            } else if (cmd == "left") {
              currentRudderAngle = max(45, currentRudderAngle - 20);
              rudderServo.write(currentRudderAngle);
            } else if (cmd == "right") {
              currentRudderAngle = min(135, currentRudderAngle + 20);
              rudderServo.write(currentRudderAngle);
            } else if (cmd == "stop") {
              currentSpeed = 0;
              setMotor(0, true);
            } else if (cmd == "emergency_stop") {
              emergencyStopped = true;
              setMotor(0, true);
              digitalWrite(PIN_BUZZER, HIGH);
              digitalWrite(PIN_LED_RED, HIGH);
              digitalWrite(PIN_LED_GREEN, LOW);
            } else if (cmd == "alarm") {
              bool state = cmdObj["state"];
              digitalWrite(PIN_BUZZER, state ? HIGH : LOW);
              digitalWrite(PIN_LED_RED, state ? HIGH : LOW);
            }
          }
        }
      }
      break;
    }
  }
}

unsigned long lastTelemetryTime = 0;

void sendTelemetry() {
  if (millis() - lastTelemetryTime > 1500) {
    lastTelemetryTime = millis();

    int rawAdc = analogRead(PIN_BAT_SENS);
    float voltage = (rawAdc / 1023.0) * 3.3 * 4.0; // Battery voltage divider formula

    StaticJsonDocument<256> doc;
    doc["speed"] = map(currentSpeed, 0, 1023, 0, 100);
    doc["heading"] = currentRudderAngle;
    doc["battery"] = map(voltage * 10, 60, 84, 0, 100);
    doc["voltage"] = voltage;
    doc["connected"] = true;

    String jsonStr;
    serializeJson(doc, jsonStr);

    String payload = "42[\"esp:telemetry\"," + jsonStr + "]";
    webSocket.sendTXT(payload);
  }
}

void loop() {
  webSocket.loop();
  sendTelemetry();
}
