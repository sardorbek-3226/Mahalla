import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import uz from './locales/uz.json';
import ru from './locales/ru.json';
import en from './locales/en.json';

export const LANGUAGES = [
  { code: 'uz', label: "O'zbekcha" },
  { code: 'ru', label: 'Русский' },
  { code: 'en', label: 'English' },
];

const getInitialLanguage = () => {
  if (typeof window === 'undefined') return 'uz';
  return localStorage.getItem('language') || 'uz';
};

i18n.use(initReactI18next).init({
  resources: { uz: { translation: uz }, ru: { translation: ru }, en: { translation: en } },
  lng: getInitialLanguage(),
  fallbackLng: 'uz',
  interpolation: { escapeValue: false },
});

export default i18n;
