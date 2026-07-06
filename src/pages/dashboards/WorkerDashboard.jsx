import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  HiOutlineCalendarDays,
  HiOutlineCheckCircle,
  HiOutlineStar,
  HiOutlineBanknotes,
} from 'react-icons/hi2';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/dashboard/StatCard';
import ChartCard from '@/components/dashboard/ChartCard';
import Card, { CardHeader } from '@/components/ui/Card';
import { Badge, Button, Skeleton, EmptyState } from '@/components/ui';
import { bookingService } from '@/services/bookingService';
import { workerService } from '@/services/workerService';
import { useAuth } from '@/hooks/useAuth';
import { formatDateTime } from '@/utils/format';

const WorkerDashboard = () => {
  const { user } = useAuth();
  const [available, setAvailable] = useState(user?.is_available ?? true);

  const { data, isLoading } = useQuery({
    queryKey: ['bookings', 'worker'],
    queryFn: () => bookingService.list({ limit: 6 }),
  });

  const availabilityMut = useMutation({
    mutationFn: (val) => workerService.setAvailability(val),
    onSuccess: (_, val) => {
      setAvailable(val);
      toast.success(val ? "Endi buyurtma qabul qilasiz" : 'Buyurtmalar to\'xtatildi');
    },
  });

  const bookings = data?.items || data || [];
  const earningsChart = {
    labels: ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun'],
    datasets: [
      {
        label: 'Daromad',
        data: data?.earnings || [0, 0, 0, 0, 0, 0],
        borderColor: '#1f7d40',
        backgroundColor: 'rgba(47,156,82,0.12)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div>
      <PageHeader
        title="Usta paneli"
        subtitle="Buyurtmalar va daromadlaringizni boshqaring"
        actions={
          <Button
            variant={available ? 'primary' : 'outline'}
            loading={availabilityMut.isPending}
            onClick={() => availabilityMut.mutate(!available)}
          >
            {available ? '🟢 Buyurtma qabul qilyapman' : '⚪ Band emasman'}
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Yangi so'rovlar" value={bookings.filter((b) => b.status === 'new').length} icon={HiOutlineCalendarDays} tone="amber" />
        <StatCard label="Bajarilgan" value={user?.completed_orders ?? '—'} icon={HiOutlineCheckCircle} tone="primary" />
        <StatCard label="Reyting" value={user?.rating_avg ?? '—'} icon={HiOutlineStar} tone="blue" />
        <StatCard label="Bu oy daromad" value="—" icon={HiOutlineBanknotes} tone="primary" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartCard title="Daromad dinamikasi" subtitle="So'nggi 6 oy" type="line" data={earningsChart} />
        </div>

        <Card>
          <CardHeader
            title="Kelgan buyurtmalar"
            action={<Link to="/bookings" className="text-sm font-medium text-primary-600 hover:underline">Barchasi</Link>}
          />
          {isLoading ? (
            <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
          ) : bookings.length === 0 ? (
            <EmptyState title="Buyurtmalar yo'q" description="Yangi buyurtmalar shu yerda ko'rinadi." />
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-gray-800">
              {bookings.slice(0, 5).map((b) => (
                <li key={b.id} className="flex items-center justify-between gap-2 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{b.title}</p>
                    <p className="text-xs text-gray-400">{formatDateTime(b.created_at)}</p>
                  </div>
                  {b.status === 'new' ? (
                    <Badge tone="amber" dot>Yangi</Badge>
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
