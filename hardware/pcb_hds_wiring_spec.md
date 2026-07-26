#  دليل وتصميم لوحة التوصيلات (Hardware Design Specification HDS v1.0)


![تصميم لوحة التوصيل والهاردوير HDS](/frontend/public/hds_pcb_schematic.jpg)

---

##  1. الهيكلية العامة وربط الوحدات (System Hardware Block Diagram)

```mermaid
graph TD
    subgraph Power_System ["⚡ نظام التغذية والحماية (Hybrid Power & BMS)"]
        BAT["🔋 Li-ion Battery Pack (7.4V - 11.1V / 2S-3S)"] --> BMS["لوحة BMS للحماية والتوازن"]
        BMS --> FUSE["متحمل فيوز حماية Fuse 10A"]
        FUSE --> BUCK["مخفض جهد LM2596 / Mini360 (5V 3A Step-Down)"]
        FUSE --> TB_VM["TB6612FNG Motor Driver VM (Motor High Power 7.4V-12V)"]
        SOLAR["☀️ Solar Panel / Hybrid Generator (Demo)"] --> BMS
    end

    subgraph Core_Control ["🧠 لوحة التحكم المركزية (ESP8266 Main Controller)"]
        ESP8266["📟 ESP8266 NodeMCU / D1 Mini"]
        BUCK -->|5V VIN| ESP8266
        BAT_SENS["حساس جهد البطارية A0 Divider"] -->|A0 Analog| ESP8266
    end

    subgraph Camera_Vision ["📷 وحدة البث المباشر (ESP32-CAM)"]
        ESP32_CAM["📷 ESP32-CAM Video Streamer"]
        BUCK -->|5V| ESP32_CAM
    end

    subgraph Motion_Actuators ["⚙️ المحركات والتوجيه (Motion & Steering)"]
        ESP8266 -->|D1 / GPIO 5 PWM| TB_PWMA["TB6612FNG PWMA (Speed)"]
        ESP8266 -->|D2 / GPIO 4| TB_AIN1["TB6612FNG AIN1 (Dir 1)"]
        ESP8266 -->|D3 / GPIO 0| TB_AIN2["TB6612FNG AIN2 (Dir 2)"]
        ESP8266 -->|D4 / GPIO 2| TB_STBY["TB6612FNG STBY (Enable Pin = HIGH)"]
        ESP8266 -->|D5 / GPIO 14 PWM| SERVO["موتور التوجيه MG90S / MG996R Servo"]
        BUCK -->|5V Power| SERVO
        TB_VM -->|Motor A Out| DC_MOTOR["محرك الدفع البحري DC Motor + Propeller"]
    end

    subgraph Alarm_Indicators ["🚨 أنظمة الإنذار والإشارة (Alarm & Indicators)"]
        ESP8266 -->|D6 / GPIO 12| BUZZER["صفارة الإنذار Active Buzzer"]
        ESP8266 -->|D7 / GPIO 13| LED_RED["LED أحمر (خطر / انقطاع)"]
        ESP8266 -->|D8 / GPIO 15| LED_GREEN["LED أخضر (نظام نشط)"]
    end
```

---

##  2. جدول التوصيلات الدقيق للأرجل (ESP8266 NodeMCU Pinout Table)

