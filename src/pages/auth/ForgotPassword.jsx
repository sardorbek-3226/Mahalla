import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { HiOutlinePhone, HiOutlineShieldExclamation } from 'react-icons/hi2';
import { Button, Input } from '@/components/ui';
import { authService } from '@/services/authService';
import { ENV } from '@/config/env';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async ({ phone }) => {
    try {
      await authService.forgotPassword({ phone });
      toast.success('Tiklash kodi yuborildi');
      navigate('/reset-password', { state: { phone } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Xatolik yuz berdi');
    }
  };

  // Real backend has no password-reset endpoint yet (only the offline demo does).
  if (!ENV.MOCK_AUTH) {
    return (
      <div>
        <h2 className="text-2xl font-bold">Parolni tiklash</h2>
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-200">
          <HiOutlineShieldExclamation className="mt-0.5 h-5 w-5 shrink-0" />
          <p>
            Hozircha parolni mustaqil tiklash imkoniyati mavjud emas. Yordam uchun mahalla
            administratoriga murojaat qiling.
          </p>
        </div>
        <p className="mt-6 text-center text-sm text-gray-500">
          <Link to="/login" className="font-semibold text-primary-600 hover:underline">
            Kirishga qaytish
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold">Parolni tiklash</h2>
      <p className="mt-1 text-sm text-gray-500">
        Telefon raqamingizni kiriting — sizga tiklash kodi yuboramiz.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <Input
          label="Telefon raqam"
          placeholder="+998 90 123 45 67"
          leftIcon={<HiOutlinePhone className="h-4 w-4" />}
          error={errors.phone?.message}
          {...register('phone', {
            required: 'Telefon raqam majburiy',
            pattern: { value: /^\+?\d{9,15}$/, message: "Noto'g'ri format" },
          })}
        />
        <Button type="submit" variant="gradient" size="lg" loading={isSubmitting} className="w-full">
          Kod yuborish
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        <Link to="/login" className="font-semibold text-primary-600 hover:underline">
          Kirishga qaytish
        </Link>
      </p>
    </div>
  );
};

export default ForgotPassword;
