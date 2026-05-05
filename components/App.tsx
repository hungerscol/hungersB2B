import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation as useRouteLocation } from 'react-router-dom';
import { UserRole } from '../types';
import Header from './Header';
import Footer from './Footer';
import LocationBanner from './LocationBanner';
import { useAuth } from '../contexts/AuthContext';
import { seedDatabase } from '../data';
import WhatsAppButton from './WhatsAppButton';

// Static Imports para estabilidad
import Home from './pages/Home';
import Dashboard from './dashboard/Dashboard';

// Lazy para el resto
const Empresas = lazy(() => import('./pages/Empresas'));
const Cocineros = lazy(() => import('./pages/Cocineros'));
const Menus = lazy(() => import('./pages/Menus'));
const Nosotros = lazy(() => import('./pages/Nosotros'));
const Contacto = lazy(() => import('./pages/Contacto'));
const LoginCliente = lazy(() => import('./pages/LoginCliente'));
const Checkout = lazy(() => import('./dashboard/cliente/Checkout'));
const Registro = lazy(() => import('./pages/Registro'));
const SuperAdminLogin = lazy(() => import('./pages/SuperAdminLogin'));
const APIDocs = lazy(() => import('./pages/APIDocs'));
const ImageGeneration = lazy(() => import('./pages/ImageGeneration'));
const Terminos = lazy(() => import('./pages/Terminos'));
const PoliticaDatos = lazy(() => import('./pages/PoliticaDatos'));

const AppContent: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const routeLocation = useRouteLocation();

  useEffect(() => {
    const checkAndSeed = async () => {
      const isSeeded = localStorage.getItem('hungers_db_seeded');
      if (!isSeeded) {
        console.log("🚀 Hungers: Sincronizando datos iniciales con Firebase...");
        try {
          await seedDatabase();
          localStorage.setItem('hungers_db_seeded', 'true');
          console.log("✅ Hungers: Sincronización completada.");
        } catch (err) {
          console.error("❌ Hungers: Error en la sincronización inicial:", err);
        }
      }
    };
    checkAndSeed();
  }, []);

  if (authLoading) return null;

  const isDashboard = routeLocation.pathname.startsWith('/dashboard');
  const isAuthPage = ['/login', '/registro', '/superadmin-login', '/tratamiento-de-datos-personales', '/terminos'].includes(routeLocation.pathname);

  return (
    <div className="bg-white min-h-screen flex flex-col">
        {!isDashboard && !isAuthPage && <LocationBanner />}
        {!isDashboard && !isAuthPage && <Header />}

        <main className="flex-grow">
          <Suspense fallback={
            <div className="flex justify-center items-center h-[50vh]">
              <div className="spinner"></div>
            </div>
          }>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/empresas" element={<Empresas />} />
              <Route path="/cocineros" element={<Cocineros />} />
              <Route path="/menus" element={<Menus />} />
              <Route path="/nosotros" element={<Nosotros />} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginCliente onGoToSuperAdmin={() => navigate('/superadmin-login')} />} />
              <Route path="/registro" element={user ? <Navigate to="/dashboard" /> : <Registro />} />
              <Route path="/terminos" element={<Terminos />} />
              <Route path="/tratamiento-de-datos-personales" element={<PoliticaDatos />} />
              <Route path="/superadmin-login" element={user ? <Navigate to="/dashboard" /> : <SuperAdminLogin onNavigateHome={() => navigate('/')} />} />

              {/* Protected Routes */}
              <Route path="/dashboard/*" element={user ? <Dashboard /> : <Navigate to="/login" />} />
              <Route path="/checkout" element={user ? <Checkout /> : <Navigate to="/login" />} />
              <Route path="/api-docs" element={user ? <APIDocs /> : <Navigate to="/login" />} />
              <Route path="/ia-images" element={user ? <ImageGeneration /> : <Navigate to="/login" />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Suspense>
        </main>

        {!isAuthPage && <Footer />}
        <WhatsAppButton />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;