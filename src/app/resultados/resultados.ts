import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../services/supabase';

@Component({
  selector: 'app-resultados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resultados.html',
  styleUrls: ['./resultados.css']
})
export class ResultadosComponent implements OnInit {

  ahorcado = signal<any[]>([]);
  mayorMenor = signal<any[]>([]);
  preguntados = signal<any[]>([]);
  monkeyJump = signal<any[]>([]);

  constructor(private supabaseService: SupabaseService) {}

  async ngOnInit() {

    // CARGA INICIAL
    await this.cargarResultados();

    // REALTIME AHORCADO
    this.supabaseService.supabase
      .channel('ahorcado-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'partidas_ahorcado'
        },
        () => {
          this.cargarAhorcado();
        }
      )
      .subscribe();

    // REALTIME MAYOR MENOR
    this.supabaseService.supabase
      .channel('mayor-menor-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'partidas_mayor_menor'
        },
        () => {
          this.cargarMayorMenor();
        }
      )
      .subscribe();

    // REALTIME PREGUNTADOS
    this.supabaseService.supabase
      .channel('preguntados-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'resultados_preguntados'
        },
        () => {
          this.cargarPreguntados();
        }
      )
      .subscribe();

    // REALTIME MONKEY JUMP
    this.supabaseService.supabase
      .channel('monkey-jump-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'partidas_monkey_jump'
        },
        () => {
          this.cargarMonkeyJump();
        }
      )
      .subscribe();
  }

  private async cargarResultados() {

    await this.cargarAhorcado();

    await this.cargarMayorMenor();

    await this.cargarPreguntados();

    await this.cargarMonkeyJump();

  }

  private async cargarAhorcado() {

    const data =
      await this.supabaseService.getResultados('partidas_ahorcado');

    this.ahorcado.set(data);

  }

  private async cargarMayorMenor() {

    const data =
      await this.supabaseService.getResultados('partidas_mayor_menor');

    this.mayorMenor.set(data);

  }

  private async cargarPreguntados() {

    const data =
      await this.supabaseService.getResultados('resultados_preguntados');

    this.preguntados.set(data);

  }

  private async cargarMonkeyJump() {

    const data =
      await this.supabaseService.getResultados('partidas_monkey_jump');

    this.monkeyJump.set(data);

  }

}