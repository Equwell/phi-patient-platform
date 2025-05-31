import { AUTHENTICATION_PATHS, ROOT_PATHS } from '~core/constants/paths.constants';
import { Error404Component } from '~core/components/error-404/error-404.component';
import type { Route } from '@angular/router';
import { HomeComponent } from '~features/home/home.component';
import { MyRequestsComponent } from '~features/patient/pages/my-requests/my-requests.component';

export const appRoutes: Route[] = [
  {
    path: ROOT_PATHS.home,
    component: HomeComponent,
  },
  {
    path: AUTHENTICATION_PATHS.base,
    loadChildren: async () =>
      import('./features/authentication/authentication.routes').then(
        (authenticationModule) => authenticationModule.AUTHENTICATION_ROUTES,
      ),
  },
  {
    path: ROOT_PATHS.onboarding,
    loadComponent: async () => import('~features/onboarding/onboarding.component').then(onboarding => onboarding.OnboardingComponent)
  },
  {
    path: ROOT_PATHS.myRequests,
    component: MyRequestsComponent,
    // CanActivate: [authenticationGuard],
  },
  // {
  //   path: REQUEST_PATHS.base,
  //     import('./features/patient/request.routes').then((module_) => module_.REQUEST_ROUTES),
  // },
  { path: '404', component: Error404Component },
  { path: '**', redirectTo: '404' },
];
