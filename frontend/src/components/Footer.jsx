import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-orange-500 to-orange-900 p-4 text-center text-sm mt-auto">
      © {new Date().getFullYear()} Chibi Rental Motor. All rights reserved.
    </footer>
  );
};

export default Footer;
