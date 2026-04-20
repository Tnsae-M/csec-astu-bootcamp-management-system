import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  searchTerm: string;
}

const initialState: UIState = {
  searchTerm: '',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    clearSearch: (state) => {
      state.searchTerm = '';
    },
  },
});

export const { setSearchTerm, clearSearch } = uiSlice.actions;
export default uiSlice.reducer;
