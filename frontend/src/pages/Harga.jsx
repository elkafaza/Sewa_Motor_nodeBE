import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './harga.css';

const Harga = () => {
  const [motors, setMotors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMotors = async () => {
      try {
        const res = await axios.get('/api/admin/motor');
        setMotors(res.data);
      } catch (err) {
        console.error('Gagal ambil data harga motor:', err);
      }
    };
    fetchMotors();
  }, []);

  const handleBooking = (motor) => {
    navigate('/payment', { state: { motor } });
  };

  return (
    <div className="harga-page">
      <h2>Daftar Harga Sewa Motor</h2>
      <div className="motor-grid">
        {motors.map((motor) => (
          <div className="motor-card" key={motor._id}>
            <img src={motor.gambar} alt={motor.brand} />
            <h3>{motor.brand} – {motor.model}</h3>
            <p><strong>Plat:</strong> {motor.motorId}</p>
            <p><strong>Harga per Hari:</strong> Rp {parseInt(motor.harga).toLocaleString()}</p>
            <div className="action-buttons">
        <span
  className={`status-badge ${motor.tersedia ? 'available' : 'unavailable'}`}
>
  {motor.tersedia ? 'Tersedia' : 'Sedang disewa / dibooking'}
</span>

{motor.tersedia && (
  <button className="booking-button" onClick={() => handleBooking(motor)}>
    Pesan Sekarang
  </button>
        )}
      </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Harga;
