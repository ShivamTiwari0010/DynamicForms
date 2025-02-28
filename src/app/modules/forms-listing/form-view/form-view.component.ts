import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AddDataInFormComponent } from '../../../shared/popups/add-data-in-form/add-data-in-form.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsDataTable } from '../forms-listing.types';
import { ConfirmationService } from '../../../shared/confirmation/confirmation.service';

@Component({
  selector: 'app-form-view',
  templateUrl: './form-view.component.html',
  styleUrl: './form-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormViewComponent {
  formName: string | null = '';
  formData: any = {};
  isCollapsed: boolean = true; 
  formSubmissions: any[] = []; 
  headers = FormsDataTable;
  constructor(
    private readonly route: ActivatedRoute,
    private readonly modalService: NgbModal,
    private readonly cdRef : ChangeDetectorRef,
    private readonly confirmationService: ConfirmationService,
  ) {}

  ngOnInit(): void {
    this.formName = this.route.snapshot.paramMap.get('formName');
    if (this.formName) {
      this.fetchFormData();
      this.fetchFormSubmissions();
    }
  }

  fetchFormData(): void {
    const savedForms = sessionStorage.getItem('savedForms');
    if (savedForms) {
      const formsList = JSON.parse(savedForms);
      this.formData = formsList.find((form: any) => form.formName === this.formName) || {};
    }
  }

  fetchFormSubmissions(): void {
    const savedSubmissions = sessionStorage.getItem('savedFormData');
    if (savedSubmissions) {
      const allSubmissions = JSON.parse(savedSubmissions);
      if (this.formName) {  
        this.formSubmissions = allSubmissions[this.formName] || [];
      }
    }
  }

  trackHeader(index: number, header: any) {
    return header.name; 
  }

  viewSubmission(index: number) {
    const modalRef = this.modalService.open(AddDataInFormComponent, {
      backdrop: 'static',
      centered: true,
    });
    modalRef.componentInstance.form = this.formData;
    modalRef.componentInstance.submissionData = this.formSubmissions[index]; 
    modalRef.componentInstance.isView = true;
    modalRef.componentInstance.index = index;
    modalRef.componentInstance.formName = this.formName;
    modalRef.result.then(() => {
      this.fetchFormSubmissions();
    }).catch(() => {});
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  addFormData(){
    const modalRef = this.modalService.open(AddDataInFormComponent,{
      backdrop: 'static',
      centered: true,
    });
    modalRef.componentInstance.form = this.formData;

    modalRef.result.then(() => {
      this.fetchFormSubmissions(); 
      this.cdRef.detectChanges(); 
    }).catch(() => {});
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

  confirmAndDelete(index: number): void {
    const modalRef = this.confirmationService.open({
      title: 'Confirm Delete',
      message: `Are you sure you want to delete this form data?`,
      actions: {
        confirm: {
          label: 'Delete ',
          class: 'btn btn-secondary'
        },
      },
    });

    modalRef.then((res: any) => {
      if (res == 'Confirmed') {
        this.deleteFormData(index);
      }
    });
  }

  deleteFormData(index: any) {
    if (this.formName) {
      const savedSubmissions = sessionStorage.getItem('savedFormData');
      
      if (savedSubmissions) {
        let allSubmissions = JSON.parse(savedSubmissions);
  
        if (allSubmissions[this.formName]) {
          allSubmissions[this.formName].splice(index, 1); 
  
          sessionStorage.setItem('savedFormData', JSON.stringify(allSubmissions));
  
          this.fetchFormSubmissions();
          this.cdRef.detectChanges();
        }
      }
    }
  }

  trackByStep(index: number, step: any): string {
    return step.stepName;
  }
  
  trackByField(index: number, field: any): string {
    return field.label;
  }
  

}
