import { useState, useRef } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { HiOutlineDocumentCheck, HiOutlineCloudArrowUp } from 'react-icons/hi2';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/ui/Card';
import { Button, Skeleton, EmptyState, StatusBadge } from '@/components/ui';
import { workerService } from '@/services/workerService';
import { queryClient } from '@/config/queryClient';
import { formatDate } from '@/utils/format';

const DOC_TYPES = [
  { value: 'PASSPORT', label: 'Pasport' },
  { value: 'LICENSE', label: 'Litsenziya' },
  { value: 'CERTIFICATE', label: 'Sertifikat' },
];

const ProviderDocuments = () => {
  const [docType, setDocType] = useState('PASSPORT');
  const fileRef = useRef(null);

  const { data, isLoading } = useQuery({ queryKey: ['provider-documents'], queryFn: workerService.listDocuments });
  const docs = data?.items || data || [];

  const upload = useMutation({
    mutationFn: (file) => {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('docType', docType);
      return workerService.uploadDocument(fd);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provider-documents'] });
      toast.success('Hujjat yuklandi — tekshiruvga yuborildi');
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Yuklashda xatolik'),
  });

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Verifikatsiya hujjatlari" subtitle="Tasdiqlanish uchun hujjatlaringizni yuklang" />

      <Card className="mb-6 p-5">
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Hujjat turi</label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <select className="input-base sm:max-w-xs" value={docType} onChange={(e) => setDocType(e.target.value)}>
            {DOC_TYPES.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
          <Button
            variant="gradient"
            leftIcon={<HiOutlineCloudArrowUp className="h-5 w-5" />}
            loading={upload.isPending}
            onClick={() => fileRef.current?.click()}
          >
            Fayl yuklash
          </Button>
          <input ref={fileRef} type="file" hidden accept="image/*,application/pdf" onChange={(e) => e.target.files[0] && upload.mutate(e.target.files[0])} />
        </div>
      </Card>

      {isLoading ? (
        <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-2xl" />)}</div>
      ) : docs.length === 0 ? (
        <EmptyState icon={HiOutlineDocumentCheck} title="Hujjat yo‘q" description="Verifikatsiya uchun hujjat yuklang." />
      ) : (
        <div className="space-y-2">
          {docs.map((d) => (
            <Card key={d.id} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-900/30">
                  <HiOutlineDocumentCheck className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-medium capitalize">{d.doc_type}</p>
                  <p className="text-xs text-gray-400">{formatDate(d.created_at)}</p>
                </div>
              </div>
              <StatusBadge status={d.status === 'approved' ? 'verified' : d.status} />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProviderDocuments;
