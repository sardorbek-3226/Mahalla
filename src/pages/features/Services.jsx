import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { HiOutlineShieldCheck, HiOutlineBolt, HiOutlineChatBubbleLeftRight, HiArrowRight } from 'react-icons/hi2';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/ui/Card';
import { Button } from '@/components/ui';
import { categoryService } from '@/services/workerService';

const STEPS = [
  { icon: HiOutlineShieldCheck, title: 'Tekshirilgan ustalar', desc: 'Har bir usta mahalla admini tomonidan tasdiqlanadi.' },
  { icon: HiOutlineBolt, title: 'Tezkor buyurtma', desc: 'Bir necha daqiqada kerakli xizmatni toping.' },
  { icon: HiOutlineChatBubbleLeftRight, title: 'To‘g‘ridan-to‘g‘ri aloqa', desc: 'Usta bilan chat orqali bog‘laning.' },
];

const Services = () => {
  const { data } = useQuery({ queryKey: ['categories'], queryFn: categoryService.list });
  const cats = data?.items || data || [];

  return (
    <div>
      <PageHeader title="Xizmatlar" subtitle="Mahalla uchun barcha xizmatlar bir joyda" />

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        {STEPS.map((s) => (
          <Card key={s.title} className="p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 dark:bg-primary-900/30">
              <s.icon className="h-6 w-6" />
            </div>
            <h3 className="mt-3 font-semibold">{s.title}</h3>
            <p className="mt-1 text-sm text-gray-500">{s.desc}</p>
          </Card>
        ))}
      </div>

      <h3 className="mb-3 font-semibold">Xizmat turlari</h3>
      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {cats.map((c) => (
          <Link key={c.id} to="/workers">
            <Card className="flex items-center gap-3 p-4 transition hover:shadow-card">
              <span className="text-2xl">{c.icon}</span>
              <div>
                <p className="font-medium">{c.name}</p>
                <p className="text-xs text-gray-400">{c.count} usta</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="mt-6 flex flex-col items-center gap-3 bg-gradient-to-br from-primary-600 to-accent-700 p-8 text-center text-white sm:flex-row sm:justify-between sm:text-left">
        <div>
          <h3 className="text-lg font-bold">Kerakli ustani topa olmadingizmi?</h3>
          <p className="text-sm text-white/80">So‘rov joylang — mos ustalar siz bilan bog‘lanadi.</p>
        </div>
        <Link to="/bookings/new">
          <Button variant="secondary" rightIcon={<HiArrowRight className="h-4 w-4" />}>So‘rov joylash</Button>
        </Link>
      </Card>
    </div>
  );
};

export default Services;
