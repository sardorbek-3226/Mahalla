import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { Button, OtpInput } from '@/components/ui';
import { authService } from '@/services/authService';
import { setUser } from '@/redux/slices/authSlice';
import { ROLE_HOME } from '@/constants/roles';
import { ENV } from '@/config/env';

const RESEND_SECONDS = 60;

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const phone = location.state?.phone;
  const isRecovery = location.state?.mode === 'recovery';

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (!phone) navigate(isRecovery ? '/forgot-password' : '/register', { replace: true });
  }, [phone, isRecovery, navigate]);

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [seconds]);

  const onVerify = async () => {
    if (code.length < 6) return toast.error("Kodni to'liq kiriting");
    setLoading(true);
    try {
      const data = await authService.verifyOtp({ phone, code });
      const user = data.user ?? data;
      dispatch(setUser(user));
      toast.success(isRecovery ? 'Hisobingizga muvaffaqiyatli kirdingiz!' : 'Telefon tasdiqlandi!');
      navigate(ROLE_HOME[user?.role] || '/', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Kod noto'g'ri");
    } finally {
      setLoading(false);
    }
  };

  const onResend = async () => {
    try {
      await authService.sendOtp({ phone });
      setSeconds(RESEND_SECONDS);
      toast.success('Kod qayta yuborildi');
    } catch {
      toast.error('Qayta yuborishda xatolik');
    }
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold">{isRecovery ? 'Hisobga qaytish' : 'Telefonni tasdiqlang'}</h2>
      <p className="mt-1 text-sm text-gray-500">
        <span className="font-medium text-gray-700 dark:text-gray-300">{phone}</span> raqamiga
        yuborilgan 6 xonali kodni kiriting.
      </p>

      <div className="mt-8">
        <OtpInput value={code} onChange={setCode} />
      </div>

      {ENV.MOCK_AUTH && (
        <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
          Demo rejimi: istalgan 6 xonali kodni kiriting (masalan, <b>123456</b>)
        </p>
      )}

      <Button
        onClick={onVerify}
        variant="gradient"
        size="lg"
        loading={loading}
        className="mt-8 w-full"
      >
        Tasdiqlash
      </Button>

      <div className="mt-5 text-sm text-gray-500">
        {seconds > 0 ? (
          <span>Qayta yuborish {seconds}s</span>
        ) : (
          <button onClick={onResend} className="font-medium text-primary-600 hover:underline">
            Kodni qayta yuborish
          </button>
        )}
      </div>

      <Link to="/login" className="mt-4 inline-block text-sm text-gray-400 hover:underline">
        Kirishga qaytish
      </Link>
    </div>
  );
};

export default VerifyOtp;
