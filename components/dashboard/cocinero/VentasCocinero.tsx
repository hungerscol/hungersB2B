
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext.tsx';
import { getSalesByCookId } from '../../../data.ts';

const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat(currency === 'MXN' ? 'es-MX' : 'es-CO', {
        style: 'currency',
        currency,
    }).format(amount);
};

const VentasCocinero: React.FC = () => {
    const { user } = useAuth();
    const [sales, setSales] = useState<any[]>([]);

    useEffect(() => {
        if (user && user.cookId) {
            getSalesByCookId(user.cookId).then(setSales);
        }
    }, [user]);
    
    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <h1 className="text-3xl font-bold text-green-900 mb-6">Historial de Ventas</h1>
             <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr className="border-b-2 border-gray-200">
                           <th className="px-5 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Fecha</th>
                           <th className="px-5 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Platillo Vendido</th>
                           <th className="px-5 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Cantidad</th>
                           <th className="px-5 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Ingreso Bruto</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sales.map((sale, index) => (
                            <tr key={`${sale.orderId}-${index}`} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="px-5 py-4 text-sm text-green-900">{new Date(sale.date).toLocaleDateString()}</td>
                                <td className="px-5 py-4 text-sm text-green-900 font-medium">{sale.itemName}</td>
                                <td className="px-5 py-4 text-sm text-green-700">{sale.quantity}</td>
                                <td className="px-5 py-4 text-sm text-green-900 font-semibold">{formatCurrency(sale.total, sale.currency)}</td>
                            </tr>
                        ))}
                         {sales.length === 0 && (
                            <tr>
                                <td colSpan={4} className="text-center py-10 text-green-700">No hay ventas registradas.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default VentasCocinero;
