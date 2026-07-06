import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { HiOutlineUsers, HiPlus } from 'react-icons/hi2';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/ui/Card';
import { Avatar, Input, Button, Badge, Modal } from '@/components/ui';

const INITIAL = [
  { id: 'f1', full_name: 'Akmal Karimov', relation: 'Oila boshlig‘i', age: 42, phone: '+998 90 111 22 33' },
  { id: 'f2', full_name: 'Nilufar Karimova', relation: 'Turmush o‘rtog‘i', age: 38, phone: '+998 90 222 33 44' },
  { id: 'f3', full_name: 'Sardor Karimov', relation: 'Farzand', age: 16, phone: '—' },
];

const Family = () => {
  const [members, setMembers] = useState(INITIAL);
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const onAdd = (data) => {
    setMembers((m) => [...m, { id: `f${Date.now()}`, ...data }]);
    toast.success('A’zo qo‘shildi');
    reset();
    setOpen(false);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Oilam"
        subtitle="Uy xo‘jaligi a’zolari"
        actions={<Button variant="gradient" leftIcon={<HiPlus className="h-4 w-4" />} onClick={() => setOpen(true)}>A’zo qo‘shish</Button>}
      />

      <div className="grid gap-3 sm:grid-cols-2">
        {members.map((m) => (
          <Card key={m.id} className="flex items-center gap-3 p-4">
            <Avatar name={m.full_name} size="md" />
            <div className="min-w-0">
              <p className="font-semibold">{m.full_name}</p>
              <Badge tone="blue" className="my-0.5">{m.relation}</Badge>
              <p className="text-xs text-gray-400">{m.age} yosh · {m.phone}</p>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Oila a’zosini qo‘shish">
        <form onSubmit={handleSubmit(onAdd)} className="space-y-4">
          <Input label="To‘liq ism" leftIcon={<HiOutlineUsers className="h-4 w-4" />} {...register('full_name', { required: true })} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Qarindoshlik" placeholder="Farzand" {...register('relation', { required: true })} />
            <Input label="Yosh" type="number" {...register('age')} />
          </div>
          <Input label="Telefon" placeholder="+998…" {...register('phone')} />
          <Button type="submit" variant="gradient" className="w-full">Qo‘shish</Button>
        </form>
      </Modal>
    </div>
  );
};

export default Family;
