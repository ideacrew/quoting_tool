import { Component, OnInit } from '@angular/core';
import carriers from '../../../settings/qdp.json';

@Component({
  selector: 'app-employer-details-dental',
  templateUrl: './employer-details-dental.component.html',
  styleUrls: ['./employer-details-dental.component.css']
})
export class EmployerDetailsDentalComponent implements OnInit {
  public employerDetails: any;
  public effectiveDate: any;
  public erEmployees: any;
  public costShownText: any;
  public carriers = carriers;

  constructor() { }

  ngOnInit() {
    const erDetails = localStorage.getItem('employerDetails');
    this.employerDetails = JSON.parse(erDetails);
    this.erEmployees = this.employerDetails.employees;

    if (this.erEmployees.length > 1) {
      this.costShownText = `${this.erEmployees.length} people`;
    } else {
      this.costShownText = `${this.erEmployees.length} person`;
    }
  }

}
