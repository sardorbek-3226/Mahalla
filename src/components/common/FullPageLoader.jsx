import { useTranslation } from 'react-i18next';
import { HiHomeModern } from 'react-icons/hi2';
import Spinner from '@/components/ui/Spinner';

// NOTE: rendered as the PersistGate fallback (outside <BrowserRouter>), so it
// must NOT use <Link> or any router-context component.
const FullPageLoader = () => {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-gray-50 dark:bg-gray-950">
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-600 text-white shadow-soft">
          <HiHomeModern className="h-5 w-5" />
        </span>
        <span className="text-lg font-extrabold tracking-tight">
          Smart<span className="gradient-text">Mahalla</span>
        </span>
      </div>
      <Spinner size="lg" />
      <p className="text-sm text-gray-400">{t('common.loading')}</p>
    </div>
  );
};

export default FullPageLoader;
