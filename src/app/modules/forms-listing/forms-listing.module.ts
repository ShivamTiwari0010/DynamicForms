import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsListingRoutingModule } from './forms-listing-routing.module';
import { FormsListingComponent } from './forms-listing/forms-listing.component';
import { FormsModule } from '@angular/forms';
import { FormViewComponent } from './form-view/form-view.component';


@NgModule({
  declarations: [
    FormsListingComponent,
    FormViewComponent
  ],
  imports: [
    CommonModule,
    FormsListingRoutingModule,
    FormsModule
  ],
  exports: [
    FormsListingComponent
  ]
})
export class FormsListingModule { }
