import React, { useState, useEffect } from 'react';
import { User, Order, Company } from '../../../types.ts';
import { getAllClients, getOrdersByUserId, getAllCompanies, getEmployeesByCompanyId } from '../../../data.ts';
import InitialsAvatar from './InitialsAvatar.tsx';

type FilterType = 'todos' | 'individuales' | 'empresas';

const ClientManagement: React.FC = () => {
    const [clients, setClients] = useState<User[]>([]);
    const [selectedClient, setSelectedClient] = useState<User | null>(null);
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const [clientOrders, setClientOrders] = useState<Order[]>([]);
    const [allCompanies, setAllCompanies] = useState<Company[]>([]);
    const [filter, setFilter] = useState<FilterType>('todos');
    const [searchTerm, setSearchTerm] = useState('');
    const [companyEmployees, setCompanyEmployees] = useState<User[]>([]);
    const [view, setView] = useState<'clientes' | 'empresas'>('clientes');

    useEffect(() => {
        getAllClients().then(data => setClients(data || []));
        getAllCompanies().then(data => setAllCompanies(data || []));
    }, []);

    const handleViewDetails = (client: User) => {
        setClientOrders([]);
        setSelectedClient(client);
        setSelectedCompany(null);
        getOrdersByUserId(client.id).then(orders => setClientOrders(orders || []));
    };

    const handleViewCompany = async (company: Company) => {
        setSelectedCompany(company);
        setSelectedClient(null);
        const emps = await getEmployeesByCompanyId(company.id);
        setCompanyEmployees(emps);
    };

    const handleGenerateInvoice = async (company: Company) => {
        const invoice = {
            companyId: company.id,
            companyName: company.name,
            amount: (company as any).totalCredits || 0,
            date: new Date().toISOString(),
            status: 'pendiente',
            number: `HG-${Date.now()}`,
        };
        try {
            // TODO: Integrar con Siigo API
            alert(`Factura ${invoice.number} generada para ${company.name}. Integración con Siigo pendiente de configurar.`);
        } catch (err) {
            alert('Error al generar factura.');
        }
    };

    const formatCurrency = (price: number, currency: string = 'COP') => {
        try {
            return new Intl.NumberFormat('es-CO', { style: 'currency', currency, minimumFractionDigits: 0 }).format(price);
        } catch {
            return `$${price}`;
        }
    };

    const filteredClients = clients.filter(client => {
        const matchesSearch = client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.email?.toLowerCase().includes(searchTerm.toLowerCase());
        if (filter === 'empresas') return matchesSearch && !!client.companyId;
        if (filter === 'individuales') return matchesSearch && !client.companyId;
        return matchesSearch;
    });

    const OrderStatusBadge: React.FC<{ status: string }> = ({ status }) => {
        const styles: Record<string, string> = {
            pagado: 'bg-green-100 text-green-800',
            pendiente: 'bg-yellow-100 text-yellow-800',
            rechazado: 'bg-red-100 text-red-800',
        };
        return (
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
                {status}
            </span>
        );
    };

    const ClientDetailsModal: React.FC = () => {
        if (!selectedClient) return null;
        const company = selectedClient.companyId
            ? allCompanies.find(c => c.id === selectedClient.companyId)
            : null;
        return (
            <div className="fixed inset-0 bg-gray-400 bg-opacity-50 z-50 flex justify-center items-center p-4">
                <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-green-900">Detalles del Cliente</h2>
                        <button onClick={() => setSelectedClient(null)} className="text-green-700 font-bold text-2xl">&times;</button>
                    </div>
                    <div className="mb-6 border-b pb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                            <p><strong>Nombre:</strong> {selectedClient.name}</p>
                            <p><strong>Email:</strong> {selectedClient.email}</p>
                            <p><strong>Teléfono:</strong> {(selectedClient as any).phone || 'N/A'}</p>
                            <p><strong>Ciudad:</strong> {(selectedClient as any).city || 'N/A'}</p>
                            <p><strong>Empresa:</strong> {company ? company.name : 'Cliente Individual'}</p>
                            <p><strong>Registrado:</strong> {new Date(selectedClient.registrationDate).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <h3 className="text-xl font-bold mb-4">Historial de Pedidos</h3>
                    <div className="space-y-4">
                        {clientOrders.length > 0 ? clientOrders.map(order => {
                            const items = order.items || [];
                            const currency = items[0]?.menuItem?.currency || 'COP';
                            return (
                                <div key={order.id} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold">Pedido #{order.id.slice(-6)}</p>
                                            <p className="text-sm text-green-700">{new Date(order.date).toLocaleString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-lg text-green-700">{formatCurrency(order.total, currency)}</p>
                                            <OrderStatusBadge status={order.status} />
                                        </div>
                                    </div>
                                    {items.length > 0 && (
                                        <ul className="mt-3 pt-3 border-t text-sm space-y-1">
                                            {items.map((item, index) => (
                                                <li key={index} className="flex justify-between text-green-800">
                                                    <span>{item.quantity} x {item.menuItem?.name || 'Producto'}</span>
                                                    <span>{formatCurrency((item.menuItem?.price || 0) * item.quantity, item.menuItem?.currency || 'COP')}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            );
                        }) : <p className="text-green-700">Este cliente aún no tiene pedidos.</p>}
                    </div>
                </div>
            </div>
        );
    };

    const CompanyDetailsModal: React.FC = () => {
        if (!selectedCompany) return null;
        return (
            <div className="fixed inset-0 bg-gray-400 bg-opacity-50 z-50 flex justify-center items-center p-4">
                <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-green-900">{selectedCompany.name}</h2>
                        <button onClick={() => setSelectedCompany(null)} className="text-green-700 font-bold text-2xl">&times;</button>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-6 border-b pb-4">
                        <p className="text-sm"><strong>NIT:</strong> {(selectedCompany as any).nit || 'N/A'}</p>
                        <p className="text-sm"><strong>Email:</strong> {(selectedCompany as any).contactEmail || 'N/A'}</p>
                        <p className="text-sm"><strong>Créditos:</strong> {formatCurrency((selectedCompany as any).totalCredits || 0)}</p>
                        <p className="text-sm"><strong>Empleados:</strong> {companyEmployees.length}</p>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-green-900">Empleados</h3>
                        <button
                            onClick={() => handleGenerateInvoice(selectedCompany)}
                            className="bg-green-700 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-green-900 transition-all"
                        >
                            🧾 Generar Factura
                        </button>
                    </div>
                    <div className="space-y-2">
                        {companyEmployees.length > 0 ? companyEmployees.map(emp => (
                            <div key={emp.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <InitialsAvatar name={emp.name} />
                                    <div>
                                        <p className="font-semibold text-sm text-green-900">{emp.name}</p>
                                        <p className="text-xs text-green-600">{emp.email}</p>
                                    </div>
                                </div>
                                <p className="text-sm font-bold text-green-700">{formatCurrency(emp.credits || 0)}</p>
                            </div>
                        )) : <p className="text-green-600 text-sm">Sin empleados registrados.</p>}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <h1 className="text-3xl font-bold text-green-900">Gestión de Clientes</h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => setView('clientes')}
                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${view === 'clientes' ? 'bg-[#c1ff72] text-green-900' : 'bg-gray-100 text-gray-500'}`}
                    >
                        👤 Clientes
                    </button>
                    <button
                        onClick={() => setView('empresas')}
                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${view === 'empresas' ? 'bg-[#c1ff72] text-green-900' : 'bg-gray-100 text-gray-500'}`}
                    >
                        🏢 Empresas
                    </button>
                </div>
            </div>

            {view === 'clientes' && (
                <>
                    <div className="flex flex-col sm:flex-row gap-3 mb-6">
                        <input
                            type="text"
                            placeholder="Buscar por nombre o email..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-200 outline-none"
                        />
                        <div className="flex gap-2">
                            {(['todos', 'individuales', 'empresas'] as FilterType[]).map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-3 py-2 rounded-xl text-xs font-black uppercase transition-all ${filter === f ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-500'}`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="border-b-2 border-gray-200">
                                    <th className="px-5 py-3 text-left text-xs font-semibold text-green-700 uppercase">Nombre</th>
                                    <th className="px-5 py-3 text-left text-xs font-semibold text-green-700 uppercase">Email</th>
                                    <th className="px-5 py-3 text-left text-xs font-semibold text-green-700 uppercase">Tipo</th>
                                    <th className="px-5 py-3 text-left text-xs font-semibold text-green-700 uppercase">Fecha Registro</th>
                                    <th className="px-5 py-3 text-left text-xs font-semibold text-green-700 uppercase">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredClients.map(client => (
                                    <tr key={client.id} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center">
                                                <InitialsAvatar name={client.name} />
                                                <p className="ml-3 text-green-900 font-medium">{client.name}</p>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-sm text-green-700">{client.email}</td>
                                        <td className="px-5 py-4">
                                            <span className={`px-2 py-1 text-xs font-black rounded-full ${client.companyId ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                                                {client.companyId ? 'Empresa' : 'Individual'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-sm text-green-700">{new Date(client.registrationDate).toLocaleDateString()}</td>
                                        <td className="px-5 py-4">
                                            <button onClick={() => handleViewDetails(client)} className="text-green-700 hover:text-green-900 font-semibold text-sm">Ver Detalles</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredClients.length === 0 && (
                            <p className="text-center py-10 text-gray-400">No se encontraron clientes.</p>
                        )}
                    </div>
                </>
            )}

            {view === 'empresas' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {allCompanies.map(company => (
                        <div key={company.id} className="bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:border-green-200 transition-all">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-green-700 text-[#c1ff72] rounded-xl flex items-center justify-center font-black">
                                    {company.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-black text-green-900 text-sm">{company.name}</p>
                                    <p className="text-xs text-green-600">{(company as any).contactEmail || 'Sin email'}</p>
                                </div>
                            </div>
                            <p className="text-xs text-green-700 mb-4">
                                Créditos: <span className="font-black">{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format((company as any).totalCredits || 0)}</span>
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleViewCompany(company)}
                                    className="flex-1 bg-green-700 text-white px-3 py-2 rounded-xl text-xs font-black uppercase hover:bg-green-900 transition-all"
                                >
                                    Ver Detalle
                                </button>
                                <button
                                    onClick={() => handleGenerateInvoice(company)}
                                    className="flex-1 bg-[#c1ff72] text-green-900 px-3 py-2 rounded-xl text-xs font-black uppercase hover:bg-green-200 transition-all"
                                >
                                    Facturar
                                </button>
                            </div>
                        </div>
                    ))}
                    {allCompanies.length === 0 && (
                        <p className="col-span-3 text-center py-10 text-gray-400">No hay empresas registradas.</p>
                    )}
                </div>
            )}

            {selectedClient && <ClientDetailsModal />}
            {selectedCompany && <CompanyDetailsModal />}
        </div>
    );
};

export default ClientManagement;
