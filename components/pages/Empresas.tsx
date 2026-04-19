
import React, { useState } from 'react';
import { UserRole } from '../../types';
import Button from '../Button';
import { useSEO } from '../../hooks/useSEO';
import { useLocation } from '../../contexts/LocationContext';
import { useNavigate } from 'react-router-dom';

interface EmpresasProps {
  onNavigateToRegister?: (role: UserRole) => void;
}

const Calculator: React.FC = () => {
    const { location } = useLocation();
    const [employees, setEmployees] = useState(15);
    const pricePerLunch = location === 'BOG' || location === 'MDE' ? 22000 : 160;
    const currency = location === 'BOG' || location === 'MDE' ? 'COP' : 'MXN';
    
    const monthlyTotal = employees * pricePerLunch * 20; // 20 días laborales

    const format = (val: number) => new Intl.NumberFormat(location === 'BOG' || location === 'MDE' ? 'es-CO' : 'es-MX', {
        style: 'currency',
        currency,
        maximumFractionDigits: 0
    }).format(val);

    return (
        <div className="bg-white p-10 rounded-5xl shadow-premium border border-gray-100 max-w-2xl mx-auto mt-20 relative overflow-hidden animate-fade-in">
            <div className="absolute top-0 right-0 w-32 h-32 bg-hungers-lime-500/10 rounded-bl-full"></div>
            <h3 className="text-2xl font-black text-hungers-green-900 uppercase tracking-tighter mb-8 text-center">Calcula el Bienestar de tu Equipo</h3>
            <div className="space-y-10 relative z-10">
                <div>
                    <div className="flex justify-between items-end mb-4">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Colaboradores en el Plan</label>
                        <span className="text-4xl font-black text-hungers-green-900">{employees}</span>
                    </div>
                    <input 
                        type="range" 
                        min="5" 
                        max="300" 
                        step="5" 
                        value={employees} 
                        onChange={(e) => setEmployees(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-hungers-lime-500"
                    />
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-8 rounded-4xl border border-gray-100">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Inversión Estimada</p>
                        <p className="text-2xl font-black text-hungers-green-900">{format(monthlyTotal)}</p>
                        <p className="text-[10px] text-gray-400 font-bold mt-1">Mensual aprox.</p>
                    </div>
                    <div className="bg-hungers-green-900 p-8 rounded-4xl text-white shadow-premium">
                        <p className="text-[10px] font-black text-hungers-lime-500 uppercase tracking-[0.2em] mb-2">Impacto Social</p>
                        <p className="text-2xl font-black">{Math.ceil(employees / 5)} Cocinas Locales</p>
                        <p className="text-[10px] text-hungers-lime-100/60 font-bold mt-1">Impulsadas directamente</p>
                    </div>
                </div>
                <p className="text-center text-xs text-gray-400 font-medium italic">"Los beneficios de alimentación reducen la rotación de personal hasta en un 20%."</p>
            </div>
        </div>
    );
}

const Empresas: React.FC<EmpresasProps> = ({ onNavigateToRegister }) => {
    const navigate = useNavigate();
    useSEO({
        title: 'Hungers | Soluciones de Alimentación B2B',
        description: 'Potencia el bienestar y productividad de tu equipo con almuerzos caseros de alto impacto social. Planes flexibles para empresas modernas.',
    });

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="relative h-[75vh] min-h-[600px] flex items-center justify-center text-center p-4 overflow-hidden bg-hungers-green-950">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1260" 
                        className="w-full h-full object-cover opacity-30" 
                        alt="Empresas disfrutando beneficios" 
                        referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-hungers-green-950/60 via-hungers-green-950/40 to-hungers-green-950"></div>
                </div>
                <div className="relative z-10 max-w-5xl px-4 animate-fade-in">
                    <p className="text-hungers-lime-500 font-black uppercase tracking-[0.4em] mb-6 text-sm md:text-base">Cultura Corporativa 2.0</p>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] tracking-tighter mb-8">
                        El beneficio que<br />
                        su equipo <span className="text-hungers-lime-500 italic">amará.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-hungers-lime-50/70 font-medium max-w-2xl mx-auto leading-relaxed">
                        Optimice el tiempo de su equipo, mejore la salud organizacional y apoye a la economía local con un solo clic.
                    </p>
                    <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Button 
                            onClick={() => onNavigateToRegister ? onNavigateToRegister(UserRole.AdminEmpresa) : navigate('/registro')}
                            variant="primary"
                            className="w-full sm:w-auto text-base px-10 py-4 shadow-lime hover:scale-105 transition-transform"
                        >
                            Registrarme como Empresa
                        </Button>
                        <Button 
                            onClick={() => navigate('/contacto')}
                            variant="outline"
                            className="w-full sm:w-auto text-base px-10 py-4 !border-white/20 !text-white hover:!bg-white hover:!text-hungers-green-900 transition-all"
                        >
                            Solicitar Demo B2B
                        </Button>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-50">
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Scroll</span>
                    <div className="w-px h-8 bg-white"></div>
                </div>
            </section>
      
            <div className="py-16 bg-[#fcfdfc]">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl md:text-5xl font-black text-hungers-green-900 uppercase tracking-tighter leading-tight">Gestión Inteligente</h2>
                            <p className="text-gray-500 text-lg mt-4 max-w-2xl mx-auto font-medium">Simplificamos la logística de alimentación para que usted se enfoque en lo que importa: su negocio.</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-12">
                             <div className="bg-white p-12 rounded-5xl shadow-premium border-b-8 border-hungers-lime-500 group hover:-translate-y-4 transition-all duration-500">
                                <div className="text-6xl mb-8 group-hover:scale-110 transition-transform duration-500">📱</div>
                                <h3 className="font-black text-hungers-green-900 uppercase text-xl mb-4 tracking-tight">App para Empleados</h3>
                                <p className="text-gray-500 font-medium leading-relaxed">Cada colaborador elige su menú semanal de forma autónoma desde nuestra plataforma intuitiva.</p>
                             </div>
                             <div className="bg-white p-12 rounded-5xl shadow-premium border-b-8 border-hungers-green-700 group hover:-translate-y-4 transition-all duration-500">
                                <div className="text-6xl mb-8 group-hover:scale-110 transition-transform duration-500">🚚</div>
                                <h3 className="font-black text-hungers-green-900 uppercase text-xl mb-4 tracking-tight">Logística Centralizada</h3>
                                <p className="text-gray-500 font-medium leading-relaxed">Entregas puntuales en un solo punto, minimizando interrupciones y optimizando la seguridad en recepción.</p>
                             </div>
                             <div className="bg-white p-12 rounded-5xl shadow-premium border-b-8 border-hungers-green-950 group hover:-translate-y-4 transition-all duration-500">
                                <div className="text-6xl mb-8 group-hover:scale-110 transition-transform duration-500">📑</div>
                                <h3 className="font-black text-hungers-green-900 uppercase text-xl mb-4 tracking-tight">Facturación Única</h3>
                                <p className="text-gray-500 font-medium leading-relaxed">Consolide todos sus gastos de alimentación en una sola factura mensual deducible de impuestos.</p>
                             </div>
                        </div>

                        <Calculator />

                        <div className="text-center mt-16">
                            <h3 className="text-3xl font-black text-hungers-green-900 uppercase tracking-tighter mb-8">¿Listo para llevar a su empresa al siguiente nivel?</h3>
                            <Button onClick={() => navigate('/contacto')} variant="secondary" className="!px-10 !py-3 shadow-premium hover:scale-105 transition-transform">
                                Hablar con un Asesor de Bienestar
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Empresas;
