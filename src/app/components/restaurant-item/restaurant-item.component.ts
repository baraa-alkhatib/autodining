import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import IRestaurantItem from '../../models/restaurant-item';
import { DeleteRestaurantFormComponent } from '../delete-restaurant-form/delete-restaurant-form.component';
import { EditRestaurantFormComponent } from '../edit-restaurant-form/edit-restaurant-form.component';

@Component({
  selector: 'app-restaurant-item',
  templateUrl: './restaurant-item.component.html',
  styleUrls: ['./restaurant-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RestaurantItemComponent {
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

  constructor(private _dialog: MatDialog) {}

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
    this._dialog.open(DeleteRestaurantFormComponent);
  }
}
