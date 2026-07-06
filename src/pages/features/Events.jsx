import { useQuery } from '@tanstack/react-query';
import { HiOutlineCalendarDays, HiOutlineMapPin, HiOutlineUsers } from 'react-icons/hi2';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/ui/Card';
import { Button, Skeleton, EmptyState } from '@/components/ui';
import { eventService } from '@/services/communityService';
import { formatDateTime } from '@/utils/format';

const Events = () => {
  const { data, isLoading } = useQuery({ queryKey: ['events'], queryFn: () => eventService.list() });
  const items = data?.items || data || [];

  return (
    <div>
      <PageHeader title="Tadbirlar" subtitle="Mahalladagi yaqinlashayotgan tadbirlar" />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-2xl" />)}</div>
      ) : items.length === 0 ? (
        <EmptyState icon={HiOutlineCalendarDays} title="Tadbir yo‘q" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((e) => (
            <Card key={e.id} className="flex flex-col p-5">
              <div className="flex items-start justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-accent-600 text-white">
                  <HiOutlineCalendarDays className="h-6 w-6" />
                </span>
                <span className="text-sm font-medium text-primary-600">{formatDateTime(e.date)}</span>
              </div>
              <h3 className="mt-4 font-semibold">{e.title}</h3>
              <p className="mt-1 flex items-center gap-1 text-sm text-gray-400"><HiOutlineMapPin className="h-4 w-4" /> {e.place}</p>
              <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-800">
                <span className="flex items-center gap-1 text-sm text-gray-400"><HiOutlineUsers className="h-4 w-4" /> {e.attendees} ishtirokchi</span>
                <Button size="sm" variant="outline">Qatnashish</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
