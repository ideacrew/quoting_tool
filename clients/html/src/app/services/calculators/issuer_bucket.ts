import { RosterEntry } from "../../data/sponsor_roster";
import { Product } from "../../data/products";
import { Quote } from "../../data/quotes";

class CostResult {
  constructor(
    public family: RosterEntry,
    public total: number
  ) { }
}

export class IssuerBucket {
  private expensiveFamilies :  Map<String, CostResult> = new Map<String,CostResult>();
  private cheapFamilies : Map<String, CostResult>  = new Map<String,CostResult>();

  constructor() {

  }

  add(product: Product, re: RosterEntry, total: number) : void {
    if (this.expensiveFamilies.has(product.provider_name)) {
      var currentCostResult = this.expensiveFamilies.get(product.provider_name);
      if (currentCostResult.total < total) {
        this.expensiveFamilies.set(product.provider_name, new CostResult(re, total));  
      }
    } else {
      this.expensiveFamilies.set(product.provider_name, new CostResult(re, total));
    }
    if (this.cheapFamilies.has(product.provider_name)) {
      var currentCostResult = this.cheapFamilies.get(product.provider_name);
      if (currentCostResult.total > total) {
        this.cheapFamilies.set(product.provider_name, new CostResult(re, total));  
      }
    } else {
      this.cheapFamilies.set(product.provider_name, new CostResult(re, total));
    }
  }

  cheapestFor(q : Quote) :  CostResult | null {
    if (this.cheapFamilies.has(q.product_information.provider_name)) {
      return this.cheapFamilies.get(q.product_information.provider_name);
    }
    return null;
  }

  mostExpensiveFor(q : Quote) :  CostResult | null {
    if (this.expensiveFamilies.has(q.product_information.provider_name)) {
      return this.expensiveFamilies.get(q.product_information.provider_name);
    }
    return null;
  }
}