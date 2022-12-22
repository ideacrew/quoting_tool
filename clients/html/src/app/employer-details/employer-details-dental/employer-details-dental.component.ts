import { Component, OnInit } from '@angular/core';
import carriers from '../../../data/qdp.json';
import { Router } from '@angular/router';

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

<<<<<<< Updated upstream
=======
  isBenefitModelEnabled: boolean;
  isFindMyDoctorEnabled: boolean;

>>>>>>> Stashed changes
  constructor(private router: Router) {}

  ngOnInit() {
    const erDetails = localStorage.getItem('employerDetails');
    this.employerDetails = JSON.parse(erDetails);
<<<<<<< Updated upstream
=======
    this.isBenefitModelEnabled = JSON.parse(localStorage.getItem('is_benefit_model_enabled'));
    this.isFindMyDoctorEnabled = JSON.parse(localStorage.getItem('is_find_my_doctor_enabled'));
>>>>>>> Stashed changes

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
