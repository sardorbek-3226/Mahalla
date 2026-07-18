import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  HiOutlineBriefcase,
  HiOutlineUserGroup,
  HiOutlineClipboardDocumentCheck,
  HiOutlineBanknotes,
  HiPlus,
  HiArrowRight,
} from 'react-icons/hi2';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/dashboard/StatCard';
import ChartCard from '@/components/dashboard/ChartCard';
import Card from '@/components/ui/Card';
import { Button } from '@/components/ui';
import WorkerCard from '@/components/common/WorkerCard';
import { workerService } from '@/services/workerService';
import { useAuth } from '@/hooks/useAuth';

const OrganizationDashboard = () => {
  const { user } = useAuth();
  // The backend has no sort param for GET /providers, so fetch a page and sort client-side.
  const { data } = useQuery({ queryKey: ['workers', 'top-rated'], queryFn: () => workerService.list({ limit: 12 }) });
  const workers = [...(data?.items || data || [])]
    .sort((a, b) => (b.rating_avg ?? 0) - (a.rating_avg ?? 0))
    .slice(0, 3);

  const hiringChart = {
    labels: ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun'],
    datasets: [{
      label: 'Yollangan',
      data: [3, 5, 4, 7, 6, 9],
      backgroundColor: '#2563eb',
      borderRadius: 8,
    }],
  };

  return (
    <div>
      <PageHeader
        title={`Salom, ${user?.full_name || 'Tashkilot'}`}
        subtitle="Tashkilot boshqaruv paneli"
        actions={
          <Link to="/bookings/new">
            <Button variant="gradient" leftIcon={<HiPlus className="h-4 w-4" />}>Ish e’loni</Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Faol ish e’lonlari" value="6" icon={HiOutlineBriefcase} tone="primary" trend={10} />
        <StatCard label="Yollangan ustalar" value="34" icon={HiOutlineUserGroup} tone="blue" trend={8} />
        <StatCard label="Tugatilgan loyihalar" value="128" icon={HiOutlineClipboardDocumentCheck} tone="amber" trend={15} />
        <StatCard label="Oylik xarajat" value="12.4 mln" icon={HiOutlineBanknotes} tone="primary" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2"><ChartCard title="Yollash dinamikasi" type="bar" data={hiringChart} /></div>
        <Card className="flex flex-col justify-between p-6">
          <div>
            <h3 className="font-semibold">Tezkor ish e’loni</h3>
            <p className="mt-1 text-sm text-gray-500">Yangi loyiha uchun ustalar toping va to‘g‘ridan-to‘g‘ri yollang.</p>
          </div>
          <Link to="/workers" className="mt-4">
            <Button variant="outline" className="w-full" rightIcon={<HiArrowRight className="h-4 w-4" />}>Ustalarni ko‘rish</Button>
          </Link>
        </Card>
      </div>

      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold">Tavsiya etilgan ustalar</h3>
          <Link to="/workers" className="text-sm font-medium text-primary-600 hover:underline">Barchasi</Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {workers.map((w) => <WorkerCard key={w.id} worker={w} />)}
        </div>
      </div>
    </div>
  );
};

export default OrganizationDashboard;
