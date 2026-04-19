
import React, { useState, useCallback } from 'react';

interface FileInputProps {
    id: string;
    label: string;
    onFileChange: (file: File | null) => void;
    accept: string;
    maxSizeMB?: number;
    required?: boolean;
}

const FileInput: React.FC<FileInputProps> = ({ id, label, onFileChange, accept, maxSizeMB = 5, required = false }) => {
    const [fileName, setFileName] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [preview, setPreview] = useState<string | null>(null);

    const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        // Reset state
        setError('');
        setPreview(null);
        setFileName('');
        onFileChange(null);

        if (!file) {
            return;
        }

        // Validate size
        if (maxSizeMB && file.size > maxSizeMB * 1024 * 1024) {
            setError(`El archivo no debe exceder los ${maxSizeMB}MB.`);
            return;
        }

        setFileName(file.name);
        onFileChange(file);

        // Create preview for images
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    }, [maxSizeMB, onFileChange]);

    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-green-800">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="mt-1 flex items-center space-x-4">
                {preview && <img src={preview} alt="Vista previa" className="h-12 w-12 rounded-full object-cover" />}
                <div className="flex-grow">
                    <label htmlFor={id} className="cursor-pointer bg-transparent py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-green-800 hover:bg-gray-50 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-700">
                        <span>{fileName ? 'Cambiar archivo' : 'Seleccionar archivo'}</span>
                        <input id={id} name={id} type="file" className="sr-only" onChange={handleFileChange} accept={accept} />
                    </label>
                    {fileName && <p className="text-xs text-green-700 mt-1 truncate">{fileName}</p>}
                </div>
            </div>
            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        </div>
    );
};

export default FileInput;
