import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import Spinner from '@/components/ui/Spinner';

const DashboardLayout = () => (
  <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
    <Sidebar />
    <div className="flex flex-1 flex-col overflow-hidden">
      <Navbar />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        <Suspense
          fallback={
            <div className="flex h-64 items-center justify-center">
              <Spinner size="lg" />
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>
    </div>
  </div>
);

export default DashboardLayout;
