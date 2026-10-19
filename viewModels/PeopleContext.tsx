import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Person, createBlankPerson } from '../models/Person';

const STORAGE_KEY = '@SimpleContacts:people';

export type SortOrder = 'asc' | 'desc';

/**
 * filterAndSort
 * Pure helper: keeps only the people whose name contains the search text
 * (case-insensitive, ignoring surrounding whitespace), then returns them
 * sorted by name A-Z or Z-A. It copies the array before sorting so the
 * original list is never mutated. Kept outside the provider so it can be
 * unit-tested without React or storage.
 */
export function filterAndSort(people: Person[], searchText: string, sortOrder: SortOrder): Person[] {
  const needle = searchText.trim().toLowerCase();
  const filtered = needle === ''
    ? people
    : people.filter((p) => p.name.toLowerCase().includes(needle));
  return [...filtered].sort((a, b) =>
    sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
  );
}

type PeopleContextValue = {
  people: Person[];
  loading: boolean;
  addPerson: () => Person;
  updatePerson: (id: string, updates: Partial<Person>) => void;
  deletePerson: (id: string) => void;
  getPerson: (id: string) => Person | undefined;
};

const PeopleContext = createContext<PeopleContextValue | undefined>(undefined);

/**
 * PeopleProvider
 * Owns the single shared list of contacts for the whole app and exposes it
 * (plus add/update/delete/get helpers) through React Context. On mount it
 * loads any saved contacts from AsyncStorage, and every time the list
 * changes it writes the list back, so screens never call "save" manually.
 * Plays the role of SwiftData's model container + model context.
 */
export function PeopleProvider({ children }: { children: ReactNode }) {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);

  // Load saved contacts once when the app starts (like SwiftData loading its store on launch).
  useEffect(() => {
    (async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json != null) setPeople(JSON.parse(json));
      } catch (error) {
        console.error('Error loading people:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Persist the whole list whenever it changes; skipped while still loading so we
  // don't overwrite saved data with the initial empty array.
  useEffect(() => {
    if (!loading) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(people)).catch((error) =>
        console.error('Error saving people:', error)
      );
    }
  }, [people, loading]);

  /**
   * addPerson
   * Creates a blank contact, appends it to the list, and returns it so the
   * caller can immediately navigate to its edit screen.
   */
  const addPerson = (): Person => {
    const person = createBlankPerson();
    setPeople((prev) => [...prev, person]);
    return person;
  };

  /**
   * updatePerson
   * Merges the given fields into the contact with the matching id and leaves
   * every other contact untouched. Called on every keystroke in the edit form.
   */
  const updatePerson = (id: string, updates: Partial<Person>) => {
    setPeople((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  /**
   * deletePerson
   * Removes the contact with the matching id from the list (used by swipe-to-delete).
   */
  const deletePerson = (id: string) => {
    setPeople((prev) => prev.filter((p) => p.id !== id));
  };

  /**
   * getPerson
   * Looks up the current (freshest) copy of a contact by id, or undefined if
   * it no longer exists.
   */
  const getPerson = (id: string) => people.find((p) => p.id === id);

  return (
    <PeopleContext.Provider
      value={{ people, loading, addPerson, updatePerson, deletePerson, getPerson }}
    >
      {children}
    </PeopleContext.Provider>
  );
}

/**
 * usePeople
 * Custom hook that gives any screen access to the shared contacts and helpers.
 * Throws a clear error if used outside of PeopleProvider.
 */
export function usePeople(): PeopleContextValue {
  const ctx = useContext(PeopleContext);
  if (!ctx) throw new Error('usePeople must be used inside a PeopleProvider');
  return ctx;
}
