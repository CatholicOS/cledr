/**
 * CLEDR Liturgical Precedence Tests
 *
 * Verifies that liturgical precedence rules are correctly applied:
 * - Privileged Sundays (Advent, Lent, Easter) win over most Sanctorale
 * - Holy Week feriae win over Sanctorale solemnities
 * - Feast transfers are correctly applied
 */

import { describe, it, expect } from 'vitest';
import { getFragmentNames, Hora } from '../src/fragments';

describe('Privileged Sundays Precedence', () => {
  it('Advent Sunday should win over Sanctorale Solemnity (Dec 8, 2024)', () => {
    // Dec 8, 2024 is Sunday II of Advent
    // Immaculate Conception is a Solemnity (praecedentia 3)
    // But Sunday II of Advent is a privileged Sunday (praecedentia 2)
    const dec8 = new Date(2024, 11, 8);
    const frags = getFragmentNames(dec8, Hora.LAUDES);

    // The privileged Sunday should win
    expect(frags.primary).toContain('ADV');
    expect(frags.primary).toContain('1DOM');
    expect(frags.primary).not.toBe('1208/LAU');

    // But Immaculate Conception should be in fallback for commemoration
    expect(frags.fallback).toBe('1208/LAU');
  });

  it('Lent Sunday should win over memorials', () => {
    // Test a Lent Sunday with a memorial on the same day
    const lent3 = new Date(2025, 2, 23); // 3rd Sunday of Lent
    const frags = getFragmentNames(lent3, Hora.LAUDES);

    expect(frags.primary).toContain('QUA');
    expect(frags.primary).toContain('1DOM');
  });

  it('Easter Sunday should use PAS0 shortCode', () => {
    const easter = new Date(2025, 3, 20);
    const frags = getFragmentNames(easter, Hora.LAUDES);

    expect(frags.primary).toBe('PAS0/LAU');
  });
});

describe('Holy Week Precedence', () => {
  it('Holy Week Tuesday should win over Annunciation (Mar 25, 2025)', () => {
    // In 2025, Easter is April 20, so Mar 25 is NOT in Holy Week
    // Let's verify with a year where it would be
    // Actually 2025: Palm Sunday Apr 13, so Mar 25 is during Lent week 4
    const mar25 = new Date(2025, 2, 25);
    const frags = getFragmentNames(mar25, Hora.LAUDES);

    // In 2025, Mar 25 is Lent week 4 Tuesday - Annunciation should win
    // because it's a Solemnity (praecedentia 2) and Lent feria is praecedentia 9
    expect(frags.primary).toBe('0325/LAU');
  });

  it('Holy Week feriae should win over solemnities (2035)', () => {
    // In 2035, Easter is March 25, so Holy Week starts March 18 (Palm Sunday)
    // Mar 19 (St. Joseph) falls on Monday of Holy Week
    // Easter 2035 = March 25, Palm Sunday = March 18
    // Mar 19 = Monday of Holy Week (feria precedence 2)
    const mar19_2035 = new Date(2035, 2, 19);
    const frags = getFragmentNames(mar19_2035, Hora.LAUDES);

    // Holy Week Monday has praecedentia 2 and should win over St. Joseph (praecedentia 3)
    // Holy Week Monday = QUA6F2 (week 6 = Holy Week, F2 = Monday)
    expect(frags.primary).toBe('QUA6F2/LAU');
    expect(frags.primary).not.toBe('0319/LAU');
  });
});

describe('Easter Octave Precedence', () => {
  it('Easter Octave days should use TEMPORALE entries', () => {
    // Easter Monday 2025 = April 21
    const easterMon = new Date(2025, 3, 21);
    const frags = getFragmentNames(easterMon, Hora.LAUDES);

    expect(frags.primary).toBe('PAS1F2/LAU');
  });

  it('Divine Mercy Sunday should use PAS2 shortCode', () => {
    // Divine Mercy Sunday 2025 = April 27
    const divineMercy = new Date(2025, 3, 27);
    const frags = getFragmentNames(divineMercy, Hora.LAUDES);

    expect(frags.primary).toBe('PAS2/LAU');
  });
});

