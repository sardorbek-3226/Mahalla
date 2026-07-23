import { useTranslation } from 'react-i18next';
import { HiOutlinePhone, HiOutlineShieldExclamation } from 'react-icons/hi2';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/ui/Card';

const CONTACTS = [
  { key: 'fire', number: '101', color: 'from-red-500 to-orange-500' },
  { key: 'police', number: '102', color: 'from-blue-600 to-blue-500' },
  { key: 'ambulance', number: '103', color: 'from-rose-500 to-pink-500' },
  { key: 'gas', number: '104', color: 'from-amber-500 to-yellow-500' },
  { key: 'rescue', number: '1050', color: 'from-emerald-600 to-green-500' },
  { key: 'mahallaDuty', number: '+998 71 200 00 00', color: 'from-primary-600 to-accent-600' },
];

const Emergency = () => {
  const { t } = useTranslation();
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title={t('features.emergency.title')} subtitle={t('features.emergency.subtitle')} />

      <Card className="mb-6 flex items-center gap-4 border-l-4 border-l-red-500 p-5">
        <HiOutlineShieldExclamation className="h-10 w-10 shrink-0 text-red-500" />
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {t('features.emergency.warning')}
        </p>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        {CONTACTS.map((c) => (
          <a key={c.number} href={`tel:${c.number.replace(/\s/g, '')}`}>
            <Card className={`flex items-center justify-between bg-gradient-to-br ${c.color} p-5 text-white transition hover:scale-[1.02]`}>
              <div>
                <p className="text-sm text-white/80">{t(`features.emergency.contacts.${c.key}`)}</p>
                <p className="text-2xl font-extrabold">{c.number}</p>
              </div>
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                <HiOutlinePhone className="h-6 w-6" />
              </span>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Emergency;
