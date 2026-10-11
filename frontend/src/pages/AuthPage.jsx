import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AnimatedBackground } from '../components/landing/AnimatedBackground';
import { 
  ArrowLeft, 
  LogIn, 
  UserPlus, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Sparkles,
  Zap
} from 'lucide-react';

export const AuthPage = ({ initialMode = 'login', onNavigate }) => {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(initialMode === 'register');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('seller1@example.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      if (onNavigate) {
        onNavigate('ledger');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('seller1@example.com');
    setPassword('password123');
    setIsRegister(false);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-white text-[#111111] flex flex-col relative overflow-hidden">
      {/* Background Animated Ambient Effect */}
      <AnimatedBackground />

      {/* Top Navigation Bar */}
      <header className="relative z-10 border-b border-[#E5E7EB] bg-white/80 backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
          {/* Left: Back to Home */}
          <button
            onClick={() => onNavigate && onNavigate('landing')}
            className="flex items-center gap-2 text-xs font-medium text-[#555555] hover:text-[#111111] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </button>

          {/* Center Brand */}
          <button
            onClick={() => onNavigate && onNavigate('landing')}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-[2px] bg-[#111111] text-white flex items-center justify-center font-semibold text-xs tracking-widest border border-[#111111]">
              CP
            </div>
            <span className="font-semibold text-[16px] text-[#111111] tracking-tight hidden sm:inline">
              CatalogPlatform
            </span>
          </button>

          {/* Right Mode Switch */}
          <div className="text-xs text-[#555555]">
            {isRegister ? (
              <span>
                Already registered?{' '}
                <button
                  onClick={() => { setIsRegister(false); setError(null); }}
                  className="font-medium text-[#111111] underline hover:text-[#3B82F6] cursor-pointer"
                >
                  Sign in
                </button>
              </span>
            ) : (
              <span>
                New seller?{' '}
                <button
                  onClick={() => { setIsRegister(true); setError(null); }}
                  className="font-medium text-[#111111] underline hover:text-[#3B82F6] cursor-pointer"
                >
                  Create account
                </button>
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Centered Auth Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-12 md:py-16">
        <div className="w-full max-w-[440px] bg-white border border-[#E5E7EB] p-8 sm:p-10 rounded-[2px] shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-[2px] bg-[#111111] text-white font-semibold text-sm mb-4">
              CP
            </div>
            <h1 className="text-2xl sm:text-[26px] font-medium text-[#111111] tracking-tight">
              {isRegister ? 'Create Seller Account' : 'Welcome back'}
            </h1>
            <p className="text-xs text-[#555555] mt-1.5 font-normal max-w-xs mx-auto">
              {isRegister
                ? 'Join high-growth D2C brands publishing to Flipkart & Amazon via AI catalog pipelines.'
                : 'Enter your credentials to access your multi-channel seller ledger.'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex border border-[#E5E7EB] rounded-[2px] p-1 bg-[#FAFAFA] mb-6">
            <button
              type="button"
              onClick={() => { setIsRegister(false); setError(null); }}
              className={`flex-1 py-2 text-xs font-medium rounded-[2px] transition-all cursor-pointer ${
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
              className={`flex-1 py-2 text-xs font-medium rounded-[2px] transition-all cursor-pointer ${
                isRegister
                  ? 'bg-white text-[#111111] shadow-xs'
                  : 'text-[#777777] hover:text-[#111111]'
              }`}
            >
              Register Seller
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-[2px] flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold">Authentication Error</div>
                <div>{error}</div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-xs font-medium text-[#333333] mb-1.5">
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
              <label className="block text-xs font-medium text-[#333333] mb-1.5">
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
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-[#333333]">
                  Account Password
                </label>
                {!isRegister && (
                  <span className="text-[11px] text-[#777777] hover:text-[#111111] cursor-pointer">
                    Forgot password?
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="premium-input w-full text-xs pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777777] hover:text-[#111111] p-1 cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-rect-primary w-full py-3 text-xs mt-3 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : isRegister ? (
                <span className="flex items-center justify-center gap-2">
                  <UserPlus className="w-4 h-4" /> Create Seller Account
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <LogIn className="w-4 h-4" /> Sign In to Catalog
                </span>
              )}
            </button>
          </form>

          {/* Demo Account Helper */}
          <div className="mt-6 pt-5 border-t border-[#E5E7EB] text-center space-y-2">
            <button
              type="button"
              onClick={handleFillDemo}
              className="w-full py-2.5 border border-dashed border-[#D1D5DB] hover:border-[#111111] bg-[#FAFAFA] text-[#333333] hover:text-[#111111] text-xs font-medium rounded-[2px] transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-[#3B82F6]" />
              <span>Fill Default Demo Credentials</span>
            </button>
            <div className="text-[11px] text-[#888888] font-mono">
              seller1@example.com • password123
            </div>
          </div>
        </div>
      </main>

      {/* Footer Security Note */}
      <footer className="relative z-10 py-6 border-t border-[#E5E7EB] text-center text-[11px] text-[#777777] bg-white/70">
        <div className="flex items-center justify-center gap-2 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Strict Tenant Isolation • In-Memory JWT Bearer Security</span>
        </div>
      </footer>
    </div>
  );
};
