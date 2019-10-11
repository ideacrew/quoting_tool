import { Component, OnInit, Input } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import tooltips from '../../settings/tooltips.json';
import tableHeaders from '../../settings/tableHeaders.json';

import { Quote, QuoteCalculator } from "../data/quotes";
import { TieredContributionModel, RelationshipContributionModel } from "../data/contribution_models";
import { ClientPreferences, CLIENT_PREFERENCES, PackageTypes, defaultRelationshipContributionModel, defaultTieredContributionModel } from "../config/client_configuration";
import { PlanProviderService } from "../services/plan-provider.service";
import { Product } from "../data/products";
import { RosterEntry } from "../data/sponsor_roster";


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
  public clearAll: boolean;
  public filterLength: number;
  public filterSelected = false;
  public tableHeaders = tableHeaders;
  selectedMetalLevels = [];
  selectedProductTypes = [];
  selectedInsuranceCompanies = [];
  filterCarriersResults = [];
  filterKeysSelected = [];



  private sponsorRoster : Array<RosterEntry> = [];
  public planFilter : PackageTypes | null;
  public hasTierCompatibleType: boolean;
  public hasRelationshipCompatibleType: boolean;
  public kindFilteredProducts = [];
  public sponsorProducts = [];
  public filteredProducts = [];
  public clientPreferences: ClientPreferences = CLIENT_PREFERENCES;
  public relationshipCalculator: QuoteCalculator;
  public tieredCalculator: QuoteCalculator;
  public relationshipContributionModel:RelationshipContributionModel;
  public tieredContributionModel:TieredContributionModel;

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


    if(this.employerDetails) {

      debugger

      this.planService.getPlansFor(
      this,
      "0111",
      new Date(2019, 6, 1),
      "MA",
      "Hampden",
      "01001");

      // const startDate = this.employerDetails.effectiveDate
      const consumer = this;
      this.employerDetails.employees.forEach(function(employee) {
        var employeeJson = { dob: new Date(employee.dob), will_enroll: true, roster_dependents: [] }

        employee.dependents.forEach(function(dependent) {
          employeeJson.roster_dependents.push({
            dob: new Date(dependent.dob),
            relationship: dependent.relationship
          })
        })

        consumer.sponsorRoster.push(employeeJson)
      })
      const startDate = new Date(2019,6,1)
      this.tieredContributionModel = defaultTieredContributionModel();
      this.tieredCalculator = this.calculator(startDate, this.tieredContributionModel, true);
      this.relationshipContributionModel = defaultRelationshipContributionModel();
      this.relationshipCalculator = this.calculator(startDate, this.relationshipContributionModel);
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

  public onProductsLoaded(products: Array<Product>): void {
    this.planFilter = null;
    this.hasRelationshipCompatibleType = false;
    this.hasTierCompatibleType = false;
    this.sponsorProducts = products;
    this.kindFilteredProducts = products;
    this.filteredProducts = products;
  }

  changePackageFilter(evt) {
    var newVal : PackageTypes | null = <PackageTypes>evt;
    this.planFilter = newVal;
    this.hasTierCompatibleType = false;
    this.hasRelationshipCompatibleType = false;
    if (newVal != null) {
      this.hasRelationshipCompatibleType = this.isRelationshipPackageType(this.planFilter);
      this.hasTierCompatibleType = this.isTieredPackageType(this.planFilter);
    }
    var packageKinds = this.planFilter;
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
    var calculator = this.hasRelationshipCompatibleType ? this.relationshipCalculator : this.tieredCalculator;
    var newQuotes = calculator.quoteProducts(this.kindFilteredProducts, this.planFilter);
    var fProductsForCompare = this.filteredProducts.map(function(fp) {
      return (fp.name + fp.provider_name);
    });
    var filteredQuotes = newQuotes.filter(function(nq) {
      return fProductsForCompare.includes((nq.product_information.name + nq.product_information.provider_name))
    })
    this.filteredCarriers = filteredQuotes;
    this.filterLength = filteredQuotes.length;
    this.filterSelected = true;
  }

  isRelationshipPackageType(pt: PackageTypes) {
    return this.clientPreferences.relationship_package_types.indexOf(pt) > -1;
  }

  isTieredPackageType(pt: PackageTypes) {
    return this.clientPreferences.tiered_package_types.indexOf(pt) > -1;
  }

  private calculator(date, contributionModel, isTiredCalculator?:boolean) : QuoteCalculator {
    if(isTiredCalculator) {
      var calculator = new this.clientPreferences.tiered_quote_calculator(
        date,
        contributionModel,
        this.sponsorRoster
      );

      return calculator;
    } else {
      var calculator = new this.clientPreferences.relationship_quote_calculator(
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
    return this.tooltips[0][this.planType][0][type];
  }
}
