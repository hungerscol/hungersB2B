import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../../contexts/AuthContext.tsx';
import { getRecurringOrdersByCompanyId, getEmployeesByCompanyId, getOrdersByUserId } from '../../../data.ts';
import { RecurringOrder, User, Order } from '../../../types.ts';

const formatCurrency = (amount: number) => new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP', minimumFractionDigits: 0
}).format(amount);

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const styles: Record<string, string> = {
        pagado: 'bg-green-100 text-green-800',
        pendiente: 'bg-yellow-100 text-yellow-800',
        programado: 'bg-blue-100 text-blue-800',
        rechazado: 'bg-red-100 text-red-800',
    };
    return (
        <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-full ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
            {status}
        </span>
    );
};

const ProgramadosView: React.FC = () => {
    const { user } = useAuth();
    const [recurringOrders, setRecurringOrders] = useState<RecurringOrder[]>([]);
    const [manualOrders, setManualOrders] = useState<Order[]>([]);
    const [employees, setEmployees] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'manual' | 'recurrentes'>('manual');

    const refreshData = async () => {
        if (user?.companyId || user?.id) {
            setIsLoading(true);
            try {
                const [orders, emps, recurring] = await Promise.all([
                    user.id ? getOrdersByUserId(user.id) : Promise.resolve([]),
                    user.companyId ? getEmployeesByCompanyId(user.companyId) : Promise.resolve([]),
                    user.companyId ? getRecurringOrdersByCompanyId(user.companyId) : Promise.resolve([]),
                ]);
                setManualOrders((orders || []).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
                setEmployees(emps);
                setRecurringOrders(recurring);
            } catch (e) {
                console.error("Error cargando programación", e);
            } finally {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        refreshData();
    }, [user]);

    const upcomingDeliveries = useMemo(() => {
        const projections: { date: Date, items: { employeeName: string, description: string }[] }[] = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < 14; i++) {
            const currentDay = new Date(today);
            currentDay.setDate(today.getDate() + i);
            const dayOfWeekMap: Record<number, string> = { 1: 'L', 2: 'M', 3: 'X', 4: 'J', 5: 'V' };
            const currentDayLetter = dayOfWeekMap[currentDay.getDay()];
            if (!currentDayLetter) continue;

            const dayDeliveries: { employeeName: string, description: string }[] = [];
            recurringOrders.forEach(order => {
                const startDate = new Date(order.startDate + 'T00:00:00');
                if (currentDay < startDate) return;
                let isDeliveryDay = false;
                if (order.frequency === 'Semanal' && order.daysOfWeek?.includes(currentDayLetter as any)) {
                    isDeliveryDay = true;
                } else if (order.frequency === 'Quincenal') {
                    const diffTime = currentDay.getTime() - startDate.getTime();
                    const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));
                    if (diffDays % 14 === 0) isDeliveryDay = true;
                } else if (order.frequency === 'Mensual') {
                    if (currentDay.getDate() === startDate.getDate()) isDeliveryDay = true;
                }
                if (isDeliveryDay) {
                    order.employeeIds.forEach(empId => {
                        const emp = employees.find(e => e.id === empId);
                        if (emp) {
                            dayDeliveries.push({ employeeName: emp.name, description: order.description });
                        }
                    });
                }
            });
            if (dayDeliveries.length > 0) {
                projections.push({ date: currentDay, items: dayDeliveries });
            }
        }
        return projections;
    }, [recurringOrders, employees]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                <div className="w-12 h-12 border-4 border-[#c1ff72] border-t-green-900 rounded-full animate-spin mb-4"></div>
                <p className="text-green-700 font-bold">Cargando pedidos...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-black text-green-900 uppercase tracking-tighter">Pedidos Programados</h1>
                <p className="text-green-700 text-sm mt-1">Historial y calendario de pedidos de tu empresa.</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-3 border-b border-gray-100 pb-0">
                <button
                    onClick={() => setActiveTab('manual')}
                    className={`px-5 py-3 text-xs font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === 'manual' ? 'border-green-700 text-green-900' : 'border-transparent text-gray-400'}`}
                >
                    📋 Mis Pedidos ({manualOrders.length})
                </button>
                <button
                    onClick={() => setActiveTab('recurrentes')}
                    className={`px-5 py-3 text-xs font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === 'recurrentes' ? 'border-green-700 text-green-900' : 'border-transparent text-gray-400'}`}
                >
                    🔄 Recurrentes ({recurringOrders.length})
                </button>
            </div>

            {/* Mis Pedidos */}
            {activeTab === 'manual' && (
                <div className="space-y-4">
                    {manualOrders.length === 0 ? (
                        <div className="bg-white p-12 rounded-3xl shadow-sm border-2 border-dashed border-gray-200 text-center">
                            <p className="text-4xl mb-4">🧾</p>
                            <p className="text-gray-400 italic">No hay pedidos registrados aún.</p>
                        </div>
                    ) : (
                        manualOrders.map(order => {
                            const items = order.items || [];
                            return (
                                <div key={order.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <p className="font-mono text-xs font-bold text-green-700">#{order.id.slice(-8).toUpperCase()}</p>
                                            <StatusBadge status={order.status} />
                                        </div>
                                        <p className="text-xs text-gray-400 mb-3">{new Date(order.date).toLocaleString('es-CO')}</p>
                                        {items.length > 0 && (
                                            <ul className="space-y-1">
                                                {items.map((item, i) => (
                                                    <li key={i} className="text-sm text-green-800">
                                                        {item.quantity}x {item.menuItem?.name || 'Producto'}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                        {(order as any).notes && (
                                            <p className="text-xs text-gray-500 mt-2 italic">📝 {(order as any).notes}</p>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-black text-green-900">{formatCurrency(order.total)}</p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}

            {/* Recurrentes */}
            {activeTab === 'recurrentes' && (
                <>
                    {upcomingDeliveries.length === 0 ? (
                        <div className="bg-white p-12 rounded-3xl shadow-sm border-2 border-dashed border-gray-200 text-center">
                            <div className="text-5xl mb-4 text-gray-200">🗓️</div>
                            <p className="text-gray-400 text-lg italic">No hay entregas programadas activas.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {upcomingDeliveries.map((delivery, idx) => (
                                <div key={idx} className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-50 flex flex-col group hover:shadow-2xl transition-all">
                                    <div className="bg-green-900 p-5 text-white flex justify-between items-center">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-[#c1ff72] mb-1">Próxima Entrega</p>
                                            <h3 className="text-lg font-bold capitalize">
                                                {delivery.date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="p-6 flex-grow">
                                        <ul className="space-y-4">
                                            {delivery.items.slice(0, 5).map((item, i) => (
                                                <li key={i} className="flex items-start gap-3">
                                                    <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-xs font-bold text-green-700 border border-gray-100">
                                                        {item.employeeName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-green-900 leading-tight">{item.employeeName}</p>
                                                        <p className="text-[10px] text-gray-500 uppercase font-medium">{item.description}</p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ProgramadosView;