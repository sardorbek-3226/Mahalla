import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { HiMagnifyingGlass } from 'react-icons/hi2';
import PageHeader from '@/components/common/PageHeader';
import WorkerCard from '@/components/common/WorkerCard';
import { Input, SkeletonCard, EmptyState } from '@/components/ui';
import { workerService, categoryService } from '@/services/workerService';

const Search = () => {
  const { t } = useTranslation();
  const [q, setQ] = useState('');
  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: categoryService.list });
  const cats = categories?.items || categories || [];

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['search', q],
    queryFn: () => workerService.list({ q: q || undefined }),
    enabled: q.length > 0,
  });
  const results = data?.items || data || [];

  return (
    <div>
      <PageHeader title={t('features.search.title')} subtitle={t('features.search.subtitle')} />

      <div className="mx-auto mb-6 max-w-xl">
        <Input
          autoFocus
          placeholder={t('features.search.placeholder')}
          leftIcon={<HiMagnifyingGlass className="h-5 w-5" />}
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {!q ? (
        <div>
          <p className="mb-3 text-center text-sm text-gray-400">{t('features.search.popularCategories')}</p>
          <div className="flex flex-wrap justify-center gap-2">
            {cats.map((c) => (
              <button
                key={c.id}
                onClick={() => setQ(c.name)}
                className="rounded-full bg-gray-100 px-4 py-2 text-sm transition hover:bg-primary-50 hover:text-primary-600 dark:bg-gray-800"
              >
                {c.icon} {c.name}
              </button>
            ))}
          </div>
        </div>
      ) : isLoading || isFetching ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}</div>
      ) : results.length === 0 ? (
        <EmptyState title={t('features.search.noResultsTitle')} description={t('features.search.noResultsDescription', { query: q })} />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((w) => <WorkerCard key={w.id} worker={w} />)}
        </div>
      )}
    </div>
  );
};

export default Search;
