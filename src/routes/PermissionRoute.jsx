import { Navigate, Outlet } from 'react-router-dom';
import { usePermissions } from '@/hooks/usePermissions';

// Route guard based on PERMISSIONS (finer-grained than RoleRoute).
// Usage: <PermissionRoute require={[PERMISSIONS.AUDIT_LOGS_VIEW]} />
//        <PermissionRoute require={[A, B]} mode="all" />
const PermissionRoute = ({ require = [], mode = 'any' }) => {
  const { user, can } = usePermissions();

  if (!user) return <Navigate to="/login" replace />;

  const allowed =
    require.length === 0 ||
    (mode === 'all' ? require.every(can) : require.some(can));

  if (!allowed) return <Navigate to="/403" replace />;

  return <Outlet />;
};

export default PermissionRoute;
