import React, { useState } from 'react';
import api from '../../api';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../../register.css';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });

  const { t } = useTranslation('login'); // ✅ Gunakan namespace 'login'

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', form);
      alert(t('register_success'));
    } catch (err) {
      alert(err.response?.data?.message || t('register_failed'));
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit}>
        <h2 className="form-title">{t('register')}</h2>

        <input
          name="name"
          placeholder={t('name')}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          placeholder={t('email')}
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder={t('password')}
          onChange={handleChange}
          required
        />

        <input
          name="phone"
          placeholder={t('phone')}
          onChange={handleChange}
          required
        />

        <button type="submit">{t('submitRegister')}</button>

        <p className="toggle-button">
          {t('haveAccount')}{' '}
          <Link to="/login" style={{ color: '#ff8c00' }}>
            {t('login')}
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
