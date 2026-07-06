import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { HiOutlineWrenchScrewdriver, HiPlus, HiOutlineTrash, HiOutlinePencilSquare } from 'react-icons/hi2';
import PageHeader from '@/components/common/PageHeader';
import Card, { CardHeader } from '@/components/ui/Card';
import { Input, Button, Modal, Badge, Skeleton, EmptyState } from '@/components/ui';
import { workerService, categoryService } from '@/services/workerService';
import { fetchCurrentUser } from '@/redux/slices/authSlice';
import { queryClient } from '@/config/queryClient';
import { useAuth } from '@/hooks/useAuth';
import { formatMoney } from '@/utils/format';

const UNITS = [
  { value: 'HOUR', label: 'soat' },
  { value: 'DAY', label: 'kun' },
  { value: 'PROJECT', label: 'loyiha' },
];

const ProviderServices = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const providerId = user?.provider_profile_id;

  const profileForm = useForm({ defaultValues: { bio: '', experience_years: 1 } });
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const svcForm = useForm();

  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: categoryService.list });
  const cats = categories?.items || categories || [];

  const { data: provider, isLoading } = useQuery({
    queryKey: ['provider', providerId],
    queryFn: () => workerService.getById(providerId),
    enabled: !!providerId,
  });
  const services = provider?.services || [];

  const createProfile = useMutation({
    mutationFn: (p) => workerService.upsertProfile(p),
    onSuccess: async () => { await dispatch(fetchCurrentUser()); toast.success('Profil yaratildi'); },
    onError: (e) => toast.error(e.response?.data?.message || 'Xatolik'),
  });

  const availability = useMutation({
    mutationFn: (val) => workerService.setAvailability(val),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['provider', providerId] }); toast.success('Holat yangilandi'); },
  });

  const saveService = useMutation({
    mutationFn: (p) => (editing ? workerService.updateService(editing.id, p) : workerService.addService(p)),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['provider', providerId] }); toast.success('Saqlandi'); setOpen(false); },
    onError: (e) => toast.error(e.response?.data?.message || 'Xatolik'),
  });
  const removeService = useMutation({
    mutationFn: (id) => workerService.deleteService(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['provider', providerId] }); toast.success('O‘chirildi'); },
  });

  const openNew = () => { setEditing(null); svcForm.reset({ category_id: cats[0]?.id, title: '', description: '', price_from: '', price_unit: 'HOUR' }); setOpen(true); };
  const openEdit = (s) => { setEditing(s); svcForm.reset({ title: s.title, description: s.description, price_from: s.price_from, price_unit: (s.price_unit || 'hour').toUpperCase() }); setOpen(true); };

  // Provider profile not created yet.
  if (!providerId) {
    return (
      <div className="mx-auto max-w-lg">
        <PageHeader title="Usta profili" subtitle="Xizmat ko‘rsatish uchun avval profilingizni yarating" />
        <Card className="p-6">
          <form onSubmit={profileForm.handleSubmit(createProfile.mutate)} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">O‘zingiz haqingizda</label>
              <textarea rows={4} className="input-base resize-none" placeholder="Tajriba va ko‘nikmalaringiz…" {...profileForm.register('bio')} />
            </div>
            <Input label="Tajriba (yil)" type="number" {...profileForm.register('experience_years', { valueAsNumber: true })} />
            <Button type="submit" variant="gradient" className="w-full" loading={createProfile.isPending}>Profil yaratish</Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Mening xizmatlarim"
        subtitle="Xizmatlar va narxlarni boshqaring"
        actions={<Button variant="gradient" leftIcon={<HiPlus className="h-4 w-4" />} onClick={openNew}>Xizmat qo‘shish</Button>}
      />

      {/* Availability */}
      <Card className="mb-5 flex items-center justify-between p-5">
        <div>
          <p className="font-medium">Ish holati</p>
          <p className="text-sm text-gray-400">{provider?.is_available ? 'Hozir buyurtma qabul qilyapsiz' : 'Hozir band'}</p>
        </div>
        <button
          onClick={() => availability.mutate(!provider?.is_available)}
          className={`relative h-7 w-12 rounded-full transition ${provider?.is_available ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'}`}
        >
          <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white transition ${provider?.is_available ? 'left-[1.4rem]' : 'left-0.5'}`} />
        </button>
      </Card>

      <Card>
        <CardHeader title="Xizmatlar" subtitle={`${services.length} ta`} />
        {isLoading ? (
          <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}</div>
        ) : services.length === 0 ? (
          <EmptyState icon={HiOutlineWrenchScrewdriver} title="Xizmat yo‘q" description="Birinchi xizmatingizni qo‘shing." />
        ) : (
          <ul className="space-y-2">
            {services.map((s) => (
              <li key={s.id} className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3 dark:border-gray-800">
                <div>
                  <p className="font-medium">{s.title}</p>
                  <p className="text-xs text-gray-400">{s.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone="green">{formatMoney(s.price_from)} / {s.price_unit}</Badge>
                  <button onClick={() => openEdit(s)} className="p-1.5 text-gray-400 hover:text-primary-600"><HiOutlinePencilSquare className="h-5 w-5" /></button>
                  <button onClick={() => removeService.mutate(s.id)} className="p-1.5 text-gray-400 hover:text-red-500"><HiOutlineTrash className="h-5 w-5" /></button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Xizmatni tahrirlash' : 'Yangi xizmat'}>
        <form onSubmit={svcForm.handleSubmit((v) => saveService.mutate({ ...v, price_from: Number(v.price_from) }))} className="space-y-4">
          {!editing && (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Kategoriya</label>
              <select className="input-base" {...svcForm.register('category_id', { required: true })}>
                {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          )}
          <Input label="Xizmat nomi" error={svcForm.formState.errors.title?.message} {...svcForm.register('title', { required: 'Nomini kiriting' })} />
          <Input label="Tavsif" {...svcForm.register('description')} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Narx (dan)" type="number" {...svcForm.register('price_from')} />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Birlik</label>
              <select className="input-base" {...svcForm.register('price_unit')}>
                {UNITS.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
              </select>
            </div>
          </div>
          <Button type="submit" variant="gradient" className="w-full" loading={saveService.isPending}>Saqlash</Button>
        </form>
      </Modal>
    </div>
  );
};

export default ProviderServices;
