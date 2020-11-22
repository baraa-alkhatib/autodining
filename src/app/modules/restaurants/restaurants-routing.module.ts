import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DisallowUserAdminGuard } from '../../guards/disallow-user-admin.guard';
import { DisallowUserRegularGuard } from '../../guards/disallow-user-regular.guard';
import { RestaurantFormComponent } from './restaurant-form/restaurant-form.component';

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
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RestaurantsRoutingModule {}
