import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { fetchCurrentUser, clearAuth } from '@/redux/slices/authSlice';
import { registerUnauthHandler } from '@/api/axiosInstance';
import { SocketProvider } from '@/context/SocketProvider';
import { useTheme } from '@/hooks/useTheme';
import AppRoutes from '@/routes/AppRoutes';
import { store } from '@/redux/store';

const App = () => {
  const dispatch = useDispatch();
  useTheme(); // applies the theme class to <html>

  useEffect(() => {
    // Restore session from the stored access token (if any) on first load.
    dispatch(fetchCurrentUser());

    // When a token refresh ultimately fails, the axios layer calls this.
    registerUnauthHandler(() => store.dispatch(clearAuth()));
  }, [dispatch]);

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <SocketProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            className:
              '!bg-white dark:!bg-gray-900 !text-gray-900 dark:!text-gray-100 !shadow-card !rounded-xl',
            duration: 4000,
          }}
        />
      </SocketProvider>
    </BrowserRouter>
  );
};

export default App;
