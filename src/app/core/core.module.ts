import { NgModule, Optional, SkipSelf } from '@angular/core';
import { HeaderComponent } from '../components/header/header.component';
import { HomeComponent } from '../components/home/home.component';
import { SharedModule } from '../shared/shared.module';
import { EnsureImportedOnceModule } from '../utils/ensure-imported-once.utils';

@NgModule({
  imports: [SharedModule],
  declarations: [HomeComponent, HeaderComponent],
  exports: [HomeComponent, HeaderComponent],
})
export class CoreModule extends EnsureImportedOnceModule {
  public constructor(@Optional() @SkipSelf() parent: CoreModule) {
    super(parent);
  }
}
