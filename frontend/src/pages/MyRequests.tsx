import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

interface Request {
  id: number;
  certificateType: string;
  status: string;
  requestData: any;
  createdAt: string;
}

export default function MyRequests() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await api.get('/certificates/my-requests');
      setRequests(response.data.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-gray-100 text-gray-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'processing': return 'Procesando';
      case 'ready': return 'Listo';
      case 'delivered': return 'Entregado';
      case 'rejected': return 'Rechazado';
      default: return status;
    }
  };

  const getCertificateTypeText = (type: string) => {
    return type === 'birth' ? 'Nacimiento' : 'Estudios';
  };

  if (loading) {
    return <div className="text-center py-8">Cargando solicitudes...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Mis Solicitudes</h1>

      {requests.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <p className="text-gray-500">No tienes solicitudes aún.</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {requests.map((request) => (
              <li key={request.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        Certificado de {getCertificateTypeText(request.certificateType)}
                      </p>
                      <div className="ml-2 flex-shrink-0">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                          {getStatusText(request.status)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">
                        Solicitado el: {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                      {request.requestData.fullName && (
                        <p className="text-sm text-gray-600">
                          Para: {request.requestData.fullName}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}