import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppLayout from './components/layout/AppLayout';
import CatalogPage from './pages/CatalogPage';
import CareerDetailPage from './pages/CareerDetailPage';
import DiscoveryPage from './pages/DiscoveryPage';
import ValidationPage from './pages/ValidationPage';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Navigate to="/catalog" replace />} />
            <Route path="catalog" element={<CatalogPage />} />
            <Route path="catalog/:careerName" element={<CareerDetailPage />} />
            <Route path="discovery" element={<DiscoveryPage />} />
            <Route path="validation" element={<ValidationPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}