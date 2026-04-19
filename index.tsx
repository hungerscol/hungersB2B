
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './components/App';
import ErrorBoundary from './components/ErrorBoundary';
import { GlobalStoreProvider } from './contexts/GlobalStoreContext';
import { AuthProviderWrapper } from './contexts/AuthProviderWrapper';

console.log("🚀 Hungers Boot: Iniciando bootstrap...");

const container = document.getElementById('root');

if (container) {
    try {
        const root = createRoot(container);
        root.render(
            <React.StrictMode>
                <ErrorBoundary>
                    <AuthProviderWrapper>
                        <GlobalStoreProvider>
                            <App />
                        </GlobalStoreProvider>
                    </AuthProviderWrapper>
                </ErrorBoundary>
            </React.StrictMode>
        );
        console.log("✅ Hungers Boot: Renderizado inicial completado.");
    } catch (err) {
        console.error("❌ Hungers Boot Error:", err);
        const overlay = document.getElementById('app-error-overlay');
        if (overlay) overlay.style.display = 'flex';
    }
} else {
    console.error("❌ Hungers Boot: No se encontró el elemento #root.");
}

// Capturar errores globales de carga de módulos
window.addEventListener('error', (e) => {
    if (e.message.includes('import') || e.message.includes('Script error')) {
        const overlay = document.getElementById('app-error-overlay');
        if (overlay) overlay.style.display = 'flex';
    }
});
