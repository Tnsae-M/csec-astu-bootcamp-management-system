import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { taskService, submissionService } from '../services/all_others.service';
import { Task, Submission } from '../types';

interface TaskState {
  tasks: Task[];
  submissions: Submission[];
  selectedSubmissions: Submission[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  submissions: [],
  selectedSubmissions: [],
  loading: false,
  error: null,
};

export const fetchBootcampTasks = createAsyncThunk(
  'tasks/fetchByBootcamp',
  async (bootcampId: string, { rejectWithValue }) => {
    try {
      const data = await taskService.getBootcampTasks(bootcampId);
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tasks');
    }
  }
);

export const fetchMySubmissions = createAsyncThunk(
  'tasks/fetchMySubmissions',
  async (_, { rejectWithValue }) => {
    try {
      const data = await submissionService.getMySubmissions();
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch submissions');
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBootcampTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
      })
      .addCase(fetchMySubmissions.fulfilled, (state, action) => {
        state.submissions = action.payload;
      });
  },
});

export default taskSlice.reducer;
