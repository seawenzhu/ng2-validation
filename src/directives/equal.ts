import { Directive, Input, forwardRef, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { NG_VALIDATORS, Validator, ValidatorFn, AbstractControl } from '@angular/forms';

import { CustomValidators } from '../index';

const EQUAL_VALIDATOR: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => EqualValidator),
  multi: true
};

@Directive({
  selector: '[equal][formControlName],[equal][formControl],[equal][ngModel]',
  providers: [EQUAL_VALIDATOR]
})
export class EqualValidator implements Validator, OnInit, OnChanges {
  @Input() equal: any;

  private validator: ValidatorFn;
  private _onChange: () => void;

  ngOnInit() {
    this.validator = CustomValidators.equal(this.equal);
  }

  ngOnChanges(changes: SimpleChanges) {
    for (let key in changes) {
      if (key === 'equal') {
        this.validator = CustomValidators.equal(changes[key].currentValue);
        if (this._onChange) this._onChange();
      }
    }
  }

  validate(c: AbstractControl): {[key: string]: any} {
    return this.validator(c);
  }

  registerOnValidatorChange(fn: () => void): void {
    this._onChange = fn;
  }
}