// ─────────────────────────────────────────────────────────────────────────────
// Maps the real MahallaOS API shapes (camelCase, nested, UPPERCASE enums) into
// the flat snake_case shapes the UI/components already expect. Reads are
// defensive (real ?? mock) so both real backend and offline mock mode work.
// ─────────────────────────────────────────────────────────────────────────────

// Backend roles are RESIDENT / PROVIDER (+ admin variants). UI uses lowercase.
const ROLE_FROM_API = {
  RESIDENT: 'citizen',
  PROVIDER: 'worker',
  ORGANIZATION: 'organization',
  ADMIN: 'mahalla_admin',
  MAHALLA_ADMIN: 'mahalla_admin',
  DISTRICT_ADMIN: 'district_admin',
  REGION_ADMIN: 'region_admin',
  SUPER_ADMIN: 'super_admin',
};
const ROLE_TO_API = {
  citizen: 'RESIDENT',
  worker: 'PROVIDER',
  organization: 'PROVIDER', // backend has no Organization role yet
};

export const roleFromApi = (r) => ROLE_FROM_API[r] || r;
export const roleToApi = (r) => ROLE_TO_API[r] || r;

const lower = (v) => (typeof v === 'string' ? v.toLowerCase() : v);

export const normalizeUser = (u = {}) => ({
  ...u,
  id: u.id,
  full_name: u.full_name ?? u.fullName,
  phone: u.phone,
  email: u.email,
  role: roleFromApi(u.role),
  avatar_url: u.avatar_url ?? u.avatarUrl ?? null,
  mahalla_id: u.mahalla_id ?? u.mahallaId ?? null,
  mahalla: typeof u.mahalla === 'string' ? u.mahalla : u.mahalla?.name ?? null,
  is_phone_verified: u.is_phone_verified ?? u.isPhoneVerified ?? false,
  is_active: u.is_active ?? u.isActive ?? true,
  provider_profile_id: u.provider_profile_id ?? u.providerProfile?.id ?? null,
});

export const normalizeDocument = (d = {}) => ({
  id: d.id,
  doc_type: (d.doc_type ?? d.docType ?? '').toLowerCase(),
  file_url: d.file_url ?? d.fileUrl,
  status: (d.status ?? 'pending').toLowerCase(),
  created_at: d.created_at ?? d.createdAt,
});

export const normalizeCategory = (c = {}) => ({
  id: c.id,
  name: c.name,
  slug: c.slug,
  icon: c.icon ?? c.iconUrl ?? '🧰',
  count: c.count ?? c._count?.services ?? 0,
});

export const normalizeService = (s = {}) => ({
  id: s.id,
  title: s.title,
  description: s.description,
  price_from: s.price_from ?? s.priceFrom,
  price_unit: lower(s.price_unit ?? s.priceUnit) || 'soat',
  category_id: s.category_id ?? s.categoryId,
});

export const normalizeReview = (r = {}) => ({
  id: r.id,
  rating: r.rating,
  comment: r.comment,
  created_at: r.created_at ?? r.createdAt,
  author_name: r.author_name ?? r.author?.fullName ?? r.user?.fullName ?? 'Foydalanuvchi',
  worker_id: r.worker_id ?? r.providerId,
  worker_name: r.worker_name ?? r.provider?.user?.fullName,
});

// Provider (backend) → worker (UI). Handles nested user/mahalla/services.
export const normalizeProvider = (p = {}) => {
  const firstCat = p.services?.[0]?.category;
  return {
    id: p.id,
    user_id: p.user_id ?? p.userId,
    full_name: p.full_name ?? p.user?.fullName ?? '—',
    avatar_url: p.avatar_url ?? p.user?.avatarUrl ?? null,
    category_id: p.category_id ?? firstCat?.id,
    category_name: p.category_name ?? firstCat?.name ?? 'Umumiy',
    bio: p.bio ?? '',
    experience_years: p.experience_years ?? p.experienceYears ?? 0,
    mahalla: typeof p.mahalla === 'string' ? p.mahalla : p.user?.mahalla?.name ?? '—',
    verification_status: lower(p.verification_status ?? p.verificationStatus) || 'pending',
    rating_avg: p.rating_avg ?? p.ratingAvg ?? 0,
    rating_count: p.rating_count ?? p.ratingCount ?? 0,
    completed_orders: p.completed_orders ?? p.completedOrders ?? 0,
    price_from: p.price_from ?? p.services?.[0]?.priceFrom ?? 0,
    is_available: p.is_available ?? p.isAvailable ?? false,
    services: (p.services || []).map(normalizeService),
    reviews: (p.reviews || []).map(normalizeReview),
  };
};

