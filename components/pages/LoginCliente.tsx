
import React, { useState, useEffect } from 'react';
import { UserRole } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../Logo';
import Button from '../Button';
import ForgotPasswordModal from '../ForgotPasswordModal';
import { useSEO } from '../../hooks/useSEO';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
  initialRole?: UserRole;
  onGoToSuperAdmin: () => void;
}

const LoginCliente: React.FC<LoginProps> = ({ initialRole = UserRole.Cliente, onGoToSuperAdmin }) => {
  const navigate = useNavigate();
  useSEO({
    title: 'Hungers | Acceso a tu Cuenta',
    description: 'Accede a tu cuenta de Hungers para disfrutar de almuerzos caseros con propósito social.',
  });

  const [activeRole, setActiveRole] = useState<UserRole>(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  useEffect(() => {
    setActiveRole(initialRole);
  }, [initialRole]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password) {
        setError('Por favor completa todos los campos.');
        setIsLoading(false);
        return;
    }

    const res = await login(email, password, activeRole);
    if (res.success) {
      window.location.href = '/dashboard';
      return;
    } else {
      setError(res.message || 'Credenciales incorrectas o el perfil no coincide con el rol seleccionado.');
    }
    setIsLoading(false);
  };

  const roles = [
    { role: UserRole.Cliente, label: 'Cliente', icon: '👤' },
    { role: UserRole.Cocinero, label: 'Cocinero', icon: '🧑‍🍳' },
    { role: UserRole.AdminEmpresa, label: 'Empresa', icon: '🏢' },
  ];

  return (
    <>
      <div className="bg-[#fcfdfc] min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="max-w-6xl w-full bg-white shadow-premium rounded-5xl grid grid-cols-1 lg:grid-cols-2 overflow-hidden min-h-[750px] relative border border-gray-100">
          
          <div className="p-10 sm:p-20 flex flex-col justify-center items-center bg-white relative animate-fade-in">
            <div className="w-full max-w-sm">
              <div className="text-center mb-8">
                <Logo onClick={() => navigate('/')} className="h-16 mx-auto mb-4 transform hover:scale-105 transition-transform" />
                <p className="text-hungers-green-900 font-black text-[10px] uppercase tracking-[0.2em] opacity-40">Almuerzos con Propósito</p>
              </div>

              <div className="text-center mb-10">
                <h1 className="text-4xl font-black text-hungers-green-900 mb-2 tracking-tighter uppercase">Accede a tu cuenta</h1>
                <p className="text-sm text-gray-500 font-medium">
                  ¿Aún no tienes cuenta?{' '}
                  <button 
                    onClick={() => navigate('/registro')} 
                    className="font-black text-hungers-green-900 hover:underline"
                  >
                    Regístrate aquí
                  </button>
                </p>
              </div>

              <div className="flex justify-between border-b border-gray-100 mb-10 px-2">
                {roles.map(({ role, label, icon }) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setActiveRole(role)}
                    className={`flex items-center gap-2 pb-5 px-3 text-[11px] font-black uppercase tracking-widest transition-all border-b-4 ${
                      activeRole === role
                        ? 'border-hungers-lime-500 text-hungers-green-900'
                        : 'border-transparent text-gray-300 hover:text-gray-500'
                    }`}
                  >
                    <span>{label}</span>
                  </button>
                ))}
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Correo electrónico</label>
                  <input
                    type="email"
                    required
                    className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-hungers-lime-200 focus:border-hungers-green-900 transition-all bg-white placeholder-gray-400 text-hungers-green-950 font-medium"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center px-4">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">Contraseña</label>
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-[10px] font-black uppercase text-hungers-green-900 hover:underline tracking-tighter opacity-60"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-hungers-lime-200 focus:border-hungers-green-900 transition-all bg-white placeholder-gray-400 pr-14 text-hungers-green-950 font-medium"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-6 flex items-center text-gray-400 hover:text-hungers-green-900"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-2xl animate-shake">
                    <p className="text-xs text-red-600 text-center font-bold">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  variant="primary"
                  className="w-full !py-4 shadow-lime"
                >
                  {isLoading ? 'Verificando...' : 'Ingresar'}
                </Button>
              </form>

              <div className="mt-12 text-center">
                <button 
                  onClick={onGoToSuperAdmin} 
                  className="text-[10px] font-black uppercase text-gray-400 hover:text-hungers-green-900 transition-colors underline decoration-hungers-lime-500 underline-offset-4 tracking-widest"
                >
                  Acceso administrativo
                </button>
              </div>
            </div>
          </div>

          <div className="hidden lg:block relative group bg-hungers-green-900">
            <img
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70"
              src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt="Personas disfrutando un almuerzo en equipo"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-hungers-green-950/80 to-transparent"></div>
            <div className="absolute bottom-16 left-16 right-16 text-white">
                <p className="text-xs font-black uppercase tracking-[0.3em] text-hungers-lime-500 mb-4">Impacto Social</p>
                <h2 className="text-5xl font-black uppercase leading-[0.9] tracking-tighter mb-6">Cambiando el almuerzo <br/> corporativo</h2>
                <p className="text-hungers-lime-100 text-lg font-medium max-w-sm opacity-80">Conectamos el sazón de casa con el corazón de tu empresa.</p>
            </div>
          </div>
        </div>
      </div>
      {showForgotPassword && <ForgotPasswordModal onClose={() => setShowForgotPassword(false)} />}
    </>
  );
};

export default LoginCliente;
