import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { DeleteFormComponent } from '../components/delete-form/delete-form.component';
import { FileUploadComponent } from '../components/file-upload/file-upload.component';
import { FilterBottomSheetComponent } from '../components/filter-bottom-sheet/filter-bottom-sheet.component';
import { FilterComponent } from '../components/filter/filter.component';
import { LoginFormComponent } from '../components/login-form/login-form.component';
import { LogoutFormComponent } from '../components/logout-form/logout-form.component';
import { NavigationMenuComponent } from '../components/navigation-menu/navigation-menu.component';
import { NavigatorComponent } from '../components/navigator/navigator.component';
import { RestaurantItemComponent } from '../components/restaurant-item/restaurant-item.component';
import { RestaurantsListComponent } from '../components/restaurants-list/restaurants-list.component';
import { SignupFormComponent } from '../components/signup-form/signup-form.component';
import { StarRatingComponent } from '../components/star-rating/star-rating.component';
import { AssetPathResolvePipe } from '../pipes/asset-path-resolve.pipe';
import { AngularFlexLayoutModule } from './angular-flex-layout/angular-flex-layout.module';
import { AngularMaterialModule } from './angular-material/angular-material.module';
import { ReviewItemComponent } from '../components/review-item/review-item.component';
import { ReviewFormComponent } from '../components/review-form/review-form.component';

@NgModule({
  declarations: [
    // components
    LoginFormComponent,
    SignupFormComponent,
    FilterComponent,
    FilterBottomSheetComponent,
    NavigationMenuComponent,
    RestaurantItemComponent,
    RestaurantsListComponent,
    StarRatingComponent,
    DeleteFormComponent,
    LogoutFormComponent,
    FileUploadComponent,
    NavigatorComponent,
    ReviewItemComponent,
    // pipes
    AssetPathResolvePipe,
    ReviewFormComponent,
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
    MatSlideToggleModule,
    MatCheckboxModule,
    MatSelectModule,
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
    MatSlideToggleModule,
    MatCheckboxModule,
    MatSelectModule,
    // export components
    LoginFormComponent,
    FilterComponent,
    FilterBottomSheetComponent,
    NavigationMenuComponent,
    RestaurantItemComponent,
    RestaurantsListComponent,
    StarRatingComponent,
    SignupFormComponent,
    DeleteFormComponent,
    LogoutFormComponent,
    FileUploadComponent,
    NavigatorComponent,
    ReviewItemComponent,
    // expotr pipes
    AssetPathResolvePipe,
    ReviewFormComponent,
  ],
})
export class SharedModule {}
