import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { LoginComponent } from './login/login';
import { RegistroComponent } from './registro/registro';
import { QuienSoyComponent } from './quien-soy/quien-soy';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'quien-soy', component: QuienSoyComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' } // redirección inicial
];
