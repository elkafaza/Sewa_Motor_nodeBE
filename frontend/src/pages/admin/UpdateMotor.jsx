import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './updateMotor.css';

const UpdateMotor = () => {
  const [motors, setMotors] = useState([]);

  useEffect(() => {
    const fetchMotors = async () => {
      try {
        const res = await axios.get('/api/admin/motor');
        setMotors(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMotors();
  }, []);

  const handleChange = (id, field, value) => {
    setMotors((prev) =>
      prev.map((m) =>
        m._id === id ? { ...m, [field]: value } : m
      )
    );
  };

  const updateMotorData = async (id, motor) => {
    try {
      const formData = new FormData();
      formData.append('motorId', motor.motorId);
      formData.append('brand', motor.brand);
      formData.append('harga', motor.harga);
      formData.append('status', motor.status);
      formData.append('model', motor.model);
      if (motor.gambarFile) formData.append('gambar', motor.gambarFile);

      await axios.put(`/api/admin/motor/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert('Motor berhasil diperbarui');
    } catch (err) {
      console.error('Gagal update motor:', err);
      alert('Gagal memperbarui motor');
    }
  };

  return (
    <div className="update-motor-container">
      <h2>Update Data Motor</h2>
      {motors.map((motor) => (
        <div key={motor._id} className="motor-item">
          <img src={motor.gambar} alt={motor.brand} width="100" />

          <label>Plat Nomor:</label>
          <input
            type="text"
            value={motor.motorId}
            onChange={(e) => handleChange(motor._id, 'motorId', e.target.value)}
          />

          <label>Brand:</label>
          <input
            type="text"
            value={motor.brand}
            onChange={(e) => handleChange(motor._id, 'brand', e.target.value)}
          />

          <label>Model:</label>
          <select
            value={motor.model}
            onChange={(e) => handleChange(motor._id, 'model', e.target.value)}
          >
            <option value="Matic">Matic</option>
            <option value="Non-matic">Non-matic</option>
          </select>

          <label>Harga:</label>
          <input
            type="number"
            value={motor.harga}
            onChange={(e) => handleChange(motor._id, 'harga', e.target.value)}
          />

          <label>Status:</label>
          <select
            value={motor.status}
            onChange={(e) => handleChange(motor._id, 'status', e.target.value)}
          >
            <option value="Tersedia">Tersedia</option>
            <option value="Sedang diservice / dibooking">Sedang diservice / dibooking</option>
          </select>

          <label>Ganti Gambar:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleChange(motor._id, 'gambarFile', e.target.files[0])}
          />

          <button onClick={() => updateMotorData(motor._id, motor)}>
            Simpan
          </button>
        </div>
      ))}
    </div>
  );
};

export default UpdateMotor;
