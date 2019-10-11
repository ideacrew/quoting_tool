import { Component, OnInit, Input } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import tooltips from '../../data/tooltips.json';
import tableHeaders from '../../data/tableHeaders.json';
import html2PDF from 'jspdf-html2canvas';

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
  public tooltips = tooltips[0];
  public isCollapsed: any;
  public metalLevelOptions: any;
  public carriers: any;
  public products: any;
  public filteredCarriers: any;
  public employerDetails: any;
  public effectiveDate: any;
  public erEmployees: any;
  public costShownText: any;
  public clearAll: boolean;
  public filterLength: number;
  public filterSelected = false;
  public tableHeaders = tableHeaders[0];
  selectedMetalLevels = [];
  selectedProductTypes = [];
  selectedInsuranceCompanies = [];
  filterCarriersResults = [];
  filterKeysSelected = [];
  html2PDF = html2PDF;
  public pdfView = false;
  public btnName: string;
  public btnLink: string;

  public planOptions = [
    {key: 'one_carrier', value: 'One Carrier', view: 'health'},
    {key: 'one_level', value: 'One Level', view: 'health'},
    {key: 'one_plan', value: 'One Plan', view: 'health'},
    {key: 'one_plan', value: 'One Plan', view: 'dental'},
  ];

  @Input() carrierPlans: any;
  @Input() planType: any;

  constructor() { }

  ngOnInit() {
    const erDetails = localStorage.getItem('employerDetails');
    this.employerDetails = JSON.parse(erDetails);
    this.filterLength = 0;

    if (this.employerDetails) {
      this.erEmployees = this.employerDetails.employees;

      if (this.erEmployees.length > 1) {
        this.costShownText = `${this.erEmployees.length} people`;
      } else {
        this.costShownText = `${this.erEmployees.length} person`;
      }
    }

    if (this.planType === 'health') {
      this.btnName = 'Select Dental';
      this.btnLink = '/employer-details/dental';
    } else {
      this.btnName = 'Back to health';
      this.btnLink = '/employer-details/health';
    }
  }

  loadData() {
    this.metalLevelOptions = this.carrierPlans.map(plan => {
      if (plan['Metal Level']) {
        return plan['Metal Level'];
      } else {
        // Dental uses Coverage level as a key instead of Metal level
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
    this.filterLength = this.filteredCarriers.length;
    this.filterSelected = true;
  }

  selectedFilter(value, event, type) {
    switch (type) {
      case 'metalLevel' :
        if (event.target.checked) {
          this.selectedMetalLevels.push(value);
          this.filterKeysSelected.push(type);
        } else {
          const index = this.selectedMetalLevels.indexOf(value);
          const keyIndex = this.filterKeysSelected.indexOf(type);
          this.selectedMetalLevels.splice(index, 1);
          this.filterKeysSelected.splice(keyIndex, 1);
        }
        break;
      case 'productType' :
        if (event.target.checked) {
          this.selectedProductTypes.push(value);
          this.filterKeysSelected.push(type);
        } else {
          const index = this.selectedProductTypes.indexOf(value);
          const keyIndex = this.filterKeysSelected.indexOf(type);
          this.selectedProductTypes.splice(index, 1);
          this.filterKeysSelected.splice(keyIndex, 1);
        }
        break;
      case 'insuranceCompany' :
        if (event.target.checked) {
          this.selectedInsuranceCompanies.push(value);
          this.filterKeysSelected.push(type);
        } else {
          const index = this.selectedInsuranceCompanies.indexOf(value);
          const keyIndex = this.filterKeysSelected.indexOf(type);
          this.selectedInsuranceCompanies.splice(index, 1);
          this.filterKeysSelected.splice(keyIndex, 1);
        }
        break;
    }
    this.filterCarriers();
  }

  filterCarriers() {
    const tempArray = [];
    this.carrierPlans.map(plan => {
      if (this.selectedMetalLevels) {
        this.selectedMetalLevels.filter(metalLevel => {
          if (plan['Metal Level']) {
            if (metalLevel === plan['Metal Level']) {
              tempArray.push(plan);
            }
          } else {
            // Dental uses Coverage level as a key instead of Metal level
            if (metalLevel === plan['Coverage Level']) {
              tempArray.push(plan);
            }
          }
        });
      }

      if (this.selectedProductTypes) {
        this.selectedProductTypes.filter(product => {
          if (product === plan['Product']) {
            tempArray.push(plan);
          }
        });
      }

      if (this.selectedInsuranceCompanies) {
        this.selectedInsuranceCompanies.filter(carrier => {
          if (carrier === plan['Carrier']) {
            tempArray.push(plan);
          }
        });
      }
    });
    this.filterCarriersResults = tempArray;
  }

  displayResults() {
    this.filteredCarriers = this.filterCarriersResults;
    this.filterLength = this.filterCarriersResults.length;
  }

  resetAll() {
    this.filteredCarriers = this.carrierPlans;
    this.filterLength = this.carrierPlans.length;
    this.selectedMetalLevels = [];
    this.selectedProductTypes = [];
    this.selectedInsuranceCompanies = [];
    this.filterCarriersResults = [];
    this.filterKeysSelected = [];

    const checkboxes = document.getElementsByClassName('checkbox-input');
    for (let i = 0; i < checkboxes.length; i++) {
      // @ts-ignore
      checkboxes[i].checked = false;
    }
  }

  getToolTip(type) {
    return this.tooltips[this.planType].map(key => key[type]);
  }

  getTableHeader(col) {
    return this.tableHeaders[this.planType].map(key => key[col]);
  }

  metalLevelCount(metalLevel, planType) {
    if (planType === 'health') {
      const count = this.carrierPlans.filter(plan => plan['Metal Level'] === metalLevel);
      return `(${count.length} Plans)`;
    } else {
      const count = this.carrierPlans.filter(plan => plan['Coverage Level'] === metalLevel);
      return `(${count.length} Plans)`;
    }
  }

  productTypeCounts(product) {
    const count = this.carrierPlans.filter(plan => plan['Product'] === product);
    return `(${count.length} Plans)`;
  }

  downloadPdf() {
    this.pdfView = true;
    const table = document.getElementById('plan-table');
    this.html2PDF(table, {
    jsPDF: {
      unit: 'pt',
      format: 'a4'
    },
    imageType: 'image/png',
    output: `./pdf/${this.planType}.pdf`,
    success: function(pdf) {
      pdf.save();
    }
    });
    setTimeout(() => {
      this.pdfView = false;
    }, 500);
  }
}
