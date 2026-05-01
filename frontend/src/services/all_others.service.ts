import api from '../api/axios';
import { ApiResponse, Session, Attendance, Task, Submission, Group, Enrollment, Feedback, Resource, ProgressReport, WeeklyProgress } from '../types';

export const sessionService = {
  getSessions: async () => {
    const res = await api.get<ApiResponse<Session[]>>('/sessions');
    return res.data;
  },
  getBootcampSessions: async (bootcampId: string) => {
    const res = await api.get<ApiResponse<Session[]>>(`/sessions/bootcamp/${bootcampId}`);
    return res.data;
  },
  createSession: async (data: any) => {
    const res = await api.post<ApiResponse<Session>>('/sessions', data);
    return res.data;
  },
  updateSession: async (id: string, data: any) => {
    const res = await api.put<ApiResponse<Session>>(`/sessions/${id}`, data);
    return res.data;
  },
  deleteSession: async (id: string) => {
    const res = await api.delete<ApiResponse<null>>(`/sessions/${id}`);
    return res.data;
  }
};

export const attendanceService = {
  getSessionAttendance: async (sessionId: string) => {
    const res = await api.get<ApiResponse<Attendance[]>>(`/attendance/session/${sessionId}`);
    return res.data;
  },
  markAttendance: async (data: any) => {
    const res = await api.post<ApiResponse<Attendance>>('/attendance', data);
    return res.data;
  },
  getMyAttendance: async () => {
    const res = await api.get<ApiResponse<Attendance[]>>('/attendance/me');
    return res.data;
  }
};

export const taskService = {
  getBootcampTasks: async (bootcampId: string) => {
    const res = await api.get<ApiResponse<Task[]>>(`/tasks/bootcamp/${bootcampId}`);
    return res.data;
  },
  getTask: async (id: string) => {
    const res = await api.get<ApiResponse<Task>>(`/tasks/${id}`);
    return res.data;
  },
  createTask: async (data: any) => {
    const res = await api.post<ApiResponse<Task>>('/tasks', data);
    return res.data;
  },
  updateTask: async (id: string, data: any) => {
    const res = await api.put<ApiResponse<Task>>(`/tasks/${id}`, data);
    return res.data;
  }
};

export const submissionService = {
  submitTask: async (data: any) => {
    const res = await api.post<ApiResponse<Submission>>('/submissions', data);
    return res.data;
  },
  getMySubmissions: async () => {
    const res = await api.get<ApiResponse<Submission[]>>('/submissions/me');
    return res.data;
  },
  getTaskSubmissions: async (taskId: string) => {
    const res = await api.get<ApiResponse<Submission[]>>(`/submissions/task/${taskId}`);
    return res.data;
  },
  gradeSubmission: async (id: string, data: any) => {
    const res = await api.put<ApiResponse<Submission>>(`/submissions/${id}/grade`, data);
    return res.data;
  }
};

export const groupService = {
  getBootcampGroups: async (bootcampId: string) => {
    const res = await api.get<ApiResponse<Group[]>>(`/groups/bootcamp/${bootcampId}`);
    return res.data;
  },
  createGroup: async (data: any) => {
    const res = await api.post<ApiResponse<Group>>('/groups', data);
    return res.data;
  },
  addMember: async (groupId: string, userId: string) => {
    const res = await api.put<ApiResponse<Group>>(`/groups/${groupId}/add`, { userId });
    return res.data;
  },
  removeMember: async (groupId: string, userId: string) => {
    const res = await api.put<ApiResponse<Group>>(`/groups/${groupId}/remove/${userId}`);
    return res.data;
  },
  updateGroup: async (groupId: string, data: any) => {
    const res = await api.put<ApiResponse<Group>>(`/groups/${groupId}`, data);
    return res.data;
  },
  deleteGroup: async (groupId: string) => {
    const res = await api.delete<ApiResponse<null>>(`/groups/${groupId}`);
    return res.data;
  }
};

export const enrollmentService = {
  getBootcampRoster: async (bootcampId: string) => {
    const res = await api.get<ApiResponse<Enrollment[]>>(`/enrollments/bootcamp/${bootcampId}`);
    return res.data;
  },
  enrollUser: async (data: any) => {
    const res = await api.post<ApiResponse<Enrollment>>('/enrollments', data);
    return res.data;
  },
  getMyEnrollments: async () => {
    const res = await api.get<ApiResponse<Enrollment[]>>('/enrollments/me');
    return res.data;
  }
};

export const feedbackService = {
  submitFeedback: async (data: any) => {
    const res = await api.post<ApiResponse<Feedback>>('/feedback', data);
    return res.data;
  },
  getBootcampFeedback: async (id: string) => {
    const res = await api.get<ApiResponse<Feedback[]>>(`/feedback/bootcamp/${id}`);
    return res.data;
  },
  getSessionFeedback: async (sessionId: string) => {
    const res = await api.get<ApiResponse<Feedback[]>>(`/feedback/session/${sessionId}`);
    return res.data;
  }
};

export const progressService = {
  getMyProgress: async (bootcampId: string) => {
    const res = await api.get<ApiResponse<ProgressReport>>(`/progress/${bootcampId}/me`);
    return res.data;
  },
  getWeeklyProgress: async (bootcampId: string) => {
    const res = await api.get<ApiResponse<WeeklyProgress[]>>(`/progress/bootcamp/${bootcampId}`);
    return res.data;
  },
  submitWeeklyProgress: async (data: any) => {
    const res = await api.post<ApiResponse<WeeklyProgress>>('/progress', data);
    return res.data;
  }
};

export const reportService = {
  getReports: async () => {
    const res = await api.get<any>('/reports');
    return res.data;
  }
};

export const resourceService = {
  getResources: async (bootcampId: string) => {
    const res = await api.get<ApiResponse<Resource[]>>(`/resources?bootcampId=${bootcampId}`);
    return res.data;
  },
  uploadResource: async (data: any) => {
    const res = await api.post<ApiResponse<Resource>>('/resources', data);
    return res.data;
  },
  deleteResource: async (id: string) => {
    const res = await api.delete<ApiResponse<null>>(`/resources/${id}`);
    return res.data;
  }
};
