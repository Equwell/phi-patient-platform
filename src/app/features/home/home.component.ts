import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { interval } from 'rxjs';
import { AnalyticsService } from '~core/services/analytics.service';
import { AuthenticationService } from '~features/authentication/services/authentication.service';
import { UserService } from '~features/authentication/services/user.service';
import { translations } from '../../../locale/translations';
import { HomeGuestComponent } from './home-guest.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [HomeGuestComponent],
})
export class HomeComponent {
  private readonly analyticsService = inject(AnalyticsService);
  private readonly authenticationService = inject(AuthenticationService);
  private readonly userService = inject(UserService);
  readonly activeUsersResource = this.analyticsService.getRealtimeUsersResource();
  readonly isLoggedIn = this.authenticationService.authState().isLoggedIn;
  readonly translations = translations;
  readonly user = signal<{ name: string } | null>(null);

  constructor() {
    this.activeUsersResource.reload();
    effect(() => {
      const sub = interval(5000).subscribe(() => {
        this.activeUsersResource.reload();
      });
      return () => {
        sub.unsubscribe();
      };
    });
    if (this.isLoggedIn) {
      this.userService.getMe().subscribe({
        next: (user) => {
          this.user.set({ name: user.name });
        },
        error: () => {
          this.user.set(null);
        },
      });
    }
  }
}
