import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, Self } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NgControl, ValidationErrors, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

export interface UserAddress {
  city: string;
  street: string;
}

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressFormComponent implements OnInit, OnDestroy, ControlValueAccessor {

  public constructor(
    @Self() private readonly control: NgControl,
    private readonly fb: FormBuilder,
  ) {
    this.control.valueAccessor = this;
    this.form = this.fb.group({
      city: ['', [Validators.pattern(/^\w+$/), Validators.minLength(2)]],
      street: ['', [Validators.minLength(2)]],
    });
  }

  private readonly subscriptions = new Subscription();
  public form!: FormGroup;
  public onTouched: () => void = () => {};
  private onChange: (address: UserAddress | null) => void = () => {};


  public ngOnInit(): void {
    // Merge existing validators with custom validators
    const control = this.control.control;
    if (control) {
      const validators = [];
      if (control.validator) {
        validators.push(control.validator);
      }
      validators.push(() => this.validate());
      control.setValidators(validators);
      control.updateValueAndValidity();
    }

    this.subscriptions.add(
      this.form.valueChanges.subscribe(value => this.onChange(value))
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }


  /** Part of ControlValueAccessor */
  public writeValue(obj: UserAddress | null): void {
    // Do not emit valueChanges event!
    this.form.setValue(obj ?? { city: '', street: '' }, { emitEvent: false });
  }

  /** Part of ControlValueAccessor */
  public registerOnChange(fn: (value: UserAddress | null) => void): void {
    this.onChange = fn;
  }

  /** Part of ControlValueAccessor */
  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /** Part of ControlValueAccessor */
  public setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  private validate(): ValidationErrors | null {
    if (!this.form.valid) {
      return {
        address: {
          city: this.form.get('city')?.errors,
          street: this.form.get('street')?.errors,
        },
      };
    }

    return null;
  }

}
