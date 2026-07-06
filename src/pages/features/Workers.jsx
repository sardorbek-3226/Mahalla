import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { HiMagnifyingGlass, HiOutlineUsers } from 'react-icons/hi2';
import PageHeader from '@/components/common/PageHeader';
import WorkerCard from '@/components/common/WorkerCard';
import { Input, EmptyState, SkeletonCard } from '@/components/ui';
import { workerService, categoryService } from '@/services/workerService';

const SORTS = [
  { value: '', label: 'Tavsiya etilgan' },
  { value: 'rating', label: 'Reyting bo‘yicha' },
  { value: 'price', label: 'Narx bo‘yicha' },
];

const Workers = () => {
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: categoryService.list });
  const { data, isLoading } = useQuery({
    queryKey: ['workers', { q, category, sort, onlyAvailable }],
    queryFn: () =>
      workerService.list({
        q: q || undefined,
        category_id: category || undefined,
        sort: sort || undefined,
        available: onlyAvailable || undefined,
      }),
  });

  const workers = data?.items || data || [];
  const cats = categories?.items || categories || [];

  return (
    <div>
      <PageHeader title="Ustalar" subtitle="Tekshirilgan ustalarni toping va buyurtma bering" />

      {/* Filters */}
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Input
          placeholder="Usta yoki kasb qidirish…"
          leftIcon={<HiMagnifyingGlass className="h-4 w-4" />}
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select className="input-base" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Barcha kategoriyalar</option>
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
          Faqat bo‘sh ustalar
        </label>
      </div>

      {isLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : workers.length === 0 ? (
        <EmptyState icon={HiOutlineUsers} title="Usta topilmadi" description="Filtrlarni o‘zgartirib ko‘ring." />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {workers.map((w) => <WorkerCard key={w.id} worker={w} />)}
        </div>
      )}
    </div>
  );
};

export default Workers;
