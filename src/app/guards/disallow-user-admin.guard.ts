import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

/**
 * Stop admin from passing
 * @export
 * @class DisallowUserAdminGuard
 * @implements {CanActivate}
 * @implements {CanLoad}
 */
@Injectable({
  providedIn: 'root',
})
export class DisallowUserAdminGuard implements CanActivate, CanLoad {
  constructor(private _authServ: AuthService, private _router: Router) {}

  // can activate route guard for navigation
  canActivate(): Observable<boolean> {
    return this.disallowUserAdmin();
  }

  // can activate route guard for navigation on child routes
  canActivateChild(): Observable<boolean> {
    return this.disallowUserAdmin();
  }

  // can load route guard for lazy loading
  canLoad(): Observable<boolean> {
    return this.disallowUserAdmin();
  }

  /**
   * Helper function that returns false if user is admin, else return true
   * @returns
   */
  private disallowUserAdmin(): Observable<boolean> {
    // if logged out redirect to login page
    return this._authServ.user$.pipe(
      take(1),
      map((user) => {
        if (user.type === 'admin') {
          // Stop from passing
          return false;
        }
        return true;
      })
    );
  }
}
