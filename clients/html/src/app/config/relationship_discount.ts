import { ContributionRelationship } from './contribution_relationship';

interface RelationshipDiscountPreferences {
  relationship_kind: ContributionRelationship;
  relationship_threshold_age: number;
  relationship_threshold: number;
}

export interface Preferences {
  relationship_discount: RelationshipDiscountPreferences | null;
}

export const RelationshipDiscounts: Preferences = {
  relationship_discount: {
    relationship_kind: ContributionRelationship.CHILD,
    relationship_threshold_age: 21,
    relationship_threshold: 4
  }
};
