
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 pt-12 pb-8 border-t border-gray-200">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <span className="healwise-gradient p-2 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </span>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-healwise-blue to-healwise-green">
                HealWise
              </span>
            </Link>
            <p className="text-gray-600 text-sm">
              Your trusted healthcare partner for a healthier future. We combine the best of medicine and technology to provide exceptional patient care.
            </p>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook">
                <Facebook className="h-5 w-5 text-gray-500 hover:text-healwise-blue transition-colors" />
              </a>
              <a href="#" aria-label="Twitter">
                <Twitter className="h-5 w-5 text-gray-500 hover:text-healwise-blue transition-colors" />
              </a>
              <a href="#" aria-label="Instagram">
                <Instagram className="h-5 w-5 text-gray-500 hover:text-healwise-blue transition-colors" />
              </a>
              <a href="#" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5 text-gray-500 hover:text-healwise-blue transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-lg font-medium mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-healwise-blue text-sm transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-600 hover:text-healwise-blue text-sm transition-colors">
                  Our Services
                </Link>
              </li>
              <li>
                <Link to="/doctors" className="text-gray-600 hover:text-healwise-blue text-sm transition-colors">
                  Find Doctors
                </Link>
              </li>
              <li>
                <Link to="/symptom-checker" className="text-gray-600 hover:text-healwise-blue text-sm transition-colors">
                  Symptom Checker
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-600 hover:text-healwise-blue text-sm transition-colors">
                  Health Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-medium mb-4">Our Services</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/services" className="text-gray-600 hover:text-healwise-blue text-sm transition-colors">
                  Telemedicine
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-600 hover:text-healwise-blue text-sm transition-colors">
                  AI Diagnostics
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-600 hover:text-healwise-blue text-sm transition-colors">
                  Health Monitoring
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-600 hover:text-healwise-blue text-sm transition-colors">
                  Medical Records
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-600 hover:text-healwise-blue text-sm transition-colors">
                  Treatment Plans
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact information */}
          <div>
            <h3 className="text-lg font-medium mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-healwise-blue mt-0.5" />
                <span className="text-gray-600 text-sm">123 Medical Center Boulevard, San Francisco, CA 94107</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-healwise-blue" />
                <span className="text-gray-600 text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-healwise-blue" />
                <span className="text-gray-600 text-sm">contact@healwise.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} HealWise. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link to="/privacy-policy" className="text-sm text-gray-500 hover:text-healwise-blue">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="text-sm text-gray-500 hover:text-healwise-blue">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
