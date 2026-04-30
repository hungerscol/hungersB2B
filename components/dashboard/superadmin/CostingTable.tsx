import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    fetchDishes, createDish, updateDish, deleteDish,
    createIngredient, updateIngredient, deleteIngredient,
    Dish, DishIngredient
} from '../../../data.ts';

// ── Constantes ─────────────────────────────────────────────
const HUNGERS_FEE   = 0.14;
const TARGET_MARGIN = 0.35;
const CATEGORIES    = ['Desayuno', 'Almuerzo', 'Cena', 'Snack', 'Bebida', 'Postre'];
const UNITS         = ['g', 'kg', 'ml', 'L', 'und', 'cdta', 'cda', 'taza'];

// ── Utilidades ─────────────────────────────────────────────
const formatCOP = (val: number) => new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP', maximumFractionDigits: 0
}).format(val);

function calcIngredientCost(ing: DishIngredient) {
    if (ing.unit === 'und') return ing.qty * ing.costPer100;
    if (ing.unit === 'kg' || ing.unit === 'L') return (ing.qty * 1000 * ing.costPer100) / 100;
    return (ing.qty * ing.costPer100) / 100;
}

function calcDishTotals(dish: Dish) {
    const ingredientTotal  = dish.ingredients.reduce((s, i) => s + calcIngredientCost(i), 0);
    const costoTotal       = ingredientTotal + dish.laborCost + dish.packagingCost;
    const hungersComision  = dish.precioVenta * HUNGERS_FEE;
    const gananciaCocinero = dish.precioVenta - hungersComision - costoTotal;
    const margen           = dish.precioVenta > 0 ? (gananciaCocinero / dish.precioVenta) * 100 : 0;
    const markup           = costoTotal > 0 ? ((dish.precioVenta - costoTotal) / costoTotal) * 100 : 0;
    const precioSugerido   = costoTotal > 0
        ? Math.ceil(costoTotal / (1 - HUNGERS_FEE - TARGET_MARGIN) / 100) * 100
        : 0;
    return { ingredientTotal, costoTotal, hungersComision, gananciaCocinero, margen, markup, precioSugerido };
}

const margenColor = (m: number) => m >= 30 ? 'text-green-600' : m >= 15 ? 'text-yellow-500' : 'text-red-500';
const margenBg    = (m: number) => m >= 30 ? 'bg-green-50 border-green-200' : m >= 15 ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200';

// ── Hook debounce ──────────────────────────────────────────
function useDebounce<T extends (...args: any[]) => any>(fn: T, delay = 800) {
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
    return useCallback((...args: Parameters<T>) => {
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => fn(...args), delay);
    }, [fn, delay]);
}

