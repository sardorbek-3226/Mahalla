// ─────────────────────────────────────────────────────────────────────────────
// In-memory mock database for offline demo mode (ENV.MOCK_AUTH).
// Seeds realistic data and persists mutable collections to localStorage so
// items created during a session survive page reloads.
// ─────────────────────────────────────────────────────────────────────────────

const LS_KEY = 'mock_db_v1';

const uid = (p = 'id') => `${p}-${Math.random().toString(36).slice(2, 9)}`;
const daysAgo = (d) => new Date(Date.now() - d * 864e5).toISOString();
const hoursAhead = (h) => new Date(Date.now() + h * 36e5).toISOString();

// --- Static seed (categories & providers don't change in demo) ----------------
export const CATEGORIES = [
  { id: 'cat-elec', name: 'Elektrik', slug: 'electric', icon: '⚡', count: 142 },
  { id: 'cat-plumb', name: 'Santexnik', slug: 'plumber', icon: '🔧', count: 98 },
  { id: 'cat-clean', name: 'Tozalash', slug: 'cleaning', icon: '🧹', count: 76 },
  { id: 'cat-tutor', name: 'Repetitor', slug: 'tutor', icon: '📚', count: 120 },
  { id: 'cat-cond', name: 'Konditsioner', slug: 'ac', icon: '❄️', count: 54 },
  { id: 'cat-paint', name: 'Bo‘yoqchi', slug: 'painter', icon: '🎨', count: 41 },
  { id: 'cat-move', name: 'Yuk tashish', slug: 'moving', icon: '📦', count: 33 },
  { id: 'cat-garden', name: 'Bog‘bon', slug: 'gardener', icon: '🌳', count: 28 },
];

const MAHALLAS = ['Chilonzor', 'Yunusobod', 'Mirzo Ulug‘bek', 'Sergeli', 'Olmazor'];
const FIRST = ['Akmal', 'Bobur', 'Davron', 'Eldor', 'Farrux', 'Gulnora', 'Hasan', 'Iroda', 'Jasur', 'Kamol'];
const LAST = ['Karimov', 'Tdoshev', 'Yusupov', 'Aliyev', 'Sodiqov', 'Rahimova', 'Olimov', 'Saidova'];

const rnd = (arr) => arr[Math.floor(Math.random() * arr.length)];
const rint = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

const buildWorkers = () =>
  Array.from({ length: 18 }).map((_, i) => {
    const cat = rnd(CATEGORIES);
    const name = `${rnd(FIRST)} ${rnd(LAST)}`;
    return {
      id: `wrk-${i + 1}`,
      full_name: name,
      avatar_url: null,
      category_id: cat.id,
      category_name: cat.name,
      bio: `${cat.name} sohasida ${rint(2, 15)} yillik tajriba. Sifatli va kafolatli ishlayman.`,
      experience_years: rint(2, 15),
      mahalla: rnd(MAHALLAS),
      verification_status: i % 5 === 0 ? 'pending' : 'verified',
      rating_avg: (Math.round((3.6 + Math.random() * 1.4) * 10) / 10),
      rating_count: rint(5, 230),
      completed_orders: rint(10, 540),
      price_from: rint(30, 150) * 1000,
      is_available: Math.random() > 0.3,
      lat: 41.28 + Math.random() * 0.08,
      lng: 69.2 + Math.random() * 0.12,
      services: [
        { id: uid('srv'), title: `${cat.name} xizmati`, price_from: rint(30, 150) * 1000, price_unit: 'soat' },
        { id: uid('srv'), title: 'Tezkor chaqiruv', price_from: rint(50, 200) * 1000, price_unit: 'loyiha' },
      ],
    };
  });

const REVIEW_TEXTS = [
  'Juda tez va sifatli bajardi, rahmat!',
  'Ishidan mamnunman, tavsiya qilaman.',
  'Vaqtida keldi, narxi ham arzon edi.',
  'Professional usta, yana murojaat qilaman.',
  'Yaxshi, lekin biroz kechikdi.',
];

const buildReviews = (workers) =>
  Array.from({ length: 24 }).map(() => {
    const w = rnd(workers);
    return {
      id: uid('rev'),
      worker_id: w.id,
      worker_name: w.full_name,
      author_name: `${rnd(FIRST)} ${rnd(LAST)}`,
      rating: rint(3, 5),
      comment: rnd(REVIEW_TEXTS),
      created_at: daysAgo(rint(1, 60)),
    };
  });

const STATUSES = ['new', 'accepted', 'in_progress', 'completed', 'cancelled'];

const buildBookings = (workers) =>
  Array.from({ length: 10 }).map((_, i) => {
    const w = rnd(workers);
    return {
      id: `ord-${i + 1}`,
      title: `${w.category_name} xizmati kerak`,
      description: 'Uyda kichik ta’mirlash ishlari bo‘yicha yordam kerak.',
      category_id: w.category_id,
      category_name: w.category_name,
      worker_id: w.id,
      worker_name: w.full_name,
      address: `${rnd(MAHALLAS)} mahallasi, ${rint(1, 40)}-uy`,
      status: STATUSES[i % STATUSES.length],
      price_agreed: rint(50, 300) * 1000,
      scheduled_at: hoursAhead(rint(2, 72)),
      created_at: daysAgo(rint(0, 20)),
    };
  });

