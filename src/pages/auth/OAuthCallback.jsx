import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { tokenStore } from '@/api/axiosInstance';
import { fetchCurrentUser } from '@/redux/slices/authSlice';
import { ROLE_HOME } from '@/constants/roles';
import FullPageLoader from '@/components/common/FullPageLoader';

// Handles the redirect back from Google OAuth. The backend redirects here with
// tokens in the query string; we store them and restore the session.
const OAuthCallback = () => {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    done.current = true;

    const accessToken = params.get('accessToken') || params.get('access_token') || params.get('token');
    const refreshToken = params.get('refreshToken') || params.get('refresh_token');

    if (!accessToken) {
      toast.error(t('authFlow.oauthCallback.cancelled'));
      navigate('/login', { replace: true });
      return;
    }

    tokenStore.set({ accessToken, refreshToken });
    dispatch(fetchCurrentUser()).then((res) => {
      const user = res.payload;
      if (user?.role) {
        toast.success(t('authFlow.oauthCallback.welcome'));
        navigate(ROLE_HOME[user.role] || '/', { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
    });
  }, [params, dispatch, navigate, t]);

  return <FullPageLoader />;
};

export default OAuthCallback;
