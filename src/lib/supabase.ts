import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Criar cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface AdminUser {
  id: string;
  username: string;
  email: string;
  permissions: string[];
  created_at: string;
  last_login?: string;
}

export interface SiteVisit {
  id: string;
  ip_address: string;
  page_url: string;
  user_agent?: string;
  referrer?: string;
  created_at: string;
}

export interface WhatsAppMessage {
  id: string;
  name: string;
  phone: string;
  message: string;
  status: 'Em preparo' | 'Finalizado' | 'Aguardando';
  created_at: string;
  updated_at: string;
}