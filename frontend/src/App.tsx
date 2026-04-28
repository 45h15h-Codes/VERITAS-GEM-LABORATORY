import { useState } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { Home } from './pages/Home';
import { CertificateView } from './pages/CertificateView';
import AdminLogin from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { PublicBlogs } from './pages/PublicBlogs';
import { BlogDetail } from './pages/BlogDetail';
import { BrowserRouter } from 'react-router-dom';
import Snowfall from 'react-snowfall';
import { Toaster } from 'sonner';
import { PaymentStatus } from './pages/PaymentStatus';

function CertificateViewWrapper() {
  const { number } = useParams<{ number: string }>();
  const navigate = useNavigate();

  return (
    <CertificateView
      certificateNumber={number || ''}
      onBack={() => navigate('/')}
    />
  );
}

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [selectedCertificate, setSelectedCertificate] = useState<string>('');
  const navigate = useNavigate();

  const handleCertificateFound = (certificateNumber: string) => {
    setSelectedCertificate(certificateNumber);
    navigate(`/certificate/${certificateNumber}`);
  };

  const handleBackToHome = () => {
    setSelectedCertificate('');
    navigate('/');
  };

  const handleAdminClick = () => {
    navigate(isAuthenticated ? '/admin' : '/admin/login');
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Home onCertificateFound={handleCertificateFound} onAdminClick={handleAdminClick} />} />
        <Route path="/certificate/:number" element={<CertificateViewWrapper />} />
        <Route path="/blogs" element={<PublicBlogs />} />
        <Route path="/blogs/:slug" element={<BlogDetail />} />
        <Route path="/admin/login" element={<AdminLogin onBackToSite={handleBackToHome} />} />
        <Route path="/admin" element={isAuthenticated ? <AdminDashboard onBackToSite={handleBackToHome} /> : <AdminLogin onBackToSite={handleBackToHome} />} />
        <Route path="/payment-status" element={<PaymentStatus />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          {/* <Snowfall
            color="#82c3d9ff"
            snowflakeCount={120}
            images={(() => {
              if (typeof window === 'undefined') return [];
              const img = new window.Image();
              img.src = '/images/Snowflakes_1.png'; // <-- Corrected path
              return [img];
            })()}
            radius={[20, 30]}   // size range
            speed={[0.5, 2]}   // falling speed
            wind={[-0.5, 1]}   // left-right movement
          /> */}
          <Toaster richColors position="top-right" closeButton /> 
          <AppContent />
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
