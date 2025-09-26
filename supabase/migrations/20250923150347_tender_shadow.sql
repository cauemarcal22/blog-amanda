/*
  # Painel Administrativo - Estrutura do Banco de Dados

  1. Novas Tabelas
    - `admin_users` - Usuários administradores
      - `id` (uuid, primary key)
      - `username` (text, unique)
      - `email` (text, unique)
      - `password_hash` (text)
      - `permissions` (text array)
      - `created_at` (timestamp)
      - `last_login` (timestamp)
    
    - `site_visits` - Acessos ao site
      - `id` (uuid, primary key)
      - `ip_address` (text)
      - `page_url` (text)
      - `user_agent` (text)
      - `created_at` (timestamp)
    
    - `whatsapp_messages` - Mensagens do WhatsApp
      - `id` (uuid, primary key)
      - `name` (text)
      - `phone` (text)
      - `message` (text)
      - `status` (text) - 'Em preparo', 'Finalizado', 'Aguardando'
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Segurança
    - Enable RLS em todas as tabelas
    - Políticas para acesso apenas por usuários autenticados
    - Índices para performance
*/

-- Tabela de usuários administradores
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  permissions text[] DEFAULT ARRAY['read', 'write'],
  created_at timestamptz DEFAULT now(),
  last_login timestamptz
);

-- Tabela de acessos ao site
CREATE TABLE IF NOT EXISTS site_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address text NOT NULL,
  page_url text NOT NULL,
  user_agent text,
  referrer text,
  created_at timestamptz DEFAULT now()
);

-- Tabela de mensagens do WhatsApp
CREATE TABLE IF NOT EXISTS whatsapp_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'Aguardando' CHECK (status IN ('Em preparo', 'Finalizado', 'Aguardando')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Admin users can manage all data"
  ON admin_users
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Admin users can view site visits"
  ON site_visits
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin users can manage site visits"
  ON site_visits
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Admin users can manage whatsapp messages"
  ON whatsapp_messages
  FOR ALL
  TO authenticated
  USING (true);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_site_visits_created_at ON site_visits(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_site_visits_page_url ON site_visits(page_url);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_created_at ON whatsapp_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_status ON whatsapp_messages(status);

-- Inserir usuário admin padrão (senha: admin123)
INSERT INTO admin_users (username, email, password_hash) 
VALUES (
  'admin',
  'admin@amandalima.com',
  '$2b$10$rOzJqQZQZQZQZQZQZQZQZOzJqQZQZQZQZQZQZQZQZQZQZQZQZQZQZ'
) ON CONFLICT (username) DO NOTHING;

-- Dados de exemplo para demonstração
INSERT INTO site_visits (ip_address, page_url, user_agent) VALUES
  ('192.168.1.1', '/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
  ('192.168.1.2', '/sobre', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'),
  ('192.168.1.3', '/portfolio', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)'),
  ('192.168.1.4', '/contato', 'Mozilla/5.0 (Android 11; Mobile; rv:68.0) Gecko/68.0'),
  ('192.168.1.5', '/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

INSERT INTO whatsapp_messages (name, phone, message, status) VALUES
  ('João Silva', '+5511987654321', 'Olá Amanda! Gostaria de uma parceria para minha marca de cosméticos.', 'Aguardando'),
  ('Maria Santos', '+5511876543210', 'Oi! Represento uma empresa de moda e queremos trabalhar juntos.', 'Em preparo'),
  ('Pedro Costa', '+5511765432109', 'Amanda, sua empresa de alimentos gostaria de fazer uma campanha.', 'Finalizado'),
  ('Ana Oliveira', '+5511654321098', 'Olá! Temos interesse em parceria para supermercado.', 'Aguardando'),
  ('Carlos Lima', '+5511543210987', 'Oi Amanda! Marca de beleza interessada em colaboração.', 'Em preparo');