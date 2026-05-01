import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  searchTerm: string;
  sidebarOpen: boolean;
}

const initialState: UIState = {
  searchTerm: '',
  sidebarOpen: true,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
  },
});

export const { setSearchTerm, toggleSidebar, setSidebarOpen } = uiSlice.actions;
export default uiSlice.reducer;
