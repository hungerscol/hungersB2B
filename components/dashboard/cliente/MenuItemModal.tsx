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
    const [added, setAdded] = useState(false);
    const navigate = useNavigate();

    const cook = cooks.find((c: Cook) => c.id === item.cookId);
    const displayName = item.cookName || cook?.name || 'Chef Hungers';

    const formatCurrency = (price: number, currency: string) => {
        return new Intl.NumberFormat(location === 'BOG' || location === 'MDE' ? 'es-CO' : 'es-MX', {
            style: 'currency',
            currency: currency || 'COP',
            minimumFractionDigits: 0
        }).format(price || 0);
    };

    const handleAddToCart = () => {
        if (isGuestMode) {
            navigate('/login');
            onClose();
            return;
        }
        addToCart(item, quantity);
        setAdded(true);
    };

    const handleGoToCheckout = () => {
        onClose();
        navigate('/checkout');
    };

    return (
        <div className="fixed inset-0 bg-hungers-green-950/80 backdrop-blur-md z-[150] flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-[2rem] shadow-2xl p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto flex flex-col gap-5 animate-fade-in relative" onClick={e => e.stopPropagation()}>
                
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-hungers-green-900 transition-colors text-2xl font-light z-20">&times;</button>

                <img
                    src={item.imageUrl || FALLBACK_IMAGE}
                    alt={item.name}
                    className="w-full h-48 object-cover rounded-2xl"
                    referrerPolicy="no-referrer"
                    onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
                />

                <div>
                    <p className="text-hungers-lime-600 font-black uppercase tracking-widest text-[10px] mb-1">Platillo Local</p>
                    <h2 className="text-2xl font-black text-hungers-green-900 leading-tight tracking-tighter">{item.name || 'Platillo sin nombre'}</h2>
                    <span className="inline-block bg-hungers-lime-50 text-hungers-green-900 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-hungers-lime-100 mt-2">Chef: {displayName}</span>
                </div>

                <p className="text-gray-500 text-sm leading-relaxed italic">"{item.description || 'Sin descripción disponible.'}"</p>

                {item.ingredients && item.ingredients.length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <h4 className="font-black text-hungers-green-900 text-[10px] uppercase tracking-widest mb-3">Ingredientes:</h4>
                        <div className="flex flex-wrap gap-2">
                            {item.ingredients.map((ing: string, idx: number) => (
                                <span key={idx} className="bg-white border border-gray-200 px-3 py-1 rounded-xl text-xs text-hungers-green-800 font-bold">
                                    {ing}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <p className="text-2xl font-black text-hungers-green-900">{formatCurrency(item.price, item.currency)}</p>
                    <div className="flex items-center bg-gray-100 rounded-xl p-1">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-9 h-9 flex items-center justify-center font-bold text-hungers-green-900 hover:bg-white rounded-lg transition-all">-</button>
                        <span className="w-8 text-center font-black text-hungers-green-900">{quantity}</span>
                        <button onClick={() => setQuantity(quantity + 1)} className="w-9 h-9 flex items-center justify-center font-bold text-hungers-green-900 hover:bg-white rounded-lg transition-all">+</button>
                    </div>
                </div>

                {!added ? (
                    <Button onClick={handleAddToCart} variant="primary" className="w-full !py-4 shadow-lime">
                        Añadir al Carrito
                    </Button>
                ) : (
                    <div className="flex gap-3">
                        <Button onClick={onClose} variant="outline" className="flex-1 !py-4">
                            Seguir viendo
                        </Button>
                        <Button onClick={handleGoToCheckout} variant="primary" className="flex-1 !py-4 shadow-lime">
                            Ir al Carrito 🛒
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MenuItemModal;