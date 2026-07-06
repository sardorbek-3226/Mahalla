import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { HiOutlineClipboardDocumentList, HiPlus, HiOutlineMapPin } from 'react-icons/hi2';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/ui/Card';
import { Button, EmptyState, Skeleton, StatusBadge } from '@/components/ui';
import { bookingService } from '@/services/bookingService';
import { formatMoney, formatDateTime } from '@/utils/format';

const TABS = [
  { value: '', label: 'Barchasi' },
  { value: 'new', label: 'Yangi' },
  { value: 'accepted', label: 'Qabul qilingan' },
  { value: 'in_progress', label: 'Jarayonda' },
  { value: 'completed', label: 'Bajarilgan' },
  { value: 'cancelled', label: 'Bekor qilingan' },
];

const Bookings = () => {
  const [tab, setTab] = useState('');
  const { data, isLoading } = useQuery({ queryKey: ['bookings'], queryFn: () => bookingService.list() });
  const all = data?.items || data || [];
  const list = tab ? all.filter((b) => b.status === tab) : all;

  return (
    <div>
      <PageHeader
        title="Buyurtmalar"
        subtitle="Barcha buyurtmalaringiz"
        actions={
          <Link to="/bookings/new">
            <Button variant="gradient" leftIcon={<HiPlus className="h-4 w-4" />}>Yangi buyurtma</Button>
          </Link>
        }
      />

      <div className="mb-5 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              tab === t.value
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}</div>
      ) : list.length === 0 ? (
        <Card className="p-0">
          <EmptyState icon={HiOutlineClipboardDocumentList} title="Buyurtma yo‘q" description="Bu bo‘limda hozircha buyurtma yo‘q." />
        </Card>
      ) : (
        <div className="space-y-3">
          {list.map((b) => (
            <Link key={b.id} to={`/bookings/${b.id}`}>
              <Card className="flex flex-col gap-3 p-5 transition hover:shadow-card sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{b.title}</h3>
                    <StatusBadge status={b.status} />
                  </div>
                  <p className="mt-1 flex items-center gap-1 text-sm text-gray-400">
                    <HiOutlineMapPin className="h-4 w-4" /> {b.address}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-400">{formatDateTime(b.created_at)}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary-600">{formatMoney(b.price_agreed)}</p>
                  {b.worker_name && <p className="text-xs text-gray-400">{b.worker_name}</p>}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings;
