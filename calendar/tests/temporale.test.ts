/**
 * CLEDR Calendar - Temporale Tests
 * Moveable feasts validation
 */

import { describe, it, expect } from 'vitest';
import {
  TEMPORALE,
  findTemporale,
  findTemporaleCelebration,
  getTemporaleAnno
} from '../src/temporale';
import { pascha, idemDies } from '../src/computus';
import { Gradus, Praecedentia, Color, Genus } from '../src/types';

/** Helper to format date as YYYY-MM-DD in local time (not UTC) */
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

describe('TEMPORALE Data Structure', () => {
  it('should have at least 30 moveable feasts', () => {
    expect(TEMPORALE.length).toBeGreaterThanOrEqual(30);
  });

  it('should have unique codes', () => {
    const codes = TEMPORALE.map(d => d.code);
    const uniqueCodes = new Set(codes);
    expect(uniqueCodes.size).toBe(codes.length);
  });

  it('should have unique IDs', () => {
    const ids = TEMPORALE.map(d => d.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('should have Latin names for all entries', () => {
    for (const dies of TEMPORALE) {
      expect(dies.nomina.la).toBeDefined();
      expect(dies.nomina.la.length).toBeGreaterThan(0);
    }
  });

  it('should have valid gradus for all entries', () => {
    const validGradus = Object.values(Gradus);
    for (const dies of TEMPORALE) {
      expect(validGradus).toContain(dies.gradus);
    }
  });

  it('should have valid praecedentia for all entries', () => {
    const validPraecedentia = Object.values(Praecedentia);
    for (const dies of TEMPORALE) {
      expect(validPraecedentia).toContain(dies.praecedentia);
    }
  });

  it('should have at least one color for all entries', () => {
    for (const dies of TEMPORALE) {
      expect(dies.colores.length).toBeGreaterThan(0);
    }
  });

  it('should have genus TEMPORALE for all entries', () => {
    for (const dies of TEMPORALE) {
      expect(dies.genus).toBe(Genus.TEMPORALE);
    }
  });
});

describe('Temporale Lookup', () => {
  const year = 2025;
  const easter = pascha(year);

  it('should find Easter Sunday', () => {
    const found = findTemporale(easter);
    expect(found).not.toBeNull();
    expect(found?.id).toBe('easter_sunday');
    expect(found?.nomina.la).toBe('Dominica Paschae in Resurrectione Domini');
  });

  it('should find Ash Wednesday', () => {
    const ashWed = new Date(2025, 2, 5);
    const found = findTemporale(ashWed);
    expect(found).not.toBeNull();
    expect(found?.id).toBe('ash_wednesday');
    expect(found?.nomina.la).toBe('Feria IV Cinerum');
  });

  it('should find Pentecost', () => {
    const pentecost = new Date(2025, 5, 8);
    const found = findTemporale(pentecost);
    expect(found).not.toBeNull();
    expect(found?.id).toBe('pentecost_sunday');
    expect(found?.colores).toContain(Color.RUBER);
  });

  it('should find Holy Thursday', () => {
    const holyThurs = new Date(2025, 3, 17);
    const found = findTemporale(holyThurs);
    expect(found).not.toBeNull();
    expect(found?.id).toBe('holy_thursday');
    expect(found?.praecedentia).toBe(Praecedentia.TRIDUUM_1);
  });

  it('should find Good Friday', () => {
    const goodFri = new Date(2025, 3, 18);
    const found = findTemporale(goodFri);
    expect(found).not.toBeNull();
    expect(found?.id).toBe('good_friday');
    expect(found?.colores).toContain(Color.RUBER);
  });

  it('should return null for ordinary weekday', () => {
    const ordinaryDay = new Date(2025, 6, 15); // July 15
    const found = findTemporale(ordinaryDay);
    expect(found).toBeNull();
  });

  it('findTemporaleCelebration should be alias for findTemporale', () => {
    const date = easter;
    const fromFind = findTemporale(date);
    const fromCelebration = findTemporaleCelebration(date);
    expect(fromFind).toEqual(fromCelebration);
  });
});

describe('Temporale Anno', () => {
  it('should return all temporale celebrations for a year', () => {
    const anno = getTemporaleAnno(2025);
    expect(anno.length).toBeGreaterThan(20);
  });

  it('should return celebrations sorted by date', () => {
    const anno = getTemporaleAnno(2025);
    for (let i = 1; i < anno.length; i++) {
      expect(anno[i].date.getTime()).toBeGreaterThanOrEqual(anno[i - 1].date.getTime());
    }
  });

  it('should include Easter in the year list', () => {
    const anno = getTemporaleAnno(2025);
    const easterEntry = anno.find(e => e.dies.id === 'easter_sunday');
    expect(easterEntry).toBeDefined();
    expect(formatDate(easterEntry!.date)).toBe('2025-04-20');
  });
});

describe('Triduum Precedence', () => {
  it('should have highest precedence (level 1) for Triduum days', () => {
    const triduumIds = ['holy_thursday', 'good_friday', 'holy_saturday', 'easter_sunday'];

    for (const id of triduumIds) {
      const dies = TEMPORALE.find(d => d.id === id);
      expect(dies).toBeDefined();
      expect(dies?.praecedentia).toBe(Praecedentia.TRIDUUM_1);
      expect(dies?.priority).toBe(100);
    }
  });
});

describe('Easter Octave', () => {
  it('should have all 7 days of Easter Octave', () => {
    const octaveIds = [
      'monday_of_easter_octave',
      'tuesday_of_easter_octave',
      'wednesday_of_easter_octave',
      'thursday_of_easter_octave',
      'friday_of_easter_octave',
      'saturday_of_easter_octave',
      'divine_mercy_sunday'
    ];

    for (const id of octaveIds) {
      const dies = TEMPORALE.find(d => d.id === id);
      expect(dies).toBeDefined();
      expect(dies?.colores).toContain(Color.ALBUS);
    }
  });
});
