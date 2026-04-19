
import React, { useState, useEffect, useMemo } from 'react';
import { User, MenuItem, Order } from '../../../types.ts';
import { getAllOrders, getMenuItemsByCookId, approveCook, rejectCook, updateUser, getAllClients } from '../../../data.ts';
import InitialsAvatar from './InitialsAvatar.tsx';
import Button from '../../Button';

interface CookDetailsModalProps {
    cook: User;
    onClose: () => void;
}

const formatCurrency = (price: number, currency: string) => {
    return new Intl.NumberFormat(currency === 'MXN' ? 'es-MX' : 'es-CO', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0
    }).format(price);
};

const CookDetailsModal: React.FC<CookDetailsModalProps> = ({ cook, onClose }) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [clients, setClients] = useState<User[]>([]);
    const [cookMenus, setCookMenus] = useState<MenuItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [feedback, setFeedback] = useState('');

    const [editData, setEditData] = useState({
        name: cook.name,
        specialty: cook.specialty || '',
        city: cook.city || '',
        phone: cook.phone || '',
        accountNumber: cook.accountNumber || ''
    });

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [allOrders, allClients, menus] = await Promise.all([
                    getAllOrders(),
                    getAllClients(),
                    getMenuItemsByCookId(cook.id)
                ]);
                setOrders(allOrders);
                setClients(allClients);
                setCookMenus(menus);
            } catch (error) {
                console.error("Error fetching cook details", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [cook.id]);

    const cookOrders = useMemo(() => {
        return orders.filter(order => 
            order.items.some(item => item.menuItem.cookId === cook.id)
        ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [orders, cook.id]);

    const handleUpdateProfile = async () => {
        setIsProcessing(true);
        setFeedback('');
        const success = await updateUser(cook.id, editData);
        if (success) {
            setFeedback('¡Perfil del cocinero actualizado!');
            setTimeout(() => setFeedback(''), 3000);
        } else {
            setFeedback('Error al actualizar el perfil.');
        }
        setIsProcessing(false);
    };

    const handleStatusChange = async (action: 'approve' | 'reject') => {
        setIsProcessing(true);
        const success = action === 'approve' ? await approveCook(cook.id) : await rejectCook(cook.id);
        if (success) onClose();
        setIsProcessing(false);
    };

    const inputStyles = "w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#c1ff72] focus:border-green-700 transition text-green-900 text-sm";

    if (isLoading) return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-y-auto animate-fade-in" onClick={e => e.stopPropagation()}>
                <div className="p-8 md:p-12">
                    <div className="flex justify-between items-start mb-8 border-b border-gray-100 pb-8">
                        <div className="flex items-center space-x-6">
                            <InitialsAvatar name={editData.name} />
                            <div>
                                <h2 className="text-3xl font-black text-green-900 uppercase tracking-tighter leading-none">{editData.name}</h2>
                                <div className="flex items-center gap-3 mt-2">
                                    <span className="text-green-700 font-bold uppercase text-[10px] tracking-widest">ID: {cook.id.slice(-6).toUpperCase()}</span>
                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${cook.verificationStatus === 'aprobado' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                                        {cook.verificationStatus}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-green-900 text-4xl leading-none">&times;</button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Panel Lateral: Información */}
                        <div className="lg:col-span-4 space-y-8">
                            <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
                                <h3 className="text-[10px] font-black text-green-700 uppercase tracking-[0.2em] mb-6 border-b border-gray-200 pb-2">Información del Perfil</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Nombre</label>
                                        <input value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} className={inputStyles} />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Especialidad</label>
                                        <input value={editData.specialty} onChange={e => setEditData({...editData, specialty: e.target.value})} className={inputStyles} />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Ciudad</label>
                                        <input value={editData.city} onChange={e => setEditData({...editData, city: e.target.value})} className={inputStyles} />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Teléfono</label>
                                        <input value={editData.phone} onChange={e => setEditData({...editData, phone: e.target.value})} className={inputStyles} />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Cuenta</label>
                                        <input value={editData.accountNumber} onChange={e => setEditData({...editData, accountNumber: e.target.value})} className={inputStyles} />
                                    </div>
                                    
                                    {feedback && <p className="text-[10px] font-bold text-green-600 text-center animate-bounce">{feedback}</p>}
                                    
                                    <Button onClick={handleUpdateProfile} disabled={isProcessing} className="w-full !py-3 shadow-xl !text-[10px] !font-black uppercase tracking-widest mt-4">
                                        {isProcessing ? 'Guardando...' : 'Actualizar Perfil'}
                                    </Button>
                                </div>
                            </div>

                            {/* Gestión de Estado */}
                            <div className="bg-green-900 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-[#c1ff72]/10 rounded-bl-full"></div>
                                <h3 className="text-sm font-black uppercase tracking-widest mb-6">Estado de Verificación</h3>
                                <div className="flex flex-col gap-4">
                                    {cook.verificationStatus !== 'aprobado' && (
                                        <Button onClick={() => handleStatusChange('approve')} disabled={isProcessing} className="w-full !bg-[#c1ff72] !text-green-900 !text-[10px]">Aprobar Cocinero</Button>
                                    )}
                                    {cook.verificationStatus !== 'rechazado' && (
                                        <Button onClick={() => handleStatusChange('reject')} disabled={isProcessing} variant="outline" className="w-full !border-red-400 !text-red-400 hover:!bg-red-400 hover:!text-white !text-[10px]">Rechazar / Bloquear</Button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Panel Principal: Pedidos y Catálogo */}
                        <div className="lg:col-span-8 space-y-12">
                            {/* Historial de Pedidos */}
                            <div>
                                <h3 className="text-xl font-black text-green-900 mb-6 uppercase tracking-tighter flex items-center gap-2">
                                    <span>🧾</span> Historial de Pedidos para este Cocinero
                                </h3>
                                <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm bg-gray-50">
                                    <table className="min-w-full divide-y divide-gray-200 text-xs">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="px-4 py-3 text-left font-black text-green-700 uppercase tracking-widest">Pedido / Entrega</th>
                                                <th className="px-4 py-3 text-left font-black text-green-700 uppercase tracking-widest">Cliente</th>
                                                <th className="px-4 py-3 text-left font-black text-green-700 uppercase tracking-widest">Total Cook</th>
                                                <th className="px-4 py-3 text-center font-black text-green-700 uppercase tracking-widest">Estado</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-100">
                                            {cookOrders.map(order => {
                                                const client = clients.find(c => c.id === order.userId);
                                                // Filtrar solo los items de este cocinero en este pedido
                                                const itemsOfThisCook = order.items.filter(i => i.menuItem.cookId === cook.id);
                                                const totalOfThisCook = itemsOfThisCook.reduce((sum, i) => sum + (i.menuItem.price * i.quantity), 0);
                                                const deliveryDate = itemsOfThisCook[0]?.menuItem.availableDate;

                                                return (
                                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-4 py-4">
                                                            <p className="font-bold text-green-900">#{order.id.slice(-6)}</p>
                                                            <p className="text-[10px] text-gray-400 uppercase mt-0.5">🚚 {deliveryDate ? new Date(deliveryDate + 'T00:00:00').toLocaleDateString() : 'No def.'}</p>
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <p className="font-bold text-green-900">{client?.name || 'N/A'}</p>
                                                            <p className="text-[10px] text-green-600">{client?.email || 'N/A'}</p>
                                                        </td>
                                                        <td className="px-4 py-4 font-black text-green-800">
                                                            {formatCurrency(totalOfThisCook, itemsOfThisCook[0]?.menuItem.currency || 'COP')}
                                                        </td>
                                                        <td className="px-4 py-4 text-center">
                                                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${order.status === 'pagado' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-yellow-50 text-yellow-700 border-yellow-100'}`}>
                                                                {order.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                            {cookOrders.length === 0 && (
                                                <tr><td colSpan={4} className="p-8 text-center text-gray-400 italic">No hay ventas registradas.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Catálogo de Productos */}
                            <div>
                                <h3 className="text-xl font-black text-green-900 mb-6 uppercase tracking-tighter flex items-center gap-2">
                                    <span>🍲</span> Catálogo de Platillos Activos
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {cookMenus.map(menu => (
                                        <div key={menu.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                                                <img src={menu.imageUrl} className="w-full h-full object-cover" alt={menu.name} />
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="font-bold text-green-900 text-sm truncate">{menu.name}</p>
                                                <p className="text-xs text-green-700 font-black">{formatCurrency(menu.price, menu.currency)}</p>
                                                <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mt-1">📅 {menu.availableDate || 'Diario'}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {cookMenus.length === 0 && <p className="text-gray-400 text-sm italic py-4">Este cocinero aún no tiene platillos en el catálogo.</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CookDetailsModal;
