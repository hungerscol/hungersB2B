
import React, { useState } from 'react';
import { MenuItem, Cook } from '../../../types';
import { useLocation } from '../../../contexts/LocationContext';
import { useShoppingCart } from '../../../contexts/ShoppingCartContext';
import { cooks } from '../../../data';
import Button from '../../Button';
import { useNavigate } from 'react-router-dom';

interface MenuItemModalProps {
    item: MenuItem;
    onClose: () => void;
    isGuestMode?: boolean;
}

const FALLBACK_IMAGE = 'https://storage.googleapis.com/ai-studio-bucket-1052854456789-us-west1/Men%C3%BAs/mole%20poblano.jpg';

const MenuItemModal: React.FC<MenuItemModalProps> = ({ item, onClose, isGuestMode = false }) => {
    const { location } = useLocation();
    const { addToCart } = useShoppingCart();
    const [quantity, setQuantity] = useState(1);
    const navigate = useNavigate();
    
    // Búsqueda segura del cocinero
    const cook = cooks.find((c: Cook) => c.id === item.cookId);
    const displayName = item.cookName || cook?.name || 'Chef Hungers';

    const formatCurrency = (price: number, currency: string) => {
        return new Intl.NumberFormat(location === 'BOG' || location === 'MDE' ? 'es-CO' : 'es-MX', {
            style: 'currency',
            currency: currency || 'COP',
            minimumFractionDigits: 0
        }).format(price || 0);
    }

    const [added, setAdded] = useState(false);

const handleAddToCart = () => {
    if (isGuestMode) {
        navigate('/login');
        onClose();
        return;
    }
    addToCart(item, quantity);
    setAdded(true);
}

const handleGoToCheckout = () => {
    onClose();
    navigate('/checkout');
}
    
    return (
        <div className="fixed inset-0 bg-hungers-green-950/80 backdrop-blur-md z-[150] flex justify-center items-center p-4 sm:p-6" onClick={onClose}>
            <div className="bg-white rounded-[3rem] shadow-2xl p-6 sm:p-12 w-full max-w-5xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row gap-12 animate-fade-in relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-8 right-8 text-gray-400 hover:text-hungers-green-900 transition-colors text-4xl font-light z-20">&times;</button>
                
                <div className="w-full md:w-1/2">
                    <div className="relative group h-full">
                        <img 
                            src={item.imageUrl || FALLBACK_IMAGE} 
                            alt={item.name} 
                            className="w-full aspect-square object-cover rounded-5xl shadow-premium border-8 border-gray-50 transition-transform duration-700 group-hover:scale-[1.02]"
                            referrerPolicy="no-referrer"
                            onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
                        />
                        <div className="absolute top-6 left-6 bg-hungers-green-900 text-hungers-lime-500 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest shadow-premium backdrop-blur-md border border-white/10">
                           ★ {(item.rating || 5).toFixed(1)}
                        </div>
                    </div>
                </div>
                <div className="flex-grow flex flex-col">
                    <div className="mb-8">
                        <p className="text-hungers-lime-600 font-black uppercase tracking-[0.3em] text-[10px] mb-4">Platillo Local</p>
                        <h2 className="text-4xl md:text-5xl font-black text-hungers-green-900 leading-none tracking-tighter">{item.name || 'Platillo sin nombre'}</h2>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 mb-8">
                        <span className="bg-hungers-lime-50 text-hungers-green-900 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest border border-hungers-lime-100">Chef: {displayName}</span>
                    </div>

                    <p className="text-gray-500 mb-10 leading-relaxed text-xl font-medium italic">"{item.description || 'Sin descripción disponible.'}"</p>
                    
                    <div className="mb-10 bg-gray-50 p-8 rounded-5xl border border-gray-100">
                        <h4 className="font-black text-hungers-green-900 text-[11px] uppercase tracking-widest mb-6">Ingredientes Seleccionados:</h4>
                        <div className="flex flex-wrap gap-3">
                            {item.ingredients && item.ingredients.length > 0 ? (
                                item.ingredients.map((ing: string, idx: number) => (
                                    <span key={idx} className="bg-white border border-gray-200 px-5 py-2.5 rounded-2xl text-xs text-hungers-green-800 font-bold shadow-sm">
                                        {ing}
                                    </span>
                                ))
                            ) : (
                                <span className="text-gray-400 text-xs italic">Consultar con el chef.</span>
                            )}
                        </div>
                    </div>

                    <div className="mt-auto pt-10 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-8">
                        <div className="text-center sm:text-left">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Precio por porción</p>
                            <p className="text-4xl font-black text-hungers-green-900">{formatCurrency(item.price, item.currency)}</p>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center bg-gray-100 rounded-2xl p-1.5 shadow-inner">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 flex items-center justify-center font-bold text-hungers-green-900 hover:bg-white rounded-xl transition-all shadow-sm hover:shadow-md">-</button>
                                <span className="w-10 text-center font-black text-hungers-green-900 text-lg">{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-12 flex items-center justify-center font-bold text-hungers-green-900 hover:bg-white rounded-xl transition-all shadow-sm hover:shadow-md">+</button>
                            </div>
                            <Button onClick={handleAddToCart} variant="primary" className="!py-5 !px-12 shadow-lime !text-base">
                                Añadir al Carrito
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MenuItemModal;
