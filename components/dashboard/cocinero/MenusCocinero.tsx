
import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext.tsx';
import { deleteMenuItem } from '../../../data.ts';
import { useCookMenuItems } from '../../../hooks/useMenuItems.ts';
import { MenuItem } from '../../../types.ts';
import Button from '../../Button';
import AddEditMenuModal from './AddEditMenuModal.tsx';

const MenusCocinero: React.FC = () => {
    const { user } = useAuth();
    const { items: menus, loading: isLoading } = useCookMenuItems(user?.id);
    const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAdd = () => {
        setEditingMenu(null);
        setIsModalOpen(true);
    };

    const handleEdit = (menu: MenuItem) => {
        setEditingMenu(menu);
        setIsModalOpen(true);
    };

    const handleDelete = async (menuId: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este platillo? Esta acción no se puede deshacer.')) {
            const success = await deleteMenuItem(menuId);
            if (!success) {
                alert('No se pudo eliminar el platillo.');
            }
        }
    };
    
    const formatDate = (dateStr?: string) => {
        if (!dateStr) return 'No asignada';
        const [year, month, day] = dateStr.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString('es-ES', { 
            weekday: 'short',
            day: 'numeric', 
            month: 'long' 
        });
    };

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-green-900 uppercase tracking-tighter">Mis Menús Publicados</h1>
                    <p className="text-green-700 text-sm">Los cambios se guardan y publican al instante.</p>
                </div>
                <Button onClick={handleAdd} className="!shadow-xl">+ Nuevo Platillo</Button>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <svg className="animate-spin h-8 w-8 text-green-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            ) : (
                <>
                    {menus.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                            <div className="text-5xl mb-4">👨‍🍳</div>
                            <p className="text-green-800 font-bold text-lg">Aún no tienes platillos creados.</p>
                            <p className="text-green-600 text-sm mt-1">¡Crea tu primer menú para empezar a recibir pedidos corporativos!</p>
                            <Button onClick={handleAdd} variant="outline" className="mt-6">Crear Menú Ahora</Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {menus.map(item => (
                                <div key={item.id} className="bg-white rounded-2xl p-5 shadow-lg relative flex flex-col border border-gray-100 hover:shadow-xl transition-all">
                                    <div className="relative mb-4 w-full aspect-video overflow-hidden rounded-xl bg-gray-50 shadow-sm">
                                        <img src={item.imageUrl} alt={item.name} className="absolute inset-0 w-full h-full object-cover" referrerPolicy="no-referrer" />
                                        <div className="absolute top-2 right-2 bg-green-900 text-[#c1ff72] px-3 py-1 rounded-full text-xs font-black shadow-md">
                                            {new Intl.NumberFormat().format(item.price)} {item.currency}
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col flex-grow">
                                        <h3 className="font-black text-green-900 text-lg leading-tight mb-2 min-h-[2.5rem]">{item.name}</h3>
                                        
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-[10px] bg-[#c1ff72]/30 text-green-900 font-black px-2 py-0.5 rounded uppercase tracking-wider">
                                                📅 {formatDate(item.availableDate)}
                                            </span>
                                        </div>

                                        <p className="text-sm text-green-700 line-clamp-2 italic mb-4">"{item.description}"</p>
                                    </div>

                                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-50">
                                        <Button variant="outline" className="flex-1 !py-2 !text-xs uppercase font-black" onClick={() => handleEdit(item)}>Editar</Button>
                                        <Button variant="secondary" className="flex-1 !py-2 !text-xs uppercase font-black !bg-red-50 !text-red-600 border-none hover:!bg-red-600 hover:!text-white" onClick={() => handleDelete(item.id)}>Eliminar</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
            
            {isModalOpen && (
                <AddEditMenuModal
                    menu={editingMenu}
                    onClose={() => setIsModalOpen(false)}
                    onSave={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
};

export default MenusCocinero;
