import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { chatService } from '@/services/chatService';
import {
  HiOutlineCheckBadge,
  HiOutlineMapPin,
  HiOutlineBriefcase,
  HiOutlineClipboardDocumentCheck,
  HiArrowLeft,
} from 'react-icons/hi2';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/ui/Card';
import { Avatar, Badge, Button, Rating, Skeleton, StatusBadge } from '@/components/ui';
import { workerService } from '@/services/workerService';
import { formatMoney, timeAgo } from '@/utils/format';

const Stat = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3 dark:bg-gray-800/50">
    <Icon className="h-5 w-5 text-primary-600" />
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="font-semibold text-gray-900 dark:text-white">{value}</p>
    </div>
  </div>
);

const WorkerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: worker, isLoading } = useQuery({
    queryKey: ['worker', id],
    queryFn: () => workerService.getById(id),
  });

  const startChat = useMutation({
    mutationFn: () => chatService.createConversation({ participant_id: worker.user_id }),
    onSuccess: (conv) => navigate('/chat', { state: { conversationId: conv.id } }),
    onError: () => toast.error('Suhbat ochib bo‘lmadi'),
  });

  if (isLoading) return <Skeleton className="h-96 w-full rounded-2xl" />;
  if (!worker) return <p className="text-gray-500">Usta topilmadi.</p>;

  const reviews = worker.reviews || [];

  return (
    <div>
      <button onClick={() => navigate(-1)} className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600">
        <HiArrowLeft className="h-4 w-4" /> Orqaga
      </button>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main */}
        <div className="space-y-6 lg:col-span-2">
          <Card className="p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Avatar name={worker.full_name} src={worker.avatar_url} size="lg" online={worker.is_available} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold">{worker.full_name}</h2>
                  {worker.verification_status === 'verified' && (
                    <Badge tone="green" dot>
                      <HiOutlineCheckBadge className="h-3.5 w-3.5" /> Tasdiqlangan
                    </Badge>
                  )}
                </div>
                <p className="text-primary-600">{worker.category_name}</p>
                <div className="mt-1"><Rating value={worker.rating_avg} count={worker.rating_count} size="sm" /></div>
              </div>
            </div>
            <p className="mt-4 leading-relaxed text-gray-600 dark:text-gray-300">{worker.bio}</p>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <Stat icon={HiOutlineBriefcase} label="Tajriba" value={`${worker.experience_years} yil`} />
              <Stat icon={HiOutlineClipboardDocumentCheck} label="Bajarilgan" value={worker.completed_orders} />
              <Stat icon={HiOutlineMapPin} label="Mahalla" value={worker.mahalla} />
            </div>
          </Card>

          {/* Services */}
          <Card className="p-6">
            <h3 className="mb-4 font-semibold">Xizmatlar va narxlar</h3>
            <div className="space-y-3">
              {worker.services?.map((s) => (
                <div key={s.id} className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3 dark:border-gray-800">
                  <span className="text-sm">{s.title}</span>
                  <span className="font-semibold text-primary-600">
                    {formatMoney(s.price_from)} / {s.price_unit}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Reviews */}
          <Card className="p-6">
            <h3 className="mb-4 font-semibold">Sharhlar ({worker.rating_count})</h3>
            {reviews.length === 0 ? (
              <p className="text-sm text-gray-400">Hozircha sharh yo‘q.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((r) => (
                  <div key={r.id} className="border-b border-gray-100 pb-4 last:border-0 dark:border-gray-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar name={r.author_name} size="xs" />
                        <span className="text-sm font-medium">{r.author_name}</span>
                      </div>
                      <Rating value={r.rating} size="sm" />
                    </div>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{r.comment}</p>
                    <p className="mt-1 text-xs text-gray-400">{timeAgo(r.created_at)}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 p-6">
            <p className="text-sm text-gray-400">Boshlang‘ich narx</p>
            <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{formatMoney(worker.price_from)}</p>
            <div className="mt-2"><StatusBadge status={worker.is_available ? 'completed' : 'new'} dot /></div>
            <Link to="/bookings/new" state={{ worker }}>
              <Button variant="gradient" size="lg" className="mt-5 w-full">Buyurtma berish</Button>
            </Link>
            <Button variant="outline" className="mt-3 w-full" loading={startChat.isPending} onClick={() => startChat.mutate()}>
              Xabar yozish
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WorkerDetail;
