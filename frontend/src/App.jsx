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
import MotorList from './pages/admin/MotorList';
import Harga from './pages/Harga';
import AdminPayments from './pages/admin/AdminPayments';
import PaymentStatus from './pages/payment/PaymentStatus';
import PaymentHistory from './pages/payment/PaymentHistory';
import UpdateMotor from './pages/admin/UpdateMotor';

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
  <Route path="/payment-status" element={<PaymentStatus />} />
  <Route path="/payment-history" element={<PaymentHistory />} />
  <Route path="/admin/motors" element={<MotorList />} />
  <Route path="/admin/update-motor" element={<UpdateMotor />} />
      <Route path="/admin/payments" element={<AdminPayments />} />
      <Route path="/harga" element={<Harga />} />
      <Route path="/payment" element={<Payment />} />
  
      </Route>
      
    </Routes>
  );
}

export default App;
