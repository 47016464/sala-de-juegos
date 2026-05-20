import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class RegistroComponent {
  email: string = '';
  nombre: string = '';
  apellido: string = '';
  edad: number | null = null;
  password: string = '';
  error: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  async registrar() {
    try {
      const success = await this.authService.register({
        email: this.email,
        password: this.password,
        nombre: this.nombre,
        apellido: this.apellido,
        edad: this.edad
      });

      if (success) {
        await this.authService.login(this.email, this.password);
        this.router.navigate(['/home']);
      } else {
        this.error = 'El usuario ya se encuentra registrado';
      }
    } catch (err: any) {
      this.error = err.message || 'Error al registrar usuario';
    }
  }
}