| رقم طرف ESP8266 | رقم GPIO | المكون الإلكتروني المرتبط | وظيفة التوصيل (Function) | النمط (Mode) | ملاحظات التوصيل |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **D1** | GPIO 5 | TB6612FNG Motor Driver | إشارة سرعة المحرك (PWMA) | Output (PWM) | التحكم في السرعة 0-1023 |
| **D2** | GPIO 4 | TB6612FNG Motor Driver | اتجاه المحرك 1 (AIN1) | Output (Digital) | دوران للأمام عند HIGH |
| **D3** | GPIO 0 | TB6612FNG Motor Driver | اتجاه المحرك 2 (AIN2) | Output (Digital) | دوران للخلف عند HIGH |
| **D4** | GPIO 2 | TB6612FNG Motor Driver | طرف تفعيل الدرايفر (STBY) | Output (Digital) | **يجب ربطه بـ HIGH لتشغيل الدرايفر** |
| **D5** | GPIO 14 | Servo Motor MG90S / MG996R | إشارة زاوية التوجيه (Rudder Servo) | Output (PWM) | زاوية التوجيه 45° - 135° |
| **D6** | GPIO 12 | Active Buzzer 5V | صافرة الإنذار الصوتية | Output (Digital) | إنذار صوتي عند رصد هدف معادي |
| **D7** | GPIO 13 | Red Status LED | مؤشر إشارة الخطر والتوقف الطارئ | Output (Digital) | إضاءة حمراء في حالة الخطر |
| **D8** | GPIO 15 | Green Status LED | مؤشر حالة الاتصال بالنظام | Output (Digital) | إضاءة خضراء عند الاتصال بالنظام |
| **A0** | ADC0 | Battery Voltage Divider Module | قراءة جهد شحن البطارية | Input (Analog) | مقسم جهد R1=30K, R2=7.5K |
| **VIN (5V)** | Buck Converter Out | تغذية لوحة ESP8266 | Power Input | مخرج 5V ثابت من مخفض الجهد |
| **GND** | Common Ground Bus | الأرضي الموحد لجميع الأجهزة | Ground Bus | **ربط جميع الأراضي معاً** |

---

##  3. جدول توصيل درايفر المحرك TB6612FNG

| طرف TB6612FNG | الطرف المرتبط بالدائرة | وصف التوصيل |
| :--- | :--- | :--- |
| **VM** | موجب البطارية 7.4V - 12V (بعد الفيوز والـ BMS) | تغذية المحركات العالية القوة |
| **VCC** | مخرج 5V من مخفض الجهد / 3.3V | تغذية المنطق الرقمي للدرايفر |
| **GND** | Common Ground Bus | الأرضي الموحد للبطارية والـ ESP8266 |
| **PWMA** | ESP8266 (D1 / GPIO 5) | التحكم في سرعة المحرك A |
| **AIN1** | ESP8266 (D2 / GPIO 4) | اتجاه التدوير 1 |
| **AIN2** | ESP8266 (D3 / GPIO 0) | اتجاه التدوير 2 |
| **STBY** | ESP8266 (D4 / GPIO 2) أو 5V ثابت | طرف الاستعداد (Standby) |
| **AO1 / AO2** | طرفي محرك الدفع DC Motor + Propeller | مخرج التغذية للمحرك الرئيسي |

---

##  4. قائمة مكونات التجميع الشاملة (BOM Checklist)

1. **متحكم التحكم الرئيسي:** ESP8266 NodeMCU v3 / Wemos D1 Mini (عدد 1).
2. **وحدة البث المباشر:** ESP32-CAM Module + Antenna (عدد 1).
3. **درايفر المحرك:** TB6612FNG Dual H-Bridge Motor Driver Module (عدد 1).
4. **محرك الدفع:** 12V / 7.4V High Speed DC Motor + Boat Propeller + Shaft (عدد 1).
5. **موتور التوجيه:** MG90S (Metal Gear) أو MG996R Servo (عدد 1).
6. **مخفض الجهد:** LM2596 أو Mini360 DC-DC Step Down Buck Converter (عدد 1).
7. **البطارية والحماية:** Li-ion Battery Pack (2S 7.4V أو 3S 11.1V) + 2S/3S BMS Module + Fuse Holder (10A).
8. **الإنذار والإشارة:** Active Buzzer 5V (عدد 1) + LED أحمر 5mm (عدد 1) + LED أخضر 5mm (عدد 1) + مقاومات 220Ω.
9. **حساس البطارية:** Voltage Divider Sensor Module (0-25V Range) (عدد 1).
