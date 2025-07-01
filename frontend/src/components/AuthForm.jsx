import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api';
import '../../index.css';

function AuthForm({ isLogin }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : formData;

    try {
      await api.post(endpoint, payload);
      alert(t(isLogin ? 'login_success' : 'register_success'));
      navigate('/home');
    } catch (err) {
      alert(err.response?.data?.message || t(isLogin ? 'login_failed' : 'register_failed'));
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>{t(isLogin ? 'login' : 'register')}</h2>
        {!isLogin && (
          <>
            <input
              type="text"
              name="name"
              placeholder={t('name')}
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="phone"
              placeholder={t('phone')}
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </>
        )}
        <input
          type="email"
          name="email"
          placeholder={t('email')}
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder={t('password')}
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">{t(isLogin ? 'submitLogin' : 'submitRegister')}</button>

        {isLogin && (
          <p className="toggle-button">
            {t('no_account')}{' '}
            <Link to="/register" style={{ color: '#ff8c00' }}>{t('register')}</Link>
          </p>
        )}
      </form>
    </div>
  );
}

export default AuthForm;
