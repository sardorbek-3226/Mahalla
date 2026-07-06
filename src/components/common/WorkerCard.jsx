import { Link } from 'react-router-dom';
import { HiOutlineMapPin, HiOutlineCheckBadge } from 'react-icons/hi2';
import { Avatar, Badge, Rating } from '@/components/ui';
import { formatMoney } from '@/utils/format';

const WorkerCard = ({ worker }) => (
  <Link
    to={`/workers/${worker.id}`}
    className="card group flex flex-col p-5 transition hover:-translate-y-0.5 hover:shadow-card"
  >
    <div className="flex items-start gap-3">
      <Avatar name={worker.full_name} src={worker.avatar_url} size="md" online={worker.is_available} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <h3 className="truncate font-semibold text-gray-900 dark:text-white">{worker.full_name}</h3>
          {worker.verification_status === 'verified' && (
            <HiOutlineCheckBadge className="h-4 w-4 shrink-0 text-primary-600" title="Tasdiqlangan" />
          )}
        </div>
        <p className="text-sm text-primary-600">{worker.category_name}</p>
      </div>
    </div>

    <p className="mt-3 line-clamp-2 text-sm text-gray-500">{worker.bio}</p>

    <div className="mt-3 flex items-center justify-between">
      <Rating value={worker.rating_avg} count={worker.rating_count} size="sm" />
      {worker.is_available ? (
        <Badge tone="green" dot>Bo‘sh</Badge>
      ) : (
        <Badge tone="gray" dot>Band</Badge>
      )}
    </div>

    <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-sm dark:border-gray-800">
      <span className="flex items-center gap-1 text-gray-400">
        <HiOutlineMapPin className="h-4 w-4" /> {worker.mahalla}
      </span>
      <span className="font-semibold text-gray-900 dark:text-white">
        {formatMoney(worker.price_from)}dan
      </span>
    </div>
  </Link>
);

export default WorkerCard;
