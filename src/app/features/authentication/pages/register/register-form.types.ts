import type { FormControl, FormGroup } from '@angular/forms';

export type RegisterFormGroup = FormGroup<{
  name: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
  terms: FormControl<boolean | null>;
  phone: FormControl<string>; // Added phone field
}>;

export type RegisterFormValue = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean | null;
  phone: string; // Added phone field
};

export type RegisterFormState = {
  isLoading: boolean;
  isSubmitted: boolean;
  isRegistrationCompleted: boolean;
  passwordsMatch: boolean;
};
