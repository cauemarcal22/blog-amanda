import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { LoginForm } from './LoginForm';
import { AdminLayout } from './AdminLayout';
import { Dashboard } from './Dashboard';
import { MessagesTable } from './MessagesTable';
import { Analytics } from './Analytics';
import { Settings } from './Settings';
import { authService } from '../../lib/auth';

export const AdminApp: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se o usuário já está logado
    const user = authService.getCurrentUser();
    setIsAuthenticated(!!user);
    setLoading(false);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('dashboard');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'messages':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Mensagens WhatsApp</h1>
              <p className="text-gray-600 mt-1">Gerencie todos os contatos e conversas</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <MessagesTable />
            </div>
          </div>
        );
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <Router>
      <AdminLayout
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onLogout={handleLogout}
      >
        {renderPage()}
      </AdminLayout>
    </Router>
  );
};