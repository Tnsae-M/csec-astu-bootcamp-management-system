import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { tasksService } from "../../services/tasks.service";
import { submissionsService } from "../../services/submissions.service";

export interface Task {
  _id: string;
  id?: string;
  title: string;
  description?: string;
  bootcampId: string | any;
  sessionId?: string | any;
  dueDate: string;
  maxScore: number;
  createdBy: string | any;
}

export interface Submission {
  _id: string;
  id?: string;
  taskId: string | any;
  studentId: string | any;
  fileUrl?: string;
  githubUrl?: string;
  status: "PENDING" | "GRADED" | "RETURNED";
  grade?: number;
  feedback?: string;
}

interface TaskState {
  tasks: Task[];
  submissions: Submission[];
  loading: boolean;
  error: string | null;
  currentTask?: Task;
  selectedSubmissions: Submission[];
}

const initialState: TaskState = {
  tasks: [],
  submissions: [],
  loading: false,
  error: null,
  currentTask: undefined,
  selectedSubmissions: [],
};

// ===== TASKS THUNKS =====
export const fetchTasksByBootcamp = createAsyncThunk(
  "tasks/fetchByBootcamp",
  async (bootcampId: string) => {
    const response = await tasksService.getTasksByBootcamp(bootcampId);
    return response.data;
  },
);

export const fetchTaskById = createAsyncThunk(
  "tasks/fetchById",
  async (id: string) => {
    const response = await tasksService.getTaskById(id);
    return response.data;
  },
);

export const createTask = createAsyncThunk(
  "tasks/create",
  async (data: any) => {
    const response = await tasksService.createTask(data);
    return response.data;
  },
);

export const updateTask = createAsyncThunk(
  "tasks/update",
  async ({ id, data }: { id: string; data: any }) => {
    const response = await tasksService.updateTask(id, data);
    return response.data;
  },
);

export const deleteTask = createAsyncThunk(
  "tasks/delete",
  async (id: string) => {
    const response = await tasksService.deleteTask(id);
    return response.data.id;
  },
);

// ===== SUBMISSIONS THUNKS =====
export const fetchMySubmissions = createAsyncThunk(
  "tasks/fetchMySubmissions",
  async () => {
    const response = await submissionsService.getMySubmissions();
    return response.data;
  },
);

export const fetchSubmissionsByTask = createAsyncThunk(
  "tasks/fetchSubmissionsByTask",
  async (taskId: string) => {
    const response = await submissionsService.getSubmissionsByTask(taskId);
    return response.data;
  },
);

export const submitTask = createAsyncThunk(
  "tasks/submit",
  async (data: any) => {
    const response = await submissionsService.submitTask(data);
    return response.data;
  },
);

export const gradeSubmission = createAsyncThunk(
  "tasks/gradeSubmission",
  async ({ id, data }: { id: string; data: any }) => {
    const response = await submissionsService.gradeSubmission(id, data);
    return response.data;
  },
);

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setTasksStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    setTasksSuccess: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
      state.loading = false;
    },
    setTasksFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setSubmissions: (state, action: PayloadAction<Submission[]>) => {
      state.submissions = action.payload;
    },
    setSubmissionsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    setSubmissionsSuccess: (state, action: PayloadAction<Submission[]>) => {
      state.submissions = action.payload;
      state.loading = false;
    },
    setSubmissionsFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    addSubmission: (state, action: PayloadAction<Submission>) => {
      state.submissions.push(action.payload);
    },
    setCurrentTask: (state, action: PayloadAction<Task>) => {
      state.currentTask = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Tasks
      .addCase(fetchTasksByBootcamp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasksByBootcamp.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasksByBootcamp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch tasks";
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.currentTask = action.payload;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(
          (t) => t._id === action.payload._id,
        );
        if (index !== -1) state.tasks[index] = action.payload;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((t) => t._id !== action.payload);
      })
      // Submissions
      .addCase(fetchMySubmissions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMySubmissions.fulfilled, (state, action) => {
        state.loading = false;
        state.submissions = action.payload;
      })
      .addCase(fetchSubmissionsByTask.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedSubmissions = action.payload;
      })
      .addCase(submitTask.fulfilled, (state, action) => {
        state.submissions.push(action.payload);
      })
      .addCase(gradeSubmission.fulfilled, (state, action) => {
        const index = state.selectedSubmissions.findIndex(
          (s) => s._id === action.payload._id,
        );
        if (index !== -1) state.selectedSubmissions[index] = action.payload;
      });
  },
});

export const {
  setTasksStart,
  setTasksSuccess,
  setTasksFailure,
  setSubmissions,
  setSubmissionsStart,
  setSubmissionsSuccess,
  setSubmissionsFailure,
  addSubmission,
  setCurrentTask,
} = taskSlice.actions;
export default taskSlice.reducer;
