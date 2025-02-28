import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToasterComponent } from './toaster/toaster/toaster.component';
import { NgbPopoverModule, NgbToastModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationDialogComponent } from './confirmation/confirmation-dialog/confirmation-dialog.component';
import { LoaderComponent } from './loader/loader.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { AddDataInFormComponent } from './popups/add-data-in-form/add-data-in-form.component';
import { AddNewFormComponent } from './popups/add-new-form/add-new-form.component';
import { SaveUserComponent } from './popups/save-user/save-user.component';

@NgModule({
  declarations: [
    ToasterComponent,
    ConfirmationDialogComponent, 
    LoaderComponent, 
    AddDataInFormComponent,
    AddNewFormComponent,
    SaveUserComponent
  ],
  imports: [
    CommonModule,
    NgbToastModule, 
    FormsModule, 
    ReactiveFormsModule, 
    NgxMaskDirective,
    NgxMaskPipe,
    NgbTooltipModule,
    NgbPopoverModule
  ],
   exports:[
    ToasterComponent, 
    ConfirmationDialogComponent,
    LoaderComponent, 
    FormsModule, 
    ReactiveFormsModule,  
    NgxMaskDirective,
    NgxMaskPipe,
    NgbTooltipModule,
    NgbPopoverModule,
    AddNewFormComponent
  ],
})
export class SharedModule { }
