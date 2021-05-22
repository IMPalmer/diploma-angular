import { Injectable } from '@angular/core';
import {AuthService} from '@services/auth.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UserModel} from '@models/user';
import {DegreeModel} from '@models/degree';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataManipulationService {

  user: UserModel;

  constructor(private auth: AuthService, private http: HttpClient) { }

  getDegrees(): Observable<Array<DegreeModel>> {
    return this.http.get<Array<DegreeModel>>(`${environment.apiUrl}Degree`,
      {headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.auth.user.accessToken)});
  }

  addDegree(name: string): Observable<DegreeModel> {
    return this.http.post<DegreeModel>(`${environment.apiUrl}Degree`,
      {name},
      {headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.auth.user.accessToken)});
  }

  deleteDegree(id: number): Observable<DegreeModel> {
    return this.http.delete<DegreeModel>(`${environment.apiUrl}Degree/${id}`,
      {headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.auth.user.accessToken)});
  }

  updateDegree(id: number, name: string): Observable<DegreeModel>{
    return this.http.put<DegreeModel>(`${environment.apiUrl}Degree`,
      {id, name},
      {headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.auth.user.accessToken)});
  }
}
