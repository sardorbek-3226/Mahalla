import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import uzBase from './locales/uz.json';
import ruBase from './locales/ru.json';
import enBase from './locales/en.json';
import uzDashboard from './locales/uz/dashboard.json';
import ruDashboard from './locales/ru/dashboard.json';
import enDashboard from './locales/en/dashboard.json';
import uzBookings from './locales/uz/bookings.json';
import ruBookings from './locales/ru/bookings.json';
import enBookings from './locales/en/bookings.json';
import uzFeatures from './locales/uz/features.json';
import ruFeatures from './locales/ru/features.json';
import enFeatures from './locales/en/features.json';
import uzAdmin from './locales/uz/admin.json';
import ruAdmin from './locales/ru/admin.json';
import enAdmin from './locales/en/admin.json';
import uzMisc from './locales/uz/misc.json';
import ruMisc from './locales/ru/misc.json';
import enMisc from './locales/en/misc.json';

export const LANGUAGES = [
  { code: 'uz', label: "O'zbekcha" },
  { code: 'ru', label: 'Русский' },
  { code: 'en', label: 'English' },
];

const getInitialLanguage = () => {
  if (typeof window === 'undefined') return 'uz';
  return localStorage.getItem('language') || 'uz';
};

// Namespace files are merged in per-language; `common` additions from misc.json
// are deep-merged into the base `common` block instead of overwriting it.
const buildResource = (base, dashboard, bookings, features, admin, misc) => ({
  ...base,
  ...dashboard,
  ...bookings,
  ...features,
  ...admin,
  ...misc,
  common: { ...base.common, ...misc.common },
});

const uz = buildResource(uzBase, uzDashboard, uzBookings, uzFeatures, uzAdmin, uzMisc);
const ru = buildResource(ruBase, ruDashboard, ruBookings, ruFeatures, ruAdmin, ruMisc);
const en = buildResource(enBase, enDashboard, enBookings, enFeatures, enAdmin, enMisc);

i18n.use(initReactI18next).init({
  resources: { uz: { translation: uz }, ru: { translation: ru }, en: { translation: en } },
  lng: getInitialLanguage(),
  fallbackLng: 'uz',
  interpolation: { escapeValue: false },
});

export default i18n;
