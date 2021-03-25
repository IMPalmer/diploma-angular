import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidationService } from '@services/custom-validation.service';
import { RegistrationModel } from '@models/registration';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  registrationFormGroup: FormGroup;
  hideFirstPassword = true;
  hideSecondPassword = true;

  constructor(private customValidator: CustomValidationService) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm = () => {
    this.registrationFormGroup = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required] ),
      confirmedPassword: new FormControl('', [Validators.required])
    }, {validators: this.customValidator.MatchPassword('password', 'confirmedPassword')});
  }

  hasError = (controlName: string, errorName: string) => {
    return this.registrationFormGroup.controls[controlName].hasError(errorName);
  }

  onSignUp = () => {
    const registeredUser: RegistrationModel = {
      email: this.registrationFormGroup.controls.email.value,
      password: this.registrationFormGroup.controls.password.value,
      firstName: this.registrationFormGroup.controls.firstName.value,
      lastName: this.registrationFormGroup.controls.lastName.value
    };
  }

}
