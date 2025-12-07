/**
 * CLEDR Calendar - Computus Tests
 * Easter calculation and moveable feasts validation
 */

import { describe, it, expect } from 'vitest';
import {
  computusPaschalis,
  pascha,
  pentecostes,
  ascensio,
  feriaIVCinerum,
  dominicaInPalmis,
  feriaVInCenaDomini,
  feriaVIInPassioneDomini,
  sabbatumSanctum,
  corpusChristi,
  christusRex,
  dominicaIAdventus,
  sacraFamilia,
  baptismaDomini,
  tempus,
  hebdomadaTemporis,
  hebdomadaPsalterii,
  cyclusDominicalis,
  cyclusFerialis,
  estDominica,
  diesHebdomadae,
  idemDies
} from '../src/computus';
import { Tempus, CyclusDominicalis, CyclusFerialis } from '../src/types';

/** Helper to format date as YYYY-MM-DD in local time (not UTC) */
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

describe('Computus Paschalis', () => {
  // Known Easter dates for validation (from astronomical tables)
  const knownEasters: Record<number, string> = {
    2020: '2020-04-12',
    2021: '2021-04-04',
    2022: '2022-04-17',
    2023: '2023-04-09',
    2024: '2024-03-31',
    2025: '2025-04-20',
    2026: '2026-04-05',
    2027: '2027-03-28',
    2028: '2028-04-16',
    2029: '2029-04-01',
    2030: '2030-04-21'
  };

  it.each(Object.entries(knownEasters))('should calculate Easter %s correctly', (year, expected) => {
    const easter = pascha(Number(year));
    const formatted = formatDate(easter);
    expect(formatted).toBe(expected);
  });

  it('should return same result from computusPaschalis and pascha', () => {
    for (let year = 2020; year <= 2030; year++) {
      const fromComputus = computusPaschalis(year);
      const fromPascha = pascha(year);
      expect(idemDies(fromComputus, fromPascha)).toBe(true);
    }
  });
});

describe('Moveable Feasts from Easter', () => {
  const year = 2025;
  const easter = pascha(year); // April 20, 2025

  it('should calculate Ash Wednesday (46 days before Easter)', () => {
    const ashWed = feriaIVCinerum(year);
    expect(formatDate(ashWed)).toBe('2025-03-05');
  });

  it('should calculate Palm Sunday (7 days before Easter)', () => {
    const palm = dominicaInPalmis(year);
    expect(formatDate(palm)).toBe('2025-04-13');
  });

  it('should calculate Holy Thursday (3 days before Easter)', () => {
    const holyThurs = feriaVInCenaDomini(year);
    expect(formatDate(holyThurs)).toBe('2025-04-17');
  });

  it('should calculate Good Friday (2 days before Easter)', () => {
    const goodFri = feriaVIInPassioneDomini(year);
    expect(formatDate(goodFri)).toBe('2025-04-18');
  });

  it('should calculate Holy Saturday (1 day before Easter)', () => {
    const holySat = sabbatumSanctum(year);
    expect(formatDate(holySat)).toBe('2025-04-19');
  });

  it('should calculate Pentecost (49 days after Easter)', () => {
    const pent = pentecostes(year);
    expect(formatDate(pent)).toBe('2025-06-08');
  });

  it('should calculate Ascension (default: Sunday celebration)', () => {
    const asc = ascensio(year); // Default inDominica=true
    expect(formatDate(asc)).toBe('2025-06-01');
    expect(asc.getDay()).toBe(0); // Sunday
  });

  it('should calculate Ascension (traditional Thursday)', () => {
    const asc = ascensio(year, false); // inDominica=false
    expect(formatDate(asc)).toBe('2025-05-29');
    expect(asc.getDay()).toBe(4); // Thursday (39 days after Easter)
  });

  it('should calculate Corpus Christi (default: Sunday celebration)', () => {
    const corpus = corpusChristi(year); // Default inDominica=true
    expect(formatDate(corpus)).toBe('2025-06-22');
    expect(corpus.getDay()).toBe(0); // Sunday
  });

  it('should calculate Corpus Christi (traditional Thursday)', () => {
    const corpus = corpusChristi(year, false); // inDominica=false
    expect(formatDate(corpus)).toBe('2025-06-19');
  });
});

describe('Advent and Christmas Cycle', () => {
  it('should calculate First Sunday of Advent', () => {
    // 2024 Advent starts Nov 30, 2024
    const advent2024 = dominicaIAdventus(2024);
    expect(formatDate(advent2024)).toBe('2024-12-01');
    expect(estDominica(advent2024)).toBe(true);

    // 2025 Advent starts Nov 30, 2025
    const advent2025 = dominicaIAdventus(2025);
    expect(formatDate(advent2025)).toBe('2025-11-30');
    expect(estDominica(advent2025)).toBe(true);
  });

  it('should calculate Christ the King (last Sunday before Advent)', () => {
    const ctk2025 = christusRex(2025);
    expect(formatDate(ctk2025)).toBe('2025-11-23');
    expect(estDominica(ctk2025)).toBe(true);
  });

  it('should calculate Holy Family (Sunday in Christmas Octave)', () => {
    // 2025: Dec 25 is Thursday, so Holy Family is Dec 28 (Sunday)
    const hf2025 = sacraFamilia(2025);
    expect(formatDate(hf2025)).toBe('2025-12-28');
    expect(estDominica(hf2025)).toBe(true);
  });

  it('should calculate Baptism of the Lord', () => {
    // 2025: Epiphany Jan 6, Baptism is Sunday Jan 12
    const baptism2025 = baptismaDomini(2025);
    expect(formatDate(baptism2025)).toBe('2025-01-12');
    expect(estDominica(baptism2025)).toBe(true);
  });
});

