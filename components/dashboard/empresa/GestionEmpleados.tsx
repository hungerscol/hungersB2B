
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../contexts/AuthContext.tsx';
import { getEmployeesByCompanyId, addEmployee, getCompanyById, deleteEmployee } from '../../../data.ts';
import { User, Company } from '../../../types.ts';
import Button from '../../Button';
import EditEmployeeModal from './EditEmployeeModal.tsx';

const AddEmployeeModal: React.FC<{ onClose: () => void; onSave: () => void; availableCredits: number }> = ({ onClose, onSave, availableCredits }) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({ name: '', email: '', credits: 0 });
    const inputStyles = "block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-green-700 focus:border-green-700 bg-white text-green-900";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) : value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.credits > availableCredits) {
            alert(`No puedes asignar más de los créditos disponibles (${availableCredits.toLocaleString()}).`);
            return;
        }
        if (user && user.companyId) {
            await addEmployee({ ...formData, companyId: user.companyId });
            onSave();
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md animate-fade-in" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-black text-green-900 mb-6 uppercase tracking-tight">Nuevo Colaborador</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-bold text-green-700 uppercase mb-1">Nombre Completo</label>
                        <input type="text" name="name" placeholder="Ej: Juan Pérez" onChange={handleChange} required className={inputStyles} />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-green-700 uppercase mb-1">Email</label>
                        <input type="email" name="email" placeholder="email@empresa.com" onChange={handleChange} required className={inputStyles} />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-green-700 uppercase mb-1">Créditos de Bienvenida</label>
                        <input type="number" name="credits" placeholder="0" min="0" max={availableCredits} onChange={handleChange} required className={inputStyles} />
                        <p className="text-[10px] text-gray-400 mt-1">Disponibles: {availableCredits.toLocaleString()}</p>
                    </div>
                    <div className="flex justify-end gap-3 pt-6">
                        <button type="button" onClick={onClose} className="px-6 py-2 text-sm text-gray-500 hover:underline">Cancelar</button>
                        <Button type="submit">Guardar</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const GestionEmpleados: React.FC = () => {
    const { user } = useAuth();
    const [employees, setEmployees] = useState<User[]>([]);
    const [company, setCompany] = useState<Company | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const refreshData = useCallback(async () => {
        if (user && user.companyId) {
            setIsLoading(true);
            try {
                const [emps, comp] = await Promise.all([
                    getEmployeesByCompanyId(user.companyId),
                    getCompanyById(user.companyId)
                ]);
                setEmployees(emps);
                setCompany(comp || null);
            } catch (error) {
                console.error("Error al refrescar colaboradores", error);
            } finally {
                setIsLoading(false);
            }
        }
    }, [user]);
    
    useEffect(() => {
        refreshData();
    }, [refreshData]);

    const handleSave = () => {
        refreshData();
        setIsAddModalOpen(false);
        setIsEditModalOpen(false);
    }
    
    const handleEditClick = (employee: User) => {
        setEditingEmployee(employee);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = async (employeeId: string) => {
        if (window.confirm('¿Estás seguro de eliminar a este colaborador?')) {
            const success = await deleteEmployee(employeeId);
            if (success) refreshData();
        }
    };

    const assignedCredits = employees.reduce((acc, emp) => acc + (emp.credits || 0), 0);
    const totalCredits = company?.totalCredits || 0;
    const remainingCredits = totalCredits - assignedCredits;

    const formatCurrency = (amount: number) => {
         return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(amount);
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-green-900 uppercase tracking-tighter">Mi Equipo</h1>
                    <p className="text-green-700 text-sm">Gestiona colaboradores y asigna sus beneficios.</p>
                </div>
                <Button onClick={() => setIsAddModalOpen(true)} className="!shadow-xl">+ Agregar Colaborador</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-black text-green-700 uppercase tracking-widest">Saldo Corporativo</p>
                    <p className="text-2xl font-black text-green-900">{formatCurrency(totalCredits)}</p>
                </div>
                <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
                    <p className="text-[10px] font-black text-green-800 uppercase tracking-widest">Asignado al Equipo</p>
                    <p className="text-2xl font-black text-green-800">{formatCurrency(assignedCredits)}</p>
                </div>
                <div className="bg-[#c1ff72]/20 p-6 rounded-2xl border border-[#c1ff72]/30">
                    <p className="text-[10px] font-black text-green-900 uppercase tracking-widest">Disponible para asignar</p>
                    <p className="text-2xl font-black text-green-900">{formatCurrency(remainingCredits)}</p>
                </div>
            </div>
            
            {isLoading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin h-8 w-8 border-4 border-green-700 border-t-transparent rounded-full"></div>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50 rounded-t-xl">
                            <tr>
                               <th className="px-6 py-4 text-left text-[10px] font-black text-green-700 uppercase tracking-widest">Colaborador</th>
                               <th className="px-6 py-4 text-left text-[10px] font-black text-green-700 uppercase tracking-widest">Email</th>
                               <th className="px-6 py-4 text-left text-[10px] font-black text-green-700 uppercase tracking-widest">Créditos</th>
                               <th className="px-6 py-4 text-center text-[10px] font-black text-green-700 uppercase tracking-widest">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {employees.map(employee => (
                                <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-bold text-green-900">{employee.name}</td>
                                    <td className="px-6 py-4 text-sm text-green-700">{employee.email}</td>
                                    <td className="px-6 py-4 text-sm font-black text-green-800">{formatCurrency(employee.credits || 0)}</td>
                                    <td className="px-6 py-4 text-center space-x-4">
                                        <button onClick={() => handleEditClick(employee)} className="text-green-700 hover:text-green-900 font-bold text-xs uppercase tracking-tighter">Gestionar</button>
                                        <button onClick={() => handleDeleteClick(employee.id)} className="text-red-500 hover:text-red-700 font-bold text-xs uppercase tracking-tighter">Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                            {employees.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-10 text-center text-gray-400 italic">No has agregado colaboradores todavía.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
            
            {isAddModalOpen && <AddEmployeeModal onClose={() => setIsAddModalOpen(false)} onSave={handleSave} availableCredits={remainingCredits} />}
            {isEditModalOpen && editingEmployee && (
                <EditEmployeeModal 
                    employee={editingEmployee}
                    onClose={() => setIsEditModalOpen(false)}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

export default GestionEmpleados;
