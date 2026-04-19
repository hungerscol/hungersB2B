
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../contexts/AuthContext.tsx';
import { getCompanyById, getEmployeesByCompanyId } from '../../../data.ts';
import { Company, User } from '../../../types.ts';
import Button from '../../Button';

const RecargaModal: React.FC<{ company: Company, user: User, onClose: () => void }> = ({ company, user, onClose }) => {
    const [amount, setAmount] = useState(50000);
    const currency = 'COP';
    
    const firstName = user.name.split(' ')[0] || 'Admin';
    const lastName = user.name.split(' ').slice(1).join(' ') || company.name;

    const inputStyles = "w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#c1ff72] focus:border-green-700 transition bg-white text-green-900 text-xl font-black";

    return (
        <div className="fixed inset-0 bg-white/40 backdrop-blur-xl z-[150] flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.1)] p-10 w-full max-w-lg animate-fade-in border border-gray-100" onClick={e => e.stopPropagation()}>
                <h2 className="text-3xl font-black mb-2 text-green-900 uppercase tracking-tighter">Recargar Créditos</h2>
                <p className="text-green-700 mb-8 text-sm font-medium">Abona fondos a tu cuenta corporativa de forma instantánea.</p>
                
                <div className="space-y-8">
                    <div>
                        <label className="block text-[10px] font-black text-green-800 uppercase tracking-[0.2em] mb-3 ml-1">Monto a Recargar ({currency})</label>
                        <input 
                            type="number" 
                            value={amount} 
                            onChange={e => setAmount(Number(e.target.value))} 
                            min="10000" 
                            step="10000" 
                            required
                            className={inputStyles} 
                        />
                    </div>

                    <div className="pt-6 border-t border-gray-100">
                        <form method="post" action="https://merchantaavance.coopcentral.com.co/cartaspago/redirect" target="_top">
                            <input name="merchant_id" type="hidden" value="2099" />
                            <input name="form_id" type="hidden" value="16831" />
                            <input name="terminal_id" type="hidden" value="1510" />
                            <input name="order_number" type="hidden" value={`RECARGA-${company.id}-${Date.now()}`} />
                            <input name="amount" type="hidden" value={Math.round(amount).toString()} />
                            <input name="currency" type="hidden" value={currency.toLowerCase()} />
                            <input name="order_description" type="hidden" value={`Recarga de Créditos Hungers - ${company.name}`} />
                            <input name="color_base" type="hidden" value="#2c5234" />
                            
                            <input name="client_email" type="hidden" value={user.email} />
                            <input name="client_phone" type="hidden" value={user.phone || '3000000000'} />
                            <input name="client_firstname" type="hidden" value={firstName} />
                            <input name="client_lastname" type="hidden" value={lastName} />
                            <input name="client_doctype" type="hidden" value="4" />
                            <input name="client_numdoc" type="hidden" value={user.nit || '1234567890'} />
                            <input name="response_url" type="hidden" value={window.location.origin} />
                            
                            <div className="flex flex-col gap-4">
                                <input 
                                    name="Submit" 
                                    type="submit" 
                                    className="w-full bg-[#de0c3e] text-white font-black py-5 px-8 rounded-full hover:bg-[#b00a31] transition-all transform hover:scale-105 cursor-pointer shadow-xl uppercase tracking-widest text-sm"
                                    value={`Ir a pagar ${new Intl.NumberFormat().format(amount)} ${currency}`} 
                                />
                                <button type="button" onClick={onClose} className="text-green-700 text-xs font-black uppercase tracking-widest hover:text-green-900 transition-colors">Cancelar</button>
                            </div>
                        </form>
                        <p className="text-[9px] text-gray-400 mt-8 uppercase font-bold tracking-widest text-center">Conexión cifrada con Coopcentral</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const BilleteraView: React.FC = () => {
    const { user } = useAuth();
    const [company, setCompany] = useState<Company | null>(null);
    const [employees, setEmployees] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRecargaModalOpen, setIsRecargaModalOpen] = useState(false);

    const currency = 'COP';

    const fetchData = useCallback(async () => {
        if (user?.companyId) {
            setIsLoading(true);
            try {
                const [comp, emps] = await Promise.all([
                    getCompanyById(user.companyId),
                    getEmployeesByCompanyId(user.companyId)
                ]);
                setCompany(comp || null);
                setEmployees(emps);
            } catch (e) {
                console.error("Error cargando billetera", e);
            } finally {
                setIsLoading(false);
            }
        }
    }, [user]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const assignedCredits = employees.reduce((acc: number, emp: User) => acc + (emp.credits || 0), 0);
    const availableBalance = (company?.totalCredits || 0) - assignedCredits;

    if (isLoading) return <div className="animate-pulse p-8 text-green-700 font-bold uppercase text-[10px] tracking-[0.2em]">Sincronizando billetera corporativa...</div>;

    return (
        <div className="space-y-8 animate-fade-in max-w-6xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-green-900 uppercase tracking-tighter leading-none">Billetera Digital</h1>
                    <p className="text-green-700 mt-2 font-medium">Control de fondos y distribución de beneficios.</p>
                </div>
                <Button onClick={() => setIsRecargaModalOpen(true)} className="!py-5 !px-10 shadow-2xl !bg-[#c1ff72] !text-green-900 border-none hover:!bg-green-700 hover:!text-white transition-all transform hover:scale-105 font-black uppercase tracking-widest text-sm">
                    + Recargar Saldo
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-lg border-l-[12px] border-green-700 border border-gray-100">
                    <p className="text-[10px] font-black text-green-700 uppercase tracking-[0.2em] mb-2">Saldo en Cuenta</p>
                    <p className="text-4xl font-black text-green-900 tracking-tighter">{formatCurrency(company?.totalCredits || 0)}</p>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] shadow-lg border-l-[12px] border-yellow-400 border border-gray-100">
                    <p className="text-[10px] font-black text-green-700 uppercase tracking-[0.2em] mb-2">Saldo en Equipo</p>
                    <p className="text-4xl font-black text-green-900 tracking-tighter">{formatCurrency(assignedCredits)}</p>
                </div>
                <div className="bg-green-50 p-8 rounded-[2.5rem] shadow-xl border-l-[12px] border-[#c1ff72] border border-green-100">
                    <p className="text-[10px] font-black text-green-800 uppercase tracking-[0.2em] mb-2">Por Distribuir</p>
                    <p className="text-4xl font-black text-green-900 tracking-tighter">{formatCurrency(availableBalance)}</p>
                </div>
            </div>

            <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-sm border border-gray-100 text-center">
                <div className="max-w-xl mx-auto">
                    <p className="text-green-700 font-medium leading-relaxed italic">
                        "La transparencia en los beneficios de alimentación aumenta la lealtad del equipo. En Hungers te ayudamos a gestionar cada centavo con propósito."
                    </p>
                </div>
            </div>

            {isRecargaModalOpen && company && user && (
                <RecargaModal 
                    company={company} 
                    user={user}
                    onClose={() => setIsRecargaModalOpen(false)} 
                />
            )}
        </div>
    );
};

export default BilleteraView;
