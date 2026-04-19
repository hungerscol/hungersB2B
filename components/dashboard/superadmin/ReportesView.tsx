import React from 'react';
import Button from '../../Button';
import { useAuth } from '../../../contexts/AuthContext';
import { getEmployeesByCompanyId, getOrdersByUserId } from '../../../data';

const ReportesView: React.FC = () => {
    const { user } = useAuth();

    const handleDownloadReport = async () => {
        if (!user || !user.companyId) return;

        const employees = await getEmployeesByCompanyId(user.companyId);

        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Empleado ID,Nombre,Email,Fecha Pedido,ID Pedido,Total Pedido,Items\n";

        for (const employee of employees) {
            const orders = await getOrdersByUserId(employee.id);

            orders.forEach(order => {
                const items = order.items
                    .map(i => `${i.quantity}x ${i.menuItem.name}`)
                    .join('; ');

                const row = [
                    employee.id,
                    employee.name,
                    employee.email,
                    new Date(order.date).toLocaleDateString(),
                    order.id,
                    order.total,
                    `"${items}"`
                ].join(',');

                csvContent += row + "\n";
            });
        }

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");

        link.setAttribute("href", encodedUri);
        link.setAttribute(
            "download",
            `reporte_${new Date().toISOString().split('T')[0]}.csv`
        );

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <h1 className="text-3xl font-bold text-green-900 mb-6">
                Generación de Reportes
            </h1>

            <p className="text-green-700 mb-4">
                Descarga el consumo de tus empleados en CSV.
            </p>

            <Button onClick={handleDownloadReport}>
                Descargar Reporte
            </Button>
        </div>
    );
};

export default ReportesView;