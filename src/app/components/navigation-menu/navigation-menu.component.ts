import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { IUser } from '../../../../server/models/user.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navigation-menu',
  templateUrl: './navigation-menu.component.html',
  styleUrls: ['./navigation-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationMenuComponent implements OnDestroy {
  /**
   * Emits a side navigation menu close event
   * @type {EventEmitter<any>}
   * @memberof NavigationMenuComponent
   */
  @Output() public sidenavClose: EventEmitter<any>;

  /**
   * An array of all subscription instances on this component;
   * it's mainly used to clean up subscriptions after the component is destroyed
   * @private
   * @type {Subscription[]}
   * @memberof NavigationMenuComponent
   */
  private readonly _subscriptions$!: Subscription[];

  /**
   * Holds an observable of user data
   * @type {boolean}
   * @memberof HeaderComponent
   */
  public user$!: Observable<IUser>;

  constructor(
    private _authServ: AuthService,
    private _router: Router,
    private _snackBar: MatSnackBar
  ) {
    // initailize subscriptions array
    this._subscriptions$ = [];

    // Initialize sidenavClose
    this.sidenavClose = new EventEmitter();

    // initialize
    this.user$ = this._authServ.user$;
  }

  /**
   * Emits a value to close side navigation menu
   * @memberof NavigationMenuComponent
   */
  public onSidenavClose = () => {
    this.sidenavClose.emit();
  };

  public onLogout() {
    this._authServ.logout().then(() => {
      // redirect to main page
      this._router.navigateByUrl('/login', { replaceUrl: true }).then(() => {
        this._snackBar.open(`You have logged out successfully!`, '', {
          duration: 2500,
        });
      });
    });
  }

  /**
   * Clean up subscriptions when component is destroyed
   * @memberof NavigationMenuComponent
   */
  public ngOnDestroy(): void {
    this._subscriptions$.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
