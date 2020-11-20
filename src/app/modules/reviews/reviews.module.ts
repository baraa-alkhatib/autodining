import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ReviewsRoutingModule } from './reviews-routing.module';
import { ReviewsComponent } from './reviews.component';

@NgModule({
  declarations: [ReviewsComponent],
  imports: [SharedModule, ReviewsRoutingModule],
})
export class ReviewsModule {}
