
import React, { useState, useMemo, useEffect } from 'react';
import { MenuItem } from '../../types';
import { useLocation } from '../../contexts/LocationContext';
import { useMenuItems } from '../../hooks/useMenuItems';
import MenuItemCard from '../dashboard/cliente/MenuItemCard';
import MenuItemModal from '../dashboard/cliente/MenuItemModal';
import { useSEO } from '../../hooks/useSEO';
import { useNavigate } from 'react-router-dom';

interface MenusProps {
  initialItemId?: string | null;
  onModalClose?: () => void;
}

const Menus: React.FC<MenusProps> = ({ initialItemId, onModalClose }) => {
  const navigate = useNavigate();
  useSEO({
    title: 'Hungers | Nuestros Menús',
    description: 'Explora nuestro catálogo de platillos caseros y deliciosos en tiempo real.',
  });

  const { location } = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const { items: menuItems, loading: isLoading } = useMenuItems(location);

  useEffect(() => {
    if (initialItemId && menuItems.length > 0) {
      const item = menuItems.find(i => i.id === initialItemId);
      if (item) setSelectedItem(item);
    }
  }, [initialItemId, menuItems]);

  const filteredMenuItems = useMemo(() => {
    if (!searchTerm.trim()) return menuItems;
    const lowercasedTerm = searchTerm.toLowerCase();
    return menuItems.filter(item =>
      item.name.toLowerCase().includes(lowercasedTerm) ||
      item.description.toLowerCase().includes(lowercasedTerm)
    );
  }, [searchTerm, menuItems]);

  return (
    <div className="bg-[#fcfdfc] min-h-screen py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
            <p className="text-hungers-lime-600 font-black uppercase tracking-[0.4em] mb-4 text-xs">Sabor Local</p>
            <h1 className="text-5xl md:text-7xl font-black text-hungers-green-900 uppercase tracking-tighter">Menú en Vivo</h1>
        </div>
        
        <div className="max-w-2xl mx-auto mb-20 relative animate-fade-in">
          <div className="absolute left-7 top-1/2 -translate-y-1/2 text-hungers-green-900/20 text-2xl pointer-events-none">🔍</div>
          <input
            type="text"
            placeholder="¿Qué se te antoja hoy?..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-16 pr-8 py-6 border border-gray-100 rounded-full bg-white shadow-premium focus:ring-4 focus:ring-hungers-lime-200 focus:border-hungers-green-900 transition-all text-hungers-green-950 font-medium placeholder-gray-300"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {isLoading ? (
            <div className="col-span-full py-32 text-center animate-pulse">
                <div className="w-16 h-16 border-4 border-hungers-lime-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                <p className="text-hungers-green-900/40 font-black uppercase tracking-[0.2em] text-sm">Preparando mesa...</p>
            </div>
          ) : filteredMenuItems.map((item: MenuItem) => (
              <MenuItemCard key={item.id} item={item} onVerMas={() => setSelectedItem(item)} />
          ))}
        </div>
        
        {!isLoading && filteredMenuItems.length === 0 && (
            <div className="text-center py-32 animate-fade-in">
                <div className="text-6xl mb-6 opacity-20">🍽️</div>
                <p className="text-gray-400 font-medium italic text-lg">No se encontraron platillos que coincidan con tu búsqueda.</p>
            </div>
        )}
      </div>
       {selectedItem && (
            <MenuItemModal 
                item={selectedItem} 
                onClose={() => { setSelectedItem(null); if(onModalClose) onModalClose(); }} 
                isGuestMode={true}
            />
        )}
    </div>
  );
};

export default Menus;
