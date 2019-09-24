import { Component, OnInit, Input } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import tooltips from '../../settings/tooltips.json';

@Component({
  selector: 'app-plan-filter',
  templateUrl: './plan-filter.component.html',
  styleUrls: ['./plan-filter.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate(400)),
    ])
  ]
})
export class PlanFilterComponent implements OnInit {
  public tooltips = tooltips;
  public isCollapsed: any;
  public metalLevelOptions: any;
  public carriers: any;
  public products: any;
  public filteredCarriers: any;
  public employerDetails: any;
  public effectiveDate: any;
  public erEmployees: any;
  public costShownText: any;

  public planOptions = [
    {key: 'one_carrier', value: 'One Carrier'},
    {key: 'one_level', value: 'One Level'},
    {key: 'one_plan', value: 'One Plan'}
  ];

  @Input() carrierPlans: any;

  constructor() { }

  ngOnInit() {
    this.metalLevelOptions = this.carrierPlans.map(plan => {
      if (plan['Metal Level']) {
        return plan['Metal Level'];
      } else {
        return plan['Coverage Level'];
      }
    })
      .reduce((unique, item) =>
        unique.includes(item) ? unique : [...unique, item], []);

    this.carriers = this.carrierPlans.map(plan => plan['Carrier'])
      .reduce((unique, item) =>
        unique.includes(item) ? unique : [...unique, item], []);

    this.products = this.carrierPlans.map(plan => plan['Product'])
      .reduce((unique, item) =>
        unique.includes(item) ? unique : [...unique, item], []);

    this.filteredCarriers = this.carrierPlans;

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
