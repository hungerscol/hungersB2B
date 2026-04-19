
import React, { useState, useEffect, useMemo } from 'react';
import { Order, User } from '../../../types.ts';
import { getAllOrders, getAllClients, getAllCooks } from '../../../data.ts';
import InitialsAvatar from './InitialsAvatar.tsx';

const OrdersManagement: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [clients, setClients] = useState<User[]>([]);
    const [cooksList, setCooksList] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>('todos');
    const [filterCook, setFilterCook] = useState<string>('todos');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [ordersData, clientsData, cooksData] = await Promise.all([
                    getAllOrders(),
                    getAllClients(),
                    getAllCooks()
                ]);
                setOrders(ordersData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
                setClients(clientsData);
                setCooksList(cooksData);
            } catch (error) {
                console.error("Error cargando datos administrativos:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const formatCurrency = (price: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(price);
    };

    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const matchesStatus = filterStatus === 'todos' || order.status === filterStatus;
            
            // Filtro por cocinero: verifica si algún ítem del pedido pertenece al cocinero seleccionado
            const matchesCook = filterCook === 'todos' || 
                               order.items.some(item => item.menuItem.cookId === filterCook);
            
            const client = clients.find(c => c.id === order.userId);
            const clientName = client?.name || '';
            const clientEmail = client?.email || '';

            const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                 clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 clientEmail.toLowerCase().includes(searchTerm.toLowerCase());

            return matchesStatus && matchesCook && matchesSearch;
        });
    }, [orders, filterStatus, filterCook, searchTerm, clients]);

    const StatusBadge: React.FC<{ status: Order['status'] }> = ({ status }) => {
        const styles = {
            pagado: 'bg-green-100 text-green-800 border-green-200',
            pendiente: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            rechazado: 'bg-red-100 text-red-800 border-red-200',
        };
        return (
            <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-full border ${styles[status]}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="bg-white rounded-[2.5rem] shadow-xl p-8 border border-gray-100 animate-fade-in">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
                <div>
                    <h1 className="text-3xl font-black text-green-900 uppercase tracking-tighter leading-none">Gestión de Pedidos</h1>
                    <p className="text-green-700 mt-2 text-sm">Control logístico por cocinero y cliente.</p>
                </div>
                
                <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                    <select 
                        value={filterCook}
                        onChange={(e) => setFilterCook(e.target.value)}
                        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-[10px] font-black uppercase text-green-900 outline-none focus:ring-2 focus:ring-[#c1ff72]"
                    >
                        <option value="todos">Todos los Cocineros</option>
                        {cooksList.map(cook => (
                            <option key={cook.id} value={cook.id}>{cook.name}</option>
                        ))}
                    </select>

                    <div className="relative flex-grow lg:flex-grow-0">
                        <input 
                            type="text" 
                            placeholder="Buscar cliente..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full lg:w-64 pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#c1ff72] outline-none"
                        />
                        <span className="absolute left-3 top-2.5 opacity-30">🔍</span>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="py-20 text-center flex flex-col items-center">
                    <div className="spinner"></div>
                    <p className="text-green-800 font-black uppercase tracking-widest text-[10px] mt-4">Consultando base de datos...</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-3xl border border-gray-50">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-green-700 uppercase tracking-widest">Orden</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-green-700 uppercase tracking-widest">Cliente</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-green-700 uppercase tracking-widest">Cocinero / Entrega</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-green-700 uppercase tracking-widest">Total</th>
                                <th className="px-6 py-4 text-center text-[10px] font-black text-green-700 uppercase tracking-widest">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-50 text-sm">
                            {filteredOrders.map(order => {
                                const client = clients.find(c => c.id === order.userId);
                                const orderCooks = Array.from(new Set(order.items.map(item => item.menuItem.cookName || 'Chef Hungers')));
                                const deliveryDate = order.items[0]?.menuItem.availableDate;
                                
                                return (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-5">
                                            <p className="font-mono text-[10px] text-green-900 font-bold uppercase">#{order.id.slice(-8)}</p>
                                            <p className="text-[10px] text-gray-400 mt-1">{new Date(order.date).toLocaleDateString()}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center">
                                                <InitialsAvatar name={client?.name || 'Invitado'} />
                                                <div className="ml-3">
                                                    <p className="font-bold text-green-900 leading-none">{client?.name || 'Invitado'}</p>
                                                    <p className="text-[10px] text-green-600 mt-1">{client?.email || 'S/N'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="space-y-1">
                                                {orderCooks.map((cook, i) => (
                                                    <p key={i} className="text-xs font-bold text-green-800">{cook}</p>
                                                ))}
                                                <p className="text-[10px] font-black text-green-500 uppercase mt-1">
                                                    🚚 {deliveryDate ? new Date(deliveryDate + 'T00:00:00').toLocaleDateString() : 'Pendiente'}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="font-black text-green-900">{formatCurrency(order.total)}</p>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <StatusBadge status={order.status} />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default OrdersManagement;
