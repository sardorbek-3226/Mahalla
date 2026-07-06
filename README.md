# Smart Mahalla — Frontend

Mahalla xizmatlari platformasining frontend qismi. `BACKEND_TZ.md` dagi API kontrakti asosida qurilgan.

## Texnologiyalar

React 19 · Vite · React Router · Redux Toolkit + Persist · React Query · Axios · Tailwind CSS · Framer Motion · Socket.IO Client · Chart.js · React Leaflet · Firebase Messaging · React Hook Form · React Hot Toast.

## Ishga tushirish

```bash
cd frontend
cp .env.example .env        # backend URL larini kiriting
npm install                 # react-leaflet@4 + React 19 uchun: npm install --legacy-peer-deps
npm run dev                 # http://localhost:3000
```

## Build

```bash
npm run build
npm run preview
```

## Arxitektura

```
src/
├── api/           # axios instance, interceptorlar, refresh-token, endpoints
├── components/    # ui/ (reusable kit), layout/, dashboard/, common/
├── config/        # env, queryClient, firebase
├── constants/     # roles, navigation
├── context/       # SocketProvider (socket lifecycle)
├── hooks/         # useAuth, useTheme, useDebounce
├── layouts/       # AuthLayout, DashboardLayout
├── pages/         # auth/, dashboards/, errors/, Landing, Placeholder
├── redux/         # store + slices (auth, ui, notifications, chat)
├── routes/        # AppRoutes, Protected/Role/Public routes
├── services/      # auth, booking, worker, admin (REST wrappers)
├── socket/        # socket.io client + event nomlari
├── styles/        # tailwind + theme
└── utils/         # cn, format
```

## Auth oqimi

- Tokenlar **HTTP-only cookie** da (`withCredentials: true`).
- `App.jsx` ishga tushganda `/auth/me` orqali sessiyani tiklaydi.
- 401 da axios **bir marta** `/auth/refresh` qiladi (single-flight queue), muvaffaqiyatsiz bo'lsa logout.
- `ProtectedRoute` / `RoleRoute` / `PublicRoute` bilan marshrut himoyasi.

## Backend bilan ulash

Barcha endpointlar bitta joyda: [`src/api/endpoints.js`](src/api/endpoints.js). Agar haqiqiy
backend yo'llari TZ dan farq qilsa — faqat shu fayl va tegishli `services/*` ni o'zgartiring.

## Holat (1-bosqich)

✅ To'liq arxitektura, auth (Login/Register/OTP/parol tiklash), role-based routing, 3 ta dashboard
(Fuqaro/Usta/Admin), UI kit, theme/dark mode, socket va push setup.
⏳ Qolgan sahifalar (`Placeholder` bilan belgilangan) keyingi bosqichlarda shu pattern bilan to'ldiriladi.
