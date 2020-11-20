import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { UserFormComponent } from './user-form/user-form.component';
import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';

@NgModule({
  declarations: [UsersComponent, UserFormComponent],
  imports: [SharedModule, UsersRoutingModule],
})
export class UsersModule {}
