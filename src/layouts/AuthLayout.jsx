import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Logo from '@/components/common/Logo';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';

// Split-screen auth shell: brand panel + form column.
const AuthLayout = () => {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Brand panel */}
      <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-accent-700 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-accent-400/20 blur-3xl" />
        <Logo className="relative z-10 [&_span]:text-white" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-md text-white"
        >
          <h1 className="text-4xl font-extrabold leading-tight">
            {t('auth.brand.title')}
          </h1>
          <p className="mt-4 text-white/80">
            {t('auth.brand.subtitle')}
          </p>
        </motion.div>
        <p className="relative z-10 text-sm text-white/60">{t('footer.copyright')}</p>
      </div>

      {/* Form column */}
      <div className="flex flex-1 flex-col items-center justify-center p-6 sm:p-10">
        <div className="mb-8 flex w-full items-center justify-between lg:hidden">
          <Logo />
          <LanguageSwitcher />
        </div>
        <div className="mb-4 hidden w-full max-w-md justify-end lg:flex">
          <LanguageSwitcher />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Outlet />
        </motion.div>
        <p className="mt-8 text-center text-xs text-gray-400">
          <Link to="/privacy" className="hover:underline">{t('footer.privacy')}</Link>
          {' · '}
          <Link to="/terms" className="hover:underline">{t('footer.terms')}</Link>
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
