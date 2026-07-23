import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui';

// Shared shell for 404 / 403 / 500.
const ErrorPage = ({ code = '404', title, description }) => {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6 text-center dark:bg-gray-950">
      <p className="text-7xl font-extrabold gradient-text sm:text-9xl">{code}</p>
      <h1 className="mt-4 text-2xl font-bold">{title}</h1>
      <p className="mt-2 max-w-md text-gray-500">{description}</p>
      <div className="mt-8 flex gap-3">
        <Link to="/"><Button variant="gradient">{t('errors.home')}</Button></Link>
        <Button variant="outline" onClick={() => window.history.back()}>{t('errors.back')}</Button>
      </div>
    </div>
  );
};

export const NotFound = () => {
  const { t } = useTranslation();
  return (
    <ErrorPage code="404" title={t('errors.notFound.title')} description={t('errors.notFound.description')} />
  );
};
export const Forbidden = () => {
  const { t } = useTranslation();
  return (
    <ErrorPage code="403" title={t('errors.forbidden.title')} description={t('errors.forbidden.description')} />
  );
};
export const ServerError = () => {
  const { t } = useTranslation();
  return (
    <ErrorPage code="500" title={t('errors.serverError.title')} description={t('errors.serverError.description')} />
  );
};

export default ErrorPage;
