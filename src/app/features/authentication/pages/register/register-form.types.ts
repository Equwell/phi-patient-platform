import type { FormControl, FormGroup } from '@angular/forms';

export type RegisterFormGroup = FormGroup<{
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
  terms: FormControl<boolean | null>;
  phone: FormControl<string>;
  countryCode: FormControl<string>;
}>;

export type RegisterFormValue = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean | null;
  phone: string;
  countryCode: string;
};

export type RegisterFormState = {
  isLoading: boolean;
  isSubmitted: boolean;
  isRegistrationCompleted: boolean;
  passwordsMatch: boolean;
};
