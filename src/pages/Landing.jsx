import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiOutlineShieldCheck,
  HiOutlineBolt,
  HiOutlineChatBubbleLeftRight,
  HiArrowRight,
} from 'react-icons/hi2';
import Logo from '@/components/common/Logo';
import { Button } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { ROLE_HOME } from '@/constants/roles';

const FEATURES = [
  { icon: HiOutlineShieldCheck, title: 'Tekshirilgan ustalar', desc: 'Har bir usta mahalla admini tomonidan tasdiqlanadi.' },
  { icon: HiOutlineBolt, title: 'Tezkor buyurtma', desc: 'Bir necha daqiqada kerakli xizmatni toping va buyurtma bering.' },
  { icon: HiOutlineChatBubbleLeftRight, title: 'Real-time aloqa', desc: 'Ustalar bilan to\'g\'ridan-to\'g\'ri yozishing.' },
];

const STATS = [
  { value: '12 400+', label: 'Faol ustalar' },
  { value: '86 000+', label: 'Bajarilgan buyurtmalar' },
  { value: '210 000+', label: 'Ro\'yxatdan o\'tgan aholi' },
  { value: '1 840+', label: 'Mahallalar' },
];

const Landing = () => {
  const { isDark, toggle } = useTheme();
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/80 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <nav className="hidden items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-300 md:flex">
            <a href="#features" className="hover:text-primary-600">Imkoniyatlar</a>
            <a href="#stats" className="hover:text-primary-600">Statistika</a>
            <Link to="/about" className="hover:text-primary-600">Biz haqimizda</Link>
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={toggle} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
              {isDark ? '☀️' : '🌙'}
            </button>
            {isAuthenticated ? (
              <Link to={ROLE_HOME[user?.role] || '/'}><Button>Kabinet</Button></Link>
            ) : (
              <>
                <Link to="/login"><Button variant="ghost">Kirish</Button></Link>
                <Link to="/register"><Button variant="gradient">Boshlash</Button></Link>
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
              🏘️ Mahallangiz uchun raqamli platforma
            </span>
            <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
              Mahalla xizmatlari <span className="gradient-text">bir joyda</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-500">
              Tekshirilgan ustalarni toping, buyurtma bering va mahalla hayotida faol ishtirok eting —
              barchasi Smart Mahalla orqali.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/register">
                <Button variant="gradient" size="lg" rightIcon={<HiArrowRight className="h-4 w-4" />}>
                  Hoziroq boshlash
                </Button>
              </Link>
              <Link to="/workers">
                <Button variant="outline" size="lg">Xizmatlarni ko&apos;rish</Button>
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

      {/* Stats */}
      <section id="stats" className="bg-gradient-to-br from-primary-600 to-accent-700 py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 text-center text-white sm:px-6 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-extrabold sm:text-4xl">{s.value}</p>
              <p className="mt-1 text-sm text-white/80">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 dark:border-gray-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-gray-500 sm:flex-row sm:px-6">
          <Logo />
          <div className="flex gap-6">
            <Link to="/about" className="hover:text-primary-600">Biz haqimizda</Link>
            <Link to="/contact" className="hover:text-primary-600">Aloqa</Link>
            <Link to="/privacy" className="hover:text-primary-600">Maxfiylik</Link>
            <Link to="/terms" className="hover:text-primary-600">Shartlar</Link>
          </div>
          <p>© 2026 Smart Mahalla</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
