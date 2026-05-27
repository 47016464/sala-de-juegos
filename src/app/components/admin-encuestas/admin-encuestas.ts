import {
  Component,
  OnInit,
  signal
} from '@angular/core';

import { RouterLink } from '@angular/router';

import {
  CommonModule
} from '@angular/common';

import {
  SupabaseService
} from '../../services/supabase';

@Component({
  selector:
    'app-admin-encuestas',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl:
    './admin-encuestas.html',

  styleUrls: [
    './admin-encuestas.css'
  ]
})

export class
AdminEncuestasComponent
implements OnInit {

  encuestas =
    signal<any[]>([]);

  totalEncuestas =
    signal(0);

  promedioEdad =
    signal(0);

  generoMasElegido =
    signal('');

  aspectoMasElegido =
    signal('');

  encuestaActual = 0;

  constructor(
    private supabaseService:
    SupabaseService
  ) {}

  async ngOnInit() {

    const datos =
      await this.supabaseService
        .obtenerEncuestas();

    this.encuestas.set(datos);

    this.totalEncuestas.set(
      datos.length
    );

    const sumaEdades =
      datos.reduce(
        (acc, encuesta) =>
          acc + encuesta.edad,
        0
      );

    this.promedioEdad.set(

      datos.length > 0

        ? Math.round(
            sumaEdades /
            datos.length
          )

        : 0

    );

    const generos: any = {};

    datos.forEach(encuesta => {

      generos[
        encuesta.genero_favorito
      ] =

      (
        generos[
          encuesta.genero_favorito
        ] || 0
      ) + 1;

    });

    this.generoMasElegido.set(

      Object.keys(generos)
        .reduce((a, b) =>

          generos[a] >
          generos[b]

            ? a
            : b,

        '')

    );

    const aspectos: any = {};

    datos.forEach(encuesta => {

      encuesta.aspectos_favoritos
        .split(',')

        .forEach(
          (aspecto: string) => {

            const limpio =
              aspecto.trim();

            aspectos[limpio] =

              (
                aspectos[limpio]
                || 0
              ) + 1;

          }
        );

    });

    this.aspectoMasElegido.set(

      Object.keys(aspectos)
        .reduce((a, b) =>

          aspectos[a] >
          aspectos[b]

            ? a
            : b,

        '')

    );

  }

  siguienteEncuesta() {

    if (

      this.encuestaActual <

      this.encuestas().length - 1

    ) {

      this.encuestaActual++;

    }

  }

  anteriorEncuesta() {

    if (
      this.encuestaActual > 0
    ) {

      this.encuestaActual--;

    }

  }

}