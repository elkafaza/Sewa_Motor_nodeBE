import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import { FiUser } from 'react-icons/fi';
import logo from '../assets/logo.png';

const Navbar = ({ changeLanguage }) => {
  const { t } = useTranslation('home');
  const { user,  logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const storedUser = JSON.parse(localStorage.getItem('user'));
  const currentUser = user || storedUser;

  const handleScroll = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav>
      <div className="nav-left">
        <Link to="/" className="logo-link">
          <img src={logo} alt="Logo" className="logo-img" />
        </Link>
      </div>

      <div className="nav-center">
        <a href="#beranda" onClick={(e) => handleScroll(e, 'beranda')}>{t('homeNav')}</a>
        <a href="#motor" onClick={(e) => handleScroll(e, 'motor')}>{t('motorNav')}</a>
        <a href="#syarat" onClick={(e) => handleScroll(e, 'syarat')}>{t('syaratNav')}</a>
        <a href="#kontak" onClick={(e) => handleScroll(e, 'kontak')}>{t('kontakNav')}</a>
      </div>

      <div className="nav-right" ref={dropdownRef}>
        {currentUser ? (
          <div className="user-dropdown">
            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="user-button">
              <FiUser style={{ marginRight: '5px' }} />
              {currentUser.name} ▼
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                {currentUser.role === 'admin' && (
                  <>
                    <Link to="/admin/motors">{t('uploadMotor')}</Link>
                    <Link to="/admin/payments">{t('verifyPayment')}</Link>
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
        <select onChange={changeLanguage} className="language-select">
          <option value="id">Bahasa Indonesia</option>
          <option value="en">English</option>
        </select>
      </div>
    </nav>
  );
};

export default Navbar;
