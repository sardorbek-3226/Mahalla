import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { HiOutlineRectangleGroup, HiPlus, HiOutlineTrash, HiOutlinePencilSquare } from 'react-icons/hi2';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/ui/Card';
import { Input, Button, Modal, Skeleton, EmptyState } from '@/components/ui';
import { categoryService } from '@/services/workerService';
import { queryClient } from '@/config/queryClient';

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const CategoriesAdmin = () => {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const { data, isLoading } = useQuery({ queryKey: ['categories'], queryFn: categoryService.list });
  const cats = data?.items || data || [];

  const openNew = () => { setEditing(null); reset({ name: '', slug: '', icon_url: '' }); setOpen(true); };
  const openEdit = (c) => { setEditing(c); reset({ name: c.name, slug: c.slug, icon_url: c.icon }); setOpen(true); };

  const save = useMutation({
    mutationFn: (payload) => {
      const body = { ...payload, slug: payload.slug || slugify(payload.name) };
      return editing ? categoryService.update(editing.id, body) : categoryService.create(body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success(editing ? 'Yangilandi' : 'Kategoriya qo‘shildi');
      setOpen(false);
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Xatolik'),
  });
  const remove = useMutation({
    mutationFn: (id) => categoryService.remove(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['categories'] }); toast.success('O‘chirildi'); },
    onError: (e) => toast.error(e.response?.data?.message || 'O‘chirib bo‘lmadi'),
  });

  return (
    <div>
      <PageHeader
        title="Kategoriyalar boshqaruvi"
        subtitle="Xizmat turlarini qo‘shish, tahrirlash, o‘chirish"
        actions={<Button variant="gradient" leftIcon={<HiPlus className="h-4 w-4" />} onClick={openNew}>Kategoriya</Button>}
      />

      {isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}</div>
      ) : cats.length === 0 ? (
        <EmptyState icon={HiOutlineRectangleGroup} title="Kategoriya yo‘q" />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cats.map((c) => (
            <Card key={c.id} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{c.icon}</span>
                <div>
                  <p className="font-medium">{c.name}</p>
                  <p className="text-xs text-gray-400">{c.slug} · {c.count} usta</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit(c)} className="rounded-lg p-2 text-gray-400 hover:text-primary-600"><HiOutlinePencilSquare className="h-5 w-5" /></button>
                <button onClick={() => remove.mutate(c.id)} className="rounded-lg p-2 text-gray-400 hover:text-red-500"><HiOutlineTrash className="h-5 w-5" /></button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Kategoriyani tahrirlash' : 'Yangi kategoriya'}>
        <form onSubmit={handleSubmit(save.mutate)} className="space-y-4">
          <Input label="Nomi" error={errors.name?.message} {...register('name', { required: 'Nomini kiriting' })} />
          <Input label="Slug (ixtiyoriy)" hint="Bo‘sh qoldirsangiz avtomatik yaratiladi" {...register('slug')} />
          <Input label="Ikonka URL (ixtiyoriy)" {...register('icon_url')} />
          <Button type="submit" variant="gradient" className="w-full" loading={save.isPending}>Saqlash</Button>
        </form>
      </Modal>
    </div>
  );
};

export default CategoriesAdmin;
