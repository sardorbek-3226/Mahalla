import { FcGoogle } from 'react-icons/fc';
import { ENV } from '@/config/env';

// Redirects to the backend Google OAuth entrypoint (GET /auth/google).
// The backend completes the flow and redirects back to /auth/callback.
const GoogleButton = ({ label = 'Google bilan davom etish' }) => {
  const onClick = () => {
    window.location.href = `${ENV.API_URL}/auth/google`;
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
    >
      <FcGoogle className="h-5 w-5" />
      {label}
    </button>
  );
};

export default GoogleButton;
