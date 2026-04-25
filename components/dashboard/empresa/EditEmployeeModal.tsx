import React, { useState, useEffect } from 'react';
import { User } from '../../../types.ts';
import { updateUser, getCompanyById, getEmployeesByCompanyId } from '../../../data.ts';
import Button from '../../Button';
import { useAuth } from '../../../contexts/AuthContext.tsx';

interface EditEmployeeModalProps {
    employee: User;
    onClose: () => void;
    onSave: () => void;
}

const EditEmployeeModal: React.FC<EditEmployeeModalProps> = ({ employee, onClose, onSave }) => {
    const { user: adminUser } = useAuth();
    const [formData, setFormData] = useState({
        name: employee.name,
        credits: employee.credits || 0,
    });
    const [error, setError] = useState('');
    const [availableCredits, setAvailableCredits] = useState(0);

    useEffect(() => {
        const calculateCredits = async () => {
            if (adminUser && adminUser.companyId) {
                const company = await getCompanyById(adminUser.companyId);
                const allEmployees = await getEmployeesByCompanyId(adminUser.companyId);
                const totalCompanyCredits = (company as any)?.totalCredits || (company as any)?.credits || 0;

                const assignedToOthers = allEmployees
                    .filter(e => e.id !== employee.id)
                    .reduce((acc, curr) => acc + (curr.credits || 0), 0);

                setAvailableCredits(totalCompanyCredits - assignedToOthers);
            }
        };
        calculateCredits();
    }, [adminUser, employee.id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) || 0 : value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.credits < 0) {
            setError('Los créditos no pueden ser negativos.');
            return;
        }

        if (availableCredits > 0 && formData.credits > availableCredits) {
            setError(`No puedes asignar más de los créditos disponibles (${availableCredits.toLocaleString()}).`);
            return;
        }

        try {
            await updateUser(employee.id, formData);
            onSave();
        } catch (err) {
            setError('Error al actualizar el empleado.');
        }
    };

    const inputStyles = "block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-700 focus:border-green-700 bg-transparent";

    return (
        <div className="fixed inset-0 bg-gray-400 bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-6 text-green-900">Editar Empleado</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-green-800">Nombre Completo</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required className={inputStyles} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-green-800">Email (no editable)</label>
                        <input type="email" value={employee.email} disabled className={`${inputStyles} bg-gray-100 cursor-not-allowed`} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-green-800">Créditos Asignados</label>
                        <input type="number" name="credits" value={formData.credits} onChange={handleChange} min="0" className={inputStyles} />
                        <p className="text-xs text-green-700 mt-1">Créditos disponibles: {availableCredits.toLocaleString()}</p>
                    </div>

                    {error && <p className="text-sm text-red-600 text-center">{error}</p>}

                    <div className="flex justify-end gap-4 pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                        <Button type="submit">Guardar Cambios</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditEmployeeModal;