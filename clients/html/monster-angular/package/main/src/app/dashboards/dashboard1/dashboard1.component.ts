import { Component, AfterViewInit } from '@angular/core';
import { NgbProgressbarConfig } from '@ng-bootstrap/ng-bootstrap';
import * as Chartist from 'chartist';
import { ChartType, ChartEvent } from 'ng-chartist/dist/chartist.component';

import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

declare var require: any;

const data: any = require('./data.json');

export interface Chart {
  type: ChartType;
  data: Chartist.IChartistData;
  options?: any;
  responsiveOptions?: any;
  events?: ChartEvent;
}

@Component({
  templateUrl: './dashboard1.component.html',
  styleUrls: ['./dashboard1.component.css']
})
export class Dashboard1Component implements AfterViewInit {
	
	public config: PerfectScrollbarConfigInterface = {};

  subtitle: string;
  constructor() {
    this.subtitle = 'This is some text within a card block.';
  }

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

  // This is for the donute chart
  donuteChart1: Chart = {
    type: 'Pie',
    data: data['Pie'],
    options: {
      donut: true,
      showLabel: false,
      donutWidth: 30
    }
    // events: {
    //   draw(data: any): boolean {
    //     return data;
    //   }
    // }
  };

  // Doughnut
  public doughnutChartLabels: string[] = ['Sales', 'Earning', 'Cost'];

  public doughnutChartOptions: any = {
    responsive: false,
    maintainAspectRatio: false
  };
  public doughnutChartData: number[] = [350, 450, 100];
  public doughnutChartType = 'doughnut';

  // Sales Analytics Pie chart
  public pieChartLabels: string[] = ['Sales', 'Earning', 'Cost'];
  public pieChartData: number[] = [300, 500, 100];
  public pieChartType = 'pie';

  ngAfterViewInit() {}
}
