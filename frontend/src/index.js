// frontend/src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './i18n'; // penting agar i18n ter-inject sebelum App

import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // ✅ Tambahkan ini

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider> {/* ✅ Bungkus App dengan AuthProvider */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
