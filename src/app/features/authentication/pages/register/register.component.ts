import type { OnInit } from '@angular/core';
import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, merge } from 'rxjs';
import { AUTH_URLS, REQUEST_URLS } from '~core/constants/urls.constants';
import { emailValidator } from '~core/validators/email.validator';
import { passwordValidator } from '~core/validators/password.validator';
import { SlInputIconFocusDirective } from '~core/directives/sl-input-icon-focus.directive';
import { LowercaseDirective } from '~core/directives/lowercase.directive';
import { TrimDirective } from '~core/directives/trim.directive';
import { AlertService } from '~core/services/ui/alert.service';
import { AuthenticationService } from '../../services/authentication.service';
import { CommonModule } from '@angular/common';
import type {
  RegisterFormGroup,
  RegisterFormState,
  RegisterFormValue,
} from './register-form.types';
import { translations } from '../../../../../locale/translations';
import { phoneValidator } from '~core/validators/phone.validator';
import type { RegisterResponseData } from '../../types/register-response.type';

import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/checkbox/checkbox.js';
import '@shoelace-style/shoelace/dist/components/select/select.js';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    RouterModule,
    ReactiveFormsModule,
    CommonModule,
    SlInputIconFocusDirective,
    LowercaseDirective,
    TrimDirective,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RegisterComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthenticationService);
  private readonly alertService = inject(AlertService);
  private readonly destroyRef = inject(DestroyRef);

  readonly translations = translations;
  readonly authUrls = AUTH_URLS;
  readonly formState = signal<RegisterFormState>({
    isLoading: false,
    isSubmitted: false,
    isRegistrationCompleted: false,
    passwordsMatch: false,
  });

  private readonly _registerForm = this.createRegisterForm();
  readonly registerForm = this._registerForm;
  readonly formControls = {
    firstName: this._registerForm.get('firstName') as FormControl<string>,
    lastName: this._registerForm.get('lastName') as FormControl<string>,
    email: this._registerForm.get('email') as FormControl<string>,
    password: this._registerForm.get('password') as FormControl<string>,
    confirmPassword: this._registerForm.get('confirmPassword') as FormControl<string>,
    terms: this._registerForm.get('terms') as FormControl<boolean | null>,
    phone: this._registerForm.get('phone') as FormControl<string>,
    countryCode: this._registerForm.get('countryCode') as FormControl<string>,
  };

  ngOnInit() {
    merge(this.formControls.password.valueChanges, this.formControls.confirmPassword.valueChanges)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.checkPasswords();
      });

    // Revalidate phone number when country code changes
    this.formControls.countryCode.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.formControls.phone.updateValueAndValidity();
      });
  }

  sendForm(): void {
    this.updateFormState({ isSubmitted: true });

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.updateFormState({ isLoading: true });

    this.authService
      .register({
        ...this.registerForm.getRawValue(),
      } as RegisterFormValue)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((error) => {
          this.handleRegistrationError(error);
          return EMPTY;
        }),
      )
      .subscribe((response) => {
        this.handleRegistrationSuccess(response);
      });
  }

  private createRegisterForm(): RegisterFormGroup {
    const countryCodeControl = new FormControl<string>('+972', {
      validators: [
        Validators.required,
        Validators.pattern(/^\+\d{1,4}$/),
      ],
      nonNullable: true,
    });

    const form = this.formBuilder.group({
      firstName: new FormControl<string>('', {
        validators: [Validators.required, Validators.minLength(2)],
        nonNullable: true,
      }),
      lastName: new FormControl<string>('', {
        validators: [Validators.required, Validators.minLength(2)],
        nonNullable: true,
      }),
      email: new FormControl<string>('', {
        validators: [Validators.required, Validators.minLength(4), emailValidator()],
        nonNullable: true,
      }),
      password: new FormControl<string>('', {
        validators: [Validators.required, passwordValidator()],
        updateOn: 'change',
        nonNullable: true,
      }),
      confirmPassword: new FormControl<string>('', {
        validators: [Validators.required, passwordValidator()],
        updateOn: 'change',
        nonNullable: true,
      }),
      terms: new FormControl<boolean | null>(null, {
        validators: [Validators.requiredTrue],
      }),
      countryCode: countryCodeControl,
      phone: new FormControl<string>('', {
        validators: [
          Validators.required,
          Validators.pattern(/^\d+$/),
          phoneValidator(() => countryCodeControl.value),
        ],
        nonNullable: true,
      }),
    });

    // Uncomment the following line to populate the form with mock data
    this.populateFormWithMockData(form);

    return form;
  }

  private populateFormWithMockData(form: RegisterFormGroup): void {
    form.patchValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'A3a@gmail.com',
      password: 'A3a@gmail.com',
      confirmPassword: 'A3a@gmail.com',
      terms: true,
      countryCode: '+972',
      phone: '501234567' 
    });
  }

  private checkPasswords(): void {
    if (this.formControls.password.value === this.formControls.confirmPassword.value) {
      this.updateFormState({ passwordsMatch: true });
      this.formControls.confirmPassword.setErrors(null);
    } else {
      this.updateFormState({
        passwordsMatch: false,
      });
      this.formControls.confirmPassword.setErrors({ notEqual: true });
    }
  }

  private handleRegistrationSuccess(response: ApiResponse<RegisterResponseData>) {
    if (!response.success) {
      if (response.message) {
        this.alertService.createErrorAlert(response.message);
      }
      this.updateFormState({ isLoading: false });
      return;
    }

    this.updateFormState({ isRegistrationCompleted: true });
    this.alertService.createSuccessAlert(response.message || 'Registration successful!');
    
    const ANIMATION_END_TIME = 2300;
    setTimeout(() => {
      const LAST_POKEMON_ID = 1025;
      void this.router.navigate([
        REQUEST_URLS.detail(String(this.getRandomNumber(1, LAST_POKEMON_ID))),
      ]);
    }, ANIMATION_END_TIME);
  }

  private getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private handleRegistrationError(error: any): void {
    const errorMessage = error?.message || translations.genericErrorAlert;
    this.alertService.createErrorAlert(errorMessage);
    this.updateFormState({ isLoading: false });
  }

  private updateFormState(updates: Partial<RegisterFormState>): void {
    this.formState.update((state) => ({ ...state, ...updates }));
  }
}
