import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { HiOutlineQuestionMarkCircle, HiChevronDown } from 'react-icons/hi2';
import ContentPage from '@/components/common/ContentPage';

const FAQ_KEYS = ['pricing', 'verification', 'coverage', 'ordering', 'becomeWorker', 'payment'];

const FaqItem = ({ item, open, onToggle }) => (
  <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900">
    <button
      onClick={onToggle}
      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
    >
      <span className="font-medium text-gray-900 dark:text-white">{item.q}</span>
      <HiChevronDown
        className={`h-5 w-5 shrink-0 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
      />
    </button>
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <p className="px-5 pb-5 leading-relaxed text-gray-600 dark:text-gray-300">{item.a}</p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const Faq = () => {
  const { t } = useTranslation();
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = FAQ_KEYS.map((key) => ({
    key,
    q: t(`publicPages.faq.items.${key}.q`),
    a: t(`publicPages.faq.items.${key}.a`),
  }));

  return (
    <ContentPage
      narrow
      icon={HiOutlineQuestionMarkCircle}
      title={t('publicPages.faq.title')}
      subtitle={t('publicPages.faq.subtitle')}
    >
      <div className="space-y-3">
        {faqs.map((item, i) => (
          <FaqItem
            key={item.key}
            item={item}
            open={openIdx === i}
            onToggle={() => setOpenIdx(openIdx === i ? -1 : i)}
          />
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-gray-100 bg-white p-6 text-center text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-900">
        {t('publicPages.faq.notFound')}{' '}
        <a href="/contact" className="font-medium text-primary-600 hover:underline">{t('publicPages.faq.contactLink')}</a>
      </div>
    </ContentPage>
  );
};

export default Faq;
