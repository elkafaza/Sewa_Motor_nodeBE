import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import GoogleReview from '../components/GoogleReview';
import { useTranslation } from 'react-i18next';
import './home.css';
import malangBg from '../assets/malang.jpg';

const Home = () => {
  const [motors, setMotors] = useState([]);
  const { t } = useTranslation('home'); 
  const navigate = useNavigate();

  const handleBooking = (motor) => {
    navigate('/payment', { state: { motor } });
  };
  useEffect(() => {
    const fetchMotors = async () => {
      try {
        const res = await axios.get('/api/admin/motor');
        setMotors(res.data);
      } catch (err) {
        console.error('Gagal ambil data motor:', err);
      }
    };
    fetchMotors();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <div
      className="home-section"
      id="beranda"
      style={{
        backgroundImage: `url(${malangBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
        <div className="hero-text">
          <h1>{t('heroTitle')}</h1>
          <p>{t('heroDescription')}</p>
          <div className="hero-buttons">
            <a href="https://wa.me/6285934735237" className="wa-button" target="_blank" rel="noopener noreferrer">
              <img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" alt="WA" />
              {t('contactButton')}
            </a>
            <Link to="/layanan" className="layanan-button">{t('serviceButton')}</Link>
          </div>
        </div>
      </div>

      {/* Bagian 1 - DAFTAR MOTOR */}
      <div className="motor-section" id="motor">
        <h2 className="motor-title">{t('motorTitle')}</h2>
        <p className="motor-description">{t('motorDescription')}</p>
        <div className="motor-button-container">
          <a href="/harga" className="motor-price-button">{t('motorPriceLink')}</a>
        </div>
        <div className="motor-grid">
          {motors.slice(0, 4).map((motor) => (
            <div className="motor-card" key={motor._id}>
              <img src={motor.gambar} alt={motor.brand} />
              <h3>{motor.brand} – {motor.model}</h3>
              <p><strong>{t('plate')}:</strong> {motor.motorId}</p>
              <p><strong>{t('price')}:</strong> Rp {parseInt(motor.harga).toLocaleString()}</p>
              <div className="action-buttons">
        <span className={`status-badge ${motor.status === 'Tersedia' ? 'available' : 'unavailable'}`}>
          {motor.status}
        </span>

        {motor.status === 'Tersedia' && (
          <button className="booking-button" onClick={() => handleBooking(motor)}>
            Pesan Sekarang
          </button>
        )}
      </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bagian 2 - Syarat dan Jaminan */}
      <section className="syarat-section" id="syarat">
        <div className="syarat-box">
          <h2>{t('termsTitle')}</h2>
          <ul>
            <li>➤ {t('term1')}</li>
            <li>
              ➤ {t('term2')}
              <ul>
                <li>➤ {t('term3a')}</li>
                <li>➤ {t('term3b')}</li>
                <li>➤ {t('term3c')}</li>
              </ul>
            </li>
          </ul>
        </div>
      </section>

      {/* Bagian 3 - MAPS + ULASAN */}
      <div className="motor-review-section">
        <div className="motor-left">
          <div className="maps-container" id="kontak">
            <iframe
              title="Google Maps"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d246.95015118653183!2d112.63665787875654!3d-7.9780189254078415!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd62914a191d48b%3A0xb3f9ff5cde4e93ef!2sTPmotorent%20Stasiun%20Malang!5e0!3m2!1sid!2sid!4v1750519924336!5m2!1sid!2sid"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
        <div className="motor-right">
          <GoogleReview />
        </div>
      </div>
    </>
  );
};

export default Home;
