import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { HiOutlineUser, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeSlash } from 'react-icons/hi2';
import { Button, Input, PhoneInput } from '@/components/ui';
import LocationPicker from '@/components/common/LocationPicker';
import { authService } from '@/services/authService';
import { mahallaService } from '@/services/geoService';
import { setUser } from '@/redux/slices/authSlice';
import { ROLES, ROLE_LABELS, ROLE_HOME, PUBLIC_REGISTRATION_ROLES } from '@/constants/roles';
import { UZ_REGIONS, districtsOf } from '@/constants/uzbekistan';
import { ENV } from '@/config/env';
import { toApiPhone, isValidLocalPhone } from '@/utils/phone';
import { saveRegisteredLocation } from '@/utils/registeredLocation';

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
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [coords, setCoords] = useState(null);
  const [viloyat, setViloyat] = useState('');
  const [tuman, setTuman] = useState('');
  const [mahallaText, setMahallaText] = useState('');
  const [mahallaId, setMahallaId] = useState('');
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { role: ROLES.CITIZEN } });

  const tumanlar = districtsOf(viloyat);

  // Auto-detect the mahalla from the picked map point — user can still edit below.
  const { data: nearestMahalla } = useQuery({
    queryKey: ['mahalla-nearest', coords?.lat, coords?.lng],
    queryFn: () => mahallaService.nearest({ lat: coords.lat, lng: coords.lng }),
    enabled: !!coords,
  });

  useEffect(() => {
    if (!nearestMahalla?.id) return;
    setMahallaId(nearestMahalla.id);
    setMahallaText(nearestMahalla.name || '');
    const matchedRegion = UZ_REGIONS.find(
      (r) => r.name.toLowerCase() === (nearestMahalla.region_name || '').toLowerCase()
    );
    if (matchedRegion) {
      setViloyat(matchedRegion.name);
      const matchedDistrict = matchedRegion.districts.find(
        (d) => d.toLowerCase() === (nearestMahalla.district || '').toLowerCase()
      );
      setTuman(matchedDistrict || nearestMahalla.district || '');
    }
  }, [nearestMahalla]);

  // Editing the mahalla name by hand means it's no longer the auto-detected record.
  const handleMahallaTextChange = (e) => {
    setMahallaText(e.target.value);
    setMahallaId('');
  };

  const onSubmit = async ({ confirmPassword, address, ...payload }) => {
    // Defence in depth: reject any tampered role before it reaches the API.
    if (!SELECTABLE_ROLES.includes(payload.role)) {
      toast.error('Ruxsat etilmagan rol tanlandi');
      return;
    }
    const phone = toApiPhone(payload.phone);
    // The backend auto-creates a new mahalla record from mahallaName when it's
    // not an existing one (mahallaId). Fold viloyat/tuman into the free-text
    // address since RegisterDto has no dedicated region/district fields.
    const fullAddress = [viloyat, tuman, address].filter(Boolean).join(', ');
    const location = {
      ...(mahallaId ? { mahallaId } : mahallaText ? { mahallaName: mahallaText } : {}),
      ...(fullAddress && { address: fullAddress }),
      ...(coords && { lat: coords.lat, lng: coords.lng }),
    };
    // The backend doesn't reliably persist mahalla/address — remember locally
    // (keyed by phone) so pages like Workers can default to the same location.
    if (viloyat || tuman || mahallaText) {
      saveRegisteredLocation(phone, { viloyat, tuman, mahallaText, mahallaId });
    }
    try {
      const user = await authService.register({ ...payload, phone, ...location });
      // Real backend returns tokens + user on register → log straight in.
      if (!ENV.MOCK_AUTH && user?.role) {
        dispatch(setUser(user));
        toast.success('Xush kelibsiz!');
        navigate(ROLE_HOME[user.role] || '/', { replace: true });
        return;
      }
      // Mock/demo: continue with OTP verification.
      await authService.sendOtp({ phone });
      toast.success('Tasdiqlash kodi yuborildi');
      navigate('/verify-otp', { state: { phone } });
    } catch (err) {
      const m = err.response?.data?.message;
      toast.error((Array.isArray(m) ? m[0] : m) || 'Ro\'yxatdan o\'tishda xatolik');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold">{t('auth.register.title')}</h2>
      <p className="mt-1 text-sm text-gray-500">{t('auth.register.subtitle')}</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <Input
          label={t('auth.register.fullName')}
          placeholder="Ism Familiya"
          autoComplete="off"
          leftIcon={<HiOutlineUser className="h-4 w-4" />}
          error={errors.full_name?.message}
          {...register('full_name', { required: 'Ism majburiy', minLength: { value: 3, message: 'Juda qisqa' } })}
        />
        <PhoneInput
          label={t('auth.register.phone')}
          error={errors.phone?.message}
          {...register('phone', {
            required: 'Telefon raqam majburiy',
            validate: (v) => isValidLocalPhone(v) || "Noto'g'ri format",
          })}
        />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('auth.register.location')} <span className="font-normal text-gray-400">{t('auth.register.optional')}</span>
          </label>
          <LocationPicker value={coords} onChange={setCoords} />
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <select
              className="input-base"
              value={viloyat}
              onChange={(e) => {
                setViloyat(e.target.value);
                setTuman('');
              }}
            >
              <option value="">Viloyat/shahar</option>
              {UZ_REGIONS.map((r) => (
                <option key={r.name} value={r.name}>{r.name}</option>
              ))}
            </select>
            <select
              className="input-base"
              value={tuman}
              onChange={(e) => setTuman(e.target.value)}
              disabled={!viloyat}
            >
              <option value="">Tuman</option>
              {tumanlar.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <Input
            className="mt-3"
            placeholder="Mahalla nomi"
            value={mahallaText}
            onChange={handleMahallaTextChange}
            hint={
              mahallaId
                ? 'Ro\'yxatdagi mahalla topildi'
                : "Ro'yxatda bo'lmasa ham, o'zingiz yozing — avtomatik qo'shiladi"
            }
          />
          <Input className="mt-3" placeholder="Ko'cha, uy raqami (ixtiyoriy)" {...register('address')} />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('auth.register.accountType')}
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
          label={t('auth.register.password')}
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
          label={t('auth.register.confirmPassword')}
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
          {t('auth.register.submit')}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        {t('auth.register.haveAccount')}{' '}
        <Link to="/login" className="font-semibold text-primary-600 hover:underline">
          {t('auth.register.loginLink')}
        </Link>
      </p>
    </div>
  );
};

export default Register;
