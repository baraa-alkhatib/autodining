import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { RestaurantsRoutingModule } from './restaurants-routing.module';
import { RestaurantsComponent } from './restaurants.component';
import { RestaurantFormComponent } from './restaurant-form/restaurant-form.component';
import { RestaurantComponent } from './restaurant/restaurant.component';

@NgModule({
  declarations: [RestaurantsComponent, RestaurantFormComponent, RestaurantComponent],
  imports: [SharedModule, RestaurantsRoutingModule],
})
export class RestaurantsModule {}
