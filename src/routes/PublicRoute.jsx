import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ROLE_HOME } from '@/constants/roles';
import FullPageLoader from '@/components/common/FullPageLoader';

// For auth pages (login/register): if already logged in, bounce to the dashboard.
const PublicRoute = () => {
  const { isAuthenticated, bootstrapped, user } = useAuth();

  if (!bootstrapped) return <FullPageLoader />;
  if (isAuthenticated) {
    return <Navigate to={ROLE_HOME[user?.role] || '/'} replace />;
  }
  return <Outlet />;
};

export default PublicRoute;
