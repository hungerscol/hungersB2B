
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext.tsx';
import { updateCook } from '../../../data.ts';
import Button from '../../Button';

const PerfilCocinero: React.FC = () => {
    const { user, updateAuthUser } = useAuth();
    const [formData, setFormData] = useState({ name: '', phone: '', city: '', specialty: '', accountNumber: '' });
    const [feedback, setFeedback] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                phone: user.phone || '',
                city: user.city || '',
                specialty: user.specialty || '',
                accountNumber: user.accountNumber || ''
            });
        }
    }, [user]);

    if (!user) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        const success = await updateCook(user.id, formData);
        if (success) {
            updateAuthUser(formData);
            setFeedback('¡Perfil actualizado con éxito!');
        } else {
            setFeedback('Error al actualizar el perfil.');
        }
        setIsSaving(false);
        setTimeout(() => setFeedback(''), 3000);
    };
    
    const inputStyles = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-700 focus:border-green-700 transition bg-white";

    return (
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-lg mx-auto animate-fade-in border border-gray-50">
            <h2 className="text-2xl font-black text-green-900 mb-6 uppercase tracking-tight">Mi Perfil Profesional</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-green-700 uppercase mb-1">Nombre Completo</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputStyles} />
                </div>
                 <div>
                    <label className="block text-xs font-bold text-green-700 uppercase mb-1">Correo electrónico (no editable)</label>
                    <input type="email" value={user.email} disabled className={`${inputStyles} bg-gray-100 cursor-not-allowed`} />
                </div>
                <div>
                    <label className="block text-xs font-bold text-green-700 uppercase mb-1">Teléfono</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={inputStyles} />
                </div>
                <div>
                    <label className="block text-xs font-bold text-green-700 uppercase mb-1">Ciudad</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} className={inputStyles} />
                </div>
                <div>
                    <label className="block text-xs font-bold text-green-700 uppercase mb-1">Especialidad Culinaria</label>
                    <input type="text" name="specialty" value={formData.specialty} onChange={handleChange} className={inputStyles} />
                </div>
                <div>
                    <label className="block text-xs font-bold text-green-700 uppercase mb-1">Número de Cuenta Bancaria</label>
                    <input type="text" name="accountNumber" value={formData.accountNumber} onChange={handleChange} className={inputStyles} />
                </div>
                
                {feedback && (
                    <p className={`text-sm font-bold text-center p-2 rounded-lg ${feedback.includes('éxito') ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                        {feedback}
                    </p>
                )}

                <div className="pt-4">
                    <Button type="submit" variant="primary" className="w-full !py-4 shadow-xl font-black uppercase tracking-widest" disabled={isSaving}>
                        {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default PerfilCocinero;
