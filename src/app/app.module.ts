import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { LOCAL_STORAGE } from 'ngx-webstorage-service';
import { ACCESS_TOKEN_KEY } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { authInterceptorProvider } from './interceptors/auth.interceptor';
import { composeUrlInterceptorProvider } from './interceptors/compose-url.interceptor';
import { STORAGE_PROVIDER_TOKEN } from './providers/sotrage-token.provider';
import { SharedModule } from './shared/shared.module';

/**
 * Configures where the jwt should return the access token from
 * which is necessary to setup JwtModule
 * @param {Storage} storage
 * @returns
 */
function jwtOptionsFactory(storage: Storage) {
  return {
    tokenGetter: () => {
      return storage.get(ACCESS_TOKEN_KEY);
    },
    whitelistedDomains: [window.location.hostname], // TODO: re-check this
  };
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [STORAGE_PROVIDER_TOKEN, Injector],
      },
    }),
  ],
  providers: [
    // notice that we are using LOCAL_STORAGE instead of SESSION_STORAGE
    { provide: STORAGE_PROVIDER_TOKEN, useExisting: LOCAL_STORAGE },

    /**
     * Interceptors
     */
    composeUrlInterceptorProvider,
    authInterceptorProvider,
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
