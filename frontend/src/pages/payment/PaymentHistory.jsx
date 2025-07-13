// src/pages/PaymentHistory.jsx
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const PaymentHistory = () => {
  const { user, loading } = useContext(AuthContext);
  const [payments, setPayments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading || !user) return;

    const fetchPayments = async () => {
      try {
        const res = await axios.get('/api/payment/user', {
          withCredentials: true,
        });
        console.log('📦 Pembayaran user login:', res.data);
        setPayments(res.data);
      } catch (err) {
        console.error('❌ Gagal mengambil data pembayaran:', err);
      }
    };

    fetchPayments();
  }, [user, loading]);

  if (loading) return <p>Memuat data pengguna...</p>;
  if (!user) return <p>Silakan login terlebih dahulu.</p>;

  return (
  <>
    <div className="spacer" />
    <div className="payment-history-container">
      <h2>Riwayat Pembayaran Saya</h2>
      <table className="payment-table">
        <thead>
          <tr>
            <th>Motor</th>
            <th>Tanggal</th>
            <th>Durasi</th>
            <th>Total</th>
            <th>Metode</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
  {payments.length === 0 ? (
    <tr>
      <td colSpan="6" style={{ textAlign: 'center' }}>
        Belum ada riwayat pembayaran.
      </td>
    </tr>
  ) : (
    payments.map((p) => (
      <tr
        key={p._id}
        onClick={() =>
          navigate('/payment-status', { state: { paymentId: p._id } })
        }
        className="clickable-row"
      >
        <td>{p.motorId?.motorId} ({p.motorId?.brand})</td>
        <td>
          {new Date(p.startDate).toLocaleDateString()} -{' '}
          {new Date(p.endDate).toLocaleDateString()}
        </td>
        <td>{p.duration} hari</td>
        <td>Rp {p.total.toLocaleString('id-ID')}</td>
        <td>{p.method === 'transfer' ? 'Transfer Bank' : 'COD'}</td>
        <td>{p.status}</td>
      </tr>
    ))
  )}
</tbody>

      </table>
    </div>

  </>
);
}
export default PaymentHistory;
