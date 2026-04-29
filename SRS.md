# Bootcamp Management System (BMS) – Software Requirements Specification (SRS)

---

## 📌 1. Introduction

### 1.1 Purpose

This document defines the requirements for the Bootcamp Management System (BMS), a unified platform to manage bootcamp operations including scheduling, attendance, tasks, projects, and feedback.

### 1.2 Scope

The system supports four divisions:

- Data Science
- Development
- CPD
- Cybersecurity

It provides role-based access for Admins, Instructors, and Students.

---

## 👥 2. User Roles & Permissions

### Admin

- Manage users and roles
- Create and manage divisions
- Assign and manage groups
- Override schedules and attendance
- Access reports and analytics

### Instructor

- Create and manage sessions
- Mark attendance
- Upload resources
- Create tasks and review submissions
- View feedback (aggregated)

### Student

- View sessions and resources
- Check-in attendance
- Submit tasks
- Rate sessions and give feedback
- Submit weekly group progress

---

## 🔐 3. Authentication & Security

- Login with email and password
- Password hashing using bcrypt
- JWT Authentication
    - Access Token: 24 hours
    - Refresh Token: 7 days
- Rate limiting: 5 failed attempts → 15 min lockout
- Password reset via email (1-hour expiry)

---

## 🏗️ 4. Core Modules

### 4.1 User Management

- Admin creates users (no self-registration)
- Assign users to one or more divisions
- User statuses: Active / Suspended / Graduated

### 4.2 Division Management

- View all divisions
- Track statistics:
    - Total students
    - Total sessions
    - Average attendance
    - Average rating

### 4.3 Session Management

- Create, edit, cancel sessions
- Fields:
    - Title, Description
    - Location / Online link
    - Start & End time
    - Division
- Constraints:
    - Minimum duration: 30 minutes
    - Cannot overlap within same division
    - Instructor cannot be double-booked

### 4.4 Attendance Management

- Status types:
    - Present
    - Absent
    - Late
    - Excused
- Rules:
    - One record per student per session
    - Editable within 24 hours
    - Late if >10 minutes

### 4.5 Resource Management

- Upload types:
    - PDF, Video, Image, ZIP
- External links supported
- Track downloads

### 4.6 Task Management

- Create assignments
- Submission types:
    - File
    - GitHub link
    - Both
- Deadline + scoring system

### 4.7 Submission System

- Students submit work
- Resubmission allowed (version tracking)
- Instructor grading:
    - Score
    - Feedback
    - Status (Graded / Returned)

### 4.8 Feedback System

- Students rate sessions (1–5)
- Optional comments
- Anonymous to instructors
- Time window: 48 hours after session

### 4.9 Group Management

- Group size: 2–8 students
- One group per division per student
- Admin assigns and manages groups

### 4.10 Weekly Progress Tracking

- One submission per group per week
- Includes:
    - Title
    - Description (≥50 characters)
    - Optional file/link

---

## ⚙️ 5. Business Rules

### Scheduling Rules

- No overlapping sessions in same division
- Instructor cannot be double-booked
- Sessions must be scheduled at least 1 hour in advance

### Attendance Rules

- Unique attendance per student/session
- Excused requires note

### Feedback Rules

- Only present/late students can submit
- One feedback per session per student

### Task Rules

- No submission after deadline (unless allowed)
- GitHub links must be valid

### Group Rules

- One group per division
- One progress submission per week

---

## 🔔 6. Notification System

- Session created → Students notified
- Session cancelled → Urgent notification
- Task deadlines → Reminders
- Submission graded → Student notified
- Weekly progress missing → Alert

Channels:

- In-app
- Email

---

## 🗄️ 7. Database Design

### Core Tables

- users
- divisions
- sessions
- attendance
- resources
- tasks
- submissions
- feedback
- groups
- progress
- announcements
- audit_log

---

## 🔌 8. API Structure

### Auth

- POST /auth/login
- POST /auth/refresh

### General

- GET /divisions
- GET /sessions

### Student

- Submit feedback
- Submit tasks
- Submit progress

### Instructor

- Manage sessions
- Mark attendance
- Review submissions

### Admin

- Manage users/groups
- Access reports

---

## ⚠️ 9. Error Handling

- 400 – Validation Error
- 401 – Unauthorized
- 403 – Forbidden
- 404 – Not Found
- 409 – Conflict
- 422 – Business Rule Violation
- 500 – Server Error

---

## 🚀 10. Non-Functional Requirements

### Performance

- ≤300ms read response
- ≤600ms write response

### Security

- TLS encryption
- Secure JWT handling
- Input validation

### Reliability

- 99.5% uptime
- Regular backups

### Scalability

- Stateless backend
- Cloud storage support

---

## 🛠️ 11. Recommended Tech Stack

- Backend: Node.js (Express)
- Frontend: React + TypeScript/Javascript
- Database: Mongodb
- Storage: CLoudinary
- Deployment: Netlify/vercel/Render

---

## 📎 12. Assumptions

- Users have internet access
- Email service is available
- Modern browsers supported