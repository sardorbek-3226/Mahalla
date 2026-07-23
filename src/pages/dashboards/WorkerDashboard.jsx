import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import {
  HiOutlineCalendarDays,
  HiOutlineCheckCircle,
  HiOutlineStar,
  HiOutlineBanknotes,
  HiOutlineWrenchScrewdriver,
} from 'react-icons/hi2';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/dashboard/StatCard';
import ChartCard from '@/components/dashboard/ChartCard';
import Card, { CardHeader } from '@/components/ui/Card';
import { Badge, Button, Skeleton, EmptyState } from '@/components/ui';
import { bookingService } from '@/services/bookingService';
import { workerService } from '@/services/workerService';
import { useAuth } from '@/hooks/useAuth';
import { formatDateTime, formatMoney } from '@/utils/format';
import { lastMonths, monthKey } from '@/utils/chart';

const WorkerDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [available, setAvailable] = useState(user?.is_available ?? true);
  const providerId = user?.provider_profile_id;

  // Open jobs anyone can claim (no provider assigned yet) — visible to every
  // worker whose service category matches, not just a specific one.
  const { data, isLoading } = useQuery({
    queryKey: ['bookings', 'worker', 'available'],
    queryFn: () => bookingService.list({ scope: 'available', limit: 6 }),
  });

  // Real earnings, computed from the worker's own completed orders (no backend earnings endpoint exists).
  const { data: completedData } = useQuery({
    queryKey: ['bookings', 'worker', 'completed'],
    queryFn: () => bookingService.list({ status: 'COMPLETED', scope: 'assigned', limit: 100 }),
  });

  // Nudge new workers to set their hourly rate and services until they've done it.
  const { data: provider } = useQuery({
    queryKey: ['provider', providerId],
    queryFn: () => workerService.getById(providerId),
    enabled: !!providerId,
  });
  const needsOnboarding = !providerId || (provider && provider.services.length === 0);

  const availabilityMut = useMutation({
    mutationFn: (val) => workerService.setAvailability(val),
    onSuccess: (_, val) => {
      setAvailable(val);
      toast.success(val ? t('dashboard.worker.availabilityOnToast') : t('dashboard.worker.availabilityOffToast'));
    },
  });

  const bookings = data?.items || data || [];
  const completedOrders = completedData?.items || completedData || [];

  const { labels: monthLabels, keys: monthKeys } = lastMonths(6);
  const monthlySums = Object.fromEntries(monthKeys.map((k) => [k, 0]));
  completedOrders.forEach((o) => {
    const k = monthKey(o.created_at);
    if (k in monthlySums) monthlySums[k] += o.price_agreed || 0;
  });
  const earningsChart = {
    labels: monthLabels,
    datasets: [
      {
        label: t('dashboard.worker.earningsChartLabel'),
        data: monthKeys.map((k) => monthlySums[k]),
        borderColor: '#1f7d40',
        backgroundColor: 'rgba(47,156,82,0.12)',
        fill: true,
        tension: 0.4,
      },
    ],
  };
  const thisMonthEarnings = monthlySums[monthKeys[monthKeys.length - 1]];

  return (
    <div>
      <PageHeader
        title={t('dashboard.worker.title')}
        subtitle={t('dashboard.worker.subtitle')}
        actions={
          <Button
            variant={available ? 'primary' : 'outline'}
            loading={availabilityMut.isPending}
            onClick={() => availabilityMut.mutate(!available)}
          >
            {available ? t('dashboard.worker.availableStatus') : t('dashboard.worker.unavailableStatus')}
          </Button>
        }
      />

      {needsOnboarding && (
        <Card className="mb-6 flex flex-col items-start gap-4 border-l-4 border-l-amber-400 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-900/30">
              <HiOutlineWrenchScrewdriver className="h-5 w-5" />
            </span>
            <div>
              <p className="font-semibold">{t('dashboard.worker.onboardingTitle')}</p>
              <p className="text-sm text-gray-500">
                {t('dashboard.worker.onboardingDescription')}
              </p>
            </div>
          </div>
          <Link to="/provider/services">
            <Button variant="gradient" className="w-full sm:w-auto">{t('dashboard.worker.setPricingButton')}</Button>
          </Link>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label={t('dashboard.worker.newRequests')} value={bookings.filter((b) => b.status === 'new').length} icon={HiOutlineCalendarDays} tone="amber" />
        <StatCard label={t('dashboard.worker.completed')} value={provider?.completed_orders ?? '—'} icon={HiOutlineCheckCircle} tone="primary" />
        <StatCard label={t('dashboard.worker.rating')} value={provider?.rating_avg ?? '—'} icon={HiOutlineStar} tone="blue" />
        <StatCard label={t('dashboard.worker.monthlyEarnings')} value={formatMoney(thisMonthEarnings)} icon={HiOutlineBanknotes} tone="primary" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartCard title={t('dashboard.worker.earningsChartTitle')} subtitle={t('dashboard.worker.last6Months')} type="line" data={earningsChart} />
        </div>

        <Card>
          <CardHeader
            title={t('dashboard.worker.incomingBookingsTitle')}
            action={<Link to="/bookings" className="text-sm font-medium text-primary-600 hover:underline">{t('dashboard.worker.viewAll')}</Link>}
          />
          {isLoading ? (
            <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
          ) : bookings.length === 0 ? (
            <EmptyState title={t('dashboard.worker.noBookingsTitle')} description={t('dashboard.worker.noBookingsDescription')} />
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-gray-800">
              {bookings.slice(0, 5).map((b) => (
                <li key={b.id} className="flex items-center justify-between gap-2 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{b.title}</p>
                    <p className="text-xs text-gray-400">{formatDateTime(b.created_at)}</p>
                  </div>
                  {b.status === 'new' ? (
                    <Badge tone="amber" dot>{t('dashboard.worker.newBadge')}</Badge>
                  ) : (
                    <Badge tone="blue">{b.status}</Badge>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
};

export default WorkerDashboard;
