import {
  Component,
  OnDestroy,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { SupabaseService } from '../../../services/supabase';

@Component({
  selector: 'app-ahorcado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ahorcado.html',
  styleUrls: ['./ahorcado.css']
})
export class AhorcadoComponent implements OnDestroy {

  palabrasFaciles = [
    'CASA',
    'PERRO',
    'GATO',
    'LUNA',
    'AUTO',
    'MESA',
    'SOL',
    'FLOR'
  ];

  palabrasMedias = [
    'ANGULAR',
    'FIREBASE',
    'SERVICIO',
    'PROGRAMA',
    'COMPONENTE',
    'INTERFAZ',
    'VARIABLE'
  ];

  palabrasDificiles = [
    'TYPESCRIPT',
    'PROGRAMACION',
    'DESARROLLADOR',
    'DEPENDENCIA',
    'CONFIGURACION',
    'AUTENTICACION'
  ];

  palabra = '';

  letrasDisponibles =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  letrasSeleccionadas: string[] = [];

  errores = 0;

  maxErrores = 6;

  juegoTerminado = false;

  victoria = false;

  mensaje = '';

  inicioPartida: number = Date.now();

  tiempoRestante = signal(0);

  temporizador:
    ReturnType<typeof setInterval> | undefined;

  victoriasConsecutivas = 0;

  puntaje = 0;

  guardandoResultado = false;
  guardadoRealizado = false;

  sonidoAcierto =
    new Audio('assets/sonidos/acierto.mp3');

  sonidoError =
    new Audio('assets/sonidos/error.mp3');

  sonidoVictoria =
    new Audio('assets/sonidos/victoria.mp3');

  sonidoDerrota =
    new Audio('assets/sonidos/derrota.mp3');

  constructor(
    public authService: AuthService,
    private router: Router,
    private supabaseService: SupabaseService
  ) {

    this.iniciarJuego();

  }

  obtenerPalabraAleatoria(): string {

    let lista: string[];

    if (this.victoriasConsecutivas >= 5) {

      lista = this.palabrasDificiles;

    } else if (
      this.victoriasConsecutivas >= 3
    ) {

      lista = this.palabrasMedias;

    } else {

      lista = this.palabrasFaciles;

    }

    return lista[
      Math.floor(Math.random() * lista.length)
    ];

  }

  iniciarJuego() {

    clearInterval(this.temporizador);

    this.guardadoRealizado = false;

    this.palabra =
      this.obtenerPalabraAleatoria();

    this.letrasSeleccionadas = [];

    this.errores = 0;

    this.juegoTerminado = false;

    this.victoria = false;

    this.mensaje = '';

    this.guardandoResultado = false;
    

    this.inicioPartida = Date.now();

    if (this.victoriasConsecutivas === 0) {

      this.puntaje = 0;

    }

    if (this.victoriasConsecutivas >= 5) {

      this.tiempoRestante.set(45);

    } else if (
      this.victoriasConsecutivas >= 3
    ) {

      this.tiempoRestante.set(60);

    } else {

      this.tiempoRestante.set(75);

    }

    this.iniciarTemporizador();

  }

  iniciarTemporizador() {

    clearInterval(this.temporizador);

    this.temporizador = setInterval(async () => {

      if (this.juegoTerminado) {

        clearInterval(this.temporizador);

        return;

      }

      this.tiempoRestante.update(
        value => value - 1
      );

      if (this.tiempoRestante() <= 0) {

        this.tiempoRestante.set(0);

        clearInterval(this.temporizador);

        await this.finalizarPartida(
          false,
          true
        );

      }

    }, 1000);

  }

  async seleccionarLetra(letra: string) {

    if (
      this.letrasSeleccionadas.includes(letra)
      || this.juegoTerminado
      || this.guardandoResultado
    ) return;

    this.letrasSeleccionadas.push(letra);

    if (this.palabra.includes(letra)) {

      this.sonidoAcierto.currentTime = 0;

      this.sonidoAcierto.play();

    } else {

      this.errores++;

      this.sonidoError.currentTime = 0;

      this.sonidoError.play();

    }

    await this.verificarEstado();

  }

  async verificarEstado() {

    const palabraCompleta =
      this.palabra
        .split('')
        .every(letra =>
          this.letrasSeleccionadas.includes(letra)
        );

    if (palabraCompleta) {

      await this.finalizarPartida(true);

    }

    if (this.errores >= this.maxErrores) {

      await this.finalizarPartida(false);

    }

  }

  async finalizarPartida(
  victoria: boolean,
  tiempoAgotado = false
) {

  if (
    this.juegoTerminado ||
    this.guardadoRealizado
  ) return;

  this.juegoTerminado = true;
  this.guardadoRealizado = true;

  clearInterval(this.temporizador);

    this.victoria = victoria;

    const tiempoFinalizacion =
  Math.floor(
    (Date.now() - this.inicioPartida) / 1000
  );

if (victoria) {

  this.victoriasConsecutivas++;

  this.puntaje +=
    100 + (this.tiempoRestante() * 10);

  this.mensaje =
    '🎉 ¡Ganaste!';

  this.sonidoVictoria.play();

} else {

  this.victoriasConsecutivas = 0;

  this.puntaje = 0;

  this.mensaje = tiempoAgotado
    ? `⏰ Tiempo agotado. La palabra era: ${this.palabra}`
    : `💀 Perdiste. La palabra era: ${this.palabra}`;

  this.sonidoDerrota.play();

}

const datosPartida = {

  usuario:
    this.authService.getUserName(),

  juego: 'Ahorcado',

  victoria,

  palabra: this.palabra,

  errores: this.errores,

  letras_seleccionadas:
    this.letrasSeleccionadas.length,

  tiempo_partida:
    tiempoFinalizacion,

  tiempo_restante:
    this.tiempoRestante(),

  victorias_consecutivas:
    this.victoriasConsecutivas

};

console.log(
  'Guardando Ahorcado:',
  datosPartida
);

await this.supabaseService
  .guardarAhorcado(
    datosPartida
  );

this.guardandoResultado = false;

  }

  obtenerPalabraOculta(): string[] {

    return this.palabra.split('');

  }

  irAlMenu() {

    this.router.navigate(['/home']);

  }

  continuarJuego() {

    if (this.guardandoResultado) return;

    this.iniciarJuego();

  }

  ngOnDestroy(): void {

    clearInterval(this.temporizador);

  }

}