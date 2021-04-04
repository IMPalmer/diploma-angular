import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '@components/home/home.component';
import { LoginComponent } from '@components/login/login.component';
import { SignUpComponent } from '@components/sign-up/sign-up.component';
import {AuthGuard} from '../../shared/guards/auth.guard';
import {LoggedInAuthGuard} from '../../shared/guards/logged-in-auth.guard';

const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  { path: 'login', component: LoginComponent, canActivate: [LoggedInAuthGuard]},
  { path: 'sign-up', component: SignUpComponent, canActivate: [LoggedInAuthGuard]},
  { path: '', redirectTo: '/home', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [AuthGuard],
  exports: [RouterModule]
})
export class AppRoutingModule { }
