import { AbstractControl, ValidatorFn } from '@angular/forms';

export function MustMatch(controlName: string, matchingControlName: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    const formGroup = control as AbstractControl;
    const control1Value = formGroup.get(controlName)?.value;
    const control2Value = formGroup.get(matchingControlName)?.value;
    
    if (control1Value !== control2Value) {
      formGroup.get(matchingControlName)?.setErrors({ mustMatch: true });
      return { mustMatch: true };
    } else {
      formGroup.get(matchingControlName)?.setErrors(null);
      return null;
    }
  };
}