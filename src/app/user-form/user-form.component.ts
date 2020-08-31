import { ChangeDetectionStrategy, Component, OnInit, HostBinding } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

function isValidAddress(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  let errors: ValidationErrors | null = null;
  if (!value || value.city !== 'Minsk') {
    errors = errors ?? { } ;
    errors.city = { message: 'City should be Minsk' };
  }
  if (!value || !value.street) {
    errors = errors ?? { } ;
    errors.street = { message: 'Street is invalid' };
  }
  return errors ? { isValidAddress: errors } : null;
}

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFormComponent implements OnInit {

  public readonly form: FormGroup;

  public constructor(fb: FormBuilder) {
    this.form = fb.group({
      user: fb.group({
        firstName: fb.control('', [Validators.required, Validators.pattern(/[a-zA-Z]+/), Validators.minLength(2)]),
        lastName: fb.control('', [Validators.required, Validators.pattern(/\w+/)]),
      }),
      address: fb.control(null, [isValidAddress]),
    }, { updateOn: 'blur' });
  }

  public ngOnInit(): void {
  }

  public onDisableControl(control: AbstractControl | null): void {
    if (!control) {
      return;
    }

    if (control.disabled) {
      control.enable();
    } else {
      control.disable();
    }
  }

}
