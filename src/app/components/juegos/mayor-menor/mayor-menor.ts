import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { SupabaseService } from '../../../services/supabase';

@Component({
  selector: 'app-mayor-menor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mayor-menor.html',
  styleUrls: ['./mayor-menor.css']
})
export class MayorMenorComponent implements OnInit {

  cartaActual: any = null;
  aciertos = 0;
  mensaje = '';
  gameOver = false;
  juegoIniciado = false;
  mazoId = '';

  ranking: any[] = [];
  partidasTotales = 0;
  promedioAciertos = 0;
  mejorPartida = 0;

  sonidoAcierto = new Audio('assets/sonidos/acierto.mp3');
  sonidoError = new Audio('assets/sonidos/derrota.mp3');
  sonidoVictoria = new Audio('assets/sonidos/victoria.mp3');

  constructor(
    public authService: AuthService,
    private supabase: SupabaseService
  ) {}

  async ngOnInit() {
    await this.cargarRanking();
    await this.cargarEstadisticas();
  }

  // =========================
  // INICIAR JUEGO
  // =========================
  async iniciarJuego() {
    this.juegoIniciado = true;
    this.gameOver = false;
    this.aciertos = 0;
    this.mensaje = '';

    const response = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
    const data = await response.json();
    this.mazoId = data.deck_id;

    this.cartaActual = await this.obtenerCarta();
  }

  async obtenerCarta() {
    const response = await fetch(`https://deckofcardsapi.com/api/deck/${this.mazoId}/draw/?count=1`);
    const data = await response.json();
    return data.cards[0];
  }

  convertirValor(valor: string): number {
    switch (valor) {
      case 'ACE': return 1;
      case 'JACK': return 11;
      case 'QUEEN': return 12;
      case 'KING': return 13;
      default: return parseInt(valor);
    }
  }

  // =========================
  // JUGAR
  // =========================
  async jugar(eleccion: 'mayor' | 'menor') {
    if (this.gameOver) return;

    const valorActual = this.convertirValor(this.cartaActual.value);
    const nuevaCarta = await this.obtenerCarta();
    const valorNuevo = this.convertirValor(nuevaCarta.value);

    const acerto = (eleccion === 'mayor' && valorNuevo > valorActual) ||
                   (eleccion === 'menor' && valorNuevo < valorActual);

    if (acerto) {
      this.cartaActual = nuevaCarta;
      this.aciertos++;
      this.mensaje = '¡Correcto! 🎉';
      this.sonidoAcierto.currentTime = 0;
      this.sonidoAcierto.play();

      if (this.aciertos === 10) {
        this.sonidoVictoria.currentTime = 0;
        this.sonidoVictoria.play();
      }
    } else {
      this.mensaje = 'Perdiste 😢';
      this.gameOver = true;
      this.sonidoError.currentTime = 0;
      this.sonidoError.play();
      await this.finalizarPartida();
    }
  }

  // =========================
  // FINALIZAR
  // =========================
  async finalizarPartida() {
    const tiempoFinalizacion = new Date().toISOString();

    const datosPartida = {
      usuario: this.authService.getUserName(),
      puntaje: this.aciertos,          // se usa aciertos como puntaje
      tiempo: tiempoFinalizacion,      // se guarda fecha/hora como tiempo
      cartas_acertadas: this.aciertos
    };

    try {
      await this.supabase.guardarMayorMenor(datosPartida);
      await this.cargarRanking();
      await this.cargarEstadisticas();
    } catch (err) {
      console.error(err);
    }
  }

  // =========================
  // RANKING
  // =========================
  async cargarRanking() {
    try {
      this.ranking = await this.supabase.obtenerRankingMayorMenor();
    } catch (err) {
      console.error(err);
    }
  }

  // =========================
  // ESTADÍSTICAS
  // =========================
  async cargarEstadisticas() {
    try {
      const partidas = await this.supabase.obtenerEstadisticasMayorMenor();
      this.partidasTotales = partidas.length;

      const suma = partidas.reduce(
        (acc: number, partida: any) => acc + partida.cartas_acertadas,
        0
      );

      this.promedioAciertos = partidas.length > 0
        ? Math.round(suma / partidas.length)
        : 0;

      this.mejorPartida = Math.max(
        ...partidas.map((p: any) => p.cartas_acertadas),
        0
      );
    } catch (err) {
      console.error(err);
    }
  }
}
