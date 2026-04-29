import React, { useState, useEffect } from 'react';
import { LocationCode, MenuItem, User } from '../../../types.ts';
import { deleteMenuItem, getAllCooks } from '../../../data.ts';
import { useMenuItems } from '../../../hooks/useMenuItems.ts';
import Button from '../../Button';
import AddEditMenuModal from '../cocinero/AddEditMenuModal.tsx';

const ProductManagement: React.FC = () => {
    const [activeTab, setActiveTab] = useState<LocationCode>('BOG');
    const { items: menuItems, loading: isMenusLoading } = useMenuItems(activeTab);
    const [allCooks, setAllCooks] = useState<User[]>([]);
    const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        getAllCooks().then(setAllCooks);
    }, []);

    const handleAdd = () => { setEditingMenu(null); setIsModalOpen(true); };
    const handleEdit = (menu: MenuItem) => { setEditingMenu(menu); setIsModalOpen(true); };
    const handleDelete = async (id: string) => {
        if (window.confirm('¿Eliminar este platillo permanentemente?')) {
            await deleteMenuItem(id);
        }
    };

    const formatCurrency = (val: number) => new Intl.NumberFormat('es-CO', {
        style: 'currency', currency: 'COP', minimumFractionDigits: 0
    }).format(val);

    const filtered = menuItems.filter(item =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.cookName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-green-900 uppercase tracking-tighter">Gestión de Productos</h1>
                    <p className="text-green-700 text-xs mt-1">Sincronización en tiempo real activada.</p>
                </div>
                <Button onClick={handleAdd} className="!py-2 !px-6 !text-xs">+ Nuevo Platillo</Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex bg-gray-100 p-1 rounded-xl">
                    {(['BOG', 'MDE'] as LocationCode[]).map(loc => (
                        <button
                            key={loc}
                            onClick={() => setActiveTab(loc)}
                            className={`px-5 py-2 rounded-lg text-xs font-black transition-all ${activeTab === loc ? 'bg-white text-green-900 shadow-sm' : 'text-gray-400 hover:text-green-700'}`}
                        >
                            {loc === 'BOG' ? 'Bogotá 🏙️' : 'Medellín ⛰️'}
                        </button>
                    ))}
                </div>
                <input
                    type="text"
                    placeholder="Buscar platillo o chef..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-200"
                />
                <span className="text-xs text-gray-400 self-center">{filtered.length} platillos</span>
            </div>

            {/* Grid */}
            {isMenusLoading ? (
                <div className="py-20 text-center flex flex-col items-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-700 border-t-transparent mb-4"></div>
                    <p className="text-green-800 font-bold uppercase tracking-widest text-[10px]">Cargando catálogo...</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filtered.map(item => (
                        <div key={item.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all group flex flex-col">
                            <div className="relative w-full h-36 overflow-hidden">
                                <img
                                    src={item.imageUrl}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    alt={item.name}
                                    referrerPolicy="no-referrer"
                                    onError={e => { (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/food/400/300'; }}
                                />
                                <div className="absolute top-2 right-2 bg-green-900 text-[#c1ff72] px-2 py-0.5 rounded-full text-[10px] font-black">
                                    {formatCurrency(item.price)}
                                </div>
                            </div>
                            <div className="p-3 flex flex-col flex-grow">
                                <p className="text-xs font-black text-green-900 uppercase tracking-tight leading-tight line-clamp-1 mb-1">{item.name}</p>
                                <p className="text-[10px] text-gray-400 line-clamp-1 mb-2">Chef: {item.cookName || 'Sin asignar'}</p>
                                <div className="mt-auto flex gap-2">
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="flex-1 bg-green-50 text-green-800 py-1.5 rounded-lg text-[10px] font-black uppercase hover:bg-[#c1ff72] transition-all"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="flex-1 bg-red-50 text-red-500 py-1.5 rounded-lg text-[10px] font-black uppercase hover:bg-red-500 hover:text-white transition-all"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {filtered.length === 0 && (
                        <div className="col-span-full py-20 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                            <p className="text-gray-400 italic text-sm">No hay platillos en {activeTab}.</p>
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