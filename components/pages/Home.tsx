
import React, { useState, useEffect } from 'react';
import { MenuItem, UserRole } from '../../types';
import Button from '../Button';
import { useLocation } from '../../contexts/LocationContext';
import { getMenuItemsByLocation } from '../../data';
import { useSEO } from '../../hooks/useSEO';
import { useNavigate } from 'react-router-dom';

const TrustBar: React.FC = () => (
    <div className="bg-gray-50 py-10 border-y border-gray-100">
        <div className="container mx-auto px-4">
            <p className="text-center text-[10px] font-black text-green-900/30 uppercase tracking-[0.3em] mb-8">Empresas que confían en nuestro impacto</p>
            <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 grayscale opacity-40">
                <span className="font-black text-xl tracking-tighter">Cámara de Comercio de Bogotá</span>
                <span className="font-black text-xl tracking-tighter">Powertrain Ventures</span>
                <span className="font-black text-xl tracking-tighter">Irrazonables</span>
                <span className="font-black text-xl tracking-tighter">Smart Digital Thinking</span>
            </div>
        </div>
    </div>
);

// Added onNavigateToMenu to HeroSectionProps to resolve App.tsx type mismatch
interface HeroSectionProps {
    onNavigateToMenu?: (itemId?: string) => void;
    onNavigateToRegister?: (role: UserRole) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onNavigateToMenu, onNavigateToRegister }) => {
    const { location } = useLocation();
    const [dbItems, setDbItems] = useState<MenuItem[]>([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        getMenuItemsByLocation(location).then(setDbItems);
    }, [location]);

    return (
        <section className="relative bg-white pt-16 pb-24 overflow-hidden">
            <div className="container mx-auto px-4 lg:px-12 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6 text-center lg:text-left">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-hungers-lime-100 border border-hungers-lime-300 mb-2">
                            <span className="text-hungers-green-900 text-[10px] font-black uppercase tracking-widest">Almuerzo Corporativo 2.0</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-hungers-green-900 leading-[1.1] tracking-tighter">
                           Planifica tus almuerzos y los de tu equipo, sin complicaciones.
                            <br />
                            <span className="text-hungers-green-600 italic">Comida casera de cocineros locales, con pedidos programados con anticipación.</span>
                        </h1>
                        <p className="text-gray-600 text-base md:text-lg max-w-xl font-medium leading-relaxed">
                            Menos fricción, más variedad y mejor coordinación para empresas y equipos.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                            <Button 
                                onClick={() => onNavigateToRegister ? onNavigateToRegister(UserRole.AdminEmpresa) : navigate('/registro')}
                                variant="secondary"
                                className="!px-8 !py-3 !rounded-2xl shadow-premium"
                            >
                                Registrar mi Empresa
                            </Button>
                            <Button 
                                onClick={() => onNavigateToMenu ? onNavigateToMenu() : navigate('/menus')}
                                variant="outline"
                                className="!px-8 !py-3 !rounded-2xl"
                            >
                                Ver Menús 
                            </Button>
                        </div>
                    </div>
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-hungers-lime-500 rounded-[4rem] blur-3xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
                        <div className="relative z-10 rounded-[4rem] overflow-hidden shadow-premium border-8 border-white">
                            <img 
                                src="https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0214596384.firebasestorage.app/o/menu-items%2FHome.jpg?alt=media&token=8354163d-1522-4679-9f19-4be7dde65e8f"
                                alt="Plato Hungers"
                                className="w-full object-cover aspect-square lg:aspect-auto h-[400px] group-hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                        <div className="absolute -bottom-6 -right-6 z-20 bg-white p-4 rounded-3xl shadow-premium border border-gray-100 animate-bounce">
                            <p className="text-2xl font-black text-hungers-green-900">4.9 ★</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Sabor Local</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// Added onNavigateToMenu to HomeProps to resolve App.tsx type mismatch
interface HomeProps {
    onNavigateToMenu?: (itemId?: string) => void;
    onNavigateToRegister?: (role: UserRole) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigateToMenu, onNavigateToRegister }) => {
  const navigate = useNavigate();
  useSEO({
    title: 'Hungers | Almuerzos con Propósito para Empresas',
    description: 'La plataforma B2B que conecta empresas con cocineros locales para transformar el almuerzo corporativo.',
  });

  return (
    <div className="bg-white">
      <HeroSection onNavigateToMenu={onNavigateToMenu} onNavigateToRegister={onNavigateToRegister} />
      <TrustBar />
      
      <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
              <div className="text-center mb-10">
                  <h2 className="text-3xl md:text-4xl font-black text-hungers-green-900 tracking-tighter uppercase mb-4 leading-none">¿Por qué Hungers?</h2>
                  <p className="text-hungers-green-700 text-base max-w-xl mx-auto">Diseñamos soluciones de alimentación que benefician a todos los niveles de tu organización.</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                  {[
                      { icon: '🚀', title: 'Agilidad B2B', desc: 'Facturación única mensual, tiqueteras digitales y logística centralizada para tu oficina.' },
                      { icon: '🥑', title: 'Salud Real', desc: 'Ingredientes frescos y preparaciones del día. Comida real para personas reales.' },
                      { icon: '🤝', title: 'Impacto Social', desc: 'Cada almuerzo impulsa a un emprendedor culinario local, fortaleciendo tu región.' }
                  ].map((item, i) => (
                      <div key={i} className="bg-white p-12 rounded-[3rem] shadow-premium border border-gray-100 hover:-translate-y-2 transition-all duration-300">
                          <div className="text-5xl mb-6">{item.icon}</div>
                          <h3 className="text-2xl font-black text-hungers-green-900 uppercase tracking-tighter mb-4">{item.title}</h3>
                          <p className="text-hungers-green-700 font-medium leading-relaxed">{item.desc}</p>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      <section className="py-16 bg-hungers-green-900 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-hungers-lime-500 rounded-full blur-[120px]"></div>
          </div>
          <div className="container mx-auto px-4 relative z-10">
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4 leading-none">¿Listo para transformar <br/> tu oficina?</h2>
              <p className="text-hungers-lime-100 text-lg mb-6 max-w-xl mx-auto opacity-80">Únete a la red más grande de almuerzos con propósito de Latinoamérica.</p>
              <Button 
                onClick={() => navigate('/registro')}
                variant="primary"
                className="!px-10 !py-3 !text-base !rounded-full !font-black uppercase tracking-widest shadow-lime hover:scale-110 transition-transform"
              >
                  Empezar ahora
              </Button>
          </div>
      </section>
    </div>
  );
};

export default Home;
