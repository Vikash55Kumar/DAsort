import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer
      style={{ backgroundColor: '#00295d' }}
      className="border-t border-gray-300"
    >
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center">
          {/* Logo / Name */}
          <div className="flex items-center">
            <span className="text-lg font-semibold text-white tracking-wide">
              NCO AI – Government of India
            </span>
          </div>

          {/* Divider */}
          <div className="w-full border-t border-gray-400 my-4"></div>

          {/* Bottom text */}
          <p className="text-gray-200 text-xs text-center">
            © 2025 Ministry of Statistics and Programme Implementation
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
