import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

/**
 * Allows only logged out to navigate, otherwise it redirects to the main page
 * @export
 * @class OnlyLoggedOutGuard
 * @implements {CanActivate}
 * @implements {CanLoad}
 */
@Injectable({
  providedIn: 'root',
})
export class OnlyLoggedOutGuard implements CanActivate, CanLoad {
  constructor(private _authServ: AuthService, private _router: Router) {}

  // can activate route guard for navigation
  canActivate(): Observable<boolean> {
    return this.allowOnlyLoggedOut();
  }

  // can load route guard for lazy loading
  canLoad(): Observable<boolean> {
    return this.allowOnlyLoggedOut();
  }

  /**
   * Helper function that returns true if user is logged out, or else redirects the user to main page
   * @returns
   */
  private allowOnlyLoggedOut(): Observable<boolean> {
    // if logged in redirect to main page
    return this._authServ.isLoggedIn$.pipe(
      take(1),
      map((isLoggedIn) => {
        if (isLoggedIn) {
          // redirect to main page
          this._router.navigateByUrl('/', { replaceUrl: true });
          return false;
        }
        return true;
      })
    );
  }
}
