
import React, { useState } from 'react';
import Button from '../../Button';
import { PaymentMethod } from '../../../types.ts';

interface AddPaymentMethodModalProps {
    onClose: () => void;
    onAdd: (method: Omit<PaymentMethod, 'id'>) => void;
}

const AddPaymentMethodModal: React.FC<AddPaymentMethodModalProps> = ({ onClose, onAdd }) => {
    const [cardData, setCardData] = useState({
        number: '',
        name: '',
        expiry: '',
        cvc: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCardData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (cardData.number.length < 16 || cardData.cvc.length < 3 || !cardData.name || !cardData.expiry) {
            setError('Por favor, completa todos los campos correctamente.');
            return;
        }

        const newMethod: Omit<PaymentMethod, 'id'> = {
            brand: cardData.number.startsWith('4') ? 'Visa' : 'Mastercard',
            last4: cardData.number.slice(-4),
            isDefault: false,
        };

        onAdd(newMethod);
        onClose();
    };
    
    const inputStyles = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-700 focus:border-green-700 transition bg-white";

    return (
        <div className="fixed inset-0 bg-gray-400 bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-green-900">Agregar Nueva Tarjeta</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl" aria-label="Cerrar">&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-green-800">Número de la tarjeta</label>
                        <input type="text" name="number" value={cardData.number} onChange={handleChange} className={inputStyles} placeholder="•••• •••• •••• ••••" maxLength={16} />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-green-800">Nombre en la tarjeta</label>
                        <input type="text" name="name" value={cardData.name} onChange={handleChange} className={inputStyles} placeholder="John Doe" />
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-green-800">Vencimiento (MM/AA)</label>
                            <input type="text" name="expiry" value={cardData.expiry} onChange={handleChange} className={inputStyles} placeholder="MM/AA" />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-green-800">CVC</label>
                            <input type="text" name="cvc" value={cardData.cvc} onChange={handleChange} className={inputStyles} placeholder="•••" maxLength={4} />
                        </div>
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <div className="flex justify-end gap-4 pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                        <Button type="submit">Guardar Tarjeta</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPaymentMethodModal;
