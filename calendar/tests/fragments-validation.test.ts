/**
 * CLEDR Fragment Generator Validation Tests
 *
 * Verifies that fragment paths are correctly generated for all liturgical cases:
 * - Solemnities (proprium with short codes)
 * - Feasts (proprium with short codes)
 * - Memorials (proprium with common fallback)
 * - Ferial days (seasonal)
 * - Sundays (seasonal with cycle)
 * - Special days (Triduum, Ash Wednesday, etc.)
 *
 * Short code format:
 * - Sanctorale: MMDD (e.g., 1225 for Christmas)
 * - Temporale: TEM + number (e.g., PAS0 for Easter, TRI1 for Holy Thursday)
 */

import { describe, it, expect } from 'vitest';
import { getFragmentNames, Hora } from '../src/fragments';

describe('Fragment Generation - Solemnities', () => {
  it('Christmas should use 1225/{hora}', () => {
    const christmas = new Date(2025, 11, 25);
    const frags = getFragmentNames(christmas, Hora.MISSA_COLLECTA);

    expect(frags.primary).toBe('1225/MIS-COL');
    expect(frags.fallback).toContain('sancti/12/25');
  });

  it('Easter Sunday should use PAS0/{hora}', () => {
    const easter = new Date(2025, 3, 20);
    const frags = getFragmentNames(easter, Hora.LAUDES);

    expect(frags.primary).toBe('PAS0/LAU');
    expect(frags.fallback).toContain('TRI');
  });

  it('Epiphany should use 0106/{hora}', () => {
    const epiphany = new Date(2025, 0, 6);
    const frags = getFragmentNames(epiphany, Hora.VESPERAE);

    expect(frags.primary).toBe('0106/VES');
  });

  it('Pentecost should use PEN0/{hora}', () => {
    const pentecost = new Date(2025, 5, 8);
    const frags = getFragmentNames(pentecost, Hora.MISSA_EVANGELIUM);

    expect(frags.primary).toBe('PEN0/MIS-EV');
  });

  it('Assumption (Aug 15) should use 0815/{hora}', () => {
    const assumption = new Date(2025, 7, 15);
    const frags = getFragmentNames(assumption, Hora.LAUDES);

    expect(frags.primary).toBe('0815/LAU');
  });

  it('All Saints (Nov 1) should use 1101/{hora}', () => {
    const allSaints = new Date(2025, 10, 1);
    const frags = getFragmentNames(allSaints, Hora.MISSA_COLLECTA);

    expect(frags.primary).toBe('1101/MIS-COL');
  });

  it('Immaculate Conception (Dec 8) should use 1208/{hora}', () => {
    const immaculate = new Date(2025, 11, 8);
    const frags = getFragmentNames(immaculate, Hora.LAUDES);

    expect(frags.primary).toBe('1208/LAU');
  });

  it('SS. Peter and Paul (Jun 29) should use 0629/{hora}', () => {
    const peterPaul = new Date(2025, 5, 29);
    const frags = getFragmentNames(peterPaul, Hora.OFFICIUM_LECTIONIS);

    expect(frags.primary).toBe('0629/OL');
    expect(frags.common).toBe('commune/apostoli/OL');
  });
});

describe('Fragment Generation - Holy Week and Triduum', () => {
  it('Palm Sunday should use QUA6/{hora}', () => {
    const palmSunday = new Date(2025, 3, 13);
    const frags = getFragmentNames(palmSunday, Hora.MISSA_EVANGELIUM);

    expect(frags.primary).toBe('QUA6/MIS-EV');
  });

  it('Holy Thursday should use TRI1/{hora}', () => {
    const holyThursday = new Date(2025, 3, 17);
    const frags = getFragmentNames(holyThursday, Hora.MISSA_COLLECTA);

    expect(frags.primary).toBe('TRI1/MIS-COL');
  });

  it('Good Friday should use TRI2/{hora}', () => {
    const goodFriday = new Date(2025, 3, 18);
    const frags = getFragmentNames(goodFriday, Hora.LAUDES);

    expect(frags.primary).toBe('TRI2/LAU');
  });

  it('Holy Saturday should use TRI3/{hora}', () => {
    const holySaturday = new Date(2025, 3, 19);
    const frags = getFragmentNames(holySaturday, Hora.OFFICIUM_LECTIONIS);

    expect(frags.primary).toBe('TRI3/OL');
  });
});

describe('Fragment Generation - Advent', () => {
  it('Advent Sunday should use seasonal path with Sunday cycle', () => {
    const advent2 = new Date(2025, 11, 7); // 2nd Sunday of Advent
    const frags = getFragmentNames(advent2, Hora.LAUDES);

    expect(frags.primary).toContain('ADV');
    expect(frags.primary).toContain('1DOM');
    expect(frags.bmdPath).toContain('/A/'); // Year A cycle
  });

  it('Advent weekday should use seasonal path with weekday cycle', () => {
    const adventWeekday = new Date(2025, 11, 9); // Tuesday of Advent 2
    const frags = getFragmentNames(adventWeekday, Hora.LAUDES);

    expect(frags.primary).toContain('ADV');
    expect(frags.primary).toContain('3MAR');
    // Advent 2025 = liturgical year 2026 = even year = cycle II
    expect(frags.bmdPath).toContain('/II/');
  });

  it('December 17-24 should be special Advent days', () => {
    const dec17 = new Date(2025, 11, 17);
    const frags = getFragmentNames(dec17, Hora.LAUDES);

    // These days have special antiphons (O Antiphons)
    expect(frags.primary).toContain('ADV');
  });
});

