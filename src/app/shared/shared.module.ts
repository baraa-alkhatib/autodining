import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatDialogModule } from '@angular/material/dialog';
import { FilterBottomSheetComponent } from '../components/filter-bottom-sheet/filter-bottom-sheet.component';
import { FilterComponent } from '../components/filter/filter.component';
import { LoginFormComponent } from '../components/login-form/login-form.component';
import { LoginWindowComponent } from '../components/login-window/login-window.component';
import { AngularFlexLayoutModule } from './angular-flex-layout/angular-flex-layout.module';
import { AngularMaterialModule } from './angular-material/angular-material.module';

@NgModule({
  declarations: [
    LoginFormComponent,
    LoginWindowComponent,
    FilterComponent,
    FilterBottomSheetComponent,
  ],
  exports: [
    // export modules
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    AngularFlexLayoutModule,
    MatDialogModule,
    MatBottomSheetModule,
    // export components
    LoginFormComponent,
    LoginWindowComponent,
    FilterComponent,
    FilterBottomSheetComponent,
  ],
})
export class SharedModule {}
