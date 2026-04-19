
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import Button from '../Button.tsx';

const ImageGeneration: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('');
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateImage = async () => {
        if (!prompt.trim()) return;

        setLoading(true);
        setError(null);
        setImageUrl(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: {
                    parts: [
                        { text: `Fotografía gastronómica profesional de alta resolución, estilo publicitario, luz de estudio: ${prompt}` }
                    ]
                },
                config: {
                    imageConfig: {
                        aspectRatio: "1:1"
                    }
                } as any
            });

            const candidates = response.candidates;
            if (candidates && candidates.length > 0) {
                const part = candidates[0].content?.parts?.find(p => p.inlineData);
                if (part && part.inlineData) {
                    setImageUrl(`data:image/png;base64,${part.inlineData.data}`);
                } else {
                    throw new Error('La IA no devolvió datos de imagen.');
                }
            }
        } catch (e: any) {
            console.error("AI Generation Error:", e);
            setError(`Error al generar imagen: ${e.message || 'Intente con un prompt diferente'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-16 max-w-5xl animate-fade-in">
            <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100 grid lg:grid-cols-2">
                <div className="p-10 lg:p-16 space-y-8 bg-gray-50/50">
                    <div>
                        <h1 className="text-3xl font-black text-green-900 uppercase tracking-tighter leading-none">Estudio Visual <br/> <span className="text-green-600">Hungers AI</span></h1>
                        <p className="text-green-700 mt-4 text-sm font-medium">Genera fotografías publicitarias para tus menús corporativos en segundos.</p>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">Describe tu platillo</label>
                        <textarea
                            rows={5}
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Ej: Un bowl de pasta italiana cremosa con albahaca fresca y tomates cherry, luz lateral natural..."
                            className="w-full px-6 py-4 border-2 border-gray-200 rounded-3xl focus:ring-2 focus:ring-[#c1ff72] focus:border-green-700 transition bg-white text-green-900 text-sm shadow-inner resize-none"
                        />
                        <Button 
                            onClick={handleGenerateImage} 
                            disabled={loading || !prompt.trim()} 
                            className="w-full !py-5 shadow-2xl !font-black uppercase tracking-widest"
                        >
                            {loading ? 'Generando Fotografía...' : 'Crear Imagen IA'}
                        </Button>
                    </div>
                </div>

                <div className="bg-white flex items-center justify-center p-10 border-l border-gray-100 min-h-[400px]">
                    {loading ? (
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 border-4 border-green-700 border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="text-green-700 font-bold uppercase text-[10px] tracking-widest animate-pulse">Capturando píxeles...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-100 text-xs font-bold text-center">
                            {error}
                        </div>
                    ) : imageUrl ? (
                        <div className="animate-fade-in group relative">
                            <img src={imageUrl} alt="Resultado IA" className="rounded-3xl shadow-2xl border-4 border-white max-w-full" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl flex items-center justify-center">
                                <a href={imageUrl} download="menu-ia-hungers.png" className="bg-[#c1ff72] text-green-900 px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest">Descargar</a>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center opacity-30">
                            <span className="text-8xl">🎨</span>
                            <p className="mt-4 font-black uppercase text-xs tracking-widest text-green-900">Vista Previa</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImageGeneration;