describe('Fragment Generation - Lent', () => {
  it('Ash Wednesday should use shortCode QUA0', () => {
    const ashWed = new Date(2025, 2, 5);
    const frags = getFragmentNames(ashWed, Hora.MISSA_COLLECTA);

    // Ash Wednesday is in TEMPORALE with shortCode QUA0
    expect(frags.primary).toBe('QUA0/MIS-COL');
  });

  it('Lent Sunday should use seasonal path', () => {
    const lent3 = new Date(2025, 2, 23); // 3rd Sunday of Lent
    const frags = getFragmentNames(lent3, Hora.VESPERAE);

    expect(frags.primary).toContain('QUA');
    expect(frags.primary).toContain('1DOM');
  });

  it('Lent weekday should use seasonal path', () => {
    const lentFriday = new Date(2025, 2, 28); // Friday of Lent 3
    const frags = getFragmentNames(lentFriday, Hora.LAUDES);

    expect(frags.primary).toContain('QUA');
    expect(frags.primary).toContain('6VEN');
  });
});

describe('Fragment Generation - Easter Season', () => {
  it('Easter Octave days should use PAS{week}F{day}/{hora}', () => {
    const easterTuesday = new Date(2025, 3, 22); // Tuesday of Easter week
    const frags = getFragmentNames(easterTuesday, Hora.LAUDES);

    // Easter Octave uses short codes like PAS1F3 (week 1, feria 3)
    expect(frags.primary).toBe('PAS1F3/LAU');
  });

  it('Easter season Sunday should use seasonal path', () => {
    const easter4 = new Date(2025, 4, 11); // 4th Sunday of Easter
    const frags = getFragmentNames(easter4, Hora.MISSA_COLLECTA);

    expect(frags.primary).toContain('PAS');
    expect(frags.primary).toContain('1DOM');
  });
});

describe('Fragment Generation - Ordinary Time', () => {
  it('Ordinary Time Sunday should use seasonal path with cycle', () => {
    const ord15 = new Date(2025, 6, 13); // 15th Sunday OT
    const frags = getFragmentNames(ord15, Hora.LAUDES);

    expect(frags.primary).toContain('ORD');
    expect(frags.primary).toContain('1DOM');
    expect(frags.bmdPath).toContain('/C/'); // Year C cycle for 2025
  });

  it('Ordinary Time weekday should use seasonal path', () => {
    const ordTuesday = new Date(2025, 6, 15); // Tuesday week 15
    const frags = getFragmentNames(ordTuesday, Hora.LAUDES);

    expect(frags.primary).toBe('ORD/15/3MAR/LAU');
    expect(frags.bmdPath).toBe('ORD/15/3MAR/I/LAU');
    expect(frags.eprexCode).toBe('ORD153MAR-LAU');
  });

  it('Saturday in Ordinary Time should use correct code', () => {
    const ordSaturday = new Date(2025, 6, 19);
    const frags = getFragmentNames(ordSaturday, Hora.LAUDES);

    expect(frags.primary).toContain('7SAB');
  });
});

describe('Fragment Generation - All Liturgical Hours', () => {
  const testDate = new Date(2025, 6, 15); // Ordinary Tuesday

  const expectedHours: [Hora, string][] = [
    [Hora.INVITATORIUM, 'INV'],
    [Hora.OFFICIUM_LECTIONIS, 'OL'],
    [Hora.LAUDES, 'LAU'],
    [Hora.TERTIA, 'TER'],
    [Hora.SEXTA, 'SEX'],
    [Hora.NONA, 'NON'],
    [Hora.VESPERAE, 'VES'],
    [Hora.COMPLETORIUM, 'COM'],
    [Hora.MISSA_INTROITUS, 'MIS-INT'],
    [Hora.MISSA_COLLECTA, 'MIS-COL'],
    [Hora.MISSA_LECTIO_I, 'MIS-L1'],
    [Hora.MISSA_PSALMUS, 'MIS-PS'],
    [Hora.MISSA_LECTIO_II, 'MIS-L2'],
    [Hora.MISSA_EVANGELIUM, 'MIS-EV'],
    [Hora.MISSA_SUPER_OBLATA, 'MIS-SO'],
    [Hora.MISSA_PRAEFATIO, 'MIS-PR'],
    [Hora.MISSA_POST_COMMUNIONEM, 'MIS-PC'],
  ];

  expectedHours.forEach(([hora, code]) => {
    it(`should generate correct path for ${hora}`, () => {
      const frags = getFragmentNames(testDate, hora);

      expect(frags.primary).toContain(code);
      expect(frags.bmdPath).toContain(code);
      expect(frags.eprexCode).toContain(code);
    });
  });
});

