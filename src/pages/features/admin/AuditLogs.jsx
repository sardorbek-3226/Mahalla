import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  HiOutlineClipboardDocumentList,
  HiOutlineUserPlus,
  HiOutlineCog6Tooth,
  HiOutlineNoSymbol,
  HiOutlineCheckBadge,
} from 'react-icons/hi2';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/ui/Card';
import { Avatar, Badge, Skeleton, EmptyState } from '@/components/ui';
import { auditService } from '@/services/auditService';
import { ROLE_LABELS } from '@/constants/roles';
import { formatDateTime } from '@/utils/format';

const ACTION_ICON_META = {
  'admin.create': { icon: HiOutlineUserPlus, tone: 'green' },
  'admin.suspend': { icon: HiOutlineNoSymbol, tone: 'red' },
  'worker.verify': { icon: HiOutlineCheckBadge, tone: 'green' },
  'settings.update': { icon: HiOutlineCog6Tooth, tone: 'amber' },
};

const describe = (meta = {}) =>
  Object.entries(meta)
    .map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}`)
    .join(' · ');

const AuditLogs = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useQuery({ queryKey: ['audit-logs'], queryFn: () => auditService.list() });
  const logs = data?.items || data || [];

  const ACTION_LABEL = {
    'admin.create': t('admin.auditLogs.actions.adminCreate'),
    'admin.suspend': t('admin.auditLogs.actions.adminSuspend'),
    'worker.verify': t('admin.auditLogs.actions.workerVerify'),
    'settings.update': t('admin.auditLogs.actions.settingsUpdate'),
  };

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title={t('admin.auditLogs.title')} subtitle={t('admin.auditLogs.subtitle')} />

      <Card className="p-0">
        {isLoading ? (
          <div className="space-y-2 p-4">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
        ) : logs.length === 0 ? (
          <EmptyState icon={HiOutlineClipboardDocumentList} title={t('admin.auditLogs.empty')} />
        ) : (
          <ul className="divide-y divide-gray-100 dark:divide-gray-800">
            {logs.map((l) => {
              const iconCfg = ACTION_ICON_META[l.action] || { icon: HiOutlineClipboardDocumentList, tone: 'gray' };
              const cfg = { ...iconCfg, label: ACTION_LABEL[l.action] || l.action };
              const Icon = cfg.icon;
              return (
                <li key={l.id} className="flex items-start gap-3 p-4">
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-500 dark:bg-gray-800`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{cfg.label}</span>
                      <Badge tone={cfg.tone}>{l.action}</Badge>
                    </div>
                    {l.meta && Object.keys(l.meta).length > 0 && (
                      <p className="mt-0.5 text-sm text-gray-500">{describe(l.meta)}</p>
                    )}
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                      <Avatar name={l.actor} size="xs" />
                      {l.actor}
                      {l.actor_role && <span>· {ROLE_LABELS[l.actor_role] || l.actor_role}</span>}
                      <span>· {formatDateTime(l.created_at)}</span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
};

export default AuditLogs;
