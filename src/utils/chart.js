// Helpers for building "last N months" chart buckets from real API records.
const MONTH_LABELS = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun', 'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'];

export const monthKey = (dateStr) => {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${d.getMonth()}`;
};

// Returns { labels, keys } for the last `count` months, oldest first, ending this month.
export const lastMonths = (count = 6) => {
  const now = new Date();
  const labels = [];
  const keys = [];
  for (let i = count - 1; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    labels.push(MONTH_LABELS[d.getMonth()]);
    keys.push(`${d.getFullYear()}-${d.getMonth()}`);
  }
  return { labels, keys };
};
