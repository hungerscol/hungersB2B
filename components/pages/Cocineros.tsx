
import React from 'react';
import { UserRole } from '../../types';
import Button from '../Button';
import { useSEO } from '../../hooks/useSEO';
import { useNavigate } from 'react-router-dom';

interface CocinerosProps {
  onNavigateToRegister?: (role: UserRole) => void;
}

const FALLBACK_BANNER = 'https://images.pexels.com/photos/4252137/pexels-photo-4252137.jpeg?auto=compress&cs=tinysrgb&w=1260';

const AdvantageCard: React.FC<{ icon: string, title: string, items: string[] }> = ({ icon, title, items }) => (
    <div className="bg-white p-10 rounded-5xl shadow-premium border border-gray-100 hover:-translate-y-4 transition-all duration-500 flex flex-col h-full group">
        <div className="text-5xl mb-8 group-hover:scale-110 transition-transform duration-500">{icon}</div>
        <h3 className="text-xl font-black text-hungers-green-900 uppercase tracking-tight mb-6 leading-tight">{title}</h3>
        <ul className="space-y-3 flex-grow">
            {items.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-500 font-medium">
                    <span className="text-hungers-lime-500 font-black">/</span>
                    {item}
                </li>
            ))}
        </ul>
    </div>
);

const Step: React.FC<{ num: number, title: string, desc: string }> = ({ num, title, desc }) => (
    <div className="relative pl-16 pb-12 last:pb-0 group">
        <div className="absolute left-0 top-0 w-10 h-10 bg-hungers-green-900 text-hungers-lime-500 rounded-full flex items-center justify-center font-black text-sm z-10 group-hover:scale-110 transition-transform duration-300 shadow-premium">
            {num}
        </div>
        <div className="absolute left-5 top-10 bottom-0 w-px bg-gray-100 group-last:hidden"></div>
        <h4 className="text-lg font-black text-hungers-green-900 uppercase tracking-tighter mb-2">{title}</h4>
        <p className="text-gray-500 font-medium text-sm leading-relaxed">{desc}</p>
    </div>
);

