import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrl: './onboarding.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class OnboardingComponent {
    isActive = 0;
    views: string[] = [
        'Welcome to Smart AI monitoring',
        'Log in to useremote monitoring and transfer the data to your doctor',
        'You will receive a reply in a few minutes. Dont be shy to ask.',
        'A smart AI doctor worksday and night and never violatesmedical confidentiality',
    ]

    onNext() {
        this.isActive = (this.isActive + 1) % 5;
    }

    onAppleSignup() {
        // Console log for apple signup
    }
    
    onGoogleSignup() {
        // Console log for google signup
    }

    onLogin() {
        // Console log for login
    }
}