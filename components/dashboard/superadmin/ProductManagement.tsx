
import React, { useState, useEffect, useMemo } from 'react';
import { LocationCode, MenuItem, User, UserRole } from '../../../types.ts';
import { deleteMenuItem, getAllCooks } from '../../../data.ts';
import { useMenuItems } from '../../../hooks/useMenuItems.ts';
import Button from '../../Button';
import AddEditMenuModal from '../cocinero/AddEditMenuModal.tsx';

const ProductManagement: React.FC = () => {
    const [activeTab, setActiveTab] = useState<LocationCode>('BOG');
    const { items: menuItems, loading: isMenusLoading } = useMenuItems(activeTab);
    const [allCooks, setAllCooks] = useState<User[]>([]);
    const [isCooksLoading, setIsCooksLoading] = useState(true);
    const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        setIsCooksLoading(true);
        getAllCooks().then(cooks => {
            setAllCooks(cooks);
            setIsCooksLoading(false);
        });
    }, []);

    const handleAdd = () => {
        setEditingMenu(null);
        setIsModalOpen(true);
    };

    const handleEdit = (menu: MenuItem) => {
        setEditingMenu(menu);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('¿Eliminar este platillo permanentemente del catálogo global?')) {
            await deleteMenuItem(id);
        }
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(val);
    };

    const isLoading = isMenusLoading; // No bloqueamos por los cocineros

    return (
        <div className="bg-white rounded-[2rem] shadow-xl p-8 border border-gray-100 animate-fade-in">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
                <div>
                    <h1 className="text-3xl font-black text-green-900 uppercase tracking-tighter">Gestión Global de Productos</h1>
                    <p className="text-green-700 text-sm mt-1">Sincronización instantánea activada.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <div className="flex bg-gray-100 p-1 rounded-2xl">
                        <button 
                            onClick={() => setActiveTab('BOG')}
                            className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${activeTab === 'BOG' ? 'bg-white text-green-900 shadow-md' : 'text-gray-400 hover:text-green-700'}`}
                        >
                            BOGOTÁ 🇨🇴
                        </button>
                        <button 
                            onClick={() => setActiveTab('MDE')}
                            className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${activeTab === 'MDE' ? 'bg-white text-green-900 shadow-md' : 'text-gray-400 hover:text-green-700'}`}
                        >
                            MEDELLÍN 🇨🇴
                        </button>
                    </div>
                    <Button onClick={handleAdd} className="!shadow-xl !py-3 !px-8">+ Nuevo Platillo</Button>
                </div>
            </div>
            
            {isLoading ? (
                <div className="py-20 text-center flex flex-col items-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-700 border-t-transparent mb-4"></div>
                    <p className="text-green-800 font-bold uppercase tracking-widest text-[10px]">Conectando con el catálogo global...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {menuItems.map((item) => (
                        <div key={item.id} className="bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 group hover:shadow-2xl transition-all duration-500 flex flex-col">
                            <div className="relative w-full aspect-video overflow-hidden">
                                <img 
                                    key={item.imageUrl} 
                                    src={item.imageUrl} 
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                    alt={item.name} 
                                    referrerPolicy="no-referrer"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/food/400/300';
                                    }}
                                />
                                <div className="absolute top-4 right-4 bg-green-900 text-[#c1ff72] px-3 py-1 rounded-full text-[10px] font-black shadow-xl">
                                    {formatCurrency(item.price)}
                                </div>
                                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm text-green-900 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">
                                    Chef: {item.cookName || 'Asignado'}
                                </div>
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <h3 className="text-lg font-black text-green-900 uppercase tracking-tighter leading-tight mb-2 line-clamp-1">{item.name}</h3>
                                <p className="text-xs text-green-700 line-clamp-2 italic mb-4">"{item.description}"</p>
                                <div className="mt-auto pt-4 border-t border-gray-200 flex justify-between items-center gap-2">
                                    <button 
                                        onClick={() => handleEdit(item)}
                                        className="flex-1 bg-green-100 text-green-900 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#c1ff72] transition-all"
                                    >
                                        Editar
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(item.id)}
                                        className="flex-1 bg-red-50 text-red-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {menuItems.length === 0 && (
                        <div className="col-span-full py-20 text-center bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200">
                            <p className="text-gray-400 font-medium italic">No hay menús activos en {activeTab}.</p>
                        </div>
                    )}
                </div>
            )}

            {isModalOpen && (
                <AddEditMenuModal
                    menu={editingMenu}
                    onClose={() => setIsModalOpen(false)}
                    onSave={() => setIsModalOpen(false)}
                    allCooks={allCooks}
                    forcedLocation={activeTab}
                />
            )}
        </div>
    );
};

export default ProductManagement;
