import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsListingComponent } from './forms-listing/forms-listing.component';
import { FormViewComponent } from './form-view/form-view.component';

const routes: Routes = [
    {
      path: 'listing',
      component: FormsListingComponent,
    },
    {
      path:'form-view/:formName',
      component: FormViewComponent
    },
    { path: '**', pathMatch: 'full', redirectTo: 'dashboard' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormsListingRoutingModule { }
