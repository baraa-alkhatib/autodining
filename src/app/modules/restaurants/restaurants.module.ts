import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { RestaurantsRoutingModule } from './restaurants-routing.module';
import { RestaurantsComponent } from './restaurants.component';

@NgModule({
  declarations: [RestaurantsComponent],
  imports: [SharedModule, RestaurantsRoutingModule],
})
export class RestaurantsModule {}
