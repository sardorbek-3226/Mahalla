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
  { icon: HiOutlineShieldCheck, title: 'Ishonch', desc: 'Har bir usta mahalla administratori tomonidan tekshiriladi.' },
  { icon: HiOutlineUsers, title: 'Hamjamiyat', desc: 'Mahalla aholisini birlashtiruvchi raqamli makon.' },
  { icon: HiOutlineHeart, title: 'Qulaylik', desc: 'Kerakli xizmatni bir necha daqiqada toping.' },
  { icon: HiOutlineSparkles, title: 'Shaffoflik', desc: 'Reyting va sharhlar orqali ochiq baholash tizimi.' },
];

const About = () => (
  <ContentPage
    icon={HiOutlineBuildingOffice2}
    title="Biz haqimizda"
    subtitle="Smart Mahalla — O‘zbekiston mahallalari uchun zamonaviy raqamli xizmatlar platformasi."
  >
    <div className="space-y-12">
      <section className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Bizning maqsadimiz</h2>
          <p className="mt-3 leading-relaxed text-gray-600 dark:text-gray-300">
            Smart Mahalla mahalla aholisini tekshirilgan ustalar va xizmat ko‘rsatuvchilar bilan
            bog‘laydi. Maqsadimiz — mahalla hayotini raqamlashtirish, mahalliy xizmatlarni
            qulay, ishonchli va shaffof qilish.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Biz nima qilamiz</h2>
          <p className="mt-3 leading-relaxed text-gray-600 dark:text-gray-300">
            Elektrik, santexnik, repetitor, tozalovchi va boshqa ko‘plab kasb egalarini bir
            platformaga jamlaymiz. Aholi buyurtma beradi, ustalar bilan real-time yozishadi,
            xizmatni baholaydi — barchasi bitta ilovada.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-center text-xl font-bold text-gray-900 dark:text-white">Qadriyatlarimiz</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v) => (
            <div key={v.title} className="card p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 dark:bg-primary-900/30">
                <v.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">{v.title}</h3>
              <p className="mt-1 text-sm text-gray-500">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-6 text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
        <HiOutlineMapPin className="h-6 w-6 shrink-0 text-primary-600" />
        <p>Hozirda Toshkent shahrining 8 ta mahallasida faoliyat yuritmoqdamiz va tez orada butun respublika bo‘ylab kengaymoqdamiz.</p>
      </section>
    </div>
  </ContentPage>
);

export default About;
