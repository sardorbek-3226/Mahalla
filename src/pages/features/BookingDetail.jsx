import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { HiArrowLeft, HiOutlineMapPin, HiOutlineCalendarDays } from 'react-icons/hi2';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/ui/Card';
import { Button, Skeleton, StatusBadge, Rating } from '@/components/ui';
import { bookingService } from '@/services/bookingService';
import { queryClient } from '@/config/queryClient';
import { formatMoney, formatDateTime } from '@/utils/format';

const FLOW = ['new', 'accepted', 'in_progress', 'completed'];
const NEXT_LABEL = { new: 'Qabul qilish', accepted: 'Ishni boshlash', in_progress: 'Yakunlash' };

const BookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const { data: booking, isLoading } = useQuery({
    queryKey: ['booking', id],
    queryFn: () => bookingService.getById(id),
  });

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['booking', id] });
    queryClient.invalidateQueries({ queryKey: ['bookings'] });
  };

  // "new" → "accepted" goes through the dedicated /accept endpoint (AcceptOrderDto);
  // the /status endpoint only accepts IN_PROGRESS / COMPLETED / CANCELLED.
  const accept = useMutation({
    mutationFn: () => bookingService.accept(id),
    onSuccess: () => { refresh(); toast.success('Buyurtma qabul qilindi'); },
  });
  const status = useMutation({
    mutationFn: (s) => bookingService.updateStatus(id, s),
    onSuccess: () => { refresh(); toast.success('Holat yangilandi'); },
  });
  const cancel = useMutation({
    mutationFn: () => bookingService.cancel(id),
    onSuccess: () => { refresh(); toast.success('Buyurtma bekor qilindi'); },
  });
  const review = useMutation({
    mutationFn: () => bookingService.review(id, { rating, comment }),
    onSuccess: () => { toast.success('Sharhingiz uchun rahmat!'); setComment(''); },
  });

  if (isLoading) return <Skeleton className="h-96 w-full rounded-2xl" />;
  if (!booking) return <p className="text-gray-500">Buyurtma topilmadi.</p>;

  const stepIdx = FLOW.indexOf(booking.status);
  const nextStatus = stepIdx >= 0 && stepIdx < 3 ? FLOW[stepIdx + 1] : null;
  const isCancelled = booking.status === 'cancelled';
  const advance = () => (booking.status === 'new' ? accept.mutate() : status.mutate(nextStatus));

  return (
    <div className="mx-auto max-w-3xl">
      <button onClick={() => navigate(-1)} className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600">
        <HiArrowLeft className="h-4 w-4" /> Orqaga
      </button>

      <PageHeader title={booking.title} subtitle={booking.category_name} actions={<StatusBadge status={booking.status} />} />

      {/* Progress */}
      {!isCancelled && (
        <Card className="mb-5 p-6">
          <div className="flex items-center justify-between">
            {FLOW.map((s, i) => (
              <div key={s} className="flex flex-1 flex-col items-center">
                <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${i <= stepIdx ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-400 dark:bg-gray-700'}`}>
                  {i + 1}
                </div>
                <span className="mt-2 text-center text-xs text-gray-500">
                  {['Yangi', 'Qabul', 'Jarayon', 'Bajarildi'][i]}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card className="space-y-3 p-6">
        <p className="text-gray-600 dark:text-gray-300">{booking.description}</p>
        <div className="flex items-center gap-2 text-sm text-gray-500"><HiOutlineMapPin className="h-4 w-4" /> {booking.address}</div>
        <div className="flex items-center gap-2 text-sm text-gray-500"><HiOutlineCalendarDays className="h-4 w-4" /> {formatDateTime(booking.scheduled_at)}</div>
        <div className="flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-800">
          <span className="text-gray-400">Kelishilgan narx</span>
          <span className="text-lg font-bold text-primary-600">{formatMoney(booking.price_agreed)}</span>
        </div>
      </Card>

      {/* Actions */}
      {!isCancelled && booking.status !== 'completed' && (
        <div className="mt-5 flex gap-3">
          {nextStatus && (
            <Button variant="gradient" loading={accept.isPending || status.isPending} onClick={advance}>
              {NEXT_LABEL[booking.status]}
            </Button>
          )}
          <Button variant="outline" loading={cancel.isPending} onClick={() => cancel.mutate()}>
            Bekor qilish
          </Button>
        </div>
      )}

      {/* Review after completion */}
      {booking.status === 'completed' && (
        <Card className="mt-5 p-6">
          <h3 className="font-semibold">Xizmatni baholang</h3>
          <div className="mt-3"><Rating value={rating} onChange={setRating} size="lg" /></div>
          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Fikringizni yozing…"
            className="input-base mt-3 resize-none"
          />
          <Button variant="gradient" className="mt-3" loading={review.isPending} onClick={() => review.mutate()}>
            Sharh qoldirish
          </Button>
        </Card>
      )}
    </div>
  );
};

export default BookingDetail;
