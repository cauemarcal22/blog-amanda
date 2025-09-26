import { supabase } from './supabase';
import { SiteVisit, WhatsAppMessage } from './supabase';
import { startOfDay, endOfDay, subDays, subWeeks, subMonths } from 'date-fns';

export interface DashboardStats {
  totalVisits: number;
  totalMessages: number;
  pendingMessages: number;
  visitsToday: number;
}

export interface VisitStats {
  date: string;
  visits: number;
}

export interface MessageStats {
  status: string;
  count: number;
}

class ApiService {
  // Dashboard Statistics
  async getDashboardStats(): Promise<DashboardStats> {
    const today = new Date();
    const startToday = startOfDay(today);
    const endToday = endOfDay(today);

    // Total visits
    const { count: totalVisits } = await supabase
      .from('site_visits')
      .select('*', { count: 'exact', head: true });

    // Visits today
    const { count: visitsToday } = await supabase
      .from('site_visits')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startToday.toISOString())
      .lte('created_at', endToday.toISOString());

    // Total messages
    const { count: totalMessages } = await supabase
      .from('whatsapp_messages')
      .select('*', { count: 'exact', head: true });

    // Pending messages
    const { count: pendingMessages } = await supabase
      .from('whatsapp_messages')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Aguardando');

    return {
      totalVisits: totalVisits || 0,
      totalMessages: totalMessages || 0,
      pendingMessages: pendingMessages || 0,
      visitsToday: visitsToday || 0
    };
  }

  // Visit Statistics
  async getVisitStats(period: 'day' | 'week' | 'month' = 'week'): Promise<VisitStats[]> {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'day':
        startDate = subDays(now, 7);
        break;
      case 'week':
        startDate = subWeeks(now, 4);
        break;
      case 'month':
        startDate = subMonths(now, 6);
        break;
    }

    const { data: visits, error } = await supabase
      .from('site_visits')
      .select('created_at')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Group visits by date
    const visitsByDate: { [key: string]: number } = {};
    
    visits?.forEach(visit => {
      const date = new Date(visit.created_at).toISOString().split('T')[0];
      visitsByDate[date] = (visitsByDate[date] || 0) + 1;
    });

    return Object.entries(visitsByDate).map(([date, count]) => ({
      date,
      visits: count
    }));
  }

  // WhatsApp Messages
  async getWhatsAppMessages(): Promise<WhatsAppMessage[]> {
    const { data, error } = await supabase
      .from('whatsapp_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async updateMessageStatus(id: string, status: WhatsAppMessage['status']): Promise<void> {
    const { error } = await supabase
      .from('whatsapp_messages')
      .update({ 
        status, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id);

    if (error) throw error;
  }

  // Site Visits
  async getSiteVisits(limit: number = 100): Promise<SiteVisit[]> {
    const { data, error } = await supabase
      .from('site_visits')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  // Add new visit (for tracking)
  async addSiteVisit(visit: Omit<SiteVisit, 'id' | 'created_at'>): Promise<void> {
    const { error } = await supabase
      .from('site_visits')
      .insert([visit]);

    if (error) throw error;
  }

  // Add new WhatsApp message
  async addWhatsAppMessage(message: Omit<WhatsAppMessage, 'id' | 'created_at' | 'updated_at'>): Promise<void> {
    const { error } = await supabase
      .from('whatsapp_messages')
      .insert([{
        ...message,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }]);

    if (error) throw error;
  }

  // Message statistics
  async getMessageStats(): Promise<MessageStats[]> {
    const { data, error } = await supabase
      .from('whatsapp_messages')
      .select('status')
      .order('status');

    if (error) throw error;

    const stats: { [key: string]: number } = {};
    data?.forEach(msg => {
      stats[msg.status] = (stats[msg.status] || 0) + 1;
    });

    return Object.entries(stats).map(([status, count]) => ({
      status,
      count
    }));
  }
}

export const apiService = new ApiService();