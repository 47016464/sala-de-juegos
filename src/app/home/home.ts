import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,], 
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {
  mostrarQuienSoy = false;

  constructor(public authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}

