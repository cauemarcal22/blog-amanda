import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Phone, 
  Calendar, 
  ExternalLink,
  Filter,
  Search,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { apiService } from '../../lib/api';
import { WhatsAppMessage } from '../../lib/supabase';

const statusConfig = {
  'Aguardando': {
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: <Clock className="w-4 h-4" />
  },
  'Em preparo': {
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: <AlertCircle className="w-4 h-4" />
  },
  'Finalizado': {
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: <CheckCircle className="w-4 h-4" />
  }
};

export const MessagesTable: React.FC = () => {
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const data = await apiService.getWhatsAppMessages();
      setMessages(data);
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: WhatsAppMessage['status']) => {
    try {
      await apiService.updateMessageStatus(id, newStatus);
      setMessages(prev => 
        prev.map(msg => 
          msg.id === id 
            ? { ...msg, status: newStatus, updated_at: new Date().toISOString() }
            : msg
        )
      );
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const openWhatsApp = (phone: string, name: string) => {
    const message = `Olá ${name}! Obrigada pelo seu contato. Como posso ajudá-lo?`;
    const url = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const filteredMessages = messages.filter(message => {
    const matchesFilter = filter === 'all' || message.status === filter;
    const matchesSearch = search === '' || 
      message.name.toLowerCase().includes(search.toLowerCase()) ||
      message.phone.includes(search) ||
      message.message.toLowerCase().includes(search.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">Todos os status</option>
            <option value="Aguardando">Aguardando</option>
            <option value="Em preparo">Em preparo</option>
            <option value="Finalizado">Finalizado</option>
          </select>
        </div>
        
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar por nome, telefone ou mensagem..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-700">Contato</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Mensagem</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Data</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredMessages.map((message) => (
              <tr key={message.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-medium">
                      {message.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{message.name}</p>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {message.phone}
                      </p>
                    </div>
                  </div>
                </td>
                
                <td className="py-4 px-4">
                  <p className="text-sm text-gray-700 max-w-xs truncate" title={message.message}>
                    {message.message}
                  </p>
                </td>
                
                <td className="py-4 px-4">
                  <select
                    value={message.status}
                    onChange={(e) => handleStatusChange(message.id, e.target.value as WhatsAppMessage['status'])}
                    className={`text-xs font-medium px-3 py-1 rounded-full border ${statusConfig[message.status].color} focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                  >
                    <option value="Aguardando">Aguardando</option>
                    <option value="Em preparo">Em preparo</option>
                    <option value="Finalizado">Finalizado</option>
                  </select>
                </td>
                
                <td className="py-4 px-4">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Calendar className="w-3 h-3" />
                    {new Date(message.created_at).toLocaleDateString('pt-BR')}
                  </div>
                </td>
                
                <td className="py-4 px-4">
                  <button
                    onClick={() => openWhatsApp(message.phone, message.name)}
                    className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <MessageSquare className="w-3 h-3" />
                    WhatsApp
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredMessages.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>Nenhuma mensagem encontrada</p>
          </div>
        )}
      </div>
    </div>
  );
};