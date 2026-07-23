import { useTranslation } from 'react-i18next';
import { HiOutlineShieldCheck } from 'react-icons/hi2';
import ContentPage from '@/components/common/ContentPage';

const SECTION_KEYS = [
  'dataCollection',
  'dataUse',
  'dataSharing',
  'security',
  'rights',
  'cookies',
];

const Privacy = () => {
  const { t } = useTranslation();

  return (
    <ContentPage
      narrow
      icon={HiOutlineShieldCheck}
      title={t('publicPages.privacy.title')}
      subtitle={t('publicPages.privacy.subtitle')}
    >
      <div className="space-y-8">
        {SECTION_KEYS.map((key) => (
          <section key={key}>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t(`publicPages.privacy.sections.${key}.title`)}
            </h2>
            <p className="mt-2 leading-relaxed text-gray-600 dark:text-gray-300">
              {t(`publicPages.privacy.sections.${key}.body`)}
            </p>
          </section>
        ))}
      </div>
    </ContentPage>
  );
};

export default Privacy;
