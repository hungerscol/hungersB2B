
import React from 'react';
import { Page, UserRole } from '../../types.ts';
import LoginCliente from './LoginCliente.tsx';

interface LoginEmpresaProps {
  onGoToSuperAdmin: () => void;
}

const LoginEmpresa: React.FC<LoginEmpresaProps> = ({ onGoToSuperAdmin }) => {
  return <LoginCliente initialRole={UserRole.AdminEmpresa} onGoToSuperAdmin={onGoToSuperAdmin} />;
};

export default LoginEmpresa;
