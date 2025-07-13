import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './paymentstatus.css';

const PaymentStatus = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const paymentId = location.state?.paymentId || null;

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!paymentId) {
      alert('ID pembayaran tidak ditemukan.');
      navigate('/');
      return;
    }

    const fetchPayment = async () => {
      try {
        const res = await axios.get(`/api/payment/${paymentId}`, {
          withCredentials: true,
        });
        setPayment(res.data);
      } catch (err) {
        console.error("❌ Gagal mengambil data pembayaran:", err);
        alert("Gagal mengambil data pembayaran");
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchPayment();
  }, [paymentId, navigate]);

  if (loading) return <div className="payment-status-container"><p>Memuat status pembayaran...</p></div>;
  if (!payment) return <div className="payment-status-container"><p>Status tidak ditemukan.</p></div>;

  return (
    <div className="payment-status-container">
      <div className="status-card">
        <h2>Status Pembayaran</h2>

        <p><strong>Nama:</strong> {payment.userId?.name || payment.userId}</p>
<p><strong>Tanggal Transaksi:</strong> {new Date(payment.createdAt).toLocaleDateString()}</p>
<p><strong>Motor:</strong> {payment.motorId?.motorId} ({payment.motorId?.brand})</p>

        <p><strong>Tanggal Sewa:</strong> {new Date(payment.startDate).toLocaleDateString()}</p>
        <p><strong>Tanggal Kembali:</strong> {new Date(payment.endDate).toLocaleDateString()}</p>
        <p><strong>Durasi:</strong> {payment.duration} hari</p>
        <p><strong>Total:</strong> Rp {payment.total.toLocaleString('id-ID')}</p>
        <p><strong>Metode:</strong> {payment.method === 'transfer' ? 'Transfer Bank' : 'COD'}</p>
        <p><strong>Status:</strong> {payment.status}</p>

        {payment.method === 'transfer' && payment.buktiTransfer && (
          <div>
            <p><strong>Bukti Transfer:</strong></p>
            <img
              src={`/uploads/bukti/${payment.buktiTransfer}`}
              alt="Bukti Transfer"
              className="bukti-image"
            />
          </div>
        )}

        <button className="back-button" onClick={() => navigate('/')}>Kembali ke Beranda</button>
      </div>
    </div>
  );
};

export default PaymentStatus;