export const normalizeOrder = (o = {}) => ({
  id: o.id,
  title: o.title,
  description: o.description,
  address: o.address,
  status: lower(o.status) || 'new',
  price_agreed: o.price_agreed ?? o.priceAgreed ?? null,
  scheduled_at: o.scheduled_at ?? o.scheduledAt ?? null,
  created_at: o.created_at ?? o.createdAt,
  category_id: o.category_id ?? o.categoryId ?? o.category?.id,
  category_name: o.category_name ?? o.category?.name ?? '—',
  worker_id: o.worker_id ?? o.providerId ?? o.provider?.id,
  worker_name: o.worker_name ?? o.provider?.user?.fullName ?? null,
});

export const normalizeNotification = (n = {}) => ({
  id: n.id,
  title: n.title,
  body: n.body ?? n.message,
  type: lower(n.type) || 'announcement',
  is_read: n.is_read ?? n.isRead ?? false,
  created_at: n.created_at ?? n.createdAt,
});

export const normalizeAnnouncement = (a = {}) => ({
  id: a.id,
  title: a.title,
  body: a.body,
  type: lower(a.type) || 'announcement',
  author_name: a.author_name ?? a.author?.fullName ?? 'Mahalla ma’muriyati',
  created_at: a.created_at ?? a.createdAt,
});

export const normalizeConversation = (c = {}) => ({
  id: c.id,
  order_id: c.order_id ?? c.orderId ?? null,
  participant_id: c.participant_id ?? c.participant?.id,
  name: c.name ?? c.participant?.fullName ?? 'Foydalanuvchi',
  avatar_url: c.avatar_url ?? c.participant?.avatarUrl ?? null,
  last_message:
    c.last_message ??
    (typeof c.lastMessage === 'string' ? c.lastMessage : c.lastMessage?.body) ??
    null,
  last_message_at: c.last_message_at ?? c.lastMessageAt ?? null,
  unread: c.unread ?? 0,
  created_at: c.created_at ?? c.createdAt,
});

export const normalizeMessage = (m = {}) => ({
  id: m.id,
  conversation_id: m.conversation_id ?? m.conversationId,
  sender_id: m.sender_id ?? m.senderId,
  sender_name: m.sender_name ?? m.sender?.fullName,
  body: m.body,
  attachment_url: m.attachment_url ?? m.attachmentUrl ?? null,
  is_read: m.is_read ?? m.isRead ?? false,
  created_at: m.created_at ?? m.createdAt,
});

export const normalizeRegion = (r = {}) => ({
  id: r.id,
  name: r.name,
  mahallas_count: r.mahallas_count ?? r._count?.mahallas ?? 0,
  created_at: r.created_at ?? r.createdAt,
});

export const normalizeMahalla = (m = {}) => ({
  id: m.id,
  name: m.name,
  region_id: m.region_id ?? m.regionId,
  region_name: m.region_name ?? m.region?.name ?? '—',
  district: m.district,
  lat: m.lat != null ? Number(m.lat) : null,
  lng: m.lng != null ? Number(m.lng) : null,
  created_at: m.created_at ?? m.createdAt,
});

// Apply a normalizer to a single object or an {items} list.
export const mapList = (res, fn) => {
  if (Array.isArray(res)) return res.map(fn);
  if (res?.items) return { ...res, items: res.items.map(fn) };
  return res;
};
