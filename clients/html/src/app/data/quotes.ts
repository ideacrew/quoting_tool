import { Product } from './products';
import { PackageTypes } from '../config/client_configuration';

export interface QuoteCalculator {
  quoteProducts(products: Array<Product>, pType: PackageTypes): Array<Quote>;
}

export interface Quote {
  product_name: string;
  product_information: Product;
  sponsor_cost: number;
  member_cost: number;
  total_cost: number;
  average_member_cost: number;
  minimum_member_cost: number;
  maximum_member_cost: number;
  hsa_eligible: boolean;
  separate_prescription_deductable: string;
  group_deductible: string;
  deductible: number;
}
