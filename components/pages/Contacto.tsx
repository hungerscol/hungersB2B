
import React, { useState } from 'react';
import { Page } from '../../types';
import Button from '../Button';
import { addContactSubmission } from '../../data';
import { useSEO } from '../../hooks/useSEO';

import { useNavigate } from 'react-router-dom';

const Contacto: React.FC = () => {
  const navigate = useNavigate();
  useSEO({
    title: 'Hungers | Contacto',
    description: '¿Tienes preguntas o quieres registrar tu empresa? Ponte en contacto con nosotros y te responderemos a la brevedad.',
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const inputStyles = "w-full px-6 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-hungers-lime-200 focus:border-hungers-green-900 transition-all bg-white shadow-sm placeholder-gray-400 text-hungers-green-950 font-medium";

  const validate = (): boolean => {
      const newErrors = { name: '', email: '', subject: '', message: '' };
      let isValid = true;

      if (!formData.name.trim()) {
        newErrors.name = 'El nombre completo es requerido.';
        isValid = false;
      }

      if (!formData.email.trim()) {
        newErrors.email = 'El correo electrónico es requerido.';
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'El formato del correo electrónico no es válido.';
        isValid = false;
      }

      if (!formData.subject.trim()) {
        newErrors.subject = 'El asunto es requerido.';
        isValid = false;
      }
      
      if (!formData.message.trim()) {
        newErrors.message = 'El mensaje es requerido.';
        isValid = false;
      } else if (formData.message.trim().length < 10) {
        newErrors.message = 'El mensaje debe tener al menos 10 caracteres.';
        isValid = false;
      }

      setErrors(newErrors);
      return isValid;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
    if (errors[name as keyof typeof errors]) {
        setErrors(prevErrors => ({...prevErrors, [name]: ''}));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('');

    if (!validate()) {
      return;
    }
    
    setLoading(true);
    setStatus('Enviando mensaje...');

    await new Promise(resolve => setTimeout(resolve, 1500));
    addContactSubmission(formData);

    setLoading(false);
    setStatus('¡Mensaje enviado con éxito! Gracias por contactarnos, Federico te responderá pronto.');
        
    setTimeout(() => {
        setFormData({
            name: '',
            email: '',
            subject: '',
            message: '',
        });
        setErrors({ name: '', email: '', subject: '', message: '' });
        setStatus('');
    }, 4000);
  };

  return (
    <div className="bg-[#fcfdfc] py-24 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
          <p className="text-hungers-green-900/40 font-black uppercase tracking-[0.4em] mb-6 text-xs">Hablemos</p>
          <h1 className="text-5xl sm:text-7xl font-black text-hungers-green-950 uppercase tracking-tighter leading-none">Ponte en contacto</h1>
          <p className="mt-8 text-xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
            ¿Tienes preguntas o quieres registrar tu empresa o talento? Déjanos un mensaje y te responderemos a la brevedad.
          </p>
        </div>

        <div className="max-w-2xl mx-auto animate-fade-in">
          <div className="bg-white p-10 sm:p-14 rounded-5xl shadow-premium border border-gray-100">
            <form onSubmit={handleSubmit} noValidate>
              <div className="space-y-8">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={`${inputStyles} ${errors.name ? 'border-red-500 ring-red-100' : ''}`}
                    placeholder="Tu nombre"
                  />
                  {errors.name && <p className="text-red-600 text-[10px] font-bold uppercase tracking-wider mt-2 ml-4">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`${inputStyles} ${errors.email ? 'border-red-500 ring-red-100' : ''}`}
                    placeholder="tu@email.com"
                  />
                  {errors.email && <p className="text-red-600 text-[10px] font-bold uppercase tracking-wider mt-2 ml-4">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">
                    Asunto
                  </label>
                  <input
                    type="text"
                    name="subject"
                    id="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className={`${inputStyles} ${errors.subject ? 'border-red-500 ring-red-100' : ''}`}
                    placeholder="Ej: Demo para mi empresa"
                  />
                  {errors.subject && <p className="text-red-600 text-[10px] font-bold uppercase tracking-wider mt-2 ml-4">{errors.subject}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">
                    Mensaje
                  </label>
                  <textarea
                    name="message"
                    id="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className={`${inputStyles} min-h-[150px] resize-none ${errors.message ? 'border-red-500 ring-red-100' : ''}`}
                    placeholder="Cuéntanos cómo podemos ayudarte..."
                  ></textarea>
                  {errors.message && <p className="text-red-600 text-[10px] font-bold uppercase tracking-wider mt-2 ml-4">{errors.message}</p>}
                </div>
              </div>
              
              {status && (
                <div className={`mt-10 p-5 rounded-2xl text-center text-xs font-bold border animate-shake ${
                  status.includes('éxito') ? 'bg-hungers-lime-50 border-hungers-lime-200 text-hungers-green-900' :
                  status.includes('Enviando') ? 'bg-blue-50 border-blue-100 text-blue-800' :
                  'bg-red-50 border-red-100 text-red-800'
                }`}>
                    {status}
                </div>
               )}

              <div className="mt-12">
                <Button type="submit" variant="primary" className="w-full !py-4 shadow-lime" disabled={loading}>
                  {loading ? 'Enviando...' : 'Enviar Mensaje'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacto;
