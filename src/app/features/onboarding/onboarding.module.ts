import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ONBOARDING_ROUTES } from './onboarding.routes';
import { OnboardingComponent } from './onboarding.component';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(ONBOARDING_ROUTES), OnboardingComponent],
})
export class OnboardingModule {}
