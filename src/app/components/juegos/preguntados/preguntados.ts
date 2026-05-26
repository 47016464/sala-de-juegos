import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { SupabaseService } from '../../../services/supabase';


interface Pregunta {
  enunciado: string;
  correcta: string;
  opciones: string[];
}

@Component({
  selector: 'app-preguntados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preguntados.html',
  styleUrls: ['./preguntados.css']
})
export class PreguntadosComponent implements OnInit {

  preguntas: Pregunta[]           = [];
  preguntaActual: Pregunta | null = null;
  puntaje           = 0;
  numeroPregunta    = 0;
  fallos            = 0;
  readonly MAX_FALLOS = 3;
  juegoTerminado    = false;
  cargando          = true;
  guardando         = false;
  seleccionada: string | null = null;
  esCorrecta: boolean | null  = null;
  private iniciando           = false;

  constructor(
  private cd: ChangeDetectorRef,
  private authService: AuthService,
  private supabaseService: SupabaseService
) {}

  ngOnInit(): void {
    this.cargarPokemon();
  }

  // ── Carga inicial ─────────────────────────────────────────────────────────────
  async cargarPokemon(): Promise<void> {
    this.cargando = true;
    try {
      const ids = this.idsAleatorios(1, 386, 20);
      const pokemones = await Promise.all(
        ids.map(id =>
          fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(r => r.json())
        )
      );
      this.preguntas = this.armarPreguntas(pokemones)
        .sort(() => Math.random() - 0.5);
    } catch (e) {
      console.error('Error cargando pokémon:', e);
      this.preguntas = [];
    } finally {
      this.cargando = false;
      this.mostrarPregunta();
      this.cd.detectChanges();
    }
  }

  // ── Carga adicional cuando se agotan las preguntas ────────────────────────────
  async cargarMasPokemon(): Promise<void> {
    try {
      const ids = this.idsAleatorios(1, 386, 20);
      const pokemones = await Promise.all(
        ids.map(id =>
          fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(r => r.json())
        )
      );
      const nuevas = this.armarPreguntas(pokemones)
        .sort(() => Math.random() - 0.5);
      this.preguntas = [...this.preguntas, ...nuevas];
      this.mostrarPregunta();
      this.cd.detectChanges();
    } catch (e) {
      console.error('Error cargando más pokémon:', e);
      this.terminarJuego();
    }
  }

