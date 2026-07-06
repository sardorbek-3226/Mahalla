import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { HiOutlineCheckBadge, HiCheck, HiXMark } from 'react-icons/hi2';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/ui/Card';
import { Avatar, Button, Badge, Skeleton, EmptyState, Rating } from '@/components/ui';
import { adminService } from '@/services/adminService';
import { queryClient } from '@/config/queryClient';

const AdminWorkers = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'pending-workers'],
    queryFn: () => adminService.pendingWorkers(),
  });
  const workers = data?.items || data || [];

  const verify = useMutation({
    mutationFn: ({ id, status }) => adminService.verifyWorker(id, status),
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'pending-workers'] });
      toast.success(status === 'verified' ? 'Usta tasdiqlandi' : 'Usta rad etildi');
    },
  });

  return (
    <div>
      <PageHeader title="Ustalarni tasdiqlash" subtitle="Verifikatsiya kutayotgan ustalar" />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-2xl" />)}</div>
      ) : workers.length === 0 ? (
        <Card className="p-0"><EmptyState icon={HiOutlineCheckBadge} title="Hammasi tasdiqlangan" description="Kutilayotgan ariza yo‘q." /></Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {workers.map((w) => (
            <Card key={w.id} className="p-5">
              <div className="flex items-start gap-3">
                <Avatar name={w.full_name} size="md" />
                <div className="flex-1">
                  <h3 className="font-semibold">{w.full_name}</h3>
                  <p className="text-sm text-primary-600">{w.category_name}</p>
                  <Rating value={w.rating_avg} count={w.rating_count} size="sm" />
                </div>
                <Badge tone="amber" dot>Kutilmoqda</Badge>
              </div>
              <p className="mt-3 line-clamp-2 text-sm text-gray-500">{w.bio}</p>
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="gradient" className="flex-1" loading={verify.isPending} leftIcon={<HiCheck className="h-4 w-4" />} onClick={() => verify.mutate({ id: w.id, status: 'verified' })}>
                  Tasdiqlash
                </Button>
                <Button size="sm" variant="outline" leftIcon={<HiXMark className="h-4 w-4" />} onClick={() => verify.mutate({ id: w.id, status: 'rejected' })}>
                  Rad etish
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminWorkers;