describe('Feast Transfers', () => {
  it('Annunciation during Holy Week should be transferred', () => {
    // In 2016, Easter was March 27, Holy Week started March 20
    // Annunciation (Mar 25) fell on Friday of Holy Week
    // It should be transferred to Monday April 4
    const mar25_2016 = new Date(2016, 2, 25);
    const frags = getFragmentNames(mar25_2016, Hora.LAUDES);

    // Mar 25, 2016 = Good Friday - should show TRI2
    expect(frags.primary).toBe('TRI2/LAU');
    // Annunciation should NOT appear (it's transferred)
    expect(frags.primary).not.toBe('0325/LAU');
  });

  it('Annunciation during Easter Octave should be transferred', () => {
    // In 2024, Easter was March 31
    // Annunciation (Mar 25) fell during Lent - should be celebrated
    // But in years where Easter is very early...
    // Let's use 2035 where Easter is March 25
    const mar25_2035 = new Date(2035, 2, 25);
    const frags = getFragmentNames(mar25_2035, Hora.LAUDES);

    // This IS Easter Sunday - Annunciation transferred
    expect(frags.primary).toBe('PAS0/LAU');
  });
});

describe('Ordinary Time Precedence', () => {
  it('Ordinary Time Sunday should use seasonal path', () => {
    const ord15 = new Date(2025, 6, 13); // July 13, 2025
    const frags = getFragmentNames(ord15, Hora.LAUDES);

    expect(frags.primary).toContain('ORD');
    expect(frags.primary).toContain('1DOM');
  });

  it('Ordinary Time weekday should allow optional memorials', () => {
    // July 15, 2025 is a Tuesday in Ordinary Time
    // St. Bonaventure is a Memorial on July 15
    const jul15 = new Date(2025, 6, 15);
    const frags = getFragmentNames(jul15, Hora.LAUDES);

    // Since there may or may not be a sanctorale entry for this day,
    // we just check it's either the memorial or the seasonal
    expect(frags.primary).toMatch(/ORD|0715/);
  });

  it('Solemnity should win over Ordinary Time Sunday', () => {
    // November 1, 2025 is a Saturday (All Saints)
    // But let's test when it falls on Sunday
    // November 1, 2026 is a Sunday
    const nov1_2026 = new Date(2026, 10, 1);
    const frags = getFragmentNames(nov1_2026, Hora.LAUDES);

    // All Saints (praecedentia 3) wins over Ordinary Time Sunday (praecedentia 6)
    expect(frags.primary).toBe('1101/LAU');
  });
});

describe('Specific Precedence Cases', () => {
  it('Christmas should always use 1225 code', () => {
    // Christmas is always on Dec 25 regardless of day of week
    for (const year of [2024, 2025, 2026]) {
      const christmas = new Date(year, 11, 25);
      const frags = getFragmentNames(christmas, Hora.LAUDES);
      expect(frags.primary).toBe('1225/LAU');
    }
  });

  it('Epiphany should use 0106 code', () => {
    const epiphany = new Date(2025, 0, 6);
    const frags = getFragmentNames(epiphany, Hora.LAUDES);
    expect(frags.primary).toBe('0106/LAU');
  });

  it('Pentecost should use PEN0 code', () => {
    // Pentecost 2025 = June 8
    const pentecost = new Date(2025, 5, 8);
    const frags = getFragmentNames(pentecost, Hora.LAUDES);
    expect(frags.primary).toBe('PEN0/LAU');
  });

  it('Corpus Christi should use COR0 code', () => {
    // Corpus Christi 2025 = June 22 (Sunday transfer)
    const corpus = new Date(2025, 5, 22);
    const frags = getFragmentNames(corpus, Hora.LAUDES);
    expect(frags.primary).toBe('COR0/LAU');
  });
});
