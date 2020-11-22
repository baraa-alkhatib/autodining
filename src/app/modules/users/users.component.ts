import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { merge, of, Subject, Subscription } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

import { DeleteFormComponent } from '../../components/delete-form/delete-form.component';
import { IUser } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit, AfterViewInit, OnDestroy {
  /**
   * An array of all subscription instances on this component;
   * it's mainly used to clean up subscriptions after the component is destroyed
   * @private
   * @type {Subscription[]}
   * @memberof SignupFormComponent
   */
  private readonly _subscriptions$!: Subscription[];

  /**
   * Used to emit a value to trigger table to refresh
   * @private
   * @type {Subject<any>}
   * @memberof UsersComponent
   */
  private _deleteUser$!: Subject<any>;

  public displayedColumns: string[] = ['name', 'createdAt', 'type', 'restaurantsCount', 'actions'];

  public users: IUser[] = [];

  public admin!: IUser;

  public resultsLength = 0;

  public isLoadingResults = true;

  public loadingError = false;

  @ViewChild(MatPaginator) public paginator!: MatPaginator;

  @ViewChild(MatSort) public sort!: MatSort;

  constructor(
    private _authServ: AuthService,
    private _userServ: UserService,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {
    // initailize subscriptions array
    this._subscriptions$ = [];

    // initialize subject
    this._deleteUser$ = new Subject();
  }

  public ngOnInit(): void {
    this.admin = this._authServ.user;
  }

  public ngAfterViewInit(): void {
    // if the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0;
    });

    merge(this.sort.sortChange, this.paginator.page, this._deleteUser$)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;

          return this._userServ.getUsers({
            sortBy: <'name' | 'createdAt' | 'type' | 'restaurantsCount'>this.sort.active,
            order: <'asc' | 'desc'>this.sort.direction,
            page: this.paginator.pageIndex,
          });
        }),
        map((data) => {
          // flip flag to show that loading has finished.
          this.isLoadingResults = false;

          this.loadingError = false;

          this.resultsLength = data.total;

          return data.users;
        }),
        catchError(() => {
          this.isLoadingResults = false;

          // return empty data array on error
          this.loadingError = true;
          return of([]);
        })
      )
      .subscribe((users) => {
        this.users = users;
      });
  }

  /**
   * Opens user delete form in a popup window
   * @param {IUser} user
   * @memberof UsersComponent
   */
  public onOpenDeleteDialog(user: IUser): void {
    const deleteDialog = this._dialog.open(DeleteFormComponent, {
      data: { target: 'user', name: user.name },
      width: '500px',
    });

    this._subscriptions$.push(
      deleteDialog.afterClosed().subscribe((confirmed) => {
        if (confirmed) {
          this._userServ.deleteUser(user._id).subscribe(
            () => {
              // trigger table to refresh
              this._deleteUser$.next(user._id);

              this._snackBar.open(`You have successfully deleted ${user.name}`, '', {
                duration: 2500,
              });
            },
            () => {
              this._snackBar.open(`Something went wrong!`, '', {
                duration: 2500,
              });
            }
          );
        }
      })
    );
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
