import React from 'react';
import { useGeolocation } from '../hooks/useGeolocation';
import { useCountry } from '../contexts/CountryContext';
import Button from './Button';

const CountryBanner: React.FC = () => {
  const { suggestion, setLocationPreference: setCountryPreference, config } = useGeolocation();
  const { setCountry } = useCountry();

  if (!suggestion || suggestion === 'dismissed') return null;

  const target = config[suggestion as keyof typeof config];

  const handleSwitch = () => {
    setCountryPreference(suggestion);
    setCountry(suggestion as any);
  };

  return (
    <div className="bg-hungers-green-950 text-white py-4 px-6 shadow-2xl sticky top-0 z-[110] border-b border-white/10 animate-fade-in">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-center gap-6">
        <p className="text-xs md:text-sm font-medium text-center flex items-center gap-3">
          <span className="text-2xl">{target.flag}</span>
          <span>Detectamos que estás en <strong className="text-hungers-lime-500">{target.name}</strong>. ¿Quieres ver los menús locales?</span>
        </p>
        <div className="flex items-center gap-4">
          <Button variant="primary" className="!py-2 !px-6 !text-[11px] !shadow-none font-black uppercase tracking-widest" onClick={handleSwitch}>
            Sí, cambiar
          </Button>
          <button onClick={() => setCountryPreference('dismissed')} className="text-[11px] text-white/40 hover:text-white underline underline-offset-4 transition-colors font-black uppercase tracking-widest">
            Ahora no
          </button>
        </div>
      </div>
    </div>
  );
};

export default CountryBanner;