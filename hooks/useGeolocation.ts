
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export const GEOLOCATION_CONFIG = {
  BOG: { name: 'Bogotá', url: '/bogota', flag: '🏙️', cookieName: 'user_location' },
  MDE: { name: 'Medellín', url: '/medellin', flag: '⛰️', cookieName: 'user_location' }
};

export const useGeolocation = () => {
  const [suggestion, setSuggestion] = useState<string | null>(null);

  useEffect(() => {
    const checkLocation = async () => {
      const savedLocation = Cookies.get('user_location');
      if (savedLocation) return;

      try {
        const res = await fetch('https://freeipapi.com/api/json');
        if (!res.ok) throw new Error('Servicio de geolocalización no disponible');
        
        const data = await res.json();
        const city = data.cityName; // "Bogotá", "Medellín", etc.
        const country = data.countryCode;

        if (country === 'CO') {
            if (city?.toLowerCase().includes('medellin')) {
                setSuggestion('MDE');
            } else if (city?.toLowerCase().includes('bogota')) {
                setSuggestion('BOG');
            }
        }
      } catch (error) {
        console.debug("Geolocalización omitida: El servicio fue bloqueado o no está disponible.");
      }
    };

    checkLocation();
  }, []);

  const setLocationPreference = (locationCode: string) => {
    Cookies.set('user_location', locationCode, { expires: 30 });
    setSuggestion(null);
  };

  return { suggestion, setLocationPreference, config: GEOLOCATION_CONFIG };
};
