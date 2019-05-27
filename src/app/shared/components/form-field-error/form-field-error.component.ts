import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-form-field-error',
  template: `
    <p class="text-danger">
      {{errorMessage}}
    </p>
  `,
  styleUrls: ['./form-field-error.component.css']
})
export class FormFieldErrorComponent implements OnInit {

  @Input('form-control') formControl: FormControl


  constructor() { }

  ngOnInit() {
  }

  public get errorMessage(): string | void {
    return this.mustShowErrorMessage() ? this.getErrorMessage() : null
  }

  private mustShowErrorMessage(): boolean {
    return this.formControl.invalid && this.formControl.touched
  }


  private getErrorMessage(): string {
    if (this.formControl.errors.required) {
      return 'Dado obrigatorio'
    }
    else if (this.formControl.errors.email) {
      return 'Formato de e-mail invalido'
    }
    else if (this.formControl.errors.minlength) {
      let requiredLength = this.formControl.errors.minlength.requiredLength
      return `Deve ter no minimo ${requiredLength} caracteres`
    }
    else if (this.formControl.errors.maxlength) {
      let requiredLength = this.formControl.errors.maxlength.requiredLength
      return `Deve ter no maximo ${requiredLength} caracteres`
    }

  }

}
