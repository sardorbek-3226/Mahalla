import { cn } from '@/utils/cn';

const TONES = {
  gray: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  green: 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300',
  blue: 'bg-accent-100 text-accent-700 dark:bg-accent-900/40 dark:text-accent-300',
  amber: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  red: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
};

const Badge = ({ children, tone = 'gray', dot = false, className }) => (
  <span
    className={cn(
      'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
      TONES[tone],
      className
    )}
  >
    {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
    {children}
  </span>
);

export default Badge;
