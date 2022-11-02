import { ContributionTierName } from '../config/contribution_tier_name';
import { ContributionRelationship } from '../config/contribution_relationship';

export interface RelationshipContributionLevel {
  name: ContributionRelationship;
  contribution: number;
  offered: boolean;
}

export interface RelationshipContributionModel {
  levels: Array<RelationshipContributionLevel>;
}

export interface TieredContributionLevel {
  name: ContributionTierName;
  contribution: number;
  offered: boolean;
}

export interface TieredContributionModel {
  levels: Array<TieredContributionLevel>;
}
