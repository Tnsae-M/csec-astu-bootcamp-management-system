import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  division?: string;
  status: string;
}

interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsersStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    setUsersSuccess: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
      state.loading = false;
    },
    setUsersFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setUsersStart, setUsersSuccess, setUsersFailure } = usersSlice.actions;
export default usersSlice.reducer;
