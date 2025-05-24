import React, { useState, useEffect, lazy, Suspense } from 'react';

const HowItWorks = lazy(() => import('./components/HowItWorks'));
const Testimonials = lazy(() => import('./components/Testimonials'));
const Pricing = lazy(() => import('./components/Pricing'));
const Booking = lazy(() => import('./components/Booking'));
const Footer = lazy(() => import('./components/Footer'));

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const sponsors = [
    "SpaCare",
    "Zen Wellness",
    "PureBalance",
    "Glow & Harmony",
    "Nature's Touch",
    "Serenity Spa Co.",
    "Elegance Day Spa",
    "Luxury Retreats"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sponsors.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [sponsors.length]);

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-lg">Yuvika Spa House</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#hero" className="text-gray-700 hover:text-purple-600 transition-colors">Home</a>
            <a href="#how-it-works" className="text-gray-700 hover:text-purple-600 transition-colors">How It Works</a>
            <a href="#testimonials" className="text-gray-700 hover:text-purple-600 transition-colors">Testimonials</a>
            <a href="#pricing" className="text-gray-700 hover:text-purple-600 transition-colors">Pricing</a>
            <a href="#booking" className="text-gray-700 hover:text-purple-600 transition-colors">Booking</a>
          </nav>

          {/* Desktop Book Button */}
          <button className="hidden md:block px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition-colors whitespace-nowrap">
            Book Appointment
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden focus:outline-none"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white p-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-3">
              <a href="#hero" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-purple-600 py-2">Home</a>
              <a href="#how-it-works" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-purple-600 py-2">How It Works</a>
              <a href="#testimonials" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-purple-600 py-2">Testimonials</a>
              <a href="#pricing" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-purple-600 py-2">Pricing</a>
              <a href="#booking" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-purple-600 py-2">Booking</a>
              <button onClick={() => setMenuOpen(false)} className="mt-4 px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition-colors">
                Book Appointment
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="hero" className="pt-28 pb-32 relative overflow-hidden min-h-[80vh] flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="inline-block px-4 py-1 rounded-full bg-purple-100 text-purple-600 mb-6 text-sm font-medium">
            Intelligent Appointment Booking System
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight max-w-4xl mx-auto">
            Relax, Recharge, and Renew Your Soul at{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">
              Yuvika Spa House
            </span>
          </h1>

          <p className="text-lg text-gray-600 mt-6 max-w-xl mx-auto">
            Experience the future of spa booking with our intelligent system.
            Choose your treatment, pick a time, and receive instant confirmation
            with personalized notifications.
          </p>

          <div className="flex flex-wrap gap-4 justify-center mt-8">
            <button className="px-6 py-3 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition-colors">
              Book Now
            </button>
            <button className="px-6 py-3 rounded-md border border-gray-300 hover:border-purple-600 hover:text-purple-600 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </section>

      <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
        <HowItWorks />
        <Testimonials />
        <Pricing />
        <Booking />
        <Footer />
      </Suspense>
    </div>
  );
}