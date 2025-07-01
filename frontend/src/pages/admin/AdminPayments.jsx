import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './adminPayments.css';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axios.get('/api/payment', {
          withCredentials: true,
        });

        // Cek bentuk data
        console.log('Isi data API:', res.data);

        // Kalau API mengembalikan bentuk: { data: [...] }
        if (Array.isArray(res.data)) {
          setPayments(res.data);
        } else if (Array.isArray(res.data.data)) {
          setPayments(res.data.data);
        } else {
          setPayments([]); // fallback kosong jika tidak valid
        }
      } catch (err) {
        console.error('Gagal mengambil data pembayaran:', err);
        setPayments([]); // fallback supaya tidak meledak di render
      }
    };

    fetchPayments();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(
        `/api/payment/${id}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      setPayments((prev) =>
        prev.map((p) => (p._id === id ? { ...p, status: newStatus } : p))
      );
    } catch (err) {
      console.error('Gagal update status:', err);
      alert('Gagal memperbarui status');
    }
  };

  return (
    <div className="admin-payment-page">
      <h2>Daftar Pembayaran Sewa Motor</h2>
      {payments.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'gray' }}>Tidak ada data pembayaran.</p>
      ) : (
        <table className="payment-table">
          <thead>
            <tr>
              <th>Sewa ID</th>
              <th>User</th>
              <th>Motor</th>
              <th>Sewa</th>
              <th>Kembali</th>
              <th>Durasi</th>
              <th>Total</th>
              <th>Metode</th>
              <th>Status</th>
              <th>Bukti</th> 
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p._id}>
                <td>{p._id}</td>
                <td>{p.userId}</td>
                <td>{p.motorId}</td>
                <td>{new Date(p.startDate).toLocaleDateString('id-ID')}</td>
                <td>{new Date(p.endDate).toLocaleDateString('id-ID')}</td>
                <td>{p.duration} hari</td>
                <td>Rp {p.total.toLocaleString('id-ID')}</td>
                <td>{p.method}</td>
                <td>
                  <select
  value={p.status}
  onChange={(e) => handleStatusChange(p._id, e.target.value)}
>
  
  <option value="Berlangsung">Berlangsung</option>
  <option value="Selesai">Selesai</option>
  <option value="Gagal">Gagal</option>
</select>
<td>
  {p.buktiTransfer ? (
    <a
      href={`/uploads/bukti/${p.buktiTransfer}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        src={`/uploads/bukti/${p.buktiTransfer}`}
        alt="Bukti Transfer"
        style={{ width: '60px', height: 'auto', borderRadius: '4px' }}
      />
    </a>
  ) : (
    '-'
  )}
</td>


                </td>
                <td>
                  <button onClick={() => handleStatusChange(p._id, p.status)}>
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPayments;
