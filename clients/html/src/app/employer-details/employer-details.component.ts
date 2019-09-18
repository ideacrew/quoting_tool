import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmployerDetailsService } from './../services/employer-details.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-employer-details',
  templateUrl: './employer-details.component.html',
  styleUrls: ['./employer-details.component.css'],
  providers: [NgbModal, EmployerDetailsService],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate(400)),
    ])
  ]
})
export class EmployerDetailsComponent implements OnInit {
  public quoteForm: FormGroup;
  @ViewChild('censusDatatable', { static: false }) censusDatatable: any;

  model: NgbDateStruct;
  date: {month: number, day: number, year: number};

  constructor(private fb: FormBuilder, private modalService: NgbModal, private employerDetailsService: EmployerDetailsService,
    private calendar: NgbCalendar) {
    this.quoteForm = this.fb.group({
      effectiveDate: ['', Validators.required],
      sic: ['', Validators.required],
      zip: ['', Validators.required],
      county: [{value: '', disabled: true}],
      employees: this.fb.array([])
    });
  }

  ngOnInit() {
    this.addEmployee();
  }

  addEmployee() {
    const control = <FormArray>this.quoteForm.controls.employees;
    control.push(
      this.fb.group({
        firstName: [''],
        lastName: [''],
        dob: ['', Validators.required],
        coverageKind: [''],
        dependents: this.fb.array([])
      })
    );
  }

  deleteEmployee(index) {
    const control = <FormArray>this.quoteForm.controls.employees;
    control.removeAt(index);
  }

  addDependent(control) {
    control.push(
      this.fb.group({
        firstName: [''],
        lastName: [''],
        dob: ['', Validators.required],
        relationship: [''],
      })
    );
  }

  deleteDependent(control, index) {
    control.removeAt(index);
  }

  onSubmit() {
    console.log(this.quoteForm.value);
  }

  open(content) {
    this.modalService.open(content);
  }

  fileUploaded(fileInfo) {
    let input = new FormData();
    input.append('file', fileInfo.files[0]);

    this.employerDetailsService.postUpload(input)
      .subscribe(
        data => {
          this.censusDatatable.rows = data['census_records'];
          this.modalService.dismissAll();
        }
      );  
  }
}
