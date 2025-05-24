import { lazy, Suspense } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';

// Lazy load other components
const HowItWorks = lazy(() => import('./components/HowItWorks'));
const Testimonials = lazy(() => import('./components/Testimonials'));
const Pricing = lazy(() => import('./components/Pricing'));
const Booking = lazy(() => import('./components/Booking'));
const Footer = lazy(() => import('./components/Footer'));

export default function App() {
  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen font-sans">
      <Header />
      <Hero />
      <Suspense fallback={<div className="h-96 flex items-center justify-center">Loading...</div>}>
        <HowItWorks />
        <Testimonials />
        <Pricing />
        <Booking />
        <Footer />
      </Suspense>
    </div>
  );
}