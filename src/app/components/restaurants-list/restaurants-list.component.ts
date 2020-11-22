import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { merge, Observable, of, Subscription } from 'rxjs';
import { catchError, debounceTime, map, switchMap } from 'rxjs/operators';
import { IUser } from '../../../../server/models/user.model';
import IRestaurantItem from '../../models/restaurant-item.model';
import { AuthService } from '../../services/auth.service';
import { RestaurantService } from '../../services/restaurant.service';

@Component({
  selector: 'app-restaurants-list',
  templateUrl: './restaurants-list.component.html',
  styleUrls: ['./restaurants-list.component.scss'],
})
export class RestaurantsListComponent implements OnInit, OnDestroy {
  /**
   * An array of all subscription instances on this component;
   * it's mainly used to clean up subscriptions after the component is destroyed
   * @private
   * @type {Subscription[]}
   * @memberof SignupFormComponent
   */
  private readonly _subscriptions$!: Subscription[];

  /**
   * Holds an observable of user data
   * @type {boolean}
   * @memberof HeaderComponent
   */
  public user$!: Observable<IUser>;

  /**
   * Holds a list of non-detailed restaurants view data
   * @type {IRestaurantItem[]}
   * @memberof RestaurantsListComponent
   */
  public restaurants: IRestaurantItem[];

  public isLoadingResults!: boolean;

  public loadingError!: boolean;

  constructor(
    private _authServ: AuthService,
    private _restaurantServ: RestaurantService,
    private _snackBar: MatSnackBar
  ) {
    // initailize subscriptions array
    this._subscriptions$ = [];

    // initialize
    this.restaurants = [];

    this.isLoadingResults = true;
  }

  public ngOnInit(): void {
    // listen to filter changes
    this._subscriptions$.push(
      merge(this._restaurantServ.restaurantsFilter$)
        .pipe(
          // make sure to get the latest value in burst of filter changes
          debounceTime(1000),

          switchMap((restaurantsFilter) => {
            // set isLoadingResults to true while loading data
            this.isLoadingResults = true;

            // remove old restaurants from on the screen
            this.restaurants = [];

            // get restaurants list
            return this._restaurantServ.getRestaurants({
              orderAlphabetically: restaurantsFilter?.orderAlphabetically,
              smallestNumberOfStars: restaurantsFilter?.smallestNumberOfStars,
              status: restaurantsFilter?.status,
            });
          }),

          map((data) => {
            // flip flag to show that loading has finished.
            this.isLoadingResults = false;

            this.loadingError = false;

            return data.restaurants;
          }),

          catchError(() => {
            this.isLoadingResults = false;

            this.loadingError = true;

            // return empty data array on error
            return of([]);
          })
        )
        .subscribe((restaurants) => {
          this.restaurants = restaurants;
        })
    );

    // listen to login events to reflect status in the ui
    this._subscriptions$.push(
      this._authServ.isLoggedIn$.subscribe(() => {
        this.user$ = this._authServ.user$;
      })
    );
  }

  public onDeleteRestaurant(): void {
    // refresh the list
    this._restaurantServ.dispatchRestaurantsFilter(this._restaurantServ.restaurantsFilter);
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
