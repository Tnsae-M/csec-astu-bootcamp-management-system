import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Group {
  id: string;
  name: string;
  divisionId: string;
  membersCount: number;
  mentor: string;
}

interface GroupsState {
  groups: Group[];
}

const initialState: GroupsState = {
  groups: [
    { id: '1', name: 'Alpha Squad', divisionId: '1', membersCount: 5, mentor: 'Marcello Ross' },
    { id: '2', name: 'Cyber Sentinels', divisionId: '2', membersCount: 4, mentor: 'Cyber Ghost' },
  ],
};

const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    setGroups: (state, action: PayloadAction<Group[]>) => {
      state.groups = action.payload;
    },
  },
});

export const { setGroups } = groupsSlice.actions;
export default groupsSlice.reducer;
