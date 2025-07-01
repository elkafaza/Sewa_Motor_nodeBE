import React from 'react';
import { Routes, Route } from 'react-router-dom';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Home from './pages/Home';
import Login from './pages/register/Login';
import Register from './pages/register/Register';
import './i18n';
import Layout from './components/Layout';
import './register.css';
import Payment from './pages/payment/Payment';
import PaymentQris from './pages/payment/PaymentQris';
import PaymentTransfer from './pages/payment/PaymentTransfer';
import PaymentCOD from './pages/payment/PaymentCOD';
import MotorList from './pages/admin/MotorList';
import Harga from './pages/Harga';
import AdminPayments from './pages/admin/AdminPayments';


function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      
  <Route path="/payment/qris" element={<PaymentQris />} />
  <Route path="/payment/transfer" element={<PaymentTransfer />} />
  <Route path="/payment/cod" element={<PaymentCOD />} />
  <Route path="/admin/motors" element={<MotorList />} />
      <Route path="/admin/payments" element={<AdminPayments />} />
      <Route path="/harga" element={<Harga />} />
      <Route path="/payment" element={<Payment />} />
  
      </Route>
      
    </Routes>
  );
}

export default App;
