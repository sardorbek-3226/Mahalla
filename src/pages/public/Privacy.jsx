import { HiOutlineShieldCheck } from 'react-icons/hi2';
import ContentPage from '@/components/common/ContentPage';

const SECTIONS = [
  {
    title: '1. Qanday ma’lumotlarni yig‘amiz',
    body: 'Ro‘yxatdan o‘tishda ism, telefon raqami va (ixtiyoriy) email manzilingizni yig‘amiz. Xizmatdan foydalanish jarayonida buyurtmalar, manzillar, xabarlar va qurilma ma’lumotlari saqlanishi mumkin.',
  },
  {
    title: '2. Ma’lumotlardan foydalanish',
    body: 'Yig‘ilgan ma’lumotlar xizmatni ko‘rsatish, ustalar bilan bog‘lash, xavfsizlikni ta’minlash va platformani yaxshilash uchun ishlatiladi. Ma’lumotlaringizni reklama maqsadida uchinchi tomonlarga sotmaymiz.',
  },
  {
    title: '3. Ma’lumotlarni ulashish',
    body: 'Buyurtma jarayonida zarur ma’lumotlar (ism, manzil) tegishli usta bilan ulashiladi. Qonun talab qilgan hollarda vakolatli organlarga ma’lumot taqdim etilishi mumkin.',
  },
  {
    title: '4. Xavfsizlik',
    body: 'Ma’lumotlaringiz shifrlash (HTTPS), xavfsiz autentifikatsiya (HTTP-only cookie) va kirishni cheklash orqali himoyalanadi. Biroq internetda hech bir tizim 100% xavfsiz emasligini yodda tuting.',
  },
  {
    title: '5. Sizning huquqlaringiz',
    body: 'Siz o‘z ma’lumotlaringizni ko‘rish, tahrirlash yoki hisobingizni o‘chirishni so‘rash huquqiga egasiz. Buning uchun sozlamalar bo‘limidan yoki qo‘llab-quvvatlash xizmatidan foydalaning.',
  },
  {
    title: '6. Cookie fayllari',
    body: 'Platforma sessiyani saqlash va xavfsizlik uchun cookie fayllaridan foydalanadi. Brauzer sozlamalaridan cookie‘larni boshqarishingiz mumkin, ammo bu ba’zi funksiyalarga ta’sir qilishi mumkin.',
  },
];

const Privacy = () => (
  <ContentPage
    narrow
    icon={HiOutlineShieldCheck}
    title="Maxfiylik siyosati"
    subtitle="Sizning ma’lumotlaringiz xavfsizligi biz uchun muhim."
  >
    <div className="space-y-8">
      {SECTIONS.map((s) => (
        <section key={s.title}>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{s.title}</h2>
          <p className="mt-2 leading-relaxed text-gray-600 dark:text-gray-300">{s.body}</p>
        </section>
      ))}
    </div>
  </ContentPage>
);

export default Privacy;
