import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { HiOutlineChatBubbleBottomCenterText, HiPlus } from 'react-icons/hi2';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/ui/Card';
import { Input, Button, Modal, Skeleton, EmptyState, StatusBadge } from '@/components/ui';
import { complaintService } from '@/services/communityService';
import { queryClient } from '@/config/queryClient';
import { timeAgo } from '@/utils/format';

const CATEGORIES = ['Yoritish', 'Tozalik', 'Infratuzilma', 'Suv ta’minoti', 'Xavfsizlik', 'Boshqa'];

const Complaints = () => {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const { data, isLoading } = useQuery({ queryKey: ['complaints'], queryFn: () => complaintService.list() });
  const items = data?.items || data || [];

  const { mutate, isPending } = useMutation({
    mutationFn: (payload) => complaintService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      toast.success('Murojaatingiz yuborildi!');
      reset();
      setOpen(false);
    },
  });

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Murojaatlar"
        subtitle="Mahalla ma’muriyatiga rasmiy murojaat yuboring"
        actions={<Button variant="gradient" leftIcon={<HiPlus className="h-4 w-4" />} onClick={() => setOpen(true)}>Yangi murojaat</Button>}
      />

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}</div>
      ) : items.length === 0 ? (
        <EmptyState icon={HiOutlineChatBubbleBottomCenterText} title="Murojaat yo‘q" description="Birinchi murojaatingizni yuboring." />
      ) : (
        <div className="space-y-3">
          {items.map((c) => (
            <Card key={c.id} className="p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{c.subject}</h3>
                <StatusBadge status={c.status} />
              </div>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{c.body}</p>
              <p className="mt-2 text-xs text-gray-400">{c.category} · {timeAgo(c.created_at)}</p>
            </Card>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Yangi murojaat">
        <form onSubmit={handleSubmit(mutate)} className="space-y-4">
          <Input label="Mavzu" placeholder="Qisqacha mavzu" error={errors.subject?.message} {...register('subject', { required: 'Mavzuni kiriting' })} />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Kategoriya</label>
            <select className="input-base" {...register('category', { required: true })}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Murojaat matni</label>
            <textarea rows={4} className="input-base resize-none" placeholder="Muammoni batafsil yozing…" {...register('body', { required: true })} />
          </div>
          <Button type="submit" variant="gradient" className="w-full" loading={isPending}>Yuborish</Button>
        </form>
      </Modal>
    </div>
  );
};

export default Complaints;
