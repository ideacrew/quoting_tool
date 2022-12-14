import { QuoteCalculator } from '../data/quotes';
import { RosterEntry } from '../data/sponsor_roster';
import { ContributionRelationship } from './contribution_relationship';
import { ContributionTierName } from './contribution_tier_name';
import { PackageTypes } from './package_types';
import { RelationshipContributionModel, TieredContributionModel } from '../data/contribution_models';
import { RelationshipCoverageCostCalculatorService } from '../services/calculators/relationship_coverage_cost_calculator.service';
import { TieredCoverageCostCalculatorService } from '../services/calculators/tiered_coverage_cost_calculator.service';

type QuoteCalculatorConstructor<T> = new (
  startDate: Date,
  contributionModel: T,
  roster: Array<RosterEntry>,
  kind: string
) => QuoteCalculator;

interface RelationshipDiscountPreferences {
  relationship_kind: ContributionRelationship;
  relationship_threshold_age: number;
  relationship_threshold: number;
}

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
  relationship_discount: RelationshipDiscountPreferences | null;
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
  minimum_start_date: new Date(2017, 0, 1),
  maximum_start_date: new Date(2019, 11, 1),
  county_zip_required: true,
  relationship_discount: {
    relationship_kind: ContributionRelationship.CHILD,
    relationship_threshold_age: 21,
    relationship_threshold: 4
  }
};
