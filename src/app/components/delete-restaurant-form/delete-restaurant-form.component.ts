import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-delete-restaurant-form',
  templateUrl: './delete-restaurant-form.component.html',
  styleUrls: ['./delete-restaurant-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteRestaurantFormComponent {}
