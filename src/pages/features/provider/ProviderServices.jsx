import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { HiOutlineWrenchScrewdriver, HiPlus, HiOutlineTrash, HiOutlinePencilSquare } from 'react-icons/hi2';
import PageHeader from '@/components/common/PageHeader';
import Card, { CardHeader } from '@/components/ui/Card';
import { Input, Button, Modal, Badge, Skeleton, EmptyState } from '@/components/ui';
import { workerService, categoryService } from '@/services/workerService';
import { fetchCurrentUser } from '@/redux/slices/authSlice';
import { queryClient } from '@/config/queryClient';
import { useAuth } from '@/hooks/useAuth';
import { formatMoney } from '@/utils/format';

const ProviderServices = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const dispatch = useDispatch();
  const providerId = user?.provider_profile_id;

  const UNITS = [
    { value: 'HOUR', label: t('features.providerServices.unitHour') },
    { value: 'DAY', label: t('features.providerServices.unitDay') },
    { value: 'PROJECT', label: t('features.providerServices.unitProject') },
  ];

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
    onSuccess: async () => { await dispatch(fetchCurrentUser()); toast.success(t('features.providerServices.profileCreated')); },
    onError: (e) => toast.error(e.response?.data?.message || t('features.providerServices.genericError')),
  });

  const availability = useMutation({
    mutationFn: (val) => workerService.setAvailability(val),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['provider', providerId] }); toast.success(t('features.providerServices.availabilityUpdated')); },
  });

  const saveService = useMutation({
    mutationFn: (p) => (editing ? workerService.updateService(editing.id, p) : workerService.addService(p)),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['provider', providerId] }); toast.success(t('features.providerServices.saved')); setOpen(false); },
    onError: (e) => toast.error(e.response?.data?.message || t('features.providerServices.genericError')),
  });
  const removeService = useMutation({
    mutationFn: (id) => workerService.deleteService(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['provider', providerId] }); toast.success(t('features.providerServices.deleted')); },
  });

  const openNew = () => { setEditing(null); svcForm.reset({ category_id: cats[0]?.id, title: '', description: '', price_from: '', price_unit: 'HOUR' }); setOpen(true); };
  const openEdit = (s) => { setEditing(s); svcForm.reset({ title: s.title, description: s.description, price_from: s.price_from, price_unit: (s.price_unit || 'hour').toUpperCase() }); setOpen(true); };

  // Provider profile not created yet.
  if (!providerId) {
    return (
      <div className="mx-auto max-w-lg">
        <PageHeader title={t('features.providerServices.noProfileTitle')} subtitle={t('features.providerServices.noProfileSubtitle')} />
        <Card className="p-6">
          <form onSubmit={profileForm.handleSubmit(createProfile.mutate)} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">{t('features.providerServices.aboutYou')}</label>
              <textarea rows={4} className="input-base resize-none" placeholder={t('features.providerServices.aboutPlaceholder')} {...profileForm.register('bio')} />
            </div>
            <Input label={t('features.providerServices.experienceYears')} type="number" {...profileForm.register('experience_years', { valueAsNumber: true })} />
            <Button type="submit" variant="gradient" className="w-full" loading={createProfile.isPending}>{t('features.providerServices.createProfile')}</Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={t('features.providerServices.title')}
        subtitle={t('features.providerServices.subtitle')}
        actions={<Button variant="gradient" leftIcon={<HiPlus className="h-4 w-4" />} onClick={openNew}>{t('features.providerServices.addService')}</Button>}
      />

      {/* Availability */}
      <Card className="mb-5 flex items-center justify-between p-5">
        <div>
          <p className="font-medium">{t('features.providerServices.availabilityStatus')}</p>
          <p className="text-sm text-gray-400">{provider?.is_available ? t('features.providerServices.availableNow') : t('features.providerServices.busyNow')}</p>
        </div>
        <button
          onClick={() => availability.mutate(!provider?.is_available)}
          className={`relative h-7 w-12 rounded-full transition ${provider?.is_available ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'}`}
        >
          <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white transition ${provider?.is_available ? 'left-[1.4rem]' : 'left-0.5'}`} />
        </button>
      </Card>

      <Card>
        <CardHeader title={t('features.providerServices.servicesListTitle')} subtitle={t('features.providerServices.servicesCount', { count: services.length })} />
        {isLoading ? (
          <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}</div>
        ) : services.length === 0 ? (
          <EmptyState icon={HiOutlineWrenchScrewdriver} title={t('features.providerServices.noServicesTitle')} description={t('features.providerServices.noServicesDesc')} />
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

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? t('features.providerServices.editServiceTitle') : t('features.providerServices.newServiceTitle')}>
        <form onSubmit={svcForm.handleSubmit((v) => saveService.mutate({ ...v, price_from: Number(v.price_from) }))} className="space-y-4">
          {!editing && (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">{t('features.providerServices.category')}</label>
              <select className="input-base" {...svcForm.register('category_id', { required: true })}>
                {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          )}
          <Input label={t('features.providerServices.serviceName')} error={svcForm.formState.errors.title?.message} {...svcForm.register('title', { required: t('features.providerServices.nameRequired') })} />
          <Input label={t('features.providerServices.description')} {...svcForm.register('description')} />
          <div className="grid grid-cols-2 gap-3">
            <Input label={t('features.providerServices.priceFrom')} type="number" {...svcForm.register('price_from')} />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">{t('features.providerServices.unit')}</label>
              <select className="input-base" {...svcForm.register('price_unit')}>
                {UNITS.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
              </select>
            </div>
          </div>
          <Button type="submit" variant="gradient" className="w-full" loading={saveService.isPending}>{t('features.providerServices.save')}</Button>
        </form>
      </Modal>
    </div>
  );
};

export default ProviderServices;
