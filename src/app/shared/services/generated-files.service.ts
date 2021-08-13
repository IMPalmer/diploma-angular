import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '@services/auth.service';
import { UserModel } from '@models/user';
import {DescriptionOfGeneratedFile} from '@models/description-of-generated-file';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GeneratedFilesService {

  user: UserModel;

  constructor(private auth: AuthService, private http: HttpClient) { }

  getGeneratedFiles(generatedFiles: DescriptionOfGeneratedFile[]): Observable<void> {
    return this.http.get<Array<DescriptionOfGeneratedFile>>(`${environment.apiUrl}GeneratedFiles/get-list-of-generated-files`,
      {headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.auth.user.accessToken)}).pipe(
      map((data) => {
        data.forEach(file => {
          generatedFiles.push({
            name: file.name,
            type: file.type,
            format: file.format,
            creationDate: file.creationDate});
        });
      }));
  }
}
