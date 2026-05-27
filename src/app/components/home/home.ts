import {
  Component
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  AuthService
} from '../../services/auth.service';

import {
  RouterLink
} from '@angular/router';

import {
  trigger,
  transition,
  style,
  animate
} from '@angular/animations';

@Component({
  selector: 'app-home',
  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl: './home.html',

  styleUrls: ['./home.css'],

  animations: [

    trigger('fade', [

      transition(':enter', [

        style({
          opacity: 0,
          transform:
            'translateY(20px)'
        }),

        animate(
          '400ms ease-out',

          style({
            opacity: 1,
            transform:
              'translateY(0)'
          })

        )

      ])

    ])

  ]

})

export class HomeComponent {

  mostrarQuienSoy = false;

  admin = false;

  constructor(
    public authService:
    AuthService
  ) {}

  async ngOnInit() {

    const user =
      await this.authService
        .getUser();

    this.admin =
      user?.email ===
      'augusebottazzi@gmail.com';

  }

  logout() {

    this.authService.logout();

  }

}