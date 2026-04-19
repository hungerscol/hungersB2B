
import React, { useState, useEffect } from 'react';
import { User, Order, Company } from '../../../types.ts';
import { getAllClients, getOrdersByUserId, getAllCompanies } from '../../../data.ts';
import InitialsAvatar from './InitialsAvatar.tsx';

const ClientManagement: React.FC = () => {
    const [clients, setClients] = useState<User[]>([]);
    const [selectedClient, setSelectedClient] = useState<User | null>(null);
    const [clientOrders, setClientOrders] = useState<Order[]>([]);
    const [allCompanies, setAllCompanies] = useState<Company[]>([]);

    useEffect(() => {
        getAllClients().then(setClients);
        getAllCompanies().then(setAllCompanies);
    }, []);

    const handleViewDetails = (client: User) => {
        setSelectedClient(client);
        getOrdersByUserId(client.id).then(setClientOrders);
    };
    
    const formatCurrency = (price: number, currency: string = 'USD') => {
        const formatter = new Intl.NumberFormat(undefined, {
            style: 'currency',
            currency,
            minimumFractionDigits: 0
        });
        return formatter.format(price);
    }

    const ClientDetailsModal: React.FC = () => {
        if (!selectedClient) return null;
        const company = selectedClient.companyId ? allCompanies.find(c => c.id === selectedClient.companyId) : null;
        
        const OrderStatusBadge: React.FC<{ status: Order['status'] }> = ({ status }) => {
            const styles = {
                pagado: 'bg-green-100 text-green-800',
                pendiente: 'bg-yellow-100 text-yellow-800',
                rechazado: 'bg-red-100 text-red-800',
            };
            const text = {
                pagado: 'Pagado',
                pendiente: 'Pendiente',
                rechazado: 'Rechazado'
            }
            return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>{text[status]}</span>;
        };

        return (
            <div className="fixed inset-0 bg-gray-400 bg-opacity-50 z-50 flex justify-center items-center p-4">
                <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-green-900">Detalles del Cliente</h2>
                        <button onClick={() => setSelectedClient(null)} className="text-green-700 font-bold text-2xl">&times;</button>
                    </div>
                    <div className="mb-6 border-b pb-4">
                        <h3 className="text-lg font-semibold text-green-800 mb-2">Información del Cliente</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                             <p><strong>Nombre:</strong> {selectedClient.name}</p>
                             <p><strong>Email:</strong> {selectedClient.email}</p>
                             <p><strong>Teléfono:</strong> {selectedClient.phone || 'N/A'}</p>
                             <p><strong>Dirección (Ciudad/Zona):</strong> {selectedClient.city || 'N/A'}</p>
                             <p><strong>Empresa:</strong> {company ? company.name : 'Cliente Individual'}</p>
                             <p><strong>Registrado:</strong> {new Date(selectedClient.registrationDate).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <h3 className="text-xl font-bold mb-4">Historial de Pedidos</h3>
                    <div className="space-y-4">
                        {clientOrders.length > 0 ? clientOrders.map(order => (
                             <div key={order.id} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold">Pedido #{order.id}</p>
                                        <p className="text-sm text-green-700">{new Date(order.date).toLocaleString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-lg text-green-700">{formatCurrency(order.total, order.items[0]?.menuItem.currency || 'USD')}</p>
                                        <OrderStatusBadge status={order.status} />
                                    </div>
                                </div>
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                    <h4 className="font-semibold text-xs text-green-700 uppercase mb-2">Artículos del Pedido</h4>
                                    <ul className="text-sm space-y-1">
                                        {order.items.map((item, index) => (
                                            <li key={index} className="flex justify-between text-green-800">
                                                <span>{item.quantity} x {item.menuItem.name}</span>
                                                <span className="font-medium">{formatCurrency(item.menuItem.price * item.quantity, item.menuItem.currency)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )) : <p className="text-green-700">Este cliente aún no tiene pedidos.</p>}
                    </div>
                </div>
            </div>
        )
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <h1 className="text-3xl font-bold text-green-900 mb-6">Gestión de Clientes</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr className="border-b-2 border-gray-200">
                           <th className="px-5 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Nombre</th>
                           <th className="px-5 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Email</th>
                           <th className="px-5 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Ciudad</th>
                           <th className="px-5 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Fecha Registro</th>
                           <th className="px-5 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map(client => (
                            <tr key={client.id} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="px-5 py-4">
                                    <div className="flex items-center">
                                        <InitialsAvatar name={client.name} />
                                        <p className="ml-3 text-green-900 font-medium">{client.name}</p>
                                    </div>
                                </td>
                                <td className="px-5 py-4 text-sm text-green-700">{client.email}</td>
                                <td className="px-5 py-4 text-sm text-green-700">{client.city || 'N/A'}</td>
                                <td className="px-5 py-4 text-sm text-green-700">{new Date(client.registrationDate).toLocaleDateString()}</td>
                                <td className="px-5 py-4">
                                    <button onClick={() => handleViewDetails(client)} className="text-green-700 hover:text-green-900 font-semibold text-sm">Ver Detalles</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {selectedClient && <ClientDetailsModal />}
        </div>
    );
};

export default ClientManagement;
