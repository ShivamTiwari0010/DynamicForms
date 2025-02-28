import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsTable } from '../forms-listing.types';
import { ConfirmationService } from '../../../shared/confirmation/confirmation.service';
import { AddNewFormComponent } from '../../../shared/popups/add-new-form/add-new-form.component';

@Component({
  selector: 'app-forms-listing',
  templateUrl: './forms-listing.component.html',
  styleUrl: './forms-listing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormsListingComponent {
  @Input() forms: any[] = [];
  @Input() isFromDashboard = false;
  @Output() formDeleted = new EventEmitter<void>();
  formListingData: any = {};
  filteredForms: any[] = [];
  headers = FormsTable;
  reqData = {
    FormName: '',
  };
  constructor(
    private readonly modalService: NgbModal,
    private readonly confirmationService: ConfirmationService,
    private readonly cdRef : ChangeDetectorRef
  ){
    this.loadStoredData();
    this.totalRecords();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['forms']) {
      this.loadStoredData();
    }
  }

  public loadStoredData() {
    const savedForms = sessionStorage.getItem('savedForms');
    this.formListingData = savedForms ? JSON.parse(savedForms) : [];
    this.filteredForms = [...this.formListingData];
  }

  totalRecords(): number {
    return this.filteredForms.length;
  }

  searchForm() {
    const searchValue = this.reqData.FormName.trim().toLowerCase();
    
    if (searchValue) {
      this.filteredForms = this.formListingData.filter((form: { formName: string }) =>
        form.formName.toLowerCase().includes(searchValue)
      );
    } else {
      this.filteredForms = [...this.formListingData];
    }
    
  }

  trackForm(index: number, form: any) {
    return form.formName; 
  }

  trackHeader(index: number, header: any) {
    return header.name; 
  }

  confirmAndDelete(form: any): void {
    const modalRef = this.confirmationService.open({
      title: 'Confirm Delete',
      message: `Are you sure you want to delete ${form.formName} (${form.stepsCount} ${form.stepsCount > 1 ? 'steps' : 'step'})? This will also delete submitted forms.`,
      actions: {
        confirm: {
          label: 'Delete ',
          class: 'btn btn-secondary'
        },
      },
    });

    modalRef.then((res: any) => {
      if (res == 'Confirmed') {
        this.deleteForm(form);
      }
    });
  }

  deleteForm(form: any) {
    this.formListingData = this.formListingData.filter((f: { formName: string }) => f.formName !== form.formName);
    sessionStorage.setItem('savedForms', JSON.stringify(this.formListingData));

    const savedSubmissions = sessionStorage.getItem('savedFormData');
    if (savedSubmissions) {
        let allSubmissions = JSON.parse(savedSubmissions);
        delete allSubmissions[form.formName]; 
        sessionStorage.setItem('savedFormData', JSON.stringify(allSubmissions));
    }

    this.loadStoredData();
    this.cdRef.detectChanges();
    this.formDeleted.emit();
}
  

  addNewForm(){
    const modalRef = this.modalService.open(AddNewFormComponent,{
      backdrop: 'static',
      centered: true,
      size: 'lg'
    });
    modalRef.result.then(
    () => {
      this.loadStoredData(); 
      this.cdRef.detectChanges();
    },
    () => {
      this.loadStoredData();
      this.cdRef.detectChanges(); 
    }
    );
  }

}
