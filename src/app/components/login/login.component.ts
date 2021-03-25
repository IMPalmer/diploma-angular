import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@services/auth.service';
import { Router } from '@angular/router';

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
      password: new FormControl('', [Validators.required])
    });
  }

  hasError = (controlName: string, errorName: string) => {
    return this.loginFormGroup.controls[controlName].hasError(errorName);
  }

  loginProcess = (formGroupValue) => {
    if (this.loginFormGroup.valid) {
      this.auth.login(formGroupValue.login, formGroupValue.password);
      /*this.auth.login(this.executeUserCreation(formGroupValue));*/
    }
  }

  /*executeUserCreation = (formGroupValue) => {
   const user: User = {
      id: '0',
      login: formGroupValue.login,
      password: formGroupValue.password
    };
   return user;
  }*/
}
