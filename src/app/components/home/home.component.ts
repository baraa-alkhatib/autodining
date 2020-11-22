import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { RestaurantService } from '../../services/restaurant.service';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  /**
   * An array of all subscription instances on this component;
   * it's mainly used to clean up subscriptions after the component is destroyed
   * @private
   * @type {Subscription[]}
   * @memberof HomeComponent
   */
  private readonly _subscriptions$!: Subscription[];

  /**
   * Holds user's current authentication status
   * @type {boolean}
   * @memberof HeaderComponent
   */
  public isLoggedIn!: boolean;

  constructor(private _restaurantsServ: RestaurantService, private _authServ: AuthService) {
    // initailize subscriptions array
    this._subscriptions$ = [];
  }

  public ngOnInit() {
    // listen to login events to reflect status in the ui
    this._subscriptions$.push(
      this._authServ.isLoggedIn$.subscribe((isLoggedIn) => {
        this.isLoggedIn = isLoggedIn;
      })
    );
  }

  public onClearFilter(): void {
    // clear filter
    this._restaurantsServ.dispatchRestaurantsFilter({
      orderAlphabetically: undefined,
      smallestNumberOfStars: undefined,
      status: undefined,
    });
  }

  /**
   * Clean up subscriptions when component is destroyed
   * @memberof HomeComponent
   */
  public ngOnDestroy(): void {
    this._subscriptions$.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
