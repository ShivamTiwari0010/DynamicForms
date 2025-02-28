import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsListingComponent } from '../../forms-listing/forms-listing/forms-listing.component';
import { AddNewFormComponent } from '../../../shared/popups/add-new-form/add-new-form.component';
import { SaveUserComponent } from '../../../shared/popups/save-user/save-user.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  @ViewChild(FormsListingComponent) formsListing!: FormsListingComponent;
  dashboard : any = {};
  currentUser : string = ''; 
  constructor(
    private readonly modalService: NgbModal,
    private readonly cdRef : ChangeDetectorRef 
  ){
    this.getUser();
    this.loadStoredData();
    this.totalForms();

    if (!this.currentUser ){
      this.saveUser();
    }
  }

  ngAfterViewInit() {
    this.refreshFormListing(); 
  }

  getUser(){
    this.currentUser = sessionStorage?.getItem('currentUser') ?? '';
  }

  saveUser(){
    const modalRef = this.modalService.open(SaveUserComponent,{
      backdrop: 'static',
      keyboard: false,
      centered: true,
    });
    modalRef.result.then(
      () => {
        this.getUser(); 
        this.cdRef.detectChanges(); 
      },
      () => {
        this.getUser();
        this.cdRef.detectChanges(); 
      }
    );
  }

  addNewForm(){
    const modalRef = this.modalService.open(AddNewFormComponent,{
      backdrop: 'static',
      centered: true,
      size: 'lg'
    });
    modalRef.componentInstance.formAdded.subscribe(() => {
      this.refreshFormListing();
      this.cdRef.detectChanges(); 
    });

    modalRef.result.then(
    () => {
      this.loadStoredData(); 
      this.cdRef.detectChanges(); 
      this.formsListing.loadStoredData();
    },
    () => {
      this.loadStoredData();
      this.cdRef.detectChanges(); 
      this.formsListing.loadStoredData();
    }
    );
  }

  refreshFormListing() {
    if (this.formsListing) {
      this.formsListing.loadStoredData();
      this.cdRef.detectChanges();
    }
  }

  loadStoredData() {
    const savedForms = sessionStorage.getItem('savedForms');
    this.dashboard = savedForms ? JSON.parse(savedForms) : [];
    if (this.formsListing) {
      this.formsListing.loadStoredData();
    }
  }

  totalForms(): number {
    return this.dashboard.length;
  }
  
}
