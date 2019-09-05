import { Component, AfterViewInit } from '@angular/core';
import { NgbProgressbarConfig } from '@ng-bootstrap/ng-bootstrap';

import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

@Component({
  templateUrl: './dashboard3.component.html',
  styleUrls: ['./dashboard3.component.css']
})
export class Dashboard3Component implements AfterViewInit {
	
	public config: PerfectScrollbarConfigInterface = {};

  subtitle: string;
  constructor() {
    this.subtitle = 'This is some text within a card block.';
  }
  // This is for the dashboar line chart
  // lineChart
  public lineChartData: Array<any> = [
    { data: [0, 2, 3, 0, 13, 1, 4, 1], label: 'Product A' },
    { data: [0, 4, 0, 4, 0, 4, 0, 4], label: 'Product B' }
  ];
  public lineChartLabels: Array<any> = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July'
  ];
  public lineChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false
  };
  public lineChartColors: Array<any> = [
    {
      // grey
      backgroundColor: 'rgba(0,158,251,0.1)',
      borderColor: '#009efb',
      pointBackgroundColor: '#009efb',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#009efb'
    },
    {
      // dark grey
      backgroundColor: 'rgba(85,206,99,0.1)',
      borderColor: '#55ce63',
      pointBackgroundColor: '#55ce63',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#55ce63'
    }
  ];
  public lineChartLegend = false;
  public lineChartType = 'line';

  ngAfterViewInit() {}
}
