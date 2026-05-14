import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quien-soy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quien-soy.html',
  styleUrls: ['./quien-soy.css']
})
export class QuienSoyComponent implements OnInit {
  userData: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Al cargar la sección, trae automáticamente tus datos de GitHub
    this.http.get('https://api.github.com/users/47016464')
      .subscribe({
        next: (data) => this.userData = data,
        error: (err) => console.error('Error al traer datos de GitHub', err)
      });
  }
}
