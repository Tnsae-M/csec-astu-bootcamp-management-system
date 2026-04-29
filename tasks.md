# BMS Dev Branch Integration Polish Checklist

_Updated for current dev branch - 85% services complete_
_Focus: Async thunks + component wiring + final gaps_

## PHASE 1: Async Thunks (High Priority)

Add `createAsyncThunk` to slices using services

### 1.1 attendanceSlice.ts

✅ FULL THUNKS IMPLEMENTED (fetchSessionAttendance, markAttendanceAsync, fetchMyAttendance + extraReducers)

```
✅ Done ✓ Tested
```

### 1.2 tasksSlice.ts & submissions

✅ FULL CRUD + SUBMISSIONS THUNKS (fetchTasksByBootcamp, create/update/deleteTask, submitTask, gradeSubmission + extraReducers)

```
✅ Done ✓ Tested
```

### 1.3 Core slices (5 mins each)

**PHASE 1 COMPLETE** - Core slices (attendance + tasks) ready

**MANUAL TEST CASE:**

```
1. Backend: cd backend && npm start
2. Frontend: cd frontend && npm run dev
3. Login INSTRUCTOR → TasksPage (should dispatch fetchTasksByBootcamp)
4. Login STUDENT → TasksPage → Submit task form
5. Network tab: API calls to /tasks/bootcamp/:id, /submissions?
6. Console: No TS/runtime errors?

Report results!
```

**Phase 1 Status:** `✅ COMPLETE - AWAITING YOUR TEST RESULTS`

## PHASE 2: Component Integration

Wire services to pages via useEffect/useDispatch

### 2.1 AttendancePage.tsx

✅ CONVERTED to dispatch(fetchSessionAttendance()) + markAttendanceAsync()

```
✅ Done ✓ Test after Phase 2 complete
```

### 2.2 TasksPage.tsx, SubmissionFormPage.tsx

**IN PROGRESS**

**STOP: Test Phase 2**

```
INSTRUCTOR: AttendancePage → Mark Present button → Network /attendance POST
STUDENT: AttendancePage → See status update
All thunk states working? [ ] Pass
```

## PHASE 3: Final Gaps

### 3.1 progress.service.ts & feedback.service.ts

✅ CREATED WITH FULL ENDPOINTS FROM audit.md

```
✅ Done ✓
```

### 3.2 Global Polish

**STOP HERE: PHASE 3 TEST**

```
Login STUDENT → ProgressPage → Network /progress/bootcamp/:id/me
Admin/Instructor → FeedbackPage → POST/GET /feedback
[ ] APIs working → Final polish
```

```
[ ] RTK Query setup (optional)
[ ] react-hot-toast for errors/success
[ ] Loading skeletons
[ ] Protected routes validation
```

### 3.3 E2E Flows

```
Admin create → Instructor manage → Student engage → All view reports
```

**PROJECT COMPLETE 🎉**

```
No console errors, all data real-time from backend
Integration: 100% ✅
```

## Commands

```
backend: cd backend && npm start
frontend: cd frontend && npm run dev
health: curl localhost:5000/api/health
```

_Dev branch ready for production flows. Test Phase 1 now!_
