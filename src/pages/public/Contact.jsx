import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineMapPin,
  HiOutlineClock,
  HiOutlineChatBubbleLeftRight,
} from 'react-icons/hi2';
import ContentPage from '@/components/common/ContentPage';
import { Input, Button } from '@/components/ui';

const INFO = [
  { icon: HiOutlinePhone, title: 'Telefon', value: '+998 71 200 00 00' },
  { icon: HiOutlineEnvelope, title: 'Email', value: 'support@smartmahalla.uz' },
  { icon: HiOutlineMapPin, title: 'Manzil', value: 'Toshkent sh., Chilonzor tumani' },
  { icon: HiOutlineClock, title: 'Ish vaqti', value: 'Dush–Shan, 9:00–18:00' },
];

const Contact = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    // Backend hali ulanmagan — so'rov tayyor (services/contactService) bo'lgach
    // shu yerga ulanadi. Hozircha foydalanuvchiga tasdiq ko'rsatamiz.
    void data;
    await new Promise((r) => setTimeout(r, 600));
    toast.success('Xabaringiz qabul qilindi! Tez orada bog‘lanamiz.');
    reset();
  };

  return (
    <ContentPage
      icon={HiOutlineChatBubbleLeftRight}
      title="Aloqa"
      subtitle="Savol, taklif yoki muammo bo‘lsa — bizga yozing."
    >
      <div className="grid gap-8 lg:grid-cols-5">
        {/* Info */}
        <div className="space-y-4 lg:col-span-2">
          {INFO.map((i) => (
            <div
              key={i.title}
              className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-900/30">
                <i.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm text-gray-500">{i.title}</p>
                <p className="font-medium text-gray-900 dark:text-white">{i.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 lg:col-span-3"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Ism"
              placeholder="Ismingiz"
              error={errors.name?.message}
              {...register('name', { required: 'Ismni kiriting' })}
            />
            <Input
              label="Telefon"
              placeholder="+998 90 123 45 67"
              error={errors.phone?.message}
              {...register('phone', { required: 'Telefon raqamini kiriting' })}
            />
          </div>
          <Input
            label="Email"
            type="email"
            placeholder="email@example.com"
            error={errors.email?.message}
            {...register('email', {
              pattern: { value: /^\S+@\S+$/, message: 'Email noto‘g‘ri' },
            })}
          />
          <div className="w-full">
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Xabar
            </label>
            <textarea
              rows={5}
              placeholder="Xabaringizni yozing…"
              className="input-base resize-none"
              {...register('message', { required: 'Xabar matnini kiriting' })}
            />
            {errors.message && (
              <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>
            )}
          </div>
          <Button type="submit" variant="gradient" className="w-full" loading={isSubmitting}>
            Yuborish
          </Button>
        </form>
      </div>
    </ContentPage>
  );
};

export default Contact;
