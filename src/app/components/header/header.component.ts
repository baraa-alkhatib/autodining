import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavigationEnd, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { IUser } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  /**
   * Emits a side navbar toggle event
   * @memberof HeaderComponent
   */
  @Output() public toggleSidenav: EventEmitter<any>;

  /**
   * Emits a login dialog open event
   * @memberof HeaderComponent
   */
  @Output() public openLoginDialog: EventEmitter<any>;

  /**
   * Emits a logout dialog open event
   * @memberof HeaderComponent
   */
  @Output() public openLogoutDialog!: EventEmitter<any>;

  /**
   * Emits a filter bottom sheet toggle event
   * @memberof HeaderComponent
   */
  @Output() public toggleFilterBottomSheet: EventEmitter<any>;

  /**
   * An array of all subscription instances on this component;
   * it's mainly used to clean up subscriptions after the component is destroyed
   * @private
   * @type {Subscription[]}
   * @memberof SignupFormComponent
   */
  private readonly _subscriptions$!: Subscription[];

  /**
   * Holds the current route url
   * @type {string}
   * @memberof HeaderComponent
   */
  public url!: string;

  /**
   * Holds user's current authentication status
   * @type {boolean}
   * @memberof HeaderComponent
   */
  public isLoggedIn!: boolean;

  /**
   * Holds an observable of user data
   * @type {boolean}
   * @memberof HeaderComponent
   */
  public user$!: Observable<IUser>;

  constructor(
    private _router: Router,
    private _authServ: AuthService,
    private _snackBar: MatSnackBar,
    private _dialog: MatDialog
  ) {
    // initailize subscriptions array
    this._subscriptions$ = [];

    // Initialize event emitters

    this.toggleSidenav = new EventEmitter();

    this.openLoginDialog = new EventEmitter();

    this.openLogoutDialog = new EventEmitter();

    this.toggleFilterBottomSheet = new EventEmitter();
  }

  public ngOnInit() {
    // listen to router events and update the current route url
    this._subscriptions$.push(
      this._router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          // set current route url (e.g. /home/auth) without the query params
          this.url = event.urlAfterRedirects?.split('?')[0];
        }
      })
    );

    // listen to login events to reflect status in the ui
    this._subscriptions$.push(
      this._authServ.isLoggedIn$.subscribe((isLoggedIn) => {
        this.user$ = this._authServ.user$;

        this.isLoggedIn = isLoggedIn;
      })
    );
  }

  /**
   * Emits a value to toggles side navbar menu
   * @memberof HeaderComponent
   */
  public onToggleSidenav = (): void => {
    this.toggleSidenav.emit();
  };

  /**
   * Emits a value to open login popup window
   * @memberof HeaderComponent
   */
  public onOpenLoginDialog = (): void => {
    this.openLoginDialog.emit();
  };

  /**
   * Emits a value to open logout popup window
   * @memberof HeaderComponent
   */
  public onOpenLogoutDialog = (): void => {
    this.openLogoutDialog.emit();
  };

  /**
   * Emits a value to toggles filter bottom sheet
   * @memberof HeaderComponent
   */
  public onToggleFilter = (): void => {
    this.toggleFilterBottomSheet.emit();
  };

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
