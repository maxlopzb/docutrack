import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function RequestBirthCertificate() {
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    placeOfBirth: '',
    motherName: '',
    fatherName: '',
    additionalInfo: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/certificates/request', {
        certificateType: 'birth',
        formData
      });
      
      alert('Solicitud enviada exitosamente');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al enviar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Solicitar Certificado de Nacimiento
      </h1>

      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
            Nombre Completo *
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            required
            value={formData.fullName}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ej: Juan Carlos Pérez García"
          />
        </div>

        <div>
          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
            Fecha de Nacimiento *
          </label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            required
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="placeOfBirth" className="block text-sm font-medium text-gray-700">
            Lugar de Nacimiento *
          </label>
          <input
            type="text"
            id="placeOfBirth"
            name="placeOfBirth"
            required
            value={formData.placeOfBirth}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ej: Ciudad de Panamá, Panamá"
          />
        </div>

        <div>
          <label htmlFor="motherName" className="block text-sm font-medium text-gray-700">
            Nombre de la Madre *
          </label>
          <input
            type="text"
            id="motherName"
            name="motherName"
            required
            value={formData.motherName}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nombre completo de la madre"
          />
        </div>

        <div>
          <label htmlFor="fatherName" className="block text-sm font-medium text-gray-700">
            Nombre del Padre *
          </label>
          <input
            type="text"
            id="fatherName"
            name="fatherName"
            required
            value={formData.fatherName}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nombre completo del padre"
          />
        </div>

        <div>
          <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700">
            Información Adicional
          </label>
          <textarea
            id="additionalInfo"
            name="additionalInfo"
            rows={3}
            value={formData.additionalInfo}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Cualquier información adicional relevante"
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Enviando...' : 'Enviar Solicitud'}
          </button>
        </div>
      </form>
    </div>
  );
}