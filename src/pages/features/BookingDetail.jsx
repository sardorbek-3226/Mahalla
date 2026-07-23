import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { HiArrowLeft, HiOutlineMapPin, HiOutlineCalendarDays, HiOutlineChatBubbleLeftRight } from 'react-icons/hi2';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/ui/Card';
import { Avatar, Button, Input, Skeleton, StatusBadge, Rating } from '@/components/ui';
import { bookingService } from '@/services/bookingService';
import { chatService } from '@/services/chatService';
import { queryClient } from '@/config/queryClient';
import { useAuth } from '@/hooks/useAuth';
import { useIsOnline } from '@/hooks/useOnlineStatus';
import { ROLES } from '@/constants/roles';
import { formatMoney, formatDateTime } from '@/utils/format';

const FLOW = ['new', 'accepted', 'in_progress', 'completed'];

const BookingDetail = () => {
  const { t } = useTranslation();
  const NEXT_LABEL = { accepted: t('bookings.detail.nextLabel.accepted'), in_progress: t('bookings.detail.nextLabel.inProgress') };
  const STEP_LABELS = [
    t('bookings.detail.steps.new'),
    t('bookings.detail.steps.accepted'),
    t('bookings.detail.steps.inProgress'),
    t('bookings.detail.steps.completed'),
  ];
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [priceInput, setPriceInput] = useState('');

  const { data: booking, isLoading } = useQuery({
    queryKey: ['booking', id],
    queryFn: () => bookingService.getById(id),
  });
  const isResidentOnline = useIsOnline(booking?.resident_id);

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['booking', id] });
    queryClient.invalidateQueries({ queryKey: ['bookings'] });
  };

  // "new" → "accepted" always goes through the dedicated /accept endpoint
  // (AcceptOrderDto, requires priceAgreed) — this applies whether the job was
  // open (unclaimed) or sent straight to this worker. The /status endpoint
  // only accepts IN_PROGRESS / COMPLETED / CANCELLED, never ACCEPTED.
  const accept = useMutation({
    mutationFn: (price) => bookingService.accept(id, price),
    onSuccess: () => { refresh(); toast.success(t('bookings.detail.acceptSuccess')); },
    onError: () => toast.error(t('bookings.detail.acceptError')),
  });
  const status = useMutation({
    mutationFn: (s) => bookingService.updateStatus(id, s),
    onSuccess: () => { refresh(); toast.success(t('bookings.detail.statusUpdated')); },
  });
  const cancel = useMutation({
    mutationFn: () => bookingService.cancel(id),
    onSuccess: () => { refresh(); toast.success(t('bookings.detail.cancelSuccess')); },
  });
  const review = useMutation({
    mutationFn: () => bookingService.review(id, { rating, comment }),
    onSuccess: () => { toast.success(t('bookings.detail.reviewThanks')); setComment(''); },
  });
  // Who is looking at this order determines their chat partner (if any) —
  // computed defensively before `booking` is guaranteed loaded, since hooks
  // must run unconditionally on every render.
  const isOwnerNow = !!user?.id && booking?.resident_id === user.id;
  const chatPartnerId = isOwnerNow ? booking?.worker_user_id : user?.role === ROLES.WORKER ? booking?.resident_id : null;
  const startChat = useMutation({
    mutationFn: () => chatService.createConversation({ participant_id: chatPartnerId, order_id: id }),
    onSuccess: (conv) => navigate('/chat', { state: { conversationId: conv.id } }),
    onError: () => toast.error(t('bookings.detail.chatError')),
  });

  if (isLoading) return <Skeleton className="h-96 w-full rounded-2xl" />;
  if (!booking) return <p className="text-gray-500">{t('bookings.detail.notFound')}</p>;

  const stepIdx = FLOW.indexOf(booking.status);
  const nextStatus = stepIdx >= 0 && stepIdx < 3 ? FLOW[stepIdx + 1] : null;
  const isCancelled = booking.status === 'cancelled';

  // Who is looking at this order shapes which actions (if any) they get.
  const isOwner = isOwnerNow;
  const isWorker = user?.role === ROLES.WORKER;
  const isAssignedToMe = isWorker && !!user?.provider_profile_id && booking.worker_id === user.provider_profile_id;
  // A worker can accept a "new" order whether it's still open (unclaimed) or
  // was sent straight to them — both go through the same accept-with-price step.
  const canAcceptAsWorker = isWorker && booking.status === 'new' && (!booking.worker_id || isAssignedToMe);

  const advance = () => status.mutate(nextStatus);

  return (
    <div className="mx-auto max-w-3xl">
      <button onClick={() => navigate(-1)} className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600">
        <HiArrowLeft className="h-4 w-4" /> {t('bookings.detail.back')}
      </button>

      <PageHeader title={booking.title} subtitle={booking.category_name} actions={<StatusBadge status={booking.status} />} />

      {/* Progress — visible to everyone, including the resident, as a read-only tracker. */}
      {!isCancelled && (
        <Card className="mb-5 p-6">
          <h3 className="mb-4 text-sm font-semibold text-gray-500">{t('bookings.detail.progress')}</h3>
          <div className="flex items-center justify-between">
            {FLOW.map((s, i) => (
              <div key={s} className="flex flex-1 flex-col items-center">
                <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${i <= stepIdx ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-400 dark:bg-gray-700'}`}>
                  {i + 1}
                </div>
                <span className="mt-2 text-center text-xs text-gray-500">
                  {STEP_LABELS[i]}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card className="space-y-3 p-6">
        {isWorker && booking.resident_name && (
          <div className="flex items-center gap-3 border-b border-gray-100 pb-3 dark:border-gray-800">
            <Avatar name={booking.resident_name} src={booking.resident_avatar} size="sm" online={isResidentOnline} />
            <div>
              <p className="text-xs text-gray-400">
                {t('bookings.detail.orderOwner')} ·{' '}
                <span className={isResidentOnline ? 'text-green-600' : 'text-gray-400'}>
                  {isResidentOnline ? t('bookings.detail.online') : t('bookings.detail.offline')}
                </span>
              </p>
              <p className="text-sm font-medium">{booking.resident_name}</p>
            </div>
          </div>
        )}
        <p className="text-gray-600 dark:text-gray-300">{booking.description}</p>
        <div className="flex items-center gap-2 text-sm text-gray-500"><HiOutlineMapPin className="h-4 w-4" /> {booking.address}</div>
        <div className="flex items-center gap-2 text-sm text-gray-500"><HiOutlineCalendarDays className="h-4 w-4" /> {formatDateTime(booking.scheduled_at)}</div>
        <div className="flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-800">
          <span className="text-gray-400">{t('bookings.detail.agreedPrice')}</span>
          <span className="text-lg font-bold text-primary-600">{formatMoney(booking.price_agreed)}</span>
        </div>
      </Card>

      {/* Chat with the other side — negotiate the price here before accepting. */}
      {!!chatPartnerId && !isCancelled && (
        <Button
          variant="outline"
          className="mt-5 w-full"
          leftIcon={<HiOutlineChatBubbleLeftRight className="h-4 w-4" />}
          loading={startChat.isPending}
          onClick={() => startChat.mutate()}
        >
          {t('bookings.detail.startChat')}
        </Button>
      )}

      {/* "new" order — worker sets the price they agreed on with the resident and claims it. */}
      {canAcceptAsWorker && (
        <Card className="mt-5 p-6">
          <h3 className="font-semibold">{t('bookings.detail.acceptOrder')}</h3>
          <p className="mt-1 text-sm text-gray-500">{t('bookings.detail.acceptOrderHint')}</p>
          <div className="mt-3 flex gap-3">
            <Input
              type="number"
              placeholder={t('bookings.detail.pricePlaceholder')}
              value={priceInput}
              onChange={(e) => setPriceInput(e.target.value)}
              className="flex-1"
            />
            <Button
              variant="gradient"
              loading={accept.isPending}
              disabled={!priceInput}
              onClick={() => accept.mutate(priceInput)}
            >
              {t('bookings.detail.accept')}
            </Button>
          </div>
        </Card>
      )}

      {/* Worker's own progression actions — once already accepted, only the worker assigned to this job. */}
      {isAssignedToMe && booking.status !== 'new' && !isCancelled && booking.status !== 'completed' && (
        <div className="mt-5 flex gap-3">
          {nextStatus && (
            <Button variant="gradient" loading={status.isPending} onClick={advance}>
              {NEXT_LABEL[booking.status]}
            </Button>
          )}
          <Button variant="outline" loading={cancel.isPending} onClick={() => cancel.mutate()}>
            {t('bookings.detail.cancel')}
          </Button>
        </div>
      )}

      {/* Resident's own actions — cancel only, no accept/advance (that's the worker's job). */}
      {isOwner && !isCancelled && booking.status !== 'completed' && (
        <div className="mt-5">
          <Button variant="outline" loading={cancel.isPending} onClick={() => cancel.mutate()}>
            {t('bookings.detail.cancel')}
          </Button>
        </div>
      )}

      {/* Review after completion (resident only). */}
      {isOwner && booking.status === 'completed' && (
        <Card className="mt-5 p-6">
          <h3 className="font-semibold">{t('bookings.detail.rateService')}</h3>
          <div className="mt-3"><Rating value={rating} onChange={setRating} size="lg" /></div>
          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={t('bookings.detail.reviewPlaceholder')}
            className="input-base mt-3 resize-none"
          />
          <Button variant="gradient" className="mt-3" loading={review.isPending} onClick={() => review.mutate()}>
            {t('bookings.detail.submitReview')}
          </Button>
        </Card>
      )}
    </div>
  );
};

export default BookingDetail;
