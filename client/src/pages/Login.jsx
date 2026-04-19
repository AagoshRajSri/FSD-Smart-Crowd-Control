import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ShieldCheck } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { user, login } = useAuth();
  
  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (!success) setError('Invalid credentials or server unavailable');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/10 blur-[120px]"></div>
      </div>

      <div className="max-w-md w-full space-y-8 bg-white/5 p-10 rounded-2xl backdrop-blur-xl border border-white/10 shadow-2xl z-10 relative">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-secondary border border-primary/50 shadow-[0_0_20px_rgba(14,165,233,0.3)] mb-4">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-center text-3xl font-extrabold text-white tracking-widest">
            PRAHAR
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400 tracking-wider">
            SECURE ACCESS SYSTEM
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="text-alert text-sm text-center bg-alert/10 border border-alert/20 p-2 rounded">{error}</div>}
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-white/10 bg-black/50 placeholder-gray-500 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm transition-colors"
                placeholder="Operator ID (Email)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-white/10 bg-black/50 placeholder-gray-500 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm transition-colors"
                placeholder="Passcode"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-black bg-secondary hover:bg-white hover:shadow-[0_0_20px_rgba(34,211,238,0.6)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-gray-900 transition-all uppercase tracking-widest"
            >
              Initialize Link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
