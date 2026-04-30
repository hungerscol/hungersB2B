import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../contexts/AuthContext.tsx';
import { getOrdersByUserId, getEmployeesByCompanyId } from '../../../data.ts';
import { Order, User } from '../../../types.ts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Button from '../../Button';

const COLORS = ['#c1ff72', '#2c5234', '#6ee7b7', '#34d399', '#059669'];

const formatCurrency = (amount: number) => new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP', minimumFractionDigits: 0
}).format(amount);

const ReportesView: React.FC = () => {
    const { user } = useAuth();
    const [employees, setEmployees] = useState<User[]>([]);
    const [allOrders, setAllOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const reportRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.companyId) return;
            setIsLoading(true);
            try {
                const emps = await getEmployeesByCompanyId(user.companyId);
                setEmployees(emps);
                const ordersArrays = await Promise.all(emps.map(e => getOrdersByUserId(e.id)));
                setAllOrders(ordersArrays.flat());
            } catch (err) {
                console.error('Error cargando reportes:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const monthlyData = allOrders.reduce((acc: Record<string, number>, order) => {
        const month = new Date(order.date).toLocaleString('es-CO', { month: 'short', year: '2-digit' });
        acc[month] = (acc[month] || 0) + order.total;
        return acc;
    }, {});
    const monthlyChart = Object.entries(monthlyData).map(([month, total]) => ({ month, total }));

    const employeeData = employees.map(emp => {
        const empOrders = allOrders.filter(o => o.userId === emp.id);
        const total = empOrders.reduce((acc, o) => acc + o.total, 0);
        return { name: emp.name.split(' ')[0], total, pedidos: empOrders.length };
    }).filter(e => e.total > 0).sort((a, b) => b.total - a.total).slice(0, 5);

    const totalGasto = allOrders.reduce((acc, o) => acc + o.total, 0);
    const totalPedidos = allOrders.length;
    const promedioGasto = totalPedidos > 0 ? totalGasto / totalPedidos : 0;

    const handleDownload = async () => {
        if (!reportRef.current) return;
        setIsGenerating(true);
        try {
            const html2canvas = (await import('html2canvas')).default;
            const jsPDF = (await import('jspdf')).default;

            const canvas = await html2canvas(reportRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#f9fafb',
                logging: false,
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = pageWidth - 20;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let heightLeft = imgHeight;
            let position = 10;

            // Header
            pdf.setFillColor(44, 82, 52);
            pdf.rect(0, 0, pageWidth, 20, 'F');
            pdf.setTextColor(193, 255, 114);
            pdf.setFontSize(14);
            pdf.setFont('helvetica', 'bold');
            pdf.text('HUNGERS — Reporte Corporativo', 10, 13);
            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(9);
            pdf.text(new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' }), pageWidth - 10, 13, { align: 'right' });

            position = 25;

            // Agregar imagen del reporte
            if (imgHeight <= pageHeight - 30) {
                pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            } else {
                pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                heightLeft -= (pageHeight - position - 10);
                while (heightLeft > 0) {
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 10, -(imgHeight - heightLeft) - position + pageHeight, imgWidth, imgHeight);
                    heightLeft -= (pageHeight - 10);
                }
            }

            pdf.save(`reporte-hungers-${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (err) {
            console.error('Error generando PDF:', err);
            alert('Error al generar el PDF. Intenta de nuevo.');
        } finally {
            setIsGenerating(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin h-10 w-10 border-4 border-green-700 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black text-green-900 uppercase tracking-tighter">Reportes</h1>
                    <p className="text-green-700 text-sm mt-1">Resumen de consumo de tu equipo</p>
                </div>
                <Button
                    onClick={handleDownload}
                    variant="primary"
                    className="!py-3 !px-6 flex items-center gap-2"
                    disabled={isGenerating}
                >
                    {isGenerating ? '⏳ Generando...' : '⬇️ Descargar PDF'}
                </Button>
            </div>

            <div ref={reportRef} className="space-y-8 bg-gray-50 p-6 rounded-2xl">
                {/* Header del reporte */}
                <div className="bg-green-900 text-white p-6 rounded-2xl flex justify-between items-center">
                    <div>
                        <p className="text-[#c1ff72] font-black text-xs uppercase tracking-widest mb-1">Reporte Corporativo</p>
                        <h2 className="text-2xl font-black tracking-tighter">{user?.companyName || 'Mi Empresa'}</h2>
                    </div>
                    <p className="text-green-300 text-sm">{new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long' })}</p>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { label: 'Gasto Total', value: formatCurrency(totalGasto), icon: '💰' },
                        { label: 'Total Pedidos', value: String(totalPedidos), icon: '🧾' },
                        { label: 'Promedio por Pedido', value: formatCurrency(promedioGasto), icon: '📊' },
                    ].map((kpi, i) => (
                        <div key={i} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
                            <span className="text-2xl">{kpi.icon}</span>
                            <div>
                                <p className="text-[10px] font-black text-green-700 uppercase tracking-widest">{kpi.label}</p>
                                <p className="text-xl font-black text-green-900 tracking-tighter">{kpi.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Gasto mensual */}
                {monthlyChart.length > 0 && (
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-sm font-black text-green-900 uppercase tracking-tighter mb-4">Gasto Mensual</h2>
                        <div className="h-56">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyChart}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="month" tick={{ fontSize: 11, fontWeight: 'bold', fill: '#2c5234' }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 11, fill: '#2c5234' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                                    <Tooltip formatter={(v: number) => formatCurrency(v)} />
                                    <Bar dataKey="total" fill="#c1ff72" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {/* Top empleados */}
                {employeeData.length > 0 && (
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="text-sm font-black text-green-900 uppercase tracking-tighter mb-4">Top Consumo por Empleado</h2>
                            <div className="h-48">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={employeeData} dataKey="total" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                            {employeeData.map((_, index) => (
                                                <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(v: number) => formatCurrency(v)} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="text-sm font-black text-green-900 uppercase tracking-tighter mb-4">Detalle por Empleado</h2>
                            <div className="space-y-3">
                                {employeeData.map((emp, i) => (
                                    <div key={i} className="flex justify-between items-center py-1.5 border-b border-gray-50">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                                            <span className="font-bold text-green-900 text-sm">{emp.name}</span>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-green-900 text-sm">{formatCurrency(emp.total)}</p>
                                            <p className="text-[10px] text-green-600">{emp.pedidos} pedidos</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {allOrders.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
                        <p className="text-4xl mb-4">📊</p>
                        <p className="text-green-700 font-bold">Aún no hay pedidos registrados para generar el reporte.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReportesView;