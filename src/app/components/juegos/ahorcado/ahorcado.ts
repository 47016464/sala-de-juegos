import {
  Component,
  OnDestroy,
  ChangeDetectorRef
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

  palabrasFaciles = ['CASA','PERRO','GATO','LUNA','AUTO','MESA','SOL','FLOR'];
  palabrasMedias = ['ANGULAR','FIREBASE','SERVICIO','PROGRAMA','COMPONENTE','INTERFAZ','VARIABLE'];
  palabrasDificiles = ['TYPESCRIPT','PROGRAMACION','DESARROLLADOR','DEPENDENCIA','CONFIGURACION','AUTENTICACION'];

  palabra = '';
  letrasDisponibles = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  letrasSeleccionadas: string[] = [];
  errores = 0;
  maxErrores = 6;
  juegoTerminado = false;
  victoria = false;
  mensaje = '';
  inicioPartida: number = Date.now();

  tiempoRestante = 0;
  temporizador: ReturnType<typeof setInterval> | undefined;
  victoriasConsecutivas = 0;

  sonidoAcierto = new Audio('assets/sonidos/acierto.mp3');
  sonidoError = new Audio('assets/sonidos/error.mp3');
  sonidoVictoria = new Audio('assets/sonidos/victoria.mp3');
  sonidoDerrota = new Audio('assets/sonidos/derrota.mp3');

  constructor(
    public authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private supabaseService: SupabaseService
  ) {
    this.iniciarJuego();
  }

  obtenerPalabraAleatoria(): string {
    let lista: string[];
    if (this.victoriasConsecutivas >= 5) {
      lista = this.palabrasDificiles;
    } else if (this.victoriasConsecutivas >= 3) {
      lista = this.palabrasMedias;
    } else {
      lista = this.palabrasFaciles;
    }
    return lista[Math.floor(Math.random() * lista.length)];
  }

  iniciarJuego() {
    clearInterval(this.temporizador);
    this.palabra = this.obtenerPalabraAleatoria();
    this.letrasSeleccionadas = [];
    this.errores = 0;
    this.juegoTerminado = false;
    this.victoria = false;
    this.mensaje = '';
    this.inicioPartida = Date.now();

    if (this.victoriasConsecutivas >= 5) {
      this.tiempoRestante = 45;
      this.iniciarTemporizador();
    } else if (this.victoriasConsecutivas >= 3) {
      this.tiempoRestante = 60;
      this.iniciarTemporizador();
    } else {
      this.tiempoRestante = 0;
    }
  }

  iniciarTemporizador() {
    this.temporizador = setInterval(() => {
      this.tiempoRestante--;
      this.cdr.detectChanges();
      if (this.tiempoRestante <= 0) {
        this.tiempoRestante = 0;
        clearInterval(this.temporizador);
        this.finalizarPartida(false, true);
      }
    }, 1000);
  }

  seleccionarLetra(letra: string) {
    if (this.letrasSeleccionadas.includes(letra) || this.juegoTerminado) return;
    this.letrasSeleccionadas.push(letra);

    if (this.palabra.includes(letra)) {
      this.sonidoAcierto.currentTime = 0;
      this.sonidoAcierto.play();
    } else {
      this.errores++;
      this.sonidoError.currentTime = 0;
      this.sonidoError.play();
    }
    this.verificarEstado();
  }

  verificarEstado() {
    const palabraCompleta = this.palabra.split('').every(letra => this.letrasSeleccionadas.includes(letra));
    if (palabraCompleta) this.finalizarPartida(true);
    if (this.errores >= this.maxErrores) this.finalizarPartida(false);
  }

  finalizarPartida(victoria: boolean, tiempoAgotado = false) {
    if (this.juegoTerminado) return;

    this.juegoTerminado = true;
    clearInterval(this.temporizador);
    this.victoria = victoria;

    const tiempoFinalizacion = (Date.now() - this.inicioPartida) / 1000;

    if (victoria) {
      this.victoriasConsecutivas++;
      this.mensaje = '🎉 ¡Ganaste!';
      this.sonidoVictoria.play();
    } else {
      this.victoriasConsecutivas = 0;
      this.mensaje = tiempoAgotado
        ? `⏰ Tiempo agotado. La palabra era: ${this.palabra}`
        : `💀 Perdiste. La palabra era: ${this.palabra}`;
      this.sonidoDerrota.play();
    }

    // =========================
    // DATOS PARA SUPABASE
    // =========================
    const datosPartida = {
      usuario: this.authService.getUserName(),
      puntaje: victoria ? 100 : 0,       // ejemplo simple
      tiempo: tiempoFinalizacion,        // segundos que duró la partida
      victoria,
      palabra: this.palabra,
      errores: this.errores,
      letras_seleccionadas: this.letrasSeleccionadas.length,
      tiempo_restante: this.tiempoRestante,
      victorias_consecutivas: this.victoriasConsecutivas
    };

    this.supabaseService.guardarAhorcado(datosPartida);
  }

  obtenerPalabraOculta(): string[] {
    return this.palabra.split('');
  }

  irAlMenu() {
    this.router.navigate(['/home']);
  }

  continuarJuego() {
    this.iniciarJuego();
  }

  ngOnDestroy(): void {
    clearInterval(this.temporizador);
  }


}
