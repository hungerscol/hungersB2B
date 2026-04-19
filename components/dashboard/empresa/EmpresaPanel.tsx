
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext.tsx';
import { useLocation } from '../../../contexts/LocationContext.tsx';
import DashboardView from './DashboardView.tsx';
import GestionEmpleados from './GestionEmpleados.tsx';
import FacturacionView from './FacturacionView.tsx';
import PedidosRecurrentesView from './PedidosRecurrentesView.tsx';
import ProgramadosView from './ProgramadosView.tsx';
import ReportesView from './ReportesView.tsx';
import BilleteraView from './BilleteraView.tsx';

const AyudaView: React.FC = () => (
    <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-xl max-w-2xl mx-auto animate-fade-in border border-gray-100">
        <h2 className="text-3xl font-black text-green-900 mb-8 uppercase tracking-tighter">Soporte Corporativo</h2>
        <div className="space-y-8">
            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                <h3 className="font-black text-green-900 mb-4 flex items-center gap-2">
                    <span className="bg-green-700 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">?</span>
                    Gestión Empresarial
                </h3>
                <div className="space-y-4 text-sm text-green-800">
                    <div className="pb-4 border-b border-gray-200">
                        <p className="font-bold mb-1">¿Cómo solicito una factura personalizada?</p>
                        <p className="text-green-700 text-xs leading-relaxed">Las facturas se generan automáticamente en la pestaña "Facturación".</p>
                    </div>
                    <div>
                        <p className="font-bold mb-1">¿Puedo pausar las tiqueteras de mi equipo?</p>
                        <p className="text-green-700 text-xs leading-relaxed">Sí, desde "Pedidos Recurrentes" puedes gestionar los planes activos.</p>
                    </div>
                </div>
            </div>
            <div className="pt-2">
                <h3 className="font-black text-green-900 mb-4 uppercase tracking-widest text-xs">Contacto Directo con Federico</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <a href="https://wa.me/573197885051" target="_blank" rel="noopener noreferrer" className="bg-[#25D366] text-white p-6 rounded-2xl hover:scale-105 transition-transform flex flex-col items-center justify-center gap-2 shadow-lg">
                        <p className="text-3xl">📱</p>
                        <p className="font-black uppercase tracking-widest text-xs">WhatsApp Soporte</p>
                    </a>
                    <a href="mailto:federico@hungers.com.co" className="bg-green-900 text-white p-6 rounded-2xl hover:scale-105 transition-transform flex flex-col items-center justify-center gap-2 shadow-lg">
                        <p className="text-3xl">✉️</p>
                        <p className="font-black uppercase tracking-widest text-xs">Email Soporte</p>
                    </a>
                </div>
            </div>
        </div>
    </div>
);

const EmpresaPanel: React.FC = () => {
    const { user, logout } = useAuth();
    const [activeView, setActiveView] = useState('Dashboard');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { location, setLocation } = useLocation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    useEffect(() => {
        if (user && user.location && user.location !== location) {
            setLocation(user.location);
        }
    }, [user, location, setLocation]);

    if (!user) return null;

     const navItems = [
        { name: 'Dashboard', icon: '📊' },
        { name: 'Billetera', icon: '💰' },
        { name: 'Pedidos Programados', icon: '📅' },
        { name: 'Gestionar Empleados', icon: '👥' },
        { name: 'Facturación', icon: '🧾' },
        { name: 'Pedidos Recurrentes', icon: '🔄' },
        { name: 'Reportes', icon: '📄' },
        { name: 'Ayuda', icon: '❓' },
    ];

    const renderActiveView = () => {
        switch(activeView) {
            case 'Dashboard': return <DashboardView onNavigate={setActiveView} />;
            case 'Billetera': return <BilleteraView />;
            case 'Pedidos Programados': return <ProgramadosView />;
            case 'Gestionar Empleados': return <GestionEmpleados />;
            case 'Facturación': return <FacturacionView />;
            case 'Pedidos Recurrentes': return <PedidosRecurrentesView />;
            case 'Reportes': return <ReportesView />;
            case 'Ayuda': return <AyudaView />;
            default: return <DashboardView onNavigate={setActiveView} />;
        }
    };

    const handleNavClick = (viewName: string) => {
        setActiveView(viewName);
        setIsMobileMenuOpen(false);
    };

    return (
        <div className="flex h-screen bg-gray-50 relative overflow-hidden">
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            <aside className={`
                fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 p-6 flex flex-col transition-transform duration-300 ease-in-out transform
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0 md:static md:inset-auto md:w-80 md:shadow-none shadow-2xl h-full
            `}>
                <div className="md:hidden flex justify-end mb-6">
                    <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400 p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <span className="text-2xl">✕</span>
                    </button>
                </div>

                <div className="px-4 mb-10 text-left border-l-4 border-[#c1ff72]">
                    <h1 className="text-2xl font-black text-green-900 tracking-tighter uppercase leading-none">{user?.companyName}</h1>
                    <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest mt-1">Admin Empresa</p>
                </div>
                
                <nav className="flex-grow space-y-1.5 overflow-y-auto">
                    {navItems.map(item => (
                        <button
                            key={item.name}
                            onClick={() => handleNavClick(item.name)}
                            className={`w-full flex items-center px-6 py-4 text-left rounded-2xl transition-all duration-300 group ${
                                activeView === item.name
                                ? 'bg-[#c1ff72] text-green-900 font-black shadow-lg scale-105'
                                : 'hover:bg-gray-50 text-green-800 font-medium'
                            }`}
                        >
                             <span className="mr-4 text-2xl transition-transform group-hover:scale-125">{item.icon}</span>
                             <span className="truncate text-xs md:text-sm uppercase tracking-widest">{item.name}</span>
                        </button>
                    ))}

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-6 py-4 text-left rounded-2xl transition-all text-red-600 hover:bg-red-50 mt-4 group"
                    >
                         <span className="mr-4 text-2xl transition-transform group-hover:scale-125">🚪</span>
                         <span className="truncate text-xs md:text-sm uppercase tracking-widest font-black">Cerrar Sesión</span>
                    </button>
                </nav>

                <div className="mt-auto pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
                        <div className="w-10 h-10 rounded-full bg-green-900 text-[#c1ff72] flex items-center justify-center font-black">
                            {user.name.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-[10px] font-black text-green-900 truncate uppercase tracking-tighter">{user.name}</p>
                            <p className="text-[9px] text-green-600 font-bold uppercase truncate">{user.email}</p>
                        </div>
                    </div>
                </div>
            </aside>

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="md:hidden flex justify-between items-center bg-white p-4 border-b border-gray-200 flex-shrink-0">
                    <button 
                        className="p-2 text-green-900 hover:bg-gray-100 rounded-xl transition-colors"
                        onClick={() => setIsMobileMenuOpen(true)}
                    >
                        <span className="text-2xl">☰</span>
                    </button>
                    <div className="text-green-900 font-black text-[10px] uppercase tracking-[0.2em] truncate max-w-[200px]">
                        {user.companyName}
                    </div>
                    <div className="w-10"></div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-10 lg:p-12">
                    <div className="max-w-7xl mx-auto">
                        {renderActiveView()}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default EmpresaPanel;
