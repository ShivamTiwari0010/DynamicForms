import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './common/layout/layout.component';

const routes: Routes = [
  {
    path:'',
    component: LayoutComponent,
    children : [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./modules/dashboard/dashboard.module').then((m1) => m1.DashboardModule),
      },
      {
        path: 'forms-listing',
        loadChildren: () =>
          import('./modules/forms-listing/forms-listing.module').then((m1) => m1.FormsListingModule),
      },
      {
        path:'**',
        redirectTo:'dashboard'
      }


    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
