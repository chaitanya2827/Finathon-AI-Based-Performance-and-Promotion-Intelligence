import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import WorkVistaLogo from '../components/common/WorkVistaLogo';
import { useAuth, DEMO_CREDENTIALS } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);

  // If already logged in, redirect to /dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      const origin = location.state?.from?.pathname || '/dashboard';
      navigate(origin, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    const res = await login(email, password, rememberMe);
    if (res.success) {
      const destination = location.state?.from?.pathname || '/dashboard';
      navigate(destination, { replace: true });
    } else {
      setError(res.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleAutofillDemo = () => {
    setEmail(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
    setError('');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] flex flex-col justify-between relative overflow-hidden select-none">
      {/* Ambient background glow accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-cyan-500/10 dark:bg-cyan-500/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Top Bar with Brand & Theme Toggle */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-10">
        <WorkVistaLogo size="md" showSubtitle subtitle="HR Intelligence" />

        <button
          type="button"
          onClick={toggleTheme}
          className="px-3 py-1.5 rounded-xl border border-cyan-500/25 bg-[#081A2F]/60 text-xs font-semibold text-[#7F9BB2] hover:text-cyan-300 hover:border-cyan-400/50 transition-all flex items-center gap-2 backdrop-blur-md"
          title="Toggle Visual Theme"
          aria-label="Toggle theme"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
          <span>{isDark ? 'Dark Theme' : 'Light Theme'}</span>
        </button>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 z-10">
        <div className="w-full max-w-md">
          <div className="card p-7 sm:p-8 backdrop-blur-2xl border border-cyan-500/30 bg-[#081A2F]/90 shadow-[0_8px_32px_rgba(0,0,0,0.45)] rounded-2xl relative">
            
            {/* Header branding inside card */}
            <div className="text-center mb-6">
              <div className="flex justify-center mb-3">
                <WorkVistaLogo size="lg" />
              </div>
              <p className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 tracking-wide uppercase">
                AI-Based Performance &amp; Promotion Intelligence
              </p>
              <h1 className="text-2xl font-extrabold text-[#08243D] dark:text-[#F0F9FF] tracking-tight mt-2">
                Welcome back
              </h1>
              <p className="text-xs text-[#567285] dark:text-[#7F9BB2] mt-0.5">
                HR Manager Login
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div
                role="alert"
                className="mb-5 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 animate-fadeIn"
              >
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-[#08243D] dark:text-[#B6C9D9] mb-1.5"
                >
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#567285] dark:text-[#7F9BB2]">
                    <Mail className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="hr@workvista.ai"
                    className="glass-input w-full pl-10 pr-3.5 py-2.5 text-xs text-[#08243D] dark:text-[#F0F9FF] border border-cyan-500/25 rounded-xl bg-[#061426]/70 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-[#08243D] dark:text-[#B6C9D9] mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#567285] dark:text-[#7F9BB2]">
                    <Lock className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="glass-input w-full pl-10 pr-10 py-2.5 text-xs text-[#08243D] dark:text-[#F0F9FF] border border-cyan-500/25 rounded-xl bg-[#061426]/70 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#567285] dark:text-[#7F9BB2] hover:text-cyan-300 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember me & Forgot password */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-[#567285] dark:text-[#B6C9D9]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-cyan-500/30 text-cyan-500 focus:ring-cyan-400/50 bg-[#061426]/70 accent-cyan-500"
                  />
                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 font-medium transition-colors"
                >
                  Forgot password
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-cyan py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs font-bold shadow-[0_2px_14px_rgba(6,182,212,0.35)] mt-2"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Login</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Demo HR Credentials Helper Banner */}
            <div className="mt-6 pt-5 border-t border-cyan-500/15">
              <div className="p-3 rounded-xl bg-[#061426]/80 border border-cyan-500/25 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    Demo HR Credentials
                  </span>
                  <button
                    type="button"
                    onClick={handleAutofillDemo}
                    className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-400/30 transition-all"
                  >
                    1-Click Autofill
                  </button>
                </div>
                <div className="text-[11px] font-mono text-[#B6C9D9] space-y-0.5">
                  <div className="flex justify-between">
                    <span className="text-[#7F9BB2]">Email:</span>
                    <span className="text-[#F0F9FF] font-semibold">hr@workvista.ai</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7F9BB2]">Password:</span>
                    <span className="text-[#F0F9FF] font-semibold">WorkVista@2026</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="card max-w-sm w-full p-6 border border-cyan-500/30 bg-[#081A2F]/95 rounded-2xl shadow-glass">
            <div className="flex items-center gap-2.5 mb-3 text-cyan-400">
              <Info className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-bold text-[#F0F9FF]">Hackathon Prototype Note</h3>
            </div>
            <p className="text-xs text-[#B6C9D9] leading-relaxed mb-4">
              This is a hackathon demonstration prototype. Authentication is configured with pre-set HR manager credentials:
            </p>
            <div className="p-3 rounded-xl bg-[#061426] border border-cyan-500/20 font-mono text-xs text-cyan-300 mb-4 space-y-1">
              <div>Email: hr@workvista.ai</div>
              <div>Password: WorkVista@2026</div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  handleAutofillDemo();
                  setShowForgotModal(false);
                }}
                className="btn-cyan text-xs py-1.5 px-3"
              >
                Autofill Credentials
              </button>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="btn-glass text-xs py-1.5 px-3"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Notice */}
      <footer className="w-full text-center py-4 text-xs text-[#567285] dark:text-[#7F9BB2] z-10 border-t border-cyan-500/10">
        <p>© 2026 WORKVISTA — Decision Support System for Workforce Intelligence &amp; Promotion Calibration.</p>
      </footer>
    </div>
  );
}
