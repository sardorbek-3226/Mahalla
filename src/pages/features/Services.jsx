import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HiOutlineShieldCheck, HiOutlineBolt, HiOutlineChatBubbleLeftRight, HiArrowRight } from 'react-icons/hi2';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/ui/Card';
import { Button } from '@/components/ui';
import { categoryService } from '@/services/workerService';

const STEP_KEYS = [
  { key: 'verifiedWorkers', icon: HiOutlineShieldCheck },
  { key: 'fastOrder', icon: HiOutlineBolt },
  { key: 'directContact', icon: HiOutlineChatBubbleLeftRight },
];

const Services = () => {
  const { t } = useTranslation();
  const { data } = useQuery({ queryKey: ['categories'], queryFn: categoryService.list });
  const cats = data?.items || data || [];

  return (
    <div>
      <PageHeader title={t('features.services.title')} subtitle={t('features.services.subtitle')} />

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        {STEP_KEYS.map((s) => (
          <Card key={s.key} className="p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 dark:bg-primary-900/30">
              <s.icon className="h-6 w-6" />
            </div>
            <h3 className="mt-3 font-semibold">{t(`features.services.steps.${s.key}.title`)}</h3>
            <p className="mt-1 text-sm text-gray-500">{t(`features.services.steps.${s.key}.desc`)}</p>
          </Card>
        ))}
      </div>

      <h3 className="mb-3 font-semibold">{t('features.services.serviceTypes')}</h3>
      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {cats.map((c) => (
          <Link key={c.id} to="/workers">
            <Card className="flex items-center gap-3 p-4 transition hover:shadow-card">
              <span className="text-2xl">{c.icon}</span>
              <div>
                <p className="font-medium">{c.name}</p>
                <p className="text-xs text-gray-400">{t('features.services.workersCount', { count: c.count })}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="mt-6 flex flex-col items-center gap-3 bg-gradient-to-br from-primary-600 to-accent-700 p-8 text-center text-white sm:flex-row sm:justify-between sm:text-left">
        <div>
          <h3 className="text-lg font-bold">{t('features.services.ctaTitle')}</h3>
          <p className="text-sm text-white/80">{t('features.services.ctaDesc')}</p>
        </div>
        <Link to="/bookings/new">
          <Button variant="secondary" rightIcon={<HiArrowRight className="h-4 w-4" />}>{t('features.services.ctaButton')}</Button>
        </Link>
      </Card>
    </div>
  );
};

export default Services;
