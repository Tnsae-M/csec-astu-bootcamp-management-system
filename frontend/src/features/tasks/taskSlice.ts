import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
  status: 'PENDING' | 'GRADED' | 'RETURNED';
  grade?: number;
  feedback?: string;
}

interface TaskState {
  tasks: Task[];
  submissions: Submission[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  submissions: [],
  loading: false,
  error: null,
};

const taskSlice = createSlice({
  name: 'tasks',
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
  },
});

export const { setTasksStart, setTasksSuccess, setTasksFailure, setSubmissions, setSubmissionsStart, setSubmissionsSuccess, setSubmissionsFailure, addSubmission } = taskSlice.actions;
export default taskSlice.reducer;
