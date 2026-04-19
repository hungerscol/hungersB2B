
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../Logo';

interface SidebarProps {
  navItems: { name: string; icon: React.ReactNode }[];
  activeView: string;
  setActiveView: (view: string) => void;
  onClose?: () => void; // Para cerrar en móvil
}

const Sidebar: React.FC<SidebarProps> = ({ navItems, activeView, setActiveView, onClose }) => {
  const { user, logout } = useAuth();
  
  const handleLogoClick = () => {
    setActiveView('Dashboard');
    if (onClose) onClose();
  }

  const handleNavClick = (view: string) => {
    setActiveView(view);
    if (onClose) onClose();
  }

  return (
    <aside className="w-full bg-white border-r border-gray-100 flex flex-col h-full overflow-y-auto">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
            <Logo onClick={handleLogoClick} className="h-10 md:h-12 transform hover:scale-105 transition-transform" />
            {onClose && (
                <button onClick={onClose} className="md:hidden text-gray-400 p-2 hover:bg-gray-50 rounded-full transition-colors">
                    <span className="text-xl">✕</span>
                </button>
            )}
        </div>
        
        <nav className="flex-grow mt-10">
            <ul className="space-y-2 px-4">
                {navItems.map((item) => (
                    <li key={item.name}>
                        <button
                            onClick={() => handleNavClick(item.name)}
                            className={`w-full flex items-center px-6 py-4 rounded-2xl transition-all duration-300 group ${
                            activeView === item.name
                                ? 'bg-hungers-lime-500 text-hungers-green-950 font-black shadow-premium'
                                : 'hover:bg-gray-50 text-gray-400 hover:text-hungers-green-900 font-bold'
                            }`}
                        >
                            <span className={`mr-4 text-xl transition-transform duration-300 ${activeView === item.name ? 'scale-110' : 'group-hover:scale-110'}`}>{item.icon}</span>
                            <span className="truncate text-sm md:text-base uppercase tracking-widest">{item.name}</span>
                        </button>
                    </li>
                ))}
            </ul>
        </nav>

        <div className="p-8 border-t border-gray-50 mt-auto bg-[#fcfdfc]">
            <div className="flex items-center mb-8 px-2">
                <div className="w-12 h-12 rounded-2xl bg-hungers-green-900 flex items-center justify-center font-black text-hungers-lime-500 shadow-premium border border-white/10">
                    {user?.name.charAt(0)}
                </div>
                <div className="ml-4 overflow-hidden">
                    <p className="text-sm font-black text-hungers-green-900 truncate">{user?.name}</p>
                    <p className="text-[10px] uppercase font-black text-gray-400 truncate tracking-[0.2em] mt-0.5">{user?.role}</p>
                </div>
            </div>
            <button 
                onClick={logout} 
                className="w-full text-center py-4 text-[10px] text-red-500 hover:text-white font-black uppercase tracking-[0.2em] border border-red-100 rounded-2xl bg-white shadow-sm transition-all hover:bg-red-500 hover:border-red-500 active:scale-95"
            >
                Cerrar Sesión
            </button>
        </div>
    </aside>
  );
};

export default Sidebar;
