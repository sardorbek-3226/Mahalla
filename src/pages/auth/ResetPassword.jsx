import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { HiOutlineLockClosed } from 'react-icons/hi2';
import { Button, Input, OtpInput } from '@/components/ui';
import { authService } from '@/services/authService';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const phone = location.state?.phone;
  const [code, setCode] = useState('');
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async ({ password }) => {
    if (code.length < 6) return toast.error("Kodni to'liq kiriting");
    try {
      await authService.resetPassword({ phone, code, password });
      toast.success('Parol yangilandi. Endi kirishingiz mumkin.');
      navigate('/login', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Tiklashda xatolik');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold">Yangi parol</h2>
      <p className="mt-1 text-sm text-gray-500">
        Yuborilgan kodni va yangi parolingizni kiriting.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Tasdiqlash kodi
          </label>
          <OtpInput value={code} onChange={setCode} />
        </div>
        <Input
          label="Yangi parol"
          type="password"
          placeholder="••••••••"
          leftIcon={<HiOutlineLockClosed className="h-4 w-4" />}
          error={errors.password?.message}
          {...register('password', { required: 'Parol majburiy', minLength: { value: 6, message: 'Kamida 6 ta belgi' } })}
        />
        <Input
          label="Parolni tasdiqlang"
          type="password"
          placeholder="••••••••"
          leftIcon={<HiOutlineLockClosed className="h-4 w-4" />}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Parolni tasdiqlang',
            validate: (v) => v === watch('password') || 'Parollar mos kelmadi',
          })}
        />
        <Button type="submit" variant="gradient" size="lg" loading={isSubmitting} className="w-full">
          Parolni yangilash
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

export default ResetPassword;
