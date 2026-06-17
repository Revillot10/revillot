import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useScrollReveal } from './hooks/useScrollReveal';
import { AuthProvider, useAuth } from './context/AuthContext';
import './styles/main.css';

import Home            from './pages/Home';
import Inventory       from './pages/Inventory';
import VehicleDetail   from './pages/VehicleDetail';
import Sell            from './pages/Sell';
import Insights        from './pages/Insights';
import ArticleDetail   from './pages/ArticleDetail';
import Contact         from './pages/Contact';
import PrivacyPolicy   from './pages/PrivacyPolicy';
import CookiePolicy    from './pages/CookiePolicy';
import WhyChooseUs     from './pages/WhyChooseUs';
import MeetTheTeam     from './pages/MeetTheTeam';
import PreviouslySold  from './pages/PreviouslySold';
import Finance         from './pages/Finance';
import Buy             from './pages/Buy';

import AdminLogin    from './pages/admin/Login';
import AdminLayout   from './pages/admin/Layout';
import Dashboard     from './pages/admin/Dashboard';
import VehiclesAdmin from './pages/admin/Vehicles';
import VehicleForm   from './pages/admin/VehicleForm';
import ArticlesAdmin from './pages/admin/Articles';
import ArticleForm   from './pages/admin/ArticleForm';
import VideosAdmin   from './pages/admin/Videos';
import LeadsAdmin    from './pages/admin/Leads';
import AdminProfile  from './pages/admin/Profile';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

// Componente separado para las animaciones de scroll
// Se monta dentro de BrowserRouter para acceder a useLocation
function ScrollReveal() {
  useScrollReveal();
  return null;
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading" style={{ minHeight:'100vh' }} />;
  if (!user)   return <Navigate to="/admin/login" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <ScrollReveal />
        <Routes>
          <Route path="/"                element={<Home />} />
          <Route path="/inventory"       element={<Inventory />} />
          <Route path="/vehicles/:id"    element={<VehicleDetail />} />
          <Route path="/sell"            element={<Sell />} />
          <Route path="/insights"        element={<Insights />} />
          <Route path="/insights/:slug"  element={<ArticleDetail />} />
          <Route path="/contact"         element={<Contact />} />
          <Route path="/privacy-policy"  element={<PrivacyPolicy />} />
          <Route path="/cookie-policy"   element={<CookiePolicy />} />
          {/* About Us pages */}
          <Route path="/why-choose"      element={<WhyChooseUs />} />
          <Route path="/meet-the-team"   element={<MeetTheTeam />} />
          <Route path="/history"         element={<Navigate to="/" replace />} />
          <Route path="/previously-sold" element={<PreviouslySold />} />
          <Route path="/finance"         element={<Finance />} />
          <Route path="/buy"             element={<Buy />} />
          <Route path="/admin/login"     element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index               element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard"    element={<Dashboard />} />
            <Route path="vehicles"     element={<VehiclesAdmin />} />
            <Route path="vehicles/new" element={<VehicleForm />} />
            <Route path="vehicles/:id" element={<VehicleForm />} />
            <Route path="articles"     element={<ArticlesAdmin />} />
            <Route path="articles/new" element={<ArticleForm />} />
            <Route path="articles/:id" element={<ArticleForm />} />
            <Route path="videos"       element={<VideosAdmin />} />
            <Route path="leads"        element={<LeadsAdmin />} />
            <Route path="perfil"       element={<AdminProfile />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
