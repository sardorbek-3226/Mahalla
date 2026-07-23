import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { HiOutlineClipboardDocumentList } from 'react-icons/hi2';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/ui/Card';
import { Input, Button, Avatar } from '@/components/ui';
import { categoryService } from '@/services/workerService';
import { bookingService } from '@/services/bookingService';
import { queryClient } from '@/config/queryClient';

const BookingNew = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state } = useLocation();
  const worker = state?.worker;

  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: categoryService.list });
  const cats = categories?.items || categories || [];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { category_id: worker?.category_id || '' },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (payload) => bookingService.create({ ...payload, worker_id: worker?.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success(t('bookings.new.createSuccess'));
      navigate('/bookings');
    },
    onError: () => toast.error(t('bookings.new.createError')),
  });

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title={t('bookings.new.pageTitle')} subtitle={t('bookings.new.pageSubtitle')} />

      {worker && (
        <Card className="mb-5 flex items-center gap-3 p-4">
          <Avatar name={worker.full_name} src={worker.avatar_url} size="md" />
          <div>
            <p className="font-semibold">{worker.full_name}</p>
            <p className="text-sm text-primary-600">{worker.category_name}</p>
          </div>
        </Card>
      )}

      <Card className="p-6">
        <form onSubmit={handleSubmit(mutate)} className="space-y-4">
          <Input
            label={t('bookings.new.titleLabel')}
            placeholder={t('bookings.new.titlePlaceholder')}
            error={errors.title?.message}
            {...register('title', { required: t('bookings.new.titleRequired') })}
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">{t('bookings.new.categoryLabel')}</label>
            <select className="input-base" {...register('category_id', { required: true })}>
              <option value="">{t('bookings.new.categoryPlaceholder')}</option>
              {cats.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <Input
            label={t('bookings.new.addressLabel')}
            placeholder={t('bookings.new.addressPlaceholder')}
            error={errors.address?.message}
            {...register('address', { required: t('bookings.new.addressRequired') })}
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">{t('bookings.new.descriptionLabel')}</label>
            <textarea
              rows={4}
              className="input-base resize-none"
              placeholder={t('bookings.new.descriptionPlaceholder')}
              {...register('description')}
            />
          </div>
          <Button type="submit" variant="gradient" size="lg" loading={isPending} className="w-full" leftIcon={<HiOutlineClipboardDocumentList className="h-5 w-5" />}>
            {t('bookings.new.submit')}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default BookingNew;
