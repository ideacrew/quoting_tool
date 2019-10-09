import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmployerDetailsService } from './../services/employer-details.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { NgbDateStruct, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import zipcodes from '../../data/zipcode.json';
import sics from '../../data/sic.json';
import sicCodes from '../../data/sicCodes.json';
import { SelectedSicService } from '../services/selected-sic.service';

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
  rows = [];
  model: NgbDateStruct;
  date: { months: number, day: number, year: number };
  sicKeyword = 'standardIndustryCodeCode';
  zipKeyword = 'zipCode';
  sics = sics;
  zipcodes = zipcodes;
  defaultSelect: boolean;
  uploadData: any;
  employee: any;
  employeeIndex: any;
  employerDetails: any;
  showEditHousehold: any;
  sicCodes = sicCodes;

  public counties: any;
  public quoteForm: FormGroup;
  public editEmployeeForm: FormGroup;
  public editEmployeeIndex: any;
  public showEmployeeRoster = false;
  public showHouseholds = true;
  public employeeRoster: any;
  public employees: any;
  public effectiveDateOptions: any;
  public months: any;
  public todaysDate = new Date();
  public employeeRosterDetails: any;
  public show: boolean;

  relationOptions = [
    { key: 'spouse', value: 'Spouse' },
    { key: 'domestic partner', value: 'Domestic Partner' },
    { key: 'child', value: 'Child' },
    { key: 'disabled child', value: 'Disabled Child' },
  ];

  config = {
    hasFilter: true,
    decoupleChildFromParent: true
  };

  @ViewChild('file', { static: false }) file: ElementRef;

  constructor(private fb: FormBuilder, private modalService: NgbModal, private employerDetailsService: EmployerDetailsService,
    private dpConfig: NgbDatepickerConfig, private selectedSicService: SelectedSicService) {

    this.quoteForm = this.fb.group({
      effectiveDate: ['', Validators.required],
      sic: ['', Validators.required],
      zip: ['', Validators.required],
      county: [{ value: '', disabled: true }],
      employees: this.fb.array([], Validators.required)
    });

    this.showEditHousehold = false;

    this.editEmployeeForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      dob: ['', Validators.required],
      coverageKind: ['', Validators.required],
      dependents: this.fb.array([])
    });

    this.months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];

    this.employeeRosterDetails = [
      'Name',
      'Date of Birth',
      'Dependent Name(s), if any',
      'Dependent Relationship(s)',
      'Dependent Date of Birth(s)'
    ];

    const year = new Date().getFullYear();

    this.dpConfig.minDate = { year: year - 110, month: 1, day: 1 };
    this.dpConfig.maxDate = { year: year + 1, month: 12, day: 31 };
  }

  ngOnInit() {
    this.selectedSicService.currentMessage.subscribe(message => this.setSicFromTree(message));
    this.employeeRoster = localStorage.getItem('employerDetails');
    if (this.employeeRoster) {
      this.showEmployeeRoster = true;
      this.employerDetails = JSON.parse(this.employeeRoster);
      this.quoteForm.get('effectiveDate').setValue(new Date(Date.parse(this.employerDetails.effectiveDate)));
      this.quoteForm.get('zip').setValue(this.employerDetails.zip.zipCode);
      this.loadEmployeesFromStorage();
    }
    // Sets effective Date options
    if (this.todaysDate.getMonth() + 1 > 11) {
      // Add next year date if next month is January
      this.effectiveDateOptions = [
        { month: -1, value: 'SELECT START ON', disabled: true },
        { month: this.todaysDate.getMonth(), value: `${this.months[this.todaysDate.getMonth()]} ${this.todaysDate.getFullYear()}` },
        { month: 0, value: `${this.months[0]} ${this.todaysDate.getFullYear() + 1}` },
      ];
    } else {
      this.effectiveDateOptions = [
        { month: -1, value: 'SELECT START ON', disabled: true },
        { month: this.todaysDate.getMonth(), value: `${this.months[this.todaysDate.getMonth()]} ${this.todaysDate.getFullYear()}` },
        { month: this.todaysDate.getMonth() + 1, value: `${this.months[this.todaysDate.getMonth() + 1]} ${this.todaysDate.getFullYear()}` }
      ];
    }
  }

  setSicFromTree(item) {
    if (item !== 'default item') {
      const sicValue = this.sics.filter(sic => sic['standardIndustryCodeFull'] === item.text)[0]['standardIndustryCodeCode'];
      this.quoteForm.get('sic').setValue(sicValue);
      this.show = false;
    }
  }

  isSelected(date) {
    if (this.employerDetails && date.value === this.employerDetails.effectiveDate) {
      return true;
    } else {
      return false;
    }
  }

  checkFilePresence(file) {
    if (file.files.length) {
      document.getElementById('file-upload-btn').removeAttribute('disabled');
    }
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

    const input = new FormData();
    input.append('file', fileInfo.files[0]);
    this.employerDetailsService.postUpload(input)
      .subscribe();
    // Below is used to display in the UI
    const reader = new FileReader();
    const csvData = [];
    this.uploadData = csvData;
    reader.readAsBinaryString(fileInfo.files[0]);
    reader.onload = function() {
      csvData.push(reader.result);
    };
    setTimeout(() => {
      this.parseResults(this.uploadData[0]);
    }, 800);
  }

  zipChangeSearch(event) {
    if (event.length === 5) {
      this.counties = zipcodes.filter(zipcode => zipcode.zipCode === event);
      this.enableCounty();
    }
  }

  selectEvent(item) {
    this.getCounties(item);
  }

  getCounties(item) {
    this.counties = zipcodes.filter(zipcode => zipcode.zipCode === item.zipCode);
    this.enableCounty();
  }

  enableCounty() {
    const countyField = document.getElementById('countyField');
    if (this.counties.length === 1) {
      this.defaultSelect = true;
    }

    if (this.counties.length > 1) {
      countyField.removeAttribute('disabled');
    }
  }

  onChangeSearch() {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  saveEmployerDetails(form) {
    localStorage.setItem('employerDetails', form);
  }

  onFocused(event) {
    console.log(event);
    // do something when input is focused
  }

  parseResults(data) {
    this.modalService.dismissAll();
    const rows = data.split(/\r\n|\n/);
    let count = 0;
    rows.map((row, index) => {
      const control = <FormArray>this.quoteForm.controls.employees;
      // ignore the header row
      if (index > 0) {
        const firstName = row.split(',')[0];
        const lastName = row.split(',')[1];
        const dobValues = row.split(',')[2].split('/');
        const relationship = row.split(',')[3];
        // create employees from csv
        if (relationship === 'employee') {
          this.employee = row;
          count++;
          control.push(
            this.fb.group({
              firstName: [firstName],
              lastName: [lastName],
              dob: [this.formatDOB(dobValues)],
              coverageKind: ['both'],
              dependents: this.fb.array([])
            })
          );
        } else {
          // Add dependents to employee if dependents
          control['controls'][count - 1]['controls']['dependents'].push(
            this.fb.group({
              firstName: [firstName],
              lastName: [lastName],
              dob: [this.formatDOB(dobValues)],
              relationship: [relationship],
            })
          );
        }
      }
    });
  }

  createRoster() {
    // Adds the uploaded roster to localStorage
    localStorage.setItem('employerDetails', JSON.stringify(this.quoteForm.value));
    this.showHouseholds = false;
    this.ngOnInit();
  }

  resetForm() {
    // Removes the roster from localStorage
    localStorage.removeItem('employerDetails');
    this.showEmployeeRoster = false;
    this.quoteForm.reset();
  }

  loadEmployeesFromStorage() {
    // Loads the roster from localStorage if present
    const roster = JSON.parse(this.employeeRoster);
    this.employees = roster;
    this.rows = roster.employees;
  }

  removeEmployeeFromRoster(rowIndex) {
    this.rows.splice(rowIndex, 1);
    this.employerDetails.employees.splice(rowIndex, 1);
    localStorage.setItem('employerDetails', JSON.stringify(this.employerDetails));
  }

  editEmployee(rowIndex) {
    this.editEmployeeIndex = rowIndex;
    this.showEditHousehold = true;
    const employee = this.rows[rowIndex];
    const employeeForm = this.editEmployeeForm;
    const currentContext = this;
    employeeForm.patchValue({
      firstName: employee.firstName,
      lastName: employee.lastName,
      dob: new Date(Date.parse(employee.dob)),
      coverageKind: employee.coverageKind
    });
    employeeForm.controls.dependents = this.fb.array([]);
    employee.dependents.forEach(function(dependent) {
      (<FormArray>employeeForm.controls.dependents).push(
        currentContext.fb.group({
          firstName: [dependent.firstName],
          lastName: [dependent.lastName],
          dob: [new Date(Date.parse(dependent.dob)), Validators.required],
          relationship: [dependent.relationship],
        })
      );
    });
  }

  updateEmployee() {
    this.showEditHousehold = false;
    this.rows[this.editEmployeeIndex] = this.editEmployeeForm.value;
    this.rows = [...this.rows];
    this.employerDetails.employees[this.editEmployeeIndex] = this.editEmployeeForm.value;
    localStorage.setItem('employerDetails', JSON.stringify(this.employerDetails));
    this.editEmployeeIndex = null;
  }

  formatDOB(value) {
    // Formats dob to valid format for datepicker
    return new Date(parseInt(value[2], 0), parseInt(value[0], 0), parseInt(value[1], 0));
  }
}
