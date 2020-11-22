import { ChangeDetectionStrategy, Component, Optional } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { RestaurantService } from '../../services/restaurant.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent {
  public isOpen: boolean;

  public stars: number;

  constructor(
    private _restaurantServ: RestaurantService,
    @Optional() private _bottomSheetRef: MatBottomSheetRef<FilterComponent>
  ) {
    // initialize
    this.isOpen = false;

    this.stars = 0;
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
    this._restaurantServ.dispatchRestaurantsFilter({
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
}