describe('Fragment Generation - ePrex Code Format', () => {
  it('ePrex code should follow format: {TEMPUS}{WEEK}{DAY}-{HORA}', () => {
    const testCases = [
      { date: new Date(2025, 6, 15), hora: Hora.LAUDES, expected: 'ORD153MAR-LAU' },
      { date: new Date(2025, 11, 14), hora: Hora.VESPERAE, expected: 'ADV031DOM-VES' },
      { date: new Date(2025, 2, 21), hora: Hora.LAUDES, expected: 'QUA026VEN-LAU' },
      { date: new Date(2025, 4, 15), hora: Hora.MISSA_COLLECTA, expected: 'PAS045IOV-MIS-COL' },
    ];

    testCases.forEach(({ date, hora, expected }) => {
      const frags = getFragmentNames(date, hora);
      expect(frags.eprexCode).toBe(expected);
    });
  });
});

describe('Fragment Generation - Lectionary Cycles', () => {
  it('Sunday cycle should be A, B, or C based on year', () => {
    // 2025 = Year C (2025 % 3 = 2 → C)
    const sunday2025 = new Date(2025, 6, 13);
    const frags2025 = getFragmentNames(sunday2025, Hora.LAUDES);
    expect(frags2025.lectionary.sunday).toBe('C');

    // 2026 = Year A (2026 % 3 = 0 → A)
    const sunday2026 = new Date(2026, 6, 12);
    const frags2026 = getFragmentNames(sunday2026, Hora.LAUDES);
    expect(frags2026.lectionary.sunday).toBe('A');

    // 2027 = Year B (2027 % 3 = 1 → B)
    const sunday2027 = new Date(2027, 6, 11);
    const frags2027 = getFragmentNames(sunday2027, Hora.LAUDES);
    expect(frags2027.lectionary.sunday).toBe('B');
  });

  it('Weekday cycle should be I or II based on year', () => {
    // Odd years = I, Even years = II
    const weekday2025 = new Date(2025, 6, 15);
    const frags2025 = getFragmentNames(weekday2025, Hora.LAUDES);
    expect(frags2025.lectionary.weekday).toBe('I');

    const weekday2026 = new Date(2026, 6, 14);
    const frags2026 = getFragmentNames(weekday2026, Hora.LAUDES);
    expect(frags2026.lectionary.weekday).toBe('II');
  });
});

describe('Fragment Generation - Common Texts Fallback', () => {
  it('Apostle feast should have apostoli common', () => {
    const peterPaul = new Date(2025, 5, 29);
    const frags = getFragmentNames(peterPaul, Hora.LAUDES);

    expect(frags.common).toBe('commune/apostoli/LAU');
  });

  it('Ferial day should have feria common', () => {
    const weekday = new Date(2025, 6, 15);
    const frags = getFragmentNames(weekday, Hora.LAUDES);

    expect(frags.common).toBe('commune/feria/LAU');
  });
});

describe('Fragment Generation - Week Numbers', () => {
  it('Week numbers should be zero-padded', () => {
    // Week 1 of Ordinary Time
    const ord1 = new Date(2025, 0, 14); // After Baptism of Lord
    const frags1 = getFragmentNames(ord1, Hora.LAUDES);
    expect(frags1.primary).toContain('/01/');

    // Week 15 of Ordinary Time
    const ord15 = new Date(2025, 6, 15);
    const frags15 = getFragmentNames(ord15, Hora.LAUDES);
    expect(frags15.primary).toContain('/15/');
  });
});

describe('Fragment Generation - Short Code Format', () => {
  it('Sanctorale codes should be MMDD/{hora}', () => {
    const cases = [
      { date: new Date(2025, 11, 25), expected: '1225/LAU' }, // Christmas
      { date: new Date(2025, 0, 6), expected: '0106/LAU' },   // Epiphany
      { date: new Date(2025, 7, 15), expected: '0815/LAU' },  // Assumption
      { date: new Date(2025, 5, 29), expected: '0629/LAU' },  // Peter & Paul
    ];

    cases.forEach(({ date, expected }) => {
      const frags = getFragmentNames(date, Hora.LAUDES);
      expect(frags.primary).toBe(expected);
    });
  });

  it('Temporale codes should use short Latin abbreviations', () => {
    const cases = [
      { date: new Date(2025, 3, 20), expected: 'PAS0/LAU' },  // Easter
      { date: new Date(2025, 5, 8), expected: 'PEN0/LAU' },   // Pentecost
      { date: new Date(2025, 3, 17), expected: 'TRI1/LAU' },  // Holy Thursday
      { date: new Date(2025, 3, 18), expected: 'TRI2/LAU' },  // Good Friday
    ];

    cases.forEach(({ date, expected }) => {
      const frags = getFragmentNames(date, Hora.LAUDES);
      expect(frags.primary).toBe(expected);
    });
  });
});
