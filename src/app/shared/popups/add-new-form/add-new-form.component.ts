import { Component, EventEmitter, Output, ChangeDetectionStrategy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationService } from '../../../shared/confirmation/confirmation.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FieldType } from '../../../constants/enums';
import { ToasterService } from '../../toaster/toaster.service';

@Component({
  selector: 'app-add-new-form',
  templateUrl: './add-new-form.component.html',
  styleUrls: ['./add-new-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddNewFormComponent {
  @Output() formAdded = new EventEmitter<void>();
  stepNumber: number = 1;
  disableNext: boolean = true;
  createNewForm: FormGroup;
  previousStepCount: number | null = null;
  fieldTypes = Object.values(FieldType);
  isSaveDisabled: boolean = true;
  constructor(
    public readonly activeModal: NgbActiveModal,
    private readonly fb: FormBuilder,
    private readonly confirmationService: ConfirmationService,
    private readonly toasterService: ToasterService
  ) {
    this.createNewForm = this.fb.group({
      formName: ['', Validators.required],
      stepsCount: ['', [Validators.required, Validators.min(1)]],
      stepFields: this.fb.array([])
    });
  }

  ngOnInit() {
    this.createNewForm.valueChanges.subscribe(() => {
      this.checkSaveButtonState();
    });
  }

  checkSaveButtonState() {
    this.isSaveDisabled =
      this.stepNumber !== 2 ||
      this.createNewForm.invalid ||
      this.areStepsIncomplete() ||
      this.areStepsEmpty();
  }

  areStepsEmpty(): boolean {
    return this.stepFields.controls.some(step => {
      const fieldsArray = step.get('fields') as FormArray;
      return fieldsArray.length === 0 || fieldsArray.controls.every(field => {
        return !field.get('label')?.value?.trim() || !field.get('type')?.value?.trim();
      });
    });
  }

  previousStep() {
    if (this.stepNumber > 1) {
      this.stepNumber -= 1;
    }
    this.triggerValidationCheck();
  }

  triggerValidationCheck() {
    const { practiceName } = this.createNewForm.value;
    this.createNewForm.patchValue({
      practiceName: practiceName?.trim()
    });
  }

  confirmAndClose(close: boolean = false) {
    this.activeModal.update({ windowClass: 'hideOther' });

    if (close) {
      this.activeModal.close('refresh');
    } else {
      const modalRef = this.confirmationService.open({
        title: 'Confirm Close',
        backdrop: false,
        message: 'All progress will be lost.',
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

  get f() {
    return this.createNewForm.controls;
  }

  get stepFields(): FormArray {
    return this.createNewForm.get('stepFields') as FormArray;
  }

  getStepFields(stepIndex: number): FormArray {
    return this.stepFields.at(stepIndex).get('fields') as FormArray;
  }

  popupTitle() {
    if (this.stepNumber == 1) {
      return "ADD NEW FORM";
    } else {
      return "ADD STEPS & FIELDS";
    }
  }

  nextStep() {
    if (this.stepNumber === 1 && this.createNewForm.valid) {
      const currentStepCount = this.createNewForm.value.stepsCount;

      if (this.previousStepCount !== currentStepCount) {
        this.createStepForms(currentStepCount);
        this.previousStepCount = currentStepCount;
      }

      this.stepNumber++;
    }
  }

  prevStep() {
    if (this.stepNumber > 1) {
      this.removeEmptyFields();
      this.stepNumber--;
      this.checkSaveButtonState();
    }
  }

  removeEmptyFields() {
    for (let i = 0; i < this.stepFields.length; i++) {
      const fieldsArray = this.getStepFields(i);
      for (let j = fieldsArray.length - 1; j >= 0; j--) {
        const field = fieldsArray.at(j);
        if (!field.get('label')?.value?.trim() || !field.get('type')?.value?.trim()) {
          fieldsArray.removeAt(j);
        }
      }
    }
  }

  createStepForms(stepCount: number) {
    this.stepFields.clear();
    for (let i = 1; i <= stepCount; i++) {
      this.stepFields.push(
        this.fb.group({
          stepName: [`Step ${i}`, Validators.required],
          fields: this.fb.array([])
        })
      );
    }
  }

  addField(stepIndex: number) {
    const fieldsArray = this.getStepFields(stepIndex);
    fieldsArray.push(
      this.fb.group({
        label: ['', Validators.required],
        type: ['', Validators.required],
        required: [false],
        options: [''],
        selectionType: ['']
      })
    );
  }

  removeField(stepIndex: number, fieldIndex: number) {
    this.getStepFields(stepIndex).removeAt(fieldIndex);
  }

  saveFormConfig() {
    const formConfig = this.createNewForm.value;
    let savedForms = JSON.parse(localStorage.getItem('savedForms') ?? '[]');

    const isDuplicate = savedForms.some((form: any) => form.formName.trim().toLowerCase() === formConfig.formName.trim().toLowerCase());

    if (isDuplicate) {
        this.toasterService.showToaster('warn', 'A form with this name already exists. Please choose a different name.');
        return;
    }

    savedForms.push(formConfig);
    localStorage.setItem('savedForms', JSON.stringify(savedForms));
    
    this.stepNumber = 3;
    this.formAdded.emit();
    this.toasterService.showToaster('success', 'Form saved successfully!');
  }

  clearStepFields() {
    this.stepFields.clear();
  }  
  
  handleFieldTypeChange(stepIndex: number, fieldIndex: number) {
    const field = this.getStepFields(stepIndex).at(fieldIndex);
    const fieldType = field.get('type')?.value;
  
    if (['radio', 'checkbox', 'dropdown'].includes(fieldType)) {
      field.get('options')?.setValidators([Validators.required]);
      field.get('options')?.updateValueAndValidity();
    } else {
      field.get('options')?.clearValidators();
      field.get('options')?.updateValueAndValidity();
    }
  
    if (fieldType !== 'checkbox') {
      field.get('selectionType')?.setValue('');
    }
  }
  
  areStepsIncomplete(): boolean {
    return this.stepFields.controls.some(step => {
      if (!step.get('stepName')?.valid) return true;
      
      const fieldsArray = step.get('fields') as FormArray;
      return fieldsArray.controls.some(field => {
        const fieldType = field.get('type')?.value;
        const optionsRequired = ['radio', 'checkbox', 'dropdown'].includes(fieldType);
  
        return (
          !field.get('label')?.valid ||
          !field.get('type')?.valid ||
          (optionsRequired && !field.get('options')?.value?.trim())
        );
      });
    });
  }

  trackByStep(index: number, step: any): number {
    return step.stepName; 
  }
  
  trackByField(index: number, field: any): number {
    return field.label; 
  }
}