import { useQuery } from '@tanstack/react-query';
import { HiOutlineBanknotes, HiOutlineArrowDownTray, HiOutlineCreditCard } from 'react-icons/hi2';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/ui/Card';
import StatCard from '@/components/dashboard/StatCard';
import { Button, Skeleton, EmptyState, StatusBadge } from '@/components/ui';
import { paymentService } from '@/services/communityService';
import { formatMoney, formatDate } from '@/utils/format';

const Payments = () => {
  const { data, isLoading } = useQuery({ queryKey: ['payments'], queryFn: () => paymentService.list() });
  const items = data?.items || data || [];

  const totalPaid = items.filter((p) => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
  const pending = items.filter((p) => p.status === 'pending').reduce((s, p) => s + p.amount, 0);

  return (
    <div>
      <PageHeader title="To‘lovlar" subtitle="To‘lovlar tarixi va hisob-fakturalar" />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Jami to‘langan" value={formatMoney(totalPaid)} icon={HiOutlineBanknotes} tone="primary" />
        <StatCard label="Kutilmoqda" value={formatMoney(pending)} icon={HiOutlineCreditCard} tone="amber" />
        <StatCard label="Tranzaksiyalar" value={items.length} icon={HiOutlineArrowDownTray} tone="blue" />
      </div>

      <Card className="p-0">
        {isLoading ? (
          <div className="space-y-2 p-4">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}</div>
        ) : items.length === 0 ? (
          <EmptyState icon={HiOutlineBanknotes} title="To‘lov yo‘q" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-100 text-left text-gray-400 dark:border-gray-800">
                <tr>
                  <th className="px-5 py-3 font-medium">Faktura</th>
                  <th className="px-5 py-3 font-medium">Tavsif</th>
                  <th className="px-5 py-3 font-medium">Usul</th>
                  <th className="px-5 py-3 font-medium">Sana</th>
                  <th className="px-5 py-3 font-medium">Holat</th>
                  <th className="px-5 py-3 text-right font-medium">Summa</th>
                </tr>
              </thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50 last:border-0 dark:border-gray-800/50">
                    <td className="px-5 py-3 font-mono text-xs">{p.invoice_no}</td>
                    <td className="px-5 py-3">{p.description}</td>
                    <td className="px-5 py-3 text-gray-500">{p.method}</td>
                    <td className="px-5 py-3 text-gray-500">{formatDate(p.created_at)}</td>
                    <td className="px-5 py-3"><StatusBadge status={p.status} /></td>
                    <td className="px-5 py-3 text-right font-semibold">{formatMoney(p.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Payments;
