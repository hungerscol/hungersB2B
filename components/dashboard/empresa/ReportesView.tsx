import React from 'react';
import Button from '../../Button';

const SiteHealth: React.FC = () => {
    const checks = [
        { name: 'API Status', status: 'OK' },
        { name: 'Database', status: 'OK' },
        { name: 'Auth Service', status: 'OK' },
        { name: 'Storage', status: 'OK' },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <h1 className="text-3xl font-bold text-green-900 mb-6">
                Estado del Sistema
            </h1>

            <div className="space-y-4">
                {checks.map((check, i) => (
                    <div
                        key={i}
                        className="flex justify-between items-center border-b pb-2"
                    >
                        <span className="font-medium">{check.name}</span>
                        <span className="text-green-600 font-bold">
                            {check.status}
                        </span>
                    </div>
                ))}
            </div>

            <div className="mt-6">
                <Button onClick={() => window.location.reload()}>
                    Refrescar Estado
                </Button>
            </div>
        </div>
    );
};

export default SiteHealth;