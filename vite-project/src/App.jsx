import React, { Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { supabase } from './config/supabaseClient';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load components
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Header = React.lazy(() => import('./components/Header'));
const Hero = React.lazy(() => import('./components/Hero'));
const HowItWorks = React.lazy(() => import('./components/HowItWorks'));
const Testimonials = React.lazy(() => import('./components/Testimonials'));
const Pricing = React.lazy(() => import('./components/Pricing'));
const Booking = React.lazy(() => import('./components/Booking'));
const Footer = React.lazy(() => import('./components/Footer'));

const AuthWrapper = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      if (event === 'SIGNED_OUT') navigate('/login');
    });

    return () => subscription?.unsubscribe();
  }, [navigate]);

  if (loading) return <LoadingSpinner />;
  return children;
};

const ProtectedRoute = ({ children }) => {
  return (
    <AuthWrapper>
      {children}
    </AuthWrapper>
  );
};

export default function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/" element={
            <div className="min-h-screen bg-white">
              <Header />
              <Hero />
              <Suspense fallback={<LoadingSpinner />}>
                <HowItWorks />
                <Testimonials />
                <Pricing />
                <Booking />
                <Footer />
              </Suspense>
            </div>
          } />
        </Routes>
      </Suspense>
    </Router>
  );
}
