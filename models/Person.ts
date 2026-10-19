import * as Crypto from 'expo-crypto';

export interface Person {
  id: string;
  name: string;
  email: string;
  details: string;
  photoUri?: string;
}

/**
 * createBlankPerson
 * Builds a new, empty contact with a fresh UUID so it can be uniquely
 * identified in the list and in navigation params. All text fields start
 * empty and there is no photo yet. This replaces what SwiftData's @Model
 * gave us for free (identity) in the Swift version.
 */
export function createBlankPerson(): Person {
  return {
    id: Crypto.randomUUID(),
    name: '',
    email: '',
    details: '',
  };
}
