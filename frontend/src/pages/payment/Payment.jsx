import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Payment.css';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const preselectedMotor = location.state?.motor || null;

  const [motors, setMotors] = useState([]);
  const [selectedMotor, setSelectedMotor] = useState(preselectedMotor);
  const [user, setUser] = useState(null);
  const [bukti, setBukti] = useState(null);
  const [form, setForm] = useState({
    motorId: preselectedMotor?._id || '',
    startDate: '',
    endDate: '',
    method: 'transfer',
  });

  useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await axios.get('/api/auth/getUser', { withCredentials: true });
      setUser(res.data.data);
    } catch (error) {
      // Kalau gagal ambil user (belum login), redirect ke login
      console.log('User belum login, redirect...');
      navigate('/login'); // Ganti dengan path login kamu
    }
  };

  const fetchMotors = async () => {
    try {
      const res = await axios.get('/api/admin/motor');
      setMotors(res.data);
    } catch (error) {
      console.error('Gagal fetch motor:', error);
    }
  };

  fetchUser();
  fetchMotors();
}, [navigate]);


  useEffect(() => {
    const motor = motors.find((m) => m._id === form.motorId);
    if (motor) setSelectedMotor(motor);
  }, [form.motorId, motors]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const calculateDuration = () => {
    if (!form.startDate || !form.endDate) return 0;
    const start = new Date(form.startDate);
    const end = new Date(form.endDate);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const duration = calculateDuration();
  const total = selectedMotor ? selectedMotor.harga * duration : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const paymentData = {
        motorId: selectedMotor ? selectedMotor._id : '',
        startDate: form.startDate,
        endDate: form.endDate,
        duration,
        total,
        method: form.method,
       
      };

      const res = await axios.post('/api/payment', paymentData, { withCredentials: true });

      if (form.method === 'transfer' && bukti) {
        const formData = new FormData();
        formData.append('bukti', bukti);
        formData.append('paymentId', res.data._id);

        await axios.post('/api/payment/upload-bukti', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        });

        alert('Pemesanan berhasil dan bukti transfer telah diunggah!');
        navigate('/payment-status', { state: { paymentId: res.data._id } });
      } else {
        alert('Pemesanan berhasil!');
        navigate('/payment-status', { state: { paymentId: res.data._id } });
      }

    } catch (err) {
      console.error('❌ Gagal menyimpan pembayaran:', err.response?.data || err.message);
      alert("Terjadi kesalahan saat memproses transaksi.");
    }
  };

  return (
    <div className="payment-container">
      <form onSubmit={handleSubmit} className="payment-form">
        <h2>Pembayaran</h2>

        {selectedMotor && (
          <div className="ringkasan-box">
            <h3 className="summary-title">Sewa</h3>
            <p><strong>User:</strong> {user?.name}</p>
            <p><strong>Plat Nomor:</strong> {selectedMotor.motorId}</p>
            <p><strong>Merk Motor:</strong> {selectedMotor.brand}</p>
            <p><strong>Harga per Hari:</strong> Rp {selectedMotor.harga.toLocaleString('id-ID')}</p>
            <p><strong>Durasi:</strong> {duration} hari</p>
            <p><strong>Total Harga:</strong> Rp {total.toLocaleString('id-ID')}</p>
            <p><strong>Status:</strong></p>

            <img
              src={`/uploads/${selectedMotor.gambar.replace(/^.*[\\/]/, '')}`}
              alt={`${selectedMotor.brand} ${selectedMotor.motorId}`}
              className="motor-image"
            />
          </div>
        )}

        <label>Motor yang disewa:</label>
        <select name="motorId" value={form.motorId} onChange={handleChange} required>
          <option value="">-- Pilih Motor --</option>
          {motors.map((m) => (
            <option key={m._id} value={m._id}>
              {m.motorId} – {m.brand}
            </option>
          ))}
        </select>

        <label>Tanggal Sewa:</label>
        <input type="date" name="startDate" value={form.startDate} onChange={handleChange} required />

        <label>Tanggal Kembali:</label>
        <input type="date" name="endDate" value={form.endDate} onChange={handleChange} required />

        <label>Durasi:</label>
        <div className="price-box">{duration} hari</div>

        <label>Total Harga:</label>
        <div className="price-box">Rp {total.toLocaleString('id-ID')}</div>

        <label>Metode Pembayaran:</label>
        <div className="radio-group">
          <label>
            <input type="radio" name="method" value="transfer" checked={form.method === 'transfer'} onChange={handleChange} />
            Transfer Bank
          </label>
          <label>
            <input type="radio" name="method" value="cod" checked={form.method === 'cod'} onChange={handleChange} />
            COD
          </label>
        </div>

        {/* 📌 Tambahan: Info Transfer */}
        {form.method === 'transfer' && (
          <>
            <div className="transfer-info-box">
              <p><strong>Cara Transfer:</strong></p>
              <ul>
                <li>Transfer ke rekening berikut:</li>
                <li><strong>Bank BCA</strong></li>
                <li>No. Rekening: <strong>1234567890</strong></li>
                <li>Atas Nama: <strong>PT Motorent Indonesia</strong></li>
                <li>Setelah transfer, upload bukti transfer di bawah.</li>
              </ul>
            </div>

            <div className="upload-section">
              <label>Upload Bukti Transfer:</label>
              <input type="file" onChange={(e) => setBukti(e.target.files[0])} accept="image/*" required />
            </div>
          </>
        )}

        <button type="submit">Sewa Sekarang</button>
      </form>
    </div>
  );
};

export default Payment;
