import React, { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/dashboard" className="text-xl font-bold hover:text-blue-200">
            Docutrack
          </Link>
          {user && (
            <div className="flex items-center space-x-4">
              <Link 
                to="/dashboard" 
                className="hover:text-blue-200"
              >
                Dashboard
              </Link>
              {user.role === 'admin' && (
                <Link 
                  to="/admin" 
                  className="hover:text-blue-200 font-medium"
                >
                  👨‍💼 Admin
                </Link>
              )}
              <span>Hola, {user.firstName}</span>
              <button
                onClick={logout}
                className="bg-blue-700 px-3 py-1 rounded hover:bg-blue-800"
              >
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </nav>
      <main className="container mx-auto p-4">
        {children}
      </main>
    </div>
  );
}