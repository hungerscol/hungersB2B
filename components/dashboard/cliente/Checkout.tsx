
import React, { useState, useEffect } from 'react';
import { Page, Order, CartItem, Coupon } from '../../../types.ts';
import { useShoppingCart } from '../../../contexts/ShoppingCartContext.tsx';
import { useLocation } from '../../../contexts/LocationContext.tsx';
import { useAuth } from '../../../contexts/AuthContext.tsx';
import { deductUserCredits, addOrder, sendOrderConfirmationEmail, getCoupons } from '../../../data.ts';
import Button from '../../Button';
import { useNavigate } from 'react-router-dom';

type PaymentMode = 'credits' | 'card';

interface CheckoutProps {}

const FALLBACK_IMAGE = 'https://storage.googleapis.com/ai-studio-bucket-1052854456789-us-west1/Men%C3%BAs/mole%20poblano.jpg';

const Checkout: React.FC<CheckoutProps> = () => {
    const { cart, updateQuantity, removeFromCart, clearCart } = useShoppingCart();
    const { location } = useLocation();
    const { user, updateAuthUser } = useAuth();
    const navigate = useNavigate();
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [error, setError] = useState('');
    
    // Estados para Cupones
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
    const [couponError, setCouponError] = useState('');

    const isCorpClient = !!user?.companyId;
    const initialPaymentMode: PaymentMode = (isCorpClient && (user?.credits || 0) > 0) ? 'credits' : 'card';
    const [paymentMode, setPaymentMode] = useState<PaymentMode>(initialPaymentMode);

    const DELIVERY_FEE = location === 'BOG' || location === 'MDE' ? 6000 : 45;
    const subtotal = cart.reduce((acc: number, item: CartItem) => acc + item.menuItem.price * item.quantity, 0);
    
    // Cálculo de Descuento
    let discountAmount = 0;
    if (appliedCoupon) {
        if (appliedCoupon.type === 'percentage') {
            discountAmount = subtotal * (appliedCoupon.value / 100);
        } else {
            discountAmount = appliedCoupon.value;
        }
    }

    const total = Math.max(0, (subtotal + DELIVERY_FEE) - discountAmount);
    const hasEnoughCredits = isCorpClient && (user?.credits || 0) >= total;

    const formatCurrency = (price: number, currency: string) => {
        return new Intl.NumberFormat(location === 'BOG' || location === 'MDE' ? 'es-CO' : 'es-MX', {
            style: 'currency',
            currency: currency || 'COP',
            minimumFractionDigits: 0
        }).format(price);
    }

    const handleApplyCoupon = async () => {
        setCouponError('');
        if (!couponCode.trim()) return;

        try {
            const coupons = await getCoupons();
            const found = coupons.find(c => c.code.toUpperCase() === couponCode.toUpperCase());
            
            if (found) {
                setAppliedCoupon(found);
                setCouponCode('');
            } else {
                setCouponError('Cupón no válido o expirado.');
            }
        } catch (e) {
            setCouponError('Error al validar cupón.');
        }
    };

    const handlePlaceOrderWithCredits = async () => {
        if (!user) return;
        if (!hasEnoughCredits) {
            setError('Tu saldo de créditos es insuficiente para cubrir este pedido.');
            return;
        }
        setIsProcessing(true);
        setError('');
        try {
            // PROCESO INTERNO: Validación y deducción de créditos sin pasarela externa
            const updatedUser = await deductUserCredits(user.id, total);
            if (updatedUser) {
                const newOrder = await addOrder({
                    userId: user.id,
                    items: [...cart],
                    total: total,
                    date: new Date().toISOString(),
                    status: 'pagado'
                });
                await sendOrderConfirmationEmail(newOrder, user);
                updateAuthUser({ credits: updatedUser.credits });
                setOrderPlaced(true);
                clearCart();
            } else {
                setError('No pudimos procesar tus créditos en este momento.');
            }
        } catch (e) {
            setError('Error crítico al procesar el pago interno.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (orderPlaced) {
        return (
            <div className="container mx-auto px-4 py-20 text-center animate-fade-in max-w-2xl">
                 <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 text-5xl shadow-inner border border-green-100">🥗</div>
                 <h1 className="text-4xl font-black text-green-800 uppercase tracking-tighter">¡Pedido Confirmado!</h1>
                 <p className="mt-4 text-green-700 text-lg font-medium">Tu almuerzo corporativo ha sido procesado exitosamente usando tus créditos. ¡Buen provecho!</p>
                 <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
                    <Button onClick={() => navigate('/dashboard')} variant="secondary" className="!py-4 !px-8">Ir a mis pedidos</Button>
                    <Button onClick={() => navigate('/')} variant="outline" className="!py-4 !px-8">Regresar al inicio</Button>
                 </div>
            </div>
        );
    }

    const firstName = user?.name.split(' ')[0] || 'Cliente';
    const lastName = user?.name.split(' ').slice(1).join(' ') || 'Hungers';
    const currentCurrency = cart[0]?.menuItem.currency || 'COP';

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            {isRedirecting && (
                <div className="fixed inset-0 bg-white/95 backdrop-blur-md z-[999] flex flex-col items-center justify-center">
                    <div className="relative">
                        <div className="w-24 h-24 border-8 border-green-50 rounded-full"></div>
                        <div className="w-24 h-24 border-8 border-green-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                    </div>
                    <p className="text-green-800 font-black uppercase tracking-[0.25em] text-sm mt-8 animate-pulse">Redirigiendo a Pasarela Segura...</p>
                </div>
            )}

            <h1 className="text-4xl font-black text-green-800 mb-10 uppercase tracking-tighter">Finalizar pedido</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-8">
                    {/* Lista de Productos */}
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-green-100/50">
                        <h2 className="text-xs font-black text-green-600 mb-6 uppercase tracking-[0.2em]">Tu Selección</h2>
                        {cart.length > 0 ? cart.map((item) => (
                            <div key={item.menuItem.id} className="flex items-center gap-6 py-5 border-b border-green-50 last:border-0">
                                <img src={item.menuItem.imageUrl} className="w-20 h-20 rounded-2xl object-cover shadow-sm border border-green-50" alt={item.menuItem.name} onError={e => (e.target as HTMLImageElement).src = FALLBACK_IMAGE} />
                                <div className="flex-grow">
                                    <p className="font-black text-green-800 text-base leading-tight uppercase tracking-tighter">{item.menuItem.name}</p>
                                    <p className="text-sm text-green-600 font-bold mt-1">{formatCurrency(item.menuItem.price, item.menuItem.currency)}</p>
                                </div>
                                <div className="flex items-center bg-green-50 rounded-xl p-1 border border-green-100">
                                    <button onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center font-black text-green-800 hover:bg-white rounded-lg transition-all">-</button>
                                    <span className="w-10 text-center text-sm font-black text-green-800">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center font-black text-green-800 hover:bg-white rounded-lg transition-all">+</button>
                                </div>
                                <button onClick={() => removeFromCart(item.menuItem.id)} className="text-red-400 hover:text-red-600 transition-colors p-2">✕</button>
                            </div>
                        )) : (
                            <p className="text-green-600/40 italic text-center py-6">Tu carrito está vacío.</p>
                        )}
                    </div>

                    {/* Selector de Método de Pago */}
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-green-100/50">
                        <h2 className="text-xs font-black text-green-600 mb-6 uppercase tracking-[0.2em]">Método de Pago</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {isCorpClient && (
                                <button 
                                    onClick={() => setPaymentMode('credits')}
                                    className={`p-6 rounded-3xl border-2 text-left transition-all ${paymentMode === 'credits' ? 'border-[#c1ff72] bg-green-50 shadow-md scale-[1.02]' : 'border-green-50 bg-white opacity-60 hover:opacity-100'}`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="font-black text-green-800 uppercase tracking-tighter">💰 Créditos Hungers</p>
                                        {hasEnoughCredits && <span className="text-[8px] bg-[#c1ff72] text-green-900 px-2 py-0.5 rounded font-black">SALDO DISPONIBLE</span>}
                                    </div>
                                    <p className="text-xs text-green-700 font-medium">Disponible: <span className="font-black">{formatCurrency(user?.credits || 0, currentCurrency)}</span></p>
                                </button>
                            )}
                            <button 
                                onClick={() => setPaymentMode('card')}
                                className={`p-6 rounded-3xl border-2 text-left transition-all ${paymentMode === 'card' ? 'border-green-600 bg-green-50 shadow-md scale-[1.02]' : 'border-green-50 bg-white opacity-60 hover:opacity-100'}`}
                            >
                                <p className="font-black text-green-800 uppercase tracking-tighter">💳 Tarjeta / PSE</p>
                                <p className="text-[10px] text-green-600 mt-2 uppercase tracking-widest font-black">Pasarela Coopcentral</p>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Columna de Resumen y Cupones */}
                <div className="space-y-6 sticky top-24 h-fit">
                    {/* Sección de Cupones */}
                    <div className="bg-white p-6 rounded-[2rem] border border-green-100 shadow-sm">
                        <h2 className="text-[10px] font-black text-green-600 mb-4 uppercase tracking-[0.2em]">¿Tienes un cupón?</h2>
                        {!appliedCoupon ? (
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                    placeholder="CÓDIGO"
                                    className="flex-grow bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-xs font-bold uppercase placeholder-gray-400 focus:ring-1 focus:ring-green-600 transition-all outline-none"
                                />
                                <button 
                                    onClick={handleApplyCoupon}
                                    className="bg-green-800 text-white text-[10px] font-black px-4 py-2 rounded-xl hover:bg-black transition-all"
                                >
                                    APLICAR
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between bg-green-50 border border-green-200 p-3 rounded-xl animate-fade-in">
                                <div>
                                    <p className="text-[9px] font-black text-green-800 uppercase tracking-widest">Cupón Activo</p>
                                    <p className="text-sm font-bold text-green-900">{appliedCoupon.code}</p>
                                </div>
                                <button 
                                    onClick={() => setAppliedCoupon(null)}
                                    className="text-red-500 hover:text-red-700 font-bold p-2"
                                >
                                    ✕
                                </button>
                            </div>
                        )}
                        {couponError && <p className="text-red-500 text-[9px] font-bold mt-2 ml-1">{couponError}</p>}
                    </div>

                    {/* Resumen de Pago */}
                    <div className="bg-green-50 p-8 rounded-[3rem] shadow-xl border border-green-100">
                        <h2 className="text-xs font-black text-green-800 mb-8 uppercase tracking-[0.25em] border-b border-green-200 pb-4">Detalle de pago</h2>
                        <div className="space-y-4 mb-10">
                            <div className="flex justify-between text-green-700 text-sm font-medium"><span>Subtotal</span><span>{formatCurrency(subtotal, currentCurrency)}</span></div>
                            <div className="flex justify-between text-green-700 text-sm font-medium"><span>Domicilio</span><span>{formatCurrency(DELIVERY_FEE, currentCurrency)}</span></div>
                            
                            {appliedCoupon && (
                                <div className="flex justify-between text-green-600 text-sm font-black animate-fade-in italic">
                                    <span>Descuento ({appliedCoupon.code})</span>
                                    <span>-{formatCurrency(discountAmount, currentCurrency)}</span>
                                </div>
                            )}

                            <div className="flex justify-between font-black text-3xl text-green-800 pt-6 border-t border-green-200 mt-6 tracking-tighter leading-none">
                                <span>Total</span>
                                <span>{formatCurrency(total, currentCurrency)}</span>
                            </div>
                        </div>

                        {paymentMode === 'credits' ? (
                            <div className="animate-fade-in">
                                {error && <p className="text-red-600 text-[10px] font-black uppercase mb-4 bg-white p-4 rounded-2xl border border-red-100 text-center shadow-sm">{error}</p>}
                                <Button 
                                    onClick={handlePlaceOrderWithCredits} 
                                    disabled={!hasEnoughCredits || isProcessing || cart.length === 0} 
                                    className="w-full !py-5 shadow-2xl !font-black uppercase tracking-widest !text-sm border-none !bg-[#c1ff72] !text-green-900"
                                >
                                    {isProcessing ? 'Validando...' : 'Confirmar con Créditos'}
                                </Button>
                                <p className="text-[9px] text-green-600 text-center mt-6 font-bold uppercase tracking-widest opacity-60">Pago Interno Hungers - Sin Recargo</p>
                            </div>
                        ) : (
                            <div className="animate-fade-in">
                                <form 
                                    method="post" 
                                    action="https://merchantaavance.coopcentral.com.co/cartaspago/redirect" 
                                    target="_top"
                                    className="w-full"
                                >
                                    <input name="merchant_id" type="hidden" value="2099" />
                                    <input name="form_id" type="hidden" value="16831" />
                                    <input name="terminal_id" type="hidden" value="1510" />
                                    <input name="order_number" type="hidden" value={`HG-${Date.now()}`} />
                                    <input name="amount" type="hidden" value={Math.round(total).toString()} />
                                    <input name="currency" type="hidden" value={location === 'BOG' || location === 'MDE' ? 'cop' : 'mxn'} />
                                    <input name="order_description" type="hidden" value={`Compra Hungers: ${cart.length} almuerzos${appliedCoupon ? ' (Con cupón)' : ''}`} />
                                    <input name="color_base" type="hidden" value="#2c5234" />
                                    
                                    <input name="client_email" type="hidden" value={user?.email || ''} />
                                    <input name="client_phone" type="hidden" value={user?.phone || '3000000000'} />
                                    <input name="client_firstname" type="hidden" value={firstName} />
                                    <input name="client_lastname" type="hidden" value={lastName} />
                                    <input name="client_doctype" type="hidden" value="4" />
                                    <input name="client_numdoc" type="hidden" value={user?.nit || '1234567890'} />
                                    <input name="response_url" type="hidden" value={window.location.origin} />
                                    
                                    <button 
                                        type="submit" 
                                        onClick={() => setIsRedirecting(true)}
                                        disabled={cart.length === 0}
                                        className="w-full bg-[#de0c3e] text-white font-black py-5 rounded-full transition-all shadow-[0_15px_30px_rgba(222,12,62,0.3)] uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:bg-[#b00a31] hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed border-none"
                                    >
                                        Pagar con Tarjeta 💳
                                    </button>
                                    <p className="text-[9px] text-green-600 text-center mt-6 font-bold uppercase tracking-widest opacity-60">Seguridad Garantizada Coopcentral</p>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
