import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDataInFormComponent } from './add-data-in-form.component';

describe('AddDataInFormComponent', () => {
  let component: AddDataInFormComponent;
  let fixture: ComponentFixture<AddDataInFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddDataInFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDataInFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
