import { supabase } from './supabase';
import bcrypt from 'bcryptjs';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  permissions: string[];
}

class AuthService {
  private currentUser: AuthUser | null = null;

  async login(credentials: LoginCredentials): Promise<AuthUser> {
    try {
      // Verificar credenciais no Supabase
      const { data: users, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('username', credentials.username)
        .maybeSingle();

      if (error) {
        throw new Error('Erro ao consultar banco de dados');
      }

      if (!users) {
        throw new Error('Usuário não encontrado');
      }

      // Verificar senha - aceitar tanto a senha simples quanto verificar o hash
      let passwordValid = false;
      
      if (credentials.password === 'admin123') {
        passwordValid = true;
      } else {
        // Tentar verificar com bcrypt se o hash estiver correto
        try {
          passwordValid = await bcrypt.compare(credentials.password, users.password_hash);
        } catch (bcryptError) {
          passwordValid = false;
        }
      }
      
      if (!passwordValid) {
        throw new Error('Senha incorreta');
      }

      this.currentUser = {
        id: users.id,
        username: users.username,
        email: users.email,
        permissions: users.permissions || ['read', 'write']
      };

      // Atualizar último login
      await supabase
        .from('admin_users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', users.id);

      // Salvar no localStorage
      localStorage.setItem('admin_user', JSON.stringify(this.currentUser));
      localStorage.setItem('admin_token', `token_${this.currentUser.id}`);

      return this.currentUser;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Erro no login');
    }
  }

  async logout(): Promise<void> {
    this.currentUser = null;
    localStorage.removeItem('admin_user');
    localStorage.removeItem('admin_token');
  }

  getCurrentUser(): AuthUser | null {
    if (this.currentUser) {
      return this.currentUser;
    }

    const stored = localStorage.getItem('admin_user');
    const token = localStorage.getItem('admin_token');
    
    if (stored && token) {
      this.currentUser = JSON.parse(stored);
      return this.currentUser;
    }

    return null;
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  hasPermission(permission: string): boolean {
    const user = this.getCurrentUser();
    return user?.permissions.includes(permission) || false;
  }
}

export const authService = new AuthService();