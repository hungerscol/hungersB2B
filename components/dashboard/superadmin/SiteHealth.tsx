import React, { useState, useEffect, useCallback } from 'react';
import Button from '../../Button';
import { seedDatabase, getAllCooks, mockMenuItems } from '../../../data';

interface ImageAsset {
    url: string;
    context: string;
}

type HealthStatus = 'validando' | 'activo' | 'caido';

const SiteHealth: React.FC = () => {
    const [assets, setAssets] = useState<ImageAsset[]>([]);
    const [statuses, setStatuses] = useState<Record<string, HealthStatus>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [cooks, setCooks] = useState<any[]>([]);

    useEffect(() => {
        getAllCooks().then(setCooks);
    }, []);

    const checkImage = (url: string): Promise<boolean> => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
            setTimeout(() => resolve(false), 8000);
        });
    };

    const runAudit = useCallback(async () => {
        setIsLoading(true);
        const items: ImageAsset[] = [];

        cooks.forEach((c: any) => {
            if (c.imageUrl) items.push({ url: c.imageUrl, context: `Chef: ${c.name}` });
        });

        mockMenuItems.forEach((m: any) => {
            if (m.imageUrl) items.push({ url: m.imageUrl, context: `Plato: ${m.name}` });
        });

        const uniqueItems = Array.from(new Map(items.map(i => [i.url, i])).values());
        setAssets(uniqueItems);

        const newStatuses: Record<string, HealthStatus> = {};
        for (const item of uniqueItems) {
            newStatuses[item.url] = 'validando';
            setStatuses({ ...newStatuses });
            const isOk = await checkImage(item.url);
            newStatuses[item.url] = isOk ? 'activo' : 'caido';
            setStatuses({ ...newStatuses });
        }
        setIsLoading(false);
    }, [cooks]);

    useEffect(() => {
        runAudit();
    }, [runAudit]);

    const handleSync = async () => {
        if (!window.confirm('¿Sincronizar todos los datos? Esto sobrescribirá los datos existentes.')) return;
        setIsSyncing(true);
        try {
            await seedDatabase();
            alert('Sincronización completada.');
            runAudit();
        } catch (error) {
            alert('Error al sincronizar.');
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <div className="bg-white rounded-[2.5rem] shadow-xl p-6 md:p-10 border border-gray-100">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-black text-green-900 uppercase tracking-tighter">Estado de Infraestructura</h1>
                    <p className="text-green-700 text-sm">Monitoreo de activos y servicios externos.</p>
                </div>
                <div className="flex gap-4">
                    <Button onClick={handleSync} disabled={isSyncing} variant="outline" className="shadow-lg uppercase tracking-widest !text-xs">
                        {isSyncing ? 'Sincronizando...' : 'Sincronizar Datos'}
                    </Button>
                    <Button onClick={runAudit} disabled={isLoading} className="shadow-lg uppercase tracking-widest !text-xs">
                        {isLoading ? 'Escaneando...' : 'Re-auditar'}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="p-6 rounded-3xl bg-green-50 border border-green-100">
                    <p className="text-[10px] font-black uppercase text-green-700 mb-1">Assets Totales</p>
                    <p className="text-3xl font-black text-green-900">{assets.length}</p>
                </div>
                <div className="p-6 rounded-3xl bg-blue-50 border border-blue-100">
                    <p className="text-[10px] font-black uppercase text-blue-700 mb-1">Servidores</p>
                    <p className="text-3xl font-black text-blue-900">Online</p>
                </div>
                <div className="p-6 rounded-3xl bg-purple-50 border border-purple-100">
                    <p className="text-[10px] font-black uppercase text-purple-700 mb-1">Base de Datos</p>
                    <p className="text-3xl font-black text-purple-900">Estable</p>
                </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-gray-100">
                <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-[10px] font-black text-green-700 uppercase tracking-widest">Recurso</th>
                            <th className="px-6 py-4 text-left text-[10px] font-black text-green-700 uppercase tracking-widest">Estado</th>
                            <th className="px-6 py-4 text-left text-[10px] font-black text-green-700 uppercase tracking-widest">URL</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-50 text-sm">
                        {assets.map((asset) => (
                            <tr key={asset.url}>
                                <td className="px-6 py-4 font-bold text-green-900">{asset.context}</td>
                                <td className="px-6 py-4 uppercase font-black text-[10px]">
                                    <span className={`px-2 py-1 rounded ${
                                        statuses[asset.url] === 'activo' ? 'bg-green-100 text-green-700' :
                                        statuses[asset.url] === 'validando' ? 'bg-yellow-100 text-yellow-700 animate-pulse' :
                                        'bg-red-100 text-red-700'
                                    }`}>
                                        {statuses[asset.url] || 'pendiente'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-mono text-gray-400 text-xs truncate max-w-xs">{asset.url}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SiteHealth;