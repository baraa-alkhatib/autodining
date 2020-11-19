import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { OnlyLoggedOutGuard } from './guards/only-logged-out.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then((m) => m.AuthModule),
    canLoad: [OnlyLoggedOutGuard],
    canActivate: [OnlyLoggedOutGuard],
  },
  { path: 'home', component: HomeComponent },
  { path: 'login', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: 'signup', redirectTo: '/auth/signup', pathMatch: 'full' },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: '**',
    redirectTo: '/home',
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
