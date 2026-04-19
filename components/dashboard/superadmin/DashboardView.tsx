
import React, { useState, useEffect } from 'react';
import { getAllOrders, getAllCooks, getAllClients, getAllCompanies, seedDatabase } from '../../../data.ts';
import { UserRole, Order, User } from '../../../types.ts';
import InitialsAvatar from './InitialsAvatar.tsx';
import Button from '../../Button';

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
    }).format(value);
};

const DashboardView: React.FC = () => {
    const [stats, setStats] = useState({
        totalSales: 0,
        allCooks: [] as User[],
        cookStatusCounts: { aprobado: 0, pendiente_verificacion: 0, rechazado: 0 },
        totalClients: 0,
        totalCompanies: 0,
        recentOrders: [] as Order[],
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSeeding, setIsSeeding] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        
        // Carga progresiva para evitar bloqueos
        const loadOrders = async () => {
            try {
                const orders = await getAllOrders();
                const totalSales = orders
                    .filter((o: Order) => o.status === 'pagado')
                    .reduce((acc: number, order: Order) => acc + (order.total || 0), 0);
                
                const recentOrders = [...orders].sort((a: Order, b: Order) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
                
                setStats(prev => ({
                    ...prev,
                    totalSales,
                    recentOrders
                }));
            } catch (e) {
                console.error("Error loading orders:", e);
            }
        };

        const loadCooks = async () => {
            try {
                const cooks = await getAllCooks();
                const cookStatusCounts = cooks.reduce((acc: any, cook: User) => {
                    const status = cook.verificationStatus || 'pendiente_verificacion';
                    if (status in acc) acc[status]++;
                    return acc;
                }, { aprobado: 0, pendiente_verificacion: 0, rechazado: 0 });
                
                setStats(prev => ({
                    ...prev,
                    allCooks: cooks,
                    cookStatusCounts
                }));
            } catch (e) {
                console.error("Error loading cooks:", e);
            }
        };

        const loadClients = async () => {
            try {
                const clients = await getAllClients();
                setStats(prev => ({
                    ...prev,
                    totalClients: clients.filter((c: User) => c.role === UserRole.Cliente).length
                }));
            } catch (e) {
                console.error("Error loading clients:", e);
            }
        };

        const loadCompanies = async () => {
            try {
                const companies = await getAllCompanies();
                setStats(prev => ({
                    ...prev,
                    totalCompanies: companies.length
                }));
            } catch (e) {
                console.error("Error loading companies:", e);
            }
        };

        await Promise.allSettled([loadOrders(), loadCooks(), loadClients(), loadCompanies()]);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSeed = async () => {
        if (!window.confirm("¿Inicializar base de datos con datos demo?")) return;
        
        setIsSeeding(true);
        try {
            await seedDatabase();
            alert("¡Éxito!");
            fetchData();
        } catch (e) {
            alert("Error al inicializar: " + e);
        } finally {
            setIsSeeding(false);
        }
    };

    const StatCard: React.FC<{ title: string; value: string; icon: string; subtitle?: string; }> = ({ title, value, icon, subtitle }) => (
        <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center space-x-4 border border-gray-100">
            <div className="bg-[#c1ff72] p-3 rounded-full"><span className="text-2xl">{icon}</span></div>
            <div>
                <p className="text-sm text-green-700">{title}</p>
                <p className="text-2xl font-bold text-green-900">{value}</p>
                {subtitle && <p className="text-xs text-green-600">{subtitle}</p>}
            </div>
        </div>
    );
    
    if (isLoading) return <div className="flex justify-center py-20"><div className="animate-spin h-10 w-10 border-4 border-green-700 border-t-transparent rounded-full"></div></div>;

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-black text-green-900 uppercase tracking-tighter">Dashboard Maestro</h1>
                <div className="flex gap-2">
                    <Button 
                        onClick={handleSeed} 
                        disabled={isSeeding}
                        variant="primary"
                        className="!text-[10px] !py-2 uppercase font-black tracking-widest shadow-lime"
                    >
                        {isSeeding ? "Sincronizando..." : "🔄 Sincronizar con Firebase"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Ventas Totales" value={formatCurrency(stats.totalSales || 0)} icon="💰" />
                <StatCard title="Cocineros" value={String(stats.allCooks.length)} icon="🧑‍🍳" subtitle={`${stats.cookStatusCounts.aprobado} activos`} />
                <StatCard title="Empresas" value={String(stats.totalCompanies)} icon="🏢" subtitle="Registradas" />
                <StatCard title="Clientes" value={String(stats.totalClients)} icon="👤" subtitle="Registrados" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                    <h2 className="text-xl font-black text-green-900 mb-6 uppercase tracking-tight flex items-center gap-2">
                        <span className="text-lg">🧾</span> Pedidos Recientes
                    </h2>
                    {stats.recentOrders.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="text-green-700 text-left border-b border-gray-100">
                                        <th className="py-4 font-black uppercase text-[10px] tracking-widest">Cliente</th>
                                        <th className="py-4 font-black uppercase text-[10px] tracking-widest">Total</th>
                                        <th className="py-4 font-black uppercase text-[10px] tracking-widest">Estado</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {stats.recentOrders.map((order: Order) => (
                                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="py-4 flex items-center">
                                                <InitialsAvatar name={`Cliente #${order.userId.slice(-4)}`} />
                                                <span className="ml-3 font-bold text-green-900">{`Cl-#${order.userId.slice(-4)}`}</span>
                                            </td>
                                            <td className="py-4 font-black text-green-800">
                                                {formatCurrency(order.total)}
                                            </td>
                                            <td className="py-4">
                                                <span className="px-3 py-1 bg-green-100 text-green-800 text-[9px] font-black rounded-full uppercase border border-green-200">
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-400 italic">No hay pedidos registrados.</p>
                        </div>
                    )}
                </div>
                
                <div className="bg-green-900 p-8 rounded-3xl shadow-xl text-white">
                    <h2 className="text-xl font-black mb-6 uppercase tracking-tight">Acciones Rápidas</h2>
                    <div className="space-y-4">
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                            <p className="text-[10px] font-black text-[#c1ff72] uppercase tracking-widest mb-1">Cuentas Demo</p>
                            <p className="text-xs text-green-200 leading-relaxed">cocinero@demo.com<br/>empresa@demo.com</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardView;
