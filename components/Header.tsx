
import React, { useState, useRef, useEffect } from 'react';
import { Page, UserRole, Location, CartItem } from '../types';
import Button from './Button';
import { useLocation } from '../contexts/LocationContext';
import { useAuth } from '../contexts/AuthContext';
import { useShoppingCart } from '../contexts/ShoppingCartContext';
import { LOCATIONS } from '../data';
import Logo from './Logo';
import { useNavigate, useLocation as useRouteLocation } from 'react-router-dom';

interface HeaderProps {}

const LocationSelector: React.FC = () => {
    const { location, setLocation } = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const selectedLocation = LOCATIONS.find((l: Location) => l.code === location);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="flex items-center space-x-1.5 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all focus:outline-none"
            >
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{selectedLocation?.code}</span>
                <span className="font-bold text-[13px] text-hungers-green-900">{selectedLocation?.name}</span>
                <span className="text-[10px] text-gray-400 ml-1">▼</span>
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl z-[200] border border-gray-100 overflow-hidden animate-fade-in">
                    <ul className="py-2">
                        {LOCATIONS.map((l: Location) => (
                            <li key={l.code}>
                                <button 
                                    onClick={() => {
                                        setLocation(l.code);
                                        setIsOpen(false);
                                    }}
                                    className="w-full text-left flex items-center px-5 py-3.5 text-[11px] font-black text-hungers-green-800 hover:bg-hungers-lime-500/20 transition-colors uppercase tracking-widest"
                                >
                                    <span className="mr-3 text-lg">{l.flag}</span>
                                    <span>{l.name}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

const ShoppingCartIcon: React.FC<{ onClick: () => void }> = ({ onClick }) => {
    const { cart } = useShoppingCart();
    const itemCount = cart.reduce((total: number, item: CartItem) => total + item.quantity, 0);

    return (
        <button onClick={onClick} className="relative p-2.5 text-hungers-green-900 hover:scale-110 transition-transform">
            <span className="text-2xl">🛒</span>
            {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full border-2 border-white shadow-md animate-bounce">
                    {itemCount}
                </span>
            )}
        </button>
    )
}

const Header: React.FC<HeaderProps> = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const routeLocation = useRouteLocation();
  
  const canChangeLocation = !user || (user.role !== UserRole.AdminEmpresa && user.role !== UserRole.Cocinero);
  const navItems = user ? [Page.Dashboard] : [Page.Home, Page.Empresas, Page.Cocineros, Page.Menus, Page.Nosotros];

  const getPath = (page: Page) => {
    switch (page) {
        case Page.Home: return '/';
        case Page.Empresas: return '/empresas';
        case Page.Cocineros: return '/cocineros';
        case Page.Menus: return '/menus';
        case Page.Nosotros: return '/nosotros';
        case Page.Contacto: return '/contacto';
        case Page.LoginCliente: return '/login';
        case Page.Dashboard: return '/dashboard';
        case Page.Checkout: return '/checkout';
        case Page.Registro: return '/registro';
        case Page.Terminos: return '/terminos';
        default: return '/';
    }
  };

  return (
    <header className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-gray-100 z-[100] transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between h-20 md:h-24">
          <div className="flex-shrink-0 transform hover:scale-105 transition-all duration-500">
            <Logo onClick={() => navigate(user ? '/dashboard' : '/')} className="h-10 md:h-12"/>
          </div>
          
          <nav className="hidden md:flex items-center gap-10">
            {navItems.map((page: Page) => {
              const path = getPath(page);
              const isActive = routeLocation.pathname === path;
              return (
                <button 
                  key={page} 
                  onClick={() => navigate(path)} 
                  className={`relative text-[16px] font-black transition-all group py-2 ${
                      isActive 
                      ? 'text-hungers-green-900' 
                      : 'text-hungers-green-900/60 hover:text-hungers-green-900'
                  }`}
                >
                  {page}
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-hungers-lime-500 transition-transform duration-300 origin-left ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-5">
            {canChangeLocation && <LocationSelector />}
            <ShoppingCartIcon onClick={() => navigate(user ? '/checkout' : '/login')} />
            
            {user ? (
                <Button onClick={logout} variant="outline" className="!rounded-full !px-8 !py-2.5 !text-[12px] !font-black uppercase tracking-widest border-gray-200 hover:border-hungers-green-900">Salir</Button>
            ) : (
                <Button 
                    onClick={() => navigate('/login')}
                    variant="primary"
                    className="!rounded-full !px-10 !py-3.5 !text-[13px] !font-black uppercase tracking-widest shadow-lime"
                >
                    Acceder
                </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
