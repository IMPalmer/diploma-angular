import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs';
import { UserModel } from '@models/user';
import { RegistrationModel } from '@models/registration';
import { TokensPairModel } from '@models/tokens-pair';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<UserModel> {
    return this.http.post<UserModel>('http://diploma-api-khai.herokuapp.com/api/Identity/login',
      {email, password});
  }

  logout(accessToken): Observable<object> {
    const myHeaders = new HttpHeaders().set('Authorization', 'Bearer ' + accessToken);
    return this.http.post('http://diploma-api-khai.herokuapp.com/api/Identity/logout',
      null, {headers: myHeaders});
  }

  registration(registeredUser: RegistrationModel): Observable<UserModel> {
    return this.http.post<UserModel>('http://diploma-api-khai.herokuapp.com/api/Identity/register',
      {email: registeredUser.email, password: registeredUser.password,
        firstName: registeredUser.firstName, lastName: registeredUser.lastName});
  }

  refresh(accessToken: string, refreshToken: string): Observable<TokensPairModel> {
    return this.http.post<TokensPairModel>('http://diploma-api-khai.herokuapp.com/api/Identity/refresh-tokens',
      {accessToken, refreshToken});
  }
}
