import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, LogIn, UserPlus, AlertCircle, ArrowRight } from 'lucide-react';

export const AuthModal = ({ isOpen, onClose, initialMode = 'login', onSuccess }) => {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(initialMode === 'register');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('seller1@example.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isRegister) {
        await register(businessName, email, password);
      } else {
        await login(email, password);
      }
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await login('seller1@example.com', 'password123');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Demo authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-[#E5E7EB] w-full max-w-md p-8 rounded-[2px] shadow-[0_20px_50px_rgba(0,0,0,0.12)] relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-[#777777] hover:text-[#111111] transition-colors rounded-[2px] cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="w-8 h-8 rounded-[2px] bg-[#111111] text-white flex items-center justify-center font-semibold text-xs mb-3">
            CP
          </div>
          <h3 className="text-2xl font-medium text-[#111111] tracking-tight">
            {isRegister ? 'Create Seller Account' : 'Sign In to Ledger'}
          </h3>
          <p className="text-xs text-[#555555] mt-1 font-normal">
            {isRegister 
              ? 'Get instant access to canonical catalog ingestion & Flipkart API publishing.' 
              : 'Enter your credentials to access your multi-channel seller dashboard.'}
          </p>
        </div>

        {/* Toggle Mode Bar */}
        <div className="flex border border-[#E5E7EB] rounded-[2px] p-1 bg-[#FAFAFA] mb-5">
          <button
            type="button"
            onClick={() => { setIsRegister(false); setError(null); }}
            className={`flex-1 py-1.5 text-xs font-medium rounded-[2px] transition-colors cursor-pointer ${
              !isRegister
                ? 'bg-white text-[#111111] shadow-xs'
                : 'text-[#777777] hover:text-[#111111]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsRegister(true); setError(null); }}
            className={`flex-1 py-1.5 text-xs font-medium rounded-[2px] transition-colors cursor-pointer ${
              isRegister
                ? 'bg-white text-[#111111] shadow-xs'
                : 'text-[#777777] hover:text-[#111111]'
            }`}
          >
            Register Seller
          </button>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-[2px] flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>{error}</div>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-medium text-[#333333] mb-1">
                Business / Brand Name
              </label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Aura Studio Pvt Ltd"
                className="premium-input w-full text-xs"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-[#333333] mb-1">
              Seller Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seller@example.com"
              className="premium-input w-full text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#333333] mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="premium-input w-full text-xs"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-rect-primary w-full py-2.5 text-xs mt-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : isRegister ? (
              <span className="flex items-center justify-center gap-1.5">
                <UserPlus className="w-3.5 h-3.5" /> Register Seller Account
              </span>
            ) : (
              <span className="flex items-center justify-center gap-1.5">
                <LogIn className="w-3.5 h-3.5" /> Sign In to Catalog
              </span>
            )}
          </button>
        </form>

        {/* Quick Demo One-Click Access */}
        <div className="mt-5 pt-4 border-t border-[#E5E7EB] text-center">
          <button
            type="button"
            onClick={handleDemoSignIn}
            disabled={loading}
            className="w-full py-2 border border-dashed border-[#D1D5DB] hover:border-[#111111] bg-[#FAFAFA] text-[#333333] hover:text-[#111111] text-xs font-medium rounded-[2px] transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Quick Launch Demo Account</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <div className="text-[11px] text-[#888888] font-mono mt-2">
            Default credentials: seller1@example.com / password123
          </div>
        </div>
      </div>
    </div>
  );
};