describe('Liturgical Seasons (Tempora)', () => {
  it('should identify Advent season', () => {
    const dec1_2024 = new Date(2024, 11, 1);
    expect(tempus(dec1_2024)).toBe(Tempus.ADVENTUS);

    const dec24_2024 = new Date(2024, 11, 24);
    expect(tempus(dec24_2024)).toBe(Tempus.ADVENTUS);
  });

  it('should identify Christmas season', () => {
    const dec25_2024 = new Date(2024, 11, 25);
    expect(tempus(dec25_2024)).toBe(Tempus.NATIVITAS);

    const jan6_2025 = new Date(2025, 0, 6);
    expect(tempus(jan6_2025)).toBe(Tempus.NATIVITAS);
  });

  it('should identify Lent season', () => {
    const ashWed2025 = new Date(2025, 2, 5);
    expect(tempus(ashWed2025)).toBe(Tempus.QUADRAGESIMA);

    const palmSun2025 = new Date(2025, 3, 13);
    expect(tempus(palmSun2025)).toBe(Tempus.QUADRAGESIMA);
  });

  it('should identify Paschal Triduum', () => {
    const holyThurs2025 = new Date(2025, 3, 17);
    expect(tempus(holyThurs2025)).toBe(Tempus.TRIDUUM);

    const goodFri2025 = new Date(2025, 3, 18);
    expect(tempus(goodFri2025)).toBe(Tempus.TRIDUUM);

    const holySat2025 = new Date(2025, 3, 19);
    expect(tempus(holySat2025)).toBe(Tempus.TRIDUUM);
  });

  it('should identify Easter season', () => {
    // Easter Sunday itself is part of the Triduum
    const easter2025 = new Date(2025, 3, 20);
    expect(tempus(easter2025)).toBe(Tempus.TRIDUUM);

    // Day after Easter (Monday) starts the Paschal season proper
    const easterMonday = new Date(2025, 3, 21);
    expect(tempus(easterMonday)).toBe(Tempus.PASCHALE);

    // Pentecost is last day of Paschal season
    const pentecost2025 = new Date(2025, 5, 8);
    expect(tempus(pentecost2025)).toBe(Tempus.PASCHALE);
  });

  it('should identify Ordinary Time', () => {
    const jan20_2025 = new Date(2025, 0, 20);
    expect(tempus(jan20_2025)).toBe(Tempus.ORDINARIUM);

    const jul15_2025 = new Date(2025, 6, 15);
    expect(tempus(jul15_2025)).toBe(Tempus.ORDINARIUM);
  });
});

describe('Liturgical Cycles', () => {
  it('should calculate Sunday cycle (A/B/C)', () => {
    // 2025 is Year C (Luke)
    expect(cyclusDominicalis(new Date(2025, 0, 1))).toBe(CyclusDominicalis.C);
    // 2026 is Year A (Matthew)
    expect(cyclusDominicalis(new Date(2026, 0, 1))).toBe(CyclusDominicalis.A);
    // 2027 is Year B (Mark)
    expect(cyclusDominicalis(new Date(2027, 0, 1))).toBe(CyclusDominicalis.B);
  });

  it('should calculate Weekday cycle (I/II)', () => {
    // Odd years are Year I
    expect(cyclusFerialis(new Date(2025, 0, 1))).toBe(CyclusFerialis.I);
    // Even years are Year II
    expect(cyclusFerialis(new Date(2026, 0, 1))).toBe(CyclusFerialis.II);
  });

  it('should calculate Psalter week (1-4)', () => {
    // Psalter week cycles through 1-4
    const week1 = hebdomadaPsalterii(new Date(2025, 0, 6)); // Week 1 of OT
    expect([1, 2, 3, 4]).toContain(week1);
  });
});

describe('Week Calculations', () => {
  it('should calculate week number within season', () => {
    // First week of Advent 2024
    const advent1 = new Date(2024, 11, 1);
    expect(hebdomadaTemporis(advent1)).toBe(1);

    // Second week of Advent
    const advent2 = new Date(2024, 11, 8);
    expect(hebdomadaTemporis(advent2)).toBe(2);
  });

  it('should identify Sundays correctly', () => {
    const sunday = new Date(2025, 0, 5); // Jan 5, 2025 is Sunday
    expect(estDominica(sunday)).toBe(true);
    expect(diesHebdomadae(sunday)).toBe(0);

    const monday = new Date(2025, 0, 6);
    expect(estDominica(monday)).toBe(false);
    expect(diesHebdomadae(monday)).toBe(1);
  });
});

describe('Date Comparison', () => {
  it('should correctly compare same dates', () => {
    const date1 = new Date(2025, 3, 20);
    const date2 = new Date(2025, 3, 20);
    expect(idemDies(date1, date2)).toBe(true);
  });

  it('should correctly compare different dates', () => {
    const date1 = new Date(2025, 3, 20);
    const date2 = new Date(2025, 3, 21);
    expect(idemDies(date1, date2)).toBe(false);
  });

  it('should ignore time when comparing dates', () => {
    const date1 = new Date(2025, 3, 20, 10, 30);
    const date2 = new Date(2025, 3, 20, 15, 45);
    expect(idemDies(date1, date2)).toBe(true);
  });
});
