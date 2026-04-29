import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    setGroupsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    setGroupsSuccess: (state, action: PayloadAction<Group[]>) => {
      state.groups = action.payload;
      state.loading = false;
    },
    setGroupsFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setGroupsStart, setGroupsSuccess, setGroupsFailure } = groupsSlice.actions;
export default groupsSlice.reducer;
