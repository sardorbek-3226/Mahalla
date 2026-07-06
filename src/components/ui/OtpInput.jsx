import { useRef } from 'react';
import { cn } from '@/utils/cn';

// Controlled OTP field. `value` is the full string, `onChange` gets the new string.
const OtpInput = ({ length = 6, value = '', onChange, error }) => {
  const refs = useRef([]);
  const chars = value.split('').slice(0, length);

  const setChar = (idx, char) => {
    const next = value.split('');
    next[idx] = char;
    onChange(next.join('').slice(0, length));
  };

  const handleChange = (idx, e) => {
    const val = e.target.value.replace(/\D/g, '');
    if (!val) return;
    setChar(idx, val[val.length - 1]);
    if (idx < length - 1) refs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === 'Backspace') {
      if (chars[idx]) setChar(idx, '');
      else if (idx > 0) refs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (pasted) {
      onChange(pasted);
      refs.current[Math.min(pasted.length, length - 1)]?.focus();
    }
  };

  return (
    <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
      {Array.from({ length }).map((_, idx) => (
        <input
          key={idx}
          ref={(el) => (refs.current[idx] = el)}
          inputMode="numeric"
          maxLength={1}
          value={chars[idx] || ''}
          onChange={(e) => handleChange(idx, e)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          className={cn(
            'h-12 w-11 rounded-xl border text-center text-lg font-semibold outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:bg-gray-900 sm:h-14 sm:w-12',
            error ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
          )}
        />
      ))}
    </div>
  );
};

export default OtpInput;
