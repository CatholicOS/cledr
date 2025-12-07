/**
 * CLEDR Calendar - Fragment Name Generator Tests
 */

import { describe, it, expect } from 'vitest';
import {
  Hora,
  HoraNomina,
  getFragmentNames,
  getDayFragments,
  getMassFragments,
  getOfficiumFragments,
  generateExamples
} from '../src/fragments';
import { CyclusDominicalis } from '../src/types';

/** Helper to format date as YYYY-MM-DD in local time (not UTC) */
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

describe('Hora Enum', () => {
  it('should have all liturgical hours', () => {
    expect(Hora.INVITATORIUM).toBe('INV');
    expect(Hora.OFFICIUM_LECTIONIS).toBe('OL');
    expect(Hora.LAUDES).toBe('LAU');
    expect(Hora.TERTIA).toBe('TER');
    expect(Hora.SEXTA).toBe('SEX');
    expect(Hora.NONA).toBe('NON');
    expect(Hora.VESPERAE).toBe('VES');
    expect(Hora.COMPLETORIUM).toBe('COM');
  });

  it('should have all Mass parts', () => {
    expect(Hora.MISSA_INTROITUS).toBe('MIS-INT');
    expect(Hora.MISSA_COLLECTA).toBe('MIS-COL');
    expect(Hora.MISSA_EVANGELIUM).toBe('MIS-EV');
  });

  it('should have Latin names for all hours', () => {
    for (const hora of Object.values(Hora)) {
      expect(HoraNomina[hora]).toBeDefined();
      expect(HoraNomina[hora].length).toBeGreaterThan(0);
    }
  });
});

describe('getFragmentNames', () => {
  it('should generate fragment names for Easter Sunday', () => {
    const easter = new Date(2025, 3, 20);
    const fragments = getFragmentNames(easter, Hora.LAUDES);

    expect(fragments.primary).toBeDefined();
    expect(fragments.bmdPath).toBeDefined();
    expect(fragments.eprexCode).toBeDefined();
    expect(fragments.lectionary.sunday).toBe(CyclusDominicalis.C);
  });

  it('should generate fragment names for Christmas', () => {
    const christmas = new Date(2025, 11, 25);
    const fragments = getFragmentNames(christmas, Hora.MISSA_COLLECTA);

    expect(fragments.primary).toBe('1225/MIS-COL');
  });

  it('should generate fragment names for ordinary weekday', () => {
    const weekday = new Date(2025, 6, 15); // July 15
    const fragments = getFragmentNames(weekday, Hora.LAUDES);

    expect(fragments.primary).toContain('ORD');
    expect(fragments.common).toBeDefined();
  });

  it('should include lectionary cycles', () => {
    const date = new Date(2025, 0, 5);
    const fragments = getFragmentNames(date, Hora.MISSA_EVANGELIUM);

    expect(fragments.lectionary.sunday).toBeDefined();
    expect(fragments.lectionary.weekday).toBeDefined();
    expect([CyclusDominicalis.A, CyclusDominicalis.B, CyclusDominicalis.C])
      .toContain(fragments.lectionary.sunday);
  });

  it('should generate ePrex compatible code', () => {
    const date = new Date(2025, 0, 5);
    const fragments = getFragmentNames(date, Hora.LAUDES);

    expect(fragments.eprexCode).toMatch(/^[A-Z]{3}\d{2}/);
    expect(fragments.eprexCode).toContain('-LAU');
  });
});

describe('getDayFragments', () => {
  it('should return fragments for all hours', () => {
    const date = new Date(2025, 3, 20);
    const fragments = getDayFragments(date);

    for (const hora of Object.values(Hora)) {
      expect(fragments[hora]).toBeDefined();
      expect(fragments[hora].primary).toBeDefined();
    }
  });
});

describe('getMassFragments', () => {
  it('should return all Mass fragments', () => {
    const date = new Date(2025, 11, 25);
    const mass = getMassFragments(date);

    expect(mass.introitus).toBeDefined();
    expect(mass.collecta).toBeDefined();
    expect(mass.lectioI).toBeDefined();
    expect(mass.psalmus).toBeDefined();
    expect(mass.evangelium).toBeDefined();
    expect(mass.superOblata).toBeDefined();
    expect(mass.praefatio).toBeDefined();
    expect(mass.postCommunionem).toBeDefined();
  });

  it('should include second reading on Sundays', () => {
    const sunday = new Date(2025, 0, 5);
    const mass = getMassFragments(sunday);

    expect(mass.lectioII).toBeDefined();
  });

  it('should not include second reading on weekdays', () => {
    const weekday = new Date(2025, 0, 6); // Monday
    const mass = getMassFragments(weekday);

    expect(mass.lectioII).toBeUndefined();
  });
});

describe('getOfficiumFragments', () => {
  it('should return all Office fragments', () => {
    const date = new Date(2025, 3, 20);
    const officium = getOfficiumFragments(date);

    expect(officium.invitatorium).toBeDefined();
    expect(officium.officiumLectionis).toBeDefined();
    expect(officium.laudes).toBeDefined();
    expect(officium.tertia).toBeDefined();
    expect(officium.sexta).toBeDefined();
    expect(officium.nona).toBeDefined();
    expect(officium.vesperae).toBeDefined();
    expect(officium.completorium).toBeDefined();
  });
});

describe('generateExamples', () => {
  it('should generate example fragments', () => {
    const examples = generateExamples();

    expect(examples.length).toBeGreaterThan(0);

    for (const example of examples) {
      expect(example.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(example.description).toBeDefined();
      expect(example.fragments.laudes).toBeDefined();
      expect(example.fragments.collecta).toBeDefined();
      expect(example.fragments.evangelium).toBeDefined();
    }
  });

  it('should include major feasts', () => {
    const examples = generateExamples();
    const descriptions = examples.map(e => e.description);

    expect(descriptions.some(d => d.includes('Paschae'))).toBe(true);
    expect(descriptions.some(d => d.includes('Nativitate'))).toBe(true);
    expect(descriptions.some(d => d.includes('Pentecostes'))).toBe(true);
  });
});

describe('Fragment Path Formats', () => {
  it('should use correct season paths', () => {
    // Advent
    const advent = new Date(2024, 11, 5);
    const adventFragments = getFragmentNames(advent, Hora.LAUDES);
    expect(adventFragments.primary).toContain('ADV');

    // Lent
    const lent = new Date(2025, 2, 15);
    const lentFragments = getFragmentNames(lent, Hora.LAUDES);
    expect(lentFragments.primary).toContain('QUA');

    // Easter season (use a ferial day without sanctorale entry)
    const easter = new Date(2025, 4, 8); // May 8 - no major feast
    const easterFragments = getFragmentNames(easter, Hora.LAUDES);
    expect(easterFragments.primary).toContain('PAS');

    // Ordinary Time
    const ordinary = new Date(2025, 6, 15);
    const ordinaryFragments = getFragmentNames(ordinary, Hora.LAUDES);
    expect(ordinaryFragments.primary).toContain('ORD');
  });

  it('should use correct day codes', () => {
    // Sunday
    const sunday = new Date(2025, 0, 5);
    const sunFragments = getFragmentNames(sunday, Hora.LAUDES);
    expect(sunFragments.primary).toContain('1DOM');

    // Weekday
    const friday = new Date(2025, 0, 10);
    const friFragments = getFragmentNames(friday, Hora.LAUDES);
    expect(friFragments.primary).toContain('6VEN');
  });
});
