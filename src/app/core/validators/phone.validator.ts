import { ValidatorFn, AbstractControl } from '@angular/forms';
import { parsePhoneNumberFromString, CountryCode } from 'libphonenumber-js';

export function phoneValidator(getCountryCode: () => string): ValidatorFn {
  return (control: AbstractControl) => {
    const phone = control.value;
    const countryCode = getCountryCode();

    if (!phone) {
      return { required: true };
    }

    if (!countryCode) {
      return { countryCodeRequired: true };
    }

    try {
      // Remove any non-digit characters from the phone number
      const cleanPhone = phone.replace(/\D/g, '');
      
      // Get the country code without the + symbol
      const cleanCountryCode = countryCode.replace('+', '');
      
      const fullNumber = `+${cleanCountryCode}${cleanPhone}`;
      const parsed = parsePhoneNumberFromString(fullNumber, cleanCountryCode as CountryCode);

      if (!parsed) {
        return { invalidPhone: true };
      }

      if (!parsed.isValid()) {
        return { invalidPhone: true };
      }

      // Check if the number is too short or too long
      if (cleanPhone.length < 5) {
        return { tooShort: true };
      }

      if (cleanPhone.length > 15) {
        return { tooLong: true };
      }

      return null;
    } catch (error) {
      return { invalidPhone: true };
    }
  };
}