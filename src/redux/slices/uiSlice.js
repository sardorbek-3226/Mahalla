import { createSlice } from '@reduxjs/toolkit';

const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'light';
  const stored = localStorage.getItem('theme');
  if (stored) return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const getInitialLanguage = () => {
  if (typeof window === 'undefined') return 'uz';
  return localStorage.getItem('language') || 'uz';
};

const initialState = {
  theme: getInitialTheme(),
  sidebarOpen: true,
  sidebarMobileOpen: false,
  language: getInitialLanguage(),
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
    },
    setTheme(state, action) {
      state.theme = action.payload;
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarMobile(state, action) {
      state.sidebarMobileOpen = action.payload;
    },
    setLanguage(state, action) {
      state.language = action.payload;
    },
  },
});

export const { toggleTheme, setTheme, toggleSidebar, setSidebarMobile, setLanguage } =
  uiSlice.actions;
export default uiSlice.reducer;
