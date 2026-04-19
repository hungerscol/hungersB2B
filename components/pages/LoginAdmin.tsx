
import React, { useState } from 'react';
import { Page, UserRole } from '../../types.ts';
import Button from '../Button.tsx';
import { useAuth } from '../../contexts/AuthContext.tsx';
import Logo from '../Logo.tsx';

interface LoginAdminProps {
  setCurrentPage: (page: Page) => void;
}

const LoginAdmin: React.FC<LoginAdminProps> = ({ setCurrentPage }) => {
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const role = UserRole.SuperAdmin;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const res = await login(email, password, role);
    
    if (res.success) {
      window.location.href = '/dashboard';
    } else {
      setError(res.message || 'Credenciales de administrador incorrectas.');
    }
  };

  return (
    <div className="bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 min-h-full">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Logo onClick={() => setCurrentPage(Page.Home)} className="h-16 mx-auto" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Portal de Administración
          </h2>
        </div>
        <form className="mt-8 space-y-6 p-8 rounded-2xl" onSubmit={handleSubmit}>
          
          <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">Correo de Administrador</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-700 focus:border-green-700 transition bg-transparent placeholder-gray-500"
                placeholder="admin@email.com"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-700 focus:border-green-700 transition bg-transparent placeholder-gray-500"
              placeholder="••••••••"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            />
          </div>
          
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <div>
            <Button type="submit" variant="secondary" className="w-full">
              Ingresar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginAdmin;
