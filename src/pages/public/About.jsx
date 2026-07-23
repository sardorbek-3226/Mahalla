import { useTranslation } from 'react-i18next';
import {
  HiOutlineBuildingOffice2,
  HiOutlineShieldCheck,
  HiOutlineUsers,
  HiOutlineMapPin,
  HiOutlineHeart,
  HiOutlineSparkles,
} from 'react-icons/hi2';
import ContentPage from '@/components/common/ContentPage';

const VALUES = [
  { icon: HiOutlineShieldCheck, key: 'trust' },
  { icon: HiOutlineUsers, key: 'community' },
  { icon: HiOutlineHeart, key: 'convenience' },
  { icon: HiOutlineSparkles, key: 'transparency' },
];

const About = () => {
  const { t } = useTranslation();

  return (
    <ContentPage
      icon={HiOutlineBuildingOffice2}
      title={t('publicPages.about.title')}
      subtitle={t('publicPages.about.subtitle')}
    >
      <div className="space-y-12">
        <section className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('publicPages.about.missionTitle')}</h2>
            <p className="mt-3 leading-relaxed text-gray-600 dark:text-gray-300">
              {t('publicPages.about.missionText')}
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('publicPages.about.whatWeDoTitle')}</h2>
            <p className="mt-3 leading-relaxed text-gray-600 dark:text-gray-300">
              {t('publicPages.about.whatWeDoText')}
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-center text-xl font-bold text-gray-900 dark:text-white">{t('publicPages.about.valuesTitle')}</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <div key={v.key} className="card p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 dark:bg-primary-900/30">
                  <v.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">{t(`publicPages.about.values.${v.key}.title`)}</h3>
                <p className="mt-1 text-sm text-gray-500">{t(`publicPages.about.values.${v.key}.desc`)}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-6 text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
          <HiOutlineMapPin className="h-6 w-6 shrink-0 text-primary-600" />
          <p>{t('publicPages.about.coverage')}</p>
        </section>
      </div>
    </ContentPage>
  );
};

export default About;
