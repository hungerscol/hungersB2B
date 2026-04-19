
import React from 'react';
import { Page, UserRole } from '../../types.ts';
import LoginCliente from './LoginCliente.tsx';

interface LoginCocineroProps {
  onGoToSuperAdmin: () => void;
}

const LoginCocinero: React.FC<LoginCocineroProps> = ({ onGoToSuperAdmin }) => {
  return <LoginCliente initialRole={UserRole.Cocinero} onGoToSuperAdmin={onGoToSuperAdmin} />;
};

export default LoginCocinero;
