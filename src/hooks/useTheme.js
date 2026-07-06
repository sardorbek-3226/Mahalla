import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme, setTheme } from '@/redux/slices/uiSlice';

// Applies the theme class to <html> and keeps localStorage in sync.
export const useTheme = () => {
  const theme = useSelector((s) => s.ui.theme);
  const dispatch = useDispatch();

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  return {
    theme,
    isDark: theme === 'dark',
    toggle: () => dispatch(toggleTheme()),
    set: (t) => dispatch(setTheme(t)),
  };
};
