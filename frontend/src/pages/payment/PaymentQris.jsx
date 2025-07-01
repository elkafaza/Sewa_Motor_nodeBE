import React from 'react';

const PaymentQris = () => {
  return (
    <div className="payment-container">
      <h2>Pembayaran QRIS</h2>
      <p>Silakan scan QR berikut untuk menyelesaikan pembayaran.</p>
      <img src="/images/qris.png" alt="QRIS" style={{ maxWidth: '300px', borderRadius: '10px' }} />
    </div>
  );
};

export default PaymentQris;
