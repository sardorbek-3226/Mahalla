import { Link, NavLink, Outlet } from 'react-router-dom';
import Logo from '@/components/common/Logo';
import { Button } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';

const NAV = [
  { to: '/about', label: 'Biz haqimizda' },
  { to: '/faq', label: 'FAQ' },
  { to: '/terms', label: 'Shartlar' },
  { to: '/contact', label: 'Aloqa' },
];

const FOOTER_LINKS = [
  { to: '/about', label: 'Biz haqimizda' },
  { to: '/contact', label: 'Aloqa' },
  { to: '/faq', label: 'FAQ' },
  { to: '/privacy', label: 'Maxfiylik' },
  { to: '/terms', label: 'Shartlar' },
];

// Public shell (navbar + footer) for static info/legal pages so they look
// complete and stay navigable. Renders the active page via <Outlet />.
const PublicLayout = () => {
  const { isDark, toggle } = useTheme();
  const { isAuthenticated } = useAuth();

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
            <button
              onClick={toggle}
              aria-label="Mavzuni almashtirish"
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isDark ? '☀️' : '🌙'}
            </button>
            {isAuthenticated ? (
              <Link to="/dashboard/citizen"><Button>Kabinet</Button></Link>
            ) : (
              <>
                <Link to="/login"><Button variant="ghost">Kirish</Button></Link>
                <Link to="/register"><Button variant="gradient">Boshlash</Button></Link>
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
          <p>© 2026 Smart Mahalla</p>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