// ── Componente principal ───────────────────────────────────
const CostingTable: React.FC = () => {
    const [dishes,          setDishes]          = useState<Dish[]>([]);
    const [selectedId,      setSelectedId]      = useState<string | null>(null);
    const [loading,         setLoading]         = useState(true);
    const [saving,          setSaving]          = useState(false);
    const [error,           setError]           = useState<string | null>(null);
    const [activeTab,       setActiveTab]       = useState<'costo' | 'precio'>('costo');
    const [showAddDish,     setShowAddDish]     = useState(false);
    const [newDishName,     setNewDishName]     = useState('');
    const [newDishCategory, setNewDishCategory] = useState('Almuerzo');
    const [showAddIng,      setShowAddIng]      = useState(false);
    const [newIng,          setNewIng]          = useState({ name: '', qty: '', unit: 'g', costPer100: '' });

    useEffect(() => {
        fetchDishes()
            .then(data => { setDishes(data); if (data.length > 0) setSelectedId(data[0].id); })
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    const dish   = dishes.find(d => d.id === selectedId) ?? null;
    const totals = dish ? calcDishTotals(dish) : null;

    // ── Platos ─────────────────────────────────────────────
    const handleAddDish = async () => {
        if (!newDishName.trim()) return;
        setSaving(true);
        try {
            const created = await createDish({ name: newDishName.trim(), category: newDishCategory });
            setDishes(prev => [...prev, created]);
            setSelectedId(created.id);
            setNewDishName('');
            setShowAddDish(false);
        } catch (e: any) { setError(e.message); }
        finally { setSaving(false); }
    };

    const handleDeleteDish = async (id: string) => {
        if (!window.confirm('¿Eliminar este plato?')) return;
        setSaving(true);
        try {
            await deleteDish(id);
            setDishes(prev => prev.filter(d => d.id !== id));
            if (selectedId === id) {
                const remaining = dishes.filter(d => d.id !== id);
                setSelectedId(remaining[0]?.id ?? null);
            }
        } catch (e: any) { setError(e.message); }
        finally { setSaving(false); }
    };

    const persistDishUpdate = useDebounce(async (id: string, fields: Partial<Dish>) => {
        setSaving(true);
        try { await updateDish(id, fields); }
        catch (e: any) { setError(e.message); }
        finally { setSaving(false); }
    });

    const handleDishFieldChange = (field: keyof Dish, value: any) => {
        if (!dish) return;
        const updated = { ...dish, [field]: value };
        setDishes(prev => prev.map(d => d.id === dish.id ? updated : d));
        persistDishUpdate(dish.id, { [field]: value });
    };

    // ── Ingredientes ────────────────────────────────────────
    const handleAddIngredient = async () => {
        if (!dish || !newIng.name.trim()) return;
        setSaving(true);
        try {
            const created = await createIngredient(dish.id, {
                name: newIng.name.trim(),
                qty: parseFloat(newIng.qty) || 0,
                unit: newIng.unit,
                costPer100: parseFloat(newIng.costPer100) || 0,
            });
            setDishes(prev => prev.map(d => d.id === dish.id
                ? { ...d, ingredients: [...d.ingredients, created] }
                : d
            ));
            setNewIng({ name: '', qty: '', unit: 'g', costPer100: '' });
            setShowAddIng(false);
        } catch (e: any) { setError(e.message); }
        finally { setSaving(false); }
    };

    const persistIngUpdate = useDebounce(async (id: string, fields: Partial<DishIngredient>) => {
        setSaving(true);
        try { await updateIngredient(id, fields); }
        catch (e: any) { setError(e.message); }
        finally { setSaving(false); }
    });

    const handleIngFieldChange = (ingId: string, field: keyof DishIngredient, value: any) => {
        if (!dish) return;
        setDishes(prev => prev.map(d => d.id === dish.id
            ? { ...d, ingredients: d.ingredients.map(i => i.id === ingId ? { ...i, [field]: value } : i) }
            : d
        ));
        persistIngUpdate(ingId, { [field]: value });
    };

    const handleDeleteIngredient = async (ingId: string) => {
        if (!dish) return;
        setSaving(true);
        try {
            await deleteIngredient(ingId);
            setDishes(prev => prev.map(d => d.id === dish.id
                ? { ...d, ingredients: d.ingredients.filter(i => i.id !== ingId) }
                : d
            ));
        } catch (e: any) { setError(e.message); }
        finally { setSaving(false); }
    };

    const inputCls = 'border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#c1ff72] focus:border-green-700 bg-white text-green-900 w-full transition-all';

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-10 w-10 border-4 border-green-700 border-t-transparent rounded-full"></div>
        </div>
    );

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-black text-green-900 uppercase tracking-tighter">Tabla de Costeo</h1>
                    <p className="text-green-700 text-xs mt-1">Calcula rentabilidad y precios sugeridos por plato.</p>
                </div>
                <div className="flex items-center gap-3">
                    {saving && <span className="text-[10px] font-black text-green-600 uppercase tracking-widest animate-pulse">Guardando...</span>}
                    <button
                        onClick={() => setShowAddDish(true)}
                        className="bg-[#c1ff72] text-green-900 px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-green-200 transition-all"
                    >
                        + Nuevo Plato
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-4 flex justify-between">
                    {error}
                    <button onClick={() => setError(null)} className="font-bold">✕</button>
                </div>
            )}

            <div className="flex gap-6 h-[calc(100vh-200px)]">
                {/* Sidebar */}
                <div className="w-56 flex-shrink-0 flex flex-col gap-2 overflow-y-auto">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1 mb-1">Platos ({dishes.length})</p>
                    {dishes.map(d => (
                        <button
                            key={d.id}
                            onClick={() => setSelectedId(d.id)}
                            className={`w-full text-left px-4 py-3 rounded-2xl border transition-all group ${selectedId === d.id
                                ? 'bg-green-900 text-white border-green-900 shadow-lg'
                                : 'bg-white border-gray-100 hover:border-green-200 text-green-900'
                            }`}
                        >
                            <p className="font-black text-sm leading-tight truncate">{d.name}</p>
                            <p className={`text-[10px] mt-1 ${selectedId === d.id ? 'text-[#c1ff72]' : 'text-gray-400'}`}>{d.category}</p>
                        </button>
                    ))}

                    {showAddDish ? (
                        <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3">
                            <input
                                className={inputCls}
                                placeholder="Nombre del plato"
                                value={newDishName}
                                onChange={e => setNewDishName(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleAddDish()}
                                autoFocus
                            />
                            <select className={inputCls} value={newDishCategory} onChange={e => setNewDishCategory(e.target.value)}>
                                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                            </select>
                            <div className="flex gap-2">
                                <button onClick={handleAddDish} disabled={saving} className="flex-1 bg-green-700 text-white py-2 rounded-xl text-xs font-black uppercase hover:bg-green-900 transition-all disabled:opacity-50">Crear</button>
                                <button onClick={() => setShowAddDish(false)} className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-xl text-xs font-black uppercase hover:bg-gray-200 transition-all">Cancelar</button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowAddDish(true)}
                            className="w-full border-2 border-dashed border-gray-200 text-gray-400 py-3 rounded-2xl text-xs font-black uppercase hover:border-green-300 hover:text-green-600 transition-all"
                        >
                            + Agregar Plato
                        </button>
                    )}
                </div>

                {/* Panel principal */}
                {dish && totals ? (
                    <div className="flex-1 overflow-y-auto space-y-5">
                        {/* Cabecera plato */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex justify-between items-start">
                            <div>
                                <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-1">{dish.category}</p>
                                <h2 className="text-2xl font-black text-green-900 tracking-tighter">{dish.name}</h2>
                            </div>
                            <div className="flex gap-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-black border ${margenBg(totals.margen)} ${margenColor(totals.margen)}`}>
                                    {totals.margen >= 30 ? '✅' : totals.margen >= 15 ? '⚠️' : '❌'} {totals.margen.toFixed(1)}% margen
                                </span>
                                <button
                                    onClick={() => handleDeleteDish(dish.id)}
                                    className="bg-red-50 text-red-500 px-3 py-1 rounded-xl text-xs font-black uppercase hover:bg-red-500 hover:text-white transition-all"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-2">
                            {(['costo', 'precio'] as const).map(t => (
                                <button
                                    key={t}
                                    onClick={() => setActiveTab(t)}
                                    className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-green-900 text-white shadow' : 'bg-white text-gray-400 border border-gray-100 hover:text-green-700'}`}
                                >
                                    {t === 'costo' ? '🧮 Costeo' : '💰 Precio y Margen'}
                                </button>
                            ))}
                        </div>

                        {activeTab === 'costo' && (
                            <div className="space-y-5">
                                {/* Costos fijos */}
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                    <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Costos Fijos</p>
                                    </div>
                                    <div className="p-6 grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-black text-green-700 uppercase tracking-widest block mb-1">Mano de Obra (COP)</label>
                                            <input
                                                type="number"
                                                className={inputCls}
                                                value={dish.laborCost}
                                                onChange={e => handleDishFieldChange('laborCost', parseFloat(e.target.value) || 0)}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-green-700 uppercase tracking-widest block mb-1">Empaque (COP)</label>
                                            <input
                                                type="number"
                                                className={inputCls}
                                                value={dish.packagingCost}
                                                onChange={e => handleDishFieldChange('packagingCost', parseFloat(e.target.value) || 0)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Ingredientes */}
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                    <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ingredientes</p>
                                        <button
                                            onClick={() => setShowAddIng(true)}
                                            className="bg-[#c1ff72] text-green-900 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase hover:bg-green-200 transition-all"
                                        >
                                            + Agregar
                                        </button>
                                    </div>
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-50">
                                                {['Ingrediente', 'Cantidad', 'Unidad', 'Costo/100g o und', 'Costo total', ''].map(h => (
                                                    <th key={h} className="px-4 py-3 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {dish.ingredients.map(ing => (
                                                <tr key={ing.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                                    <td className="px-4 py-3">
                                                        <input className={inputCls} value={ing.name} onChange={e => handleIngFieldChange(ing.id, 'name', e.target.value)} />
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <input type="number" className={inputCls} value={ing.qty} onChange={e => handleIngFieldChange(ing.id, 'qty', parseFloat(e.target.value) || 0)} />
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <select className={inputCls} value={ing.unit} onChange={e => handleIngFieldChange(ing.id, 'unit', e.target.value)}>
                                                            {UNITS.map(u => <option key={u}>{u}</option>)}
                                                        </select>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <input type="number" className={inputCls} value={ing.costPer100} onChange={e => handleIngFieldChange(ing.id, 'costPer100', parseFloat(e.target.value) || 0)} />
                                                    </td>
                                                    <td className="px-4 py-3 font-black text-green-900 text-sm">{formatCOP(calcIngredientCost(ing))}</td>
                                                    <td className="px-4 py-3">
                                                        <button onClick={() => handleDeleteIngredient(ing.id)} className="text-red-400 hover:text-red-600 text-xs font-black">✕</button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {dish.ingredients.length === 0 && (
                                                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400 text-sm italic">Sin ingredientes aún.</td></tr>
                                            )}
                                        </tbody>
                                    </table>

                                    {showAddIng && (
                                        <div className="p-4 border-t border-gray-100 bg-gray-50 grid grid-cols-5 gap-3 items-end">
                                            <input className={inputCls} placeholder="Ingrediente" value={newIng.name} onChange={e => setNewIng(p => ({ ...p, name: e.target.value }))} autoFocus />
                                            <input type="number" className={inputCls} placeholder="Cantidad" value={newIng.qty} onChange={e => setNewIng(p => ({ ...p, qty: e.target.value }))} />
                                            <select className={inputCls} value={newIng.unit} onChange={e => setNewIng(p => ({ ...p, unit: e.target.value }))}>
                                                {UNITS.map(u => <option key={u}>{u}</option>)}
                                            </select>
                                            <input type="number" className={inputCls} placeholder="Costo/100g" value={newIng.costPer100} onChange={e => setNewIng(p => ({ ...p, costPer100: e.target.value }))} />
                                            <div className="flex gap-2">
                                                <button onClick={handleAddIngredient} disabled={saving} className="flex-1 bg-green-700 text-white py-2 rounded-xl text-xs font-black uppercase hover:bg-green-900 transition-all disabled:opacity-50">Agregar</button>
                                                <button onClick={() => setShowAddIng(false)} className="flex-1 bg-gray-200 text-gray-600 py-2 rounded-xl text-xs font-black uppercase hover:bg-gray-300 transition-all">✕</button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="px-6 py-4 bg-green-50 border-t border-green-100 flex justify-between items-center">
                                        <span className="text-xs font-black text-green-700 uppercase tracking-widest">Costo Total de Producción</span>
                                        <span className="text-xl font-black text-green-900">{formatCOP(totals.costoTotal)}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'precio' && (
                            <div className="space-y-5">
                                {/* Precio de venta */}
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                    <label className="text-[10px] font-black text-green-700 uppercase tracking-widest block mb-2">Precio de Venta (COP)</label>
                                    <input
                                        type="number"
                                        className={`${inputCls} text-2xl font-black`}
                                        value={dish.precioVenta}
                                        onChange={e => handleDishFieldChange('precioVenta', parseFloat(e.target.value) || 0)}
                                    />
                                    {totals.precioSugerido > 0 && (
                                        <p className="text-xs text-green-600 mt-2">
                                            💡 Precio sugerido para 35% margen: <strong>{formatCOP(totals.precioSugerido)}</strong>
                                            <button
                                                onClick={() => handleDishFieldChange('precioVenta', totals.precioSugerido)}
                                                className="ml-2 underline font-black hover:text-green-900"
                                            >Aplicar</button>
                                        </p>
                                    )}
                                </div>

                                {/* Desglose */}
                                {dish.precioVenta > 0 && (
                                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Desglose del precio: {formatCOP(dish.precioVenta)}</p>
                                        <div className="flex h-8 rounded-xl overflow-hidden gap-0.5 mb-4">
                                            {[
                                                { label: 'Ingredientes', value: totals.ingredientTotal, color: 'bg-gray-600' },
                                                { label: 'Labor + empaque', value: dish.laborCost + dish.packagingCost, color: 'bg-gray-400' },
                                                { label: 'Hungers 14%', value: totals.hungersComision, color: 'bg-blue-500' },
                                                { label: 'Ganancia', value: Math.max(0, totals.gananciaCocinero), color: 'bg-green-500' },
                                            ].map(item => {
                                                const pct = (item.value / dish.precioVenta) * 100;
                                                if (pct <= 0) return null;
                                                return (
                                                    <div key={item.label} className={`${item.color} flex items-center justify-center transition-all`} style={{ width: `${pct}%` }}>
                                                        {pct > 8 && <span className="text-white text-[10px] font-black">{pct.toFixed(0)}%</span>}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div className="flex flex-wrap gap-4">
                                            {[
                                                { label: 'Ingredientes', value: totals.ingredientTotal, color: 'bg-gray-600' },
                                                { label: 'Labor + empaque', value: dish.laborCost + dish.packagingCost, color: 'bg-gray-400' },
                                                { label: 'Hungers 14%', value: totals.hungersComision, color: 'bg-blue-500' },
                                                { label: 'Ganancia cocinero', value: Math.max(0, totals.gananciaCocinero), color: 'bg-green-500' },
                                            ].map(item => (
                                                <div key={item.label} className="flex items-center gap-2">
                                                    <div className={`w-2.5 h-2.5 rounded-sm ${item.color}`} />
                                                    <span className="text-xs text-gray-500">{item.label}</span>
                                                    <span className="text-xs font-black text-green-900">{formatCOP(item.value)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* KPIs */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className={`bg-white p-6 rounded-2xl border shadow-sm ${margenBg(totals.margen)}`}>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Margen neto cocinero</p>
                                        <p className={`text-4xl font-black ${margenColor(totals.margen)}`}>{totals.margen.toFixed(1)}%</p>
                                        <p className="text-xs mt-2 font-bold text-gray-500">
                                            {totals.margen >= 30 ? '✅ Rentable' : totals.margen >= 15 ? '⚠️ Ajustado' : '❌ No rentable'}
                                        </p>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Markup sobre costo</p>
                                        <p className="text-4xl font-black text-green-900">{totals.markup.toFixed(0)}%</p>
                                        <p className="text-xs mt-2 font-bold text-gray-500">vs. costo total producción</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Precio sugerido (35%)</p>
                                        <p className="text-3xl font-black text-green-700">{formatCOP(totals.precioSugerido)}</p>
                                        <p className="text-xs mt-2 font-bold text-gray-500">Para 35% de ganancia neta</p>
                                    </div>
                                </div>

                                {/* Resumen financiero */}
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { label: 'Costo ingredientes', value: totals.ingredientTotal, icon: '🥬' },
                                        { label: 'Costo total (c/ labor)', value: totals.costoTotal, icon: '💵' },
                                        { label: 'Comisión Hungers (14%)', value: totals.hungersComision, icon: '🏢' },
                                        { label: 'Ganancia cocinero/a', value: totals.gananciaCocinero, icon: '👨‍🍳', highlight: true },
                                    ].map(({ label, value, icon, highlight }) => (
                                        <div key={label} className={`bg-white p-5 rounded-2xl border shadow-sm flex items-center gap-4 ${highlight && value > 0 ? 'border-green-200 bg-green-50' : 'border-gray-100'}`}>
                                            <span className="text-2xl">{icon}</span>
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
                                                <p className={`text-xl font-black ${highlight ? (value > 0 ? 'text-green-700' : 'text-red-500') : 'text-green-900'}`}>{formatCOP(value)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                        <p className="text-5xl mb-4">🍽️</p>
                        <p className="text-xl font-black text-green-900 tracking-tighter">Selecciona un plato</p>
                        <p className="text-sm text-gray-400 mt-2">o crea uno nuevo desde el panel izquierdo</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CostingTable;