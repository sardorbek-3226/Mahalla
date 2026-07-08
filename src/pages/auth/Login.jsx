import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { HiOutlinePhone, HiOutlineLockClosed } from 'react-icons/hi2';
import { Button, Input } from '@/components/ui';
import GoogleButton from '@/components/common/GoogleButton';
import { login } from '@/redux/slices/authSlice';
import { ROLE_HOME, ROLES, ROLE_LABELS } from '@/constants/roles';
import { ENV } from '@/config/env';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { role: ROLES.CITIZEN } });

  const onSubmit = async (values) => {
    const result = await dispatch(login(values));
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
      <h2 className="text-2xl font-bold">Hisobingizga kiring</h2>
      <p className="mt-1 text-sm text-gray-500">Telefon raqam va parolingizni kiriting.</p>

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
        <Input
          label="Parol"
          type="password"
          placeholder="••••••••"
          leftIcon={<HiOutlineLockClosed className="h-4 w-4" />}
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

        {/* Real backend has no password-reset endpoint yet — only the mock/demo does. */}
        {ENV.MOCK_AUTH && (
          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-sm font-medium text-primary-600 hover:underline">
              Parolni unutdingizmi?
            </Link>
          </div>
        )}

        <Button type="submit" variant="gradient" size="lg" loading={isSubmitting} className="w-full">
          Kirish
        </Button>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs text-gray-400">
        <span className="h-px flex-1 bg-gray-200 dark:bg-gray-700" /> yoki <span className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
      </div>
      <GoogleButton label="Google bilan kirish" />

      <p className="mt-6 text-center text-sm text-gray-500">
        Hisobingiz yo'qmi?{' '}
        <Link to="/register" className="font-semibold text-primary-600 hover:underline">
          Ro'yxatdan o'ting
        </Link>
      </p>
    </div>
  );
};

export default Login;
