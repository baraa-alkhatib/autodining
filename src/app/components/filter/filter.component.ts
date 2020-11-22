import { Component, OnDestroy, OnInit, Optional } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Subscription } from 'rxjs';
import { RestaurantService } from '../../services/restaurant.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit, OnDestroy {
  /**
   * An array of all subscription instances on this component;
   * it's mainly used to clean up subscriptions after the component is destroyed
   * @private
   * @type {Subscription[]}
   * @memberof FilterComponent
   */
  private readonly _subscriptions$!: Subscription[];

  public isOpen: boolean;

  public stars: number;

  constructor(
    private _restaurantsServ: RestaurantService,
    @Optional() private _bottomSheetRef: MatBottomSheetRef<FilterComponent>
  ) {
    // initailize subscriptions array
    this._subscriptions$ = [];

    // initialize
    this.isOpen = false;

    this.stars = 1;
  }

  public ngOnInit(): void {
    // listen to any changes on filter coming from elsewhere in the app and reflect the changes in the UI
    this._subscriptions$.push(
      this._restaurantsServ.restaurantsFilter$.subscribe((restaurantsFilter) => {
        // reset status filter
        if (!restaurantsFilter?.smallestNumberOfStars) {
          this.stars = 1;
        } else {
          this.stars = restaurantsFilter.smallestNumberOfStars;
        }

        // reset status filter
        if (!restaurantsFilter?.status) {
          this.isOpen = false;
        } else {
          this.isOpen = true;
        }
      })
    );
  }

  public onToggleIsOpen(): void {
    // toggle status
    this.isOpen = !this.isOpen;

    // filter by restaurant's status
    this.filterRestaurants();
  }

  public onRatingUpdated(stars: 0 | 1 | 2 | 3 | 4 | 5): void {
    // update number of stars
    this.stars = stars;

    // filter by least number of stars
    this.filterRestaurants();
  }

  private filterRestaurants(): void {
    this._restaurantsServ.dispatchRestaurantsFilter({
      smallestNumberOfStars: <any>this.stars || undefined,
      status: this.isOpen ? 'open' : undefined,
    });
  }

  /**
   * Closes mat dialog if filter was opened in it
   * @memberof FilterListComponent
   */
  public close(): void {
    if (this._bottomSheetRef) {
      this._bottomSheetRef.dismiss();
    }
  }

  /**
   * Clean up subscriptions when component is destroyed
   * @memberof FilterComponent
   */
  public ngOnDestroy(): void {
    this._subscriptions$.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
