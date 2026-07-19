import { useQuery } from '@tanstack/react-query';
import {
  HiOutlineUsers,
  HiOutlineWrenchScrewdriver,
  HiOutlineClipboardDocumentList,
  HiOutlineBuildingOffice2,
} from 'react-icons/hi2';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/dashboard/StatCard';
import ChartCard from '@/components/dashboard/ChartCard';
import Card, { CardHeader } from '@/components/ui/Card';
import { Badge, Skeleton, EmptyState } from '@/components/ui';
import { adminService } from '@/services/adminService';
import { ROLE_LABELS } from '@/constants/roles';
import { useAuth } from '@/hooks/useAuth';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({ queryKey: ['admin', 'stats'], queryFn: adminService.stats });
  const { data: pending } = useQuery({
    queryKey: ['admin', 'pending-workers'],
    queryFn: () => adminService.pendingWorkers({ limit: 5 }),
  });

  const s = data || {};
  const pendingList = pending?.items || pending || [];

  // Only build a chart when the backend actually returned series data — never fabricate one.
  const ordersChart = s.orders_chart && {
    labels: s.orders_chart.labels,
    datasets: [
      {
        label: 'Buyurtmalar',
        data: s.orders_chart.data,
        backgroundColor: '#2f9c52',
        borderRadius: 8,
      },
    ],
  };
  const categoriesChart = s.categories_chart && {
    labels: s.categories_chart.labels,
    datasets: [
      {
        data: s.categories_chart.data,
        backgroundColor: ['#1f7d40', '#2563eb', '#f59e0b', '#ef4444'],
      },
    ],
  };

  return (
    <div>
      <PageHeader title="Boshqaruv paneli" subtitle={`${ROLE_LABELS[user?.role]} · umumiy ko'rsatkichlar`} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Aholi" value={s.residents ?? '—'} icon={HiOutlineUsers} tone="primary" />
        <StatCard label="Ustalar" value={s.workers ?? '—'} icon={HiOutlineWrenchScrewdriver} tone="blue" />
        <StatCard label="Buyurtmalar" value={s.orders ?? '—'} icon={HiOutlineClipboardDocumentList} tone="amber" />
        <StatCard label="Mahallalar" value={s.mahallas ?? '—'} icon={HiOutlineBuildingOffice2} tone="primary" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartCard title="Buyurtmalar dinamikasi" type="bar" data={ordersChart} />
        </div>
        <ChartCard title="Kategoriyalar bo'yicha" type="doughnut" data={categoriesChart} height={280} />
      </div>

      <Card className="mt-6">
        <CardHeader title="Tasdiqlash kutayotgan ustalar" />
        {isLoading ? (
          <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
        ) : pendingList.length === 0 ? (
          <EmptyState title="Kutayotgan ariza yo'q" description="Barcha ustalar tasdiqlangan." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs uppercase text-gray-400 dark:border-gray-800">
                  <th className="py-2 font-medium">Usta</th>
                  <th className="py-2 font-medium">Kasb</th>
                  <th className="py-2 font-medium">Holat</th>
                </tr>
              </thead>
              <tbody>
                {pendingList.map((w) => (
                  <tr key={w.id} className="border-b border-gray-50 dark:border-gray-800/60">
                    <td className="py-3 font-medium">{w.full_name || w.user?.full_name}</td>
                    <td className="py-3 text-gray-500">{w.category?.name || '—'}</td>
                    <td className="py-3"><Badge tone="amber" dot>Kutilmoqda</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminDashboard;
