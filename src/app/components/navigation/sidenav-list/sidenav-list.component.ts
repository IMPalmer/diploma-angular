import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {AuthService} from '@services/auth.service';
import {Router} from '@angular/router';


@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit {

  @Output() sidenavClose = new EventEmitter();

  constructor(private auth: AuthService, private router: Router) {
  }

  ngOnInit(): void {
  }

  onSidenavClose(): void {
    this.sidenavClose.emit();
  }

  logoutProcess(): void {
    this.auth.logout().subscribe(
      () => {
        this.auth.clearLocalStorage();
        this.onSidenavClose();
        this.router.navigateByUrl('/sign-in').then(e => {
          if (e) {
            console.log('Navigation is successful');
          } else {
            console.log('Navigation has failed');
          }
        });
      });
  }
}
