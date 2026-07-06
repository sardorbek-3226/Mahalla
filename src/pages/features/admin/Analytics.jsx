import { useQuery } from '@tanstack/react-query';
import { HiOutlineUsers, HiOutlineWrenchScrewdriver, HiOutlineClipboardDocumentList, HiOutlineBuildingOffice2 } from 'react-icons/hi2';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/dashboard/StatCard';
import ChartCard from '@/components/dashboard/ChartCard';
import { adminService } from '@/services/adminService';

const Analytics = () => {
  const { data } = useQuery({ queryKey: ['admin', 'stats'], queryFn: adminService.stats });
  const s = data || {};

  const ordersLine = {
    labels: s.orders_chart?.labels || [],
    datasets: [{
      label: 'Buyurtmalar',
      data: s.orders_chart?.data || [],
      borderColor: '#2f9c52',
      backgroundColor: 'rgba(47,156,82,0.15)',
      fill: true,
      tension: 0.4,
    }],
  };
  const categoriesPie = {
    labels: s.categories_chart?.labels || [],
    datasets: [{
      data: s.categories_chart?.data || [],
      backgroundColor: ['#1f7d40', '#2563eb', '#f59e0b', '#ef4444'],
    }],
  };
  const growthBar = {
    labels: s.orders_chart?.labels || [],
    datasets: [{
      label: 'O‘sish',
      data: (s.orders_chart?.data || []).map((n) => Math.round(n * 0.7)),
      backgroundColor: '#2563eb',
      borderRadius: 8,
    }],
  };

  return (
    <div>
      <PageHeader title="Analitika" subtitle="Platforma bo‘yicha umumiy ko‘rsatkichlar" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Aholi" value={s.residents?.toLocaleString() ?? '—'} icon={HiOutlineUsers} tone="primary" trend={12} />
        <StatCard label="Ustalar" value={s.workers?.toLocaleString() ?? '—'} icon={HiOutlineWrenchScrewdriver} tone="blue" trend={8} />
        <StatCard label="Buyurtmalar" value={s.orders?.toLocaleString() ?? '—'} icon={HiOutlineClipboardDocumentList} tone="amber" trend={23} />
        <StatCard label="Mahallalar" value={s.mahallas?.toLocaleString() ?? '—'} icon={HiOutlineBuildingOffice2} tone="primary" trend={3} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2"><ChartCard title="Buyurtmalar dinamikasi" type="line" data={ordersLine} /></div>
        <ChartCard title="Kategoriyalar" subtitle="Taqsimot" type="doughnut" data={categoriesPie} />
      </div>
      <div className="mt-6">
        <ChartCard title="Oylik o‘sish" type="bar" data={growthBar} />
      </div>
    </div>
  );
};

export default Analytics;
