import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../../services/supabase';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-monkey-jump',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './monkey-jump.html',
  styleUrls: ['./monkey-jump.css']
})
export class MonkeyJumpComponent implements AfterViewInit {

  @ViewChild('gameCanvas')
  canvasRef!: ElementRef<HTMLCanvasElement>;

  canvas!: HTMLCanvasElement;
  ctx!: CanvasRenderingContext2D;

  score = 0;
  gameOver = false;

  // Contador
  countdown: number = 3;
  countdownActive: boolean = true;

  // MONO
  monkey = {
    x: 170,
    y: 300,
    width: 60,
    height: 60,
    velocityY: -12,
    gravity: 0.45,
    jumpForce: -12,
    speed: 4.5,
    direction: 1
  };

  // PLATAFORMAS
  plataformas = [
    { x: 40, y: 100, width: 120, height: 35 },
    { x: 220, y: 220, width: 120, height: 35 },
    { x: 100, y: 360, width: 120, height: 35 },
    { x: 260, y: 500, width: 120, height: 35 },
    { x: 70, y: 640, width: 120, height: 35 }
  ];

  // SPRITES
  monkeyRight = new Image();
  monkeyLeft = new Image();
  background = new Image();
  platformSprite = new Image();

  constructor(
    private supabaseService: SupabaseService,
    private authService: AuthService
  ) {}

  ngAfterViewInit(): void {
    this.canvas = this.canvasRef.nativeElement;
    this.ctx = this.canvas.getContext('2d')!;

    this.monkeyRight.src = 'assets/img/monkey/mono-right.png';
    this.monkeyLeft.src = 'assets/img/monkey/mono-left.png';
    this.background.src = 'assets/img/monkey/fondo-jungla.png';
    this.platformSprite.src = 'assets/img/monkey/plataforma.png';

    this.iniciarJuego(); // arranca con contador
  }

  iniciarJuego() {
    this.countdown = 3;
    this.countdownActive = true;

    const intervalo = setInterval(() => {
      this.countdown--;

      if (this.countdown === 0) {
        clearInterval(intervalo);
        setTimeout(() => {
          this.countdownActive = false;
          this.gameLoop(); // arranca el juego
        }, 1000); // muestra "GO!" un segundo
      }
    }, 1000);

    // mientras corre el contador, dibuja en loop
    const drawCountdown = () => {
      this.draw();
      if (this.countdownActive) {
        requestAnimationFrame(drawCountdown);
      }
    };
    drawCountdown();
  }

  gameLoop() {
    if (this.gameOver) return;
    this.update();
    this.draw();
    requestAnimationFrame(() => this.gameLoop());
  }

  update() {
    // Movimiento horizontal
    this.monkey.x += this.monkey.speed * this.monkey.direction;

    // Wrap around
    if (this.monkey.x > 400) this.monkey.x = -60;
    if (this.monkey.x < -60) this.monkey.x = 400;

    // Gravedad
    this.monkey.velocityY += this.monkey.gravity;
    this.monkey.y += this.monkey.velocityY;

    // Colisiones y movimiento de plataformas
    this.plataformas.forEach(plataforma => {
      const toca =
        this.monkey.y + this.monkey.height >= plataforma.y &&
        this.monkey.y + this.monkey.height <= plataforma.y + plataforma.height &&
        this.monkey.x + this.monkey.width >= plataforma.x &&
        this.monkey.x <= plataforma.x + plataforma.width &&
        this.monkey.velocityY > 0;

      if (toca) {
        this.monkey.velocityY = this.monkey.jumpForce;
      }

      plataforma.y += 1.2;

      if (plataforma.y > 700) {
        plataforma.y = -20;
        plataforma.x = Math.random() * 280;
        plataforma.height = 35; // altura fija
        this.score += 50;

        const nivel = Math.floor(this.score / 500);
        plataforma.width = Math.max(40, 120 - nivel * 60);
      }
    });

    if (this.monkey.y > 720) {
      this.gameOver = true;
      const tiempoFinal = Math.floor(performance.now() / 1000);
      const usuario = this.authService.getUserName();
      this.supabaseService.guardarMonkeyJump(usuario, this.score, tiempoFinal);
    }
  }

  draw() {
    // Fondo
    this.ctx.drawImage(this.background, 0, 0, 400, 700);

    // Plataformas
    this.plataformas.forEach(plataforma => {
      this.ctx.drawImage(
        this.platformSprite,
        plataforma.x,
        plataforma.y,
        plataforma.width,
        plataforma.height
      );
    });

    // Mono
    const sprite = this.monkey.direction === 1 ? this.monkeyRight : this.monkeyLeft;
    this.ctx.drawImage(sprite, this.monkey.x, this.monkey.y, this.monkey.width, this.monkey.height);

    // Sombra
    this.ctx.fillStyle = 'rgba(0,0,0,0.3)';
    this.ctx.beginPath();
    this.ctx.ellipse(this.monkey.x + 30, this.monkey.y + 60, 20, 6, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Contador
    if (this.countdownActive) {
      this.ctx.fillStyle = 'white';
      this.ctx.font = 'bold 72px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(
        this.countdown > 0 ? this.countdown.toString() : 'GO!',
        this.canvas.width / 2,
        this.canvas.height / 2
      );
    }
  }

  izquierda() { this.monkey.direction = -1; }
  derecha() { this.monkey.direction = 1; }

  reiniciarJuego() {
    this.score = 0;
    this.gameOver = false;
    this.monkey.x = 170;
    this.monkey.y = 300;
    this.monkey.velocityY = -12;
    this.plataformas = [
      { x: 40, y: 100, width: 120, height: 35 },
      { x: 220, y: 220, width: 120, height: 35 },
      { x: 100, y: 360, width: 120, height: 35 },
      { x: 260, y: 500, width: 120, height: 35 },
      { x: 70, y: 640, width: 120, height: 35 }
    ];
    this.iniciarJuego(); // vuelve a arrancar con contador
  }
}
