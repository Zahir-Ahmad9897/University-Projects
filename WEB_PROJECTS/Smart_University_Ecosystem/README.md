<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/PHP-8-777BB4?style=for-the-badge&logo=php&logoColor=white" />
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
</p>

# 🎓 Smart University Ecosystem

### SE-301L Web Engineering Lab — Semester Project
**UET Mardan | Department of Computer Software Engineering**

> A full-stack web application that digitizes campus life — enabling students to discover events, earn participation points, and redeem rewards, while club representatives manage events and administrators oversee the entire ecosystem.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Database Design](#-database-design)
- [Quick Setup](#-quick-setup)
- [Demo Accounts](#-demo-accounts)
- [Project Structure](#-project-structure)
- [API Reference](#-api-reference)
- [Security & Validation](#-security--validation)
- [Tasks & Requirements Covered](#-tasks--requirements-covered)
- [Contributors](#-contributors)

---

## 🔍 Overview

Traditional university event management relies on scattered WhatsApp groups, manual attendance sheets, and word-of-mouth promotion — leading to poor student engagement and no data-driven insights.

**Smart University Ecosystem** solves this by providing a centralized, role-based web platform where:
- **Students** browse and register for events, track attendance, earn points, and redeem rewards.
- **Club Representatives** create and manage events, monitor registrations, and view analytics.
- **Administrators** have full oversight of all users, clubs, events, and system-wide statistics.

---

## ✨ Key Features

### 👨‍🎓 Student Module
| Feature | Description |
|---------|-------------|
| **Event Discovery** | Browse upcoming events filtered by category (Online / Physical / Hybrid) |
| **One-Click Registration** | Register for events with capacity validation and duplicate prevention |
| **Attendance Tracking** | View personal attendance history across all events |
| **Points & Rewards** | Earn points for attending events; redeem them for real rewards (meals, merchandise, vouchers) |
| **Personal Dashboard** | View registered events, total points, and upcoming schedule |

### 🏛️ Club Representative Module
| Feature | Description |
|---------|-------------|
| **Event Creation** | Create events with title, description, date/time, capacity, category, and point rewards |
| **Category Support** | Online (meeting link), Physical (location), Hybrid (both) |
| **Club Dashboard** | View all events created under the club with registration stats |

### 🔑 Admin Module
| Feature | Description |
|---------|-------------|
| **System Overview** | Dashboard with total users, clubs, events, and registrations |
| **User Management** | View and manage all registered users |
| **Club Management** | Oversee all university clubs and their representatives |
| **Event Oversight** | Monitor all events across the platform |

---

## 🏗️ Architecture

```
┌──────────────────────┐         ┌──────────────────────┐
│   REACT FRONTEND     │  HTTP   │    PHP BACKEND       │
│   (Vite Dev Server)  │ ──────► │    (REST API)        │
│   Port 5173          │  /api   │    Apache/XAMPP       │
│                      │ ◄────── │                      │
│  • React Router v6   │  JSON   │  • PDO (MySQL)       │
│  • Context API       │         │  • Session Auth      │
│  • Protected Routes  │         │  • Bcrypt Hashing    │
└──────────────────────┘         └──────────┬───────────┘
                                            │
                                   ┌────────▼────────┐
                                   │     MySQL       │
                                   │  smart_university│
                                   │                 │
                                   │  8 Tables       │
                                   │  FK Constraints │
                                   │  Sample Data    │
                                   └─────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + Vite | Component-based UI with hot module replacement |
| **Routing** | React Router v6 | Client-side routing with protected routes |
| **State Management** | Context API + useState | Global authentication state |
| **Styling** | Pure CSS (Custom) | Responsive design without framework overhead |
| **Backend** | PHP 8 (REST API) | Stateless API endpoints with JSON responses |
| **Database** | MySQL | Relational data with foreign key constraints |
| **DB Access** | PDO | Secure parameterized queries (prevents SQL injection) |
| **Authentication** | PHP Sessions + Bcrypt | Secure password hashing and session management |
| **Dev Proxy** | Vite Proxy | Forwards `/api` requests to PHP backend |

---

## 🗄️ Database Design

The system uses **8 normalized tables** with proper foreign key relationships:

```
┌─────────┐     ┌──────────────┐     ┌─────────┐
│  users  │────►│ club_members │◄────│  clubs  │
│         │     └──────────────┘     │         │
│  • id   │                          │  • id   │
│  • role │     ┌──────────────┐     │• rep_id │
│• points │────►│registrations │     └────┬────┘
└────┬────┘     └──────┬───────┘          │
     │                 │            ┌─────▼─────┐
     │          ┌──────▼───────┐    │  events   │
     │          │  attendance  │◄───│           │
     │          └──────────────┘    │• category │
     │                              │• capacity │
     │     ┌──────────────┐         └───────────┘
     └────►│ redemptions  │
           └──────┬───────┘
                  │
           ┌──────▼───────┐
           │   rewards    │
           └──────────────┘
```

### Tables Overview

| Table | Purpose | Key Constraints |
|-------|---------|-----------------|
| `users` | All accounts (students, club reps, admins) | `UNIQUE(email)`, role ENUM |
| `clubs` | University clubs/societies | `FK(rep_id) → users` |
| `club_members` | Many-to-many: students ↔ clubs | `UNIQUE(student_id, club_id)` |
| `events` | All events with category support | `FK(club_id) → clubs`, category ENUM |
| `registrations` | Event sign-ups | `UNIQUE(student_id, event_id)` — prevents duplicates |
| `attendance` | Confirmed attendance records | `UNIQUE(student_id, event_id)` |
| `rewards` | Redeemable items in the reward store | `points_required`, `stock` |
| `redemptions` | Reward redemption history | `FK(student_id)`, `FK(reward_id)` |

---

## 🚀 Quick Setup

### Prerequisites
- **XAMPP** (Apache + MySQL + PHP 8)
- **Node.js** (v18 or higher)

### Step 1: Database Setup
1. Start **Apache** and **MySQL** from the XAMPP Control Panel.
2. Open **phpMyAdmin** → [http://localhost/phpmyadmin](http://localhost/phpmyadmin)
3. Click **Import** → Choose `database/schema.sql` → Click **Go**
4. The database `smart_university` will be created with sample data automatically.

### Step 2: Backend (PHP API)
1. Copy the `backend/` folder to your XAMPP htdocs directory:
   ```
   C:\xampp\htdocs\smart-uni-backend\
   ```
2. The REST API will be accessible at: `http://localhost/smart-uni-backend/api/`

### Step 3: Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
3. Open your browser at: **http://localhost:5173**

> **Note:** The Vite proxy is configured to forward `/api` requests to `http://localhost:8000`. Update `vite.config.js` if your PHP server runs on a different port.

---

## 👤 Demo Accounts

| Role | Email | Password | Access Level |
|------|-------|----------|-------------|
| 🔑 Admin | `admin@uni.edu` | `password` | Full system access |
| 🏛️ Club Rep | `rep@uni.edu` | `password` | Event creation & club management |
| 👨‍🎓 Student | `ali@student.edu` | `password` | Event registration & rewards |
| 👩‍🎓 Student | `sara@student.edu` | `password` | Event registration & rewards |

---

## 📁 Project Structure

```
Smart_University_Ecosystem/
│
├── backend/
│   ├── config/
│   │   └── db.php                 # DB connection (PDO) + CORS headers + helpers
│   └── api/
│       ├── auth.php               # Login, Register, Logout, Session check
│       ├── events.php             # List events, Event detail, Create event
│       ├── registration.php       # Register for event, Mark attendance, History
│       └── rewards.php            # List rewards, Redeem points, Club/Student data
│
├── frontend/
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Global auth state via React Context API
│   │   ├── components/
│   │   │   └── Navbar.jsx         # Responsive navigation bar (role-aware)
│   │   ├── pages/
│   │   │   ├── Home.jsx           # Public landing page
│   │   │   ├── Login.jsx          # Login form with client-side validation
│   │   │   ├── Register.jsx       # Registration with role selection
│   │   │   ├── Dashboard.jsx      # Student dashboard (events + points)
│   │   │   ├── Events.jsx         # Event listing + registration
│   │   │   ├── Attendance.jsx     # Attendance history for students
│   │   │   ├── Rewards.jsx        # Reward store + redemption
│   │   │   ├── CreateEvent.jsx    # Event creation form (club reps)
│   │   │   ├── ClubDashboard.jsx  # Club rep management dashboard
│   │   │   └── Admin.jsx          # Admin panel (system overview)
│   │   ├── App.jsx                # Router config + ProtectedRoute component
│   │   ├── main.jsx               # React DOM entry point
│   │   └── index.css              # Global custom styles
│   ├── index.html                 # HTML entry point
│   ├── package.json               # NPM dependencies
│   └── vite.config.js             # Vite config with API proxy
│
├── database/
│   └── schema.sql                 # Full DB schema + sample seed data
│
└── README.md                      # This file
```

---

## 📡 API Reference

All endpoints accept and return **JSON**. Base URL: `/api/`

### Authentication (`auth.php`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `auth.php?action=register` | Create a new user account |
| POST | `auth.php?action=login` | Authenticate and start session |
| GET | `auth.php?action=me` | Get current logged-in user |
| POST | `auth.php?action=logout` | Destroy session |

### Events (`events.php`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `events.php?action=list` | Get all events |
| GET | `events.php?action=detail&id={id}` | Get event details |
| POST | `events.php?action=create` | Create new event (club_rep/admin) |

### Registrations (`registration.php`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `registration.php?action=register` | Register for an event |
| POST | `registration.php?action=attend` | Mark attendance |
| GET | `registration.php?action=history` | Get student's registration history |

### Rewards (`rewards.php`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `rewards.php?action=list` | Get all available rewards |
| POST | `rewards.php?action=redeem` | Redeem points for a reward |

---

## 🔒 Security & Validation

### Dual-Layer Validation Strategy

| Layer | Implementation | Purpose |
|-------|---------------|---------|
| **Client-Side (JS)** | Email format, password length ≥ 6, required fields, time validation | Instant user feedback |
| **Server-Side (PHP)** | Duplicate checks, capacity limits, time conflicts, weekly limits | Tamper-proof enforcement |

### Security Measures
- ✅ **Password Hashing**: Bcrypt via `password_hash()` / `password_verify()`
- ✅ **SQL Injection Prevention**: PDO prepared statements with parameterized queries
- ✅ **Session-Based Authentication**: Server-side session management with `requireAuth()` middleware
- ✅ **CORS Configuration**: Restricted to frontend origin (`localhost:5173`)
- ✅ **Input Sanitization**: `trim()` and `filter_var()` on all user inputs
- ✅ **Role-Based Access Control**: Protected routes on both frontend (React) and backend (PHP)

---

## ✅ Tasks & Requirements Covered

### Task 1: Database Design
- 8 normalized tables with proper **primary keys**, **foreign keys**, and **constraints**
- Many-to-many relationships handled via junction tables (`club_members`, `registrations`)
- ENUM types for roles and event categories

### Task 2: React Frontend Architecture
- Component hierarchy using **React Router v6** for SPA navigation
- **Context API** for global authentication state management
- **Protected routes** filtered by user role (`student` / `club_rep` / `admin`)
- Props and state for inter-component communication

### Task 3: Business Rules & Validation
- **Client-side (JS)**: Email format, password length, required fields, time validation
- **Server-side (PHP)**: Duplicate registration prevention, capacity checks, time conflict detection, weekly event limit (3/week)
- Both validation layers work independently — JS provides UX; PHP is the security gate

### Task 4: Event Categories
- Three categories supported: **Online**, **Physical**, **Hybrid**
- DB schema uses `category` ENUM with conditional columns (`meeting_link`, `location`)
- Forms dynamically show/hide fields based on selected category
- PHP validates category-specific required fields

### Task 5: Bug Fixes
| Bug | Root Cause | Fix Applied |
|-----|-----------|-------------|
| Duplicate registration | No uniqueness constraint | `UNIQUE KEY` on `(student_id, event_id)` + PHP pre-check |
| Event list not updating | State not refreshed | `fetchEvents()` called after successful registration |
| JS validation bypass | No server-side checks | All critical validation duplicated in PHP backend |

---

## 👨‍💻 Contributors

| Name | Role |
|------|------|
| **Zahir Ahmad** | Full-Stack Developer |

---

<p align="center">
  <b>UET Mardan — Department of Computer Software Engineering</b><br>
  SE-301L Web Engineering Lab | Semester Project
</p>
