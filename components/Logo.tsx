
import React from 'react';

interface LogoProps {
  onClick: () => void;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ onClick, className }) => (
    <button onClick={onClick} className={`flex items-center justify-center ${className}`}>
        <img 
            src="https://storage.googleapis.com/ai-studio-bucket-1052854456789-us-west1/Empresas/Logo_HUNGERS%20(2).png" 
            alt="Hungers Logo" 
            className="h-full w-auto object-contain" 
            referrerPolicy="no-referrer"
        />
    </button>
);

export default Logo;