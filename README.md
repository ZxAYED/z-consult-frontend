# 🟢 Z Consult — Frontend

A clinic operations dashboard for **appointments, queues, staff, and services**.

Z Consult is a modern, product-grade interface built for busy clinics. It keeps front desk workflows clear and fast, reduces scheduling friction, and gives managers instant visibility into **capacity** and **queue health**.

---

## 🔗 Live Links

- 🌐 **Frontend:** https://z-consult-frontend.vercel.app  
- ⚙️ **Backend:** https://z-consult-backend.onrender.com  

---

## ✨ What This App Does

✅ Centralizes scheduling, live queue management, staff capacity, and services  
✅ Helps teams avoid double bookings and bottlenecks  
✅ Makes operational data visible at a glance — not buried in tabs

---

## 🧩 Core Features

### 📅 Appointments
- Create, update, cancel, and manage appointments
- Quick status tagging + clean action controls
- Search and filters for fast lookup

### 🧾 Queue
- Live queue list with clear position ordering
- Queue stats to monitor load
- **One-click assignment** from the queue

### 👥 Staff
- Capacity and availability tracking
- Quick edits and management from a single table

### 🧰 Services
- Service catalog with duration + staff requirements
- Fast updates through modal-based CRUD

---

## 🎨 UX + UI Design Approach

- ⚡ Minimal, high-contrast hierarchy for faster scanning
- 🧊 Soft panels + zebra-row tables for reduced cognitive load
- 🏷️ Consistent status badges and action buttons across routes
- 🟩 Calm clinical palette (lime + slate) for a trustworthy, modern feel

---

## 🛠 Tech Stack

- ⚛️ Next.js (App Router)
- 🧠 React
- 🟦 TypeScript
- 🎨 Tailwind CSS
- 🧱 shadcn/ui

---

## 🚀 Local Development

```bash
pnpm install
pnpm dev
Open: http://localhost:3000

Backend used by the UI: https://z-consult-backend.onrender.com

📁 Project Structure (High Level)
src/
  app/
    (dashboard)/
      appointments/
      queue/
      staff/
      services/
  components/
  lib/
  providers/
  types/
public/
