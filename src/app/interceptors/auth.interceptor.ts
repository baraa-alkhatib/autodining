import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Injectable, Provider } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

const jwtHelper = new JwtHelperService();

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private _authServ: AuthService, private _router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // set token on the request clone
    const reqClone = req.clone({
      setHeaders: {
        Authorization: `Bearer ${this._authServ.accessToken}`,
      },
    });

    return next.handle(reqClone).pipe(
      tap(() => {
        if (this._authServ.accessToken && jwtHelper.isTokenExpired(this._authServ.accessToken)) {
          // if access token is expired log out and redirect to main page
          this._authServ.logout().then(() => {
            this._router.navigateByUrl('/', { replaceUrl: true });
          });
        }
      }),
      catchError((err: HttpErrorResponse) => {
        if (err instanceof HttpErrorResponse) {
          if (
            err.status === 498 ||
            (err.status === 401 &&
              this._authServ.accessToken &&
              jwtHelper.isTokenExpired(this._authServ.accessToken))
          ) {
            // token-expired | not-authorized error and redirect to main page
            this._authServ.logout().then(() => {
              this._router.navigateByUrl('/', { replaceUrl: true });
            });
          }
        }
        return throwError(err);
      })
    );
  }
}

export const authInterceptorProvider: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: AuthInterceptor,
  multi: true,
};
