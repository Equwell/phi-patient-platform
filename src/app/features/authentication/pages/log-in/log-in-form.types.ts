import type { FormControl, FormGroup } from '@angular/forms';

export type LogInFormGroup = FormGroup<{
  email: FormControl<string>;
  password: FormControl<string>;
  phone: FormControl<string>;
  rememberMe: FormControl<boolean>;
}>;

export type LogInFormState = {
  isLoading: boolean;
  isSubmitted: boolean;
};
