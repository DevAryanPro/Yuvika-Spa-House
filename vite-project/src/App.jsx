import { useState, useEffect } from "react";

export default function App() {
  const [activeTab, setActiveTab] = useState("monday");
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Booking Schedule Data
  const schedule = {
    monday: [
      { time: "10:00 AM", available: true },
      { time: "11:00 AM", available: false },
      { time: "12:00 PM", available: true },
      { time: "02:00 PM", available: true },
      { time: "03:00 PM", available: false },
    ],
    tuesday: [
      { time: "10:00 AM", available: true },
      { time: "11:00 AM", available: true },
      { time: "12:00 PM", available: false },
      { time: "02:00 PM", available: true },
      { time: "03:00 PM", available: true },
    ],
    wednesday: [
      { time: "10:00 AM", available: true },
      { time: "11:00 AM", available: true },
      { time: "12:00 PM", available: true },
      { time: "02:00 PM", available: true },
      { time: "03:00 PM", available: true },
    ],
    thursday: [
      { time: "10:00 AM", available: false },
      { time: "11:00 AM", available: true },
      { time: "12:00 PM", available: true },
      { time: "02:00 PM", available: false },
      { time: "03:00 PM", available: true },
    ],
    friday: [
      { time: "10:00 AM", available: true },
      { time: "11:00 AM", available: true },
      { time: "12:00 PM", available: false },
      { time: "02:00 PM", available: true },
      { time: "03:00 PM", available: false },
    ],
  };

  // Sponsors Slider Logic
  const sponsors = [
    "SpaCare",
    "Zen Wellness",
    "PureBalance",
    "Glow & Harmony",
    "Nature’s Touch",
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

  // How It Works Section
  const howItWorks = [
    {
      step: "1",
      title: "Choose Your Service",
      description:
        "Select from a variety of treatments tailored to your wellness needs.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8z"></path>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <path d="M16 10a4 4 0 1 1-8 0"></path>
        </svg>
      ),
    },
    {
      step: "2",
      title: "Pick a Time Slot",
      description:
        "View real-time availability and select the most convenient time for your session.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      ),
    },
    {
      step: "3",
      title: "Get Confirmation",
      description:
        "Receive instant confirmation via email or push notification.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      ),
    },
  ];

  // Testimonials
  const testimonials = [
    {
      name: "Emily Johnson",
      role: "Regular Client",
      quote:
        "The booking system is so smooth. I love how easy it is to book appointments using voice commands.",
    },
    {
      name: "Michael Lee",
      role: "First-time User",
      quote:
        "I was blown away by the intuitive interface and real-time availability updates.",
    },
    {
      name: "Sophia Chen",
      role: "Wellness Enthusiast",
      quote:
        "The personalized notifications are life-changing. Never miss a session again!",
    },
  ];

  // Pricing Plans
  const pricingPlans = [
    {
      name: "Basic Package",
      price: "$75/month",
      features: ["1 session per month", "Email Notifications", "Standard Treatments"],
    },
    {
      name: "Premium Package",
      price: "$150/month",
      features: [
        "3 sessions per month",
        "Push Notifications",
        "VIP Treatments",
        "Priority Booking",
      ],
      popular: true,
    },
    {
      name: "Deluxe Package",
      price: "$250/month",
      features: [
        "Unlimited sessions",
        "Personalized Services",
        "Access to all amenities",
        "24/7 Support",
      ],
    },
  ];

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-purple-600"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M16.24 7.76a6 6 0 0 1 0 8.49" />
              <path d="M7.76 16.24a6 6 0 0 0 8.49 0" />
              <line x1="12" y1="8" x2="12" y2="16" />
            </svg>
            <span className="font-semibold text-lg">Yuvika Spa House</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#hero" className="text-gray-700 hover:text-purple-600 transition-colors">
              Home
            </a>
            <a
              href="#how-it-works"
              className="text-gray-700 hover:text-purple-600 transition-colors"
            >
              How It Works
            </a>
            <a
              href="#testimonials"
              className="text-gray-700 hover:text-purple-600 transition-colors"
            >
              Testimonials
            </a>
            <a
              href="#pricing"
              className="text-gray-700 hover:text-purple-600 transition-colors"
            >
              Pricing
            </a>
            <a
              href="#booking"
              className="text-gray-700 hover:text-purple-600 transition-colors"
            >
              Booking
            </a>
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {menuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white p-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-3">
              <a
                href="#hero"
                onClick={() => setMenuOpen(false)}
                className="text-gray-700 hover:text-purple-600 py-2"
              >
                Home
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMenuOpen(false)}
                className="text-gray-700 hover:text-purple-600 py-2"
              >
                How It Works
              </a>
              <a
                href="#testimonials"
                onClick={() => setMenuOpen(false)}
                className="text-gray-700 hover:text-purple-600 py-2"
              >
                Testimonials
              </a>
              <a
                href="#pricing"
                onClick={() => setMenuOpen(false)}
                className="text-gray-700 hover:text-purple-600 py-2"
              >
                Pricing
              </a>
              <a
                href="#booking"
                onClick={() => setMenuOpen(false)}
                className="text-gray-700 hover:text-purple-600 py-2"
              >
                Booking
              </a>
              <button
                onClick={() => setMenuOpen(false)}
                className="mt-4 px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition-colors"
              >
                Book Appointment
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section with Grid Background */}
      <section
        id="hero"
        className="pt-28 pb-32 relative overflow-hidden min-h-[80vh] flex items-center justify-center"
      >
        {/* Background Grid */}
        <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-10 pointer-events-none">
          {Array.from({ length: 12 * 12 }).map((_, i) => (
            <div key={i} className="border border-gray-300"></div>
          ))}
        </div>

        {/* Floating Shapes for Depth */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-100 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-100 rounded-full blur-3xl animate-pulse delay-1000"></div>

        {/* Centered Content */}
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

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-3 text-purple-600"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 12 11 12"></polyline>
            </svg>
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start space-x-4">
                  <div className="mt-1 w-10 h-10 flex items-center justify-center rounded-md bg-purple-100 text-purple-600">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <p className="text-gray-600 text-sm mt-2">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-3 text-purple-600"
            >
              <path d="M4 21h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z"></path>
              <path d="M8 9h8m-8 4h8m-8 4h8"></path>
            </svg>
            What Our Clients Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm"
              >
                <p className="italic text-gray-600 mb-4">"{testimonial.quote}"</p>
                <div className="font-semibold">{testimonial.name}</div>
                <div className="text-sm text-gray-500">{testimonial.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsors / Trusted Brands */}
      <section className="py-16 bg-gray-100 overflow-hidden">
        <div className="container mx-auto px-4">
          <h3 className="text-xl font-medium text-gray-600 text-center mb-10">
            Trusted by Leading Brands
          </h3>
          <div className="relative overflow-hidden whitespace-nowrap">
            <div
              className="flex animate-scroll"
              style={{
                animationDuration: `${sponsors.length * 5}s`,
              }}
            >
              {[...sponsors, ...sponsors].map((sponsor, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center justify-center px-6 py-4 mx-4 bg-white rounded-lg border border-gray-200 shadow-sm"
                >
                  <span className="text-gray-700 font-medium">{sponsor}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-3 text-purple-600"
            >
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
            Our Pricing Plans
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, idx) => (
              <div
                key={idx}
                className={`bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all ${
                  plan.popular ? "ring-2 ring-purple-500 scale-105" : ""
                }`}
              >
                {plan.popular && (
                  <div className="text-center text-sm font-medium text-purple-600 mb-2">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <div className="text-2xl font-bold mb-4">{plan.price}</div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center space-x-2 text-gray-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className="w-full py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition-colors">
                  Subscribe
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Schedule Section */}
      <section id="booking" className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-3 text-purple-600"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            Available Time Slots
          </h2>

          <div className="max-w-3xl mx-auto">
            <div className="flex justify-center flex-wrap gap-2 mb-6">
              {Object.keys(schedule).map((day) => (
                <button
                  key={day}
                  onClick={() => setActiveTab(day)}
                  className={`capitalize px-4 py-2 rounded-md transition-colors ${
                    activeTab === day
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <ul className="space-y-2">
                {schedule[activeTab].map((slot, idx) => (
                  <li
                    key={idx}
                    className={`flex items-center justify-between p-3 rounded-md ${
                      slot.available
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700 line-through"
                    }`}
                  >
                    <span>{slot.time}</span>
                    <span className="text-sm">
                      {slot.available ? "Available" : "Booked"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 pt-16 pb-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-purple-600"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M16.24 7.76a6 6 0 0 1 0 8.49" />
                  <path d="M7.76 16.24a6 6 0 0 0 8.49 0" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                </svg>
                <span className="font-semibold text-lg">Yuvika Spa House</span>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                The ultimate spa booking experience powered by AI and voice technology.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-500 hover:text-purple-600 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-500 hover:text-purple-600 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-500 hover:text-purple-600 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <a href="#hero" className="hover:text-purple-600">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-purple-600">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#testimonials" className="hover:text-purple-600">
                    Testimonials
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-purple-600">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <a href="#" className="hover:text-purple-600">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-purple-600">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-purple-600">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-600">
                <li>support@yuvikaspa.com</li>
                <li>+1 (555) 123-4567</li>
                <li>San Francisco, CA 94107</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center text-center md:text-left text-sm text-gray-500">
            <p>This website is part of the Hackathon Challenge 2025.</p>
            <p className="mt-4 md:mt-0">© 2025 Yuvika Spa House. Built with ❤️</p>
          </div>
        </div>
      </footer>

      {/* Global Styles */}
      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll linear infinite;
        }
      `}</style>
    </div>
  );
}
