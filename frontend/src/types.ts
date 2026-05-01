/**
 * Base interfaces for MongoDB models
 */

export interface User {
  _id: string;
  name: string;
  email: string;
  role: ("super admin" | "admin" | "instructor" | "student")[];
  status: "active" | "suspended" | "graduated";
  bootcamps: { bootcampId: string }[];
  isEmailVerified: boolean;
  divisionId?: string | Division;
}

export interface Division {
  _id: string;
  name: string;
  description: string;
  createdBy: string | User;
}

export interface Bootcamp {
  _id: string;
  name: string;
  divisionId: string | Division;
  startDate: string;
  endDate: string;
  createdBy: string | User;
  instructors: (string | User)[];
  status: "upcoming" | "active" | "completed";
}

export interface Session {
  _id: string;
  title: string;
  description?: string;
  bootcamp: string | Bootcamp;
  instructor?: string | User;
  location?: string;
  onlineLink?: string;
  startTime: string; // ISO datetime
  endTime: string;   // ISO datetime — duration must be >= 30 min
  status: "scheduled" | "cancelled" | "completed";
}

export interface Attendance {
  _id: string;
  userId: string | User;
  sessionId: string | Session;
  bootcampId: string | Bootcamp;
  status: "present" | "absent" | "late";
  markedBy: string | User;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  bootcampId: string | Bootcamp;
  sessionId?: string | Session;
  dueDate: string;
  maxScore: number;
  createdBy: string | User;
}

export interface Submission {
  _id: string;
  taskId: string | Task;
  studentId: string | User;
  content?: string;
  fileUrl?: string;
  submittedAt: string;
  status: "submitted" | "late" | "graded";
  score?: number;
  feedback?: string;
  gradedBy?: string | User;
}

export interface Group {
  _id: string;
  name: string;
  bootcampId: string | Bootcamp;
  members: (string | User)[];
  mentor?: string | User;
  createdBy: string | User;
}

export interface Enrollment {
  _id: string;
  userId: string | User;
  bootcampId: string | Bootcamp;
  status: "active" | "completed" | "dropped";
  enrolledAt: string;
}

export interface Feedback {
  _id: string;
  studentId: string | User;
  bootcampId?: string;
  sessionId?: string;
  instructorId?: string;
  rating: number; // 1–5
  comment?: string;
  isAnonymous: boolean;
}

export interface Notification {
  _id: string;
  type: "session_created" | "session_cancelled" | "task_reminder" | "submission_graded" | "weekly_progress_alert";
  title: string;
  message: string;
  recipient: string | User;
  is_read: boolean;
  related_id?: string;
  channels: { inApp: boolean; email: boolean };
  metadata?: { sessionId?: string; taskId?: string; submissionId?: string };
  createdAt: string;
}

export interface Resource {
  _id: string;
  title: string;
  description?: string;
  type: "document" | "link" | "other";
  url?: string;
  fileUrl?: string;
  bootcampId: string | Bootcamp;
  sessionId?: string | Session;
  createdBy: string | User;
}

export interface ProgressReport {
  attendanceRate: number;     // 0–100
  taskCompletionRate: number; // 0–100
  avgScore: number;           // 0–100
  overallProgress: number;    // weighted: attendance*0.3 + tasks*0.4 + score*0.3
}

export interface WeeklyProgress {
  _id: string;
  groupId: string | Group;
  bootcampId: string | Bootcamp;
  title: string;
  description: string; // >= 50 characters
  fileUrl?: string;
  link?: string;
  submittedAt: string;
  weekNumber: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
