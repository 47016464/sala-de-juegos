import { Routes } from '@angular/router';
import { authGuard } from './services/auth.guard';
import { adminGuard } from './services/admin-guard';

export const routes: Routes = [

  {
    path: 'home',
    loadComponent: () =>
      import('./components/home/home')
        .then(m => m.HomeComponent)
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login')
        .then(m => m.LoginComponent)
  },

  {
    path: 'registro',
    loadComponent: () =>
      import('./components/registro/registro')
        .then(m => m.RegistroComponent)
  },

  {
    path: 'quien-soy',
    loadComponent: () =>
      import('./components/quien-soy/quien-soy')
        .then(m => m.QuienSoyComponent)
  },

  {
    path: 'juegos/ahorcado',
    loadComponent: () =>
      import('./components/juegos/ahorcado/ahorcado')
        .then(m => m.AhorcadoComponent),
    canActivate: [authGuard]
  },

  {
    path: 'juegos/mayor-menor',
    loadComponent: () =>
      import('./components/juegos/mayor-menor/mayor-menor')
        .then(m => m.MayorMenorComponent),
    canActivate: [authGuard]
  },

  {
    path: 'juegos/preguntados',
    loadComponent: () =>
      import('./components/juegos/preguntados/preguntados')
        .then(m => m.PreguntadosComponent),
    canActivate: [authGuard]
  },

  {
    path: 'juegos/monkey-jump',
    loadComponent: () =>
      import('./components/juegos/monkey-jump/monkey-jump')
        .then(m => m.MonkeyJumpComponent),
    canActivate: [authGuard]
  },

  {
    path: 'chat',
    loadComponent: () =>
      import('./components/chat/chat')
        .then(m => m.ChatComponent),
    canActivate: [authGuard]
  },

  {
    path: 'resultados',
    loadComponent: () =>
      import('./resultados/resultados')
        .then(m => m.ResultadosComponent),
    canActivate: [authGuard]
  },

  {
  path: 'encuesta',
  loadComponent: () =>
    import('./components/encuesta/encuesta')
      .then(m => m.EncuestaComponent),
  canActivate: [authGuard]
},
{
  path: 'admin-encuestas',

  loadComponent: () =>
    import(
      './components/admin-encuestas/admin-encuestas'
    ).then(
      m => m.AdminEncuestasComponent
    ),

  canActivate: [adminGuard]
},

  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  }

];