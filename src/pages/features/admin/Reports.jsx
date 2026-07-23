import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { HiOutlineDocumentArrowDown, HiOutlineDocumentChartBar } from 'react-icons/hi2';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/ui/Card';
import { Button } from '@/components/ui';
import { formatDate } from '@/utils/format';

const REPORT_META = [
  { id: 'r1', key: 'monthlyOrders', size: 'PDF · 1.2 MB' },
  { id: 'r2', key: 'workersActivity', size: 'XLSX · 840 KB' },
  { id: 'r3', key: 'payments', size: 'PDF · 960 KB' },
  { id: 'r4', key: 'requests', size: 'PDF · 620 KB' },
];

const Reports = () => {
  const { t } = useTranslation();

  return (
    <div>
      <PageHeader
        title={t('admin.reports.title')}
        subtitle={t('admin.reports.subtitle')}
        actions={<Button variant="gradient" leftIcon={<HiOutlineDocumentChartBar className="h-4 w-4" />} onClick={() => toast.success(t('admin.reports.generatingToast'))}>{t('admin.reports.generate')}</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {REPORT_META.map((r) => (
          <Card key={r.id} className="flex items-center justify-between p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 dark:bg-primary-900/30">
                <HiOutlineDocumentChartBar className="h-6 w-6" />
              </span>
              <div>
                <h3 className="font-semibold">{t(`admin.reports.items.${r.key}.title`)}</h3>
                <p className="text-sm text-gray-500">{t(`admin.reports.items.${r.key}.desc`)}</p>
                <p className="mt-0.5 text-xs text-gray-400">{r.size} · {formatDate(new Date())}</p>
              </div>
            </div>
            <Button size="icon" variant="outline" onClick={() => toast.success(t('admin.reports.downloadingToast'))} aria-label={t('admin.reports.download')}>
              <HiOutlineDocumentArrowDown className="h-5 w-5" />
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Reports;
