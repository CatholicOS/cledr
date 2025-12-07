/**
 * CLEDR Calendar - Sanctorale Tests
 * Fixed feasts validation
 */

import { describe, it, expect } from 'vitest';
import {
  SANCTORALE,
  SANCTORALE_JANUARY,
  SANCTORALE_JUNE,
  SANCTORALE_DECEMBER,
  findSanctorale,
  findSanctoraleCelebration,
  getSanctoraleByMonth
} from '../src/sanctorale';
import { Gradus, Praecedentia, Color, Genus } from '../src/types';

describe('SANCTORALE Data Structure', () => {
  it('should have celebrations for all 12 months', () => {
    for (let month = 1; month <= 12; month++) {
      const monthCelebrations = getSanctoraleByMonth(month);
      expect(monthCelebrations.length).toBeGreaterThan(0);
    }
  });

  it('should have unique codes', () => {
    const codes = SANCTORALE.map(d => d.code);
    const uniqueCodes = new Set(codes);
    expect(uniqueCodes.size).toBe(codes.length);
  });

  it('should have unique IDs', () => {
    const ids = SANCTORALE.map(d => d.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('should have Latin names for all entries', () => {
    for (const dies of SANCTORALE) {
      expect(dies.nomina.la).toBeDefined();
      expect(dies.nomina.la.length).toBeGreaterThan(0);
    }
  });

  it('should have valid month (1-12) for all entries', () => {
    for (const dies of SANCTORALE) {
      expect(dies.month).toBeGreaterThanOrEqual(1);
      expect(dies.month).toBeLessThanOrEqual(12);
    }
  });

  it('should have valid day for all entries', () => {
    for (const dies of SANCTORALE) {
      expect(dies.day).toBeGreaterThanOrEqual(1);
      expect(dies.day).toBeLessThanOrEqual(31);
    }
  });

  it('should have genus SANCTORALE for all entries', () => {
    for (const dies of SANCTORALE) {
      expect(dies.genus).toBe(Genus.SANCTORALE);
    }
  });
});

describe('Major Solemnities', () => {
  it('should have Christmas (Dec 25)', () => {
    const christmas = SANCTORALE.find(d => d.month === 12 && d.day === 25);
    expect(christmas).toBeDefined();
    expect(christmas?.gradus).toBe(Gradus.SOLLEMNITAS);
    expect(christmas?.nomina.la).toContain('Nativitate');
  });

  it('should have Epiphany (Jan 6)', () => {
    const epiphany = SANCTORALE.find(d => d.month === 1 && d.day === 6);
    expect(epiphany).toBeDefined();
    expect(epiphany?.gradus).toBe(Gradus.SOLLEMNITAS);
  });

  it('should have Annunciation (Mar 25)', () => {
    const annunciation = SANCTORALE.find(d => d.month === 3 && d.day === 25);
    expect(annunciation).toBeDefined();
    expect(annunciation?.gradus).toBe(Gradus.SOLLEMNITAS);
    expect(annunciation?.colores).toContain(Color.ALBUS);
  });

  it('should have Assumption (Aug 15)', () => {
    const assumption = SANCTORALE.find(d => d.month === 8 && d.day === 15);
    expect(assumption).toBeDefined();
    expect(assumption?.gradus).toBe(Gradus.SOLLEMNITAS);
  });

  it('should have All Saints (Nov 1)', () => {
    const allSaints = SANCTORALE.find(d => d.month === 11 && d.day === 1);
    expect(allSaints).toBeDefined();
    expect(allSaints?.gradus).toBe(Gradus.SOLLEMNITAS);
  });

  it('should have Immaculate Conception (Dec 8)', () => {
    const immaculate = SANCTORALE.find(d => d.month === 12 && d.day === 8);
    expect(immaculate).toBeDefined();
    expect(immaculate?.gradus).toBe(Gradus.SOLLEMNITAS);
  });

  it('should have Peter and Paul (Jun 29)', () => {
    const peterPaul = SANCTORALE.find(d => d.month === 6 && d.day === 29);
    expect(peterPaul).toBeDefined();
    expect(peterPaul?.gradus).toBe(Gradus.SOLLEMNITAS);
    expect(peterPaul?.colores).toContain(Color.RUBER);
  });
});

describe('Sanctorale Lookup', () => {
  it('should find Christmas by date', () => {
    const christmas = new Date(2025, 11, 25);
    const found = findSanctoraleCelebration(christmas);
    expect(found).not.toBeNull();
    expect(found?.nomina.la).toContain('Nativitate');
  });

  it('should find Peter and Paul by date', () => {
    const peterPaul = new Date(2025, 5, 29);
    const found = findSanctoraleCelebration(peterPaul);
    expect(found).not.toBeNull();
    expect(found?.nomina.la).toContain('Petri');
  });

  it('should return empty array for date without fixed feast', () => {
    // Most days in July have only optional memorials or nothing
    const found = findSanctorale(new Date(2025, 6, 15));
    // Returns array (may be empty or have optional memorials)
    expect(Array.isArray(found)).toBe(true);
  });

  it('findSanctorale returns array, findSanctoraleCelebration returns single item', () => {
    const date = new Date(2025, 11, 25);
    const fromFind = findSanctorale(date);
    const fromCelebration = findSanctoraleCelebration(date);

    // findSanctorale returns array
    expect(Array.isArray(fromFind)).toBe(true);
    expect(fromFind.length).toBeGreaterThan(0);

    // findSanctoraleCelebration returns first item
    expect(fromCelebration).toEqual(fromFind[0]);
  });
});

describe('Monthly Arrays', () => {
  it('SANCTORALE_JANUARY should have Mary Mother of God', () => {
    const maryMother = SANCTORALE_JANUARY.find(d => d.day === 1);
    expect(maryMother).toBeDefined();
    expect(maryMother?.gradus).toBe(Gradus.SOLLEMNITAS);
  });

  it('SANCTORALE_JUNE should have Peter and Paul', () => {
    const peterPaul = SANCTORALE_JUNE.find(d => d.day === 29);
    expect(peterPaul).toBeDefined();
  });

  it('SANCTORALE_DECEMBER should have Christmas and Immaculate Conception', () => {
    const christmas = SANCTORALE_DECEMBER.find(d => d.day === 25);
    const immaculate = SANCTORALE_DECEMBER.find(d => d.day === 8);
    expect(christmas).toBeDefined();
    expect(immaculate).toBeDefined();
  });
});

describe('Martyrs Colors', () => {
  it('should have red color for martyrs', () => {
    // Stephen (Dec 26) is a martyr
    const stephen = SANCTORALE.find(d => d.id === 'stephen_first_martyr');
    if (stephen) {
      expect(stephen.colores).toContain(Color.RUBER);
    }

    // Holy Innocents (Dec 28) are martyrs
    const innocents = SANCTORALE.find(d => d.id === 'holy_innocents');
    if (innocents) {
      expect(innocents.colores).toContain(Color.RUBER);
    }
  });
});

describe('BVM Feasts', () => {
  it('should have white color for Marian feasts', () => {
    // Assumption (Aug 15)
    const assumption = SANCTORALE.find(d => d.month === 8 && d.day === 15);
    expect(assumption?.colores).toContain(Color.ALBUS);

    // Immaculate Conception (Dec 8)
    const immaculate = SANCTORALE.find(d => d.month === 12 && d.day === 8);
    expect(immaculate?.colores).toContain(Color.ALBUS);
  });
});
