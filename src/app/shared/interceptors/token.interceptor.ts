import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, ObservableInput, throwError } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { AuthService } from '@services/auth.service';
import { UserModel } from '@models/user';
import { TokensPairModel } from '@models/tokens-pair';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((err) => {
        if (err.status === 401) {
          const currentUser: UserModel = this.auth.user;
          return this.auth.refresh(currentUser.accessToken, currentUser.refreshToken).pipe(
            mergeMap( (data: TokensPairModel): ObservableInput<any> => {
              currentUser.accessToken = data.accessToken;
              currentUser.refreshToken = data.refreshToken;
              this.auth.user = currentUser;
              const cloneReq = request.clone({
                setHeaders: {Authorization: 'Bearer ' + data.accessToken}
              });
              return next.handle(cloneReq);
            })
          );
        }
        const error = (err && err.error && err.error.message) || err.statusText;
        return throwError(error);
      })
    );
  }
}
