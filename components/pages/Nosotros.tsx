
import React from 'react';
import Button from '../Button';
import { teamMembers, aboutUsContent } from '../../data';
import { useSEO } from '../../hooks/useSEO';
import { useNavigate } from 'react-router-dom';

interface NosotrosProps {}

interface TeamMember {
  name: string;
  role: string;
  imageUrl: string;
}

const Nosotros: React.FC<NosotrosProps> = () => {
  const navigate = useNavigate();
  useSEO({
    title: 'Hungers | Sobre Nosotros',
    description: 'Nuestra misión es transformar el almuerzo corporativo en una experiencia humana, deliciosa y con propósito. Conoce nuestra historia y al equipo detrás de Hungers.',
  });

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-hungers-lime-500 py-20 sm:py-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-hungers-green-900/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
        <div className="container mx-auto px-4 text-center relative z-10 animate-fade-in">
          <p className="text-hungers-green-900/40 font-black uppercase tracking-[0.4em] mb-6 text-xs">Nuestra Misión</p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-hungers-green-950 uppercase tracking-tighter leading-[1.1]">Alimentamos el futuro <br/> del trabajo</h1>
          <p className="mt-8 text-lg md:text-xl max-w-3xl mx-auto text-hungers-green-900 font-medium leading-relaxed">Transformamos el almuerzo corporativo en una experiencia humana, deliciosa y con propósito, fortaleciendo a las comunidades locales un platillo a la vez.</p>
        </div>
      </section>

      {/* Story Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-black text-hungers-green-900 mb-8 uppercase tracking-tighter leading-tight">La chispa que lo <br/> inició todo</h2>
            <div className="text-gray-500 leading-relaxed space-y-6 text-lg font-medium">
              <p>Hungers nació de una simple frustración: almuerzos de oficina aburridos, caros y sin alma.</p>
              <p>Como muchos, pasábamos nuestros días en una oficina, soñando con comida casera saludable que nos recordara a la casa. Esa comida que realmente alimenta, no solo llena.</p>
              <p>Al mismo tiempo, veíamos a nuestro alrededor un talento culinario enorme en cocineros locales y emprendedores gastronómicos que luchaban por encontrar oportunidades para crecer.</p>
              <p>Ahí fue cuando lo vimos claro: había dos "hambres". El hambre de las oficinas y personas por comida real, y el hambre de los cocineros por desarrollarse. Decidimos conectar esos dos mundos.</p>
              <p className="font-black text-hungers-green-900 italic">Así nació Hungers: un puente entre el talento de las cocinas locales y el corazón de las empresas.</p>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-4 bg-hungers-lime-500 rounded-[4rem] blur-3xl opacity-10 group-hover:opacity-20 transition-opacity duration-1000"></div>
            <img 
              src={aboutUsContent.storyImage} 
              alt="Talento culinario local preparando alimentos con amor" 
              className="relative block rounded-5xl shadow-premium w-full h-[600px] object-cover border-8 border-white transition-transform duration-700 group-hover:scale-[1.02]" 
              loading="lazy" 
            />
          </div>
        </div>
      </section>
      
      {/* Impact Section */}
      <section className="py-20 bg-[#fcfdfc]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-16 text-hungers-green-900 uppercase tracking-tighter">Nuestro Impacto</h2>
          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <div className="bg-white p-12 rounded-5xl shadow-premium border border-gray-100 transform hover:-translate-y-4 transition-all duration-500 group">
                <div className="text-6xl mb-8 group-hover:scale-110 transition-transform duration-500" role="img" aria-label="Cocinero">👨‍🍳</div>
                <h3 className="text-xl font-black text-hungers-green-900 mb-6 uppercase tracking-tight">Empoderamos Cocineros</h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">Ofrecemos una plataforma para que el talento local prospere, gestione su negocio y alcance nuevos clientes.</p>
            </div>
            <div className="bg-white p-12 rounded-5xl shadow-premium border border-gray-100 transform hover:-translate-y-4 transition-all duration-500 group">
                <div className="text-6xl mb-8 group-hover:scale-110 transition-transform duration-500" role="img" aria-label="Edificio">🏢</div>
                <h3 className="text-xl font-black text-hungers-green-900 mb-6 uppercase tracking-tight">Revitalizamos Empresas</h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">Mejoramos la cultura laboral, el bienestar y la productividad a través de almuerzos que conectan.</p>
            </div>
            <div className="bg-white p-12 rounded-5xl shadow-premium border border-gray-100 transform hover:-translate-y-4 transition-all duration-500 group">
                <div className="text-6xl mb-8 group-hover:scale-110 transition-transform duration-500" role="img" aria-label="Corazón verde">💚</div>
                <h3 className="text-xl font-black text-hungers-green-900 mb-6 uppercase tracking-tight">Fortalecemos Comunidades</h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">Cada pedido apoya la economía local, creando un ciclo de crecimiento y oportunidad.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl md:text-5xl font-black text-hungers-green-900 mb-16 uppercase tracking-tighter">Un equipo con hambre <br/> de cambiar las cosas</h2>
        <div className="flex flex-wrap justify-center gap-20">
          {teamMembers.map((member: TeamMember) => (
            <div key={member.name} className="max-w-[280px] group">
              <div className="relative">
                <div className="absolute inset-0 bg-hungers-green-900 rounded-full scale-0 group-hover:scale-110 transition-transform duration-500 opacity-5"></div>
                <img src={member.imageUrl} alt={member.name} className="block w-56 h-56 rounded-full mx-auto object-cover shadow-premium border-4 border-white transition-all duration-500 group-hover:scale-105" loading="lazy" />
              </div>
              <h3 className="mt-10 text-2xl font-black text-hungers-green-900 uppercase tracking-tighter leading-none">{member.name}</h3>
              <p className="text-hungers-lime-600 font-black uppercase tracking-[0.2em] text-[10px] mt-3">{member.role}</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* CTA Section */}
       <section className="bg-hungers-lime-500 py-20 relative overflow-hidden">
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-hungers-green-900/5 rounded-full -ml-48 -mb-48 blur-3xl"></div>
         <div className="container mx-auto px-4 text-center relative z-10 animate-fade-in">
           <h2 className="text-3xl md:text-5xl font-black text-hungers-green-950 uppercase tracking-tighter leading-[1.1]">¿Quieres ser parte <br/> de esta historia?</h2>
           <p className="mt-6 max-w-2xl mx-auto text-hungers-green-900 font-medium text-lg leading-relaxed">
             Ya sea que quieras mejorar los almuerzos de tu empresa o llevar tu talento culinario al siguiente nivel, nos encantaría saber de ti.
           </p>
           <div className="mt-10">
             <Button onClick={() => navigate('/contacto')} variant="secondary" className="!px-10 !py-3 shadow-premium hover:scale-105 transition-transform">
               Hablemos
             </Button>
           </div>
         </div>
       </section>
    </div>
  );
};

export default Nosotros;
