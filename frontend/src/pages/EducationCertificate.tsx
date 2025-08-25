import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function RequestEducationCertificate() {
  const [formData, setFormData] = useState({
    fullName: '',
    documentId: '',
    institutionName: '',
    degreeType: '',
    graduationYear: '',
    fieldOfStudy: '',
    additionalInfo: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
        certificateType: 'education',
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
        Solicitar Certificado de Estudios
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
          <label htmlFor="documentId" className="block text-sm font-medium text-gray-700">
            Número de Cédula *
          </label>
          <input
            type="text"
            id="documentId"
            name="documentId"
            required
            value={formData.documentId}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ej: 8-123-456"
          />
        </div>

        <div>
          <label htmlFor="institutionName" className="block text-sm font-medium text-gray-700">
            Institución Educativa *
          </label>
          <input
            type="text"
            id="institutionName"
            name="institutionName"
            required
            value={formData.institutionName}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ej: Universidad de Panamá"
          />
        </div>

        <div>
          <label htmlFor="degreeType" className="block text-sm font-medium text-gray-700">
            Tipo de Título *
          </label>
          <select
            id="degreeType"
            name="degreeType"
            required
            value={formData.degreeType}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Seleccionar...</option>
            <option value="bachillerato">Bachillerato</option>
            <option value="tecnico">Técnico</option>
            <option value="licenciatura">Licenciatura</option>
            <option value="maestria">Maestría</option>
            <option value="doctorado">Doctorado</option>
          </select>
        </div>

        <div>
          <label htmlFor="fieldOfStudy" className="block text-sm font-medium text-gray-700">
            Área de Estudio *
          </label>
          <input
            type="text"
            id="fieldOfStudy"
            name="fieldOfStudy"
            required
            value={formData.fieldOfStudy}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ej: Ingeniería en Sistemas"
          />
        </div>

        <div>
          <label htmlFor="graduationYear" className="block text-sm font-medium text-gray-700">
            Año de Graduación *
          </label>
          <input
            type="number"
            id="graduationYear"
            name="graduationYear"
            required
            min="1950"
            max="2030"
            value={formData.graduationYear}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ej: 2023"
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