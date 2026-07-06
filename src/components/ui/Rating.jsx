import { useState } from 'react';
import { HiStar, HiOutlineStar } from 'react-icons/hi2';

const SIZES = { sm: 'h-4 w-4', md: 'h-5 w-5', lg: 'h-7 w-7' };

// Read-only by default; pass onChange to make it interactive (e.g. review form).
const Rating = ({ value = 0, count, size = 'md', onChange, className = '' }) => {
  const [hover, setHover] = useState(0);
  const active = hover || value;
  const interactive = typeof onChange === 'function';

  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const Filled = i <= Math.round(active);
        const Icon = Filled ? HiStar : HiOutlineStar;
        return (
          <Icon
            key={i}
            className={`${SIZES[size]} ${Filled ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'} ${interactive ? 'cursor-pointer' : ''}`}
            onClick={interactive ? () => onChange(i) : undefined}
            onMouseEnter={interactive ? () => setHover(i) : undefined}
            onMouseLeave={interactive ? () => setHover(0) : undefined}
          />
        );
      })}
      {value != null && !interactive && (
        <span className="ml-1 text-sm font-medium text-gray-600 dark:text-gray-300">
          {Number(value).toFixed(1)}
          {count != null && <span className="text-gray-400"> ({count})</span>}
        </span>
      )}
    </span>
  );
};

export default Rating;
