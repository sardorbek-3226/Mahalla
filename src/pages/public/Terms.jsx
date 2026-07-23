import { useTranslation } from 'react-i18next';
import { HiOutlineDocumentText } from 'react-icons/hi2';
import ContentPage from '@/components/common/ContentPage';

const SECTION_KEYS = [
  'general',
  'account',
  'workers',
  'obligations',
  'payments',
  'liability',
  'changes',
];

const Terms = () => {
  const { t } = useTranslation();

  return (
    <ContentPage
      narrow
      icon={HiOutlineDocumentText}
      title={t('publicPages.terms.title')}
      subtitle={t('publicPages.terms.subtitle')}
    >
      <div className="space-y-8">
        {SECTION_KEYS.map((key) => (
          <section key={key}>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t(`publicPages.terms.sections.${key}.title`)}
            </h2>
            <p className="mt-2 leading-relaxed text-gray-600 dark:text-gray-300">
              {t(`publicPages.terms.sections.${key}.body`)}
            </p>
          </section>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-gray-100 bg-white p-6 text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-900">
        {t('publicPages.terms.contactNote')}{' '}
        <a href="/contact" className="font-medium text-primary-600 hover:underline">{t('publicPages.terms.contactLink')}</a>{' '}
        {t('publicPages.terms.contactNoteEnd')}
      </div>
    </ContentPage>
  );
};

export default Terms;
