import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Task {
  _id: string;
  id?: string;
  title: string;
  description: string;
  deadline: string;
  division: string;
  instructor: string;
}

export interface Submission {
  _id: string;
  id?: string;
  taskId: string;
  studentId: string;
  fileUrl?: string;
  githubUrl: string;
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
      state.loading = false;
      state.tasks = action.payload;
    },
    setTasksFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setSubmissions: (state, action: PayloadAction<Submission[]>) => {
      state.submissions = action.payload;
    },
    addSubmission: (state, action: PayloadAction<Submission>) => {
      state.submissions.push(action.payload);
    }
  },
});

export const { setTasksStart, setTasksSuccess, setTasksFailure, setSubmissions, addSubmission } = taskSlice.actions;
export default taskSlice.reducer;
