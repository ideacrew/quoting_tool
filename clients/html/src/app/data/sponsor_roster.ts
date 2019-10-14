import { ContributionRelationship } from '../config/client_configuration'

export interface RosterDependent {
  dob: Date
  relationship: ContributionRelationship
}

export interface RosterEntry {
  dob: Date
  roster_dependents: Array<RosterDependent>
  will_enroll: boolean
}
