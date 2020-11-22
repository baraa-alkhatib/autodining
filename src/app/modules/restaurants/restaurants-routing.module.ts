import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DisallowUserAdminGuard } from '../../guards/disallow-user-admin.guard';
import { DisallowUserRegularGuard } from '../../guards/disallow-user-regular.guard';
import { RestaurantResolver } from '../../resolvers/restaurant.resolver';
import { RestaurantFormComponent } from './restaurant-form/restaurant-form.component';
import { RestaurantComponent } from './restaurant/restaurant.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full',
      },
      {
        path: 'new',
        component: RestaurantFormComponent,
        canActivate: [DisallowUserAdminGuard, DisallowUserRegularGuard],
      },
      {
        path: ':id/edit',
        component: RestaurantFormComponent,
        canActivate: [DisallowUserRegularGuard],
        resolve: { restaurant: RestaurantResolver },
      },
      {
        path: ':id',
        component: RestaurantComponent,
        resolve: { restaurant: RestaurantResolver },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RestaurantsRoutingModule {}
