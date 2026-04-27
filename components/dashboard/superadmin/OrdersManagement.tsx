import React, { useState, useEffect, useMemo } from 'react';
import { Order, User, MenuItem } from '../../../types.ts';
import { getAllOrders, getAllUsers, getAllCooks, getMenuItemsByLocation, addOrder } from '../../../data.ts';
import InitialsAvatar from './InitialsAvatar.tsx';

const OrdersManagement: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [clients, setClients] = useState<User[]>([]);
    const [cooksList, setCooksList] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>('todos');
    const [filterCook, setFilterCook] = useState<string>('todos');
    const [searchTerm, setSearchTerm] = useState('');
    const [showNewOrderModal, setShowNewOrderModal] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [ordersData, clientsData, cooksData] = await Promise.all([
                getAllOrders(),
                getAllUsers(),
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

    useEffect(() => {
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

    const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
        const styles: Record<string, string> = {
            pagado: 'bg-green-100 text-green-800 border-green-200',
            pendiente: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            rechazado: 'bg-red-100 text-red-800 border-red-200',
        };
        return (
            <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-full border ${styles[status] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                {status}
            </span>
        );
    };

    const NewOrderModal: React.FC = () => {
        const [selectedClient, setSelectedClient] = useState('');
        const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
        const [selectedItem, setSelectedItem] = useState('');
        const [quantity, setQuantity] = useState(1);
        const [notes, setNotes] = useState('');
        const [isSaving, setIsSaving] = useState(false);
        const [cartItems, setCartItems] = useState<{ menuItem: MenuItem; quantity: number }[]>([]);

        useEffect(() => {
            getMenuItemsByLocation('BOG').then(items => setMenuItems(items || []));
        }, []);

        const handleAddItem = () => {
            const item = menuItems.find(m => m.id === selectedItem);
            if (!item) return;
            const existing = cartItems.find(c => c.menuItem.id === item.id);
            if (existing) {
                setCartItems(cartItems.map(c => c.menuItem.id === item.id ? { ...c, quantity: c.quantity + quantity } : c));
            } else {
                setCartItems([...cartItems, { menuItem: item, quantity }]);
            }
        };

        const handleSubmit = async () => {
            if (!selectedClient || cartItems.length === 0) {
                alert('Selecciona un cliente y agrega al menos un producto.');
                return;
            }
            setIsSaving(true);
            try {
                await addOrder({
                    userId: selectedClient,
                    items: cartItems,
                    total: cartItems.reduce((acc, c) => acc + c.menuItem.price * c.quantity, 0),
                    date: new Date().toISOString(),
                    status: 'pagado',
                    notes: notes || 'Pedido por WhatsApp',
                } as any);
                await fetchData();
                setShowNewOrderModal(false);
                alert('Pedido creado exitosamente.');
            } catch (err) {
                alert('Error al crear el pedido.');
            } finally {
                setIsSaving(false);
            }
        };

        // Filtrar usuarios que pueden hacer pedidos (excluir SuperAdmin y Cocineros)
        const selectableUsers = clients.filter(c =>
            c.role === 'Cliente' || c.role === 'cliente' ||
            c.role === 'Admin Empresa' || c.role === 'AdminEmpresa'
        );

        return (
            <div className="fixed inset-0 bg-gray-400 bg-opacity-50 z-50 flex justify-center items-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-black text-green-900 uppercase tracking-tighter">Nuevo Pedido Manual</h2>
                        <button onClick={() => setShowNewOrderModal(false)} className="text-gray-400 text-2xl font-bold">&times;</button>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <label className="text-[10px] font-black text-green-700 uppercase tracking-widest block mb-1">Cliente / Empresa</label>
                            <select
                                value={selectedClient}
                                onChange={e => setSelectedClient(e.target.value)}
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-200"
                            >
                                <option value="">Seleccionar cliente...</option>
                                {selectableUsers.map(c => (
                                    <option key={c.id} value={c.id}>
                                        {c.name} — {c.email} {c.companyName ? `(${c.companyName})` : ''}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div className="col-span-2">
                                <label className="text-[10px] font-black text-green-700 uppercase tracking-widest block mb-1">Producto</label>
                                <select
                                    value={selectedItem}
                                    onChange={e => setSelectedItem(e.target.value)}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-200"
                                >
                                    <option value="">Seleccionar producto...</option>
                                    {menuItems.map(m => (
                                        <option key={m.id} value={m.id}>{m.name} — {formatCurrency(m.price)}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-green-700 uppercase tracking-widest block mb-1">Cantidad</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={quantity}
                                    onChange={e => setQuantity(parseInt(e.target.value) || 1)}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-200"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleAddItem}
                            disabled={!selectedItem}
                            className="bg-[#c1ff72] text-green-900 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-green-200 transition-all disabled:opacity-50"
                        >
                            + Agregar al Pedido
                        </button>

                        {cartItems.length > 0 && (
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <h4 className="text-[10px] font-black text-green-700 uppercase tracking-widest mb-3">Resumen del Pedido</h4>
                                {cartItems.map((c, i) => (
                                    <div key={i} className="flex justify-between text-sm py-1">
                                        <span>{c.quantity}x {c.menuItem.name}</span>
                                        <span className="font-bold">{formatCurrency(c.menuItem.price * c.quantity)}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between font-black text-green-900 text-lg pt-3 border-t mt-3">
                                    <span>Total</span>
                                    <span>{formatCurrency(cartItems.reduce((acc, c) => acc + c.menuItem.price * c.quantity, 0))}</span>
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="text-[10px] font-black text-green-700 uppercase tracking-widest block mb-1">Notas (opcional)</label>
                            <input
                                type="text"
                                value={notes}
                                onChange={e => setNotes(e.target.value)}
                                placeholder="Ej: Sin cebolla, pedido por WhatsApp"
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-200"
                            />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => setShowNewOrderModal(false)}
                                className="flex-1 border border-gray-200 text-gray-600 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isSaving}
                                className="flex-1 bg-green-700 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-green-900 transition-all disabled:opacity-50"
                            >
                                {isSaving ? 'Guardando...' : 'Crear Pedido'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
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
                    <button
                        onClick={() => setShowNewOrderModal(true)}
                        className="bg-[#c1ff72] text-green-900 px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-green-200 transition-all flex items-center gap-2"
                    >
                        📱 Nuevo Pedido WhatsApp
                    </button>

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
                    <div className="animate-spin h-10 w-10 border-4 border-green-700 border-t-transparent rounded-full mb-4"></div>
                    <p className="text-green-800 font-black uppercase tracking-widest text-[10px]">Consultando base de datos...</p>
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
                            {filteredOrders.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center text-gray-400 font-medium">
                                        No se encontraron pedidos.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {showNewOrderModal && <NewOrderModal />}
        </div>
    );
};

export default OrdersManagement;