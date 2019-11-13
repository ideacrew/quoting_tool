import { Component, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmployerDetailsService } from './../services/employer-details.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { NgbDateStruct, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import zipcodes from '../../data/zipCode.json';
import sics from '../../data/sic.json';
import sicCodes from '../../data/sicCodes.json';
import { SelectedSicService } from '../services/selected-sic.service';

@Component({
  selector: 'app-employer-details',
  templateUrl: './employer-details.component.html',
  styleUrls: ['./employer-details.component.scss'],
  providers: [NgbModal, EmployerDetailsService],
  animations: [
    trigger('fadeInOut', [
      state(
        'void',
        style({
          opacity: 0
        })
      ),
      transition('void <=> *', animate(400))
    ])
  ]
})
export class EmployerDetailsComponent implements OnInit {
  rows = [];
  model: NgbDateStruct;
  date: { months: number; day: number; year: number };
  sicKeyword = 'standardIndustryCodeCode';
  zipKeyword = 'zipCode';
  sics = sics;
  zipcodes = zipcodes;
  availableCounties = zipcodes;
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
  public addNewEmployeeForm: FormGroup;
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
  showNewEmployee = false;

  relationOptions = [
    { key: 'Spouse', value: 'Spouse' },
    { key: 'Domestic Partner', value: 'Domestic Partner' },
    { key: 'Child', value: 'Child' },
    { key: 'Child', value: 'Disabled Child' }
  ];

  config = {
    hasFilter: true,
    decoupleChildFromParent: true
  };

  @ViewChild('file', { static: false }) file: ElementRef;

  @HostListener('window:beforeunload', ['$event']) unloadHandler(event: Event) {
    event.returnValue = false;
  }

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private employerDetailsService: EmployerDetailsService,
    private dpConfig: NgbDatepickerConfig,
    private selectedSicService: SelectedSicService
  ) {
    this.quoteForm = this.fb.group({
      effectiveDate: ['', Validators.required],
      sic: ['', Validators.required],
      zip: ['', Validators.required],
      county: [''],
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

    this.addNewEmployeeForm = this.fb.group({
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
    this.getZipCodes();
    this.selectedSicService.currentMessage.subscribe((message) => this.setSicFromTree(message));
    this.employeeRoster = localStorage.getItem('employerDetails');
    if (this.employeeRoster) {
      this.showEmployeeRoster = true;
      this.employerDetails = JSON.parse(this.employeeRoster);
      this.quoteForm.get('effectiveDate').setValue(new Date(this.employerDetails.effectiveDate));
      this.quoteForm.get('zip').setValue(this.employerDetails.zip);
      this.quoteForm.get('sic').setValue(this.employerDetails.sic.standardIndustryCodeCode);
      this.loadEmployeesFromStorage();
    }
    // Sets effective Date options

    if (this.todaysDate.getDate() > 15) {
      this.effectiveDateOptions = [new Date(this.todaysDate.getFullYear(),
        this.todaysDate.getMonth() + 2, 1), new Date(this.todaysDate.getFullYear(), this.todaysDate.getMonth() + 3, 1)];
    } else {
      this.effectiveDateOptions = [new Date(this.todaysDate.getFullYear(),
        this.todaysDate.getMonth() + 1, 1), new Date(this.todaysDate.getFullYear(), this.todaysDate.getMonth() + 2, 1)];
    }
  }

  getZipCodes() {
    const zipCodes = [];
    zipcodes.map(zipcode => zipCodes.push(zipcode.zipCode));
    this.zipcodes = zipCodes.reduce((unique, item) => (unique.includes(item) ? unique : [...unique, item]), []);
  }

  setCounty(value) {
    this.quoteForm.get('county').setValue(value);
  }

  setSicFromTree(item) {
    if (item !== 'default item') {
      const sicValue = this.sics.filter((sic) => sic['standardIndustryCodeFull'] === item.text)[0][
        'standardIndustryCodeCode'
      ];
      this.quoteForm.get('sic').setValue(sicValue);
      this.show = false;
    }
  }

  isSelected(date) {
    if (this.employerDetails && date.toString() === this.employerDetails.effectiveDate) {
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

  addNewEmployee() {
    this.showNewEmployee = true;
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
        relationship: ['']
      })
    );
  }

  deleteDependent(control, index) {
    control.removeAt(index);
  }

  onSubmit() {
    // console.log(this.quoteForm.value);
  }

  open(content) {
    this.modalService.open(content);
  }

  fileUploaded(fileInfo) {
    const input = new FormData();
    input.append('file', fileInfo.files[0]);
    this.employerDetailsService.postUpload(input).subscribe();
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
      this.counties = this.availableCounties.filter((zipcode) => zipcode.zipCode === event);
      this.quoteForm.get('county').setValue(this.counties[0]);
      this.enableCounty();
    }
    if (event.length === 5 && this.showEmployeeRoster) {
      this.updateFormValue(event, 'zipCode');
    }
  }

  selectEvent(item) {
    this.getCounties(item);
    if (this.showEmployeeRoster) {
      this.updateFormValue(item, 'zipCode');
    }
  }

  updateEffectiveDate(event) {
    if (this.showEmployeeRoster) {
      this.updateFormValue(event, 'effectiveDate');
    }
  }

  updateFormValue(event, type) {
    if (type === 'zipCode') {
      const form = JSON.parse(localStorage.getItem('employerDetails'));
      form.zip = event;
      localStorage.setItem('employerDetails', JSON.stringify(form));
      this.counties = this.availableCounties.filter((zipcode) => zipcode.zipCode === event);
      this.enableCounty();
    }
    if (type === 'effectiveDate') {
      const form = JSON.parse(localStorage.getItem('employerDetails'));
      form.effectiveDate = event;
      localStorage.setItem('employerDetails', JSON.stringify(form));
    }
  }

  getCounties(item) {
    this.counties = this.availableCounties.filter((zipcode) => zipcode.zipCode === item);
    if (this.showEmployeeRoster) {
      const form = JSON.parse(localStorage.getItem('employerDetails'));
      if (this.counties.length === 1) {
        form.county = this.counties[0];
        localStorage.setItem('employerDetails', JSON.stringify(form));
        this.quoteForm.get('county').setValue(form.county.county);
      }
    }
    this.enableCounty();
  }

  updateCounty(event) {
    const form = JSON.parse(localStorage.getItem('employerDetails'));
    const selectedCounty = this.availableCounties.filter((c) => c.county === event.target.value && c.zipCode === form.zip);
    form.county = selectedCounty[0];
    localStorage.setItem('employerDetails', JSON.stringify(form));
  }

  enableCounty() {
    const countyField = document.getElementById('countyField');
    if (this.counties.length === 1) {
      this.defaultSelect = true;
    }

    if (this.counties.length > 1) {
      countyField.removeAttribute('disabled');
    } else {
      countyField.setAttribute('disabled', 'true');
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
              relationship: [relationship]
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

  saveNewEmployee() {
    const form = this.employerDetails;
    const employees = form.employees;
    const newEmployee = this.addNewEmployeeForm.value;
    employees.push(newEmployee);
    localStorage.setItem('employerDetails', JSON.stringify(form));
    this.rows = employees;
    this.showNewEmployee = false;
    this.addNewEmployeeForm.reset();
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
          relationship: [dependent.relationship]
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
