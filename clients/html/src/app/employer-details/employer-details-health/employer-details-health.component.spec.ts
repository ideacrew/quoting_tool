import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployerDetailsHealthComponent } from './employer-details-health.component';

describe('EmployerDetailsHealthComponent', () => {
  let component: EmployerDetailsHealthComponent;
  let fixture: ComponentFixture<EmployerDetailsHealthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployerDetailsHealthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployerDetailsHealthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
