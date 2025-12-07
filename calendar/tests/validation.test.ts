/**
 * CLEDR Calendar Validation Tests
 *
 * Validates calendar calculations against authoritative sources:
 * - Easter dates from official Computus tables
 * - Moveable feasts relative to Easter
 * - Known liturgical calendar data
 */

import { describe, it, expect } from 'vitest';
import {
  pascha,
  ascensio,
  pentecostes,
  corpusChristi,
  dominicaIAdventus,
  feriaIVCinerum,
  addDies
} from '../src/computus';

// Helper to format date as YYYY-MM-DD
function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
}

describe('Easter Date Validation (Official Computus Tables)', () => {
  /**
   * Official Easter dates from astronomical/ecclesiastical tables
   * Source: US Naval Observatory / Vatican
   * These are the definitive dates for Western (Roman) Easter
   */
  const officialEasterDates: Record<number, string> = {
    // Recent past
    2000: '2000-04-23',
    2001: '2001-04-15',
    2002: '2002-03-31',
    2003: '2003-04-20',
    2004: '2004-04-11',
    2005: '2005-03-27',
    2006: '2006-04-16',
    2007: '2007-04-08',
    2008: '2008-03-23',
    2009: '2009-04-12',
    2010: '2010-04-04',
    2011: '2011-04-24',
    2012: '2012-04-08',
    2013: '2013-03-31',
    2014: '2014-04-20',
    2015: '2015-04-05',
    2016: '2016-03-27',
    2017: '2017-04-16',
    2018: '2018-04-01',
    2019: '2019-04-21',
    2020: '2020-04-12',
    2021: '2021-04-04',
    2022: '2022-04-17',
    2023: '2023-04-09',
    2024: '2024-03-31',
    2025: '2025-04-20',
    // Future dates
    2026: '2026-04-05',
    2027: '2027-03-28',
    2028: '2028-04-16',
    2029: '2029-04-01',
    2030: '2030-04-21',
    2031: '2031-04-13',
    2032: '2032-03-28',
    2033: '2033-04-17',
    2034: '2034-04-09',
    2035: '2035-03-25',
    // Edge cases - earliest possible (March 22) and latest possible (April 25)
    1818: '1818-03-22', // Earliest Easter in 19th-20th century
    2285: '2285-03-22', // Next earliest Easter
    1943: '1943-04-25', // Latest Easter in 20th century
    2038: '2038-04-25', // Latest Easter in 21st century
  };

  Object.entries(officialEasterDates).forEach(([year, expected]) => {
    it(`Easter ${year} should be ${expected}`, () => {
      const computed = pascha(parseInt(year));
      expect(formatDate(computed)).toBe(expected);
    });
  });
});

describe('Moveable Feasts Validation', () => {
  // Test that moveable feasts are correctly offset from Easter
  const testYears = [2024, 2025, 2026, 2027, 2028];

  testYears.forEach(year => {
    const easter = pascha(year);
    const easterDate = easter.getDate();
    const easterMonth = easter.getMonth();

    describe(`Year ${year} (Easter: ${formatDate(easter)})`, () => {
      it('Ascension (Thursday) should be 39 days after Easter', () => {
        const asc = ascensio(year, false); // Traditional Thursday
        const diffDays = Math.round((asc.getTime() - easter.getTime()) / (1000 * 60 * 60 * 24));
        expect(diffDays).toBe(39);
        expect(asc.getDay()).toBe(4); // Thursday
      });

      it('Pentecost should be 49 days after Easter (Sunday)', () => {
        const pent = pentecostes(year);
        const diffDays = Math.round((pent.getTime() - easter.getTime()) / (1000 * 60 * 60 * 24));
        expect(diffDays).toBe(49);
        expect(pent.getDay()).toBe(0); // Sunday
      });

      it('Corpus Christi (Thursday) should be 60 days after Easter', () => {
        const corpus = corpusChristi(year, false); // Traditional Thursday
        const diffDays = Math.round((corpus.getTime() - easter.getTime()) / (1000 * 60 * 60 * 24));
        expect(diffDays).toBe(60);
        expect(corpus.getDay()).toBe(4); // Thursday
      });

      it('First Sunday of Advent should be 4 Sundays before Christmas', () => {
        const advent = dominicaIAdventus(year);
        expect(advent.getDay()).toBe(0); // Must be Sunday

        // Christmas of the same liturgical year
        const christmas = new Date(year, 11, 25);
        const diffDays = Math.round((christmas.getTime() - advent.getTime()) / (1000 * 60 * 60 * 24));

        // Should be between 22 and 28 days before Christmas
        expect(diffDays).toBeGreaterThanOrEqual(22);
        expect(diffDays).toBeLessThanOrEqual(28);
      });

      it('First Sunday of Lent should be 4 days after Ash Wednesday', () => {
        const ashWed = feriaIVCinerum(year);
        expect(ashWed.getDay()).toBe(3); // Must be Wednesday

        // First Sunday of Lent is 4 days after Ash Wednesday
        const lent1 = addDies(ashWed, 4);
        expect(lent1.getDay()).toBe(0); // Must be Sunday

        // And 42 days (6 weeks) before Easter
        const diffDays = Math.round((easter.getTime() - lent1.getTime()) / (1000 * 60 * 60 * 24));
        expect(diffDays).toBe(42);
      });
    });
  });
});

describe('Liturgical Year Boundaries', () => {
  it('Advent should start in November or early December', () => {
    for (let year = 2020; year <= 2030; year++) {
      const advent = dominicaIAdventus(year);
      const month = advent.getMonth();
      const day = advent.getDate();

      // Advent 1 is between Nov 27 and Dec 3
      if (month === 10) { // November
        expect(day).toBeGreaterThanOrEqual(27);
      } else if (month === 11) { // December
        expect(day).toBeLessThanOrEqual(3);
      } else {
        throw new Error(`Invalid Advent date: ${formatDate(advent)}`);
      }
    }
  });
});

describe('Edge Cases and Known Issues', () => {
  it('Leap year handling - Feb 29 should not cause issues', () => {
    // 2024 is a leap year
    const easter2024 = pascha(2024);
    expect(formatDate(easter2024)).toBe('2024-03-31');

    // Test that dates after Feb 29 are correct
    const pent2024 = pentecostes(2024);
    expect(formatDate(pent2024)).toBe('2024-05-19');
  });

  it('Year boundary - liturgical year spans calendar years', () => {
    // Advent 2024 starts in late November/early December 2024
    const advent2024 = dominicaIAdventus(2024);
    expect(advent2024.getFullYear()).toBe(2024);
    expect(advent2024.getMonth()).toBe(11); // December
    expect(advent2024.getDate()).toBe(1);

    // But Easter 2025 is in April 2025
    const easter2025 = pascha(2025);
    expect(easter2025.getFullYear()).toBe(2025);
  });

  it('Century boundary years (divisible by 100 but not 400)', () => {
    // 1900 was NOT a leap year (divisible by 100 but not 400)
    const easter1900 = pascha(1900);
    expect(formatDate(easter1900)).toBe('1900-04-15');

    // 2000 WAS a leap year (divisible by 400)
    const easter2000 = pascha(2000);
    expect(formatDate(easter2000)).toBe('2000-04-23');

    // 2100 will NOT be a leap year
    const easter2100 = pascha(2100);
    expect(formatDate(easter2100)).toBe('2100-03-28');
  });
});
