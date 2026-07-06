import { motion } from 'framer-motion';
import { HiArrowTrendingUp, HiArrowTrendingDown } from 'react-icons/hi2';
import { cn } from '@/utils/cn';

const TONES = {
  primary: 'from-primary-500/10 to-primary-500/5 text-primary-600',
  blue: 'from-accent-500/10 to-accent-500/5 text-accent-600',
  amber: 'from-amber-500/10 to-amber-500/5 text-amber-600',
  red: 'from-red-500/10 to-red-500/5 text-red-600',
};

const StatCard = ({ label, value, icon: Icon, tone = 'primary', trend }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="card flex items-center justify-between p-5"
  >
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight">{value}</p>
      {trend != null && (
        <p
          className={cn(
            'mt-1 flex items-center gap-1 text-xs font-medium',
            trend >= 0 ? 'text-green-600' : 'text-red-500'
          )}
        >
          {trend >= 0 ? <HiArrowTrendingUp className="h-3.5 w-3.5" /> : <HiArrowTrendingDown className="h-3.5 w-3.5" />}
          {Math.abs(trend)}%
        </p>
      )}
    </div>
    {Icon && (
      <div className={cn('flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br', TONES[tone])}>
        <Icon className="h-6 w-6" />
      </div>
    )}
  </motion.div>
);

export default StatCard;
