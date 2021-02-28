import { Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  formGroup: FormGroup;
  hide = true;

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm = () => {
    this.formGroup = new FormGroup({
      login: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  loginProcess = () => {
    if (this.formGroup.valid){
      this.auth.login(this.formGroup.value).subscribe(result => {
        if (result.sucsess){
          console.log(result);
          alert(result.message);
        } else {
          alert(result.message);
        }
      });
    }
  }
}
