import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthorsCertificateModel } from '@models/authors-certificate';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '@services/auth.service';
import { UserModel } from '@models/user';
import {ExpertiseActModel} from '@models/expertise-act';

@Injectable({
  providedIn: 'root'
})
export class FilesGenerationService {

  user: UserModel;

  constructor(private auth: AuthService, private http: HttpClient) { }

  generateAuthorsCertificate(authorsCertificate: AuthorsCertificateModel): Observable<ArrayBuffer> {
    return this.http.post(`${environment.apiUrl}FilesGeneration/generate-notes-of-authors`,
      authorsCertificate,
      {headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.auth.user.accessToken), responseType: 'arraybuffer' });
  }

  generateExpertiseAct(expertiseAct: ExpertiseActModel): Observable<ArrayBuffer> {
    return this.http.post(`${environment.apiUrl}FilesGeneration/generate-expertise-act`,
      expertiseAct,
      {headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.auth.user.accessToken), responseType: 'arraybuffer' });
  }

  downloadFile(data: ArrayBuffer, fileName: string, contentType: string): void {
    const blob = new Blob([data], { type: contentType });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
