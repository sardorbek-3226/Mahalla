import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { HiOutlineShieldCheck, HiPlus, HiOutlineNoSymbol, HiOutlineUserPlus } from 'react-icons/hi2';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/ui/Card';
import { Avatar, Input, Button, Badge, Modal, Skeleton, EmptyState } from '@/components/ui';
import { adminService } from '@/services/adminService';
import { queryClient } from '@/config/queryClient';
import { usePermissions } from '@/hooks/usePermissions';
import { ROLE_LABELS, ROLE_SCOPE_FIELD } from '@/constants/roles';
import { formatDate } from '@/utils/format';

const SCOPE_LABEL = { region: 'Viloyat', district: 'Tuman', mahalla: 'Mahalla' };

const AdminManagement = () => {
  const { user, creatableRoles, canManageRole } = usePermissions();
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({
    defaultValues: { role: creatableRoles[0] || '' },
  });
  const selectedRole = watch('role');
  const scopeField = ROLE_SCOPE_FIELD[selectedRole];

  const { data, isLoading } = useQuery({ queryKey: ['admins'], queryFn: () => adminService.listAdmins() });
  const admins = data?.items || data || [];

  const create = useMutation({
    mutationFn: (payload) =>
      adminService.createAdmin({
        ...payload,
        actor: user?.full_name,
        actor_role: user?.role,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
      queryClient.invalidateQueries({ queryKey: ['audit-logs'] });
      toast.success('Administrator yaratildi');
      reset();
      setOpen(false);
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Yaratishda xatolik'),
  });

  const suspend = useMutation({
    mutationFn: (id) => adminService.suspendAdmin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
      toast.success('Hisob to‘xtatildi');
    },
  });

  const onSubmit = (values) => {
    // Privilege-escalation guard (frontend mirror; backend re-checks).
    if (!creatableRoles.includes(values.role)) {
      return toast.error('Bu rolni yaratishga ruxsatingiz yo‘q');
    }
    create.mutate(values);
  };

  const canCreate = creatableRoles.length > 0;

  return (
    <div>
      <PageHeader
        title="Administratorlar boshqaruvi"
        subtitle="Quyi darajadagi adminlarni yarating va boshqaring"
        actions={
          canCreate && (
            <Button variant="gradient" leftIcon={<HiPlus className="h-4 w-4" />} onClick={() => setOpen(true)}>
              Admin qo‘shish
            </Button>
          )
        }
      />

      {!canCreate && (
        <Card className="mb-5 flex items-center gap-3 border-l-4 border-l-amber-400 p-4 text-sm text-gray-600 dark:text-gray-300">
          <HiOutlineShieldCheck className="h-6 w-6 shrink-0 text-amber-500" />
          Sizning rolingiz yangi administrator yarata olmaydi. Yaratish huquqi yuqori darajadagi adminlarda.
        </Card>
      )}

      <Card className="p-0">
        {isLoading ? (
          <div className="space-y-2 p-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
        ) : admins.length === 0 ? (
          <EmptyState icon={HiOutlineShieldCheck} title="Administrator yo‘q" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-100 text-left text-gray-400 dark:border-gray-800">
                <tr>
                  <th className="px-5 py-3 font-medium">Administrator</th>
                  <th className="px-5 py-3 font-medium">Rol</th>
                  <th className="px-5 py-3 font-medium">Hudud</th>
                  <th className="px-5 py-3 font-medium">Yaratilgan</th>
                  <th className="px-5 py-3 font-medium">Holat</th>
                  <th className="px-5 py-3 text-right font-medium">Amal</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((a) => (
                  <tr key={a.id} className="border-b border-gray-50 last:border-0 dark:border-gray-800/50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar name={a.full_name} size="xs" />
                        <div>
                          <p className="font-medium">{a.full_name}</p>
                          <p className="text-xs text-gray-400">{a.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3"><Badge tone="blue">{ROLE_LABELS[a.role] || a.role}</Badge></td>
                    <td className="px-5 py-3 text-gray-500">{a.scope}</td>
                    <td className="px-5 py-3 text-gray-500">{formatDate(a.created_at)}</td>
                    <td className="px-5 py-3">
                      <Badge tone={a.is_active ? 'green' : 'red'} dot>{a.is_active ? 'Faol' : 'To‘xtatilgan'}</Badge>
                    </td>
                    <td className="px-5 py-3 text-right">
                      {a.is_active && canManageRole(a.role) && (
                        <Button size="sm" variant="outline" leftIcon={<HiOutlineNoSymbol className="h-4 w-4" />} onClick={() => suspend.mutate(a.id)}>
                          To‘xtatish
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Yangi administrator">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="To‘liq ism" leftIcon={<HiOutlineUserPlus className="h-4 w-4" />} error={errors.full_name?.message} {...register('full_name', { required: 'Ismni kiriting' })} />
          <Input label="Telefon" placeholder="+998…" error={errors.phone?.message} {...register('phone', { required: 'Telefon majburiy' })} />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Rol</label>
            <select className="input-base" {...register('role', { required: true })}>
              {creatableRoles.map((r) => (
                <option key={r} value={r}>{ROLE_LABELS[r]}</option>
              ))}
            </select>
          </div>
          {scopeField && (
            <Input
              label={`${SCOPE_LABEL[scopeField]} (tayinlash)`}
              placeholder={`${SCOPE_LABEL[scopeField]} nomi`}
              error={errors.scope?.message}
              {...register('scope', { required: 'Hududni kiriting' })}
            />
          )}
          <Button type="submit" variant="gradient" className="w-full" loading={create.isPending}>
            Yaratish
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default AdminManagement;
