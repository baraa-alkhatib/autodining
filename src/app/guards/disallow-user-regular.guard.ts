import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class DisallowUserRegularGuard implements CanActivate, CanLoad, CanActivateChild {
  constructor(private _authServ: AuthService, private _router: Router) {}

  // can activate route guard for navigation
  canActivate(): Observable<boolean> {
    return this.disallowUserRegular();
  }

  // can activate route guard for navigation on child routes
  canActivateChild(): Observable<boolean> {
    return this.disallowUserRegular();
  }

  // can load route guard for lazy loading
  canLoad(): Observable<boolean> {
    return this.disallowUserRegular();
  }

  /**
   * Helper function that returns false if user is regular user, else return true
   * @returns
   */
  private disallowUserRegular(): Observable<boolean> {
    // if logged out redirect to login page
    return this._authServ.user$.pipe(
      take(1),
      map((user) => {
        if (user.type === 'regular') {
          // Stop from passing
          return false;
        }
        return true;
      })
    );
  }
}
