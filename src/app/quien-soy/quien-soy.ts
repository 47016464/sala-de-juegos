import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-quien-soy',
  standalone: true,
  imports: [CommonModule, HttpClientModule],  // 👈 IMPORTS CORRECTOS
  templateUrl: './quien-soy.html',
  styleUrls: ['./quien-soy.css']
})
export class QuienSoyComponent {
  userData: any;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get('https://api.github.com/users/47016464')
      .subscribe(data => this.userData = data);
  }
}
