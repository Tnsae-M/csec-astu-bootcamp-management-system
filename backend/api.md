# API Request Reference

Base URL: `/api`

This document lists available endpoints, expected request bodies, path/query params, auth requirements and brief response shapes.

---

## Auth

- POST `/api/auth/register`
  - Auth: none
  - Body (JSON):
    - `name` (string, required)
    - `email` (string, required)
    - `password` (string, required)
    - `role` (string, optional) — one of `admin`, `instructor`, `student` (defaults to `student`)
  - Response: 201 created, { message, data: user }

- POST `/api/auth/login`
  - Auth: none
  - Body (JSON):
    - `email` (string, required)
    - `password` (string, required)
  - Notes: login endpoint is rate-limited (`authRateLimiter('login')`)
  - Response: 200 OK, { message, data: { accessToken?, refreshToken?, user } }

- POST `/api/auth/refresh`
  - Auth: none
  - Body (JSON):
    - `refreshToken` (string, required)
  - Response: 200 OK, { message, data: { accessToken, refreshToken } }

- GET `/api/auth/me`
  - Auth: required (`authGuard`)
  - Response: 200 OK, { message, data: currentUser }

---

## Users

- POST `/api/users`
  - Auth: intended Private (admin). Route currently has no guard in `user.routes.js` but controller assumes admin access.
  - Body (JSON): matches `User` model:
    - `name` (string, required)
    - `email` (string, required, unique)
    - `password` (string, required)
    - `role` (string, optional) — `admin` | `instructor` | `student`
    - `status` (string, optional) — `active` | `suspended` | `graduated`
    - `bootcamps` (array of objects) — items with `bootcampId` (ObjectId)
  - Response: 201 created, { success, message, data: user (password excluded) }

- GET `/api/users`
  - Auth: intended Private (admin)
  - Query params:
    - `role` (optional) — filter by role
    - `status` (optional) — filter by status
  - Response: 200 OK, { success, count, data: [users] }

- GET `/api/users/:id`
  - Auth: intended Private (admin)
  - Path params: `id` (user id)
  - Response: 200 OK, { success, data: user }

- PUT `/api/users/:id`
  - Auth: intended Private (admin)
  - Body (JSON): any updatable user fields except `password` (the service strips password updates)
  - Response: 200 OK, { success, message, data: updatedUser }

---

## Divisions

- POST `/api/divisions`
  - Auth: `roleGuard('admin')` required
  - Body (JSON):
    - `name` (string, required)
    - `description` (string, optional)
  - Response: 201 created, { success, message, data: division }

- GET `/api/divisions`
  - Auth: `authGuard` required
  - Query params:
    - `name` (string, optional) — simple name filter
  - Response: 200 OK, { success, message, data: [divisions] }

- GET `/api/divisions/:id`
  - Auth: `authGuard` required
  - Response: 200 OK, { success, message, data: division }

- PUT `/api/divisions/:id`
  - Auth: `roleGuard('admin')`
  - Body (JSON): only `name` and/or `description` are accepted (validator enforces this)
  - Response: 200 OK, { success, message, data: division }

- DELETE `/api/divisions/:id`
  - Auth: `roleGuard('admin')`
  - Response: 200 OK, { success, message, data }

- GET `/api/divisions/:divisionId/bootcamps`
  - Auth: `authGuard` required
  - Returns bootcamps under a division.

- POST `/api/divisions/:divisionId/bootcamps`
  - Auth: `authGuard` + `roleGuard('admin')`
  - Body (JSON): forwarded to bootcamp creation; see Bootcamps section

---

## Bootcamps

- POST `/api/divisions/:divisionId/bootcamps`
  - Auth: `authGuard` + `roleGuard('admin')`
  - Body (JSON):
    - `name` (string, required)
    - `startDate` (ISO date string, required)
    - `endDate` (ISO date string, required)
    - optional additional fields: `instructors` (array of user ids), `status` (`upcoming` | `active` | `completed`)
  - Path param: `divisionId` (id of parent Division)
  - Response: 201 created, { success, message, data: bootcamp }

- GET `/api/bootcamps/:id`
  - Auth: `authGuard` required
  - Response: 200 OK, { success, message, data: bootcamp }

- PUT `/api/bootcamps/:id`
  - Auth: `authGuard` + `roleGuard('admin')`
  - Body: any bootcamp fields allowed by model (name, startDate, endDate, instructors, status)
  - Response: 200 OK, { success, message, data: bootcamp }

- DELETE `/api/bootcamps/:id`
  - Auth: `authGuard` + `roleGuard('admin')`
  - Response: 200 OK, { success, message, data }

---

## Sessions

- POST `/api/sessions`
  - Auth: `authGuard` + `roleGuard(['admin','instructor'])`
  - Body (JSON): (matches `Session` model)
    - `title` (string, required)
    - `description` (string, optional)
    - `bootcamp` (ObjectId, required) — bootcamp id
    - `instructor` (ObjectId, optional)
    - `location` (string) OR `onlineLink` (string) — at least one required
    - `startTime` (ISO date string, required)
    - `endTime` (ISO date string, required) — duration must be >= 30 minutes
    - `status` (string, optional) — `scheduled` | `cancelled` | `completed`
  - Response: 201 created, { success, message, data: session }

