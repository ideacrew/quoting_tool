import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownTreeviewSelectComponent } from './dropdown-treeview-select.component';
import { SelectedSicService } from '../services/selected-sic.service';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('DropdownTreeviewSelectComponent', () => {
  let component: DropdownTreeviewSelectComponent;
  let fixture: ComponentFixture<DropdownTreeviewSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DropdownTreeviewSelectComponent],
      imports: [FormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownTreeviewSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
