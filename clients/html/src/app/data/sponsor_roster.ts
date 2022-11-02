import { ContributionRelationship } from '../config/contribution_relationship';

export interface RosterDependent {
  dob: Date;
  relationship: ContributionRelationship;
}

export interface RosterEntry {
  dob: Date;
  roster_dependents: Array<RosterDependent>;
  will_enroll: boolean;
}
