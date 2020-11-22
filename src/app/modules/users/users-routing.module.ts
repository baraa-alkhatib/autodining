import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DisallowUserOwnerGuard } from '../../guards/disallow-user-owner.guard';
import { DisallowUserRegularGuard } from '../../guards/disallow-user-regular.guard';
import { UserResolver } from '../../resolvers/user.resolver';
import { UserFormComponent } from './user-form/user-form.component';
import { UsersComponent } from './users.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: UsersComponent,
        canActivate: [DisallowUserOwnerGuard, DisallowUserRegularGuard],
      },
      { path: ':id/edit', component: UserFormComponent, resolve: { user: UserResolver } },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
