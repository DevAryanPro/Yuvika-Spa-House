import { FiFacebook, FiTwitter, FiInstagram } from 'react-icons/fi';

export default function Footer() {
  const quickLinks = [
    { href: "#hero", label: "Home" },
    { href: "#how-it-works", label: "How It Works" },
    { href: "#testimonials", label: "Testimonials" },
    { href: "#pricing", label: "Pricing" }
  ];

  const legalLinks = [
    { href: "#", label: "Privacy Policy" },
    { href: "#", label: "Terms of Service" },
    { href: "#", label: "Cookie Policy" }
  ];

  const contactInfo = [
    "support@yuvikaspa.com",
    "+1 (555) 123-4567",
    "San Francisco, CA 94107"
  ];

  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <span className="font-semibold text-lg">Yuvika Spa House</span>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              The ultimate spa booking experience powered by AI and voice technology.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-purple-600 transition-colors">
                <FiFacebook size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-purple-600 transition-colors">
                <FiTwitter size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-purple-600 transition-colors">
                <FiInstagram size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-600">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="hover:text-purple-600">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-600">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="hover:text-purple-600">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-600">
              {contactInfo.map((info, idx) => (
                <li key={idx}>{info}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center text-center md:text-left text-sm text-gray-500">
          <p>This website is part of the Hackathon Challenge 2025.</p>
          <p className="mt-4 md:mt-0">© 2025 Yuvika Spa House. Built with ❤️</p>
        </div>
      </div>
    </footer>
  );
}