import { HiInbox } from 'react-icons/hi2';

const EmptyState = ({ icon: Icon = HiInbox, title = "Ma'lumot yo'q", description, action }) => (
  <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-gray-800">
      <Icon className="h-8 w-8" />
    </div>
    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
    {description && <p className="mt-1 max-w-sm text-sm text-gray-500">{description}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
);

export default EmptyState;
