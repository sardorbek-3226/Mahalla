import { cn } from '@/utils/cn';

const Card = ({ children, className, hover = false, ...props }) => (
  <div
    className={cn('card p-5', hover && 'transition hover:shadow-card hover:-translate-y-0.5', className)}
    {...props}
  >
    {children}
  </div>
);

export const CardHeader = ({ title, subtitle, action }) => (
  <div className="mb-4 flex items-start justify-between gap-3">
    <div>
      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
      {subtitle && <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>}
    </div>
    {action}
  </div>
);

export default Card;
