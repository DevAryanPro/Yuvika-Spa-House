import React, { Suspense } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';

const HowItWorks = React.lazy(() => import('./components/HowItWorks'));
const Testimonials = React.lazy(() => import('./components/Testimonials'));
const Pricing = React.lazy(() => import('./components/Pricing'));
const Booking = React.lazy(() => import('./components/Booking'));
const Footer = React.lazy(() => import('./components/Footer'));

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Suspense fallback={<div className="flex items-center justify-center py-8">Loading...</div>}>
        <HowItWorks />
        <Testimonials />
        <Pricing />
        <Booking />
        <Footer />
      </Suspense>
    </div>
  );
}