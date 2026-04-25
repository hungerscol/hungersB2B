
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuItem, Order, User, PaymentMethod, LocationCode } from '../../../types.ts';
import { useLocation } from '../../../contexts/LocationContext.tsx';
import { getOrdersByUserId, updateUser, getMenuItemsByLocation } from '../../../data.ts';
import { useAuth } from '../../../contexts/AuthContext.tsx';
import MenuItemCard from './MenuItemCard.tsx';
import MenuItemModal from './MenuItemModal.tsx';
import Button from '../../Button';
import AddPaymentMethodModal from './AddPaymentMethodModal.tsx';

const formatCurrency = (price: number, currency: string) => {
    return new Intl.NumberFormat(currency === 'COP' ? 'es-CO' : 'es-MX', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0
    }).format(price);
};

const CreditBalance: React.FC<{ user: User }> = ({ user }) => {
    if (typeof user.credits !== 'number') return null;
    const currency = 'COP';
    return (
        <div className="bg-[#c1ff72] p-6 rounded-2xl text-center mb-8 shadow-md border-b-4 border-green-700 transform hover:scale-105 transition-transform">
            <p className="text-[10px] text-green-800 font-black uppercase tracking-[0.2em] mb-1">Tu Saldo Actual</p>
            <p className="text-3xl font-black text-green-900 tracking-tighter">{formatCurrency(user.credits, currency)}</p>
        </div>
    );
};

const MenuView: React.FC = () => {
    const { location } = useLocation();
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        getMenuItemsByLocation(location)
            .then((items: MenuItem[]) => setMenuItems(items))
            .finally(() => setIsLoading(false));
    }, [location]);


    return (
        <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-2">
                <div>
                    <h1 className="text-3xl font-black text-green-900 tracking-tighter uppercase">Sazón de Hoy</h1>
                    <p className="text-green-700 text-sm">Explora los platillos en tu región.</p>
                </div>
            </div>
            
            {isLoading ? (
                <div className="flex flex-col justify-center items-center h-64">
                  <div className="animate-spin h-10 w-10 border-4 border-green-700 border-t-transparent rounded-full mb-4"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {menuItems.map((item: MenuItem) => (
                        <MenuItemCard key={item.id} item={item} onVerMas={() => setSelectedItem(item)} />
                    ))}
                </div>
            )}

            {selectedItem && (
                <MenuItemModal 
                    item={selectedItem} 
                    onClose={() => setSelectedItem(null)} 
                    isGuestMode={false}
                />
            )}
        </div>
    );
};

const PerfilView: React.FC = () => {
    const { user, updateAuthUser } = useAuth();
    const [formData, setFormData] = useState({ name: '', phone: '', city: '' });
    const [feedback, setFeedback] = useState('');

    useEffect(() => {
        if (user) {
            setFormData({ name: user.name, phone: user.phone || '', city: user.city || '' });
        }
    }, [user]);

    if (!user) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        await updateUser(user.id, formData);
        updateAuthUser(formData);
        setFeedback('¡Perfil actualizado!');
    } catch (err) {
        setFeedback('Error al guardar.');
    }
    setTimeout(() => setFeedback(''), 3000);
};
    
    const inputStyles = "w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#c1ff72] focus:border-green-700 transition bg-white text-green-900 shadow-sm";

    return (
        <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-xl max-w-lg mx-auto animate-fade-in border border-gray-100">
            <h2 className="text-3xl font-black text-green-900 mb-8 uppercase tracking-tighter">Mi Perfil</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-[10px] font-black text-green-700 uppercase tracking-widest mb-1 ml-1">Nombre Completo</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputStyles} />
                </div>
                <div>
                    <label className="block text-[10px] font-black text-green-700 uppercase tracking-widest mb-1 ml-1">Teléfono</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={inputStyles} />
                </div>
                <div>
                    <label className="block text-[10px] font-black text-green-700 uppercase tracking-widest mb-1 ml-1">Zona</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} className={inputStyles} />
                </div>
                {feedback && <p className="text-center text-sm text-green-600 font-bold">{feedback}</p>}
                <div className="pt-4">
                    <Button type="submit" variant="primary" className="w-full !py-4 shadow-xl !font-black uppercase tracking-widest">Guardar</Button>
                </div>
            </form>
        </div>
    );
};

