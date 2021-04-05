import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@services/auth.service';
import { Router } from '@angular/router';
import { UserModel } from '@models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  loginFormGroup: FormGroup;
  hide = true;

  constructor(private auth: AuthService, private router: Router) {
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm = () => {
    this.loginFormGroup = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('',
        [Validators.required, Validators.minLength(6), Validators.maxLength(50)])
    });
  }

  hasError = (controlName: string, errorName: string) => {
    return this.loginFormGroup.controls[controlName].hasError(errorName);
  }

  loginProcess = (formGroupValue) => {
    if (this.loginFormGroup.valid) {
      this.auth.login(formGroupValue.email, formGroupValue.password).subscribe(
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
}
