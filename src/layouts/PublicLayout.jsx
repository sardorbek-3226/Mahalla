import { Link, NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Logo from '@/components/common/Logo';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import { Button } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { ROLE_HOME } from '@/constants/roles';

// Public shell (navbar + footer) for static info/legal pages so they look
// complete and stay navigable. Renders the active page via <Outlet />.
const PublicLayout = () => {
  const { t } = useTranslation();
  const { isDark, toggle } = useTheme();
  const { isAuthenticated, user } = useAuth();

  const NAV = [
    { to: '/about', label: t('footer.about') },
    { to: '/faq', label: t('footer.faq') },
    { to: '/terms', label: t('footer.terms') },
    { to: '/contact', label: t('footer.contact') },
  ];

  const FOOTER_LINKS = [
    { to: '/about', label: t('footer.about') },
    { to: '/contact', label: t('footer.contact') },
    { to: '/faq', label: t('footer.faq') },
    { to: '/privacy', label: t('footer.privacy') },
    { to: '/terms', label: t('footer.terms') },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950">
      <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/80 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <nav className="hidden items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-300 md:flex">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  isActive ? 'text-primary-600' : 'hover:text-primary-600'
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <button
              onClick={toggle}
              aria-label="Mavzuni almashtirish"
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isDark ? '☀️' : '🌙'}
            </button>
            {isAuthenticated ? (
              <Link to={ROLE_HOME[user?.role] || '/'}><Button>{t('common.cabinet')}</Button></Link>
            ) : (
              <>
                <Link to="/login"><Button variant="ghost">{t('common.login')}</Button></Link>
                <Link to="/register"><Button variant="gradient">{t('common.start')}</Button></Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-gray-100 dark:border-gray-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-gray-500 sm:flex-row sm:px-6">
          <Logo />
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {FOOTER_LINKS.map((l) => (
              <Link key={l.to} to={l.to} className="hover:text-primary-600">
                {l.label}
              </Link>
            ))}
          </div>
          <p>{t('footer.copyright')}</p>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
