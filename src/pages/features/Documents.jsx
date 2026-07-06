import { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { HiOutlineDocumentText, HiOutlineCloudArrowUp, HiOutlineTrash } from 'react-icons/hi2';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/ui/Card';
import { Badge, EmptyState } from '@/components/ui';
import { formatDate } from '@/utils/format';

const INITIAL = [
  { id: 'd1', name: 'Passport nusxasi.pdf', type: 'Shaxsiy', size: '1.1 MB', date: new Date() },
  { id: 'd2', name: 'Uy guvohnomasi.pdf', type: 'Mulk', size: '820 KB', date: new Date() },
  { id: 'd3', name: 'Kommunal shartnoma.pdf', type: 'Shartnoma', size: '640 KB', date: new Date() },
];

const Documents = () => {
  const [docs, setDocs] = useState(INITIAL);
  const inputRef = useRef(null);

  const onFiles = (files) => {
    const added = Array.from(files).map((f) => ({
      id: `d${Date.now()}-${f.name}`,
      name: f.name,
      type: 'Yuklangan',
      size: `${(f.size / 1024).toFixed(0)} KB`,
      date: new Date(),
    }));
    setDocs((d) => [...added, ...d]);
    toast.success(`${added.length} ta fayl yuklandi`);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Hujjatlar" subtitle="Shaxsiy hujjatlaringizni saqlang" />

      {/* Upload zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); onFiles(e.dataTransfer.files); }}
        className="mb-6 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 py-10 text-center transition hover:border-primary-400 hover:bg-primary-50/30 dark:border-gray-700"
      >
        <HiOutlineCloudArrowUp className="h-10 w-10 text-primary-500" />
        <p className="mt-2 font-medium">Fayllarni shu yerga tashlang yoki tanlang</p>
        <p className="text-sm text-gray-400">PDF, JPG, PNG · maksimal 10 MB</p>
        <input ref={inputRef} type="file" multiple hidden onChange={(e) => onFiles(e.target.files)} />
      </div>

      {docs.length === 0 ? (
        <EmptyState icon={HiOutlineDocumentText} title="Hujjat yo‘q" />
      ) : (
        <div className="space-y-2">
          {docs.map((d) => (
            <Card key={d.id} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500 dark:bg-red-900/20">
                  <HiOutlineDocumentText className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-medium">{d.name}</p>
                  <p className="text-xs text-gray-400">{d.size} · {formatDate(d.date)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge tone="gray">{d.type}</Badge>
                <button onClick={() => setDocs((x) => x.filter((i) => i.id !== d.id))} className="text-gray-400 hover:text-red-500">
                  <HiOutlineTrash className="h-5 w-5" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Documents;
