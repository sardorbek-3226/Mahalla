import { HiOutlineDocumentText } from 'react-icons/hi2';
import ContentPage from '@/components/common/ContentPage';

const SECTIONS = [
  {
    title: '1. Umumiy qoidalar',
    body: 'Smart Mahalla platformasidan foydalanish orqali siz ushbu foydalanish shartlarini to‘liq qabul qilasiz. Shartlarga rozi bo‘lmasangiz, platformadan foydalanmang. Platforma O‘zbekiston Respublikasi qonunchiligiga muvofiq faoliyat yuritadi.',
  },
  {
    title: '2. Hisob yaratish',
    body: 'Ro‘yxatdan o‘tishda haqiqiy va to‘g‘ri ma’lumotlarni kiritishingiz shart. Hisobingiz xavfsizligi (parol, telefon raqami) uchun siz javobgarsiz. Boshqa shaxs nomidan soxta hisob yaratish taqiqlanadi.',
  },
  {
    title: '3. Ustalar va xizmatlar',
    body: 'Ustalar mahalla administratori tomonidan tekshiriladi (verifikatsiya). Biroq platforma ustalar tomonidan ko‘rsatilgan xizmat sifati uchun bevosita javobgar emas. Buyurtma shartlari va narxi foydalanuvchi bilan usta o‘rtasida kelishiladi.',
  },
  {
    title: '4. Foydalanuvchi majburiyatlari',
    body: 'Platformadan qonunga zid maqsadlarda foydalanish, boshqalarni haqorat qilish, spam tarqatish yoki firibgarlik taqiqlanadi. Qoidabuzarlik aniqlansa, hisob bloklanishi mumkin.',
  },
  {
    title: '5. To‘lovlar',
    body: 'Aholi uchun platformadan foydalanish bepul. Kelajakda joriy etiladigan pullik xizmatlar haqida foydalanuvchilar oldindan xabardor qilinadi. Ustalar bilan to‘lovlar to‘g‘ridan-to‘g‘ri yoki integratsiyalashgan to‘lov tizimi orqali amalga oshiriladi.',
  },
  {
    title: '6. Javobgarlikni cheklash',
    body: 'Platforma “bor holicha” taqdim etiladi. Texnik uzilishlar yoki uchinchi tomon xizmatlari sabab yuzaga kelgan zararlar uchun platforma javobgar bo‘lmaydi.',
  },
  {
    title: '7. Shartlarga o‘zgartirish',
    body: 'Biz ushbu shartlarni istalgan vaqtda yangilashimiz mumkin. Muhim o‘zgarishlar haqida foydalanuvchilar bildirishnoma orqali ogohlantiriladi. Yangilanishdan keyin platformadan foydalanishni davom ettirish o‘zgartirishlarni qabul qilish hisoblanadi.',
  },
];

const Terms = () => (
  <ContentPage
    narrow
    icon={HiOutlineDocumentText}
    title="Foydalanish shartlari"
    subtitle="Oxirgi yangilanish: 2026-yil 1-iyun"
  >
    <div className="space-y-8">
      {SECTIONS.map((s) => (
        <section key={s.title}>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{s.title}</h2>
          <p className="mt-2 leading-relaxed text-gray-600 dark:text-gray-300">{s.body}</p>
        </section>
      ))}
    </div>

    <div className="mt-12 rounded-2xl border border-gray-100 bg-white p-6 text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-900">
      Savollaringiz bo‘lsa, biz bilan{' '}
      <a href="/contact" className="font-medium text-primary-600 hover:underline">aloqa</a>{' '}
      bo‘limi orqali bog‘laning.
    </div>
  </ContentPage>
);

export default Terms;
