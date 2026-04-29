# BMS Frontend Integration Checklist

_Based on audit.md - Step-by-step guide to complete API integrations_
_Track progress by checking ✅ as you complete steps_
_After each PHASE, STOP and test manually before proceeding_

## PHASE 1: High Priority - Core Student/Instructor Flows

### Focus: Attendance, Tasks, Submissions (Student workflow critical path)

#### 1.1 Create attendance.service.ts

\`\`\`
frontend/src/services/attendance.service.ts
\`\`\`

- Add methods: \`markAttendance(sessionId, status)\`, \`getSessionAttendance(sessionId)\`, \`getMyAttendance()\`
- Use endpoints from backend/api.md
  \`\`\`
  ✅ Done
  \`\`\`

#### 1.2 Update attendanceSlice.ts with async thunks

- Replace mock data with \`createAsyncThunk\` for fetch/mark
  \`\`\`
  ✅ Done
  \`\`\`

**STOP HERE: PHASE 1 TEST**
\`\`\`
cd frontend && npm run dev
Backend running? Login as instructor/student → Navigate to AttendancePage →
Check Network tab: API calls to /attendance? Verify CRUD works.
Paste any errors here: ****\_\_****
[ ] Pass → Proceed to Phase 2
\`\`\`

#### 1.3 Create tasks.service.ts

\`\`\`
frontend/src/services/tasks.service.ts
\`\`\`

- Full CRUD: \`getTasksByBootcamp(bootcampId)\`, \`createTask\`, etc.
  \`\`\`
  ✅ Done
  \`\`\`

#### 1.4 Create submissions.service.ts

\`\`\`
frontend/src/services/submissions.service.ts
\`\`\`

- \`submitTask(taskId, content)\`, \`getMySubmissions()\`, \`getTaskSubmissions(taskId)\`, \`gradeSubmission(id, grade)\`
  \`\`\`
  ✅ Done
  \`\`\`

#### 1.5 Update tasksSlice.ts & submissions slices (if exists)

- Add async thunks calling new services
  \`\`\`
  ✅ Done
  \`\`\`

**STOP HERE: PHASE 1 COMPLETE TEST**
\`\`\`
Test TasksPage/SubmissionFormPage/SubmissionsPage across roles
Student: Submit task → Instructor: View/grade
[ ] All APIs hit backend successfully
Paste issues: ****\_\_****
[ ] Pass → Phase 2
\`\`\`

## PHASE 2: Medium Priority - Feedback & Progress

### Focus: Sessions completion + user feedback loops

#### 2.1 Complete sessions.service.ts

- Add \`updateSession(id)\`, \`deleteSession(id)\` for full CRUD
  \`\`\`
  ✅ Done
  \`\`\`

#### 2.2 Create feedback.service.ts

\`\`\`
frontend/src/services/feedback.service.ts
\`\`\`

- \`submitFeedback(bootcampId/instructorId)\`, \`getBootcampFeedback(bootcampId)\`
  \`\`\`
  ✅ Done
  \`\`\`

#### 2.3 Create progress.service.ts

\`\`\`
frontend/src/services/progress.service.ts
\`\`\`

- \`getMyProgress(bootcampId)\`
  \`\`\`
  ✅ Done
  \`\`\`

#### 2.4 Create groups.service.ts

\`\`\`
frontend/src/services/groups.service.ts
\`\`\`

- Bootcamp-level: \`getGroups(bootcampId)\`, \`createGroup\`, \`addMember(groupId, userId)\`
  \`\`\`
  ✅ Done
  \`\`\`

#### 2.5 Update respective slices with async thunks

\`\`\`
✅ Done for sessions/feedback/progress/groups
\`\`\`

**STOP HERE: PHASE 2 TEST**
\`\`\`
Test FeedbackPage, ProgressPage, GroupsPage, full Sessions CRUD
Verify role restrictions work (student can't delete groups, etc.)
Network tab clean? No 404s?
[ ] Pass → Phase 3
\`\`\`

## PHASE 3: Low Priority - Completion

### Polish & Edge Cases

#### 3.1 Create enrollments.service.ts

\`\`\`
✅ enrollSlice + service
\`\`\`

#### 3.2 Create notifications.service.ts (if backend ready)

\`\`\`
✅ notificationSlice integration
\`\`\`

#### 3.3 Global improvements

\`\`\`
[ ] Add RTK Query or global error handling
[ ] Toast notifications for all async actions  
[ ] Loading spinners in pages
[ ] Backend error → user-friendly messages
\`\`\`

#### 3.4 Full E2E Test

\`\`\`
Admin: Create division/bootcamp/session/task → Instructor: Mark attendance →
Student: Submit task/feedback → All roles: View progress
\`\`\`

**STOP: PROJECT COMPLETE 🎉**
\`\`\`
Run full app → No mocks → All data from backend
Share final Network tab screenshot or issues.
Integration 100% ✅
\`\`\`

## Quick Commands

\`\`\`

# Backend

cd backend && npm start

# Frontend

cd frontend && npm run dev

# Verify health

curl http://localhost:5000/api/health # Backend
\`\`\`

_Copy-paste test results after each STOP. I'll help debug._
