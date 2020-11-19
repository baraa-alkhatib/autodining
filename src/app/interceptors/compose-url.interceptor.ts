import { APP_BASE_HREF } from '@angular/common';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Inject, Injectable, Optional, Provider } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class ComposeUrlInterceptor implements HttpInterceptor {
  /**
   * Holds APP_BASE_HREF
   * @private
   * @memberof ComposeUrlInterceptor
   */
  private _originUrl = '';

  constructor(@Optional() @Inject(APP_BASE_HREF) origin: string) {
    if (origin !== null) {
      this._originUrl = origin;
    }
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // clone the original request
    const reqClone = request.clone({ url: `${this._originUrl}${request.url}` });

    // handle request clone
    return next.handle(reqClone);
  }
}

export const composeUrlInterceptorProvider: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: ComposeUrlInterceptor,
  multi: true,
};
