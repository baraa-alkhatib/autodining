import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-edit-restaurant-form',
  templateUrl: './edit-restaurant-form.component.html',
  styleUrls: ['./edit-restaurant-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditRestaurantFormComponent {}
