
import React, { useState, useEffect, useCallback } from 'react';
import { User, UserRole } from '../../../types.ts';
import { getAllCooks } from '../../../data.ts';
import InitialsAvatar from './InitialsAvatar.tsx';
import CookDetailsModal from './CookDetailsModal.tsx';

const StatusBadge: React.FC<{ status?: 'aprobado' | 'pendiente_verificacion' | 'rechazado' }> = ({ status }) => {
    const styles = {
        aprobado: 'bg-green-100 text-green-800 border-green-200',
        pendiente_verificacion: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        rechazado: 'bg-red-100 text-red-800 border-red-200',
    };
    if (!status) return null;
    return (
        <span className={`px-3 py-1.5 inline-flex text-[10px] font-black uppercase tracking-tighter rounded-lg border ${styles[status]}`}>
            {status.replace(/_/g, ' ')}
        </span>
    );
};

const CookVerification: React.FC = () => {
    const [allCooks, setAllCooks] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [detailsCook, setDetailsCook] = useState<User | null>(null);
    
    const fetchCooks = useCallback(async () => {
        setIsLoading(true);
        try {
            const cooksData = await getAllCooks();
            setAllCooks(cooksData);
        } catch (error) {
            console.error("Error al cargar cocineros:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchCooks(); }, [fetchCooks]);

    return (
        <div className="bg-white rounded-[2rem] shadow-xl p-8 border border-gray-100 animate-fade-in">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-black text-green-900 uppercase tracking-tighter leading-none">Validación de Talento</h1>
                    <p className="text-green-700 mt-2 text-sm">Gestiona y verifica a los emprendedores culinarios de la plataforma.</p>
                </div>
                <button onClick={fetchCooks} className="p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors text-green-900 font-bold text-xs uppercase tracking-widest border border-gray-200">Refrescar</button>
            </div>
            
            {isLoading ? (
                <div className="py-20 text-center flex flex-col items-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-700 border-t-transparent mb-4"></div>
                    <p className="text-green-800 font-black uppercase tracking-widest text-[10px]">Sincronizando expedientes...</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-3xl border border-gray-50">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-green-700 uppercase tracking-[0.2em]">Cocinero</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-green-700 uppercase tracking-[0.2em]">Estado</th>
                                <th className="px-6 py-4 text-center text-[10px] font-black text-green-700 uppercase tracking-[0.2em]">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-50">
                            {allCooks.map(cook => (
                                <tr key={cook.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-5 flex items-center">
                                        <InitialsAvatar name={cook.name} />
                                        <div className="ml-4 overflow-hidden">
                                            <p className="text-sm font-bold text-green-900 truncate">{cook.name}</p>
                                            <p className="text-[10px] text-green-600 uppercase font-black opacity-60 truncate tracking-tight">{cook.specialty || 'Especialidad no definida'}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <StatusBadge status={cook.verificationStatus} />
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <button 
                                            onClick={() => setDetailsCook(cook)} 
                                            className="px-5 py-2 bg-green-900 text-[#c1ff72] font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-black transition-all shadow-md"
                                        >
                                            Ver Perfil
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {allCooks.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="py-20 text-center text-gray-400 italic font-medium">No se encontraron cocineros registrados.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
            {detailsCook && (
                <CookDetailsModal 
                    cook={detailsCook} 
                    onClose={() => {
                        setDetailsCook(null);
                        fetchCooks();
                    }} 
                />
            )}
        </div>
    );
};

export default CookVerification;
