
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext.tsx';
import { getPayoutsByCookId } from '../../../data.ts';
import { Payout } from '../../../types.ts';

const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat(currency === 'MXN' ? 'es-MX' : 'es-CO', {
        style: 'currency',
        currency,
    }).format(amount);
};

const PagosCocinero: React.FC = () => {
    const { user } = useAuth();
    const [payouts, setPayouts] = useState<Payout[]>([]);

    useEffect(() => {
        if (user && user.cookId) {
            getPayoutsByCookId(user.cookId).then(setPayouts);
        }
    }, [user]);

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <h1 className="text-3xl font-bold text-green-900 mb-6">Mis Pagos Recibidos</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr className="border-b-2 border-gray-200">
                           <th className="px-5 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Fecha de Pago</th>
                           <th className="px-5 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Monto Bruto</th>
                           <th className="px-5 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Comisión Hungers (14%)</th>
                           <th className="px-5 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Monto Neto Recibido</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payouts.map(payout => (
                            <tr key={payout.id} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="px-5 py-4 text-sm text-green-900">{new Date(payout.date).toLocaleDateString()}</td>
                                <td className="px-5 py-4 text-sm text-green-700">{formatCurrency(payout.grossAmount, payout.currency)}</td>
                                <td className="px-5 py-4 text-sm text-red-600">-{formatCurrency(payout.commission, payout.currency)}</td>
                                <td className="px-5 py-4 text-sm text-green-700 font-bold">{formatCurrency(payout.netAmount, payout.currency)}</td>
                            </tr>
                        ))}
                        {payouts.length === 0 && (
                            <tr>
                                <td colSpan={4} className="text-center py-10 text-green-700">No hay pagos registrados.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PagosCocinero;
