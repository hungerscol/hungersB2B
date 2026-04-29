import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../contexts/AuthContext.tsx';
import { getEmployeesByCompanyId, getRecurringOrdersByCompanyId, getOrdersByUserId, getCompanyById } from '../../../data.ts';
import { User, Company, Order } from '../../../types.ts';
import Button from '../../Button';

import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';

const StatCard: React.FC<{ title: string; value: string; icon: string; children?: React.ReactNode; }> = ({ title, value, icon, children }) => (
    <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center justify-between border border-gray-100">
        <div className="flex items-center space-x-4">
            <div className="bg-[#c1ff72] p-4 rounded-full flex-shrink-0 flex items-center justify-center">
                <span className="text-3xl">{icon}</span>
            </div>
            <div>
                <p className="text-sm font-bold text-green-700 leading-tight">{title}</p>
                <p className="text-3xl font-black text-green-900 mt-1 tracking-tighter">{value}</p>
            </div>
        </div>
        <div className="flex flex-col gap-2">
            {children}
        </div>
    </div>
);

const BuyCreditsModal: React.FC<{ company: Company, user: User, onClose: () => void }> = ({ company, user, onClose }) => {
    const [amount, setAmount] = useState(100000);
    const currency = 'COP';

    const firstName = user.name.split(' ')[0] || 'Admin';
    const lastName = user.name.split(' ').slice(1).join(' ') || company.name;

    const inputStyles = "w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#c1ff72] focus:border-green-700 transition bg-white text-green-900 text-xl font-black shadow-sm";

    return (
        <div className="fixed inset-0 bg-white/40 backdrop-blur-xl z-[150] flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.1)] p-10 w-full max-w-lg animate-fade-in border border-gray-100" onClick={e => e.stopPropagation()}>
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-100">
                        <span className="text-4xl">💰</span>
                    </div>
                    <h2 className="text-3xl font-black text-green-900 uppercase tracking-tighter">Recargar Créditos</h2>
                    <p className="text-green-700 text-sm mt-2 font-medium">Define el presupuesto para el bienestar de tu equipo.</p>
                </div>

                <div className="space-y-8">
                    <div>
                        <label className="block text-[10px] font-black text-green-800 uppercase tracking-[0.2em] mb-3 ml-1">Monto a Recargar ({currency})</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={e => setAmount(Number(e.target.value))}
                            min="10000"
                            step="10000"
                            required
                            className={inputStyles}
                        />
                    </div>

                    <div className="pt-6 border-t border-gray-100">
                        <form method="post" action="https://merchantaavance.coopcentral.com.co/cartaspago/redirect" target="_top">
                            <input name="merchant_id" type="hidden" value="2099" />
                            <input name="form_id" type="hidden" value="16831" />
                            <input name="terminal_id" type="hidden" value="1510" />
                            <input name="order_number" type="hidden" value={`HG-CORP-${company.id}-${Date.now()}`} />
                            <input name="amount" type="hidden" value={Math.round(amount).toString()} />
                            <input name="currency" type="hidden" value={currency.toLowerCase()} />
                            <input name="order_description" type="hidden" value={`Compra de Créditos Hungers - ${company.name}`} />
                            <input name="color_base" type="hidden" value="#2c5234" />
                            <input name="client_email" type="hidden" value={user.email} />
                            <input name="client_phone" type="hidden" value={user.phone || '3000000000'} />
                            <input name="client_firstname" type="hidden" value={firstName} />
                            <input name="client_lastname" type="hidden" value={lastName} />
                            <input name="client_doctype" type="hidden" value="4" />
                            <input name="client_numdoc" type="hidden" value={user.nit || '1234567890'} />
                            <input name="response_url" type="hidden" value={window.location.origin} />

                            <div className="flex flex-col gap-4">
                                <input
                                    name="Submit"
                                    type="submit"
                                    className="w-full bg-[#de0c3e] text-white font-black py-5 px-8 rounded-full hover:bg-[#b00a31] transition-all transform hover:scale-105 cursor-pointer shadow-xl uppercase tracking-widest text-sm"
                                    value={`Ir a pagar ${new Intl.NumberFormat().format(amount)} ${currency}`}
                                />
                                <button type="button" onClick={onClose} className="text-green-700 text-xs font-black uppercase tracking-widest hover:text-green-900 transition-colors">Cancelar Operación</button>
                            </div>
                        </form>
                        <p className="text-[9px] text-gray-400 mt-8 uppercase font-bold tracking-widest text-center">Pasarela Segura certificada por Coopcentral</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface DashboardViewProps {
    onNavigate: (view: string) => void;
}

const DashboardView: React.FC<Partial<DashboardViewProps>> = ({ onNavigate = () => {} }) => {
    const { user } = useAuth();
    const [company, setCompany] = useState<Company | null>(null);
    const [employees, setEmployees] = useState<User[]>([]);
    const [recurringOrders, setRecurringOrders] = useState<any[]>([]);
    const [monthlyLunches, setMonthlyLunches] = useState(0);
    const [weeklyChartData, setWeeklyChartData] = useState<{ day: string; almuerzos: number }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);

    const fetchData = useCallback(async () => {
        if (user && user.companyId) {
            setIsLoading(true);
            try {
                const [comp, emps, recOrders] = await Promise.all([
                    getCompanyById(user.companyId),
                    getEmployeesByCompanyId(user.companyId),
                    getRecurringOrdersByCompanyId(user.companyId),
                ]);

                setCompany(comp || null);
                setEmployees(emps);
                setRecurringOrders(recOrders);

                const currentMonth = new Date().getMonth();
                const currentYear = new Date().getFullYear();
                const ordersPromises = emps.map(employee => getOrdersByUserId(employee.id));
                const allEmployeeOrders = await Promise.all(ordersPromises);
                const flatOrders = allEmployeeOrders.flat();

                // Contar almuerzos del mes
                const totalLunches = flatOrders.reduce((total: number, order: Order) => {
                    const orderDate = new Date(order.date);
                    if (orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear) {
                        return total + (order.items?.length || 0);
                    }
                    return total;
                }, 0);
                setMonthlyLunches(totalLunches);

                // Construir datos reales de la semana actual
                const today = new Date();
                const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
                const weekData: { day: string; almuerzos: number }[] = [];

                for (let i = 6; i >= 0; i--) {
                    const d = new Date(today);
                    d.setDate(today.getDate() - i);
                    const dayLabel = dayNames[d.getDay()];
                    const count = flatOrders.reduce((acc, order) => {
                        const od = new Date(order.date);
                        if (
                            od.getDate() === d.getDate() &&
                            od.getMonth() === d.getMonth() &&
                            od.getFullYear() === d.getFullYear()
                        ) {
                            return acc + (order.items?.length || 0);
                        }
                        return acc;
                    }, 0);
                    weekData.push({ day: dayLabel, almuerzos: count });
                }
                setWeeklyChartData(weekData);

            } catch (error) {
                console.error("Error al cargar datos del dashboard", error);
            } finally {
                setIsLoading(false);
            }
        }
    }, [user]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (!user || !user.companyId) return null;

    const formatCurrency = (amount: number) => new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(amount);

    if (isLoading || !company) {
        return (
            <div className="flex justify-center items-center h-64 p-8">
                <div className="animate-spin h-10 w-10 border-4 border-green-700 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <h1 className="text-3xl font-black text-green-900 uppercase tracking-tighter">Resumen Corporativo</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Créditos de la Empresa" value={formatCurrency(company?.totalCredits || 0)} icon="💰">
                    <Button
                        onClick={() => setIsBuyModalOpen(true)}
                        className="!text-[10px] !py-3 !px-5 !bg-[#c1ff72] !text-green-900 border-none shadow-xl hover:!bg-green-700 hover:!text-white transition-all transform hover:scale-105 font-black uppercase tracking-widest"
                    >
                        + Cargar Créditos
                    </Button>
                </StatCard>
                <StatCard title="Colaboradores Activos" value={String(employees.length)} icon="👥">
                    <Button onClick={() => onNavigate('Gestionar Empleados')} className="!text-[10px] !py-2 !px-4 uppercase font-black tracking-widest">Ver equipo</Button>
                </StatCard>
                <StatCard title="Almuerzos del Mes" value={String(monthlyLunches)} icon="🍲">
                    <Button onClick={() => onNavigate('Reportes')} className="!text-[10px] !py-2 !px-4 uppercase font-black tracking-widest">Ver detalle</Button>
                </StatCard>
            </div>

            {/* Gráfico con datos reales */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-xl font-black text-green-900 uppercase tracking-tighter">Consumo Últimos 7 Días</h2>
                        <p className="text-xs text-green-600 font-bold uppercase tracking-widest">Almuerzos por día — datos reales</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                        <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">En Vivo</span>
                    </div>
                </div>
                <div className="h-[260px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={weeklyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorLunches" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#c1ff72" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#c1ff72" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#2c5234' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#2c5234' }} allowDecimals={false} />
                            <Tooltip
                                contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                                formatter={(v: number) => [`${v} almuerzos`, 'Consumo']}
                            />
                            <Area type="monotone" dataKey="almuerzos" stroke="#2c5234" strokeWidth={3} fillOpacity={1} fill="url(#colorLunches)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-gray-100">
                    <h2 className="text-xl font-black text-green-900 mb-6 flex items-center uppercase tracking-tighter">
                        <span className="mr-3">📅</span> Próximas Entregas
                    </h2>
                    {recurringOrders.length > 0 ? (
                        <div className="space-y-4">
                            {recurringOrders.map(ro => (
                                <div key={ro.id} className="flex justify-between items-center p-5 bg-gray-50 rounded-2xl border border-gray-100 hover:border-green-200 transition-colors">
                                    <div>
                                        <p className="font-black text-green-900 uppercase tracking-tight leading-none">{ro.description}</p>
                                        <div className="flex gap-2 mt-2">
                                            <span className="text-[9px] font-black uppercase text-green-700 bg-green-100 px-2 py-0.5 rounded-md">{ro.frequency}</span>
                                            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{ro.employeeIds.length} Colaboradores</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Próxima</p>
                                        <p className="text-sm font-black text-green-800">{new Date(ro.startDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
                            <p className="text-green-700 font-bold italic">No hay pedidos programados.</p>
                            <button onClick={() => onNavigate('Pedidos Recurrentes')} className="text-[10px] font-black text-green-600 uppercase mt-4 underline tracking-widest">Configurar mi primera rutina</button>
                        </div>
                    )}
                </div>

                <div className="bg-green-700 p-10 rounded-[2.5rem] shadow-xl text-white flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-[#c1ff72]/10 rounded-bl-full"></div>
                    <h2 className="text-2xl font-black mb-4 flex items-center uppercase tracking-tighter leading-none">
                        <span className="mr-3">🚀</span> Gestión Ágil
                    </h2>
                    <p className="text-green-100 text-base mb-8 leading-relaxed font-medium">Optimiza el bienestar de tu equipo asignando beneficios de alimentación en segundos.</p>
                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => onNavigate('Gestionar Empleados')} className="p-5 bg-white/10 rounded-2xl hover:bg-white/20 transition-all text-left border border-white/10 group">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 group-hover:text-[#c1ff72] transition-colors">Personal</p>
                            <p className="text-sm font-bold opacity-80">Asignar Créditos</p>
                        </button>
                        <button onClick={() => onNavigate('Pedidos Recurrentes')} className="p-5 bg-white/10 rounded-2xl hover:bg-white/20 transition-all text-left border border-white/10 group">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 group-hover:text-[#c1ff72] transition-colors">Logística</p>
                            <p className="text-sm font-bold opacity-80">Programar Rutina</p>
                        </button>
                    </div>
                </div>
            </div>

            {isBuyModalOpen && company && user && (
                <BuyCreditsModal
                    company={company}
                    user={user}
                    onClose={() => setIsBuyModalOpen(false)}
                />
            )}
        </div>
    );
};

export default DashboardView;