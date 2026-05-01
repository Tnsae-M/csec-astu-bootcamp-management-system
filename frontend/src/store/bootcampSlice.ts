import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { bootcampService, divisionService } from '../services/divisions.service';
import { Bootcamp } from '../types';

interface BootcampState {
  items: Bootcamp[];
  currentBootcamp: Bootcamp | null;
  loading: boolean;
  error: string | null;
}

const initialState: BootcampState = {
  items: [],
  currentBootcamp: null,
  loading: false,
  error: null,
};

export const fetchBootcamps = createAsyncThunk(
  'bootcamps/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const data = await bootcampService.getBootcamps();
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bootcamps');
    }
  }
);

export const fetchDivisionBootcamps = createAsyncThunk(
  'bootcamps/fetchByDivision',
  async (divisionId: string, { rejectWithValue }) => {
    try {
      const data = await divisionService.getDivisionBootcamps(divisionId);
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bootcamps');
    }
  }
);

export const fetchBootcamp = createAsyncThunk(
  'bootcamps/fetchOne',
  async (id: string, { rejectWithValue }) => {
    try {
      const data = await bootcampService.getBootcamp(id);
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bootcamp');
    }
  }
);

const bootcampSlice = createSlice({
  name: 'bootcamps',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDivisionBootcamps.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDivisionBootcamps.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchBootcamps.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBootcamps.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchBootcamp.fulfilled, (state, action) => {
        state.currentBootcamp = action.payload;
      });
  },
});

export default bootcampSlice.reducer;
