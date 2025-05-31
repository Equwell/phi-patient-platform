import { noAuthenticationGuard } from '~core/guards/no-authentication.guard';
import { OnboardingComponent } from './onboarding.component';
import { ROOT_PATHS } from '~core/constants/paths.constants';

export const ONBOARDING_ROUTES = [
  {
    path: ROOT_PATHS.onboarding,
    component: OnboardingComponent,
    canActivate: [noAuthenticationGuard],
  },
  { path: '**', redirectTo: ROOT_PATHS.error404 },
];