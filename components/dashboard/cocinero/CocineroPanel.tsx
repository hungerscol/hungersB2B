
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext.tsx';
import { useLocation } from '../../../contexts/LocationContext.tsx';
import { resubmitForVerification } from '../../../data.ts';
import Button from '../../Button';
import PerfilCocinero from './PerfilCocinero.tsx';
import MenusCocinero from './MenusCocinero.tsx';
import PagosCocinero from './PagosCocinero.tsx';
import VentasCocinero from './VentasCocinero.tsx';

const AyudaView: React.FC = () => (
    <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-xl max-w-2xl mx-auto animate-fade-in border border-gray-100">
        <h2 className="text-3xl font-black text-green-900 mb-8 uppercase tracking-tighter">Soporte al Cocinero</h2>
        <div className="space-y-8">
            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                <h3 className="font-black text-green-900 mb-4 flex items-center gap-2">
                    <span className="bg-green-700 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">?</span>
                    Preguntas Frecuentes del Talento
                </h3>
                <div className="space-y-4 text-sm text-green-800">
                    <div className="pb-4 border-b border-gray-200">
                        <p className="font-bold mb-1">¿Cuándo recibo mis pagos?</p>
                        <p className="text-green-700 text-xs leading-relaxed">Los cortes se realizan semanalmente y los pagos se transfieren a tu cuenta bancaria registrada en un máximo de 48 horas hábiles después del cierre.</p>
                    </div>
                    <div>
                        <p className="font-bold mb-1">¿Cómo subo un nuevo menú?</p>
                        <p className="text-green-700 text-xs leading-relaxed">Ve a la pestaña "Mis Menús" y haz clic en "Nuevo Platillo". Asegúrate de usar fotos reales y descripciones tentadoras.</p>
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

const CocineroPanel: React.FC = () => {
    const { user, updateAuthUser, logout } = useAuth();
    const [activeView, setActiveView] = useState('Mi Perfil');
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

    const handleResubmit = async () => {
        if (user) {
            const success = await resubmitForVerification(user.id);
            if (success) {
                updateAuthUser({ verificationStatus: 'pendiente_verificacion' });
                alert("Tus documentos han sido reenviados para verificación.");
            }
        }
    };

    if (user.verificationStatus !== 'aprobado') {
        const renderStatus = () => {
            switch (user.verificationStatus) {
                case 'pendiente_verificacion':
                    return (
                         <div className="bg-yellow-50 border-2 border-yellow-200 text-yellow-800 p-8 rounded-3xl shadow-lg max-w-2xl mx-auto mt-12 animate-fade-in">
                            <div className="text-5xl mb-6 text-center">⏳</div>
                            <h2 className="text-2xl font-black text-center uppercase tracking-tighter mb-4">Tu solicitud está en revisión</h2>
                            <p className="text-center text-sm leading-relaxed text-yellow-700">Estamos validando tus documentos con amor. Te notificaremos vía email cuando puedas empezar a publicar tus delicias.</p>
                        </div>
                    );
                case 'rechazado':
                    return (
                         <div className="bg-red-50 border-2 border-red-200 text-red-800 p-8 rounded-3xl shadow-lg max-w-2xl mx-auto mt-12 animate-fade-in">
                            <div className="text-5xl mb-6 text-center">🚫</div>
                            <h2 className="text-2xl font-black text-center uppercase tracking-tighter mb-4">Acción Requerida</h2>
                            <p className="text-center text-sm leading-relaxed mb-6 text-red-700">Hubo un problema con la verificación de tus documentos. Por favor, asegúrate de que sean legibles y vuelve a enviarlos.</p>
                             <div className="flex justify-center">
                                <Button onClick={handleResubmit} className="!bg-red-600 !text-white hover:!bg-red-700 !py-4 !px-8 !font-black uppercase tracking-widest shadow-xl">Reenviar Documentos</Button>
                             </div>
                        </div>
                    );
                default:
                    return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-10 w-10 border-4 border-green-700 border-t-transparent"></div></div>;
            }
        }
        return (
            <div className="container mx-auto px-4 py-12">
                <header className="flex justify-between items-center mb-12">
                    <h1 className="text-3xl font-black text-green-900 uppercase tracking-tighter">Portal Cocinero</h1>
                </header>
                {renderStatus()}
            </div>
        );
    }
    
    const navItems = [
        { name: 'Mi Perfil', icon: '👤' },
        { name: 'Mis Menús', icon: '🍲' },
        { name: 'Mis Pagos', icon: '💰' },
        { name: 'Mis Ventas', icon: '📈' },
        { name: 'Ayuda', icon: '❓' },
    ];
    
    const renderActiveView = () => {
        switch(activeView) {
            case 'Mi Perfil': return <PerfilCocinero />;
            case 'Mis Menús': return <MenusCocinero />;
            case 'Mis Pagos': return <PagosCocinero />;
            case 'Mis Ventas': return <VentasCocinero />;
            case 'Ayuda': return <AyudaView />;
            default: return <PerfilCocinero />;
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

                <div className="mb-10 text-center">
                    <h2 className="text-2xl font-black text-green-900 uppercase tracking-tighter">Cocina Hungers</h2>
                    <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest mt-1">Panel del Cocinero</p>
                </div>
                
                <nav className="flex-grow space-y-2">
                    {navItems.map(item => (
                        <button
                            key={item.name}
                            onClick={() => handleNavClick(item.name)}
                            className={`w-full flex items-center px-6 py-4 text-left rounded-2xl transition-all duration-300 group ${
                                activeView === item.name
                                ? 'bg-[#c1ff72] text-green-900 font-black shadow-lg'
                                : 'hover:bg-gray-50 text-green-800 font-medium'
                            }`}
                        >
                             <span className="mr-4 text-2xl group-hover:scale-125 transition-transform">{item.icon}</span>
                             <span className="truncate text-sm md:text-base uppercase tracking-widest">{item.name}</span>
                        </button>
                    ))}

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-6 py-4 text-left rounded-2xl transition-all text-red-600 hover:bg-red-50 mt-4 group"
                    >
                         <span className="mr-4 text-2xl group-hover:scale-125 transition-transform">🚪</span>
                         <span className="truncate text-sm md:text-base uppercase tracking-widest font-black">Cerrar Sesión</span>
                    </button>
                </nav>

                <div className="mt-auto pt-6 border-t border-gray-100 flex items-center gap-4 p-2 bg-gray-50 rounded-2xl">
                    <div className="w-10 h-10 rounded-full bg-green-900 text-[#c1ff72] flex items-center justify-center font-black">
                        {user.name.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-xs font-black text-green-900 truncate tracking-tight">{user.name}</p>
                        <p className="text-[10px] text-green-600 font-bold uppercase truncate">{user.specialty}</p>
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
                    <div className="text-green-900 font-black text-sm uppercase tracking-widest">Portal Cocinero</div>
                    <div className="w-10"></div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-10 lg:p-12">
                    <div className="max-w-6xl mx-auto">
                        {renderActiveView()}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CocineroPanel;
