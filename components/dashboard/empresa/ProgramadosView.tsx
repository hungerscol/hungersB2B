
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../../contexts/AuthContext.tsx';
import { getRecurringOrdersByCompanyId, getEmployeesByCompanyId } from '../../../data.ts';
import { RecurringOrder, User } from '../../../types.ts';

const ProgramadosView: React.FC = () => {
    const { user } = useAuth();
    const [recurringOrders, setRecurringOrders] = useState<RecurringOrder[]>([]);
    const [employees, setEmployees] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const refreshData = async () => {
        if (user?.companyId) {
            setIsLoading(true);
            try {
                const [orders, emps] = await Promise.all([
                    getRecurringOrdersByCompanyId(user.companyId),
                    getEmployeesByCompanyId(user.companyId)
                ]);
                setRecurringOrders(orders);
                setEmployees(emps);
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
                <p className="text-green-700 font-bold">Actualizando calendario de entregas...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-green-900 uppercase tracking-tighter">Calendario de Entregas</h1>
                    <p className="text-green-700">Cronograma detallado de almuerzos para los próximos 14 días.</p>
                </div>
            </div>

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
        </div>
    );
};

export default ProgramadosView;
