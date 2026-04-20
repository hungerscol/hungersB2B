
import React, { useState, useEffect } from 'react';
import { MenuItem, User, UserRole, LocationCode } from '../../../types.ts';
import { addMenuItem, updateMenuItem, uploadProductImage } from '../../../data.ts';
import Button from '../../Button';
import FileInput from '../../FileInput.tsx';
import { useAuth } from '../../../contexts/AuthContext.tsx';
import { useLocation } from '../../../contexts/LocationContext.tsx';

interface AddEditMenuModalProps {
    menu: MenuItem | null;
    onClose: () => void;
    onSave: () => void;
    allCooks?: User[]; // Opcional, usado por el Admin
    forcedLocation?: LocationCode; // Para asegurar que se cree en la pestaña correcta
}

const AddEditMenuModal: React.FC<AddEditMenuModalProps> = ({ menu, onClose, onSave, allCooks = [], forcedLocation }) => {
    const { user } = useAuth();
    const { location: globalLocation } = useLocation();
    const [isSaving, setIsSaving] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [selectedCookId, setSelectedCookId] = useState<string>(menu?.cookId || user?.id || '');
    
    const targetLocation = forcedLocation || menu?.location || globalLocation;

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        imageUrl: '',
        ingredients: '',
        availableDate: new Date().toISOString().split('T')[0],
    });

    const isAdmin = user?.role === UserRole.SuperAdmin;

    useEffect(() => {
        if (menu) {
            setFormData({
                name: menu.name,
                description: menu.description,
                price: String(menu.price),
                imageUrl: menu.imageUrl,
                ingredients: menu.ingredients.join(', '),
                availableDate: menu.availableDate || new Date().toISOString().split('T')[0],
            });
            setSelectedCookId(menu.cookId);
            setImagePreview(menu.imageUrl);
        }
    }, [menu]);

    const handleFileChange = (file: File | null) => {
        setImageFile(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'cookId') {
            setSelectedCookId(value);
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsSaving(true);

        try {
            let finalImageUrl = formData.imageUrl;
            
            if (imageFile) {
                try {
                    finalImageUrl = await uploadProductImage(imageFile, `productos/${Date.now()}_${imageFile.name}`);
                } catch (uploadError: any) {
                    alert(uploadError.message || "Error al subir imagen.");
                    setIsSaving(false);
                    return;
                }
            }

            if (!finalImageUrl && !menu) {
                alert("Debes proporcionar una imagen.");
                setIsSaving(false);
                return;
            }

            const targetCook = isAdmin 
                ? allCooks.find(c => c.id === selectedCookId) 
                : user;

            const itemCurrency = 'COP' as const;

            const sharedData: Omit<MenuItem, 'id' | 'rating'> = {
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                cookId: selectedCookId,
                cookName: targetCook?.name || 'Chef Hungers',
                imageUrl: finalImageUrl,
                ingredients: formData.ingredients.split(',').map(s => s.trim()),
                availableDate: formData.availableDate,
                currency: itemCurrency,
                location: targetLocation,
            };

            if (menu) { 
                await updateMenuItem(menu.id, sharedData);
            } else { 
                await addMenuItem({ ...sharedData, location: targetLocation });
            }
            
            setIsSuccess(true);
            setTimeout(() => {
                onSave();
            }, 800);

        } catch (error) {
            console.error("Error al guardar el menú", error);
            alert("Hubo un error al guardar los cambios.");
            setIsSaving(false);
        }
    };
    
    const inputStyles = "block w-full border border-gray-300 rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#c1ff72] focus:border-green-700 bg-white text-green-900 text-sm transition-all";

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[300] flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-[2.5rem] shadow-2xl p-6 sm:p-10 w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in" onClick={e => e.stopPropagation()}>
                
                {isSuccess ? (
                    <div className="py-20 text-center animate-fade-in flex flex-col items-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-4xl shadow-inner animate-bounce">✅</div>
                        <h2 className="text-3xl font-black text-green-900 uppercase tracking-tighter">¡Guardado!</h2>
                        <p className="text-green-700 mt-2">El catálogo se ha sincronizado correctamente.</p>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-black text-green-900 uppercase tracking-tighter">
                                {menu ? 'Editar Platillo' : `Nuevo Platillo (${targetLocation})`}
                            </h2>
                            <button onClick={onClose} className="text-gray-400 hover:text-green-900 text-3xl font-light">&times;</button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {imagePreview && (
                                <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-inner bg-gray-100 border border-gray-100">
                                    <img src={imagePreview} className="absolute inset-0 w-full h-full object-cover" alt="Preview" referrerPolicy="no-referrer" />
                                    <div className="absolute top-2 left-2 bg-green-900/80 text-white text-[8px] font-black uppercase px-2 py-1 rounded">Vista Previa Real</div>
                                </div>
                            )}

                            {isAdmin && !menu && (
                                <div>
                                    <label className="block text-[10px] font-black text-green-700 uppercase tracking-widest mb-1.5 ml-1">Asignar a Cocinero</label>
                                    <select name="cookId" value={selectedCookId} onChange={handleChange} className={inputStyles} required>
                                        <option value="">Selecciona un responsable...</option>
                                        {allCooks.map(c => (
                                            <option key={c.id} value={c.id}>{c.name} ({c.specialty})</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div>
                                <label className="block text-[10px] font-black text-green-700 uppercase tracking-widest mb-1.5 ml-1">Nombre del Platillo</label>
                                <input type="text" name="name" placeholder="Ej: Lasagna de Berenjena" value={formData.name} onChange={handleChange} required className={inputStyles} />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-green-700 uppercase tracking-widest mb-2 ml-1">Cambiar Imagen</label>
                                <div className="p-4 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/50">
                                    <FileInput id="menu-image" label="Seleccionar foto real" onFileChange={handleFileChange} accept="image/*" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-green-700 uppercase tracking-widest mb-1.5 ml-1">Fecha Disponible</label>
                                    <input type="date" name="availableDate" value={formData.availableDate} onChange={handleChange} required className={inputStyles} />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-green-700 uppercase tracking-widest mb-1.5 ml-1">Precio Unitario ({'COP'})</label>
                                    <input type="number" name="price" placeholder="0" value={formData.price} onChange={handleChange} required className={inputStyles} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-green-700 uppercase tracking-widest mb-1.5 ml-1">Descripción de Sabor</label>
                                <textarea name="description" rows={3} placeholder="Detalla ingredientes..." value={formData.description} onChange={handleChange} required className={`${inputStyles} resize-none`}></textarea>
                            </div>

                            <div className="flex justify-end gap-3 pt-8 border-t border-gray-100">
                                <button type="button" onClick={onClose} className="px-6 py-2 text-sm text-gray-500 hover:text-green-900 font-bold uppercase tracking-widest transition-colors">Cancelar</button>
                                <Button type="submit" className="!shadow-xl !px-10 !py-4 font-black uppercase tracking-widest" disabled={isSaving}>
                                    {isSaving ? 'Subiendo...' : 'Guardar Cambios'}
                                </Button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default AddEditMenuModal;
