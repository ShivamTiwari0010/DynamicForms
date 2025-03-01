import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormStateService } from '../../../services/form-state.service';
import { ConfirmationService } from '../../confirmation/confirmation.service';
import { ToasterService } from '../../toaster/toaster.service';

@Component({
  selector: 'app-add-data-in-form',
  templateUrl: './add-data-in-form.component.html',
  styleUrl: './add-data-in-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddDataInFormComponent {
  @Input() form: any = {};
  @Input() submissionData: any = null;
  @Input() isView: boolean = false;
  @Input() index: number = -1;
  @Input() formName: string = '';
  isEdit : boolean = false
  formGroup!: FormGroup;
  stepNumber: number = 1;
  submissionIndex: number | null = null; 
  charCounts: { [key: string]: number } = {};

  constructor(
    private readonly fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private readonly formStateService: FormStateService,
    private readonly confirmationService: ConfirmationService,
    private readonly toasterService: ToasterService,
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    
    if (this.submissionData) {
      this.patchFormData();
    }
  }

  initializeForm() {
    this.formGroup = this.fb.group({
      stepFields: this.fb.array(
        this.form.stepFields?.map((step: any) => this.createStep(step)) || []
      ),
    });
  }

  createStep(step: any): FormGroup {
    return this.fb.group({
      stepName: [step.stepName || '', Validators.required],
      fields: this.fb.array(
        step.fields.map((field: any) => this.createField(field))
      ),
    });
  }

  createField(field: any): FormGroup {
    return this.fb.group({
        label: [field.label || '', Validators.required],
        type: [field.type || '', Validators.required],
        value: new FormControl('', field.required ? Validators.required : []),
        required: [field.required || false],
        options: [field.options || ''],
        selectionType: [field.selectionType || 'single']  
    });
  }

  patchFormData(): void {
    if (this.submissionData) {
      this.formGroup.patchValue(this.submissionData);
      this.submissionIndex = this.formStateService.getFormSubmissions(this.form.formName)
        .findIndex((submission) => submission === this.submissionData);
    } else {
      this.submissionIndex = -1;
    }
  }

  get stepFields(): FormArray {
    return this.formGroup.get('stepFields') as FormArray;
  }

  getFields(stepIndex: number): FormArray {
    return this.stepFields.at(stepIndex).get('fields') as FormArray;
  }

  getFieldGroup(stepIndex: number, fieldIndex: number): FormGroup {
    return this.getFields(stepIndex).at(fieldIndex) as FormGroup;
  }

  nextStep(): void {
    if (this.stepNumber < this.stepFields.length) {
      this.stepNumber++;
    }
  }

  prevStep(): void {
    if (this.stepNumber > 1) {
      this.stepNumber--;
    }
  }

  editForm(): void {
    this.isView = false;
    this.isEdit = true;

    this.patchFormData();

    setTimeout(() => {
      this.stepFields.controls.forEach((step, stepIndex) => {
          const fields = (step.get('fields') as FormArray).controls;
          fields.forEach((field, fieldIndex) => {
              const fieldType = field.get('type')?.value;
              const textareaSelector = `textarea[data-index="${stepIndex}-${fieldIndex}"]`;

              if (fieldType === 'text' || fieldType === 'email') {
                  const textarea = document.querySelector(textareaSelector) as HTMLTextAreaElement;
                  if (textarea) {
                      this.adjustHeight(textarea, field as FormGroup, fieldType === 'text' ? 150 : 320);
                  }
              }
          });
      });
    }, 100);
  }

  updateCheckboxSelection(field: any, option: string, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    const currentValues = field.get('value')?.value || [];

    if (field.get('selectionType')?.value === 'multi') {
        if (isChecked) {
            field.patchValue({ value: [...currentValues, option] });
        } else {
            field.patchValue({ value: currentValues.filter((val: string) => val !== option) });
        }
    } else {
        field.patchValue({ value: isChecked ? [option] : [] });
    }
  }

  updateDateValue(field: FormGroup): void {
    const dateValue = field.get('value')?.value;

    if (dateValue && dateValue.length === 8) {
        const formattedDate = dateValue.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3');
        field.patchValue({ value: formattedDate });
    }
  }

  confirmAndClose(close: boolean = false) {
    this.activeModal.update({ windowClass: 'hideOther' });

    if (close) {
      this.activeModal.close('refresh');
    } else {
      const message = this.isEdit 
        ? 'Changes will not be saved.' 
        : 'All progress will be lost.';
      const modalRef = this.confirmationService.open({
        title: 'Confirm Close',
        backdrop: false,
        message: message,
        actions: {
          confirm: {
            label: 'close',
            class: 'btn btn-secondary'
          }
        }
      });

      modalRef.then((res: any) => {
        if (res == 'Confirmed') {
          this.activeModal.close('cancelled');
        } else {
          this.activeModal.update({ windowClass: '' });
        }
      });
    }
  }

  close() {
    this.activeModal.close();
  }

  saveForm(): void {
    if (this.formGroup.valid) {
      const formDataWithDate = {
        ...this.formGroup.value,
        date: new Date().toISOString(),
      };
  
      const formName = this.form?.formName || this.formName;
  
      if (!formName) {
        this.toasterService.showToaster('error', "Form name is missing!");
        return;
      }
  
      this.formStateService.saveFormSubmission(formName, formDataWithDate, this.index);
      this.activeModal.close();
    } else {
      this.toasterService.showToaster('warn', 'Please fill all required fields before saving.');
    }
  }

  isSaveDisabled(): boolean {
    let allFields = this.stepFields.controls.flatMap(step => 
        (step.get('fields') as FormArray).controls
    );

    let mandatoryFieldsUnfilled = allFields.some(field => 
        field.get('required')?.value && field.get('value')?.invalid
    );

    let atLeastOneFieldFilled = allFields.some(field => 
        field.get('value')?.value?.trim()
    );

    return mandatoryFieldsUnfilled || (!atLeastOneFieldFilled && !mandatoryFieldsUnfilled);
  }

  trackByStep(index: number, step: any): number {
    return index; 
  }
  
  trackByField(index: number, field: any): number {
    return index; 
  }
  
  trackByOption(index: number, option: string): string {
    return option; 
  }
  
  updateTextField(field: FormGroup, stepIndex: number, fieldIndex: number): void {
    const key = `step-${stepIndex}-field-${fieldIndex}`; 
    this.charCounts[key] = field.get('value')?.value?.length || 0;

    const textarea = document.querySelector(`textarea[data-index="${stepIndex}-${fieldIndex}"]`) as HTMLTextAreaElement;
    if (textarea) {
        this.adjustHeight(textarea, field, 150);
    }
}

updateEmailField(field: FormGroup, stepIndex: number, fieldIndex: number): void {
    const key = `step-${stepIndex}-field-${fieldIndex}`; 
    this.charCounts[key] = field.get('value')?.value?.length || 0;

    const textarea = document.querySelector(`textarea[data-index="${stepIndex}-${fieldIndex}"]`) as HTMLTextAreaElement;
    if (textarea) {
        this.adjustHeight(textarea, field, 320);
    }
}

private adjustHeight(textarea: HTMLTextAreaElement, field: FormGroup, maxLength: number): void {
  textarea.style.height = "40px"; 
  textarea.style.height = textarea.scrollHeight + "px"; 

  let fieldValue = field.get('value')?.value || '';
  if (fieldValue.length > maxLength) {
      field.patchValue({ value: fieldValue.substring(0, maxLength) });
  }
}

}