const buildNews = () =>
  [
    { type: 'announcement', title: 'Hashar — shanba kuni', body: 'Mahalla hududini obodonlashtirish bo‘yicha umumiy hashar shanba kuni soat 8:00 da bo‘lib o‘tadi.' },
    { type: 'announcement', title: 'Suv ta’minoti vaqtincha to‘xtatiladi', body: 'Texnik ishlar tufayli ertaga 10:00–14:00 oralig‘ida suv bo‘lmaydi.' },
    { type: 'recommendation', title: 'Yangi tekshirilgan ustalar qo‘shildi', body: 'Bu hafta 12 ta yangi usta verifikatsiyadan o‘tdi.' },
    { type: 'announcement', title: 'Bolalar maydonchasi ochildi', body: 'Chilonzor mahallasida yangi bolalar maydonchasi foydalanishga topshirildi.' },
    { type: 'recommendation', title: 'Qishki tayyorgarlik', body: 'Konditsioner va isitish tizimlarini oldindan tekshirtirishni unutmang.' },
  ].map((n, i) => ({ id: `news-${i + 1}`, author_name: 'Mahalla ma’muriyati', created_at: daysAgo(i * 2), ...n }));

const buildNotifications = () =>
  [
    { title: 'Buyurtmangiz qabul qilindi', body: 'Usta buyurtmangizni qabul qildi.', type: 'order' },
    { title: 'Yangi xabar', body: 'Sizga yangi xabar keldi.', type: 'chat' },
    { title: 'To‘lov muvaffaqiyatli', body: 'To‘lovingiz qabul qilindi.', type: 'payment' },
    { title: 'Mahalla e’loni', body: 'Shanba kuni hashar bo‘ladi.', type: 'announcement' },
  ].map((n, i) => ({ id: `ntf-${i + 1}`, is_read: i > 1, created_at: daysAgo(i), ...n }));

const buildAdmins = () =>
  [
    { id: 'adm-super', full_name: 'Bosh administrator', role: 'super_admin', scope: '—', phone: '+998 71 200 00 00', is_active: true },
    { id: 'adm-region', full_name: 'Toshkent viloyat admini', role: 'region_admin', scope: 'Toshkent', phone: '+998 90 111 00 11', is_active: true },
    { id: 'adm-district', full_name: 'Chilonzor tuman admini', role: 'district_admin', scope: 'Chilonzor', phone: '+998 90 222 00 22', is_active: true },
    { id: 'adm-mahalla', full_name: 'Bodomzor mahalla admini', role: 'mahalla_admin', scope: 'Bodomzor', phone: '+998 90 333 00 33', is_active: true },
  ].map((a) => ({ created_at: daysAgo(rint(10, 120)), ...a }));

const buildAuditLogs = () =>
  [
    { actor: 'Bosh administrator', actor_role: 'super_admin', action: 'admin.create', meta: { role: 'region_admin', scope: 'Toshkent' } },
    { actor: 'Toshkent viloyat admini', actor_role: 'region_admin', action: 'admin.create', meta: { role: 'district_admin', scope: 'Chilonzor' } },
    { actor: 'Chilonzor tuman admini', actor_role: 'district_admin', action: 'admin.create', meta: { role: 'mahalla_admin', scope: 'Bodomzor' } },
    { actor: 'Bosh administrator', actor_role: 'super_admin', action: 'settings.update', meta: { key: 'platform.maintenance' } },
  ].map((l, i) => ({ id: `log-${i + 1}`, created_at: daysAgo(i), ...l }));

// --- DB assembly + persistence ------------------------------------------------
const seed = () => {
  const workers = buildWorkers();
  return {
    workers,
    reviews: buildReviews(workers),
    bookings: buildBookings(workers),
    news: buildNews(),
    notifications: buildNotifications(),
    admins: buildAdmins(),
    auditLogs: buildAuditLogs(),
  };
};

const load = () => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Backfill collections added in later versions (e.g. RBAC).
      if (!parsed.admins) parsed.admins = buildAdmins();
      if (!parsed.auditLogs) parsed.auditLogs = buildAuditLogs();
      return parsed;
    }
  } catch {
    /* ignore */
  }
  const fresh = seed();
  save(fresh);
  return fresh;
};

export const db = load();

export function save(next = db) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

export const newId = uid;

export const ADMIN_STATS = {
  residents: 210400,
  workers: 12400,
  orders: 86000,
  mahallas: 1840,
  orders_chart: { labels: ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun'], data: [4200, 5100, 6300, 7100, 8400, 9200] },
  categories_chart: { labels: ['Elektrik', 'Santexnik', 'Tozalash', 'Repetitor'], data: [142, 98, 76, 120] },
};
