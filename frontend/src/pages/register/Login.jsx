import React, { useState, useContext } from 'react';
import api from '../../api';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../../register.css';
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const { t } = useTranslation('login'); // Gunakan namespace 'login'
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', form, { withCredentials: true });

      const userData = res.data.data;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      alert(t('login_success'));
      navigate('/home');
    } catch (err) {
      alert(err.response?.data?.message || t('login_failed'));
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit}>
        <h2 className="form-title">{t('login')}</h2>

        <input
          name="email"
          type="email"
          placeholder={t('email')}
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder={t('password')}
          value={form.password}
          onChange={handleChange}
          required
        />

        <button type="submit">{t('submitLogin')}</button>

        <p className="forgot-password">
          <Link to="/forgot-password">{t('forgot_password')}</Link>
        </p>

        <p className="toggle-button">
          {t('noAccount')}{' '}
          <Link to="/register" style={{ color: '#ff8c00' }}>
            {t('register')}
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
