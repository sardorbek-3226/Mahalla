import toast from 'react-hot-toast';
import { HiOutlineDocumentArrowDown, HiOutlineDocumentChartBar } from 'react-icons/hi2';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/ui/Card';
import { Button } from '@/components/ui';
import { formatDate } from '@/utils/format';

const REPORTS = [
  { id: 'r1', title: 'Oylik buyurtmalar hisoboti', desc: 'Iyun 2026 · barcha buyurtmalar', size: 'PDF · 1.2 MB' },
  { id: 'r2', title: 'Ustalar faolligi', desc: 'Faollik va reyting statistikasi', size: 'XLSX · 840 KB' },
  { id: 'r3', title: 'To‘lovlar hisoboti', desc: 'Tranzaksiyalar va daromad', size: 'PDF · 960 KB' },
  { id: 'r4', title: 'Murojaatlar tahlili', desc: 'Hal qilingan va kutilayotgan', size: 'PDF · 620 KB' },
];

const Reports = () => (
  <div>
    <PageHeader
      title="Hisobotlar"
      subtitle="Tayyor hisobotlarni yuklab oling"
      actions={<Button variant="gradient" leftIcon={<HiOutlineDocumentChartBar className="h-4 w-4" />} onClick={() => toast.success('Yangi hisobot tayyorlanmoqda…')}>Hisobot yaratish</Button>}
    />

    <div className="grid gap-4 sm:grid-cols-2">
      {REPORTS.map((r) => (
        <Card key={r.id} className="flex items-center justify-between p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 dark:bg-primary-900/30">
              <HiOutlineDocumentChartBar className="h-6 w-6" />
            </span>
            <div>
              <h3 className="font-semibold">{r.title}</h3>
              <p className="text-sm text-gray-500">{r.desc}</p>
              <p className="mt-0.5 text-xs text-gray-400">{r.size} · {formatDate(new Date())}</p>
            </div>
          </div>
          <Button size="icon" variant="outline" onClick={() => toast.success('Yuklab olinmoqda…')} aria-label="Yuklab olish">
            <HiOutlineDocumentArrowDown className="h-5 w-5" />
          </Button>
        </Card>
      ))}
    </div>
  </div>
);

export default Reports;
