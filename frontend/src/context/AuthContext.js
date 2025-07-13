import { createContext, useEffect, useState } from 'react';
import api from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await api.get('/auth/getUser', { withCredentials: true });
      setUser(res.data.data);
    } catch (err) {
      setUser(null);
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const logout = async () => {
    await api.get('/auth/logout', { withCredentials: true });
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
