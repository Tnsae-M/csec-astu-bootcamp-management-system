import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Group {
  _id: string;
  id?: string;
  name: string;
  bootcamp: string | any;
  members: any[];
  mentor?: any;
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
      state.loading = false;
      state.groups = action.payload;
    },
    setGroupsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { setGroupsStart, setGroupsSuccess, setGroupsFailure } = groupsSlice.actions;
export default groupsSlice.reducer;
