import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidationService } from '@services/custom-validation.service';
import { RegistrationModel } from '@models/registration';
import { UserModel } from '@models/user';
import { AuthService } from '@services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  registrationFormGroup: FormGroup;
  hideFirstPassword = true;
  hideSecondPassword = true;

  constructor(private customValidator: CustomValidationService,
              private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm = () => {
    this.registrationFormGroup = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('',
        [Validators.required, Validators.minLength(6), Validators.maxLength(50)] ),
      confirmedPassword: new FormControl('', [Validators.required])
    }, {validators: this.customValidator.MatchPassword('password', 'confirmedPassword')});
  }

  hasError = (controlName: string, errorName: string) => {
    return this.registrationFormGroup.controls[controlName].hasError(errorName);
  }

  registrationProcess(formGroupValue): void {
    if (this.registrationFormGroup.valid) {
      this.auth.registration(this.executeRegistrationForm(formGroupValue)).subscribe(
        (data: UserModel) => {
          this.auth.user = data;
          this.router.navigateByUrl('/home').then(e => {
            if (e) {
              console.log('Navigation is successful');
            } else {
              console.log('Navigation has failed');
            }
          });
        }
      );
    }
  }

  executeRegistrationForm(formGroupValue): RegistrationModel {
    return {
      email: formGroupValue.email,
      password: formGroupValue.password,
      firstName: formGroupValue.firstName,
      lastName: formGroupValue.lastName
    };
  }

}
