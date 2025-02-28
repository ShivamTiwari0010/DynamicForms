import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-save-user',
  templateUrl: './save-user.component.html',
  styleUrl: './save-user.component.scss'
})
export class SaveUserComponent {
  saveUser: FormGroup;

  constructor(
    public readonly activeModal: NgbActiveModal,
    private readonly fb: FormBuilder,
  ) {
    this.saveUser = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  get f() {
    return this.saveUser.controls;
  }

  close() {
    this.activeModal.close();
  }

  saveUserName() {
    if (this.saveUser.valid) {
      const userName = this.saveUser.value.userName.trim();
      sessionStorage.setItem('currentUser', userName);
      this.activeModal.close();
    } else {
      this.saveUser.markAllAsTouched(); 
    }
  }
}
