import { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { formatLocalPhone } from '@/utils/phone';

// Uzbek phone field: fixed "+998" label + auto-grouped 9-digit local number.
// The field's value is always just the local digits (e.g. "90 123 45 67") —
// combine with the "+998" prefix via toApiPhone() before sending to the API.
const PhoneInput = forwardRef(
  ({ label, error, hint, className, id, name, onChange, ...props }, ref) => {
    const inputId = id || name;

    const handleChange = (e) => {
      e.target.value = formatLocalPhone(e.target.value);
      onChange?.(e);
    };

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <div
          className={cn(
            'flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 transition focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20 dark:border-gray-700 dark:bg-gray-900',
            error && 'border-red-500 focus-within:border-red-500 focus-within:ring-red-500/20'
          )}
        >
          <span className="shrink-0 text-sm font-medium text-gray-500 dark:text-gray-400">+998</span>
          <input
            ref={ref}
            id={inputId}
            name={name}
            type="tel"
            inputMode="numeric"
            autoComplete="off"
            placeholder="90 123 45 67"
            className={cn(
              'w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-gray-100',
              className
            )}
            onChange={handleChange}
            {...props}
          />
        </div>
        {error ? (
          <p className="mt-1 text-xs text-red-500">{error}</p>
        ) : hint ? (
          <p className="mt-1 text-xs text-gray-400">{hint}</p>
        ) : null}
      </div>
    );
  }
);

PhoneInput.displayName = 'PhoneInput';
export default PhoneInput;
