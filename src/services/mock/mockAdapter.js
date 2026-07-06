import { db, save, newId, CATEGORIES, ADMIN_STATS } from './db';

// ─────────────────────────────────────────────────────────────────────────────
// Axios adapter for offline demo mode. Routes every request to the mock DB and
// returns axios-shaped responses, so existing services work unchanged.
// Installed in axiosInstance when ENV.MOCK_AUTH is true.
// ─────────────────────────────────────────────────────────────────────────────

const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms));

const ok = (config, data, status = 200) => ({
  data,
  status,
  statusText: 'OK',
  headers: {},
  config,
  request: {},
});

const parseBody = (config) => {
  if (!config.data) return {};
  try {
    return typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
  } catch {
    return {};
  }
};

const paginate = (items, params = {}) => {
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || items.length || 1;
  const start = (page - 1) * limit;
  return { items: items.slice(start, start + limit), total: items.length, page, limit };
};

// Match helpers: path is the URL without the query string.
const idFrom = (path, prefix) => path.slice(prefix.length).split('/')[0];

async function route(config) {
  const method = (config.method || 'get').toLowerCase();
  const path = (config.url || '').split('?')[0];
  const params = config.params || {};
  const body = parseBody(config);

  // ---- WORKERS / PROVIDERS --------------------------------------------------
  if (path === '/providers' && method === 'get') {
    let list = [...db.workers];
    if (params.category_id) list = list.filter((w) => w.category_id === params.category_id);
    if (params.available === true || params.available === 'true')
      list = list.filter((w) => w.is_available);
    if (params.verified === true || params.verified === 'true')
      list = list.filter((w) => w.verification_status === 'verified');
    if (params.q) {
      const q = String(params.q).toLowerCase();
      list = list.filter(
        (w) => w.full_name.toLowerCase().includes(q) || w.category_name.toLowerCase().includes(q)
      );
    }
    if (params.sort === 'rating') list.sort((a, b) => b.rating_avg - a.rating_avg);
    if (params.sort === 'price') list.sort((a, b) => a.price_from - b.price_from);
    return paginate(list, params);
  }
  if (path === '/providers/pending') return paginate(db.workers.filter((w) => w.verification_status === 'pending'), params);
  if (path.startsWith('/providers/') && path.endsWith('/reviews') && method === 'get') {
    const id = path.split('/')[2];
    return paginate(db.reviews.filter((r) => r.worker_id === id), params);
  }
  if (path === '/providers/availability' && method === 'patch') return { success: true };
  if (path.startsWith('/providers/') && method === 'get') {
    const id = idFrom(path, '/providers/');
    const worker = db.workers.find((w) => w.id === id);
    if (!worker) return null; // → 404
    return { ...worker, reviews: db.reviews.filter((r) => r.worker_id === id).slice(0, 8) };
  }

  // ---- CATEGORIES -----------------------------------------------------------
  if (path === '/categories') return CATEGORIES;

  // ---- REVIEWS (all) --------------------------------------------------------
  if (path === '/reviews' && method === 'get') return paginate(db.reviews, params);

  // ---- ORDERS / BOOKINGS ----------------------------------------------------
  if (path === '/orders' && method === 'get') {
    const res = paginate(db.bookings, params);
    return { ...res, earnings: [1.2, 1.8, 2.1, 1.6, 2.4, 2.9].map((n) => Math.round(n * 1e6)) };
  }
  if (path === '/orders' && method === 'post') {
    const worker = db.workers.find((w) => w.id === body.worker_id);
    const order = {
      id: newId('ord'),
      status: 'new',
      created_at: new Date().toISOString(),
      worker_name: worker?.full_name || null,
      category_name: CATEGORIES.find((c) => c.id === body.category_id)?.name || null,
      ...body,
    };
    db.bookings.unshift(order);
    save();
    return order;
  }
  if (path.startsWith('/orders/') && path.endsWith('/accept') && method === 'patch') {
    const id = path.split('/')[2];
    const o = db.bookings.find((b) => b.id === id);
    if (o) { o.status = 'accepted'; save(); }
    return o || { success: true };
  }
  if (path.startsWith('/orders/') && path.endsWith('/status') && method === 'patch') {
    const id = path.split('/')[2];
    const o = db.bookings.find((b) => b.id === id);
    if (o) { o.status = body.status; save(); }
    return o || { success: true };
  }
  if (path.startsWith('/orders/') && path.endsWith('/review') && method === 'post') {
    const id = path.split('/')[2];
    const o = db.bookings.find((b) => b.id === id);
    const review = {
      id: newId('rev'),
      worker_id: o?.worker_id,
      worker_name: o?.worker_name,
      author_name: 'Siz',
      rating: body.rating,
      comment: body.comment,
      created_at: new Date().toISOString(),
    };
    db.reviews.unshift(review);
    save();
    return review;
  }
  if (path.startsWith('/orders/') && method === 'get') {
    const id = idFrom(path, '/orders/');
    return db.bookings.find((b) => b.id === id) || null;
  }
  if (path.startsWith('/orders/') && method === 'delete') {
    const id = idFrom(path, '/orders/');
    const o = db.bookings.find((b) => b.id === id);
    if (o) { o.status = 'cancelled'; save(); }
    return { success: true };
  }

  // ---- ANNOUNCEMENTS / NEWS -------------------------------------------------
  if (path === '/announcements' || path.endsWith('/announcements') || path === '/news') {
    if (method === 'post') {
      const n = { id: newId('news'), author_name: 'Siz', created_at: new Date().toISOString(), type: 'announcement', ...body };
      db.news.unshift(n);
      save();
      return n;
    }
    return paginate(db.news, params);
  }

  // ---- EVENTS ---------------------------------------------------------------
  if (path === '/events') return paginate(db.events, params);

  // ---- COMPLAINTS -----------------------------------------------------------
  if (path === '/complaints' && method === 'get') return paginate(db.complaints, params);
  if (path === '/complaints' && method === 'post') {
    const c = { id: newId('cmp'), status: 'new', created_at: new Date().toISOString(), ...body };
    db.complaints.unshift(c);
    save();
    return c;
  }

  // ---- PAYMENTS -------------------------------------------------------------
  if (path === '/payments' || path === '/payments/invoices') return paginate(db.payments, params);

  // ---- NOTIFICATIONS --------------------------------------------------------
  if (path === '/notifications' && method === 'get') return paginate(db.notifications, params);
  if (path === '/notifications/read-all' && method === 'patch') {
    db.notifications.forEach((n) => (n.is_read = true));
    save();
    return { success: true };
  }
  if (path.startsWith('/notifications/') && path.endsWith('/read')) {
    const id = path.split('/')[2];
    const n = db.notifications.find((x) => x.id === id);
    if (n) { n.is_read = true; save(); }
    return { success: true };
  }

  // ---- ADMIN: account management (RBAC) -------------------------------------
  if (path === '/admin/admins' && method === 'get') return paginate(db.admins, params);
  if (path === '/admin/admins' && method === 'post') {
    const admin = {
      id: newId('adm'),
      is_active: true,
      created_at: new Date().toISOString(),
      ...body,
    };
    db.admins.unshift(admin);
    // Record the privilege-sensitive action.
    db.auditLogs.unshift({
      id: newId('log'),
      actor: body.actor || 'Administrator',
      actor_role: body.actor_role || null,
      action: 'admin.create',
      meta: { role: body.role, scope: body.scope },
      created_at: new Date().toISOString(),
    });
    save();
    return admin;
  }
  if (path.startsWith('/admin/admins/') && method === 'delete') {
    const id = idFrom(path, '/admin/admins/');
    const a = db.admins.find((x) => x.id === id);
    if (a) { a.is_active = false; save(); }
    return { success: true };
  }

  // ---- ADMIN: audit logs ----------------------------------------------------
  if (path === '/admin/audit-logs' && method === 'get') return paginate(db.auditLogs, params);
  if (path === '/admin/audit-logs' && method === 'post') {
    const log = {
      id: newId('log'),
      actor: body.actor || 'Administrator',
      actor_role: body.actor_role || null,
      action: body.action,
      meta: body.meta || {},
      created_at: new Date().toISOString(),
    };
    db.auditLogs.unshift(log);
    save();
    return log;
  }

  // ---- ADMIN ----------------------------------------------------------------
  if (path === '/admin/stats') return ADMIN_STATS;
  if (path === '/admin/users') {
    const users = db.workers.map((w) => ({
      id: w.id,
      full_name: w.full_name,
      phone: '+99890' + Math.floor(1000000 + Math.random() * 8999999),
      role: 'worker',
      mahalla: w.mahalla,
      is_active: true,
    }));
    return paginate(users, params);
  }
  if (path === '/admin/providers/pending')
    return paginate(db.workers.filter((w) => w.verification_status === 'pending'), params);
  if (path.startsWith('/admin/providers/') && path.endsWith('/verify')) {
    const id = path.split('/')[3];
    const w = db.workers.find((x) => x.id === id);
    if (w) {
      w.verification_status = body.status || 'verified';
      db.auditLogs.unshift({
        id: newId('log'),
        actor: 'Administrator',
        actor_role: null,
        action: 'worker.verify',
        meta: { worker: w.full_name, status: w.verification_status },
        created_at: new Date().toISOString(),
      });
      save();
    }
    return { success: true };
  }
  if (path.startsWith('/admin/users/') && path.endsWith('/block')) return { success: true };

  // ---- USERS / PROFILE ------------------------------------------------------
  if (path === '/users/me' && method === 'patch') return { success: true, ...body };
  if (path === '/upload') return { url: 'https://via.placeholder.com/300' };

  // Fallback: unknown route → empty success so the UI doesn't crash.
  return { success: true };
}

export default async function mockAdapter(config) {
  await delay();
  const data = await route(config);
  if (data === null) {
    // Mimic an axios 404 rejection.
    return Promise.reject({
      response: { status: 404, data: { message: 'Topilmadi' }, config },
      config,
      isAxiosError: true,
    });
  }
  return ok(config, data);
}
