import { Injectable } from '@angular/core';
import { AuthService } from '@services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserModel } from '@models/user';
import { DegreeModel } from '@models/degree';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { PublishingHouseModel } from '@models/publishing-house';
import { UniversityDepartmentModel } from '@models/university-department';
import { ScientistModel } from '@models/scientist';

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

  getPublishingHouses(): Observable<Array<PublishingHouseModel>> {
    return this.http.get<Array<PublishingHouseModel>>(`${environment.apiUrl}PublishingHouse`,
      {headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.auth.user.accessToken)});
  }

  getUniversityDepartments(): Observable<Array<UniversityDepartmentModel>> {
    return this.http.get<Array<UniversityDepartmentModel>>(`${environment.apiUrl}UniversityDepartment`,
      {headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.auth.user.accessToken)});
  }

  getScientists(): Observable<Array<ScientistModel>> {
    return this.http.get<Array<ScientistModel>>(`${environment.apiUrl}Scientist`,
      {headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.auth.user.accessToken)});
  }

  addDegree(name: string): Observable<DegreeModel> {
    return this.http.post<DegreeModel>(`${environment.apiUrl}Degree`,
      {name},
      {headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.auth.user.accessToken)});
  }

  addPublishingHouse(name: string): Observable<PublishingHouseModel> {
    return this.http.post<PublishingHouseModel>(`${environment.apiUrl}PublishingHouse`,
      {name},
      {headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.auth.user.accessToken)});
  }

  addUniversityDepartment(fullName: string, shortName: string): Observable<UniversityDepartmentModel> {
    return this.http.post<UniversityDepartmentModel>(`${environment.apiUrl}UniversityDepartment`,
      {fullName, shortName},
      {headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.auth.user.accessToken)});
  }

  addScientist(firstName: string, lastName: string, middleName: string, degreesIds: number[]): Observable<ScientistModel> {
    return this.http.post<ScientistModel>(`${environment.apiUrl}Scientist`,
      {firstName, lastName, middleName, degreesIds},
      {headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.auth.user.accessToken)});
  }

  deleteDegree(id: number): Observable<DegreeModel> {
    return this.http.delete<DegreeModel>(`${environment.apiUrl}Degree/${id}`,
      {headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.auth.user.accessToken)});
  }

  deletePublishingHouse(id: number): Observable<PublishingHouseModel> {
    return this.http.delete<PublishingHouseModel>(`${environment.apiUrl}PublishingHouse/${id}`,
      {headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.auth.user.accessToken)});
  }

  deleteUniversityDepartment(id: number): Observable<UniversityDepartmentModel> {
    return this.http.delete<UniversityDepartmentModel>(`${environment.apiUrl}UniversityDepartment/${id}`,
      {headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.auth.user.accessToken)});
  }

  deleteScientist(id: number): Observable<ScientistModel> {
    return this.http.delete<ScientistModel>(`${environment.apiUrl}Scientist/${id}`,
      {headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.auth.user.accessToken)});
  }

  updateDegree(id: number, name: string): Observable<DegreeModel>{
    return this.http.put<DegreeModel>(`${environment.apiUrl}Degree`,
      {id, name},
      {headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.auth.user.accessToken)});
  }

  updatePublishingHouse(id: number, name: string): Observable<PublishingHouseModel>{
    return this.http.put<PublishingHouseModel>(`${environment.apiUrl}PublishingHouse`,
      {id, name},
      {headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.auth.user.accessToken)});
  }

  updateUniversityDepartment(id: number, fullName: string, shortName: string): Observable<UniversityDepartmentModel>{
    return this.http.put<UniversityDepartmentModel>(`${environment.apiUrl}UniversityDepartment`,
      {id, fullName, shortName},
      {headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.auth.user.accessToken)});
  }

  updateScientist(id: number, firstName: string, lastName: string, middleName: string, degreesIds: number[]): Observable<ScientistModel>{
    return this.http.put<ScientistModel>(`${environment.apiUrl}Scientist`,
      {id, firstName, lastName, middleName, degreesIds},
      {headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.auth.user.accessToken)});
  }
}
