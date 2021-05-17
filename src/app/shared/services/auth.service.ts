import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserModel } from '@models/user';
import { RegistrationModel } from '@models/registration';
import { TokensPairModel } from '@models/tokens-pair';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public loggedIn = false;
  private currentUser: UserModel;
  private userData: any[];

  get user(): UserModel {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.loggedIn = !!this.currentUser;
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
    return this.http.post(`${environment.apiUrl}Identity/login`,
      {email, password}).pipe(map((data) => (
        this.userData = Object.values(data), {
        id: this.userData[0].id,
        email: this.userData[0].email,
        firstName: this.userData[0].firstName,
        lastName: this.userData[0].lastName,
        createDateTime: this.userData[0].createDateTime,
        accessToken: this.userData[1],
        refreshToken: this.userData[2]
      })));
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
