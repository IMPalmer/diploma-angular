import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, ObservableInput, throwError } from 'rxjs';
import {catchError, mergeMap} from 'rxjs/operators';
import { AuthService } from '@services/auth.service';
import { UserModel } from '@models/user';
import { TokensPairModel } from '@models/tokens-pair';
import { SnackbarResponseService } from '@services/snackbar-response.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService, private snackBarResponse: SnackbarResponseService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((err) => {
        switch (err.status){
          case 401: {
            if (err.error === null) {
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
            else if (err.error.message === 'Invalid credintials') {
              this.snackBarResponse.showSnackBar(
                'No such user exists! Invalid email or password!', null);
            }
            break;
          }
          case 400: {
            if (err.error.message === 'Email is already registred'){
              this.snackBarResponse.showSnackBar(
                'This email is already registered!', null);
            }
            break;
          }
          default: {
            break;
          }
        }
        return throwError(err);
      })
    );
  }


}
