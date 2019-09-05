import { Component, AfterViewInit } from '@angular/core';
import { NgbProgressbarConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  templateUrl: './dashboard2.component.html',
  styleUrls: ['./dashboard2.component.css']
})
export class Dashboard2Component implements AfterViewInit {
  subtitle: string;
  constructor() {
    this.subtitle = 'This is some text within a card block.';
  }
  // This is for the dashboar line chart
  // lineChart
  public lineChartData: Array<any> = [
    { data: [50, 130, 80, 70, 180, 105, 250], label: 'Sales' },
    { data: [80, 100, 60, 200, 150, 100, 150], label: 'Earnings' }
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
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true
          },
          gridLines: {
            color: '#f6f6f6'
          }
        }
      ],
      xAxes: [
        {
          gridLines: {
            color: '#FFFFFF'
          }
        }
      ]
    },
    lineTension: 10,
    responsive: true,
    maintainAspectRatio: false
  };
  public lineChartColors: Array<any> = [
    {
      // grey
      backgroundColor: 'rgba(0,158,251,0.0)',
      borderColor: '#009efb',
      pointBackgroundColor: '#009efb',
      pointBorderColor: '#fff',

      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#009efb'
    },
    {
      // dark grey
      backgroundColor: 'rgba(85,206,99,0.0)',
      borderColor: '#55ce63',
      pointBackgroundColor: '#55ce63',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#55ce63'
    }
  ];
  public lineChartLegend = false;
  public lineChartType = 'line';

  // Doughnut
  public doughnutChartLabels: string[] = ['Sales', 'Earning', 'Cost'];

  public doughnutChartOptions: any = {
    responsive: true,
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
