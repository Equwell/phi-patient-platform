import type { Route } from '@angular/router';
import { ROOT_PATHS } from '~core/constants/paths.constants';
import { RequestDetailComponent } from '~features/patient/pages/request-detail/request-detail.component';
import { authenticationGuard } from '~core/guards/authentication.guard';

export const REQUEST_ROUTES: Route[] = [
  {
    path: ':requestId',
    component: RequestDetailComponent,
    canActivate: [authenticationGuard],
  },
  { path: '**', redirectTo: ROOT_PATHS.error404 },
];
