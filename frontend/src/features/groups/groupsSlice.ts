import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { groupsService } from '../../services/groups.service';

export interface Group {
  _id: string;
  id?: string;
  name: string;
  bootcamp?: string | any;
  bootcampId?: string | any;
  mentor?: any;
  mentorId?: string | any;
  members: string[] | any[];
}

interface GroupsState {
  groups: Group[];
  loading: boolean;
  error: string | null;
}

const initialState: GroupsState = {
  groups: [],
  loading: false,
  error: null,
};

// ===== THUNKS =====

export const fetchGroupsByBootcamp = createAsyncThunk(
  'groups/fetchByBootcamp',
  async (bootcampId: string, { rejectWithValue }) => {
    try {
      const response = await groupsService.getGroupsByBootcamp(bootcampId);
      return response.data || response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch groups');
    }
  }
);

export const createGroupAsync = createAsyncThunk(
  'groups/create',
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await groupsService.createGroup(data);
      return response.data || response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create group');
    }
  }
);

export const deleteGroupAsync = createAsyncThunk(
  'groups/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await groupsService.deleteGroup(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete group');
    }
  }
);

const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchGroupsByBootcamp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroupsByBootcamp.fulfilled, (state, action) => {
        state.loading = false;
        state.groups = action.payload;
      })
      .addCase(fetchGroupsByBootcamp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create
      .addCase(createGroupAsync.fulfilled, (state, action) => {
        state.groups.push(action.payload);
      })
      // Delete
      .addCase(deleteGroupAsync.fulfilled, (state, action) => {
        state.groups = state.groups.filter(g => (g._id || g.id) !== action.payload);
      });
  },
});

export default groupsSlice.reducer;

