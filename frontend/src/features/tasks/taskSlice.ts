import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string;
  division: string;
  instructor: string;
}

interface Submission {
  id: string;
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
}

const initialState: TaskState = {
  tasks: [
    { id: 'T1', title: 'Modular Backend Structure', description: 'Design a modular backend using Express', deadline: '2026-04-25', division: 'Software Development', instructor: 'Iman' },
    { id: 'T2', title: 'Feature Extraction Pipeline', description: 'Build a data pipeline for image processing', deadline: '2026-04-26', division: 'Data Science', instructor: 'Jerusalem' },
    { id: 'T3', title: 'Security Audit v1.4', description: 'Perform a penetration test on the mock server', deadline: '2026-04-27', division: 'Cybersecurity', instructor: 'Wogari' },
  ],
  submissions: [],
  loading: false,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
    setSubmissions: (state, action: PayloadAction<Submission[]>) => {
      state.submissions = action.payload;
    },
    addSubmission: (state, action: PayloadAction<Submission>) => {
      state.submissions.push(action.payload);
    }
  },
});

export const { setTasks, setSubmissions, addSubmission } = taskSlice.actions;
export default taskSlice.reducer;
