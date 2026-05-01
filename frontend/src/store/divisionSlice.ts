import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { divisionService } from '../services/divisions.service';
import { Division } from '../types';

interface DivisionState {
  items: Division[];
  loading: boolean;
  error: string | null;
}

const initialState: DivisionState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchDivisions = createAsyncThunk(
  'divisions/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const data = await divisionService.getDivisions();
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch divisions');
    }
  }
);

const divisionSlice = createSlice({
  name: 'divisions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDivisions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDivisions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchDivisions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default divisionSlice.reducer;
