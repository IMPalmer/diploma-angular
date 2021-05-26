import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ScientistModel } from '@models/scientist';
import { PublishingHouseModel } from '@models/publishing-house';
import { UniversityDepartmentModel } from '@models/university-department';
import { AuthService } from '@services/auth.service';
import { UserModel } from '@models/user';
import { map, mergeMap } from 'rxjs/operators';
import { AuthorsModel } from '@models/authors-certificate';

@Injectable({
  providedIn: 'root'
})
export class AutocompleteService {

  user: UserModel;

  constructor(private auth: AuthService, private http: HttpClient) { }

  getAllDataForAuthorsCertificate(allAuthors: AuthorsModel[],
                                  allPublishingHouses: string[],
                                  allUniversityDepartments: string[]):
    Observable<void> {
    return this.http.get<Array<ScientistModel>>(`${environment.apiUrl}Scientist`,
      {headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.auth.user.accessToken)}).pipe(
        map((data) => {
          data.forEach(scientist => {
            allAuthors.push({fullName: scientist.lastName + ' '
                + scientist.firstName + ' ' + scientist.middleName,
              degrees: this.pushDegrees(scientist.degrees)});
          });
        }),
      mergeMap( () => {
        return this.http.get<Array<PublishingHouseModel>>(`${environment.apiUrl}PublishingHouse`,
          {headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.auth.user.accessToken)}).pipe(
            map((data) => {
              data.forEach(publishingHouse => {
                allPublishingHouses.push(publishingHouse.name);
              });
            }),
          mergeMap(() => {
            return this.http.get<Array<UniversityDepartmentModel>>(`${environment.apiUrl}UniversityDepartment`,
              {headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.auth.user.accessToken)}).pipe(
                map((data) => {
                  data.forEach(universityDepartment => {
                    allUniversityDepartments.push(universityDepartment.fullName
                      + '(' + universityDepartment.shortName + ')');
                  });
                })
            );
          }
        ));
      }));
  }

  getAllDataForExpertiseAct(allScientists: AuthorsModel[]): Observable<void> {
    return this.http.get<Array<ScientistModel>>(`${environment.apiUrl}Scientist`,
      {headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.auth.user.accessToken)}).pipe(
      map((data) => {
        data.forEach(scientist => {
          allScientists.push({fullName: scientist.lastName + ' '
              + scientist.firstName + ' ' + scientist.middleName,
            degrees: this.pushDegrees(scientist.degrees)});
        });
      }));
  }

  getAllDataForExpertCommissionProtocolOfMeeting(allScientists: string[]): Observable<void> {
    return this.http.get<Array<ScientistModel>>(`${environment.apiUrl}Scientist`,
      {headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.auth.user.accessToken)}).pipe(
      map((data) => {
        data.forEach(scientist => {
          allScientists.push(scientist.lastName + ' '
              + scientist.firstName + ' ' + scientist.middleName);
        });
      }));
  }

  pushDegrees(degrees): string[]{
    const degreesNames: string[] = [];
    for (const degree of degrees) {
      degreesNames.push(degree.name);
    }
    return degreesNames;
  }

  filter(value: string, data: string[]): string[] {
    return data.filter(author => author.toLowerCase().indexOf(value.toLowerCase()) === 0);
  }
}
