import { Routes } from '@angular/router';
import appMessages from '@ntx/assets/i18n/en/appMessages.json';
import { MainLayoutComponent } from '@ntx-core/layouts/main-layout/main-layout.component';
import { EmptyLayoutComponent } from '@ntx-core/layouts/empty-layout/empty-layout.component';
import { ErrorPageComponent } from '@ntx-pages/error-page/error-page.component';
import { MovieListComponent } from '@ntx-pages/movie-list/movie-list.component';
import { ViewMovieComponent } from './pages/view-movie/view-movie.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [{ path: '', component: MovieListComponent }],
    data: { movieCardRedirect: 'view/movie' },
  },
  {
    path: 'view/movie',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: '/error/404', pathMatch: 'full' },
      { path: ':id', component: ViewMovieComponent },
    ],
  },
  {
    path: 'error',
    component: EmptyLayoutComponent,
    children: [
      { path: '', redirectTo: '/error/404', pathMatch: 'full' },
      {
        path: '403',
        component: ErrorPageComponent,
        data: {
          title: '403 Forbidden',
          errorCode: appMessages.http.error403Forbidden.status,
          errorMessage: appMessages.http.error403Forbidden.shortMessage,
          infoMessage: appMessages.redirection.toHome,
          redirectAfter: 1000,
          redirectTo: '/',
        },
      },
      {
        path: '404',
        component: ErrorPageComponent,
        data: {
          title: '404 Not Found',
          errorCode: appMessages.http.error404NotFound.status,
          errorMessage: appMessages.http.error404NotFound.shortMessage,
          infoMessage: appMessages.redirection.toHome,
          redirectAfter: 2000,
          redirectTo: '/',
        },
      },
    ],
  },
  // ... other routes before this
  { path: '**', redirectTo: '/error/404' }, // always last for handling invalid routes
];
