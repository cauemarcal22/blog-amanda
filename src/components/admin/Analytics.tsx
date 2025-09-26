import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  Globe, 
  Smartphone,
  Calendar,
  Download
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { apiService, VisitStats, MessageStats } from '../../lib/api';

export const Analytics: React.FC = () => {
  const [visitStats, setVisitStats] = useState<VisitStats[]>([]);
  const [messageStats, setMessageStats] = useState<MessageStats[]>([]);
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('week');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [period]);

  const loadAnalytics = async () => {
    try {
      const [visits, messages] = await Promise.all([
        apiService.getVisitStats(period),
        apiService.getMessageStats()
      ]);
      
      setVisitStats(visits);
      setMessageStats(messages);
    } catch (error) {
      console.error('Erro ao carregar análises:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#8b5cf6', '#ec4899', '#06b6d4', '#10b981'];

  const deviceData = [
    { name: 'Desktop', value: 45, color: '#8b5cf6' },
    { name: 'Mobile', value: 40, color: '#ec4899' },
    { name: 'Tablet', value: 15, color: '#06b6d4' }
  ];

  const topPages = [
    { page: '/', visits: 1250, percentage: 35 },
    { page: '/portfolio', visits: 890, percentage: 25 },
    { page: '/sobre', visits: 650, percentage: 18 },
    { page: '/contato', visits: 420, percentage: 12 },
    { page: '/formacao', visits: 360, percentage: 10 }
  ];

  if (loading) {
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
          <h1 className="text-3xl font-bold text-gray-800">Análises</h1>
          <p className="text-gray-600 mt-1">Dados detalhados sobre o desempenho do seu blog</p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as 'day' | 'week' | 'month')}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="day">Últimos 7 dias</option>
            <option value="week">Últimas 4 semanas</option>
            <option value="month">Últimos 6 meses</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            <Download className="w-4 h-4" />
            Exportar
          </button>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visits Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Tendência de Acessos</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={visitStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  labelFormatter={(date) => new Date(date).toLocaleDateString('pt-BR')}
                  formatter={(value) => [value, 'Acessos']}
                />
                <Line 
                  type="monotone" 
                  dataKey="visits" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Device Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Dispositivos</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Porcentagem']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {deviceData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Taxa de Rejeição</p>
              <p className="text-2xl font-bold text-gray-900">32%</p>
              <p className="text-sm text-green-600 mt-1">-5% vs mês anterior</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tempo Médio</p>
              <p className="text-2xl font-bold text-gray-900">2m 45s</p>
              <p className="text-sm text-blue-600 mt-1">+12% vs mês anterior</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Usuários Únicos</p>
              <p className="text-2xl font-bold text-gray-900">1,234</p>
              <p className="text-sm text-purple-600 mt-1">+8% vs mês anterior</p>
            </div>
            <Users className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Páginas/Sessão</p>
              <p className="text-2xl font-bold text-gray-900">3.2</p>
              <p className="text-sm text-orange-600 mt-1">+2% vs mês anterior</p>
            </div>
            <Globe className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Páginas Mais Visitadas</h2>
          <div className="space-y-3">
            {topPages.map((page, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <span className="font-medium text-gray-700">{page.page}</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{page.visits.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">{page.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Status das Mensagens</h2>
          <div className="space-y-3">
            {messageStats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="font-medium text-gray-700">{stat.status}</span>
                </div>
                <span className="font-semibold text-gray-900">{stat.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};