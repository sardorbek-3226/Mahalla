import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HiOutlineQuestionMarkCircle, HiChevronDown } from 'react-icons/hi2';
import ContentPage from '@/components/common/ContentPage';

const FAQS = [
  {
    q: 'Platformadan foydalanish pullikmi?',
    a: 'Yo‘q. Mahalla aholisi uchun Smart Mahalla’dan foydalanish mutlaqo bepul. Ustalar ham o‘z xizmatlarini bepul joylashtiradi.',
  },
  {
    q: 'Ustalar qanday tekshiriladi?',
    a: 'Har bir usta ro‘yxatdan o‘tgach hujjatlarini yuklaydi. Mahalla administratori ularni ko‘rib chiqib tasdiqlaydi. Faqat tasdiqlangan ustalar “tekshirilgan” belgisini oladi.',
  },
  {
    q: 'Qaysi hududlarda ishlaysiz?',
    a: 'Hozirda Toshkent shahrining 8 ta mahallasida faolmiz. Yangi hududlarni bosqichma-bosqich qo‘shib bormoqdamiz.',
  },
  {
    q: 'Buyurtma qanday beriladi?',
    a: 'Ro‘yxatdan o‘ting, kerakli kategoriyani tanlang yoki so‘rov joylang, mos ustani tanlab buyurtma bering va u bilan chat orqali bog‘laning.',
  },
  {
    q: 'Usta sifatida qanday ro‘yxatdan o‘taman?',
    a: 'Ro‘yxatdan o‘tishda “Usta” rolini tanlang, profilingizni to‘ldiring va hujjatlaringizni yuklang. Tasdiqlangach buyurtmalar qabul qila olasiz.',
  },
  {
    q: 'To‘lov qanday amalga oshiriladi?',
    a: 'Hozircha to‘lovlar usta bilan to‘g‘ridan-to‘g‘ri kelishiladi. Kelajakda Payme/Click kabi to‘lov tizimlari integratsiya qilinadi.',
  },
];

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
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <ContentPage
      narrow
      icon={HiOutlineQuestionMarkCircle}
      title="Ko‘p so‘raladigan savollar"
      subtitle="Eng ko‘p beriladigan savollarga javoblar."
    >
      <div className="space-y-3">
        {FAQS.map((item, i) => (
          <FaqItem
            key={item.q}
            item={item}
            open={openIdx === i}
            onToggle={() => setOpenIdx(openIdx === i ? -1 : i)}
          />
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-gray-100 bg-white p-6 text-center text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-900">
        Javobini topa olmadingizmi?{' '}
        <a href="/contact" className="font-medium text-primary-600 hover:underline">Biz bilan bog‘laning</a>
      </div>
    </ContentPage>
  );
};

export default Faq;
