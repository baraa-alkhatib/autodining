import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { DeleteFormComponent } from '../components/delete-form/delete-form.component';
import { EditRestaurantFormComponent } from '../components/edit-restaurant-form/edit-restaurant-form.component';
import { FilterBottomSheetComponent } from '../components/filter-bottom-sheet/filter-bottom-sheet.component';
import { FilterComponent } from '../components/filter/filter.component';
import { LoginFormComponent } from '../components/login-form/login-form.component';
import { LogoutFormComponent } from '../components/logout-form/logout-form.component';
import { NavigationMenuComponent } from '../components/navigation-menu/navigation-menu.component';
import { RestaurantItemComponent } from '../components/restaurant-item/restaurant-item.component';
import { RestaurantsListComponent } from '../components/restaurants-list/restaurants-list.component';
import { SignupFormComponent } from '../components/signup-form/signup-form.component';
import { StarRatingComponent } from '../components/star-rating/star-rating.component';
import { AngularFlexLayoutModule } from './angular-flex-layout/angular-flex-layout.module';
import { AngularMaterialModule } from './angular-material/angular-material.module';

@NgModule({
  declarations: [
    LoginFormComponent,
    SignupFormComponent,
    FilterComponent,
    FilterBottomSheetComponent,
    NavigationMenuComponent,
    RestaurantItemComponent,
    RestaurantsListComponent,
    StarRatingComponent,
    EditRestaurantFormComponent,
    DeleteFormComponent,
    LogoutFormComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    AngularMaterialModule,
    AngularFlexLayoutModule,
    MatDialogModule,
    MatBottomSheetModule,
    MatListModule,
    MatMenuModule,
    MatDividerModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  exports: [
    // export modules
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    AngularMaterialModule,
    AngularFlexLayoutModule,
    MatDialogModule,
    MatBottomSheetModule,
    MatListModule,
    MatMenuModule,
    MatDividerModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    // export components
    LoginFormComponent,
    FilterComponent,
    FilterBottomSheetComponent,
    NavigationMenuComponent,
    RestaurantItemComponent,
    RestaurantsListComponent,
    StarRatingComponent,
    EditRestaurantFormComponent,
    SignupFormComponent,
    DeleteFormComponent,
    LogoutFormComponent,
  ],
})
export class SharedModule {}
