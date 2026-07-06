import { useSelector, useDispatch } from 'react-redux';
import { logout as logoutThunk } from '@/redux/slices/authSlice';

// Convenience accessor for auth state + actions.
export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, status, bootstrapped, error } = useSelector((s) => s.auth);

  const hasRole = (...roles) => !!user && roles.includes(user.role);
  const logout = () => dispatch(logoutThunk());

  return { user, isAuthenticated, status, bootstrapped, error, hasRole, logout };
};
