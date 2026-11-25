# 🎓 UAMP v3 — University Assessment & Mastery Portal

[![Angular](https://img.shields.io/badge/Angular-17.3-red.svg?logo=angular)](https://angular.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg?logo=node.js)](https://expressjs.com/)
[![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind%20%2B%20Custom%20Design-blue.svg?logo=tailwindcss)](https://tailwindcss.com/)
[![Security](https://img.shields.io/badge/Anti--Cheat-Live%20WebCam%20Proctoring-purple.svg)]()
[![Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg)]()

> **UAMP v3** is an anti-cheat powered University Examination, Attendance, Fee Clearance, Grievance Redressal, and Academic Administration System. Built with **Angular 17.3** (Standalone Components & Signals), an **Express REST API** (in-memory database + JWT auth), **jsPDF**, and **Google Gemini AI**.

---

## ✨ Key Features

### 📧 1. Email OTP Verification & Account Registration
- **2-Step OTP Authentication**: 6-digit numeric OTP generation (`/api/auth/send-otp`) for identity verification during account registration.
- **Auto-Fill Testing Support**: Convenient demo OTP auto-fill helper in the registration form for rapid development and testing.

### 🛡️ 2. Admin Approval Gating & Master Admin Controls
- **Restricted Admin Self-Registration**: Public self-registration is strictly restricted to **Students** and **Faculty/Teachers**.
- **Pending Registration Queue**: Self-registered accounts are placed in a `PENDING` approval state until activated by an Administrator.
- **1-Click User Directory Approval**: Administrators can review, approve, create, and delete accounts from the **User Management Directory** with a **confirmation dialog** before destructive actions.

### 🎥 3. Live WebCam & Audio Anti-Cheat Proctoring Engine
- **Multi-Camera Source Selector**: Detects all connected cameras (built-in, USB, virtual) and lets students choose the active camera for proctoring.
- **Microphone & Background Noise Monitoring**: Requests microphone access during exams and monitors ambient sound levels in real time using the Web Audio API (`AudioContext` + `AnalyserNode`). If sustained background noise or speech is detected, a non-terminating **Audio Warning** banner and security log entry are triggered (with a 10-second cooldown) — it **never terminates** the exam.
- **Camera Permission Handling**: Detailed error messages for denied permissions, missing cameras, and busy devices with retry support.
- **Blank Frame Detection**: Canvas-based pixel sampling to detect blank or covered camera feeds with live warnings.
- **3-Strike Tab Switch Rule**: Automated `window:blur` and `visibilitychange` detection that logs security violations and force-submits exams on the 3rd strike. Camera permission prompts are excluded from triggering false strikes.
- **Real-Time Video Grid**: Auto-refreshing 3-second live camera stream grid for Faculty (`/teacher/live-proctoring`) and Administrators (`/admin/live-monitoring`).
- **Direct Proctor Warning Dispatch**: Remote messaging system allowing proctors to send live warning alerts to active candidates in real time with preset quick-warning templates and custom messages.
- **Faculty Flag Student**: Teachers can flag suspicious candidates directly from the live proctoring grid — the flag increments the student's warning count and records a security audit entry.
- **Admin Force-Terminate Session**: Administrators can forcefully terminate any active proctored exam session with a **confirmation modal** — the student's exam interface detects the termination in real time.
- **Camera Stream Persistence**: Selected camera device is remembered in `localStorage` for future exam sessions.

### ⏱️ 4. 10-Minute Inactivity Auto-Logout
- Tracks user interactions across mouse movements, keyboard input, clicks, scrolling, and touch events.
- Automatically logs out inactive sessions after 10 minutes of inactivity and displays a notice on the login screen.

### 📱 5. Dynamic Live QR Attendance Broadcast
- Auto-refreshing 4-digit security code and QR code generator (updating every 10 seconds on the server) for live classroom attendance check-ins.
- Teachers host the live QR broadcast; students scan or enter the code to mark attendance.

### 🌗 6. Universal Light/Dark Theme System
- Dual `.dark` and `.dark-mode` class bindings on `document.documentElement` persisted to `localStorage` for seamless theme switching across all components.

### 🤖 7. Gemini AI & Manual Question Bank
- **AI Question Generator**: AI-assisted multiple choice question paper generation (`gemini-1.5-flash` via Google Gemini API `v1beta`) with customizable topic focus, count, and difficulty levels.
- **Built-in Fallback Generator**: Topic-tailored question generation when `GEMINI_API_KEY` is not configured — zero downtime.
- **Manual Question Entry**: Teachers can manually create individual questions through a dedicated form — questions are **saved to the server** via REST API (`POST /api/teacher/questions`), not just UI stubs.

### 💳 8. Fee Clearance, Admit Cards, Results & Grievances
- Real-time tuition fee tracking, accounts approvals, fee amount edits, and automatic Hall Ticket release/block rules.
- Client-side PDF downloads (via `jspdf`) for **Official Admit Cards**, **Fee Receipts**, and **Proctored Grade Transcripts**.
- **Dynamic Exam Schedule Table** on Admit Card page — subjects pulled live from API instead of hardcoded rows.
- Student grievance submission and official university notices board.

### 🔒 9. Password Visibility Toggle
- Eye/eye-slash toggle buttons on both **sign-in** and **registration** password input fields for accessibility.

### 📊 10. Live Dashboard Metrics
- **Teacher Dashboard**: Real-time metrics for active students count, live proctor streams, questions in bank, and class average scores — all fetched from live API data.
- **Student Dashboard**: Live attendance percentage, next exam date, admit card status, and fee dues — all from API.
- **Admin Dashboard**: User management, exam scheduling, fee management, and system monitoring controls.

### 📑 11. Subject & Exam Management
- Administrators can manage the **subject/course directory** (add new subjects with codes and departments).
- **Schedule New Proctored Exams**: Configure exam title, subject, duration, date, and session time — published to the exam bank immediately.

### 🔐 12. Role-Based Access Control
- Three distinct roles: **Student**, **Teacher/Faculty**, **Admin** — each with separate route guards, layouts, and feature access.
- **Page-refresh resilience**: The role guard calls `GET /api/auth/me` to restore the current user from JWT when a page is refreshed.
- **JWT Authentication** with 12-hour expiry and automatic token injection via HTTP interceptor.
- **Error Interceptor**: Auto-logout on 401/403 responses (excluding login/register endpoints).

---

## 🚀 How to Run the Project

> You need **two terminals** running at the same time: one for the **Express REST API backend** (`http://localhost:3000`) and one for the **Angular frontend** (`http://localhost:4200`).

### Prerequisites
- **Node.js**: v18.0 or higher (tested with Node v24.18.0)
- **npm**: v9.0 or higher
- **Internet connection**: Required in the browser for CDN Tailwind CSS, FontAwesome icons, Google Fonts, and optional Gemini API calls.

### 1. Clone Repository
```bash
git clone https://github.com/Chaitanya2005-hub/UAMP-V3.git
cd UAMP-V3
```

### 2. Start REST API Backend (`server/`)
```bash
cd server
npm install
npm start
```
- **Alternative (auto-reload on file changes)**: `npm run dev` (runs `node --watch server.js`)
- **Backend URL**: `http://localhost:3000`
- **Data Persistence**: Uses an **in-memory database** seeded on startup (`server/server.js`), so any runtime changes reset when the server restarts.

#### Optional Backend Environment Variables (`server/.env`)
Create a `.env` file inside `server/` if you want to customize the port, JWT secret, or enable live Google Gemini question generation:
```env
PORT=3000
JWT_SECRET=uamp_super_secret_jwt_key_2026
GEMINI_API_KEY=your_google_gemini_api_key
```
> If `GEMINI_API_KEY` is omitted, the AI Question Generator automatically falls back to its built-in question generator without errors.

### 3. Start Angular Client Application (`client/`)
Open a **second terminal** from the project root:
```bash
cd client
npm install
npm start
```
- `npm start` runs `ng serve --port 4200 --host 0.0.0.0` (or run `npx ng serve --port 4200`).
- **Frontend URL**: `http://localhost:4200`

#### Other Useful Client Commands
```bash
# Production build (outputs to client/dist/uamp-client)
npm run build

# Development watch build
npm run watch
```

---

## 🌐 Deployment Guide

The Angular frontend uses `client/src/environments/environment.ts` (`http://localhost:3000/api`) in development and `client/src/environments/environment.prod.ts` (`/api`) in production builds.

### Option A: Single-Service Deploy (Render, Railway, Fly.io) — *Recommended*
`server/server.js` automatically serves `client/dist/uamp-client/browser` when present, so both the Angular UI and Express `/api` run on one HTTPS domain:
1. **Build Command**:
   ```bash
   cd client && npm install && npm run build && cd ../server && npm install
   ```
2. **Start Command**:
   ```bash
   cd server && npm start
   ```
3. **Environment Variables** (in your host dashboard):
   - `JWT_SECRET` — strong random secret string
   - `GEMINI_API_KEY` *(optional)* — Google Gemini API key

### Option B: Split Hosting (Vercel / Netlify + Render / Railway)
1. Deploy `server/` to Render or Railway (`npm install`, `npm start`).
2. Update `client/src/environments/environment.prod.ts` `apiUrl` to `https://<your-backend-domain>/api`.
3. Deploy `client/` to Vercel/Netlify (`npm run build`, publish directory: `dist/uamp-client/browser`).

> **Note**: Hosting over **HTTPS** is required for browser WebCam & Microphone proctoring. Also note that `server/server.js` uses an **in-memory database**, so data resets whenever the server restarts.

---

## 🔑 Demo Account Credentials

You can use the **1-Click Quick Demo Sign-In** chips on the login screen (`/login`) to populate the username, then enter the password manually:

| Role | Username(s) | Password | Access Level |
| :--- | :--- | :--- | :--- |
| 🎓 **Student** | `student`, `priya`, `rohan` | `password123` | Proctored Exams, Results, Admit Card, Fee Status, QR Attendance, Grievances |
| 👨‍🏫 **Teacher** | `teacher` | `password123` | Live Proctoring Grid, AI Question Generator, Manual Questions, Live QR Host, Student Progress |
| 🛡️ **Admin** | `admin` | `password123` | System Monitoring Grid, User Approvals, Exam Scheduling, Subjects, Fee Edits, Admit Card Controls |

---

## 🧩 REST API Endpoints

### Authentication
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Sign in with username/password → JWT token |
| `POST` | `/api/auth/send-otp` | Send 6-digit OTP to email (logged to console) |
| `POST` | `/api/auth/verify-otp-register` | Register account with OTP verification |
| `GET` | `/api/auth/me` | Get current user from JWT (protected) |

### Exams & Questions
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/exams` | List all exams |
| `POST` | `/api/exams/schedule` | Schedule a new proctored exam |
| `GET` | `/api/exams/:id/questions` | Get questions for an exam |
| `POST` | `/api/exams/:id/submit` | Submit exam answers with score calculation |
| `POST` | `/api/teacher/questions` | Create a manual question |
| `GET` | `/api/teacher/questions-count` | Total questions in bank |
| `POST` | `/api/teacher/auto-generate-questions` | Generate questions via Gemini AI or fallback |

### Live Proctoring
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/proctor/stream` | Student sends webcam frame + status |
| `GET` | `/api/proctor/active-sessions` | Get all active proctoring sessions |
| `POST` | `/api/proctor/send-warning` | Send proctor warning message to student |
| `POST` | `/api/proctor/flag` | Flag student for suspicious activity |
| `POST` | `/api/proctor/terminate` | Force-terminate student exam session |
| `POST` | `/api/proctor/clear-messages` | Clear proctor messages after reading |

### Attendance, Fees, Admit Cards, Results, Users, Grievances
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/teacher/qr-code` | Get current QR attendance code |
| `POST` | `/api/student/attendance/mark` | Mark attendance with QR code |
| `GET` | `/api/student/attendance/my-history` | Student attendance history |
| `GET` | `/api/fees/my-status` | Student fee status |
| `GET/POST` | `/api/admin/fees`, `/api/admin/fees/edit`, `/api/admin/fees/:id/approve` | Admin fee management |
| `GET` | `/api/student/admit-card/me` | Student admit card |
| `GET/POST` | `/api/admin/admit-cards`, `/api/admin/admit-cards/:studentId/status` | Admin admit card management |
| `GET` | `/api/results/my-results` | Student exam results |
| `GET` | `/api/results/all` | All exam results |
| `GET/POST` | `/api/users`, `/api/users/:id/approve`, `DELETE /api/users/:id` | User CRUD & approvals |
| `GET/POST` | `/api/grievances`, `PUT /api/grievances/:id/status` | Grievance submission & resolution |
| `GET/POST` | `/api/subjects` | Subject directory management |
| `GET/POST` | `/api/notices` | University notices board |

---

## 📁 Repository Structure

```text
UAMP v3/
├── client/                                 # Angular 17.3 Standalone Frontend Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/
│   │   │   │   ├── guards/                 # Functional route guards (authGuard, roleGuard)
│   │   │   │   ├── interceptors/           # Functional HTTP interceptors (jwtInterceptor, errorInterceptor)
│   │   │   │   ├── models/                 # TypeScript interfaces (User, Exam, Question, Result, Fee, etc.)
│   │   │   │   └── services/               # Injectable Signals & HttpClient services
│   │   │   ├── features/
│   │   │   │   ├── auth/login/             # Sign-In & 2-Step Email OTP Registration
│   │   │   │   ├── student/                # Dashboard, Exams, Proctoring, QR Attendance, Admit Card, Fees, Results, Grievances
│   │   │   │   ├── teacher/                # Dashboard, AI Questions, Manual Questions, Live QR Host, Proctoring, Progress
│   │   │   │   └── admin/                  # Dashboard, Users, Subjects, Schedule Exam, Fees, Admit Cards, Live Grid
│   │   │   ├── shared/
│   │   │   │   ├── components/             # Navbar, Footer, ThemeToggle, StatCard, ConfirmModal
│   │   │   │   └── pipes/                  # InrCurrencyPipe
│   │   │   ├── app.component.ts            # Root standalone component
│   │   │   ├── app.config.ts               # Router, HttpClient interceptors, Animations config
│   │   │   └── app.routes.ts               # Role-protected routes
│   │   ├── index.html                      # Tailwind CDN, Google Fonts & FontAwesome links
│   │   ├── main.ts                         # Angular bootstrap entry point
│   │   └── styles.css                      # Core design tokens & light/dark theme styles
│   ├── angular.json
│   ├── package.json
│   ├── tsconfig.json
│   └── tsconfig.app.json
├── server/                                 # Express REST API Backend
│   ├── server.js                           # REST endpoints, JWT auth, QR generator, Gemini AI & in-memory DB
│   └── package.json
├── ANGULAR_PROJECT_PROMPT.md               # Architecture & specification reference
├── .gitignore
└── README.md
```

---

## 📜 License & Governance

Copyright © 2026 **University Assessment & Mastery Portal (UAMP)**. All rights reserved.
