import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { HiXMark } from 'react-icons/hi2';
import Logo from '@/components/common/Logo';
import { SIDEBAR_NAV } from '@/constants/navigation';
import { ROLE_LABELS } from '@/constants/roles';
import { setSidebarMobile } from '@/redux/slices/uiSlice';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/utils/cn';

const NavItems = ({ items, onNavigate }) => {
  const { t } = useTranslation();
  return (
    <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
      {items.map(({ to, labelKey, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
              isActive
                ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
            )
          }
        >
          <Icon className="h-5 w-5 shrink-0" />
          <span className="truncate">{t(labelKey)}</span>
        </NavLink>
      ))}
    </nav>
  );
};

const SidebarContent = ({ items, role, onNavigate }) => (
  <div className="flex h-full flex-col">
    <div className="flex h-16 items-center px-5">
      <Logo />
    </div>
    <NavItems items={items} onNavigate={onNavigate} />
    <div className="border-t border-gray-100 px-5 py-3 text-xs text-gray-400 dark:border-gray-800">
      {ROLE_LABELS[role]}
    </div>
  </div>
);

const Sidebar = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { sidebarMobileOpen } = useSelector((s) => s.ui);
  const items = SIDEBAR_NAV[user?.role] || [];
  const close = () => dispatch(setSidebarMobile(false));

  return (
    <>
      {/* Desktop */}
      <aside className="hidden w-64 shrink-0 border-r border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900 lg:block">
        <SidebarContent items={items} role={user?.role} />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {sidebarMobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-900 lg:hidden"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 24, stiffness: 240 }}
            >
              <button
                onClick={close}
                className="absolute right-3 top-4 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <HiXMark className="h-5 w-5" />
              </button>
              <SidebarContent items={items} role={user?.role} onNavigate={close} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
