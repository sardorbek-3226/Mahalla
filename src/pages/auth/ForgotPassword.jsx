import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { HiOutlinePhone } from 'react-icons/hi2';
import { Button, Input } from '@/components/ui';
import { authService } from '@/services/authService';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  // Backend has no reset-password endpoint — recovery works by verifying an SMS
  // code for the phone, which logs the user straight back into their account.
  const onSubmit = async ({ phone }) => {
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
      <h2 className="text-2xl font-bold">Hisobga qaytish</h2>
      <p className="mt-1 text-sm text-gray-500">
        Parolni eslay olmayapsizmi? Telefon raqamingizni kiriting — sizga SMS orqali kod
        yuboramiz va kod bilan hisobingizga qayta kirasiz.
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
