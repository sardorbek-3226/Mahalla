import { QueryClient } from '@tanstack/react-query';
import { ENV } from '@/config/env';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // No backend in offline demo mode — don't retry doomed requests.
      retry: ENV.MOCK_AUTH ? 0 : 1,
      refetchOnWindowFocus: false,
      staleTime: 60 * 1000, // 1 min
      gcTime: 5 * 60 * 1000,
    },
    mutations: {
      retry: 0,
    },
  },
});
