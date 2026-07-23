import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { setLanguage } from '@/redux/slices/uiSlice';
import { LANGUAGES } from '@/i18n';

// Keeps i18next's active language in sync with the persisted redux state.
export const useLanguage = () => {
  const { i18n } = useTranslation();
  const language = useSelector((s) => s.ui.language);
  const dispatch = useDispatch();

  useEffect(() => {
    i18n.changeLanguage(language);
    localStorage.setItem('language', language);
  }, [language, i18n]);

  return {
    language,
    languages: LANGUAGES,
    setLanguage: (code) => dispatch(setLanguage(code)),
  };
};
