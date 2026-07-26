# 🚢 Smart Maritime Surveillance System

> نظام مراقبة بحرية ذكي | Smart Naval Command & Control Dashboard

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![NestJS](https://img.shields.io/badge/NestJS-10-red?logo=nestjs)](https://nestjs.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![i18n](https://img.shields.io/badge/i18n-AR%20%7C%20EN-green)]()

---

## 📁 Project Structure

```
Smart-Maritime-Surveillance-System/
├── frontend/     ← Next.js 15 + shadcn/ui + i18n (AR/EN) + Dark/Light
├── backend/      ← Node.js + Express + Socket.IO
└── ai-service/   ← Python + FastAPI + YOLOv8 (coming soon)
```

## 🚀 Quick Start

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
npm run dev
```

## 🌐 Languages
- 🇸🇦 Arabic (العربية)
- 🇺🇸 English

## 🎨 Themes
- 🌑 Dark Mode (Military Command Center)
- ☀️ Light Mode

## 📡 Architecture
```
ESP32-CAM  ──HTTP Stream──▶ Backend ◀──── Dashboard
ESP8266    ──WebSocket────▶ Backend
Python AI  ──REST/WS──────▶ Backend
```
