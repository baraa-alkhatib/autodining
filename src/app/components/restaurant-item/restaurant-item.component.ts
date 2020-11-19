import { ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import IRestaurantItem from '../../models/restaurant-item.model';
import { DeleteFormComponent } from '../delete-form/delete-form.component';
import { EditRestaurantFormComponent } from '../edit-restaurant-form/edit-restaurant-form.component';

@Component({
  selector: 'app-restaurant-item',
  templateUrl: './restaurant-item.component.html',
  styleUrls: ['./restaurant-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RestaurantItemComponent implements OnDestroy {
  /**
   * An array of all subscription instances on this component;
   * it's mainly used to clean up subscriptions after the component is destroyed
   * @private
   * @type {Subscription[]}
   * @memberof SignupFormComponent
   */
  private readonly _subscriptions$!: Subscription[];

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

  constructor(private _dialog: MatDialog) {
    // initailize subscriptions array
    this._subscriptions$ = [];
  }

  /**
   * Opens restaurant edit form a popup window
   * @memberof RestaurantItemComponent
   */
  public onOpenEditDialog(): void {
    this._dialog.open(EditRestaurantFormComponent);
  }

  /**
   * Opens restaurant delete form in a popup window
   * @memberof RestaurantItemComponent
   */
  public onOpenDeleteDialog(): void {
    const deleteDialog = this._dialog.open(DeleteFormComponent, {
      data: { target: 'restaurant' },
      width: '500px',
    });

    this._subscriptions$.push(
      deleteDialog.afterClosed().subscribe((confirmed) => {
        if (confirmed) {
          // TODO: delete restaurant
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
