
import React, { useState } from 'react';
import { UserRole } from '../../types.ts';
import { useAuth } from '../../contexts/AuthContext.tsx';
import Logo from '../Logo.tsx';
import Button from '../Button.tsx';
import ForgotPasswordModal from '../ForgotPasswordModal.tsx';

interface SuperAdminLoginProps {
  onNavigateHome: () => void;
}

const SuperAdminLogin: React.FC<SuperAdminLoginProps> = ({ onNavigateHome }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
        const res = await login(email, password, UserRole.SuperAdmin);
        if (res.success) {
          // Navegación explícita para evitar bloqueos
          window.location.href = '/dashboard';
          return;
        } else {
          setError(res.message || 'Credenciales de administrador incorrectas.');
        }
    } catch (err) {
        setError('Error de conexión al servidor de Hungers.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="w-full p-6 sm:p-8 flex justify-between items-center">
          <Logo onClick={onNavigateHome} className="h-10" />
          <button onClick={onNavigateHome} className="text-green-700 text-sm font-black uppercase tracking-widest hover:underline">Volver</button>
        </header>
      
        <main className="flex-grow flex items-center justify-center w-full px-4 pb-20">
          <div className="w-full max-sm:max-w-full max-w-sm">
            <div className="bg-white p-8 rounded-3xl shadow-2xl space-y-6 border border-green-100 animate-fade-in">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#c1ff72] rounded-2xl flex items-center justify-center mx-auto mb-4 transform -rotate-6 shadow-lg">
                    <span className="text-3xl">🔑</span>
                </div>
                <h1 className="text-2xl font-black text-green-900 uppercase tracking-tighter">Acceso Maestro</h1>
                <p className="text-green-700 mt-1 text-sm font-medium">Portal Administrativo Hungers</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black text-green-700 uppercase tracking-widest mb-1 ml-1">ID de Administrador</label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#c1ff72] focus:border-green-700 transition text-green-900 placeholder-gray-400 shadow-sm"
                    placeholder="admin@hungers.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                
                <div className="relative">
                  <label className="block text-[10px] font-black text-green-700 uppercase tracking-widest mb-1 ml-1">Clave Dinámica</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#c1ff72] focus:border-green-700 transition text-green-900 placeholder-gray-400 pr-10 shadow-sm"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute bottom-3.5 right-4 text-green-700 hover:text-green-900 focus:outline-none"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>

                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-[10px] font-black uppercase text-green-600 hover:text-green-800 tracking-widest transition-colors"
                  >
                    Recuperar Credenciales
                  </button>
                </div>

                {error && <p className="text-xs text-red-500 text-center font-bold bg-red-50 p-3 rounded-xl border border-red-100">{error}</p>}

                <div>
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full !py-4 shadow-xl !font-black uppercase tracking-widest"
                    variant="secondary"
                  >
                    {loading ? 'Sincronizando...' : 'Entrar al Sistema'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
      {showForgotPassword && <ForgotPasswordModal onClose={() => setShowForgotPassword(false)} />}
    </>
  );
};

export default SuperAdminLogin;
