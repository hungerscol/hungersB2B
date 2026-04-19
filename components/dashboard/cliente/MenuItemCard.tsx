
import React from 'react';
import { MenuItem, Cook } from '../../../types';
import { cooks } from '../../../data';
import { useLocation } from '../../../contexts/LocationContext';
import Button from '../../Button';

interface MenuItemCardProps {
    item: MenuItem;
    onVerMas: () => void;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const roundedRating = Math.round(rating);
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, index) => (
        <span key={index} className={`text-sm ${index < roundedRating ? 'text-hungers-lime-500' : 'text-gray-200'}`}>
          ★
        </span>
      ))}
    </div>
  );
};

const FALLBACK_IMAGE = 'https://storage.googleapis.com/ai-studio-bucket-1052854456789-us-west1/Men%C3%BAs/mole%20poblano.jpg';

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onVerMas }) => {
    const { location } = useLocation();
    const cook = cooks.find((c: Cook) => c.id === item.cookId);
    const displayName = item.cookName || cook?.name || 'Chef Local';

    const formatCurrency = (price: number, currency: string) => {
        return new Intl.NumberFormat(location === 'BOG' || location === 'MDE' ? 'es-CO' : 'es-MX', {
            style: 'currency',
            currency,
            minimumFractionDigits: 0
        }).format(price);
    }

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return null;
        const [year, month, day] = dateStr.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString('es-ES', { 
            day: 'numeric', 
            month: 'short' 
        });
    };

    return (
        <div className="bg-white rounded-3xl shadow-premium overflow-hidden transform hover:-translate-y-2 transition-all duration-500 ease-out group flex flex-col h-full border border-gray-50 relative">
            {/* Contenedor con Aspect Ratio Forzado */}
            <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100">
                <img 
                    key={item.imageUrl}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    src={item.imageUrl} 
                    alt={item.name} 
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                    }}
                />
                <div className="absolute top-4 right-4 bg-hungers-lime-500 text-hungers-green-950 font-black px-4 py-1.5 rounded-full text-sm shadow-premium z-10">
                    {formatCurrency(item.price, item.currency)}
                </div>
                {item.availableDate && (
                    <div className="absolute bottom-4 left-4 bg-hungers-green-900/90 text-white font-black px-3 py-1.5 rounded-xl text-[10px] uppercase tracking-widest shadow-premium z-10 backdrop-blur-md border border-white/10">
                        📅 {formatDate(item.availableDate)}
                    </div>
                )}
            </div>
            
            <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-4">
                    <StarRating rating={item.rating} />
                    <span className="text-[10px] font-black text-hungers-lime-600 uppercase tracking-widest truncate max-w-[100px]">Chef {displayName.split(' ')[0]}</span>
                </div>

                <h3 className="text-xl font-black text-hungers-green-900 mb-3 leading-tight line-clamp-2 min-h-[3rem] group-hover:text-hungers-green-600 transition-colors">{item.name}</h3>
                
                <p className="text-gray-500 text-xs mb-6 flex-grow line-clamp-3 overflow-hidden leading-relaxed font-medium">{item.description}</p>
                
                <Button onClick={onVerMas} variant="secondary" className="w-full mt-auto !text-[11px] !py-3.5 !font-black uppercase tracking-[0.2em] shadow-none hover:shadow-lime transition-all">
                    Ver Detalles
                </Button>
            </div>
        </div>
    );
};

export default MenuItemCard;
