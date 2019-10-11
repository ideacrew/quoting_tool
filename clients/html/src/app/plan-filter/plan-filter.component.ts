import { Component, OnInit, Input } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import tooltips from '../../data/tooltips.json';
import tableHeaders from '../../data/tableHeaders.json';
import html2PDF from 'jspdf-html2canvas';

import { QuoteCalculator } from '../data/quotes';
import { TieredContributionModel, RelationshipContributionModel } from '../data/contribution_models';
import { ClientPreferences, CLIENT_PREFERENCES, PackageTypes,
  defaultRelationshipContributionModel, defaultTieredContributionModel } from '../config/client_configuration';
import { PlanProviderService } from '../services/plan-provider.service';
import { Product } from '../data/products';
import { RosterEntry } from '../data/sponsor_roster';


@Component({
  selector: 'app-plan-filter',
  templateUrl: './plan-filter.component.html',
  styleUrls: ['./plan-filter.component.css'],
  providers: [PlanProviderService],
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
  public hsaEligible: any;
  public filteredCarriers: any;
  public defaultCarriers: any;
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
  selectedHSAs = [];
  filterCarriersResults = [];
  filterKeysSelected = [];
  html2PDF = html2PDF;
  public pdfView = false;
  public btnName: string;
  public btnLink: string;



  private sponsorRoster: Array<RosterEntry> = [];
  public planFilter: PackageTypes | null;
  public hasTierCompatibleType: boolean;
  public hasRelationshipCompatibleType: boolean;
  public kindFilteredProducts = [];
  public sponsorProducts = [];
  public filteredProducts = [];
  public clientPreferences: ClientPreferences = CLIENT_PREFERENCES;
  public relationshipCalculator: QuoteCalculator;
  public tieredCalculator: QuoteCalculator;
  public relationshipContributionModel: RelationshipContributionModel;
  public tieredContributionModel: TieredContributionModel;

  public planOptions = [
    {key: 'single_issuer', value: 'One Carrier', view: 'health'},
    {key: 'metal_level', value: 'One Level', view: 'health'},
    {key: 'single_product', value: 'One Plan', view: 'health'},
    {key: 'single_product', value: 'One Plan', view: 'dental'},
  ];

  @Input() carrierPlans: any;
  @Input() planType: any;

  constructor(private planService: PlanProviderService) {
  }

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

    if (this.employerDetails) {
      this.planService.getPlansFor(
      this,
      '0111',
      new Date(2019, 6, 1),
      'MA',
      'Hampden',
      '01001');

      // const startDate = this.employerDetails.effectiveDate
      const consumer = this;
      this.employerDetails.employees.forEach(function(employee) {
        const employeeJson = { dob: new Date(employee.dob), will_enroll: true, roster_dependents: [] };

        employee.dependents.forEach(function(dependent) {
          employeeJson.roster_dependents.push({
            dob: new Date(dependent.dob),
            relationship: dependent.relationship
          });
        });

        consumer.sponsorRoster.push(employeeJson);
      });
      const startDate = new Date(2019, 6, 1);
      this.tieredContributionModel = defaultTieredContributionModel();
      this.tieredCalculator = this.calculator(startDate, this.tieredContributionModel, true);
      this.relationshipContributionModel = defaultRelationshipContributionModel();
      this.relationshipCalculator = this.calculator(startDate, this.relationshipContributionModel);
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
    this.metalLevelOptions = this.filteredCarriers.map(plan => {
      if (plan['product_information']['metal_level']) {
        return plan['product_information']['metal_level'];
      }
    })
      .reduce((unique, item) =>
        unique.includes(item) ? unique : [...unique, item], []);

    this.carriers = this.filteredCarriers.map(plan => plan['product_information']['provider_name'])
      .reduce((unique, item) =>
        unique.includes(item) ? unique : [...unique, item], []);

    this.products = this.filteredCarriers.map(plan => plan['product_information']['product_type'])
      .reduce((unique, item) =>
        unique.includes(item) ? unique : [...unique, item], []);

    this.hsaEligible = this.filteredCarriers.map(plan => plan['product_information']['hsa_eligible'])
      .reduce((unique, item) =>
        unique.includes(item) ? unique : [...unique, item], []);

    this.filterLength = this.filteredCarriers.length;
    this.filterSelected = true;
  }

  public onProductsLoaded(products: Array<Product>): void {
    this.planFilter = null;
    this.hasRelationshipCompatibleType = false;
    this.hasTierCompatibleType = false;
    this.sponsorProducts = products;
    this.kindFilteredProducts = products;
    this.filteredProducts = products;
  }

  changePackageFilter(evt) {
    const newVal: PackageTypes | null = <PackageTypes>evt;
    this.planFilter = newVal;
    this.hasTierCompatibleType = false;
    this.hasRelationshipCompatibleType = false;
    if (newVal != null) {
      this.hasRelationshipCompatibleType = this.isRelationshipPackageType(this.planFilter);
      this.hasTierCompatibleType = this.isTieredPackageType(this.planFilter);
    }
    const packageKinds = this.planFilter;
    this.kindFilteredProducts = this.sponsorProducts;
    if (packageKinds != null) {
      this.kindFilteredProducts = this.sponsorProducts.filter(function(p) {
        return p.package_kinds.includes(packageKinds);
      });
    }
    this.filteredProducts = this.kindFilteredProducts;
    this.recalculate();
  }

  recalculate() {
    const calculator = this.hasRelationshipCompatibleType ? this.relationshipCalculator : this.tieredCalculator;
    const newQuotes = calculator.quoteProducts(this.kindFilteredProducts, this.planFilter);
    const fProductsForCompare = this.filteredProducts.map(function(fp) {
      return (fp.name + fp.provider_name);
    });
    const filteredQuotes = newQuotes.filter(function(nq) {
      return fProductsForCompare.includes((nq.product_information.name + nq.product_information.provider_name));
    });
    this.filteredCarriers = filteredQuotes;
    this.defaultCarriers = this.filteredCarriers;
    this.filterLength = filteredQuotes.length;
    this.filterSelected = true;
    this.loadData();
  }

  isRelationshipPackageType(pt: PackageTypes) {
    return this.clientPreferences.relationship_package_types.indexOf(pt) > -1;
  }

  isTieredPackageType(pt: PackageTypes) {
    return this.clientPreferences.tiered_package_types.indexOf(pt) > -1;
  }

  private calculator(date, contributionModel, isTiredCalculator?: boolean): QuoteCalculator {
    if (isTiredCalculator) {
      const calc = new this.clientPreferences.tiered_quote_calculator(
        date,
        contributionModel,
        this.sponsorRoster
      );

      return calc;
    } else {
      const calculator = new this.clientPreferences.relationship_quote_calculator(
        date,
        contributionModel,
        this.sponsorRoster
      );

      return calculator;
    }
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
      case 'hsa' :
        if (event.target.checked) {
          this.selectedHSAs.push(value);
          this.filterKeysSelected.push(type);
        } else {
          const index = this.selectedHSAs.indexOf(value);
          const keyIndex = this.filterKeysSelected.indexOf(type);
          this.selectedHSAs.splice(index, 1);
          this.filterKeysSelected.splice(keyIndex, 1);
        }
        break;
    }
    this.filterCarriers();
  }

  filterCarriers() {
    const tempArray = [];
    this.filteredCarriers.map(plan => {
      if (this.selectedMetalLevels) {
        this.selectedMetalLevels.filter(metalLevel => {
          if (plan['product_information']['metal_level']) {
            if (metalLevel === plan['product_information']['metal_level']) {
              tempArray.push(plan);
            }
          }
        });
      }

      if (this.selectedProductTypes) {
        this.selectedProductTypes.filter(product => {
          if (product === plan['product_information']['product_type']) {
            tempArray.push(plan);
          }
        });
      }

      if (this.selectedInsuranceCompanies) {
        this.selectedInsuranceCompanies.filter(carrier => {
          if (carrier === plan['product_information']['provider_name']) {
            tempArray.push(plan);
          }
        });
      }

      if (this.selectedHSAs) {
        this.selectedHSAs.filter(hsa => {
          if (hsa === plan['product_information']['hsa_eligible']) {
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
    this.filteredCarriers = this.defaultCarriers;
    this.filterLength = this.defaultCarriers.length;
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
      const count = this.filteredCarriers.filter(plan => plan['product_information']['metal_level'] === metalLevel);
      return `(${count.length} Plans)`;
    }
  }

  productTypeCounts(product) {
    const count = this.filteredCarriers.filter(plan => plan['product_information']['product_type'] === product);
    return `(${count.length} Plans)`;
  }

  hsaCounts(hsa) {
    const count = this.filteredCarriers.filter(plan => plan['product_information']['hsa_eligible'] === hsa);
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
