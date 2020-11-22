import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { Page404Component } from './components/page404/page404.component';
import { OnlyLoggedInGuard } from './guards/only-logged-in.guard';
import { OnlyLoggedOutGuard } from './guards/only-logged-out.guard';
import { RouterPathResolver } from './resolvers/router-path.resolver';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then((m) => m.AuthModule),
    canLoad: [OnlyLoggedOutGuard],
    canActivate: [OnlyLoggedOutGuard],
  },
  { path: 'home', component: HomeComponent, canActivate: [OnlyLoggedInGuard] },
  { path: 'login', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: 'signup', redirectTo: '/auth/signup', pathMatch: 'full' },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'users',
    loadChildren: () => import('./modules/users/users.module').then((m) => m.UsersModule),
    canActivate: [OnlyLoggedInGuard],
  },
  {
    path: 'restaurants',
    loadChildren: () =>
      import('./modules/restaurants/restaurants.module').then((m) => m.RestaurantsModule),
    canActivate: [OnlyLoggedInGuard],
  },
  {
    path: '**',
    resolve: {
      path: RouterPathResolver,
    },
    component: Page404Component,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      relativeLinkResolution: 'legacy',
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
