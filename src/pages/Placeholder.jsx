import { HiOutlineWrenchScrewdriver } from 'react-icons/hi2';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';

// Consistent scaffold for pages not yet built out. Each will be replaced by a
// real, API-connected page following the same pattern as the dashboards.
const Placeholder = ({ title, subtitle, note }) => (
  <div>
    <PageHeader title={title} subtitle={subtitle} />
    <Card className="p-0">
      <EmptyState
        icon={HiOutlineWrenchScrewdriver}
        title={`${title} — tayyorlanmoqda`}
        description={note || "Bu sahifa arxitektura bosqichida skelet sifatida yaratildi. Keyingi bosqichda backend API'ga to'liq ulanadi."}
      />
    </Card>
  </div>
);

export default Placeholder;
