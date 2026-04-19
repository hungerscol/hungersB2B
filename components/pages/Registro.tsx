
import React, { useState, useEffect } from 'react';
import { UserRole } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../Logo';
import Button from '../Button';
import { useSEO } from '../../hooks/useSEO';
import { useLocation } from '../../contexts/LocationContext';
import { useNavigate } from 'react-router-dom';

interface RegistroProps {
  initialRole?: UserRole;
}

const inputStyles = "w-full px-6 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-hungers-lime-200 focus:border-hungers-green-900 transition-all bg-white shadow-sm placeholder-gray-400 text-hungers-green-950 font-medium";

const Registro: React.FC<RegistroProps> = ({ initialRole = UserRole.Cliente }) => {
    useSEO({ title: 'Hungers | Crear Cuenta', description: 'Únete a la plataforma B2B de almuerzos con propósito.' });

    const { location } = useLocation();
    const { register } = useAuth();
    const navigate = useNavigate();
    const [activeRole, setActiveRole] = useState<UserRole>(initialRole);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        companyName: '',
        city: '',
        specialty: ''
    });

    useEffect(() => {
      setActiveRole(initialRole);
    }, [initialRole]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        try {
            const userData = {
                ...formData,
                role: activeRole,
                location
            };
            
            // Basic validation
            if (!formData.email || !formData.password || !formData.name) {
                setError('Por favor completa los campos obligatorios.');
                setIsLoading(false);
                return;
            }

            if (activeRole === UserRole.Cocinero && !formData.phone) {
                setError('El teléfono es obligatorio para cocineros.');
                setIsLoading(false);
                return;
            }

            const res = await register(userData);
            if (!res.success) {
                setError(res.message);
            } else {
                navigate('/dashboard');
            }
        } catch (err: any) {
            setError('Error inesperado durante el registro.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-[#fcfdfc] min-h-screen py-20 px-4">
            <div className="max-w-xl mx-auto bg-white p-10 md:p-14 rounded-5xl shadow-premium border border-gray-100 animate-fade-in">
                <div className="text-center mb-10">
                    <Logo onClick={() => navigate('/')} className="h-14 mx-auto mb-6 transform hover:scale-105 transition-transform" />
                    <h2 className="text-4xl font-black text-hungers-green-900 uppercase tracking-tighter">Crea tu cuenta</h2>
                    <p className="text-gray-500 mt-2 font-medium">Únete a la comunidad de impacto social</p>
                </div>
                
                <div className="flex justify-center border-b border-gray-100 mb-10">
                    {[UserRole.Cliente, UserRole.Cocinero, UserRole.AdminEmpresa].map(role => (
                        <button 
                            key={role} 
                            type="button"
                            onClick={() => setActiveRole(role)}
                            className={`flex-1 py-4 text-[11px] font-black uppercase tracking-widest border-b-4 transition-all ${activeRole === role ? 'border-hungers-lime-500 text-hungers-green-900' : 'border-transparent text-gray-300 hover:text-gray-500'}`}
                        >
                            {role === UserRole.AdminEmpresa ? 'Empresa' : role}
                        </button>
                    ))}
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-8 text-xs font-bold border border-red-100 text-center animate-shake">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Nombre Completo</label>
                            <input 
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Ej. Juan Pérez" 
                                className={inputStyles} 
                                required 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Correo Electrónico</label>
                            <input 
                                name="email"
                                type="email" 
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="juan@empresa.com" 
                                className={inputStyles} 
                                required 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Contraseña</label>
                            <input 
                                name="password"
                                type="password" 
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••" 
                                className={inputStyles} 
                                required 
                            />
                        </div>

                        {activeRole === UserRole.AdminEmpresa && (
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Nombre de la Empresa</label>
                                <input 
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    placeholder="Ej. Tech Solutions S.A.S" 
                                    className={inputStyles} 
                                    required 
                                />
                            </div>
                        )}

                        {activeRole === UserRole.Cocinero && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Ciudad</label>
                                    <input 
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        placeholder="Bogotá" 
                                        className={inputStyles} 
                                        required 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Teléfono (Obligatorio)</label>
                                    <input 
                                        name="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="300 123 4567" 
                                        className={inputStyles} 
                                        required 
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Especialidad</label>
                                    <input 
                                        name="specialty"
                                        value={formData.specialty}
                                        onChange={handleChange}
                                        placeholder="Comida Tradicional" 
                                        className={inputStyles} 
                                        required 
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <Button type="submit" variant="primary" className="w-full !py-4 shadow-lime mt-6" disabled={isLoading}>
                        {isLoading ? 'Registrando...' : 'Empezar ahora'}
                    </Button>
                    
                    <p className="text-center text-xs text-gray-500 mt-8 font-medium">
                        ¿Ya tienes cuenta?{' '}
                        <button type="button" onClick={() => navigate('/login')} className="text-hungers-green-900 font-black hover:underline">Acceder</button>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Registro;
