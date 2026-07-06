import { usePermissions } from '@/hooks/usePermissions';

// Declarative UI gate. Renders children only if the user holds the permission(s).
// <Can do={PERMISSIONS.WORKERS_VERIFY}>…</Can>
// <Can any={[A, B]}>…</Can>   <Can all={[A, B]}>…</Can>
// Optional `fallback` renders when not allowed.
const Can = ({ do: one, any, all, fallback = null, children }) => {
  const { can, canAny, canAll } = usePermissions();

  let allowed = true;
  if (one) allowed = can(one);
  else if (any) allowed = canAny(...any);
  else if (all) allowed = canAll(...all);

  return allowed ? children : fallback;
};

export default Can;
