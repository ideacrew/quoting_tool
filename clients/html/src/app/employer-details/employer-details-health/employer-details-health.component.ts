import { Component, OnInit } from '@angular/core';
import carriers from '../../../data/qhp.json';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employer-details-health',
  templateUrl: './employer-details-health.component.html',
  styleUrls: ['./employer-details-health.component.css']
})
export class EmployerDetailsHealthComponent implements OnInit {
  public employerDetails: any;
  public effectiveDate: any;
  public erEmployees: any;
  public costShownText: any;
  public carriers = carriers;

  isMAState: boolean;

  constructor(private router: Router) {}

  ngOnInit() {
    const erDetails = localStorage.getItem('employerDetails');
    this.employerDetails = JSON.parse(erDetails);
    this.isMAState = localStorage.getItem('state') == "MA";

    if (this.employerDetails) {
      this.erEmployees = this.employerDetails.employees;

      if (this.erEmployees.length > 1) {
        this.costShownText = `${this.erEmployees.length} people`;
      } else {
        this.costShownText = `${this.erEmployees.length} person`;
      }
    } else {
      this.router.navigate(['/']);
    }
  }
}
