import { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { href: "#hero", label: "Home" },
    { href: "#how-it-works", label: "How It Works" },
    { href: "#testimonials", label: "Testimonials" },
    { href: "#pricing", label: "Pricing" },
    { href: "#booking", label: "Booking" }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-lg">Yuvika Spa House</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-gray-700 hover:text-purple-600 transition-colors"
              >
                {item.label}
              </a>
            ))}
            <button className="px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition-colors">
              Book Now
            </button>
          </nav>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-700"
          >
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-gray-700 hover:text-purple-600 py-2"
                >
                  {item.label}
                </a>
              ))}
              <button className="mt-4 w-full px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition-colors">
                Book Now
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}