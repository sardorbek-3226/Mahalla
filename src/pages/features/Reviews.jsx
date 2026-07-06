import { useQuery } from '@tanstack/react-query';
import { HiOutlineStar } from 'react-icons/hi2';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/ui/Card';
import { Avatar, Rating, Skeleton, EmptyState } from '@/components/ui';
import { reviewService } from '@/services/communityService';
import { timeAgo } from '@/utils/format';

const Reviews = () => {
  const { data, isLoading } = useQuery({ queryKey: ['reviews'], queryFn: () => reviewService.listAll() });
  const items = data?.items || data || [];

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Sharhlar" subtitle="Ustalar haqida so‘nggi sharhlar" />

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}</div>
      ) : items.length === 0 ? (
        <EmptyState icon={HiOutlineStar} title="Sharh yo‘q" />
      ) : (
        <div className="space-y-3">
          {items.map((r) => (
            <Card key={r.id} className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar name={r.author_name} size="sm" />
                  <div>
                    <p className="text-sm font-medium">{r.author_name}</p>
                    <p className="text-xs text-gray-400">→ {r.worker_name}</p>
                  </div>
                </div>
                <Rating value={r.rating} size="sm" />
              </div>
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">{r.comment}</p>
              <p className="mt-2 text-xs text-gray-400">{timeAgo(r.created_at)}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reviews;
