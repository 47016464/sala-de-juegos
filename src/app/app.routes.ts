import { Routes } from '@angular/router';

import { HomeComponent } from './components/home/home';
import { LoginComponent } from './components/login/login';
import { RegistroComponent } from './components/registro/registro';
import { QuienSoyComponent } from './components/quien-soy/quien-soy';

import { AhorcadoComponent } from './components/juegos/ahorcado/ahorcado';
import { MayorMenorComponent } from './components/juegos/mayor-menor/mayor-menor';
import { PreguntadosComponent } from './components/juegos/preguntados/preguntados';
import { MonkeyJumpComponent } from './components/juegos/monkey-jump/monkey-jump';

import { ChatComponent } from './components/chat/chat';
import { ResultadosComponent } from './resultados/resultados';

import { authGuard } from './services/auth.guard';

export const routes: Routes = [

  { path: 'home', component: HomeComponent },

  { path: 'login', component: LoginComponent },

  { path: 'registro', component: RegistroComponent },

  { path: 'quien-soy', component: QuienSoyComponent },

  {
    path: 'juegos/ahorcado',
    component: AhorcadoComponent,
    canActivate: [authGuard]
  },

  {
    path: 'juegos/mayor-menor',
    component: MayorMenorComponent,
    canActivate: [authGuard]
  },

  {
    path: 'chat',
    component: ChatComponent,
    canActivate: [authGuard]
  },

  {
  path: 'juegos/preguntados',
  component: PreguntadosComponent,
  canActivate: [authGuard]
},

{
  path: 'juegos/monkey-jump',
  component: MonkeyJumpComponent,
  canActivate: [authGuard]
},

{
  path: 'resultados',
  component: ResultadosComponent,
  canActivate: [authGuard]
},

  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  }

];