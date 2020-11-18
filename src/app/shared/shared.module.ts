import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { DeleteRestaurantFormComponent } from '../components/delete-restaurant-form/delete-restaurant-form.component';
import { EditRestaurantFormComponent } from '../components/edit-restaurant-form/edit-restaurant-form.component';
import { FilterBottomSheetComponent } from '../components/filter-bottom-sheet/filter-bottom-sheet.component';
import { FilterComponent } from '../components/filter/filter.component';
import { LoginFormComponent } from '../components/login-form/login-form.component';
import { NavigationMenuComponent } from '../components/navigation-menu/navigation-menu.component';
import { RestaurantItemComponent } from '../components/restaurant-item/restaurant-item.component';
import { RestaurantsListComponent } from '../components/restaurants-list/restaurants-list.component';
import { StarRatingComponent } from '../components/star-rating/star-rating.component';
import { AngularFlexLayoutModule } from './angular-flex-layout/angular-flex-layout.module';
import { AngularMaterialModule } from './angular-material/angular-material.module';

@NgModule({
  declarations: [
    LoginFormComponent,
    FilterComponent,
    FilterBottomSheetComponent,
    NavigationMenuComponent,
    RestaurantItemComponent,
    RestaurantsListComponent,
    StarRatingComponent,
    EditRestaurantFormComponent,
    DeleteRestaurantFormComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AngularMaterialModule,
    AngularFlexLayoutModule,
    MatDialogModule,
    MatBottomSheetModule,
    MatListModule,
    MatMenuModule,
    MatDividerModule,
    MatTooltipModule,
    MatSnackBarModule,
  ],
  exports: [
    // export modules
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AngularMaterialModule,
    AngularFlexLayoutModule,
    MatDialogModule,
    MatBottomSheetModule,
    MatListModule,
    MatMenuModule,
    MatDividerModule,
    MatTooltipModule,
    MatSnackBarModule,
    // export components
    LoginFormComponent,
    FilterComponent,
    FilterBottomSheetComponent,
    NavigationMenuComponent,
    RestaurantItemComponent,
    RestaurantsListComponent,
    StarRatingComponent,
    EditRestaurantFormComponent,
    DeleteRestaurantFormComponent,
  ],
})
export class SharedModule {}
