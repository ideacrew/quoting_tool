import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import tooltips from '../../../configurations/tooltips.json';

@Component({
  selector: 'app-employer-details-health',
  templateUrl: './employer-details-health.component.html',
  styleUrls: ['./employer-details-health.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate(400)),
    ])
  ]
})
export class EmployerDetailsHealthComponent implements OnInit {
  public employerDetails: any;
  public effectiveDate: any;
  public erEmployees: any;
  public costShownText: any;
  public tooltips = tooltips;
  public isCollapsed: any;

  public planOptions = [
    {key: 'one_carrier', value: 'One Carrier'},
    {key: 'one_level', value: 'One Level'},
    {key: 'one_plan', value: 'One Plan'}
  ];

  public metalLevelOptions = [
    {key: 'platinum', value: 'Platinum'},
    {key: 'gold', value: 'Gold'},
    {key: 'silver', value: 'Silver'},
    {key: 'bronze', value: 'Bronze'},
  ];

  public planTypes = [
    {key: 'hmo', value: 'HMO'},
    {key: 'hsa', value: 'HSA'}
  ];

  public carriers = [
    {key: 'tufts', value: 'Tufts'},
    {key: 'allways', value: 'Allways'},
    {key: 'fallon', value: 'Fallon'},
    {key: 'harvard_pilgram', value: 'Harvard Pilgram'}
  ];

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
