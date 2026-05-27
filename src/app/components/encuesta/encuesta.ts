import {
  Component,
  OnInit,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import { SupabaseService } from '../../services/supabase';

@Component({
  selector: 'app-encuesta',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './encuesta.html',
  styleUrls: ['./encuesta.css']
})

export class EncuestaComponent
implements OnInit {

  encuestaForm: FormGroup;

  enviado = false;
  guardando = false;

  mensaje = signal('');

  yaRespondio = signal(false);

  totalEncuestas = signal(0);

  generoMasElegido = signal('');

  promedioEdad = signal(0);

  aspectoMasElegido = signal('');

  encuestaActual = 0;

  esAdmin = signal(false);

  encuestas = signal<any[]>([]);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private supabaseService: SupabaseService
  ) {

    this.encuestaForm =
      this.fb.group({

        nombre: [
          '',
          Validators.required
        ],

        apellido: [
          '',
          Validators.required
        ],

        edad: [
          '',
          [
            Validators.required,
            Validators.min(18),
            Validators.max(99)
          ]
        ],

        telefono: [
          '',
          [
            Validators.required,
            Validators.pattern(
              '^[0-9]{1,10}$'
            )
          ]
        ],

        genero_favorito: [
          '',
          Validators.required
        ],

        aspectos_favoritos: [
          [],
          Validators.required
        ],

        horas_juego: [
          '',
          Validators.required
        ],

        comentario: [
          '',
          Validators.required
        ]

      });

  }

  async ngOnInit() {

    const user =
      await this.authService
        .getUser();

    this.esAdmin.set(
      user?.email ===
      'augusebottazzi@gmail.com'
    );

    if (this.esAdmin()) {

      await this.cargarResultados();

    }

  }

  async cargarResultados() {

    this.encuestas.set(
      await this.supabaseService
        .obtenerEncuestas()
    );

    this.totalEncuestas.set(
      this.encuestas().length
    );

    // PROMEDIO EDAD

    const sumaEdades =
      this.encuestas().reduce(
        (acc, encuesta) =>
          acc + encuesta.edad,
        0
      );

    this.promedioEdad.set(

      this.totalEncuestas() > 0

        ? Math.round(
            sumaEdades /
            this.totalEncuestas()
          )

        : 0

    );

    // GÉNERO MÁS ELEGIDO

    const conteoGeneros: any = {};

    this.encuestas().forEach(
      encuesta => {

        const genero =
          encuesta.genero_favorito;

        conteoGeneros[genero] =
          (conteoGeneros[genero] || 0) + 1;

      }
    );

    this.generoMasElegido.set(

      Object.keys(conteoGeneros)
        .reduce((a, b) =>

          conteoGeneros[a] >
          conteoGeneros[b]

            ? a
            : b,

        '')

    );

    // ASPECTO MÁS ELEGIDO

    const conteoAspectos: any = {};

    this.encuestas().forEach(
      encuesta => {

        const aspectos =
          encuesta.aspectos_favoritos
            .split(',');

        aspectos.forEach(
          (aspecto: string) => {

            const limpio =
              aspecto.trim();

            conteoAspectos[limpio] =
              (conteoAspectos[limpio] || 0) + 1;

          }
        );

      }
    );

    this.aspectoMasElegido.set(

      Object.keys(conteoAspectos)
        .reduce((a, b) =>

          conteoAspectos[a] >
          conteoAspectos[b]

            ? a
            : b,

        '')

    );

  }

  manejarCheckbox(event: any) {

    const seleccionados =
      this.encuestaForm.value
        .aspectos_favoritos;

    if (event.target.checked) {

      seleccionados.push(
        event.target.value
      );

    } else {

      const index =
        seleccionados.indexOf(
          event.target.value
        );

      seleccionados.splice(
        index,
        1
      );

    }

    this.encuestaForm
      .get('aspectos_favoritos')
      ?.setValue(
        seleccionados
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

  async enviarEncuesta() {

    this.enviado = true;

    this.mensaje.set('');

    if (
      this.encuestaForm.invalid
    ) return;

    this.guardando = true;

    const usuario =
      this.authService
        .getUserName();

    try {

      const yaRespondio =
        await this.supabaseService
          .usuarioYaRespondioEncuesta(
            usuario
          );

      if (yaRespondio) {

        this.guardando = false;

        this.yaRespondio.set(true);

        this.mensaje.set(
          '❌ Ya respondiste esta encuesta'
        );

        return;

      }

      const datos = {

        usuario,

        ...this.encuestaForm.value,

        aspectos_favoritos:

          this.encuestaForm.value
            .aspectos_favoritos
            .join(', ')

      };

      await this.supabaseService
        .guardarEncuesta(datos);

      this.mensaje.set(
        '✅ Encuesta enviada correctamente'
      );

      this.encuestaForm.reset();

      this.enviado = false;

      // RECARGAR RESULTADOS

      if (this.esAdmin()) {

        await this.cargarResultados();

      }

    } catch (error) {

      console.error(error);

      this.mensaje.set(
        '❌ Error al guardar encuesta'
      );

    }

    this.guardando = false;

  }

}