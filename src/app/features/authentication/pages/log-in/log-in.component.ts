import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
// Import { NgOptimizedImage } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, EMPTY } from 'rxjs';
import { emailValidator } from '~core/validators/email.validator';
import { AUTH_URLS, ROOT_URLS } from '~core/constants/urls.constants';
import { passwordValidator } from '~core/validators/password.validator';
import { SlInputIconFocusDirective } from '~core/directives/sl-input-icon-focus.directive';
import { LowercaseDirective } from '~core/directives/lowercase.directive';
import { TrimDirective } from '~core/directives/trim.directive';
import type { ApiResponse } from '~core/types/api-response.types';
import { API_ERROR_CODES } from '~core/constants/api-error-codes.constants';
import { AlertService } from '~core/services/ui/alert.service';
import { LanguageService } from '~core/services/language.service';
import { AuthenticationService } from '../../services/authentication.service';
import type { User } from '../../types/user.type';
import type {
  LogInFormGroup,
  LogInFormState,
} from './log-in-form.types';
import { translations } from '../../../../../locale/translations';

import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import { RegisterFormGroup } from '../register/register-form.types';
import { JwtToken } from '~features/authentication/types/jwt-token.type';
import type { LoginResponse } from '../../types/login-response.type';
import { Language } from '~core/enums/language.enum';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    SlInputIconFocusDirective,
    // NgOptimizedImage,
    LowercaseDirective,
    TrimDirective,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LogInComponent {
  private readonly alertService = inject(AlertService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthenticationService);
  private readonly languageService = inject(LanguageService);
  private readonly destroyRef = inject(DestroyRef);

  readonly translations = translations;
  readonly authUrls = AUTH_URLS;
  readonly logInForm = this.createLoginForm();
  readonly formControls = {
    username: this.logInForm.get('username') as FormControl<string>,
    password: this.logInForm.get('password') as FormControl<string>,
    // phone: this.logInForm.get('phone') as FormControl<string>,
    // rememberMe: this.logInForm.get('rememberMe') as FormControl<boolean>,
  };
  readonly formState = signal<LogInFormState>({
    isLoading: false,
    isSubmitted: false,
  });

  sendForm(): void {
    this.updateFormState({ isSubmitted: true });

    if (this.logInForm.invalid) {
      this.logInForm.markAllAsTouched();
      return;
    }

    this.updateFormState({ isLoading: true });

    this.authService
      .logIn(this.logInForm.getRawValue())
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((error) => {
          this.handleLoginError(error);
          return EMPTY;
        }),
      )
      .subscribe((response: LoginResponse) => {
        if (!response.success) {
          this.handleLoginError(response);
          return;
        }
      
        this.alertService.createSuccessAlert(response.message || 'Login successful!');
        const userlang = Language["EN_US"]  /// todo: get the user lang after calling "get current end point"
        this.languageService.navigateWithUserLanguage(userlang, ROOT_URLS.myPokedex);
      });
  }

  private createLoginForm(): LogInFormGroup {
    const form = this.formBuilder.group({
      username: new FormControl<string>('', {
        validators: [Validators.required, Validators.minLength(4)],
        nonNullable: true,
      }),
      password: new FormControl<string>('', {
        validators: [Validators.required, Validators.minLength(6), passwordValidator()],
        nonNullable: true,
      }),
      // phone: new FormControl<string>('', {
      //   validators: [Validators.required, Validators.minLength(6)],
      //   nonNullable: true,
      // }),
      // rememberMe: new FormControl<boolean>(false, { /// no needed in hippa apps.. no remember me
      //   validators: [Validators.required],
      //   nonNullable: true,
      // }),
    });
    this.populateFormWithMockData(form);
    return form;
  }

  private populateFormWithMockData(form: LogInFormGroup): void {
    form.patchValue({
      username: '2ba3e352327a17df986b2571d1795b93',
      password: 'A3a@gmail.com',

    });
  }
  private handleLoginError(error: any): void {
    // const errorMessage =  error?.error?.internalCode === API_ERROR_CODES.INVALID_CREDENTIALS_CODE
    //   ? translations.loginCredentialsError
    //   : translations.genericErrorAlert;3  
     const errorMessage = error?.message 
    this.alertService.createErrorAlert(errorMessage);
    this.updateFormState({ isLoading: false });
  }

  private updateFormState(updates: Partial<LogInFormState>): void {
    this.formState.update((state) => ({ ...state, ...updates }));
  }
}
