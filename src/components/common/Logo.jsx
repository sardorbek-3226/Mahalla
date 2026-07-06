import { Link } from 'react-router-dom';
import { HiHomeModern } from 'react-icons/hi2';
import { cn } from '@/utils/cn';

const Logo = ({ to = '/', compact = false, className }) => (
  <Link to={to} className={cn('flex items-center gap-2', className)}>
    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-600 text-white shadow-soft">
      <HiHomeModern className="h-5 w-5" />
    </span>
    {!compact && (
      <span className="text-lg font-extrabold tracking-tight">
        Smart<span className="gradient-text">Mahalla</span>
      </span>
    )}
  </Link>
);

export default Logo;
