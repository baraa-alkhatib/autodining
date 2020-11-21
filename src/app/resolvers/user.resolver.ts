import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class UserResolver implements Resolve<boolean> {
  constructor(
    private _userServ: UserService,
    private _snackBar: MatSnackBar,
    private _router: Router
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this._userServ.getUser(<string>route.paramMap.get('id')).pipe(
      catchError(() => {
        // redirect to main page
        this._router.navigateByUrl('/', { replaceUrl: true }).then(() => {
          // show error message
          this._snackBar.open(`Something went wrong!`, '', {
            duration: 2500,
          });
        });

        // prevent navigation
        return EMPTY;
      })
    );
  }
}
