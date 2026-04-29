import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { feedbackService } from '../../services/feedback.service';

export interface Feedback {
  _id: string;
  id?: string;
  user?: any;
  message: string;
  comment?: string;
  studentName?: string;
  rating: number;
  createdAt: string;
  timestamp?: string;
  sessionId?: string;
}

interface FeedbackState {
  feedbacks: Feedback[];
  loading: boolean;
  error: string | null;
}

const initialState: FeedbackState = {
  feedbacks: [],
  loading: false,
  error: null,
};

// ===== THUNKS =====

export const fetchSessionFeedback = createAsyncThunk(
  'feedback/fetchBySession',
  async (sessionId: string, { rejectWithValue }) => {
    try {
      const response = await feedbackService.getFeedbacksBySession(sessionId);
      return response.data || response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch feedback');
    }
  }
);

export const fetchBootcampFeedback = createAsyncThunk(
  'feedback/fetchByBootcamp',
  async (bootcampId: string, { rejectWithValue }) => {
    try {
      const response = await feedbackService.getBootcampFeedback(bootcampId);
      return response.data || response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch feedback');
    }
  }
);

export const fetchInstructorFeedback = createAsyncThunk(
  'feedback/fetchByInstructor',
  async (instructorId: string, { rejectWithValue }) => {
    try {
      const response = await feedbackService.getInstructorFeedback(instructorId);
      return response.data || response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch feedback');
    }
  }
);

export const submitFeedbackAsync = createAsyncThunk(
  'feedback/submit',
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await feedbackService.submitFeedback(data);
      return response.data || response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit feedback');
    }
  }
);

const feedbackSlice = createSlice({
  name: 'feedback',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSessionFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSessionFeedback.fulfilled, (state, action) => {
        state.loading = false;
        state.feedbacks = action.payload;
      })
      .addCase(fetchSessionFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchBootcampFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBootcampFeedback.fulfilled, (state, action) => {
        state.loading = false;
        state.feedbacks = action.payload;
      })
      .addCase(fetchBootcampFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchInstructorFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInstructorFeedback.fulfilled, (state, action) => {
        state.loading = false;
        state.feedbacks = action.payload;
      })
      .addCase(fetchInstructorFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(submitFeedbackAsync.fulfilled, (state, action) => {
        state.feedbacks.push(action.payload);
      });
  },
});


export default feedbackSlice.reducer;

