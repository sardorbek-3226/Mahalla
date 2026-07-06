// Locale-aware formatters for the UZ context.
const UZ = 'uz-UZ';

export const formatMoney = (amount, currency = 'UZS') => {
  if (amount == null) return '—';
  return new Intl.NumberFormat(UZ, { maximumFractionDigits: 0 }).format(amount) + ' ' + currency;
};

export const formatDate = (value, opts = {}) => {
  if (!value) return '—';
  return new Date(value).toLocaleDateString(UZ, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...opts,
  });
};

export const formatDateTime = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleString(UZ, {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// "5 daqiqa oldin" style relative time.
export const timeAgo = (value) => {
  if (!value) return '';
  const diff = (Date.now() - new Date(value).getTime()) / 1000;
  const units = [
    [60, 'soniya'],
    [3600, 'daqiqa', 60],
    [86400, 'soat', 3600],
    [604800, 'kun', 86400],
  ];
  for (const [limit, label, div] of units) {
    if (diff < limit) return `${Math.floor(div ? diff / div : diff)} ${label} oldin`;
  }
  return formatDate(value);
};

export const initials = (name = '') =>
  name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
