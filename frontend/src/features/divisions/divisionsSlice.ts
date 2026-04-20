import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Division {
  id: string;
  name: string;
  head: string;
  studentsCount: number;
  status: 'ACTIVE' | 'INACTIVE';
}

interface DivisionsState {
  divisions: Division[];
}

const initialState: DivisionsState = {
  divisions: [
    { id: '1', name: 'Software Development', head: 'Dr. Tech', studentsCount: 450, status: 'ACTIVE' },
    { id: '2', name: 'Cybersecurity', head: 'Cipher Master', studentsCount: 320, status: 'ACTIVE' },
    { id: '3', name: 'Data Science', head: 'Logic Analyst', studentsCount: 280, status: 'ACTIVE' },
    { id: '4', name: 'CPD & Soft Skills', head: 'Soft Leader', studentsCount: 150, status: 'ACTIVE' },
  ],
};

const divisionsSlice = createSlice({
  name: 'divisions',
  initialState,
  reducers: {
    setDivisions: (state, action: PayloadAction<Division[]>) => {
      state.divisions = action.payload;
    },
  },
});

export const { setDivisions } = divisionsSlice.actions;
export default divisionsSlice.reducer;
