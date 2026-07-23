import { useLanguage } from '@/hooks/useLanguage';

// Compact language <select> — used next to the theme toggle across layouts.
const LanguageSwitcher = ({ className }) => {
  const { language, languages, setLanguage } = useLanguage();

  return (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
      aria-label="Til / Язык / Language"
      className={
        className ||
        'rounded-lg border border-gray-200 bg-transparent px-2 py-1.5 text-sm text-gray-600 outline-none transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'
      }
    >
      {languages.map((l) => (
        <option key={l.code} value={l.code}>{l.label}</option>
      ))}
    </select>
  );
};

export default LanguageSwitcher;
