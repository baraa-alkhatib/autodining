import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

/**
 * Allows only logged in to navigate, otherwise it redirects to the login page
 * @export
 * @class OnlyLoggedInGuard
 * @implements {CanActivate}
 * @implements {CanLoad}
 */
@Injectable({
  providedIn: 'root',
})
export class OnlyLoggedInGuard implements CanActivate, CanLoad {
  constructor(private _authServ: AuthService, private _router: Router) {}

  // can activate route guard for navigation
  canActivate(): Observable<boolean> {
    return this.allowOnlyLoggedIn();
  }

  // can load route guard for lazy loading
  canLoad(): Observable<boolean> {
    return this.allowOnlyLoggedIn();
  }

  /**
   * Helper function that returns true if user is logged in, or else redirects the user to login page
   * @returns
   */
  private allowOnlyLoggedIn(): Observable<boolean> {
    // if logged out redirect to login page
    return this._authServ.isLoggedIn$.pipe(
      take(1),
      map((isLoggedIn) => {
        if (!isLoggedIn) {
          // redirect to login page
          this._router.navigateByUrl('/login', { replaceUrl: true });
          return false;
        }
        return true;
      })
    );
  }
}
