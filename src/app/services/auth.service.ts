import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase = createClient(
    'https://ggzbssdsldivfuzoiqzs.supabase.co',
    'sb_publishable_KfaZ_-yJ8DIIZiOslhG7Zw_TNHcvck9'
  );
  private user: any = null;

  async login(email: string, password: string): Promise<boolean> {
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    this.user = data.user;
    return !!data.user;
  }

  async register(user: { email: string, password: string, nombre: string, apellido: string, edad: number | null }): Promise<boolean> {
    const { data, error } = await this.supabase.auth.signUp({
      email: user.email,
      password: user.password
    });

    if (error) {
      if (error.message.includes('already registered')) {
        return false;
      }
      throw error;
    }

    await this.supabase.from('usuarios').insert({
      email: user.email,
      nombre: user.nombre,
      apellido: user.apellido,
      edad: user.edad ?? null
    });

    this.user = data.user;
    return true;
  }

  logout() {
    this.supabase.auth.signOut();
    this.user = null;
  }

  isLoggedIn(): boolean {
    return this.user !== null;
  }

  getUserName(): string {
    return this.user?.email || '';
  }
}