const HistorialPedidosView: React.FC = () => {
    const { user } = useAuth();
    const { location } = useLocation();
    const [orders, setOrders] = useState<Order[]>([]);
    
    useEffect(() => {
        if (user) {
            getOrdersByUserId(user.id).then(userOrders => {
                const sorted = userOrders.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                setOrders(sorted);
            });
        }
    }, [user]);

    const OrderStatusBadge: React.FC<{ status: Order['status'] }> = ({ status }) => {
        const styles = { 
            pagado: 'bg-green-100 text-green-800', 
            pendiente: 'bg-yellow-100 text-yellow-800', 
            rechazado: 'bg-red-100 text-red-800' 
        };
        return <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-full ${styles[status]}`}>{status}</span>;
    };

    return (
        <div className="animate-fade-in max-w-4xl mx-auto">
            <h2 className="text-3xl font-black text-green-900 mb-8 uppercase tracking-tighter">Mis Pedidos</h2>
            <div className="space-y-6">
                {orders.length > 0 ? orders.map((order: Order) => (
                    <div key={order.id} className="bg-white p-6 md:p-8 rounded-3xl shadow-lg border border-gray-100 flex flex-col md:flex-row gap-6">
                        <div className="flex-1">
                            <p className="text-sm text-green-700 font-black uppercase">Pedido #{order.id.slice(-6).toUpperCase()}</p>
                            <p className="text-xs text-gray-500">{new Date(order.date).toLocaleString()}</p>
                            <div className="mt-4">
                                {order.items.map((item, i) => (
                                    <p key={i} className="text-sm font-bold text-green-900">{item.quantity}x {item.menuItem.name}</p>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col items-end justify-center min-w-[150px]">
                            <p className="font-black text-2xl text-green-900">{formatCurrency(order.total, order.items[0]?.menuItem.currency || 'COP')}</p>
                            <OrderStatusBadge status={order.status} />
                        </div>
                    </div>
                )) : <p className="text-center py-20 text-gray-400">Sin pedidos.</p>}
            </div>
        </div>
    );
};

const ClientePanel: React.FC = () => {
    const [activeView, setActiveView] = useState('Menú');
    const { user } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    if (!user) return null;

    const navItems = [
        { name: 'Menú', icon: '🍲' },
        { name: 'Mis Pedidos', icon: '🧾' },
        { name: 'Mi Perfil', icon: '👤' },
    ];

    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const renderActiveView = () => {
        switch(activeView) {
            case 'Menú': return <MenuView />;
            case 'Mi Perfil': return <PerfilView />;
            case 'Mis Pedidos': return <HistorialPedidosView />;
            default: return <MenuView />;
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
                md:translate-x-0 md:static md:inset-auto md:w-80 h-full
            `}>
                <CreditBalance user={user} />
                <nav className="flex-grow space-y-1">
                    {navItems.map((item) => (
                        <button
                            key={item.name}
                            onClick={() => handleNavClick(item.name)}
                            className={`w-full flex items-center px-6 py-4 text-left rounded-2xl transition-all ${
                                activeView === item.name
                                ? 'bg-[#c1ff72] text-green-900 font-black'
                                : 'hover:bg-gray-50 text-green-800'
                            }`}
                        >
                             <span className="mr-4 text-2xl">{item.icon}</span>
                             <span className="truncate text-sm uppercase tracking-widest">{item.name}</span>
                        </button>
                    ))}
                    
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-6 py-4 text-left rounded-2xl transition-all text-red-600 hover:bg-red-50 mt-4"
                    >
                         <span className="mr-4 text-2xl">🚪</span>
                         <span className="truncate text-sm uppercase tracking-widest font-black">Cerrar Sesión</span>
                    </button>
                </nav>
            </aside>

            <main className="flex-1 overflow-hidden flex flex-col">
                <header className="md:hidden flex justify-between items-center bg-white p-4 border-b border-gray-200">
                    <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-green-900 text-2xl">☰</button>
                    <div className="text-green-900 font-black">Dashboard</div>
                    <div className="w-10"></div>
                </header>
                <div className="flex-1 overflow-y-auto p-4 md:p-10">
                    <div className="max-w-6xl mx-auto">{renderActiveView()}</div>
                </div>
            </main>
        </div>
    );
};

export default ClientePanel;
