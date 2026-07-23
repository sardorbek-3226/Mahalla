import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/cn';

const SIZES = { sm: 'h-4 w-4 border-2', md: 'h-6 w-6 border-2', lg: 'h-10 w-10 border-[3px]' };

const Spinner = ({ size = 'md', className }) => {
  const { t } = useTranslation();

  return (
    <span
      className={cn(
        'inline-block animate-spin rounded-full border-current border-t-transparent text-primary-600',
        SIZES[size],
        className
      )}
      role="status"
      aria-label={t('common.loading')}
    />
  );
};

export default Spinner;
