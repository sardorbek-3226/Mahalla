import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  HiOutlineCalendarDays,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineUserGroup,
  HiOutlinePlus,
} from 'react-icons/hi2';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/dashboard/StatCard';
import Card, { CardHeader } from '@/components/ui/Card';
import { Button, Badge, Skeleton, EmptyState } from '@/components/ui';
import { bookingService } from '@/services/bookingService';
import { workerService } from '@/services/workerService';
import { useAuth } from '@/hooks/useAuth';
import { formatDateTime } from '@/utils/format';

const STATUS_TONE = {
  new: 'amber',
  accepted: 'blue',
  in_progress: 'blue',
  completed: 'green',
  cancelled: 'red',
};
const STATUS_LABEL = {
  new: 'Yangi',
  accepted: 'Qabul qilindi',
  in_progress: 'Jarayonda',
  completed: 'Bajarildi',
  cancelled: 'Bekor qilindi',
};

const CitizenDashboard = () => {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ['bookings', 'mine'],
    queryFn: () => bookingService.list({ limit: 5 }),
  });
  const { data: workersData } = useQuery({
    queryKey: ['workers', 'count'],
    queryFn: () => workerService.list({ limit: 1 }),
  });

  const bookings = data?.items || data || [];
  const workersFound = workersData?.total ?? null;
  const stats = {
    total: data?.total ?? bookings.length,
    active: bookings.filter((b) => ['new', 'accepted', 'in_progress'].includes(b.status)).length,
    completed: bookings.filter((b) => b.status === 'completed').length,
  };

  return (
    <div>
      <PageHeader
        title={`Assalomu alaykum, ${user?.full_name?.split(' ')[0] || ''}!`}
        subtitle="Mahalla xizmatlari boshqaruvi"
        actions={
          <Link to="/bookings/new">
            <Button leftIcon={<HiOutlinePlus className="h-4 w-4" />}>Yangi buyurtma</Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Jami buyurtmalar" value={stats.total} icon={HiOutlineCalendarDays} tone="primary" />
        <StatCard label="Faol buyurtmalar" value={stats.active} icon={HiOutlineClock} tone="amber" />
        <StatCard label="Bajarilgan" value={stats.completed} icon={HiOutlineCheckCircle} tone="blue" />
        <StatCard label="Ro'yxatdagi ustalar" value={workersFound ?? '—'} icon={HiOutlineUserGroup} tone="primary" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="So'nggi buyurtmalar"
            action={<Link to="/bookings" className="text-sm font-medium text-primary-600 hover:underline">Barchasi</Link>}
          />
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          ) : bookings.length === 0 ? (
            <EmptyState
              title="Hali buyurtma yo'q"
              description="Birinchi buyurtmangizni yarating va mahalla ustalarini toping."
              action={<Link to="/bookings/new"><Button>Buyurtma berish</Button></Link>}
            />
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-gray-800">
              {bookings.map((b) => (
                <li key={b.id}>
                  <Link to={`/bookings/${b.id}`} className="flex items-center justify-between gap-3 py-3 transition hover:opacity-80">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{b.title}</p>
                      <p className="text-xs text-gray-400">{formatDateTime(b.created_at)}</p>
                    </div>
                    <Badge tone={STATUS_TONE[b.status]} dot>{STATUS_LABEL[b.status] || b.status}</Badge>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <CardHeader title="Tezkor amallar" />
          <div className="flex flex-col space-y-4 ">
            <Link to="/workers"><Button variant="secondary" className="w-full justify-start">Ustalarni ko&apos;rish</Button></Link>
            <Link to="/news"><Button variant="secondary" className="w-full justify-start">Mahalla yangiliklari</Button></Link>
            <Link to="/chat"><Button variant="secondary" className="w-full justify-start">Suhbatlar</Button></Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CitizenDashboard;
