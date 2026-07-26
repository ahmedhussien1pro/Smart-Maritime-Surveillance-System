# 🚢 Smart Maritime Surveillance System (C2 Center)
### 🎖️ كلية ضباط الاحتياط - دفعة 170

> نظام مراقبة واستطلاع بحري ذكي متكامل لقيادة والتحكم في الزوارق المستقلة (USV).

---

## 📁 هيكلية المشروع المتكاملة (3-Tier Architecture)

```
Smart-Maritime-Surveillance-System/
├── frontend/        ← Next.js 15 + i18n (AR/EN) + Cairo Font + Fullscreen Modal + Global Loader
├── backend/         ← Node.js + Express + Socket.IO + Telemetry Simulation + Audit Logger
├── ai-service/      ← Python + FastAPI + YOLOv8 Vision Model Engine
└── hardware/        ← ESP32 Firmware C++ Sketch (Motor PWM, Servo, Siren Relay)
```

---

## ✨ المميزات الرئيسية للنظام

1. **الرادار التكتيكي التفاعلي (Tactical 2D Radar):**
   - متابعة الأهداف البحرية المعاطاة بدائرة مسح 360° ونطاقات مدى (100m, 200m, 300m).
   - رصد الأهداف المعادية مع إشارات الخطر والألوان العسكرية.

2. **بث الكاميرا ورصد الذكاء الاصطناعي (Optical & Thermal Vision Feed):**
   - التبديل بين أوضاع الرؤية الحرارية (`THERMAL`)، الليلية (`NV`)، والعادية (`RGB`).
   - **نافذة تكبير الشاشة Fullscreen Popup Modal (Z-Index 9999)** بمرشحات زجاجية متطورة.
   - تحديد وتتبع الأهداف بالذكاء الاصطناعي بمربعات Bounding Box ونسبة الدقة %.

3. **شاشة اللودر العسكرية العامة (Global Loader - Batch 170):**
   - شعار **كلية ضباط الاحتياط** الرسمي مع هالة توهج عسكرية ذهبية.
   - يعرض اسم **دفعة 170** ومراحل التشغيل التكتيكي عند فتح أو تنقل بين الشاشات.

4. **لوحة التحكم القيادية والإنذارات الحية (Command Controls & Active Alerts):**
   - التحكم اليدوي في المحرك والتوجيه والتوقف الطارئ الشامل (**EMERGENCY STOP**).
   - بنر إنذار الخطر العالي ومقاطعة الهدف الفورية (**INTERCEPT**).

5. **دعم كامل للغة العربية والوضع النهاري/الليلي (i18n & High Contrast Themes):**
   - اعتماد خط **Cairo** العربي بجميع الأوزان وبدون أي نصوص غير مترجمة.
   - دعم التباين العالي في الوضع النهاري (`Light Mode`) والوضع الليلي (`Dark Military Mode`).

---

## 🚀 طريقة التشغيل المباشرة (Quick Start)

### 1. تشغيل الواجهة الأمامية (Frontend)
```bash
cd frontend
npm install
npm run dev
```

### 2. تشغيل السيرفر الخلفي (Backend)
```bash
cd backend
npm install
npm run dev
```

### 3. تشغيل خدمة الذكاء الاصطناعي (AI Service)
```bash
cd ai-service
pip install -r requirements.txt
python main.py
```

---

## 🎖️ إهداء
تم تطوير هذا النظام لصالح **كلية ضباط الاحتياط - دفعة 170** للربط التكتيكي بين التوجيه المستقل ورصد الذكاء الاصطناعي البحري.
