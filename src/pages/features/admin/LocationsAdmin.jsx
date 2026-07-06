import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { HiOutlineMapPin, HiOutlineGlobeAlt, HiPlus, HiOutlineBuildingOffice2 } from 'react-icons/hi2';
import PageHeader from '@/components/common/PageHeader';
import Card, { CardHeader } from '@/components/ui/Card';
import { Input, Button, Modal, Badge, Skeleton, EmptyState } from '@/components/ui';
import { regionService, mahallaService } from '@/services/geoService';
import { queryClient } from '@/config/queryClient';

const LocationsAdmin = () => {
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
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['regions'] }); toast.success('Viloyat qo‘shildi'); regionForm.reset(); setRegionOpen(false); },
    onError: (e) => toast.error(e.response?.data?.message || 'Xatolik'),
  });
  const createMahalla = useMutation({
    mutationFn: (p) => mahallaService.create({ ...p, lat: p.lat ? Number(p.lat) : undefined, lng: p.lng ? Number(p.lng) : undefined }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['mahallas'] }); toast.success('Mahalla qo‘shildi'); mahallaForm.reset(); setMahallaOpen(false); },
    onError: (e) => toast.error(e.response?.data?.message || 'Xatolik'),
  });

  return (
    <div>
      <PageHeader title="Hududlar boshqaruvi" subtitle="Viloyatlar va mahallalarni boshqaring" />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Regions */}
        <Card>
          <CardHeader
            title="Viloyatlar"
            subtitle={`${regions.length} ta`}
            action={<Button size="sm" variant="outline" leftIcon={<HiPlus className="h-4 w-4" />} onClick={() => setRegionOpen(true)}>Qo‘shish</Button>}
          />
          {rLoading ? (
            <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-xl" />)}</div>
          ) : regions.length === 0 ? (
            <EmptyState icon={HiOutlineGlobeAlt} title="Viloyat yo‘q" />
          ) : (
            <ul className="space-y-2">
              {regions.map((r) => (
                <li key={r.id} className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3 dark:border-gray-800">
                  <span className="flex items-center gap-2 font-medium"><HiOutlineGlobeAlt className="h-5 w-5 text-primary-600" /> {r.name}</span>
                  <Badge tone="gray">{r.mahallas_count} mahalla</Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Mahallas */}
        <Card>
          <CardHeader
            title="Mahallalar"
            subtitle={`${mahallas.length} ta`}
            action={<Button size="sm" variant="outline" leftIcon={<HiPlus className="h-4 w-4" />} onClick={() => setMahallaOpen(true)} disabled={!regions.length}>Qo‘shish</Button>}
          />
          {mLoading ? (
            <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-xl" />)}</div>
          ) : mahallas.length === 0 ? (
            <EmptyState icon={HiOutlineBuildingOffice2} title="Mahalla yo‘q" />
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
      <Modal open={regionOpen} onClose={() => setRegionOpen(false)} title="Yangi viloyat">
        <form onSubmit={regionForm.handleSubmit(createRegion.mutate)} className="space-y-4">
          <Input label="Viloyat nomi" error={regionForm.formState.errors.name?.message} {...regionForm.register('name', { required: 'Nomini kiriting' })} />
          <Button type="submit" variant="gradient" className="w-full" loading={createRegion.isPending}>Qo‘shish</Button>
        </form>
      </Modal>

      {/* Mahalla modal */}
      <Modal open={mahallaOpen} onClose={() => setMahallaOpen(false)} title="Yangi mahalla">
        <form onSubmit={mahallaForm.handleSubmit(createMahalla.mutate)} className="space-y-4">
          <Input label="Mahalla nomi" error={mahallaForm.formState.errors.name?.message} {...mahallaForm.register('name', { required: 'Nomini kiriting' })} />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Viloyat</label>
            <select className="input-base" {...mahallaForm.register('region_id', { required: true })}>
              {regions.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
          <Input label="Tuman" {...mahallaForm.register('district')} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Lat" type="number" step="any" {...mahallaForm.register('lat')} />
            <Input label="Lng" type="number" step="any" {...mahallaForm.register('lng')} />
          </div>
          <Button type="submit" variant="gradient" className="w-full" loading={createMahalla.isPending}>Qo‘shish</Button>
        </form>
      </Modal>
    </div>
  );
};

export default LocationsAdmin;
