
import React, { useState, useEffect } from 'react';
import { Coupon } from '../../../types.ts';
import { getCoupons, addCoupon, deleteCoupon } from '../../../data.ts';
import Button from '../../Button';

const CouponManagement: React.FC = () => {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCoupon, setNewCoupon] = useState({
        code: '',
        type: 'percentage' as 'percentage' | 'fixed',
        value: ''
    });
    
    const inputStyles = "block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-700 focus:border-green-700 bg-transparent";

    useEffect(() => {
        getCoupons().then(setCoupons);
    }, []);

    const refreshCoupons = () => {
        getCoupons().then(setCoupons);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este cupón?')) {
            deleteCoupon(id).then(() => {
                refreshCoupons();
            });
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewCoupon(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const couponData = {
            code: newCoupon.code.toUpperCase(),
            type: newCoupon.type,
            value: parseFloat(newCoupon.value),
        };
        addCoupon(couponData).then(() => {
            refreshCoupons();
            setIsModalOpen(false);
            setNewCoupon({ code: '', type: 'percentage', value: '' });
        });
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-green-900">Gestión de Cupones</h1>
                <Button onClick={() => setIsModalOpen(true)}>Crear Cupón</Button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr className="border-b-2 border-gray-200">
                           <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Código</th>
                           <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tipo</th>
                           <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Valor</th>
                           <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coupons.map(coupon => (
                            <tr key={coupon.id} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="px-5 py-4 font-mono text-green-700 font-bold">{coupon.code}</td>
                                <td className="px-5 py-4 text-sm capitalize">{coupon.type === 'percentage' ? 'Porcentaje' : 'Monto Fijo'}</td>
                                <td className="px-5 py-4 text-sm">{coupon.type === 'percentage' ? `${coupon.value}%` : `$${coupon.value}`}</td>
                                <td className="px-5 py-4">
                                    <button onClick={() => handleDelete(coupon.id)} className="text-red-500 hover:text-red-700 font-bold">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-400 bg-opacity-50 z-50 flex justify-center items-center">
                    <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-6 text-green-900">Crear Nuevo Cupón</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input type="text" name="code" placeholder="Código (ej. VERANO20)" value={newCoupon.code} onChange={handleInputChange} required className={inputStyles} />
                            <select name="type" value={newCoupon.type} onChange={handleInputChange} className={inputStyles}>
                                <option value="percentage">Porcentaje</option>
                                <option value="fixed">Monto Fijo</option>
                            </select>
                            <input type="number" name="value" placeholder="Valor (ej. 10 para 10% o 50 para $50)" value={newCoupon.value} onChange={handleInputChange} required className={inputStyles} />
                            <div className="flex justify-end gap-4 pt-4">
                                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                                <Button type="submit">Crear Cupón</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CouponManagement;
