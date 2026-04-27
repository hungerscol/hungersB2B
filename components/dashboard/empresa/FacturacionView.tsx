import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext.tsx';
import { getInvoicesByCompanyId } from '../../../data.ts';
import { Invoice } from '../../../types.ts';
import Button from '../../Button';

const formatCurrency = (amount: number) => new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP', minimumFractionDigits: 0
}).format(amount);

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const styles: Record<string, string> = {
        Pagada: 'bg-green-100 text-green-800',
        pagada: 'bg-green-100 text-green-800',
        Pendiente: 'bg-yellow-100 text-yellow-800',
        pendiente: 'bg-yellow-100 text-yellow-800',
    };
    return (
        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
            {status}
        </span>
    );
};

const FacturacionView: React.FC = () => {
    const { user } = useAuth();
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user && user.companyId) {
            setIsLoading(true);
            getInvoicesByCompanyId(user.companyId)
                .then(data => setInvoices(data || []))
                .finally(() => setIsLoading(false));
        }
    }, [user]);

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-green-900 uppercase tracking-tighter">Facturación</h1>
                <p className="text-green-700 text-sm mt-1">Historial de facturas emitidas por Hungers</p>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin h-10 w-10 border-4 border-green-700 border-t-transparent rounded-full"></div>
                </div>
            ) : invoices.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <p className="text-4xl mb-4">🧾</p>
                    <p className="text-green-700 font-bold">No hay facturas disponibles aún.</p>
                    <p className="text-green-600 text-sm mt-2">Las facturas aparecerán aquí cuando Hungers las genere.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b-2 border-gray-200">
                                <th className="px-5 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Número</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Fecha</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Monto</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Estado</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.map(invoice => (
                                <tr key={invoice.id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="px-5 py-4 text-sm text-green-700 font-mono font-bold">
                                        {(invoice as any).number || invoice.id.slice(-8).toUpperCase()}
                                    </td>
                                    <td className="px-5 py-4 text-sm text-green-900">
                                        {new Date(invoice.date).toLocaleDateString('es-CO')}
                                    </td>
                                    <td className="px-5 py-4 text-sm text-green-900 font-bold">
                                        {formatCurrency(invoice.amount)}
                                    </td>
                                    <td className="px-5 py-4 text-sm">
                                        <StatusBadge status={invoice.status} />
                                    </td>
                                    <td className="px-5 py-4 text-sm">
                                        {(invoice as any).pdfUrl ? (
                                            <a
                                                href={(invoice as any).pdfUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                download
                                            >
                                                <Button variant="outline" className="!py-1 !px-3 text-xs">
                                                    ⬇️ Descargar PDF
                                                </Button>
                                            </a>
                                        ) : (
                                            <span className="text-gray-400 text-xs italic">PDF pendiente</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default FacturacionView;