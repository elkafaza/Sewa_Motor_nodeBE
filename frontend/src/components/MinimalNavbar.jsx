import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import logo from '../assets/logo.png';
import './MinimalNavbar.css';

const MinimalNavbar = ({ changeLanguage }) => {
  const { t, i18n } = useTranslation('login');
  const { user } = useContext(AuthContext);

  return (
    <nav className="minimal-navbar">
      <div className="nav-left">
        <Link to="/">
          <img src={logo} alt="Logo" className="logo-img" />
        </Link>
      </div>

      <div className="nav-right">
        {user ? (
          <>
          </>
        ) : (
          <>
            <Link to="/login">{t('login')}</Link>
            <Link to="/register">{t('register')}</Link>
          </>
        )}
        <select onChange={changeLanguage} className="language-selector" value={i18n.language}>
          <option value="id">Bahasa Indonesia</option>
          <option value="en">English</option>
        </select>
      </div>
    </nav>
  );
};

export default MinimalNavbar;
