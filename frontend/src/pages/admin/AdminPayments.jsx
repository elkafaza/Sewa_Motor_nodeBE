import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './adminPayments.css';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [editStatuses, setEditStatuses] = useState({}); // simpan perubahan status

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axios.get('/api/payment', {
          withCredentials: true,
        });

        if (Array.isArray(res.data)) {
          setPayments(res.data);
        } else if (Array.isArray(res.data.data)) {
          setPayments(res.data.data);
        } else {
          setPayments([]);
        }
      } catch (err) {
        console.error('Gagal mengambil data pembayaran:', err);
        setPayments([]);
      }
    };

    fetchPayments();
  }, []);

  const handleStatusChange = (id, newStatus) => {
    setEditStatuses((prev) => ({
      ...prev,
      [id]: newStatus
    }));
  };

  const handleUpdate = async (id) => {
    const newStatus = editStatuses[id];
    if (!newStatus) return;

    try {
      await axios.patch(
        `/api/admin/payments/${id}`,
        { status: newStatus },
        { withCredentials: true }
      );

      setPayments((prev) =>
        prev.map((p) => (p._id === id ? { ...p, status: newStatus } : p))
      );

      // Kosongkan input yang sudah diupdate
      setEditStatuses((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });

      alert('Status pembayaran berhasil diperbarui!');
    } catch (err) {
      console.error('Gagal update status:', err);
      alert('Gagal memperbarui status');
    }
  };

  return (
    <div className="admin-payment-page">
      <h2>Daftar Pembayaran Sewa Motor</h2>
      {payments.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'gray' }}>
          Tidak ada data pembayaran.
        </p>
      ) : (
        <table className="payment-table">
          <thead>
            <tr>
              <th>Sewa ID</th>
              <th>User</th>
              <th>Motor</th>
              <th>Tanggal Pemesanan</th>
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
      <td>{p.userId?.name || '-'}</td>
      <td>{p.motorId?.motorId} ({p.motorId?.brand})</td>
      <td>{new Date(p.createdAt).toLocaleDateString('id-ID')}</td>
      <td>{new Date(p.startDate).toLocaleDateString('id-ID')}</td>
      <td>{new Date(p.endDate).toLocaleDateString('id-ID')}</td>
      <td>{p.duration} hari</td>
      <td>Rp {p.total.toLocaleString('id-ID')}</td>
      <td>{p.method}</td>

      <td>
        <select
          value={editStatuses[p._id] || p.status}
          onChange={(e) => handleStatusChange(p._id, e.target.value)}
        >
          <option value="Berlangsung">Berlangsung</option>
          <option value="Selesai">Selesai</option>
          <option value="Gagal">Gagal</option>
        </select>
      </td>

      <td>
        {p.method === 'cod' || !p.buktiTransfer ? (
          '-' // tetap render <td> walau kosong
        ) : (
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
        )}
      </td>

      <td>
        <button
          onClick={() => handleUpdate(p._id)}
          disabled={!editStatuses[p._id] || editStatuses[p._id] === p.status}
          style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px' }}
        >
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
