import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GithubService } from '../services/github.service';
import { GithubUser } from '../models/github-user';

@Component({
  selector: 'app-quien-soy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quien-soy.html',
  styleUrls: ['./quien-soy.css']
})
export class QuienSoyComponent implements OnInit {
  userData = signal<GithubUser | null>(null);

  constructor(private githubService: GithubService) {}

  ngOnInit() {
    this.githubService.getUserData().subscribe({
      next: (data) => this.userData.set(data),
      error: (err) => console.error('Error al traer datos de GitHub:', err)
    });
  }
}
