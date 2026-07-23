import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { HiOutlineMapPin, HiOutlineGlobeAlt, HiPlus, HiOutlineBuildingOffice2 } from 'react-icons/hi2';
import PageHeader from '@/components/common/PageHeader';
import Card, { CardHeader } from '@/components/ui/Card';
import { Input, Button, Modal, Badge, Skeleton, EmptyState } from '@/components/ui';
import { regionService, mahallaService } from '@/services/geoService';
import { queryClient } from '@/config/queryClient';

const LocationsAdmin = () => {
  const { t } = useTranslation();
  const [regionOpen, setRegionOpen] = useState(false);
  const [mahallaOpen, setMahallaOpen] = useState(false);
  const regionForm = useForm();
  const mahallaForm = useForm();

  const { data: rData, isLoading: rLoading } = useQuery({ queryKey: ['regions'], queryFn: regionService.list });
  const { data: mData, isLoading: mLoading } = useQuery({ queryKey: ['mahallas'], queryFn: () => mahallaService.list() });
  const regions = rData?.items || rData || [];
  const mahallas = mData?.items || mData || [];

  const createRegion = useMutation({
    mutationFn: (p) => regionService.create(p),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['regions'] }); toast.success(t('admin.locationsAdmin.regionAdded')); regionForm.reset(); setRegionOpen(false); },
    onError: (e) => toast.error(e.response?.data?.message || t('admin.locationsAdmin.error')),
  });
  const createMahalla = useMutation({
    mutationFn: (p) => mahallaService.create({ ...p, lat: p.lat ? Number(p.lat) : undefined, lng: p.lng ? Number(p.lng) : undefined }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['mahallas'] }); toast.success(t('admin.locationsAdmin.mahallaAdded')); mahallaForm.reset(); setMahallaOpen(false); },
    onError: (e) => toast.error(e.response?.data?.message || t('admin.locationsAdmin.error')),
  });

  return (
    <div>
      <PageHeader title={t('admin.locationsAdmin.title')} subtitle={t('admin.locationsAdmin.subtitle')} />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Regions */}
        <Card>
          <CardHeader
            title={t('admin.locationsAdmin.regions')}
            subtitle={t('admin.locationsAdmin.count', { count: regions.length })}
            action={<Button size="sm" variant="outline" leftIcon={<HiPlus className="h-4 w-4" />} onClick={() => setRegionOpen(true)}>{t('admin.locationsAdmin.add')}</Button>}
          />
          {rLoading ? (
            <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-xl" />)}</div>
          ) : regions.length === 0 ? (
            <EmptyState icon={HiOutlineGlobeAlt} title={t('admin.locationsAdmin.noRegions')} />
          ) : (
            <ul className="space-y-2">
              {regions.map((r) => (
                <li key={r.id} className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3 dark:border-gray-800">
                  <span className="flex items-center gap-2 font-medium"><HiOutlineGlobeAlt className="h-5 w-5 text-primary-600" /> {r.name}</span>
                  <Badge tone="gray">{t('admin.locationsAdmin.mahallaCount', { count: r.mahallas_count })}</Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Mahallas */}
        <Card>
          <CardHeader
            title={t('admin.locationsAdmin.mahallas')}
            subtitle={t('admin.locationsAdmin.count', { count: mahallas.length })}
            action={<Button size="sm" variant="outline" leftIcon={<HiPlus className="h-4 w-4" />} onClick={() => setMahallaOpen(true)} disabled={!regions.length}>{t('admin.locationsAdmin.add')}</Button>}
          />
          {mLoading ? (
            <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-xl" />)}</div>
          ) : mahallas.length === 0 ? (
            <EmptyState icon={HiOutlineBuildingOffice2} title={t('admin.locationsAdmin.noMahallas')} />
          ) : (
            <ul className="space-y-2">
              {mahallas.map((m) => (
                <li key={m.id} className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3 dark:border-gray-800">
                  <span className="flex items-center gap-2 font-medium"><HiOutlineMapPin className="h-5 w-5 text-primary-600" /> {m.name}</span>
                  <span className="text-xs text-gray-400">{m.district} · {m.region_name}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* Region modal */}
      <Modal open={regionOpen} onClose={() => setRegionOpen(false)} title={t('admin.locationsAdmin.newRegion')}>
        <form onSubmit={regionForm.handleSubmit(createRegion.mutate)} className="space-y-4">
          <Input label={t('admin.locationsAdmin.regionName')} error={regionForm.formState.errors.name?.message} {...regionForm.register('name', { required: t('admin.locationsAdmin.nameRequired') })} />
          <Button type="submit" variant="gradient" className="w-full" loading={createRegion.isPending}>{t('admin.locationsAdmin.add')}</Button>
        </form>
      </Modal>

      {/* Mahalla modal */}
      <Modal open={mahallaOpen} onClose={() => setMahallaOpen(false)} title={t('admin.locationsAdmin.newMahalla')}>
        <form onSubmit={mahallaForm.handleSubmit(createMahalla.mutate)} className="space-y-4">
          <Input label={t('admin.locationsAdmin.mahallaName')} error={mahallaForm.formState.errors.name?.message} {...mahallaForm.register('name', { required: t('admin.locationsAdmin.nameRequired') })} />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.locationsAdmin.region')}</label>
            <select className="input-base" {...mahallaForm.register('region_id', { required: true })}>
              {regions.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
          <Input label={t('admin.locationsAdmin.district')} {...mahallaForm.register('district')} />
          <div className="grid grid-cols-2 gap-3">
            <Input label={t('admin.locationsAdmin.lat')} type="number" step="any" {...mahallaForm.register('lat')} />
            <Input label={t('admin.locationsAdmin.lng')} type="number" step="any" {...mahallaForm.register('lng')} />
          </div>
          <Button type="submit" variant="gradient" className="w-full" loading={createMahalla.isPending}>{t('admin.locationsAdmin.add')}</Button>
        </form>
      </Modal>
    </div>
  );
};

export default LocationsAdmin;
