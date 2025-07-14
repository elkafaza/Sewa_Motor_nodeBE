import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MotorList.css';

const MotorList = () => {
  const [motors, setMotors] = useState([]);
  const [form, setForm] = useState({
    motorId: '',
    brand: '',
    model: 'Matic',
    tersedia: 'true',
    harga: '',
    gambar: null
  });

  const fetchMotors = async () => {
    try {
      const res = await axios.get('/api/admin/motor', { withCredentials: true });
      setMotors(res.data);
    } catch (error) {
      console.error('Gagal ambil data motor:', error);
    }
  };

  useEffect(() => {
    fetchMotors();
  }, []);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFile = (e) => {
    setForm(prev => ({ ...prev, gambar: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      for (const key in form) {
        formData.append(key, form[key]);
      }

      await axios.post('/api/admin/motor', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
  withCredentials: true
});

alert('Motor berhasil diupload');

      setForm({
        motorId: '',
        brand: '',
        model: 'Matic',
        tersedia: 'true',
        harga: '',
        gambar: null
      });
      fetchMotors();
    } catch (error) {
      console.error('Gagal upload motor:', error);
    }
  };

  return (
    <div className="motor-list-container">
      <h2>Tambah Motor Baru</h2>

      <form className="motor-form" onSubmit={handleSubmit}>
        <input type="text" name="motorId" placeholder="Plat Nomor" value={form.motorId} onChange={handleInput} required />
        <input type="text" name="brand" placeholder="Brand (contoh: Honda)" value={form.brand} onChange={handleInput} required />
        
        <select name="model" value={form.model} onChange={handleInput}>
          <option value="Matic">Matic</option>
          <option value="Non-matic">Non-matic</option>
        </select>

        <select name="tersedia" value={form.tersedia} onChange={handleInput}>
          <option value="true">Ya</option>
          <option value="false">Tidak</option>
        </select>

        <input type="number" name="harga" placeholder="Harga per Hari" value={form.harga} onChange={handleInput} required />
        <input type="file" accept="image/*" onChange={handleFile} required />
        <button type="submit">Upload Motor</button>
      </form>

      <h2>Daftar Motor</h2>
      <div className="motor-grid">
        {motors.map((motor) => (
          <div className="motor-card" key={motor._id}>
            <img src={motor.gambar} alt={motor.motorId} />
            <h3>{motor.motorId} – {motor.brand}</h3>
            <p><strong>Model:</strong> {motor.model}</p>
            <p><strong>Harga:</strong> Rp {parseInt(motor.harga).toLocaleString()}</p>
            <p><strong>Ketersediaan:</strong> {motor.tersedia ? 'Ya' : 'Tidak'}</p>
            <p><strong>Status:</strong> {motor.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MotorList;
