import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Division {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface DivisionsState {
  divisions: Division[];
  loading: boolean;
  error: string | null;
}

const initialState: DivisionsState = {
  divisions: [],
  loading: false,
  error: null,
};

const divisionsSlice = createSlice({
  name: 'divisions',
  initialState,
  reducers: {
    setDivisionsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    setDivisionsSuccess: (state, action: PayloadAction<Division[]>) => {
      state.divisions = action.payload;
      state.loading = false;
    },
    setDivisionsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { setDivisionsStart, setDivisionsSuccess, setDivisionsFailure } = divisionsSlice.actions;
export default divisionsSlice.reducer;
