
import React from 'react';
import { useAuth } from '../../contexts/AuthContext.tsx';
import { UserRole } from '../../types.ts';
import SuperAdminPanel from './superadmin/SuperAdminPanel.tsx';
import EmpresaPanel from './empresa/EmpresaPanel.tsx';
import CocineroPanel from './cocinero/CocineroPanel.tsx';
import ClientePanel from './cliente/ClientePanel.tsx';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-8 text-center bg-gray-50">
        <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 max-w-md">
          <div className="text-5xl mb-6">⚠️</div>
          <h2 className="text-2xl font-black text-green-900 uppercase tracking-tighter mb-4">Sesión Requerida</h2>
          <p className="text-green-700 font-medium mb-8">No se ha encontrado un usuario activo. Por favor, inicie sesión de nuevo para acceder a su panel.</p>
          <a href="/" className="inline-block px-10 py-4 bg-green-900 text-white font-black rounded-full uppercase tracking-widest text-xs hover:bg-black transition-all shadow-lg">Ir al Inicio</a>
        </div>
      </div>
    );
  }
  
  const renderPanel = () => {
    switch (user.role) {
      case UserRole.SuperAdmin:
        return <SuperAdminPanel />;
      case UserRole.AdminEmpresa:
        return <EmpresaPanel />;
      case UserRole.Cocinero:
        return <CocineroPanel />;
      case UserRole.Cliente:
        return <ClientePanel />;
      default:
        return <div className="p-20 text-center font-bold text-red-500 bg-red-50 rounded-3xl border-2 border-red-100">Rol de usuario no reconocido.</div>;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {renderPanel()}
    </div>
  );
};

export default Dashboard;
