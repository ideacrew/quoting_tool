import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployerDetailsDentalComponent } from './employer-details-dental.component';

describe('EmployerDetailsDentalComponent', () => {
  let component: EmployerDetailsDentalComponent;
  let fixture: ComponentFixture<EmployerDetailsDentalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployerDetailsDentalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployerDetailsDentalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
