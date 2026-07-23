import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { HiOutlineClipboardDocumentList, HiPlus, HiOutlineMapPin } from 'react-icons/hi2';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/ui/Card';
import { Button, EmptyState, Skeleton, StatusBadge } from '@/components/ui';
import { bookingService } from '@/services/bookingService';
import { useAuth } from '@/hooks/useAuth';
import { ROLES } from '@/constants/roles';
import { formatMoney, formatDateTime } from '@/utils/format';

const Bookings = () => {
  const { t } = useTranslation();
  const TABS = [
    { value: '', label: t('bookings.tabs.all') },
    { value: 'new', label: t('bookings.tabs.new') },
    { value: 'accepted', label: t('bookings.tabs.accepted') },
    { value: 'in_progress', label: t('bookings.tabs.inProgress') },
    { value: 'completed', label: t('bookings.tabs.completed') },
    { value: 'cancelled', label: t('bookings.tabs.cancelled') },
  ];

  const SCOPES = [
    { value: 'available', label: t('bookings.scopes.available') },
    { value: 'assigned', label: t('bookings.scopes.assigned') },
  ];

  const { user } = useAuth();
  const isWorker = user?.role === ROLES.WORKER;
  const [tab, setTab] = useState('');
  const [scope, setScope] = useState('available');

  const effectiveScope = isWorker ? scope : undefined;
  const { data, isLoading } = useQuery({
    queryKey: ['bookings', effectiveScope],
    queryFn: () => bookingService.list(effectiveScope ? { scope: effectiveScope } : undefined),
  });
  const all = data?.items || data || [];
  // The open-jobs pool is always status "new" by definition — only filter by
  // status within "Mening ishlarim" (assigned) or for non-worker roles.
  const showStatusTabs = !isWorker || scope === 'assigned';
  const list = showStatusTabs && tab ? all.filter((b) => b.status === tab) : all;

  return (
    <div>
      <PageHeader
        title={t('bookings.title')}
        subtitle={isWorker ? t('bookings.subtitleWorker') : t('bookings.subtitleResident')}
        actions={
          !isWorker && (
            <Link to="/bookings/new">
              <Button variant="gradient" leftIcon={<HiPlus className="h-4 w-4" />}>{t('bookings.newBooking')}</Button>
            </Link>
          )
        }
      />

      {isWorker && (
        <div className="mb-3 flex flex-wrap gap-2">
          {SCOPES.map((s) => (
            <button
              key={s.value}
              onClick={() => { setScope(s.value); setTab(''); }}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                scope === s.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}

      {showStatusTabs && (
        <div className="mb-5 flex flex-wrap gap-2">
          {TABS.map((tabItem) => (
            <button
              key={tabItem.value}
              onClick={() => setTab(tabItem.value)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                tab === tabItem.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
              }`}
            >
              {tabItem.label}
            </button>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}</div>
      ) : list.length === 0 ? (
        <Card className="p-0">
          <EmptyState
            icon={HiOutlineClipboardDocumentList}
            title={t('bookings.empty.title')}
            description={
              isWorker && scope === 'available'
                ? t('bookings.empty.workerAvailable')
                : t('bookings.empty.default')
            }
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {list.map((b) => (
            <Link key={b.id} to={`/bookings/${b.id}`}>
              <Card className="flex flex-col gap-3 p-5 transition hover:shadow-card sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{b.title}</h3>
                    <StatusBadge status={b.status} />
                  </div>
                  <p className="mt-1 flex items-center gap-1 text-sm text-gray-400">
                    <HiOutlineMapPin className="h-4 w-4" /> {b.address}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-400">
                    {formatDateTime(b.created_at)}
                    {isWorker && b.resident_name && ` · ${b.resident_name}`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary-600">{formatMoney(b.price_agreed)}</p>
                  {!isWorker && b.worker_name && <p className="text-xs text-gray-400">{b.worker_name}</p>}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings;