const Cocineros: React.FC<CocinerosProps> = ({ onNavigateToRegister }) => {
  const navigate = useNavigate();
  useSEO({
    title: 'Hungers | Conviértete en Cocinero Aliado',
    description: 'Cocina, comparte y gana. Únete a la red de cocineros locales que están transformando el almuerzo corporativo.',
  });

  return (
    <div className="bg-white">
        {/* Hero Section */}
        <section className="relative h-[75vh] min-h-[600px] flex items-center justify-center text-center p-4 overflow-hidden bg-hungers-green-950">
            <div className="absolute inset-0 z-0">
                <img src={FALLBACK_BANNER} className="w-full h-full object-cover opacity-30" alt="Cocinero profesional" />
                <div className="absolute inset-0 bg-gradient-to-b from-hungers-green-950/60 via-hungers-green-950/40 to-hungers-green-950"></div>
            </div>
            <div className="relative z-10 max-w-5xl px-4 animate-fade-in">
                <p className="text-hungers-lime-500 font-black uppercase tracking-[0.4em] mb-6 text-sm md:text-base">Tu sazón, tu negocio</p>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] tracking-tighter mb-8">
                    Cocina. <br />
                    Comparte. <span className="text-hungers-lime-500 italic">Gana.</span>
                </h1>
                <p className="text-lg md:text-xl text-hungers-lime-50/70 font-medium max-w-2xl mx-auto leading-relaxed">
                    Conectamos tu talento culinario con empresas que buscan comida casera y saludable. Tú cocinas, nosotros conseguimos los clientes.
                </p>
                <div className="mt-12 flex justify-center">
                    <Button 
                        onClick={() => onNavigateToRegister ? onNavigateToRegister(UserRole.Cocinero) : navigate('/registro')} 
                        variant="primary" 
                        className="!py-4 !px-12 text-base shadow-lime hover:scale-105 transition-transform"
                    >
                        Empezar hoy mismo
                    </Button>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-50">
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Scroll</span>
                <div className="w-px h-8 bg-white"></div>
            </div>
        </section>

        {/* Ventajas Section */}
        <section className="py-20 bg-[#fcfdfc]">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-black text-hungers-green-900 uppercase tracking-tighter">Ventajas de ser aliado</h2>
                    <div className="w-20 h-1.5 bg-hungers-lime-500 mx-auto mt-4 rounded-full"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    <AdvantageCard 
                        icon="💰" 
                        title="Genera ingresos reales" 
                        items={["Vende sin invertir en un local", "Define tu propio precio", "Pagos seguros y puntuales"]} 
                    />
                    <AdvantageCard 
                        icon="📈" 
                        title="Más clientes sin esfuerzo" 
                        items={["Promocionamos tu menú", "Conexión con empresas", "Olvida el marketing digital"]} 
                    />
                    <AdvantageCard 
                        icon="🗓️" 
                        title="Producción organizada" 
                        items={["Pedidos programados", "Cocina solo lo que vendes", "Cero desperdicio de insumos"]} 
                    />
                    <AdvantageCard 
                        icon="🚚" 
                        title="Apoyo logístico" 
                        items={["Coordinamos entregas", "Enfoque 100% en la cocina", "Logística optimizada"]} 
                    />
                    <AdvantageCard 
                        icon="🤝" 
                        title="Crece con comunidad" 
                        items={["Red de cocineros locales", "Acompañamiento constante", "Construye tu reputación"]} 
                    />
                    <div className="hidden lg:flex items-center justify-center p-12 bg-hungers-green-900 rounded-5xl text-center shadow-premium">
                        <p className="text-hungers-lime-500 text-3xl font-black uppercase leading-tight tracking-tighter">Únete a la <br/> revolución <br/> culinaria</p>
                    </div>
                </div>
            </div>
        </section>

        {/* Requisitos Section */}
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="bg-hungers-green-900 rounded-[4rem] p-12 md:p-20 text-white shadow-premium relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-hungers-lime-500/10 rounded-bl-full pointer-events-none"></div>
                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-12">Requisitos de Calidad</h2>
                    
                    <div className="grid md:grid-cols-2 gap-20 relative z-10">
                        <div>
                            <h3 className="text-hungers-lime-500 text-xs font-black uppercase tracking-[0.2em] mb-8 border-b border-white/10 pb-4 flex items-center gap-3">
                                <span>✔️</span> Lo que necesitas
                            </h3>
                            <ul className="space-y-6">
                                {[
                                    "Pasión por la cocina casera y bien hecha.",
                                    "Capacidad de preparar almuerzos de forma constante.",
                                    "Cocina limpia, organizada y desinfectada.",
                                    "Compromiso total con horarios y pedidos.",
                                    "Uso básico de smartphone y WhatsApp."
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-4">
                                        <div className="w-6 h-6 rounded-full bg-hungers-lime-500/20 flex-shrink-0 flex items-center justify-center text-[10px] mt-1 text-hungers-lime-500 font-black">✓</div>
                                        <span className="text-hungers-lime-50/80 font-medium leading-relaxed">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-hungers-lime-500 text-xs font-black uppercase tracking-[0.2em] mb-8 border-b border-white/10 pb-4 flex items-center gap-3">
                                <span>🧾</span> Documentación básica
                            </h3>
                            <ul className="space-y-6">
                                {[
                                    "Documento de identidad vigente.",
                                    "Curso de manipulación de alimentos (o compromiso de realizarlo).",
                                    "Fotos reales de tu cocina y de tus mejores platos.",
                                    "Referencia personal o bancaria."
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-4">
                                        <div className="w-6 h-6 rounded-full bg-hungers-lime-500/20 flex-shrink-0 flex items-center justify-center text-[10px] mt-1 text-hungers-lime-500 font-black">✓</div>
                                        <span className="text-hungers-lime-50/80 font-medium leading-relaxed">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Proceso Section */}
        <section className="py-16 bg-[#fcfdfc] overflow-hidden">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="flex flex-col lg:flex-row gap-16 items-center">
                    <div className="lg:w-1/2">
                        <h2 className="text-4xl md:text-5xl font-black text-hungers-green-900 uppercase tracking-tighter mb-8 leading-none">
                            ¿Cómo <br /> <span className="text-hungers-lime-600">funciona?</span>
                        </h2>
                        <div className="mt-14">
                            <Step num={1} title="Te registras gratis" desc="Cuéntanos sobre ti y tu especialidad culinaria." />
                            <Step num={2} title="Creamos tu perfil" desc="Personalizamos tu espacio en la plataforma Hungers." />
                            <Step num={3} title="Publicas tu menú" desc="Sube fotos reales de tus platos y define el precio." />
                            <Step num={4} title="Recibes pedidos" desc="Mira tus ventas programadas con anticipación." />
                            <Step num={5} title="Cocinas y entregas" desc="Prepara cada almuerzo con el sazón de casa." />
                            <Step num={6} title="Ganas dinero" desc="Recibe tus pagos semanales sin complicaciones." />
                        </div>
                    </div>
                    <div className="lg:w-1/2 relative">
                        <div className="bg-hungers-lime-500 p-12 md:p-20 rounded-5xl shadow-premium relative z-10 transform rotate-2">
                            <div className="text-5xl mb-8">💬</div>
                            <p className="text-hungers-green-950 text-2xl md:text-3xl font-black italic leading-relaxed mb-10 tracking-tighter">
                                “Gracias a Hungers ahora vendo todos los días sin preocuparme por conseguir clientes. Mi pasión por la cocina se convirtió en mi sustento real.”
                            </p>
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 bg-hungers-green-900 rounded-full flex items-center justify-center text-white font-bold text-2xl">👩‍🍳</div>
                                <div>
                                    <p className="font-black text-hungers-green-900 uppercase text-sm tracking-widest">Maria Rodriguez</p>
                                    <p className="text-hungers-green-900/60 text-[10px] font-black uppercase tracking-widest">Cocinera Aliada Hungers</p>
                                </div>
                            </div>
                        </div>
                        <div className="absolute -top-10 -right-10 w-48 h-48 bg-hungers-green-900 rounded-full opacity-5"></div>
                        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-hungers-green-900 rounded-full opacity-5"></div>
                    </div>
                </div>
            </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 bg-hungers-green-950 text-white text-center px-4 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
                 <div className="absolute top-0 left-0 w-96 h-96 bg-hungers-lime-500 rounded-full blur-[150px]"></div>
                 <div className="absolute bottom-0 right-0 w-96 h-96 bg-hungers-lime-500 rounded-full blur-[150px]"></div>
            </div>
            <div className="max-w-4xl mx-auto relative z-10 animate-fade-in">
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6 leading-[0.95]">
                    Convierte tu pasión <br /> en <span className="text-hungers-lime-500">ingresos estables</span>
                </h2>
                <p className="text-hungers-lime-50/60 text-lg md:text-xl mb-10 font-medium max-w-2xl mx-auto">
                    Únete hoy a la plataforma B2B de almuerzos más grande de la región y empieza a cocinar con propósito.
                </p>
                <div className="flex justify-center">
                    <Button 
                        onClick={() => onNavigateToRegister ? onNavigateToRegister(UserRole.Cocinero) : navigate('/registro')}
                        variant="primary"
                        className="!py-4 !px-12 text-base shadow-lime hover:scale-105 transition-transform"
                    >
                        Quiero ser Cocinero
                    </Button>
                </div>
            </div>
        </section>
    </div>
  );
};

export default Cocineros;
