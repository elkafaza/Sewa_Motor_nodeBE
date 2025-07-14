import React, { useContext, useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import logo from '../assets/logo.png';
import { FiUser } from 'react-icons/fi';
import './MinimalNavbar.css';

const MinimalNavbar = ({ changeLanguage }) => {
  const { t, i18n } = useTranslation('home');
  const { user, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Reload user from localStorage if necessary
  useEffect(() => {
      const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
          setDropdownOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    const handleLogout = () => {
  logout();
  navigate('/');
};

  return (
    <nav className="minimal-navbar">
      <div className="nav-left">
        <Link to="/">
          <img src={logo} alt="Logo" className="logo-img" />
        </Link>
      </div>

      <div className="nav-right">
        {user ? (
          <div className="user-dropdown">
            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="user-button">
              <FiUser style={{ marginRight: '5px' }} />
              {user?.name || 'User'} ▼
            </button>
             {dropdownOpen && (
                          <div className="dropdown-menu">
                            {user.role === 'admin' ? (
                              <>
                                <Link to="/admin/motors">{t('uploadMotor')}</Link>
                                <Link to="/admin/update-motor">Update Motor</Link>
                                <Link to="/admin/payments">{t('verifyPayment')}</Link>
                              </>
                              ) : (
                      <>
                        <Link to="/payment-history">Status Pembayaran</Link>
                      </>
                         )}
                <button onClick={handleLogout}>{t('logout')}</button>
              </div>
            )}
          </div>
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
