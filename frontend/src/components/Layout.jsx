import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import MinimalNavbar from './MinimalNavbar';
import { useTranslation } from 'react-i18next';

const Layout = () => {
  const location = useLocation();
  const path = location.pathname.toLowerCase();

  const { i18n } = useTranslation();
  const changeLanguage = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  // Cek path yang harus pakai MinimalNavbar
  const isMinimalNavbar =
    path.startsWith('/login') ||
    path.startsWith('/register') ||
    path.startsWith('/harga') ||
    path.startsWith('/admin/motors') || 
    path.startsWith('/admin/update-motor') ||
    path.startsWith('/payment') || 
    path.startsWith('/admin/payments');

  return (
    <div className="layout-wrapper">
      {isMinimalNavbar ? (
        <MinimalNavbar changeLanguage={changeLanguage} />
      ) : (
        <Navbar changeLanguage={changeLanguage} />
      )}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
