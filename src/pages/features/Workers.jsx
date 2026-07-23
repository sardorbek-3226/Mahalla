import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { HiMagnifyingGlass, HiOutlineUsers } from 'react-icons/hi2';
import PageHeader from '@/components/common/PageHeader';
import WorkerCard from '@/components/common/WorkerCard';
import { Button, Input, EmptyState, SkeletonCard } from '@/components/ui';
import { workerService, categoryService } from '@/services/workerService';
import { regionService, mahallaService } from '@/services/geoService';
import { useAuth } from '@/hooks/useAuth';
import { UZ_REGIONS, districtsOf } from '@/constants/uzbekistan';
import { getRegisteredLocation } from '@/utils/registeredLocation';

const Workers = () => {
  const { t } = useTranslation();
  const SORTS = [
    { value: '', label: t('workers.sorts.recommended') },
    { value: 'rating', label: t('workers.sorts.rating') },
    { value: 'price', label: t('workers.sorts.price') },
  ];

  const { user } = useAuth();
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  // Same viloyat/tuman picker as Register — defaults to what the user picked at
  // registration (the backend doesn't reliably persist it yet — see
  // registeredLocation.js). User can widen the search below.
  const [saved] = useState(() => getRegisteredLocation(user?.phone));
  const [viloyat, setViloyat] = useState(saved?.viloyat || '');
  const [tuman, setTuman] = useState(saved?.tuman || '');
  const [mahallaId, setMahallaId] = useState(saved?.mahallaId || user?.mahalla_id || '');

  const tumanlar = districtsOf(viloyat);

  // The backend has real mahalla records for some viloyat (matched by name) —
  // fetch them when available so the mahalla dropdown/filter uses a real id.
  const { data: regionsData } = useQuery({ queryKey: ['regions'], queryFn: regionService.list });
  const regions = regionsData?.items || regionsData || [];
  const matchedRegion = regions.find((r) => r.name.toLowerCase() === viloyat.toLowerCase());

  const { data: mahallasData } = useQuery({
    queryKey: ['mahallas', matchedRegion?.id],
    queryFn: () => mahallaService.list({ regionId: matchedRegion.id }),
    enabled: !!matchedRegion,
  });
  const mahallas = mahallasData?.items || mahallasData || [];
  const mahallasInDistrict = tuman ? mahallas.filter((m) => m.district === tuman) : mahallas;

  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: categoryService.list });
  const { data, isLoading } = useQuery({
    queryKey: ['workers', { q, category, onlyAvailable, mahallaId }],
    queryFn: () =>
      workerService.list({
        q: q || undefined,
        category_id: category || undefined,
        available: onlyAvailable || undefined,
        mahalla_id: mahallaId || undefined,
      }),
  });

  // The backend has no sort param for GET /providers, so sort client-side.
  const workers = [...(data?.items || data || [])].sort((a, b) => {
    if (sort === 'rating') return (b.rating_avg ?? 0) - (a.rating_avg ?? 0);
    if (sort === 'price') return (a.price_from ?? 0) - (b.price_from ?? 0);
    return 0;
  });
  const cats = categories?.items || categories || [];

  const clearRegion = () => {
    setViloyat('');
    setTuman('');
    setMahallaId('');
  };

  return (
    <div>
      <PageHeader title={t('workers.title')} subtitle={t('workers.subtitle')} />

      {/* Filters */}
      <div className="mb-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Input
          placeholder={t('workers.searchPlaceholder')}
          leftIcon={<HiMagnifyingGlass className="h-4 w-4" />}
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select className="input-base" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">{t('workers.allCategories')}</option>
          {cats.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select className="input-base" value={sort} onChange={(e) => setSort(e.target.value)}>
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 px-4 text-sm dark:border-gray-700">
          <input
            type="checkbox"
            className="accent-primary-600"
            checked={onlyAvailable}
            onChange={(e) => setOnlyAvailable(e.target.checked)}
          />
          {t('workers.onlyAvailable')}
        </label>
      </div>

      {/* Viloyat / tuman / mahalla bo'yicha saralash — ro'yxatdan o'tishdagi kabi */}
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <select
          className="input-base"
          value={viloyat}
          onChange={(e) => {
            setViloyat(e.target.value);
            setTuman('');
            setMahallaId('');
          }}
        >
          <option value="">{t('workers.region')}</option>
          {UZ_REGIONS.map((r) => (
            <option key={r.name} value={r.name}>{r.name}</option>
          ))}
        </select>
        <select
          className="input-base"
          value={tuman}
          onChange={(e) => {
            setTuman(e.target.value);
            setMahallaId('');
          }}
          disabled={!viloyat}
        >
          <option value="">{t('workers.district')}</option>
          {tumanlar.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <select
          className="input-base"
          value={mahallaId}
          onChange={(e) => setMahallaId(e.target.value)}
          disabled={!viloyat}
        >
          <option value="">{t('workers.mahalla')}</option>
          {mahallasInDistrict.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
        {(viloyat || mahallaId) && (
          <Button variant="outline" onClick={clearRegion}>
            {t('workers.clearRegion')}
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : workers.length === 0 ? (
        <EmptyState
          icon={HiOutlineUsers}
          title={t('workers.empty.title')}
          description={
            mahallaId
              ? t('workers.empty.regionDescription')
              : t('workers.empty.defaultDescription')
          }
          action={
            mahallaId && (
              <Button variant="outline" onClick={clearRegion}>
                {t('workers.empty.viewAllRegions')}
              </Button>
            )
          }
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {workers.map((w) => <WorkerCard key={w.id} worker={w} />)}
        </div>
      )}
    </div>
  );
};

export default Workers;
