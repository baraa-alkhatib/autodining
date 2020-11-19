import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { LogoutFormComponent } from './components/logout-form/logout-form.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  /**
   * An array of all subscription instances on this component;
   * it's mainly used to clean up subscriptions after the component is destroyed
   * @private
   * @type {Subscription[]}
   * @memberof SignupFormComponent
   */
  private readonly _subscriptions$!: Subscription[];

  title = 'AutoDining';

  constructor(
    private _dialog: MatDialog,
    private _authServ: AuthService,
    private _snackBar: MatSnackBar
  ) {
    // initailize subscriptions array
    this._subscriptions$ = [];

    // initialize authentication on bootstrap
    this._authServ.initAuth();
  }

  /**
   * Opens login form in a popup window
   * @memberof AppComponent
   */
  public onOpenLoginDialog(): void {
    this._dialog.open(LoginFormComponent, {
      panelClass: 'dialog-no-padding',
      width: '500px',
    });
  }

  /**
   * Opens login form in a popup window
   * @memberof AppComponent
   */
  public onOpenLogoutDialog(): void {
    const logoutDialog = this._dialog.open(LogoutFormComponent, {
      width: '500px',
    });

    logoutDialog.beforeClosed().subscribe((confirmed) => {
      if (confirmed) {
        this._authServ.logout().then(() => {
          this._snackBar.open(`You have logged out successfully!`, '', {
            duration: 2500,
          });
        });
      }
    });
  }

  /**
   * Clean up subscriptions when component is destroyed
   * @memberof SignupFormComponent
   */
  public ngOnDestroy(): void {
    this._subscriptions$.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
