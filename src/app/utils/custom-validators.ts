import { AbstractControl, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  public static readonly USER_REAL_NAME_PATTERN = /^[a-zA-Z ]+$/;

  public static readonly STRONG_PASSWORD_PATTERN = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/;

  /** Two fields must match */
  public static matchField(fieldSelector: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control || !control.parent) {
        return null;
      }

      return control.parent.get(fieldSelector)?.value === control.value
        ? null
        : { noMatch: { value: 'no match' } };
    };
  }
}
