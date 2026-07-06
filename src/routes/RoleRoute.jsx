import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

// Wrap routes that require specific roles: <RoleRoute allow={[ROLES.WORKER]} />
const RoleRoute = ({ allow = [] }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (allow.length && !allow.includes(user.role)) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
