
import React from 'react';
import { Page } from '../types';
import Logo from './Logo';
import { useNavigate } from 'react-router-dom';

interface FooterProps {
    setCurrentPage?: (page: Page) => void;
}

const SocialIcon: React.FC<{ href: string, children: React.ReactNode }> = ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-green-700 hover:text-green-800 transition-colors">
        {children}
    </a>
);


const Footer: React.FC<FooterProps> = () => {
  const navigate = useNavigate();
  return (
    <footer className="bg-[#fcfdfc] border-t border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <Logo onClick={() => navigate('/')} className="h-14 transform hover:scale-105 transition-transform"/>
            <p className="text-hungers-green-900/60 text-sm font-medium leading-relaxed">Transformando el almuerzo corporativo en una experiencia con propósito social y sabor local.</p>
          </div>
          <div>
            <h3 className="text-[11px] font-black text-hungers-green-900 tracking-[0.2em] uppercase mb-8">Navegación</h3>
            <ul className="space-y-4">
              <li><button onClick={() => navigate('/')} className="text-sm font-bold text-hungers-green-900/60 hover:text-hungers-green-900 transition-colors">Home</button></li>
              <li><button onClick={() => navigate('/empresas')} className="text-sm font-bold text-hungers-green-900/60 hover:text-hungers-green-900 transition-colors">Empresas</button></li>
              <li><button onClick={() => navigate('/cocineros')} className="text-sm font-bold text-hungers-green-900/60 hover:text-hungers-green-900 transition-colors">Cocineros</button></li>
              <li><button onClick={() => navigate('/nosotros')} className="text-sm font-bold text-hungers-green-900/60 hover:text-hungers-green-900 transition-colors">Nosotros</button></li>
            </ul>
          </div>
          <div>
            <h3 className="text-[11px] font-black text-hungers-green-900 tracking-[0.2em] uppercase mb-8">Legal</h3>
            <ul className="space-y-4">
              <li><button onClick={() => navigate('/terminos')} className="text-sm font-bold text-hungers-green-900/60 hover:text-hungers-green-900 transition-colors text-left">Términos y Condiciones</button></li>
              <li><a href="#" className="text-sm font-bold text-hungers-green-900/60 hover:text-hungers-green-900 transition-colors">Política de Privacidad</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-[11px] font-black text-hungers-green-900 tracking-[0.2em] uppercase mb-8">Síguenos</h3>
            <div className="flex space-x-4">
                {[
                    { label: 'FB', icon: 'F' },
                    { label: 'IG', icon: 'I' },
                    { label: 'TW', icon: 'T' }
                ].map((social, i) => (
                    <a key={i} href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-[11px] font-black text-hungers-green-900 hover:bg-hungers-lime-500 transition-all duration-300">
                        {social.icon}
                    </a>
                ))}
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-100 text-center">
          <p className="text-[11px] font-black text-hungers-green-900/30 uppercase tracking-[0.2em]">&copy; {new Date().getFullYear()} Hungers. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
