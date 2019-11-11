import { Product } from '../../data/products';
import { ContributionTierName } from '../../config/client_configuration';
import { ContributionTierCost } from '../../data/quotes';

export class RosterQuote {
  product_information: Product;
  member_cost: number;
  product_name: string;
  separate_prescription_deductable: string;
  group_deductible: string;
  deductible: number;
  hsa_eligible: boolean;

  constructor(
    product: Product,
    public total_cost: number,
    public sponsor_cost: number,
    public average_member_cost: number,
    public minimum_member_cost: number,
    public maximum_member_cost: number,
    public tier_costs: Map<ContributionTierName, ContributionTierCost>
  ) {
    this.product_name = product.name;
    this.product_information = product;
    this.deductible = product.deductible;
    this.group_deductible = product.group_deductible;
    this.member_cost = total_cost - sponsor_cost;
    this.separate_prescription_deductable = product.integrated_drug_deductible ? 'No' : 'Yes';
    this.hsa_eligible = product.hsa_eligible;
  }
}
