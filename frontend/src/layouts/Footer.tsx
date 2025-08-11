import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">NCO AI</span>
            </div>
            <p className="mt-4 text-gray-600 max-w-md">
              AI-enabled Semantic Search for National Classification of Occupation.
              Streamlining job classification for government surveys and data collection.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Help
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Ministry
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a 
                  href="https://mospi.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  MoSPI Official
                </a>
              </li>
              <li>
                <a 
                  href="https://esankhyiki.mospi.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  eSankhyiki
                </a>
              </li>
              <li>
                <a 
                  href="https://datainnovation.mospi.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Data Innovation
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © 2025 Government of India, Ministry of Statistics and Programme Implementation.
            </p>
            <p className="text-gray-500 text-sm mt-2 md:mt-0">
              Built for AI Hackathon 2025
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
