# Z Consult Frontend

Clinic operations dashboard for appointments, queues, staff, and services.

Z Consult is a modern, product-grade interface built for busy clinics. It keeps front desk workflows clear and fast, reduces scheduling friction, and gives managers instant visibility into capacity and queue health.

---

## What This App Does

- Centralizes scheduling, live queue management, staff capacity, and services.
- Helps teams avoid double bookings and bottlenecks.
- Makes operational data visible at a glance, not buried in tabs.

---

## Core Features

- Appointments
  - Create, update, cancel, and manage appointments.
  - Quick status tagging and clean action controls.
  - Search and filters for fast lookup.
- Queue
  - Live queue list with clear position ordering.
  - Queue stats to monitor waiting times and load.
  - One-click assignment from the queue.
- Staff
  - Capacity and availability tracking.
  - Quick edits and management from a single table.
- Services
  - Service catalog with duration and staff requirements.
  - Fast updates through modal-based CRUD.

---

## UX + UI Design Approach

- Minimal, high-contrast hierarchy for faster scanning.
- Soft panels and zebra-row tables for reduced cognitive load.
- Consistent pill badges and action buttons across routes.
- Calm, clinical palette to feel trustworthy and modern.

---

## Tech Stack

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- shadcn/ui

---

## Local Development

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000
backend -https://z-consult-backend.onrender.com

---

## Deployment (Netlify)

This project is ready for Netlify. A `_redirects` file is included so client-side routing works correctly.

Suggested steps:

1. Build the app (if needed) with `pnpm build`.
2. Deploy the output as recommended by your Netlify Next.js setup.
3. Ensure the `public/_redirects` file is included in the final build.

Redirect rule used:

```
/* /index.html 200
```

---

## Project Structure (high level)

```
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
```

---

## About the Builder

This project reflects product-first frontend engineering:

- I design interfaces that reduce operational friction.
- I keep systems consistent across routes and flows.
- I balance visual polish with functional clarity.

If you are hiring a product-minded frontend engineer who cares about UX as much as code quality, I would love to connect.
