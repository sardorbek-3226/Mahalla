import { cn } from '@/utils/cn';

const Skeleton = ({ className }) => (
  <div
    className={cn(
      'relative overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-800',
      'after:absolute after:inset-0 after:-translate-x-full after:animate-shimmer after:bg-gradient-to-r after:from-transparent after:via-white/40 after:to-transparent dark:after:via-white/5',
      className
    )}
  />
);

export const SkeletonCard = () => (
  <div className="card space-y-3 p-5">
    <Skeleton className="h-12 w-12 rounded-full" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-9 w-full" />
  </div>
);

export default Skeleton;
