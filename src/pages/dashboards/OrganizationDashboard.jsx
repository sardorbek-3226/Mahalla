import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  HiOutlineBriefcase,
  HiOutlineUserGroup,
  HiOutlineClipboardDocumentCheck,
  HiOutlineBanknotes,
  HiPlus,
  HiArrowRight,
} from 'react-icons/hi2';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/dashboard/StatCard';
import ChartCard from '@/components/dashboard/ChartCard';
import Card from '@/components/ui/Card';
import { Button } from '@/components/ui';
import WorkerCard from '@/components/common/WorkerCard';
import { workerService } from '@/services/workerService';
import { bookingService } from '@/services/bookingService';
import { useAuth } from '@/hooks/useAuth';
import { formatMoney } from '@/utils/format';
import { lastMonths, monthKey } from '@/utils/chart';

const ACTIVE_STATUSES = ['new', 'accepted', 'in_progress'];

const OrganizationDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  // The backend has no sort param for GET /providers, so fetch a page and sort client-side.
  const { data } = useQuery({ queryKey: ['workers', 'top-rated'], queryFn: () => workerService.list({ limit: 12 }) });
  const workers = [...(data?.items || data || [])]
    .sort((a, b) => (b.rating_avg ?? 0) - (a.rating_avg ?? 0))
    .slice(0, 3);

  // The org's own job postings ARE orders (created via /bookings/new) — derive every stat from them.
  const { data: ordersData } = useQuery({
    queryKey: ['bookings', 'org', 100],
    queryFn: () => bookingService.list({ limit: 100 }),
  });
  const orders = ordersData?.items || ordersData || [];

  const activeJobs = orders.filter((o) => ACTIVE_STATUSES.includes(o.status)).length;
  const completedJobs = orders.filter((o) => o.status === 'completed').length;
  const hiredWorkers = new Set(orders.filter((o) => o.worker_id).map((o) => o.worker_id)).size;

  const { labels: monthLabels, keys: monthKeys } = lastMonths(6);
  const monthlyCounts = Object.fromEntries(monthKeys.map((k) => [k, 0]));
  const monthlySpend = Object.fromEntries(monthKeys.map((k) => [k, 0]));
  orders.forEach((o) => {
    const k = monthKey(o.created_at);
    if (k in monthlyCounts) {
      monthlyCounts[k] += 1;
      monthlySpend[k] += o.price_agreed || 0;
    }
  });
  const monthlySpendTotal = monthlySpend[monthKeys[monthKeys.length - 1]];

  const hiringChart = {
    labels: monthLabels,
    datasets: [{
      label: t('dashboard.organization.hiringChartLabel'),
      data: monthKeys.map((k) => monthlyCounts[k]),
      backgroundColor: '#2563eb',
      borderRadius: 8,
    }],
  };

  return (
    <div>
      <PageHeader
        title={t('dashboard.organization.greeting', { name: user?.full_name || t('dashboard.organization.defaultName') })}
        subtitle={t('dashboard.organization.subtitle')}
        actions={
          <Link to="/bookings/new">
            <Button variant="gradient" leftIcon={<HiPlus className="h-4 w-4" />}>{t('dashboard.organization.postJob')}</Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label={t('dashboard.organization.activeJobs')} value={activeJobs} icon={HiOutlineBriefcase} tone="primary" />
        <StatCard label={t('dashboard.organization.hiredWorkers')} value={hiredWorkers} icon={HiOutlineUserGroup} tone="blue" />
        <StatCard label={t('dashboard.organization.completedProjects')} value={completedJobs} icon={HiOutlineClipboardDocumentCheck} tone="amber" />
        <StatCard label={t('dashboard.organization.monthlySpend')} value={formatMoney(monthlySpendTotal)} icon={HiOutlineBanknotes} tone="primary" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2"><ChartCard title={t('dashboard.organization.hiringChartTitle')} type="bar" data={hiringChart} /></div>
        <Card className="flex flex-col justify-between p-6">
          <div>
            <h3 className="font-semibold">{t('dashboard.organization.quickJobTitle')}</h3>
            <p className="mt-1 text-sm text-gray-500">{t('dashboard.organization.quickJobDescription')}</p>
          </div>
          <Link to="/workers" className="mt-4">
            <Button variant="outline" className="w-full" rightIcon={<HiArrowRight className="h-4 w-4" />}>{t('dashboard.organization.viewWorkers')}</Button>
          </Link>
        </Card>
      </div>

      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold">{t('dashboard.organization.recommendedWorkersTitle')}</h3>
          <Link to="/workers" className="text-sm font-medium text-primary-600 hover:underline">{t('dashboard.organization.viewAll')}</Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {workers.map((w) => <WorkerCard key={w.id} worker={w} />)}
        </div>
      </div>
    </div>
  );
};

export default OrganizationDashboard;
