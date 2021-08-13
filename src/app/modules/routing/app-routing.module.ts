import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '@components/home/home.component';
import { SignInComponent } from '@components/sign-in/sign-in.component';
import { SignUpComponent } from '@components/sign-up/sign-up.component';
import { AuthGuard } from '@guards/auth.guard';
import { LoggedInAuthGuard } from '@guards/logged-in-auth.guard';
import { UserComponent } from '@components/user/user.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  { path: 'sign-in', component: SignInComponent, canActivate: [LoggedInAuthGuard]},
  { path: 'sign-up', component: SignUpComponent, canActivate: [LoggedInAuthGuard]},
  { path: 'user', component: UserComponent, canActivate: [AuthGuard]},
  { path: 'data-manipulation', loadChildren: () =>
      import('@modules/data-manipulation.module').then(m => m.DataManipulationModule), canActivate: [AuthGuard]},
  { path: 'documents', loadChildren: () =>
      import('@modules/documents.module').then(m => m.DocumentsModule), canActivate: [AuthGuard]},
  { path: '', redirectTo: '/home', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [AuthGuard],
  exports: [RouterModule]
})
export class AppRoutingModule { }
