import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { Button, PhoneInput } from '@/components/ui';
import { authService } from '@/services/authService';
import { toApiPhone, isValidLocalPhone } from '@/utils/phone';

const ForgotPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  // Backend has no reset-password endpoint — recovery works by verifying an SMS
  // code for the phone, which logs the user straight back into their account.
  const onSubmit = async ({ phone: rawPhone }) => {
    const phone = toApiPhone(rawPhone);
    try {
      await authService.sendOtp({ phone });
      toast.success('Tasdiqlash kodi yuborildi');
      navigate('/verify-otp', { state: { phone, mode: 'recovery' } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Xatolik yuz berdi');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold">{t('auth.forgotPassword.title')}</h2>
      <p className="mt-1 text-sm text-gray-500">
        {t('auth.forgotPassword.subtitle')}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <PhoneInput
          label={t('auth.forgotPassword.phone')}
          error={errors.phone?.message}
          {...register('phone', {
            required: 'Telefon raqam majburiy',
            validate: (v) => isValidLocalPhone(v) || "Noto'g'ri format",
          })}
        />
        <Button type="submit" variant="gradient" size="lg" loading={isSubmitting} className="w-full">
          {t('auth.forgotPassword.submit')}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        <Link to="/login" className="font-semibold text-primary-600 hover:underline">
          {t('auth.forgotPassword.backToLogin')}
        </Link>
      </p>
    </div>
  );
};

export default ForgotPassword;
