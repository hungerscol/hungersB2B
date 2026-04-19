
import React, { useState, useEffect } from 'react';
import Button from './Button.tsx';
import { findUserByEmail, sendPasswordRecoveryEmail } from '../data.ts';

interface ForgotPasswordModalProps {
    onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ onClose }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                onClose();
            }, 6000); 
            return () => clearTimeout(timer);
        }
    }, [message, onClose]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const user = await findUserByEmail(email);

            if (user) {
                await sendPasswordRecoveryEmail(email);
                setMessage('Hemos enviado las instrucciones para restablecer tu contraseña. Por favor, revisa tu bandeja de entrada y spam.');
            } else {
                setMessage('Si existe una cuenta asociada a este correo, hemos enviado las instrucciones de recuperación.');
            }
        } catch (error) {
            setMessage('Ocurrió un error al procesar tu solicitud. Intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };
    
    const inputStyles = "w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-700 focus:border-green-700 transition bg-white text-green-900 shadow-sm";

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-[2rem] shadow-2xl p-8 w-full max-w-md animate-fade-in" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black text-green-900 uppercase tracking-tighter">Recuperar Acceso</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-green-800 text-3xl font-light">&times;</button>
                </div>
                
                {!message ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <p className="text-sm text-green-700 leading-relaxed font-medium">
                            Ingresa tu correo registrado y te enviaremos un enlace seguro para crear una nueva contraseña.
                        </p>
                        <div>
                            <label className="block text-[10px] font-black text-green-700 uppercase tracking-widest mb-1 ml-1">Correo Electrónico</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="tu@email.com"
                                required
                                className={inputStyles}
                            />
                        </div>
                        <Button type="submit" className="w-full !py-4 shadow-xl !font-black uppercase tracking-widest" disabled={loading}>
                            {loading ? 'Validando...' : 'Enviar Enlace'}
                        </Button>
                    </form>
                ) : (
                    <div className="text-center p-6 bg-green-50 rounded-2xl border border-green-100 animate-fade-in">
                        <div className="text-5xl mb-4">📧</div>
                        <p className="text-green-800 font-bold text-sm leading-relaxed">{message}</p>
                        <button onClick={onClose} className="mt-8 text-[10px] font-black text-green-700 uppercase tracking-[0.2em] hover:underline">Cerrar Ventana</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPasswordModal;
