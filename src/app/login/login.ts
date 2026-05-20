import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  error: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  async login() {
    try {
      const success = await this.authService.login(this.email, this.password);
      if (success) {
        this.router.navigate(['/home']);
      } else {
        this.error = 'Credenciales inválidas';
      }
    } catch (err: any) {
      this.error = err.message || 'Error al iniciar sesión';
    }
  }

  async quickLogin(email: string, password: string) {
    try {
      const success = await this.authService.login(email, password);
      if (success) {
        this.router.navigate(['/home']);
      } else {
        this.error = 'Credenciales inválidas';
      }
    } catch (err: any) {
      this.error = err.message || 'Error al iniciar sesión';
    }
  }
}
