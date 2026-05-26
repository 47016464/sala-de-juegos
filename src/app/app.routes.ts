import { Routes } from '@angular/router';

import { HomeComponent } from './components/home/home';
import { LoginComponent } from './components/login/login';
import { RegistroComponent } from './components/registro/registro';
import { QuienSoyComponent } from './components/quien-soy/quien-soy';

import { AhorcadoComponent } from './components/juegos/ahorcado/ahorcado';
import { MayorMenorComponent } from './components/juegos/mayor-menor/mayor-menor';

import { ChatComponent } from './components/chat/chat';

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
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  }

];