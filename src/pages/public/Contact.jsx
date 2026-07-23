import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
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

const Contact = () => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const INFO = [
    { icon: HiOutlinePhone, key: 'phone', title: t('publicPages.contact.info.phone'), value: '+998 71 200 00 00' },
    { icon: HiOutlineEnvelope, key: 'email', title: t('publicPages.contact.info.email'), value: 'support@smartmahalla.uz' },
    { icon: HiOutlineMapPin, key: 'address', title: t('publicPages.contact.info.address'), value: t('publicPages.contact.info.addressValue') },
    { icon: HiOutlineClock, key: 'hours', title: t('publicPages.contact.info.hours'), value: t('publicPages.contact.info.hoursValue') },
  ];

  const onSubmit = async (data) => {
    // Backend hali ulanmagan — so'rov tayyor (services/contactService) bo'lgach
    // shu yerga ulanadi. Hozircha foydalanuvchiga tasdiq ko'rsatamiz.
    void data;
    await new Promise((r) => setTimeout(r, 600));
    toast.success(t('publicPages.contact.successToast'));
    reset();
  };

  return (
    <ContentPage
      icon={HiOutlineChatBubbleLeftRight}
      title={t('publicPages.contact.title')}
      subtitle={t('publicPages.contact.subtitle')}
    >
      <div className="grid gap-8 lg:grid-cols-5">
        {/* Info */}
        <div className="space-y-4 lg:col-span-2">
          {INFO.map((i) => (
            <div
              key={i.key}
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
              label={t('publicPages.contact.form.name')}
              placeholder={t('publicPages.contact.form.namePlaceholder')}
              error={errors.name?.message}
              {...register('name', { required: t('publicPages.contact.form.nameRequired') })}
            />
            <Input
              label={t('publicPages.contact.form.phone')}
              placeholder="+998 90 123 45 67"
              error={errors.phone?.message}
              {...register('phone', { required: t('publicPages.contact.form.phoneRequired') })}
            />
          </div>
          <Input
            label={t('publicPages.contact.form.email')}
            type="email"
            placeholder="email@example.com"
            error={errors.email?.message}
            {...register('email', {
              pattern: { value: /^\S+@\S+$/, message: t('publicPages.contact.form.emailInvalid') },
            })}
          />
          <div className="w-full">
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('publicPages.contact.form.message')}
            </label>
            <textarea
              rows={5}
              placeholder={t('publicPages.contact.form.messagePlaceholder')}
              className="input-base resize-none"
              {...register('message', { required: t('publicPages.contact.form.messageRequired') })}
            />
            {errors.message && (
              <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>
            )}
          </div>
          <Button type="submit" variant="gradient" className="w-full" loading={isSubmitting}>
            {t('publicPages.contact.form.submit')}
          </Button>
        </form>
      </div>
    </ContentPage>
  );
};

export default Contact;
