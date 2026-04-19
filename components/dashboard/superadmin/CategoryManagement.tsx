
import React, { useState, useEffect } from 'react';
import { Category } from '../../../types.ts';
import { getCategories, addCategory, deleteCategory } from '../../../data.ts';
import Button from '../../Button';

const CategoryManagement: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [newCategoryName, setNewCategoryName] = useState('');

    useEffect(() => {
        getCategories().then(setCategories);
    }, []);

    const refreshCategories = () => {
        getCategories().then(setCategories);
    };

    const handleAddCategory = (e: React.FormEvent) => {
        e.preventDefault();
        if (newCategoryName.trim()) {
            addCategory(newCategoryName.trim()).then(() => {
                setNewCategoryName('');
                refreshCategories();
            });
        }
    };

    const handleDeleteCategory = (id: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
            deleteCategory(id).then(() => {
                refreshCategories();
            });
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <h1 className="text-3xl font-bold text-green-900 mb-6">Gestión de Categorías</h1>
            
            <form onSubmit={handleAddCategory} className="mb-8 flex gap-4 items-center">
                <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Nombre de la nueva categoría"
                    className="flex-grow border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-700 focus:border-green-700 bg-transparent"
                />
                <Button type="submit" disabled={!newCategoryName.trim()}>Agregar</Button>
            </form>

            <div className="space-y-3">
                {categories.length > 0 ? categories.map(category => (
                    <div key={category.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg shadow-sm">
                        <span className="text-green-900">{category.name}</span>
                        <button 
                            onClick={() => handleDeleteCategory(category.id)}
                            className="text-red-500 hover:text-red-700 font-bold text-lg"
                            title="Eliminar categoría"
                        >
                            &times;
                        </button>
                    </div>
                )) : (
                    <p className="text-green-700">No hay categorías para mostrar.</p>
                )}
            </div>
        </div>
    );
};

export default CategoryManagement;