- GET `/api/sessions`
  - Auth: `authGuard` required
  - Response: 200 OK, { success, data: [sessions] }

- GET `/api/sessions/bootcamp/:bootcampId`
  - Auth: `authGuard` required
  - Response: 200 OK, { success, data: [sessions] }

- PUT `/api/sessions/:id`
  - Auth: `authGuard` + `roleGuard(['admin','instructor'])`
  - Body: updateable session fields (same shape as create)
  - Response: 200 OK, { success, data: session }

- DELETE `/api/sessions/:id`
  - Auth: `authGuard` + `roleGuard('admin')`
  - Response: 200 OK, { success, message }

---

## Attendance

- POST `/api/attendance`
  - Auth: `authGuard` + `roleGuard(['admin','instructor'])`
  - Body (JSON):
    - `userId` (ObjectId, required)
    - `sessionId` (ObjectId, required)
    - `bootcampId` (ObjectId, required)
    - `status` (string, optional) — `present` | `absent` | `late` (defaults to `present`)
  - Server will add `markedBy` from authenticated user.
  - Response: 201 created, { success, message, data: attendance }

- GET `/api/attendance/session/:sessionId`
  - Auth: `authGuard` required
  - Path param: `sessionId`
  - Response: 200 OK, { success, data: [attendance records] }

- GET `/api/attendance/me`
  - Auth: `authGuard` required
  - Response: 200 OK, { success, data: [attendance records for current user] }

---

## Enrollments

- POST `/api/enrollments`
  - Auth: `authGuard` + `roleGuard(['admin','instructor'])`
  - Action: Admin/instructor enrolls a user in a bootcamp.

- GET `/api/enrollments/bootcamp/:id`
  - Auth: `authGuard` + `roleGuard(['admin','instructor'])`
  - Action: Get all target bootcamp enrollments (students).

- GET `/api/enrollments/me`
  - Auth: `authGuard`
  - Action: Student sees their own enrollments.

- PUT `/api/enrollments/:id`
  - Auth: `authGuard` + `roleGuard('admin')`
  - Action: Update student enrollment status.

---

## Tasks

- POST `/api/tasks`
  - Auth: `authGuard` + `roleGuard(['admin','instructor'])`
  - Action: Create a task.

- GET `/api/tasks/bootcamp/:bootcampId`
  - Auth: `authGuard`
  - Action: Get tasks for a specific bootcamp (requires student to be enrolled).

- GET `/api/tasks/:id`
  - Auth: `authGuard`
  - Action: Get single task details.

- PUT `/api/tasks/:id`
  - Auth: `authGuard` + `roleGuard(['admin','instructor'])`
  - Action: Update task details.

- DELETE `/api/tasks/:id`
  - Auth: `authGuard` + `roleGuard('admin')`
  - Action: Delete a task.

---

## Submissions

- POST `/api/submissions`
  - Auth: `authGuard` + `roleGuard('student')`
  - Action: Student submits a task.

- GET `/api/submissions/me`
  - Auth: `authGuard` + `roleGuard('student')`
  - Action: Student views own task submissions.

- GET `/api/submissions/task/:taskId`
  - Auth: `authGuard` + `roleGuard(['admin','instructor'])`
  - Action: Instructor views all submissions for a specific task.

- PUT `/api/submissions/:id/grade`
  - Auth: `authGuard` + `roleGuard(['admin','instructor'])`
  - Action: Instructor grades a submission.

---

## Progress

- GET `/api/progress/:bootcampId/me`
  - Auth: `authGuard`
  - Action: View user progress for a specific bootcamp.

---

## Feedback

- POST `/api/feedback`
  - Auth: `authGuard` + `roleGuard('student')`
  - Action: Student submits feedback.

- GET `/api/feedback/bootcamp/:id`
  - Auth: `authGuard` + `roleGuard(['admin','instructor'])`
  - Action: View bootcamp feedback.

- GET `/api/feedback/instructor/:id`
  - Auth: `authGuard` + `roleGuard(['admin','instructor'])`
  - Action: View instructor feedback.

---

## Groups

- POST `/api/groups`
  - Auth: `authGuard` + `roleGuard(['admin','instructor'])`
  - Action: Create a new group.

- GET `/api/groups/bootcamp/:bootcampId`
  - Auth: `authGuard`
  - Action: Get all groups within a bootcamp.

- PUT `/api/groups/:id/add`
  - Auth: `authGuard` + `roleGuard(['admin','instructor'])`
  - Action: Add a member to the group.

- PUT `/api/groups/:id/remove/:userId`
  - Auth: `authGuard` + `roleGuard(['admin','instructor'])`
  - Action: Remove a member from the group.

- DELETE `/api/groups/:id`
  - Auth: `authGuard` + `roleGuard('admin')`
  - Action: Delete a group.

---

## Health

- GET `/api/health`
  - Auth: none
  - Response: 200 OK, `{ message: "API is running" }`

---

## Common Notes

- All routes are mounted under `/api` (see `backend/src/app.js`).
- Authentication middleware: `authGuard` protects routes and exposes `req.user.userId`.
- Role-based access: `roleGuard(...)` used to restrict admin/instructor operations.
- Validation: certain validators (e.g., `division.validator.js`, session model pre-save) enforce business rules — clients should respect these constraints.
- Responses generally follow `{ success?, message?, data? }` pattern.
