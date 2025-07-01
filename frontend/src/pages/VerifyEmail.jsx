import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../src/api';
import './../register.css';

const VerifyEmail = () => {
  const { token } = useParams();
  const [message, setMessage] = useState('Verifying...');
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await api.get(`/auth/verify-email/${token}`);
        setMessage(res.data.message || 'Email verified successfully!');
        setSuccess(true);
      } catch (err) {
        setMessage(err.response?.data?.message || 'Verification failed');
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, [token]);

  return (
    <div className="auth-container">
      <form>
        <h2>Email Verification</h2>
        <p style={{ color: success ? '#0f0' : '#f00' }}>{loading ? 'Please wait...' : message}</p>

        {!loading && success && (
          <Link to="/" style={{ color: '#ff8c00', textAlign: 'center', marginTop: '1rem' }}>
            Go to Login
          </Link>
        )}
      </form>
    </div>
  );
};

export default VerifyEmail;
