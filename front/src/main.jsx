import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router';
import { Provider } from '@/components/ui/provider';
import { AuthProvider } from '@/context/AuthContext.jsx';
import App from './App.jsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <StrictMode>
        <BrowserRouter>
          <Provider>
            <App />
          </Provider>
        </BrowserRouter>
      </StrictMode>
    </QueryClientProvider>
  </AuthProvider>
);
