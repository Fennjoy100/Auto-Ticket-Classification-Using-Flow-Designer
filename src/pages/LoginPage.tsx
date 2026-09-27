import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, GitBranch, KeyRound, Lock, Mail, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LoginPage: React.FC = () => {
  const { login, demoLogin, isAuthenticated } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin123');
  const [errorMsg, setErrorMsg] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const success = login(email, password);
    if (success) {
      navigate('/');
    } else {
      setErrorMsg('Invalid credentials. Please use admin@example.com / admin123');
    }
  };

  const handleDemoClick = () => {
    demoLogin();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand */}
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 mb-3">
            <GitBranch className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">FlowTicket</h1>
          <p className="text-xs text-slate-400 mt-1">
            Intelligent IT Ticket Classification & Automation Using Flow Designer
          </p>
        </div>

        {/* Card */}
        <div className="mt-8 bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm">
          {/* Demo Login Banner */}
          <div className="mb-6 p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="font-semibold text-indigo-300 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                Pre-configured Demo Credentials
              </span>
              <span className="text-[10px] font-mono uppercase bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded">
                Admin
              </span>
            </div>
            <p className="text-slate-300 text-[11px] mb-3">
              Email: <code className="text-indigo-200">admin@example.com</code> · Password:{' '}
              <code className="text-indigo-200">admin123</code>
            </p>
            <button
              type="button"
              onClick={handleDemoClick}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-all"
            >
              <span>Instant Demo Login</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-mono">
              <span className="bg-slate-800 px-2 text-slate-400">or sign in manually</span>
            </div>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 text-xs text-rose-300 bg-rose-950/50 border border-rose-800 rounded-lg">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-2.5 px-4 text-xs font-medium rounded-lg text-white bg-slate-700 hover:bg-slate-600 transition-colors"
            >
              Sign In
            </button>
          </form>

          {/* Local environment note */}
          <div className="mt-6 pt-4 border-t border-slate-700/60 text-center text-[11px] text-slate-400">
            FlowTicket runs 100% locally in your browser session. No external servers or API keys required.
          </div>
        </div>
      </div>
    </div>
  );
};
