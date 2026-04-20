import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'INSTRUCTOR' | 'STUDENT';
  division: string;
  status: 'ACTIVE' | 'INACTIVE';
}

interface UsersState {
  users: User[];
}

const initialState: UsersState = {
  users: [
    { id: '1', name: 'Jerusalem', email: 'jerusalem@csec.astu', role: 'ADMIN', division: 'CSEC General', status: 'ACTIVE' },
    { id: '2', name: 'Iman', email: 'iman@csec.astu', role: 'INSTRUCTOR', division: 'Software Development', status: 'ACTIVE' },
    { id: '3', name: 'Tinsae', email: 'tinsae@student.csec.astu', role: 'STUDENT', division: 'Software Development', status: 'ACTIVE' },
    { id: '4', name: 'Wogari', email: 'wogari@student.csec.astu', role: 'STUDENT', division: 'Cybersecurity', status: 'ACTIVE' },
  ],
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
  },
});

export const { setUsers } = usersSlice.actions;
export default usersSlice.reducer;
