import React, { useState, useEffect } from 'react';

const APIDocs: React.FC = () => {
    const [spec, setSpec] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSpec = async () => {
            try {
                // Forzamos ruta absoluta para evitar problemas con la navegación lazy
                const response = await fetch(`${window.location.origin}/swagger.json`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setSpec(data);
            } catch (err: any) {
                console.error("Failed to load swagger spec", err);
                setError(`No se pudo cargar la especificación de la API.`);
            } finally {
                setLoading(false);
            }
        };

        fetchSpec();
    }, []);

    const renderContent = () => {
        if (loading) return (
            <div className="flex flex-col justify-center items-center p-12">
                <div className="animate-spin h-8 w-8 border-4 border-green-700 border-t-transparent rounded-full mb-4"></div>
                <p className="text-green-700 text-xs font-bold uppercase tracking-widest">Cargando Documentación...</p>
            </div>
        );
        
        if (error) return <p className="text-center text-red-600 p-8 font-bold">{error}</p>;
        
        if (spec) {
            return (
                <div className="space-y-8 animate-fade-in">
                    <header className="border-b border-gray-100 pb-6">
                        <h2 className="text-2xl font-black text-green-900 uppercase tracking-tighter">{spec.info.title} <span className="text-green-600 text-sm font-bold ml-2">v{spec.info.version}</span></h2>
                        <p className="text-green-700 mt-2">{spec.info.description}</p>
                    </header>

                    <section className="bg-green-50 border border-green-100 p-6 rounded-2xl">
                        <h3 className="font-black text-green-900 uppercase tracking-widest text-xs mb-4">Endpoints Disponibles</h3>
                        <div className="grid gap-4">
                            {Object.keys(spec.paths).map(path => (
                                <div key={path} className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-50">
                                    <span className="bg-green-900 text-[#c1ff72] px-2 py-1 rounded font-black text-[10px] uppercase w-fit">
                                        {Object.keys(spec.paths[path])[0]}
                                    </span>
                                    <code className="text-xs sm:text-sm font-mono text-green-800 break-all">{path}</code>
                                    <span className="text-[10px] sm:text-xs text-gray-500 sm:ml-auto italic">{spec.paths[path][Object.keys(spec.paths[path])[0]].summary}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="flex justify-center pt-8">
                        <a 
                            href="/swagger.json" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-green-900 text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:bg-black transition-all shadow-xl hover:scale-105"
                        >
                            Descargar OpenAPI Spec (JSON)
                        </a>
                    </div>
                </div>
            );
        }
        return null;
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-gray-50">
                {renderContent()}
            </div>
        </div>
    );
};

export default APIDocs;