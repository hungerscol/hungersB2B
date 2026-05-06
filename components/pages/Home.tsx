import React, { useState, useEffect } from 'react';
import { MenuItem, UserRole } from '../../types';
import Button from '../Button';
import { useLocation } from '../../contexts/LocationContext';
import { getMenuItemsByLocation } from '../../data';
import { useSEO } from '../../hooks/useSEO';
import { useNavigate } from 'react-router-dom';

interface HomeProps {
    onNavigateToMenu?: (itemId?: string) => void;
    onNavigateToRegister?: (role: UserRole) => void;
}

// ── 1. HERO ────────────────────────────────────────────────
const HeroSection: React.FC<{ onNavigateToRegister?: (role: UserRole) => void }> = ({ onNavigateToRegister }) => {
    const navigate = useNavigate();
    return (
        <section className="relative bg-white pt-16 pb-24 overflow-hidden">
            <div className="container mx-auto px-4 lg:px-12 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6 text-center lg:text-left">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-hungers-lime-100 border border-hungers-lime-300 mb-2">
                            <span className="text-hungers-green-900 text-[10px] font-black uppercase tracking-widest">Bogotá · Almuerzo Corporativo</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-hungers-green-900 leading-[1.05] tracking-tighter">
                            Tu equipo merece comer bien.
                            <br />
                            <span className="text-hungers-green-600 italic">Sin que eso sea otro problema tuyo.</span>
                        </h1>
                        <p className="text-gray-500 text-lg max-w-xl font-medium leading-relaxed">
                            Almuerzos caseros de cocineros locales en Bogotá, coordinados para ti. Configuras una vez, ellos comen bien toda la semana.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                            <Button
                                onClick={() => onNavigateToRegister ? onNavigateToRegister(UserRole.AdminEmpresa) : navigate('/registro')}
                                variant="secondary"
                                className="!px-8 !py-4 !rounded-2xl shadow-premium !text-base !font-black"
                            >
                                Piloto gratis, 2 semanas →
                            </Button>
                            <a
                                href="#como-funciona"
                                className="text-hungers-green-700 font-black text-sm uppercase tracking-widest hover:text-hungers-green-900 transition-colors underline underline-offset-4"
                            >
                                Ver cómo funciona
                            </a>
                        </div>
                    </div>
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-hungers-lime-500 rounded-[4rem] blur-3xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
                        <div className="relative z-10 rounded-[4rem] overflow-hidden shadow-premium border-8 border-white">
                            <img
                                src="https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0214596384.firebasestorage.app/o/menu-items%2FHome.jpg?alt=media&token=8354163d-1522-4679-9f19-4be7dde65e8f"
                                alt="Almuerzo casero Hungers"
                                className="w-full object-cover h-[420px] group-hover:scale-105 transition-transform duration-700"
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

// ── 2. EL PROBLEMA ────────────────────────────────────────
const ProblemaSection: React.FC = () => (
    <section className="bg-gray-50 py-20 border-y border-gray-100">
        <div className="container mx-auto px-4 max-w-4xl text-center">
            <p className="text-[10px] font-black text-hungers-green-900/30 uppercase tracking-[0.3em] mb-6">El contexto</p>
            <h2 className="text-3xl md:text-4xl font-black text-hungers-green-900 tracking-tighter leading-tight mb-8">
                El corrientazo de siempre aburre.<br />
                El restaurante falla. El delivery es caótico.
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed max-w-2xl mx-auto">
                Y tú tienes 40 cosas más urgentes que resolver el almuerzo de tu equipo todos los días. El problema no es la comida — es la coordinación. Eso es exactamente lo que Hungers resuelve.
            </p>
        </div>
        <div className="container mx-auto px-4 mt-12">
            <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 grayscale opacity-30">
                <span className="font-black text-xl tracking-tighter text-hungers-green-900">Cámara de Comercio de Bogotá</span>
                <span className="font-black text-xl tracking-tighter text-hungers-green-900">Powertrain Ventures</span>
                <span className="font-black text-xl tracking-tighter text-hungers-green-900">Irrazonables</span>
                <span className="font-black text-xl tracking-tighter text-hungers-green-900">Smart Digital Thinking</span>
            </div>
        </div>
    </section>
);

// ── 3. LA SOLUCIÓN ────────────────────────────────────────
const SolucionSection: React.FC = () => (
    <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-6">
                    <p className="text-[10px] font-black text-hungers-green-900/30 uppercase tracking-[0.3em]">La solución</p>
                    <h2 className="text-3xl md:text-4xl font-black text-hungers-green-900 tracking-tighter leading-tight">
                        No es un restaurante.<br />
                        <span className="text-hungers-green-600 italic">Es la señora Carmen, que lleva 8 años cocinando en el barrio.</span>
                    </h2>
                    <p className="text-gray-500 text-lg leading-relaxed">
                        Cocineros locales con historia. Menús caseros que cambian cada día. Coordinación automática para tu equipo. Tú configuras una vez y listo.
                    </p>
                    <div className="grid grid-cols-3 gap-4 pt-4">
                        {[
                            { icon: '🥘', label: 'Menús caseros', desc: 'Preparados ese día' },
                            { icon: '📅', label: 'Coordinación', desc: 'Sin fricción diaria' },
                            { icon: '🤝', label: 'Cocineros locales', desc: 'Con nombre y cara' },
                        ].map((item, i) => (
                            <div key={i} className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
                                <p className="text-3xl mb-2">{item.icon}</p>
                                <p className="font-black text-hungers-green-900 text-xs uppercase tracking-tight">{item.label}</p>
                                <p className="text-gray-400 text-[10px] mt-1">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="relative rounded-[3rem] overflow-hidden bg-hungers-lime-100 h-[420px] flex items-end">
                    <div className="absolute inset-0 bg-gradient-to-t from-hungers-green-900/60 to-transparent z-10"></div>
                    <img
                        src="https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0214596384.firebasestorage.app/o/menu-items%2FHome.jpg?alt=media&token=8354163d-1522-4679-9f19-4be7dde65e8f"
                        alt="Cocinera local Hungers"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="relative z-20 p-8 text-white">
                        <p className="font-black text-xl leading-tight">"Cocino con amor desde hace 8 años.<br />Cada almuerzo lo preparo como si fuera para mi familia."</p>
                        <p className="text-hungers-lime-300 font-bold text-sm mt-2 uppercase tracking-widest">Cocinera Hungers · Bogotá</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

// ── 4. CÓMO FUNCIONA ──────────────────────────────────────
const ComoFuncionaSection: React.FC<{ onNavigateToRegister?: (role: UserRole) => void }> = ({ onNavigateToRegister }) => {
    const navigate = useNavigate();
    return (
        <section id="como-funciona" className="py-20 bg-hungers-green-900 text-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-14">
                    <p className="text-[10px] font-black text-hungers-lime-300/60 uppercase tracking-[0.3em] mb-4">El proceso</p>
                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none">
                        Tan simple como suena.
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                    {[
                        { step: '01', icon: '⚙️', title: 'Configuras', desc: 'Nos cuentas cuántas personas, qué días y el presupuesto. Una sola vez.' },
                        { step: '02', icon: '🍳', title: 'Ellos cocinan y entregan', desc: 'Nuestros cocineros preparan y llevan el almuerzo directo a tu oficina.' },
                        { step: '03', icon: '😌', title: 'Tu equipo come bien', desc: 'Sin colas, sin peleas por dónde pedir, sin que tú tengas que coordinar nada.' },
                    ].map((item, i) => (
                        <div key={i} className="bg-white/10 border border-white/10 p-8 rounded-3xl hover:bg-white/20 transition-all">
                            <p className="text-hungers-lime-300 font-black text-4xl mb-4">{item.step}</p>
                            <p className="text-4xl mb-4">{item.icon}</p>
                            <h3 className="font-black text-xl uppercase tracking-tighter mb-3">{item.title}</h3>
                            <p className="text-white/70 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ── 5. PRUEBA SOCIAL ──────────────────────────────────────
const TestimoniosSection: React.FC = () => (
    <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
            <div className="text-center mb-14">
                <p className="text-[10px] font-black text-hungers-green-900/30 uppercase tracking-[0.3em] mb-4">Lo dicen ellos, no nosotros</p>
                <h2 className="text-3xl md:text-4xl font-black text-hungers-green-900 uppercase tracking-tighter leading-none">
                    Managers que ya dejaron de preocuparse.
                </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {[
                    {
                        quote: "Todo. La calidez humana, calidad, sabor, sazón, amor por el trabajo, entrega.",
                        name: "Adriana",
                        role: "Manager · Bogotá",
                        initial: "A",
                    },
                    {
                        quote: "Los menús son variados, llegan a tiempo y nuestro equipo disfruta de la hora del almuerzo.",
                        name: "Valentina",
                        role: "Abogada · Bogotá",
                        initial: "V",
                    },
                ].map((t, i) => (
                    <div key={i} className="bg-gray-50 border border-gray-100 p-8 rounded-3xl hover:shadow-lg transition-all">
                        <p className="text-hungers-lime-400 text-4xl font-black leading-none mb-4">"</p>
                        <p className="text-hungers-green-900 text-lg font-medium leading-relaxed mb-6 italic">
                            {t.quote}
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-hungers-green-900 text-hungers-lime-300 flex items-center justify-center font-black text-xl">
                                {t.initial}
                            </div>
                            <div>
                                <p className="font-black text-hungers-green-900">{t.name}</p>
                                <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">{t.role}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

// ── 6. CTA FINAL ──────────────────────────────────────────
const CTAFinalSection: React.FC<{ onNavigateToRegister?: (role: UserRole) => void }> = ({ onNavigateToRegister }) => {
    const navigate = useNavigate();
    return (
        <section className="py-24 bg-hungers-lime-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-80 h-80 bg-hungers-lime-300 rounded-full blur-[120px] opacity-30"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-hungers-green-900 rounded-full blur-[120px] opacity-10"></div>
            <div className="container mx-auto px-4 text-center relative z-10 max-w-3xl">
                <h2 className="text-4xl md:text-6xl font-black text-hungers-green-900 tracking-tighter leading-[1.05] mb-6">
                    ¿Tu equipo come bien hoy?
                </h2>
                <p className="text-gray-600 text-xl leading-relaxed mb-10 max-w-xl mx-auto">
                    Cuéntanos y arrancamos esta semana. Piloto gratis, 2 semanas, sin contrato.
                </p>
                <Button
                    onClick={() => onNavigateToRegister ? onNavigateToRegister(UserRole.AdminEmpresa) : navigate('/registro')}
                    variant="secondary"
                    className="!px-12 !py-5 !text-lg !rounded-2xl !font-black shadow-premium hover:scale-105 transition-transform"
                >
                    Piloto gratis, 2 semanas, sin contrato →
                </Button>
                <p className="text-gray-400 text-xs mt-6 uppercase tracking-widest font-bold">Sin tarjeta de crédito · Sin compromiso · Cancelas cuando quieras</p>
            </div>
        </section>
    );
};

// ── HOME ──────────────────────────────────────────────────
const Home: React.FC<HomeProps> = ({ onNavigateToMenu, onNavigateToRegister }) => {
    useSEO({
        title: 'Hungers | Almuerzos Caseros para Empresas en Bogotá',
        description: 'Cocineros locales, menús caseros y coordinación automática para el almuerzo de tu equipo. Piloto gratis 2 semanas.',
    });

    return (
        <div className="bg-white">
            <HeroSection onNavigateToRegister={onNavigateToRegister} />
            <ProblemaSection />
            <SolucionSection />
            <ComoFuncionaSection onNavigateToRegister={onNavigateToRegister} />
            <TestimoniosSection />
            <CTAFinalSection onNavigateToRegister={onNavigateToRegister} />
        </div>
    );
};

export default Home;