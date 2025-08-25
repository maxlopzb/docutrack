import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          ¡Bienvenido, {user?.firstName}!
        </h1>
        <p className="text-gray-600 mt-2">
          Desde aquí puedes solicitar y seguir tus certificados oficiales.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Solicitar Certificado
          </h2>
          <div className="space-y-3">
            <Link 
              to="/request-birth-certificate"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition block text-center"
            >
              📄 Certificado de Nacimiento
            </Link>
            <Link 
              to="/request-education-certificate"
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition block text-center"
            >
              🎓 Certificado de Estudios
            </Link>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Acciones Rápidas
          </h2>
          <div className="space-y-3">
            <Link 
              to="/my-requests"
              className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition block text-center"
            >
              📋 Ver Mis Solicitudes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}