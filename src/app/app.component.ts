import { ChangeDetectionStrategy, Component, effect, inject, OnInit } from '@angular/core';
import { translations } from '../locale/translations';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FooterComponent } from '~core/components/footer/footer.component';
import { DOCUMENT } from '@angular/common';
import { filter, map, catchError, EMPTY } from 'rxjs';
import { HeaderService } from '~core/services/ui/header.service';
import { ProgressBarComponent } from '~core/components/progress-bar/progress-bar.component';
import { CookiePopupComponent } from '~core/components/cookie-popup/cookie-popup.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { ToastStackComponent } from '~core/components/toast-stack/toast-stack.component';
import { AuthenticationService } from './features/authentication/services/authentication.service';
import { UserStore } from './features/authentication/services/user.store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    // HeaderComponent,
    FooterComponent,
    ProgressBarComponent,
    CookiePopupComponent,
    ToastStackComponent,
  ],
})
export class AppComponent implements OnInit {
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly titleService = inject(Title);
  private readonly headerService = inject(HeaderService);
  private readonly authService = inject(AuthenticationService);
  private readonly userStore = inject(UserStore);

  readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  constructor() {
    this.titleService.setTitle(translations.title);

    effect(() => {
      const url = this.currentUrl();
      this.headerService.setCanonical(url);
    });
  }

  ngOnInit(): void {
    // Check if user is logged in (has valid JWT)
    if (this.authService.authState().isLoggedIn) {
      this.authService.getCurrentUser()
        .pipe(
          catchError(() => {
            // If there's an error (e.g., invalid token), clear the user data
            this.authService.logOut();
            return EMPTY;
          })
        )
        .subscribe();
    }
  }

  focusFirstHeading(): void {
    const h1 = this.document.querySelector<HTMLHeadingElement>('h1');
    h1?.focus();
  }
}
