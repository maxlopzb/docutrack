import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

interface AdminRequest {
  id: number;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  certificateType: string;
  status: string;
  requestData: any;
  createdAt: string;
}

interface Stats {
  total: number;
  pending: number;
  processing: number;
  ready: number;
}

export default function AdminDashboard() {
  const [requests, setRequests] = useState<AdminRequest[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, processing: 0, ready: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [requestsResponse, statsResponse] = await Promise.all([
        api.get('/admin/requests'),
        api.get('/admin/stats')
      ]);
      
      setRequests(requestsResponse.data.data);
      setStats(statsResponse.data.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (requestId: number, newStatus: string) => {
    try {
      await api.patch(`/admin/requests/${requestId}/status`, { status: newStatus });
      
      // Actualizar la lista local
      setRequests(requests.map(req => 
        req.id === requestId ? { ...req, status: newStatus } : req
      ));
      
      // Refrescar estadísticas
      const statsResponse = await api.get('/admin/stats');
      setStats(statsResponse.data.data);
      
      alert('Estado actualizado exitosamente');
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error al actualizar el estado');
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
    return <div className="text-center py-8">Cargando panel administrativo...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">{stats.total}</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.total} solicitudes</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">{stats.pending}</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pendientes</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.pending} solicitudes</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">{stats.processing}</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Procesando</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.processing} solicitudes</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">{stats.ready}</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Listos</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.ready} solicitudes</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de solicitudes */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Todas las Solicitudes
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Gestiona el estado de las solicitudes de certificados.
          </p>
        </div>
        
        {requests.length === 0 ? (
          <div className="px-4 py-5 text-center text-gray-500">
            No hay solicitudes aún.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {requests.map((request) => (
              <li key={request.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {request.user.firstName} {request.user.lastName}
                        </p>
                        <p className="text-sm text-gray-600">{request.user.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          Certificado de {getCertificateTypeText(request.certificateType)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-2 flex items-center justify-between">
                      <div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                          {getStatusText(request.status)}
                        </span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <select
                          value={request.status}
                          onChange={(e) => updateStatus(request.id, e.target.value)}
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="pending">Pendiente</option>
                          <option value="processing">Procesando</option>
                          <option value="ready">Listo</option>
                          <option value="delivered">Entregado</option>
                          <option value="rejected">Rechazado</option>
                        </select>
                      </div>
                    </div>
                    
                    {/* Mostrar datos de la solicitud */}
                    <div className="mt-2 text-sm text-gray-600">
                      {request.requestData.fullName && (
                        <p><strong>Nombre en certificado:</strong> {request.requestData.fullName}</p>
                      )}
                      {request.requestData.dateOfBirth && (
                        <p><strong>Fecha de nacimiento:</strong> {request.requestData.dateOfBirth}</p>
                      )}
                      {request.requestData.placeOfBirth && (
                        <p><strong>Lugar de nacimiento:</strong> {request.requestData.placeOfBirth}</p>
                      )}
                      {request.requestData.institutionName && (
                        <p><strong>Institución:</strong> {request.requestData.institutionName}</p>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}