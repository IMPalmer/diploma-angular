import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import { AuthService } from '@services/auth.service';
import { Router } from '@angular/router';
import {UserModel} from '@models/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Output() public sidenavToggle = new EventEmitter();
  currentUser: UserModel = this.auth.user;

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  onToggleSidenav(): void {
    this.sidenavToggle.emit();
  }

  logoutProcess = () => {
    this.auth.logout().subscribe(
      () => {
        this.auth.clearLocalStorage();
        this.router.navigateByUrl('/login').then(e => {
          if (e) {
            console.log('Navigation is successful');
          } else {
            console.log('Navigation has failed');
          }
        });
      });
  }
}
