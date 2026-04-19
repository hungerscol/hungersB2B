
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import Button from '../../Button';

const ImageGeneration: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('');
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
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
                        { text: `Fotografía gastronómica de alta resolución, estilo minimalista y elegante: ${prompt}` }
                    ]
                },
                config: {
                    imageConfig: { aspectRatio: "1:1" }
                } as any
            });

            const candidates = response.candidates;
            if (candidates && candidates.length > 0) {
                const part = candidates[0].content?.parts?.find(p => p.inlineData);
                if (part?.inlineData) {
                    setImageUrl(`data:image/png;base64,${part.inlineData.data}`);
                } else {
                    throw new Error('La IA no pudo procesar la imagen solicitada.');
                }
            } else {
                throw new Error('La IA no devolvió candidatos.');
            }
        } catch (e: any) {
            console.error("Generación IA fallida:", e);
            setError("Hubo un problema al generar la imagen. Intenta con una descripción más sencilla.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-[2.5rem] shadow-xl p-6 md:p-10 border border-gray-100 animate-fade-in">
            <div className="max-w-2xl mx-auto text-center">
                <div className="w-16 h-16 bg-[#c1ff72] rounded-2xl flex items-center justify-center mx-auto mb-4 transform -rotate-6 shadow-lg">
                    <span className="text-3xl">🎨</span>
                </div>
                <h1 className="text-3xl font-black text-green-900 uppercase tracking-tighter">Laboratorio Visual IA</h1>
                <p className="text-green-700 mt-2 text-sm">Genera fotografías para el catálogo de menús usando inteligencia artificial.</p>
                
                <div className="mt-10 bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
                    <textarea
                        rows={4}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Ej: Un bowl de ensalada fresca con quinoa, aguacate y granada, luz natural..."
                        className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#c1ff72] focus:border-green-700 transition bg-white text-sm"
                    />
                    <Button onClick={handleGenerate} disabled={loading || !prompt.trim()} className="w-full mt-4 !py-4 shadow-xl font-black uppercase tracking-widest">
                        {loading ? 'Generando Arte...' : 'Crear Fotografía IA'}
                    </Button>
                </div>

                <div className="mt-10 min-h-[400px] flex items-center justify-center border-2 border-dashed border-gray-100 rounded-[2.5rem] bg-gray-50/50 overflow-hidden">
                    {loading ? (
                        <div className="animate-pulse flex flex-col items-center">
                            <div className="w-12 h-12 border-4 border-green-700 border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="text-green-800 font-black uppercase text-[10px] tracking-widest">Procesando píxeles...</p>
                        </div>
                    ) : error ? (
                        <p className="text-red-500 font-bold p-8">{error}</p>
                    ) : imageUrl ? (
                        <div className="p-4 animate-fade-in">
                            <img src={imageUrl} alt="Resultado IA" className="rounded-2xl shadow-2xl max-w-full lg:max-w-md border-8 border-white" />
                            <a href={imageUrl} download="hungers-ai.png" className="block mt-4 text-[10px] font-black text-green-700 uppercase tracking-widest hover:underline">Descargar Imagen</a>
                        </div>
                    ) : (
                        <p className="text-gray-400 italic">Escribe una idea arriba para comenzar.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImageGeneration;
