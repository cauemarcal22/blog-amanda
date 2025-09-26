import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  MessageSquare, 
  Users, 
  TrendingUp, 
  Calendar,
  Filter,
  RefreshCw
} from 'lucide-react';
import { apiService, DashboardStats, VisitStats } from '../../lib/api';
import { StatsCard } from './StatsCard';
import { VisitsChart } from './VisitsChart';
import { MessagesTable } from './MessagesTable';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [visitStats, setVisitStats] = useState<VisitStats[]>([]);
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('week');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [dashboardStats, visitsData] = await Promise.all([
        apiService.getDashboardStats(),
        apiService.getVisitStats(period)
      ]);
      
      setStats(dashboardStats);
      setVisitStats(visitsData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [period]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handlePeriodChange = (newPeriod: 'day' | 'week' | 'month') => {
    setPeriod(newPeriod);
    setLoading(true);
  };

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-1">Visão geral das métricas do seu blog</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Atualizar
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total de Acessos"
            value={stats.totalVisits}
            icon={<BarChart3 className="w-6 h-6" />}
            color="blue"
            trend="+12%"
          />
          <StatsCard
            title="Acessos Hoje"
            value={stats.visitsToday}
            icon={<TrendingUp className="w-6 h-6" />}
            color="green"
            trend="+5%"
          />
          <StatsCard
            title="Total Mensagens"
            value={stats.totalMessages}
            icon={<MessageSquare className="w-6 h-6" />}
            color="purple"
            trend="+8%"
          />
          <StatsCard
            title="Mensagens Pendentes"
            value={stats.pendingMessages}
            icon={<Users className="w-6 h-6" />}
            color="orange"
            trend="-2%"
          />
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visits Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Acessos ao Site</h2>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={period}
                onChange={(e) => handlePeriodChange(e.target.value as 'day' | 'week' | 'month')}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="day">Últimos 7 dias</option>
                <option value="week">Últimas 4 semanas</option>
                <option value="month">Últimos 6 meses</option>
              </select>
            </div>
          </div>
          <VisitsChart data={visitStats} />
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Resumo Rápido</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-gray-700">Período Ativo</span>
              </div>
              <span className="text-purple-600 font-semibold">
                {period === 'day' ? '7 dias' : period === 'week' ? '4 semanas' : '6 meses'}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-700">Média Diária</span>
              </div>
              <span className="text-blue-600 font-semibold">
                {stats ? Math.round(stats.totalVisits / 30) : 0} acessos
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-green-600" />
                <span className="font-medium text-gray-700">Taxa Resposta</span>
              </div>
              <span className="text-green-600 font-semibold">85%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Mensagens WhatsApp</h2>
          <p className="text-gray-600 mt-1">Gerencie contatos e status das conversas</p>
        </div>
        <MessagesTable />
      </div>
    </div>
  );
};