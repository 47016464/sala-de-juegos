import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase = createClient(
    'https://ggzbssdsldivfuzoiqzs.supabase.co',
    'sb_publishable_KfaZ_-yJ8DIIZiOslhG7Zw_TNHcvck9'
  );
  private user: any = null;

  constructor(private router: Router) {
    // 🚨 Escucha cambios globales de sesión
    this.supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        this.user = null;
        this.router.navigate(['/home']); // Redirige SIEMPRE al menú
      }
    });
  }

  async login(email: string, password: string): Promise<boolean> {
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    const { data: userData } = await this.supabase.auth.getUser();
    this.user = userData?.user;

    return !!this.user;
  }

  async register(user: { email: string, password: string, nombre: string, apellido: string, edad: number | null }): Promise<boolean> {
    const { data, error } = await this.supabase.auth.signUp({
      email: user.email,
      password: user.password,
      options: {
        data: {
          nombre: user.nombre,
          apellido: user.apellido,
          edad: user.edad
        }
      }
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

  async logout() {
    await this.supabase.auth.signOut();
    this.user = null;
    this.router.navigate(['/home']); // 🚨 Redirige al menú incluso si se llama manualmente
  }

  isLoggedIn(): boolean {
    return this.user !== null;
  }

  getUserName(): string {
    return this.user?.user_metadata?.nombre || this.user?.email || '';
  }

  async getUser() {
    const { data: { user } } = await this.supabase.auth.getUser();
    return user;
  }
}