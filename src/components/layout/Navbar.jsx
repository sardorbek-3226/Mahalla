import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  HiOutlineBars3,
  HiOutlineBell,
  HiOutlineSun,
  HiOutlineMoon,
  HiOutlineMagnifyingGlass,
  HiOutlineArrowRightOnRectangle,
} from 'react-icons/hi2';
import Avatar from '@/components/ui/Avatar';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import { setSidebarMobile } from '@/redux/slices/uiSlice';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { ROLE_LABELS } from '@/constants/roles';

const Navbar = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isDark, toggle } = useTheme();
  const { user, logout } = useAuth();
  const unreadCount = useSelector((s) => s.notifications.unreadCount);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-gray-100 bg-white/80 px-4 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-900/80 sm:px-6">
      <button
        onClick={() => dispatch(setSidebarMobile(true))}
        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
      >
        <HiOutlineBars3 className="h-5 w-5" />
      </button>

      {/* Search */}
      <button
        onClick={() => navigate('/search')}
        className="hidden items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-400 transition hover:border-gray-300 dark:border-gray-700 sm:flex"
      >
        <HiOutlineMagnifyingGlass className="h-4 w-4" />
        {t('common.search')}
      </button>

      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        <LanguageSwitcher className="hidden rounded-lg border border-transparent bg-transparent px-2 py-1.5 text-sm text-gray-500 outline-none transition hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 sm:block" />
        <button
          onClick={toggle}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label={t('common.theme')}
        >
          {isDark ? <HiOutlineSun className="h-5 w-5" /> : <HiOutlineMoon className="h-5 w-5" />}
        </button>

        <button
          onClick={() => navigate('/notifications')}
          className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label={t('common.notifications')}
        >
          <HiOutlineBell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        <div className="relative">
          <button onClick={() => setMenuOpen((o) => !o)} className="flex items-center gap-2 rounded-xl p-1 pr-2 hover:bg-gray-100 dark:hover:bg-gray-800">
            <Avatar src={user?.avatar_url} name={user?.full_name} size="sm" />
            <div className="hidden text-left sm:block">
              <p className="text-sm font-medium leading-tight">{user?.full_name}</p>
              <p className="text-xs text-gray-400">{ROLE_LABELS[user?.role]}</p>
            </div>
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-card dark:border-gray-800 dark:bg-gray-900">
                <button
                  onClick={() => { setMenuOpen(false); navigate('/profile'); }}
                  className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {t('common.profile')}
                </button>
                <button
                  onClick={() => { setMenuOpen(false); navigate('/settings'); }}
                  className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {t('common.settings')}
                </button>
                <button
                  onClick={() => logout()}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <HiOutlineArrowRightOnRectangle className="h-4 w-4" />
                  {t('common.logout')}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
