# 🔧 Como Configurar o Supabase

## Passo a Passo para Configurar o Banco de Dados

### 1. Criar Conta no Supabase
1. Acesse: https://supabase.com/dashboard
2. Clique em "Sign Up" ou "Start your project"
3. Crie sua conta (pode usar GitHub, Google, etc.)

### 2. Criar Novo Projeto
1. No dashboard, clique em "New Project"
2. Escolha sua organização
3. Dê um nome ao projeto (ex: "amanda-lima-blog")
4. Crie uma senha forte para o banco de dados
5. Escolha a região mais próxima (ex: South America - São Paulo)
6. Clique em "Create new project"

### 3. Obter as Credenciais
1. Aguarde o projeto ser criado (pode levar alguns minutos)
2. No menu lateral, vá em **Settings** → **API**
3. Você verá duas informações importantes:
   - **Project URL**: algo como `https://xxxxxxxx.supabase.co`
   - **anon/public key**: uma chave longa que começa com `eyJ...`

### 4. Configurar no Projeto
1. Abra o arquivo `.env` na raiz do projeto
2. Substitua os valores:
   ```env
   VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### 5. Executar as Migrações
1. No Supabase Dashboard, vá em **SQL Editor**
2. Clique em "New Query"
3. Copie e cole o conteúdo do arquivo `supabase/migrations/20250923150347_tender_shadow.sql`
4. Clique em "Run" para executar

### 6. Verificar se Funcionou
1. Reinicie o servidor de desenvolvimento
2. Acesse `/admin` 
3. Faça login com: **admin** / **admin123**
4. Se tudo estiver funcionando, você verá dados reais do banco

## 📝 Observações Importantes

- **Modo Desenvolvimento**: Enquanto não configurar o Supabase, o sistema funciona com dados mockados
- **Segurança**: Nunca compartilhe suas chaves do Supabase publicamente
- **Backup**: O Supabase faz backup automático, mas você pode exportar os dados quando quiser

## 🆘 Problemas Comuns

### "Missing Supabase environment variables"
- Verifique se o arquivo `.env` existe na raiz do projeto
- Confirme se as variáveis estão corretas (sem espaços extras)

### "Login não funciona"
- Se ainda não configurou o Supabase, use: **admin** / **admin123**
- Se já configurou, verifique se as migrações foram executadas

### "Dados não aparecem"
- Verifique se executou as migrações SQL no Supabase
- Confirme se as credenciais estão corretas no `.env`

## 💡 Dica
Você pode usar o sistema normalmente mesmo sem configurar o Supabase. Os dados serão simulados, mas todas as funcionalidades estarão disponíveis para teste!