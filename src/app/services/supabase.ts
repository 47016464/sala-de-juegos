import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  supabase = createClient(
    'https://ggzbssdsldivfuzoiqzs.supabase.co',
    'sb_publishable_KfaZ_-yJ8DIIZiOslhG7Zw_TNHcvck9'
  );

  constructor() {}

  async guardarAhorcado(datos: any) {
  const { error } = await this.supabase
    .from('partidas_ahorcado')
    .insert([datos]);

  if (error) {
    console.error('Error guardando partida Ahorcado:', error);
  }
}

  async guardarPartida(datos: any) {
    console.log('INTENTANDO GUARDAR:', datos);
    const { error } = await this.supabase
      .from('partidas_ahorcado')
      .insert([datos]);

    if (error) {
      console.error('ERROR SUPABASE:', error);
    } else {
      console.log('PARTIDA GUARDADA');
    }
  }

  async guardarMayorMenor(datos: any) {
  console.log('INTENTANDO GUARDAR:', datos);
  const { error } = await this.supabase
    .from('partidas_mayor_menor')
    .insert([datos]);

  if (error) {
    console.error('ERROR SUPABASE:', error);
  } else {
    console.log('PARTIDA GUARDADA');
  }
}

suscribirseMayorMenor(callback: (payload: any) => void) {
  this.supabase
    .channel('mayor-menor-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'partidas_mayor_menor' },
      (payload) => {
        console.log('Cambio detectado:', payload);
        callback(payload);
      }
    )
    .subscribe();
}
async obtenerRankingMayorMenor() {

  const { data, error } = await this.supabase
    .from('partidas_mayor_menor')
    .select('*')
    .order('cartas_acertadas', { ascending: false })
    .limit(5);

  if (error) throw error;

  return data;
  }

  async obtenerEstadisticasMayorMenor() {

  const { data, error } = await this.supabase
    .from('partidas_mayor_menor')
    .select('*');

  if (error) throw error;

  return data;
  }
  
  async guardarPreguntados(datos: any) {

  console.log('INSERTANDO:', datos);

  const { data, error } = await this.supabase
    .from('resultados_preguntados')
    .insert([datos])
    .select();

  console.log('DATA:', data);
  console.log('ERROR:', error);

  if (error) {

    console.error(
      'Error guardando partida Preguntados:',
      error
    );

  } else {

    console.log(
      'Partida Preguntados guardada'
    );

  }

}

  async getMessages() {

  return await this.supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: true });
}

async sendMessage(user: any, content: string) {

  return await this.supabase
    .from('messages')
    .insert([
      {
        user_id: user.id,
        email: user.email,
        content: content
      }
    ]);
}

subscribeToMessages(callback: any) {

  return this.supabase
    .channel('chat-room')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages'
      },
      (payload: any) => {
        callback(payload.new);
      }
    )
    .subscribe();
}

async guardarMonkeyJump(usuario: string, puntaje: number, tiempo: number) {
  const { data, error } = await this.supabase
    .from('partidas_monkey_jump')
    .insert([
      { usuario, puntaje, tiempo }
    ]);

  if (error) {
    console.error('Error guardando partida Monkey Jump:', error);
  } else {
    console.log('Partida guardada:', data);
  }
}

async getResultados(tabla: string) {

  let columnaOrden = 'puntaje';

  // MONKEY JUMP
  if (tabla === 'partidas_monkey_jump') {
    columnaOrden = 'puntaje';
  }

  // MAYOR O MENOR
  if (tabla === 'partidas_mayor_menor') {
    columnaOrden = 'cartas_acertadas';
  }

  // PREGUNTADOS
  if (tabla === 'resultados_preguntados') {
    columnaOrden = 'puntaje';
  }

  // AHORCADO
  if (tabla === 'partidas_ahorcado') {
    columnaOrden = 'victorias_consecutivas';
  }

  const { data, error } = await this.supabase
    .from(tabla)
    .select('*')
    .order(columnaOrden, {
      ascending: false
    });

  if (error) {
    console.error('Error obteniendo resultados:', error);
    return [];
  }

  return data;
}
}
