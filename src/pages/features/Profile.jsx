import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { HiOutlineUser, HiOutlineEnvelope, HiOutlinePhone, HiOutlineCheckBadge } from 'react-icons/hi2';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/ui/Card';
import { Avatar, Input, Button, Badge } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { setUser } from '@/redux/slices/authSlice';
import { userService } from '@/services/userService';
import { ROLE_LABELS } from '@/constants/roles';
import { ENV } from '@/config/env';

const Profile = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: { full_name: user?.full_name, email: user?.email || '' },
  });

  const onSubmit = async (values) => {
    try {
      if (ENV.MOCK_AUTH) {
        await new Promise((r) => setTimeout(r, 400));
        dispatch(setUser({ ...user, ...values }));
      } else {
        const updated = await userService.updateMe(values);
        dispatch(setUser({ ...user, ...updated }));
      }
      toast.success('Profil yangilandi');
    } catch {
      toast.error('Saqlashda xatolik');
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Profil" subtitle="Shaxsiy ma’lumotlaringiz" />

      <Card className="mb-6 flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:text-left">
        <Avatar name={user?.full_name} src={user?.avatar_url} size="lg" />
        <div>
          <div className="flex items-center justify-center gap-2 sm:justify-start">
            <h2 className="text-xl font-bold">{user?.full_name}</h2>
            {user?.is_phone_verified && (
              <Badge tone="green" dot><HiOutlineCheckBadge className="h-3.5 w-3.5" /> Tasdiqlangan</Badge>
            )}
          </div>
          <p className="text-sm text-gray-500">{user?.phone}</p>
          <Badge tone="blue" className="mt-1">{ROLE_LABELS[user?.role]}</Badge>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="mb-4 font-semibold">Ma’lumotlarni tahrirlash</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="To‘liq ism" leftIcon={<HiOutlineUser className="h-4 w-4" />} {...register('full_name', { required: true })} />
          <Input label="Email" type="email" leftIcon={<HiOutlineEnvelope className="h-4 w-4" />} {...register('email')} />
          <Input label="Telefon" leftIcon={<HiOutlinePhone className="h-4 w-4" />} value={user?.phone || ''} disabled hint="Telefon raqamini o‘zgartirib bo‘lmaydi" />
          <Button type="submit" variant="gradient" loading={isSubmitting}>Saqlash</Button>
        </form>
      </Card>
    </div>
  );
};

export default Profile;