  private idsAleatorios(min: number, max: number, cantidad: number): number[] {
    const ids = new Set<number>();
    while (ids.size < cantidad) {
      ids.add(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return Array.from(ids);
  }

  // ── Generador de preguntas ────────────────────────────────────────────────────
  armarPreguntas(pokemones: any[]): Pregunta[] {
    const preguntas: Pregunta[] = [];
    const shuffle = (a: any[]) => [...a].sort(() => Math.random() - 0.5);
    const capitalizar = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

    pokemones.forEach((poke, i) => {
      const nombre    = capitalizar(poke.name);
      const tipo      = capitalizar(poke.types[0].type.name);
      const peso      = (poke.weight / 10).toFixed(1) + ' kg';
      const altura    = (poke.height / 10).toFixed(1) + ' m';
      const habilidad = capitalizar(poke.abilities[0]?.ability?.name ?? '');
      const numero    = poke.id;

      const otrosNombres = shuffle(pokemones)
        .filter((_: any, j: number) => j !== i)
        .map((p: any) => capitalizar(p.name))
        .slice(0, 3);

      const otrosTipos = shuffle(['Fuego','Agua','Planta','Eléctrico','Psíquico',
        'Normal','Roca','Fantasma','Veneno','Tierra','Volador','Lucha',
        'Bicho','Hielo','Dragón','Siniestro','Acero','Hada'])
        .filter(t => t !== tipo)
        .slice(0, 3);

      const otrosPesos = pokemones
        .filter((_: any, j: number) => j !== i)
        .map((p: any) => (p.weight / 10).toFixed(1) + ' kg')
        .filter(p => p !== peso)
        .slice(0, 3);

      const otrasAlturas = pokemones
        .filter((_: any, j: number) => j !== i)
        .map((p: any) => (p.height / 10).toFixed(1) + ' m')
        .filter(a => a !== altura)
        .slice(0, 3);

      const otrasHabilidades = shuffle(pokemones)
        .filter((_: any, j: number) => j !== i)
        .map((p: any) => capitalizar(p.abilities[0]?.ability?.name ?? ''))
        .filter(h => h && h !== habilidad)
        .slice(0, 3);

      // P1: ¿De qué tipo es X?
      preguntas.push({
        enunciado: `🔥 ¿De qué tipo es <strong>${nombre}</strong>?`,
        correcta:  tipo,
        opciones:  shuffle([tipo, ...otrosTipos])
      });

      // P2: ¿Cuánto pesa X?
      if (otrosPesos.length >= 3) {
        preguntas.push({
          enunciado: `⚖️ ¿Cuánto pesa <strong>${nombre}</strong>?`,
          correcta:  peso,
          opciones:  shuffle([peso, ...otrosPesos])
        });
      }

      // P3: ¿Cuánto mide X?
      if (otrasAlturas.length >= 3) {
        preguntas.push({
          enunciado: `📏 ¿Cuánto mide <strong>${nombre}</strong>?`,
          correcta:  altura,
          opciones:  shuffle([altura, ...otrasAlturas])
        });
      }

      // P4: ¿Cuál es la habilidad de X?
      if (otrasHabilidades.length >= 3) {
        preguntas.push({
          enunciado: `✨ ¿Cuál es la habilidad principal de <strong>${nombre}</strong>?`,
          correcta:  habilidad,
          opciones:  shuffle([habilidad, ...otrasHabilidades])
        });
      }

      // P5: ¿Cuál es el Pokémon #N?
      if (otrosNombres.length >= 3) {
        preguntas.push({
          enunciado: `📖 ¿Cuál es el Pokémon número <strong>#${numero}</strong> de la Pokédex?`,
          correcta:  nombre,
          opciones:  shuffle([nombre, ...otrosNombres])
        });
      }
    });

    return preguntas;
  }

  // ── Flujo del juego ───────────────────────────────────────────────────────────
  mostrarPregunta(): void {
    if (this.fallos >= this.MAX_FALLOS) {
      this.terminarJuego();
      return;
    }
    this.preguntaActual = this.preguntas[this.numeroPregunta];
    this.seleccionada   = null;
    this.esCorrecta     = null;
  }

  responder(opcion: string): void {
    if (this.seleccionada) return;
    this.seleccionada = opcion;
    this.esCorrecta   = opcion === this.preguntaActual!.correcta;

    if (this.esCorrecta) {
      this.puntaje++;
      this.reproducirSonido('assets/sonidos/acierto.mp3');
    } else {
      this.fallos++;
      this.reproducirSonido('assets/sonidos/error.mp3');
    }

    setTimeout(() => {
      if (this.fallos >= this.MAX_FALLOS) {
        this.terminarJuego();
        return;
      }
      this.numeroPregunta++;
      if (this.numeroPregunta >= this.preguntas.length) {
        this.cargarMasPokemon();
      } else {
        this.mostrarPregunta();
        this.cd.detectChanges();
      }
    }, 1300);
  }

  private reproducirSonido(path: string): void {
    const audio = new Audio(path);
    audio.play().catch(e => console.warn('No se pudo reproducir sonido:', e));
  }

  async terminarJuego(): Promise<void> {

  if (this.juegoTerminado) return;

  this.juegoTerminado = true;
  this.guardando = true;

  this.cd.detectChanges();

  const datosPartida = {
    usuario_email: this.authService.getUserName(),
    puntaje: this.puntaje
  };

  try {

    await this.supabaseService.guardarPreguntados(
      datosPartida
    );

  } catch (error) {

    console.error(
      'Error guardando resultado Preguntados:',
      error
    );

  }

  this.guardando = false;

  this.cd.detectChanges();
}

  reiniciar(): void {
    this.puntaje        = 0;
    this.numeroPregunta = 0;
    this.fallos         = 0;
    this.juegoTerminado = false;
    this.preguntas      = [];
    this.preguntaActual = null;
    this.iniciando      = false;
    this.cargarPokemon();
  }

  get porcentaje(): number {
    return this.numeroPregunta
      ? Math.round((this.puntaje / this.numeroPregunta) * 100)
      : 0;
  }

  mensajeFinal(): string {
    if (this.puntaje >= 20) return '¡Maestro Pokémon! 🏆';
    if (this.puntaje >= 10) return '¡Muy bien, entrenador! 👏';
    if (this.puntaje >= 5)  return 'No está mal, seguí entrenando ⚡';
    return '¡A ver más Pokémon! 😅';
  }
}