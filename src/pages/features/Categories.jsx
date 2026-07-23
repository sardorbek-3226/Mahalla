import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/ui/Card';
import { Skeleton } from '@/components/ui';
import { categoryService } from '@/services/workerService';

const Categories = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({ queryKey: ['categories'], queryFn: categoryService.list });
  const cats = data?.items || data || [];

  return (
    <div>
      <PageHeader title={t('features.categories.title')} subtitle={t('features.categories.subtitle')} />
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {cats.map((c) => (
            <Card
              key={c.id}
              onClick={() => navigate('/workers')}
              className="flex cursor-pointer flex-col items-center justify-center gap-2 p-6 text-center transition hover:-translate-y-0.5 hover:shadow-card"
            >
              <span className="text-4xl">{c.icon}</span>
              <span className="font-semibold">{c.name}</span>
              <span className="text-xs text-gray-400">{t('features.categories.workersCount', { count: c.count })}</span>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;
