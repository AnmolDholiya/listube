import React, { createContext, useContext, useState } from 'react';
import { api, setAuthToken, clearAuthToken } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [sellerEmail, setSellerEmail] = useState(null);
  const [businessName, setBusinessName] = useState(null);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    if (res.token) {
      setToken(res.token);
      setSellerEmail(res.email || email);
      setBusinessName(res.businessName || 'Seller Account');
      setAuthToken(res.token);
    }
    return res;
  };

  const register = async (businessNameInput, email, password) => {
    const res = await api.register({ businessName: businessNameInput, email, password });
    if (res.token) {
      setToken(res.token);
      setSellerEmail(res.email || email);
      setBusinessName(res.businessName || businessNameInput);
      setAuthToken(res.token);
    }
    return res;
  };

  const logout = () => {
    setToken(null);
    setSellerEmail(null);
    setBusinessName(null);
    clearAuthToken();
  };

  return (
    <AuthContext.Provider value={{
      token,
      sellerEmail,
      businessName,
      isAuthenticated: !!token,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
