import React, { useState, lazy, Suspense } from 'react';
import Sidebar from '../Sidebar.tsx';
import DashboardView from './DashboardView.tsx';
import CookVerification from './CookVerification.tsx';
import CategoryManagement from './CategoryManagement.tsx';
import CouponManagement from './CouponManagement.tsx';
import ClientManagement from './ClientManagement.tsx';
import OrdersManagement from './OrdersManagement.tsx';

// Importaciones dinámicas para optimizar la carga
const ProductManagement = lazy(() => import('./ProductManagement.tsx'));
const ImageGenerationIA = lazy(() => import('./ImageGeneration.tsx'));
const SiteHealth = lazy(() => import('./SiteHealth'));
const ReportesView = lazy(() => import('./ReportesView.tsx'));

const SuperAdminPanel: React.FC = () => {
    const [activeView, setActiveView] = useState('Dashboard');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    const navItems = [
        { name: 'Dashboard', icon: '📊' },
        { name: 'Pedidos Globales', icon: '🛒' },
        { name: 'Productos', icon: '📦' },
        { name: 'Cocineros', icon: '🧑‍🍳' },
        { name: 'Clientes', icon: '👤' },
        { name: 'Reportes', icon: '📈' },
        { name: 'Categorías', icon: '🏷️' },
        { name: 'Cupones', icon: '🎟️' },
        { name: 'Generador de Imágenes', icon: '🎨' },
        { name: 'Salud del Sitio', icon: '❤️‍🩹' },
    ];
    
    const renderActiveView = () => {
        switch(activeView) {
            case 'Dashboard': return <DashboardView />;
            case 'Pedidos Globales': return <OrdersManagement />;
            case 'Cocineros': return <CookVerification />;
            case 'Productos': return <ProductManagement />;
            case 'Categorías': return <CategoryManagement />;
            case 'Cupones': return <CouponManagement />;
            case 'Clientes': return <ClientManagement />;
            case 'Generador de Imágenes': return <ImageGenerationIA />;
            case 'Salud del Sitio': return <SiteHealth />;
            case 'Reportes': return <ReportesView />;
            default: return <DashboardView />;
        }
    };

    return (
        <div className="flex bg-[#f9fafb] min-h-screen relative overflow-hidden text-green-900">
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            <div className={`
                fixed inset-y-0 left-0 z-50 w-72 transition-transform duration-300 ease-in-out transform
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0 md:static md:inset-auto md:w-64 flex-shrink-0
            `}>
                <Sidebar 
                    navItems={navItems} 
                    activeView={activeView} 
                    setActiveView={setActiveView}
                    onClose={() => setIsMobileMenuOpen(false)}
                />
            </div>

            <main className="flex-1 flex flex-col w-full h-screen overflow-hidden">
                <header className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center flex-shrink-0">
                    <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-green-900 text-2xl">☰</button>
                    <div className="text-green-900 font-black text-xs uppercase tracking-widest">Admin Hungers</div>
                    <div className="w-10"></div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-10 bg-gray-50">
                    <div className="max-w-7xl mx-auto">
                        
                        {/* BOTÓN VOLVER DINÁMICO */}
                        {activeView !== 'Dashboard' && (
                            <button 
                                onClick={() => setActiveView('Dashboard')}
                                className="mb-6 flex items-center gap-2 text-green-700 hover:text-green-900 font-black uppercase text-[10px] tracking-[0.2em] bg-white px-5 py-3 rounded-full border border-gray-100 shadow-sm hover:shadow-md transition-all group animate-fade-in"
                            >
                                <span className="group-hover:-translate-x-1 transition-transform text-xs">←</span> 
                                Volver al Dashboard
                            </button>
                        )}

                        <Suspense fallback={
                            <div className="flex flex-col justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-700 border-t-transparent mb-4"></div>
                                <p className="text-green-700 font-black uppercase text-[10px] tracking-widest">Sincronizando sección...</p>
                            </div>
                        }>
                            {renderActiveView()}
                        </Suspense>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SuperAdminPanel;
