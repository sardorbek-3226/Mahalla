import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { HiOutlineClipboardDocumentList } from 'react-icons/hi2';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/ui/Card';
import { Input, Button, Avatar } from '@/components/ui';
import { categoryService } from '@/services/workerService';
import { bookingService } from '@/services/bookingService';
import { queryClient } from '@/config/queryClient';

const BookingNew = () => {
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
      toast.success('Buyurtma yaratildi!');
      navigate('/bookings');
    },
    onError: () => toast.error('Buyurtma yaratishda xatolik'),
  });

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Yangi buyurtma" subtitle="So‘rovingiz tafsilotlarini kiriting" />

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
            label="Sarlavha"
            placeholder="Masalan: Rozetka almashtirish kerak"
            error={errors.title?.message}
            {...register('title', { required: 'Sarlavhani kiriting' })}
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Kategoriya</label>
            <select className="input-base" {...register('category_id', { required: true })}>
              <option value="">Tanlang…</option>
              {cats.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <Input
            label="Manzil"
            placeholder="Mahalla, ko‘cha, uy raqami"
            error={errors.address?.message}
            {...register('address', { required: 'Manzilni kiriting' })}
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Tavsif</label>
            <textarea
              rows={4}
              className="input-base resize-none"
              placeholder="Muammoni batafsil yozing…"
              {...register('description')}
            />
          </div>
          <Button type="submit" variant="gradient" size="lg" loading={isPending} className="w-full" leftIcon={<HiOutlineClipboardDocumentList className="h-5 w-5" />}>
            Buyurtmani yuborish
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default BookingNew;
