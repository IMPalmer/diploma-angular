import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthorsCertificateModel } from '@models/authors-certificate';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '@services/auth.service';
import { UserModel } from '@models/user';

@Injectable({
  providedIn: 'root'
})
export class FilesGenerationService {

  user: UserModel;
  myHeaders = new HttpHeaders().set('Authorization', 'Bearer ' + this.auth.user.accessToken);

  constructor(private auth: AuthService, private http: HttpClient) { }

  generateAuthorsCertificate(authorsCertificate: AuthorsCertificateModel): Observable<AuthorsCertificateModel> {
    return this.http.post<AuthorsCertificateModel>(`${environment.apiUrl}FilesGeneration/generate-notes-of-authors`,
      {authorsCertificate}, {headers: this.myHeaders});
  }
}
