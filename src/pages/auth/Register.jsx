import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { HiOutlineUser, HiOutlinePhone, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeSlash } from 'react-icons/hi2';
import { Button, Input } from '@/components/ui';
import { authService } from '@/services/authService';
import { setUser } from '@/redux/slices/authSlice';
import { ROLES, ROLE_LABELS, ROLE_HOME, PUBLIC_REGISTRATION_ROLES } from '@/constants/roles';
import { ENV } from '@/config/env';

// SECURITY: public registration may ONLY offer Citizen / Worker / Organization.
// Admin roles are NEVER selectable here — they are created from the Admin Panel.
// The real backend currently accepts only Citizen (RESIDENT) and Worker (PROVIDER).
const SELECTABLE_ROLES = ENV.MOCK_AUTH
  ? PUBLIC_REGISTRATION_ROLES
  : [ROLES.CITIZEN, ROLES.WORKER];

const ROLE_HINTS = {
  [ROLES.CITIZEN]: 'Xizmat qidiruvchi aholi',
  [ROLES.WORKER]: 'Xizmat ko‘rsatuvchi usta',
  [ROLES.ORGANIZATION]: 'Ish beruvchi tashkilot',
};

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { role: ROLES.CITIZEN } });

  const onSubmit = async ({ confirmPassword, ...payload }) => {
    // Defence in depth: reject any tampered role before it reaches the API.
    if (!SELECTABLE_ROLES.includes(payload.role)) {
      toast.error('Ruxsat etilmagan rol tanlandi');
      return;
    }
    try {
      const user = await authService.register(payload);
      // Real backend returns tokens + user on register → log straight in.
      if (!ENV.MOCK_AUTH && user?.role) {
        dispatch(setUser(user));
        toast.success('Xush kelibsiz!');
        navigate(ROLE_HOME[user.role] || '/', { replace: true });
        return;
      }
      // Mock/demo: continue with OTP verification.
      await authService.sendOtp({ phone: payload.phone });
      toast.success('Tasdiqlash kodi yuborildi');
      navigate('/verify-otp', { state: { phone: payload.phone } });
    } catch (err) {
      const m = err.response?.data?.message;
      toast.error((Array.isArray(m) ? m[0] : m) || 'Ro\'yxatdan o\'tishda xatolik');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold">Ro&apos;yxatdan o&apos;tish</h2>
      <p className="mt-1 text-sm text-gray-500">Mahalla platformasiga qo&apos;shiling.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <Input
          label="To'liq ism"
          placeholder="Ism Familiya"
          leftIcon={<HiOutlineUser className="h-4 w-4" />}
          error={errors.full_name?.message}
          {...register('full_name', { required: 'Ism majburiy', minLength: { value: 3, message: 'Juda qisqa' } })}
        />
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

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Hisob turi
          </label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {SELECTABLE_ROLES.map((role) => (
              <label
                key={role}
                className="flex cursor-pointer flex-col gap-1 rounded-xl border border-gray-200 px-4 py-3 text-sm transition has-[:checked]:border-primary-500 has-[:checked]:bg-primary-50 dark:border-gray-700 dark:has-[:checked]:bg-primary-900/20"
              >
                <span className="flex items-center gap-2 font-medium">
                  <input type="radio" value={role} className="accent-primary-600" {...register('role')} />
                  {ROLE_LABELS[role]}
                </span>
                <span className="pl-6 text-xs text-gray-400">{ROLE_HINTS[role]}</span>
              </label>
            ))}
          </div>
        </div>

        <Input
          label="Parol"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          leftIcon={<HiOutlineLockClosed className="h-4 w-4" />}
          rightIcon={
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword((v) => !v)}
              className="pointer-events-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              aria-label={showPassword ? 'Parolni yashirish' : 'Parolni koʻrsatish'}
            >
              {showPassword ? <HiOutlineEyeSlash className="h-4 w-4" /> : <HiOutlineEye className="h-4 w-4" />}
            </button>
          }
          error={errors.password?.message}
          {...register('password', { required: 'Parol majburiy', minLength: { value: 6, message: 'Kamida 6 ta belgi' } })}
        />
        <Input
          label="Parolni tasdiqlang"
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder="••••••••"
          leftIcon={<HiOutlineLockClosed className="h-4 w-4" />}
          rightIcon={
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowConfirmPassword((v) => !v)}
              className="pointer-events-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              aria-label={showConfirmPassword ? 'Parolni yashirish' : 'Parolni koʻrsatish'}
            >
              {showConfirmPassword ? <HiOutlineEyeSlash className="h-4 w-4" /> : <HiOutlineEye className="h-4 w-4" />}
            </button>
          }
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Parolni tasdiqlang',
            validate: (v) => v === watch('password') || 'Parollar mos kelmadi',
          })}
        />

        <Button type="submit" variant="gradient" size="lg" loading={isSubmitting} className="w-full">
          Ro&apos;yxatdan o&apos;tish
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Hisobingiz bormi?{' '}
        <Link to="/login" className="font-semibold text-primary-600 hover:underline">
          Kiring
        </Link>
      </p>
    </div>
  );
};

export default Register;
