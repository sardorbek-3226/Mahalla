import { cn } from '@/utils/cn';
import { initials } from '@/utils/format';

const SIZES = { xs: 'h-7 w-7 text-xs', sm: 'h-9 w-9 text-sm', md: 'h-11 w-11 text-base', lg: 'h-16 w-16 text-xl' };

const Avatar = ({ src, name = '', size = 'md', online, className }) => (
  <div className={cn('relative inline-flex shrink-0', className)}>
    {src ? (
      <img
        src={src}
        alt={name}
        className={cn('rounded-full object-cover ring-2 ring-white dark:ring-gray-900', SIZES[size])}
      />
    ) : (
      <span
        className={cn(
          'inline-flex items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-accent-600 font-semibold text-white',
          SIZES[size]
        )}
      >
        {initials(name) || '?'}
      </span>
    )}
    {online != null && (
      <span
        className={cn(
          'absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-gray-900',
          online ? 'bg-green-500' : 'bg-gray-400'
        )}
      />
    )}
  </div>
);

export default Avatar;
