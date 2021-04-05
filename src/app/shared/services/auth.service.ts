import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs';
import { UserModel } from '@models/user';
import { RegistrationModel } from '@models/registration';
import { TokensPairModel } from '@models/tokens-pair';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public loggedIn = false;
  private currentUser: UserModel;

  get user(): UserModel {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (this.currentUser) {
      this.loggedIn = true;
    } else {
      this.loggedIn = false;
    }
    return this.currentUser;
  }

  set user(data: UserModel) {
    localStorage.setItem('currentUser', JSON.stringify(data));
  }

  clearLocalStorage = () => {
    localStorage.removeItem('currentUser');
  }

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<UserModel> {
    return this.http.post<UserModel>(`${environment.apiUrl}Identity/login`,
      {email, password});
  }

  logout(): Observable<object> {
    const myHeaders = new HttpHeaders().set('Authorization', 'Bearer ' + this.user.accessToken);
    return this.http.post(`${environment.apiUrl}Identity/logout`,
      null, {headers: myHeaders});
  }

  registration(registeredUser: RegistrationModel): Observable<UserModel> {
    return this.http.post<UserModel>(`${environment.apiUrl}Identity/register`,
      {email: registeredUser.email, password: registeredUser.password,
        firstName: registeredUser.firstName, lastName: registeredUser.lastName});
  }

  refresh(accessToken: string, refreshToken: string): Observable<TokensPairModel> {
    return this.http.post<TokensPairModel>(`${environment.apiUrl}Identity/refresh-tokens`,
      {accessToken, refreshToken});
  }
}
