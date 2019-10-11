import { ContributionRelationship, ContributionTierName } from "../config/client_configuration";

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
