
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext.tsx';
import { getRecurringOrdersByCompanyId, getEmployeesByCompanyId, addRecurringOrder, deleteRecurringOrder } from '../../../data.ts';
import { RecurringOrder, User } from '../../../types.ts';
import Button from '../../Button';

const ScheduleOrderModal: React.FC<{ onClose: () => void; onSave: () => void; }> = ({ onClose, onSave }) => {
    const { user } = useAuth();
    const [employees, setEmployees] = useState<User[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        description: '',
        startDate: new Date().toISOString().split('T')[0],
        frequency: 'Semanal' as RecurringOrder['frequency'],
        daysOfWeek: [] as ('L' | 'M' | 'X' | 'J' | 'V')[],
        employeeIds: [] as string[],
        amountPerLunch: ''
    });

    useEffect(() => {
        if (user && user.companyId) {
            getEmployeesByCompanyId(user.companyId).then(setEmployees);
        }
    }, [user]);

    const handleEmployeeToggle = (employeeId: string) => {
        setFormData(prev => ({
            ...prev,
            employeeIds: prev.employeeIds.includes(employeeId)
                ? prev.employeeIds.filter((id: string) => id !== employeeId)
                : [...prev.employeeIds, employeeId]
        }));
    };
    
    const handleDayToggle = (day: 'L' | 'M' | 'X' | 'J' | 'V') => {
        setFormData(prev => ({
            ...prev,
            daysOfWeek: prev.daysOfWeek.includes(day)
                ? prev.daysOfWeek.filter((d: string) => d !== day)
                : [...prev.daysOfWeek, day]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (user && user.companyId && formData.employeeIds.length > 0 && formData.amountPerLunch) {
            setIsSaving(true);
            try {
                await addRecurringOrder({
                    companyId: user.companyId,
                    description: formData.description,
                    startDate: formData.startDate,
                    frequency: formData.frequency,
                    daysOfWeek: formData.frequency === 'Semanal' ? formData.daysOfWeek : undefined,
                    employeeIds: formData.employeeIds,
                    amountPerLunch: parseFloat(formData.amountPerLunch)
                });
                onSave();
            } catch (err) {
                console.error(err);
                alert("Error al guardar la programación.");
            } finally {
                setIsSaving(false);
            }
        } else {
            alert('Por favor, complete todos los campos requeridos, incluyendo al menos un empleado.');
        }
    };
    
    const inputStyles = "block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-700 focus:border-green-700 bg-white text-green-900 text-sm";

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-xl font-black text-green-900 uppercase tracking-tight">Programar Almuerzos</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <span className="text-2xl">×</span>
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-[10px] font-bold text-green-700 uppercase mb-1">Nombre de la Rutina</label>
                        <input type="text" placeholder="Ej: Equipo Administrativo" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required className={inputStyles} />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-bold text-green-700 uppercase mb-1">Fecha de Inicio</label>
                            <input type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} required className={inputStyles} />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-green-700 uppercase mb-1">Frecuencia</label>
                            <select value={formData.frequency} onChange={e => setFormData({...formData, frequency: e.target.value as any})} className={inputStyles}>
                                <option value="Semanal">Semanal</option>
                                <option value="Quincenal">Quincenal</option>
                                <option value="Mensual">Mensual</option>
                            </select>
                        </div>
                    </div>

                    {formData.frequency === 'Semanal' && (
                        <div className="animate-fade-in">
                            <label className="block text-[10px] font-bold text-green-700 uppercase mb-2">Días de Entrega</label>
                            <div className="flex gap-2">
                                {(['L', 'M', 'X', 'J', 'V'] as const).map((day: 'L' | 'M' | 'X' | 'J' | 'V') => (
                                    <button 
                                        type="button" 
                                        key={day} 
                                        onClick={() => handleDayToggle(day)} 
                                        className={`w-10 h-10 rounded-lg font-black transition-all transform hover:scale-105 flex items-center justify-center border ${formData.daysOfWeek.includes(day) ? 'bg-[#c1ff72] text-green-900 border-green-900 shadow-sm' : 'bg-gray-50 text-gray-400 border-gray-200'}`}
                                    >
                                        {day}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-[10px] font-bold text-green-700 uppercase mb-1">Presupuesto / Almuerzo</label>
                        <div className="relative">
                            <span className="absolute left-3 top-2 text-gray-400 text-sm">$</span>
                            <input type="number" placeholder="Ej: 25000" value={formData.amountPerLunch} onChange={e => setFormData({...formData, amountPerLunch: e.target.value})} required className={`${inputStyles} pl-6`} />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-[10px] font-bold text-green-700 uppercase">Seleccionar Colaboradores</label>
                            <span className="text-[10px] font-black text-green-900 bg-green-100 px-2 py-0.5 rounded-full">{formData.employeeIds.length} seleccionados</span>
                        </div>
                        <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-xl bg-gray-50 p-1 space-y-1">
                            {employees.map((emp: User) => (
                                <label key={emp.id} className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-colors ${formData.employeeIds.includes(emp.id) ? 'bg-[#c1ff72]/40' : 'hover:bg-white'}`}>
                                    <input type="checkbox" checked={formData.employeeIds.includes(emp.id)} onChange={() => handleEmployeeToggle(emp.id)} className="h-4 w-4 rounded border-gray-300 text-green-700 focus:ring-green-700" />
                                    <div className="flex-grow">
                                        <p className="text-xs font-bold text-green-900 leading-none">{emp.name}</p>
                                        <p className="text-[9px] text-green-600 uppercase mt-0.5">{emp.email}</p>
                                    </div>
                                </label>
                            ))}
                            {employees.length === 0 && <p className="p-4 text-center text-[10px] text-gray-400 italic">No hay colaboradores registrados.</p>}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-xs text-gray-500 hover:underline">Cancelar</button>
                        <Button type="submit" disabled={isSaving} className="!py-2 !px-6 !text-sm">
                            {isSaving ? 'Guardando...' : 'Crear Programación'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const PedidosRecurrentesView: React.FC = () => {
    const { user } = useAuth();
    const [recurringOrders, setRecurringOrders] = useState<RecurringOrder[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const refreshData = async () => {
        if (user && user.companyId) {
            setIsLoading(true);
            try {
                const data = await getRecurringOrdersByCompanyId(user.companyId);
                setRecurringOrders(data);
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        }
    };
    
    useEffect(() => {
        refreshData();
    }, [user]);

    const handleSave = () => {
        refreshData();
        setIsModalOpen(false);
    };

    const handleDelete = async (orderId: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta programación?')) {
            const success = await deleteRecurringOrder(orderId);
            if (success) {
                refreshData();
            }
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-green-900 uppercase tracking-tighter">Pedidos Recurrentes</h1>
                    <p className="text-green-700 text-sm">Automatiza la alimentación de tu equipo con rutinas programadas.</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="!shadow-xl">+ Nueva Programación</Button>
            </div>
            
            {isLoading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin h-8 w-8 border-4 border-green-700 border-t-transparent rounded-full"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {recurringOrders.map((ro: RecurringOrder) => (
                        <div key={ro.id} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col relative group">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-xl font-black text-green-900 leading-tight mb-1">{ro.description}</p>
                                    <div className="flex gap-2 flex-wrap">
                                        <span className="text-[10px] bg-green-900 text-white font-black px-2 py-0.5 rounded uppercase tracking-widest">{ro.frequency}</span>
                                        {ro.daysOfWeek && <span className="text-[10px] bg-[#c1ff72] text-green-900 font-black px-2 py-0.5 rounded uppercase tracking-widest">Días: {ro.daysOfWeek.join(', ')}</span>}
                                    </div>
                                </div>
                                <button onClick={() => handleDelete(ro.id)} className="text-gray-300 hover:text-red-500 transition-colors p-2">
                                    <span className="text-xl">🗑</span>
                                </button>
                            </div>
                            
                            <div className="mt-auto space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-green-700">Inicia</span>
                                    <span className="font-bold text-green-900">{new Date(ro.startDate).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-green-700">Participantes</span>
                                    <span className="font-bold text-green-900">{ro.employeeIds.length} Colaboradores</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-green-700">Presupuesto/Servicio</span>
                                    <span className="font-black text-green-800">${ro.amountPerLunch.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {recurringOrders.length === 0 && (
                        <div className="col-span-full py-16 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                            <p className="text-gray-400 text-lg italic">No tienes rutinas de almuerzo activas.</p>
                            <p className="text-sm text-gray-400 mt-1">Crea una para que tu equipo reciba su almuerzo automáticamente.</p>
                        </div>
                    )}
                </div>
            )}
            
            {isModalOpen && <ScheduleOrderModal onClose={() => setIsModalOpen(false)} onSave={handleSave} />}
        </div>
    );
};

export default PedidosRecurrentesView;
