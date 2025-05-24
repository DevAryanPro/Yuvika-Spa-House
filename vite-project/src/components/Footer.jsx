import React from 'react';

function Footer() {
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
              <a href="#" className="text-gray-500 hover:text-purple-600 transition-colors">Facebook</a>
              <a href="#" className="text-gray-500 hover:text-purple-600 transition-colors">Twitter</a>
              <a href="#" className="text-gray-500 hover:text-purple-600 transition-colors">Instagram</a>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-600">
              <li><a href="#hero" className="hover:text-purple-600">Home</a></li>
              <li><a href="#how-it-works" className="hover:text-purple-600">How It Works</a></li>
              <li><a href="#testimonials" className="hover:text-purple-600">Testimonials</a></li>
              <li><a href="#pricing" className="hover:text-purple-600">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-600">
              <li><a href="#" className="hover:text-purple-600">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-purple-600">Terms of Service</a></li>
              <li><a href="#" className="hover:text-purple-600">Cookie Policy</a></li>
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
  );
}

export default Footer;