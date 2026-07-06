import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { HiOutlineUsers } from 'react-icons/hi2';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/ui/Card';
import { Avatar, Button, Badge, Skeleton, EmptyState } from '@/components/ui';
import { adminService } from '@/services/adminService';
import { queryClient } from '@/config/queryClient';
import { ROLE_LABELS } from '@/constants/roles';

const AdminUsers = () => {
  const { data, isLoading } = useQuery({ queryKey: ['admin', 'users'], queryFn: () => adminService.users() });
  const users = data?.items || data || [];

  const block = useMutation({
    mutationFn: ({ id, blocked }) => adminService.blockUser(id, blocked),
    onSuccess: (_, { fullName, blocked }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success(blocked ? `${fullName} bloklandi` : `${fullName} blokdan chiqarildi`);
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Xatolik'),
  });

  return (
    <div>
      <PageHeader title="Foydalanuvchilar" subtitle="Platforma foydalanuvchilarini boshqarish" />
      <Card className="p-0">
        {isLoading ? (
          <div className="space-y-2 p-4">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}</div>
        ) : users.length === 0 ? (
          <EmptyState icon={HiOutlineUsers} title="Foydalanuvchi yo‘q" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-100 text-left text-gray-400 dark:border-gray-800">
                <tr>
                  <th className="px-5 py-3 font-medium">Foydalanuvchi</th>
                  <th className="px-5 py-3 font-medium">Telefon</th>
                  <th className="px-5 py-3 font-medium">Rol</th>
                  <th className="px-5 py-3 font-medium">Mahalla</th>
                  <th className="px-5 py-3 text-right font-medium">Amal</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-gray-50 last:border-0 dark:border-gray-800/50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar name={u.full_name} size="xs" />
                        <span className="font-medium">{u.full_name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-500">{u.phone}</td>
                    <td className="px-5 py-3"><Badge tone="blue">{ROLE_LABELS[u.role] || u.role}</Badge></td>
                    <td className="px-5 py-3 text-gray-500">{u.mahalla}</td>
                    <td className="px-5 py-3 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        loading={block.isPending}
                        onClick={() => block.mutate({ id: u.id, blocked: u.is_active, fullName: u.full_name })}
                      >
                        {u.is_active ? 'Bloklash' : 'Blokdan chiqarish'}
                      </Button>
                    </td>
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

export default AdminUsers;
