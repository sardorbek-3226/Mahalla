import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  HiOutlineShieldCheck,
  HiOutlineBolt,
  HiOutlineChatBubbleLeftRight,
  HiArrowRight,
} from 'react-icons/hi2';
import Logo from '@/components/common/Logo';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import { Button } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { ROLE_HOME } from '@/constants/roles';

const Landing = () => {
  const { t } = useTranslation();
  const { isDark, toggle } = useTheme();
  const { isAuthenticated, user } = useAuth();

  const FEATURES = [
    { icon: HiOutlineShieldCheck, title: t('landing.feature1Title'), desc: t('landing.feature1Desc') },
    { icon: HiOutlineBolt, title: t('landing.feature2Title'), desc: t('landing.feature2Desc') },
    { icon: HiOutlineChatBubbleLeftRight, title: t('landing.feature3Title'), desc: t('landing.feature3Desc') },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/80 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <nav className="hidden items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-300 md:flex">
            <a href="#features" className="hover:text-primary-600">{t('landing.navFeatures')}</a>
            <Link to="/about" className="hover:text-primary-600">{t('landing.navAbout')}</Link>
          </nav>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <button onClick={toggle} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
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

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary-500/10 blur-3xl" />
        <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 sm:py-28">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary-700 dark:border-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
              {t('landing.badge')}
            </span>
            <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
              {t('landing.titleLine1')} <span className="gradient-text">{t('landing.titleLine2')}</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-500">
              {t('landing.subtitle')}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/register">
                <Button variant="gradient" size="lg" rightIcon={<HiArrowRight className="h-4 w-4" />}>
                  {t('landing.ctaStart')}
                </Button>
              </Link>
              <Link to="/workers">
                <Button variant="outline" size="lg">{t('landing.ctaServices')}</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card p-6"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 dark:bg-primary-900/30">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-gray-500">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 dark:border-gray-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-gray-500 sm:flex-row sm:px-6">
          <Logo />
          <div className="flex gap-6">
            <Link to="/about" className="hover:text-primary-600">{t('footer.about')}</Link>
            <Link to="/contact" className="hover:text-primary-600">{t('footer.contact')}</Link>
            <Link to="/privacy" className="hover:text-primary-600">{t('footer.privacy')}</Link>
            <Link to="/terms" className="hover:text-primary-600">{t('footer.terms')}</Link>
          </div>
          <p>{t('footer.copyright')}</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
