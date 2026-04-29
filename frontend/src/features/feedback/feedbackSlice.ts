import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Feedback {
  id: string;
  fromId: string;
  toId: string;
  message: string;
  rating: number;
  timestamp: string;
  sessionId?: string | number;
}

interface FeedbackState {
  feedbacks: Feedback[];
}

const initialState: FeedbackState = {
  feedbacks: [
    { id: '1', fromId: '1', toId: '3', message: 'Keep up the good work on React fundamentals.', rating: 5, timestamp: '2026-04-18T10:00:00Z', sessionId: '1' },
    { id: '2', fromId: '2', toId: '4', message: 'Focus more on networking layers.', rating: 4, timestamp: '2026-04-17T14:30:00Z', sessionId: '3' },
  ],
};

const feedbackSlice = createSlice({
  name: 'feedback',
  initialState,
  reducers: {
    addFeedback: (state, action: PayloadAction<Feedback>) => {
      state.feedbacks.push(action.payload);
    },
  },
});

export const { addFeedback } = feedbackSlice.actions;
export default feedbackSlice.reducer;
