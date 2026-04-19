
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext.tsx';
import { getInvoicesByCompanyId } from '../../../data.ts';
import { Invoice } from '../../../types.ts';
import Button from '../../Button';

const StatusBadge: React.FC<{ status: Invoice['status'] }> = ({ status }) => {
    const styles = {
        Pagada: 'bg-green-100 text-green-800',
        Pendiente: 'bg-yellow-100 text-yellow-800',
    };
    return <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${styles[status]}`}>{status}</span>;
};

const FacturacionView: React.FC = () => {
    const { user } = useAuth();
    const [invoices, setInvoices] = useState<Invoice[]>([]);

    useEffect(() => {
        if (user && user.companyId) {
            getInvoicesByCompanyId(user.companyId).then(setInvoices);
        }
    }, [user]);

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <h1 className="text-3xl font-bold text-green-900 mb-6">Historial de Facturación</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr className="border-b-2 border-gray-200">
                           <th className="px-5 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Factura ID</th>
                           <th className="px-5 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Fecha</th>
                           <th className="px-5 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Monto</th>
                           <th className="px-5 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Estado</th>
                           <th className="px-5 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map(invoice => (
                            <tr key={invoice.id} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="px-5 py-4 text-sm text-green-700 font-mono">{invoice.id}</td>
                                <td className="px-5 py-4 text-sm text-green-900">{new Date(invoice.date).toLocaleDateString()}</td>
                                <td className="px-5 py-4 text-sm text-green-900 font-semibold">${invoice.amount.toFixed(2)}</td>
                                <td className="px-5 py-4 text-sm"><StatusBadge status={invoice.status} /></td>
                                <td className="px-5 py-4 text-sm">
                                    <Button variant="outline" className="!py-1 !px-3 text-xs">Descargar PDF</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FacturacionView;
