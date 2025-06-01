import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-home-guest',
  templateUrl: './home-guest.component.html',
  styleUrl: './home-guest.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgOptimizedImage],
})
export class HomeGuestComponent {
  constructor(private router: Router) {}

  goToLogin() {
    this.router.navigate(['/auth/log-in']);
  }

  goToSignup() {
    this.router.navigate(['/auth/register']);
  }
} 