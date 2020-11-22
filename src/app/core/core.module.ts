import { NgModule, Optional, SkipSelf } from '@angular/core';
import { HeaderComponent } from '../components/header/header.component';
import { HomeComponent } from '../components/home/home.component';
import { Page404Component } from '../components/page404/page404.component';
import { SharedModule } from '../shared/shared.module';
import { EnsureImportedOnceModule } from '../utils/ensure-imported-once.utils';

@NgModule({
  imports: [SharedModule],
  declarations: [HomeComponent, HeaderComponent, Page404Component],
  exports: [HomeComponent, HeaderComponent, Page404Component],
})
export class CoreModule extends EnsureImportedOnceModule {
  public constructor(@Optional() @SkipSelf() parent: CoreModule) {
    super(parent);
  }
}
