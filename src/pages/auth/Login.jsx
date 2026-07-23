import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeSlash } from 'react-icons/hi2';
import { Button, Input, PhoneInput } from '@/components/ui';
import GoogleButton from '@/components/common/GoogleButton';
import { login } from '@/redux/slices/authSlice';
import { ROLE_HOME, ROLES, ROLE_LABELS } from '@/constants/roles';
import { ENV } from '@/config/env';
import { toApiPhone, isValidLocalPhone } from '@/utils/phone';

const Login = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { role: ROLES.CITIZEN } });

  const onSubmit = async (values) => {
    const result = await dispatch(login({ ...values, phone: toApiPhone(values.phone) }));
    if (login.fulfilled.match(result)) {
      toast.success('Xush kelibsiz!');
      const role = result.payload?.role;
      const from = location.state?.from?.pathname;
      navigate(from || ROLE_HOME[role] || '/', { replace: true });
    } else {
      toast.error(result.payload || 'Telefon yoki parol xato');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold">{t('auth.login.title')}</h2>
      <p className="mt-1 text-sm text-gray-500">{t('auth.login.subtitle')}</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <PhoneInput
          label={t('auth.login.phone')}
          error={errors.phone?.message}
          {...register('phone', {
            required: 'Telefon raqam majburiy',
            validate: (v) => isValidLocalPhone(v) || "Noto'g'ri format",
          })}
        />
        <Input
          label={t('auth.login.password')}
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

        {/* Offline demo: pick which role's panel to enter */}
        {ENV.MOCK_AUTH && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Rol (demo)
            </label>
            <select className="input-base" {...register('role')}>
              {Object.values(ROLES).map((role) => (
                <option key={role} value={role}>{ROLE_LABELS[role]}</option>
              ))}
            </select>
          </div>
        )}

        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-sm font-medium text-primary-600 hover:underline">
            {t('auth.login.forgot')}
          </Link>
        </div>

        <Button type="submit" variant="gradient" size="lg" loading={isSubmitting} className="w-full">
          {t('auth.login.submit')}
        </Button>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs text-gray-400">
        <span className="h-px flex-1 bg-gray-200 dark:bg-gray-700" /> {t('auth.login.or')} <span className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
      </div>
      <GoogleButton label={t('auth.login.google')} />

      <p className="mt-6 text-center text-sm text-gray-500">
        {t('auth.login.noAccount')}{' '}
        <Link to="/register" className="font-semibold text-primary-600 hover:underline">
          {t('auth.login.registerLink')}
        </Link>
      </p>
    </div>
  );
};

export default Login;
