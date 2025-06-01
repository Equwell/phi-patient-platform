import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { interval } from 'rxjs';
import { AnalyticsService } from '~core/services/analytics.service';
import { AuthenticationService } from '../authentication/services/authentication.service';
import { UserService } from '~features/authentication/services/user.service';
import { translations } from '../../../locale/translations';
import { HomeGuestComponent } from './home-guest.component';
import { Router } from '@angular/router';
import { ROOT_PATHS } from '~core/constants/paths.constants';
import { UserStore } from '../authentication/services/user.store';

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
  private readonly authService = inject(AuthenticationService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private readonly userStore = inject(UserStore);
  
  readonly activeUsersResource = this.analyticsService.getRealtimeUsersResource();
  readonly isLoggedIn = this.authService.authState().isLoggedIn;
  readonly translations = translations;
  readonly user = this.userStore.user;

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
          this.userStore.updateUser(user);
        },
        error: () => {
          this.userStore.updateUser(null);
        },
      });
    }
  }

  logout(): void {
    this.authService.logOut();
    // Force a page reload to ensure clean state
    window.location.href = ROOT_PATHS.home;
  }
}
