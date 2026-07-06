import { Link } from 'react-router-dom';
import { Button } from '@/components/ui';

// Shared shell for 404 / 403 / 500.
const ErrorPage = ({ code = '404', title, description }) => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6 text-center dark:bg-gray-950">
    <p className="text-7xl font-extrabold gradient-text sm:text-9xl">{code}</p>
    <h1 className="mt-4 text-2xl font-bold">{title}</h1>
    <p className="mt-2 max-w-md text-gray-500">{description}</p>
    <div className="mt-8 flex gap-3">
      <Link to="/"><Button variant="gradient">Bosh sahifa</Button></Link>
      <Button variant="outline" onClick={() => window.history.back()}>Orqaga</Button>
    </div>
  </div>
);

export const NotFound = () => (
  <ErrorPage code="404" title="Sahifa topilmadi" description="Siz qidirayotgan sahifa mavjud emas yoki ko'chirilgan." />
);
export const Forbidden = () => (
  <ErrorPage code="403" title="Ruxsat yo'q" description="Bu sahifaga kirish uchun yetarli huquqingiz yo'q." />
);
export const ServerError = () => (
  <ErrorPage code="500" title="Server xatosi" description="Kutilmagan xatolik yuz berdi. Keyinroq urinib ko'ring." />
);

export default ErrorPage;
