import Badge from './Badge';

// Maps domain statuses (booking / complaint / payment / verification) to a
// labelled, colour-coded badge.
const MAP = {
  // Bookings
  new: { tone: 'gray', label: 'Yangi' },
  accepted: { tone: 'blue', label: 'Qabul qilindi' },
  in_progress: { tone: 'amber', label: 'Jarayonda' },
  completed: { tone: 'green', label: 'Bajarildi' },
  cancelled: { tone: 'red', label: 'Bekor qilindi' },
  // Complaints
  in_review: { tone: 'amber', label: 'Ko‘rib chiqilmoqda' },
  resolved: { tone: 'green', label: 'Hal qilindi' },
  // Payments
  paid: { tone: 'green', label: 'To‘landi' },
  pending: { tone: 'amber', label: 'Kutilmoqda' },
  failed: { tone: 'red', label: 'Xatolik' },
  // Verification
  verified: { tone: 'green', label: 'Tasdiqlangan' },
  rejected: { tone: 'red', label: 'Rad etilgan' },
};

const StatusBadge = ({ status, dot = true }) => {
  const cfg = MAP[status] || { tone: 'gray', label: status || '—' };
  return (
    <Badge tone={cfg.tone} dot={dot}>
      {cfg.label}
    </Badge>
  );
};

export default StatusBadge;
