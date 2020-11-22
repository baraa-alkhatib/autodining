import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import IRestaurantItem from '../../models/restaurant-item.model';
import { RestaurantService } from '../../services/restaurant.service';
import { DeleteFormComponent } from '../delete-form/delete-form.component';

@Component({
  selector: 'app-restaurant-item',
  templateUrl: './restaurant-item.component.html',
  styleUrls: ['./restaurant-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RestaurantItemComponent implements OnDestroy {
  /**
   * Holds the non-detailed view data of a restaurnt
   * @type {IRestaurantItem}
   * @memberof RestaurantItemComponent
   */
  @Input() public restaurant!: IRestaurantItem;

  /**
   * Holds a boolean to determine whether options menu show be visible on the screen
   * @type {boolean}
   * @memberof RestaurantItemComponent
   */
  @Input() public showOptions!: boolean;

  @Output() public restaurantDeleted!: EventEmitter<IRestaurantItem>;

  /**
   * An array of all subscription instances on this component;
   * it's mainly used to clean up subscriptions after the component is destroyed
   * @private
   * @type {Subscription[]}
   * @memberof RestaurantItemComponent
   */
  private readonly _subscriptions$!: Subscription[];

  public deleteLoading!: boolean;

  constructor(
    private _restaurantServ: RestaurantService,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {
    // initailize subscriptions array
    this._subscriptions$ = [];

    // initialize event emetters
    this.restaurantDeleted = new EventEmitter();
  }

  /**
   * Opens restaurant delete form in a popup window
   * @memberof RestaurantItemComponent
   */
  public onOpenDeleteDialog(restaurantName: string): void {
    const deleteDialog = this._dialog.open(DeleteFormComponent, {
      data: { target: 'restaurant', name: restaurantName },
      width: '500px',
    });

    this._subscriptions$.push(
      deleteDialog.afterClosed().subscribe((confirmed) => {
        if (confirmed) {
          // set delete to loading
          this.deleteLoading = true;
          this._restaurantServ.deleteRestaurant(this.restaurant._id).subscribe(
            () => {
              // emit deletion event
              this.restaurantDeleted.emit(this.restaurant);

              // show info message
              this._snackBar.open(`You have deleted ${this.restaurant.name} successfully!`, '', {
                duration: 2500,
              });
            },
            () => {
              this.deleteLoading = false;

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
   * @memberof RestaurantItemComponent
   */
  public ngOnDestroy(): void {
    this._subscriptions$.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
