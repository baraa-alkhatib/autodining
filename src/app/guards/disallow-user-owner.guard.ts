import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

/**
 * Stop owner user from passing
 * @export
 * @class DisallowUserOwnerGuard
 * @implements {CanActivate}
 * @implements {CanLoad}
 */
@Injectable({
  providedIn: 'root',
})
export class DisallowUserOwnerGuard implements CanActivate, CanLoad {
  constructor(private _authServ: AuthService, private _router: Router) {}

  // can activate route guard for navigation
  canActivate(): Observable<boolean> {
    return this.disallowUserOwner();
  }

  // can activate route guard for navigation on child routes
  canActivateChild(): Observable<boolean> {
    return this.disallowUserOwner();
  }

  // can load route guard for lazy loading
  canLoad(): Observable<boolean> {
    return this.disallowUserOwner();
  }

  /**
   * Helper function that returns false if user is owner user, else return true
   * @returns
   */
  private disallowUserOwner(): Observable<boolean> {
    // if logged out redirect to login page
    return this._authServ.user$.pipe(
      take(1),
      map((user) => {
        if (user.type === 'owner') {
          // Stop from passing
          return false;
        }
        return true;
      })
    );
  }
}
