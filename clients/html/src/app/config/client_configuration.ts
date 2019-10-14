import { QuoteCalculator } from '../data/quotes';
import { RosterEntry } from '../data/sponsor_roster';
import { RelationshipContributionModel, TieredContributionModel } from '../data/contribution_models';
import { RelationshipCoverageCostCalculatorService } from '../services/calculators/relationship_coverage_cost_calculator.service';
import { TieredCoverageCostCalculatorService } from '../services/calculators/tiered_coverage_cost_calculator.service';

type QuoteCalculatorConstructor<T> = new (
  startDate: Date,
  contributionModel: T,
  roster: Array<RosterEntry>
) => QuoteCalculator;

export interface ClientPreferences {
  display_contribution_management: boolean;
  relationship_package_types: Array<PackageTypes>;
  tiered_package_types: Array<PackageTypes>;
  relationship_quote_calculator: QuoteCalculatorConstructor<RelationshipContributionModel>;
  tiered_quote_calculator: QuoteCalculatorConstructor<TieredContributionModel>;
  default_state: string;
  minimum_start_date: Date;
  maximum_start_date: Date;
  county_zip_required: boolean;
}

export enum PackageTypes {
  METAL_LEVEL = 'metal_level',
  SINGLE_ISSUER = 'single_issuer',
  SINGLE_PRODUCT = 'single_product'
}

export enum ContributionRelationship {
  SELF = 'Self',
  SPOUSE = 'Spouse',
  CHILD = 'Child',
  DOMESTIC_PARTNER = 'Domestic Partner'
}

export enum ContributionTierName {
  EMPLOYEE_ONLY = 'Employee Only',
  EMPLOYEE_AND_SPOUSE = 'Employee and Spouse',
  EMPLOYEE_AND_DEPENDENTS = 'Employee and Dependents',
  FAMILY = 'Family'
}

export function defaultRelationshipContributionModel() {
  const subscriber_level = {
    name: ContributionRelationship.SELF,
    contribution: 100,
    offered: true
  };
  const spouse_level = {
    name: ContributionRelationship.SPOUSE,
    contribution: 100,
    offered: true
  };
  const dependent_level = {
    name: ContributionRelationship.CHILD,
    contribution: 100,
    offered: true
  };
  const domestic_partner_level = {
    name: ContributionRelationship.DOMESTIC_PARTNER,
    contribution: 100,
    offered: true
  };
  return {
    levels: [subscriber_level, spouse_level, dependent_level, domestic_partner_level]
  };
}

export function defaultTieredContributionModel() {
  const subscriber_level = {
    name: ContributionTierName.EMPLOYEE_ONLY,
    contribution: 100,
    offered: true
  };
  const spouse_level = {
    name: ContributionTierName.EMPLOYEE_AND_SPOUSE,
    contribution: 100,
    offered: true
  };
  const dependent_level = {
    name: ContributionTierName.EMPLOYEE_AND_DEPENDENTS,
    contribution: 100,
    offered: true
  };
  const domestic_partner_level = {
    name: ContributionTierName.FAMILY,
    contribution: 100,
    offered: true
  };
  return {
    levels: [subscriber_level, spouse_level, dependent_level, domestic_partner_level]
  };
}

export const CLIENT_PREFERENCES: ClientPreferences = {
  display_contribution_management: true,
  relationship_package_types: [PackageTypes.METAL_LEVEL, PackageTypes.SINGLE_ISSUER],
  tiered_package_types: [PackageTypes.SINGLE_PRODUCT],
  relationship_quote_calculator: RelationshipCoverageCostCalculatorService,
  tiered_quote_calculator: TieredCoverageCostCalculatorService,
  default_state: 'MA',
  minimum_start_date: new Date(2017, 0, 1),
  maximum_start_date: new Date(2019, 11, 1),
  county_zip_required: true
};
