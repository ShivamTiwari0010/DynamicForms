import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FormStateService {
  private readonly formSubmissions = new BehaviorSubject<{ [key: string]: any[] }>(this.getSavedFormData());

  constructor() {}

  private getSavedFormData(): { [key: string]: any[] } {
    const savedData = localStorage.getItem('savedFormData');
    return savedData ? JSON.parse(savedData) : {};
  }

  getFormSubmissions(formName: string): any[] {
    return this.formSubmissions.value[formName] || [];
  }

  saveFormSubmission(formName: string, formData: any, index: number | null = null) {
    const savedForms = this.getSavedFormData();

    if (!savedForms[formName]) {
        savedForms[formName] = []; 
    }

    if (index !== null && savedForms[formName][index]) {
        savedForms[formName][index] = { ...formData, date: savedForms[formName][index].date };
    } else {
        savedForms[formName].push({ ...formData, date: new Date().toISOString() });
    }
    
    localStorage.setItem('savedFormData', JSON.stringify(savedForms));
    this.formSubmissions.next(savedForms);
}

}
