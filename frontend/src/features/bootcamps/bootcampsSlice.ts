import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Bootcamp {
  _id: string;
  id?: string;
  name: string;
  description?: string;
  division: string | any;
  status: string;
  createdAt: string;
}

interface BootcampsState {
  bootcamps: Bootcamp[];
  loading: boolean;
  error: string | null;
}

const initialState: BootcampsState = {
  bootcamps: [],
  loading: false,
  error: null,
};

const bootcampsSlice = createSlice({
  name: 'bootcamps',
  initialState,
  reducers: {
    setBootcampsStart(state) {
      state.loading = true;
      state.error = null;
    },
    setBootcampsSuccess(state, action: PayloadAction<Bootcamp[]>) {
      state.loading = false;
      state.bootcamps = action.payload;
    },
    setBootcampsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { setBootcampsStart, setBootcampsSuccess, setBootcampsFailure } = bootcampsSlice.actions;
export default bootcampsSlice.reducer;
