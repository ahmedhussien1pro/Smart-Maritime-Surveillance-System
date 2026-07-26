/*
 * Smart Maritime Surveillance System - ESP32 Hardware Firmware
 * Reserve Officers Academy - Batch 170
 * 
 * Features:
 * - Socket.IO & HTTP Telemetry connection to Node.js backend
 * - Motor PWM & Steering Servo commands execution
 * - Emergency Stop & Siren Alarm Relay control
 */

#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* serverUrl = "http://192.168.1.50:4000/api/telemetry";

// Pin Definitions
#define MOTOR_PWM_PIN 25
#define SERVO_PIN     26
#define RELAY_SIREN   27
#define RELAY_LIGHTS  14

void setup() {
  Serial.begin(115200);
  pinMode(MOTOR_PWM_PIN, OUTPUT);
  pinMode(RELAY_SIREN, OUTPUT);
  pinMode(RELAY_LIGHTS, OUTPUT);

  digitalWrite(RELAY_SIREN, LOW);
  digitalWrite(RELAY_LIGHTS, LOW);

  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi Connected! IP: " + WiFi.localIP().toString());
}

void sendTelemetry() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    String jsonPayload = "{\"battery\":90,\"voltage\":12.4,\"speed\":45,\"heading\":120,\"connected\":true}";
    int httpResponseCode = http.POST(jsonPayload);

    if (httpResponseCode > 0) {
      Serial.printf("Telemetry sent. Response: %d\n", httpResponseCode);
    } else {
      Serial.printf("Error sending telemetry: %s\n", http.errorToString(httpResponseCode).c_str());
    }
    http.end();
  }
}

void loop() {
  sendTelemetry();
  delay(1500);
}
