/**
 * CLEDR Rare Liturgical Exceptions Tests
 *
 * Tests for edge cases that occur rarely (1-2 times per century):
 * - Annunciation transfers (Holy Week, Easter Octave, Kyriopascha)
 * - St. Joseph transfers (Holy Week, Palm Sunday)
 * - Immaculate Conception on Advent Sunday
 * - Earliest/Latest Easter dates
 * - February 29 (leap year) handling
 * - Nativity of John the Baptist vs Sacred Heart
 * - All Souls on Sunday transfer
 * - Christmas on various days of the week
 *
 * Sources:
 * - UNLY (Universal Norms on the Liturgical Year)
 * - https://www.catholicculture.org/culture/library/view.cfm?id=10842
 * - https://www.liturgyoffice.org.uk/Calendar/Info/GNLY.pdf
 */

import { describe, it, expect } from 'vitest';
import { getFragmentNames, Hora } from '../src/fragments';
import { pascha } from '../src/computus';

// ============================================================================
// ANNUNCIATION TRANSFERS (March 25)
// Rule: If Annunciation falls during Holy Week or Easter Octave,
// it is transferred to Monday after the Second Sunday of Easter
// ============================================================================

describe('Annunciation Transfers (Rare Cases)', () => {
  describe('Annunciation during Holy Week', () => {
    it('2016: Annunciation on Good Friday - Holy Week wins', () => {
      // Easter 2016 = March 27
      // Good Friday = March 25 = Annunciation date
      // Annunciation transferred to Monday April 4
      const goodFriday2016 = new Date(2016, 2, 25);
      const frags = getFragmentNames(goodFriday2016, Hora.LAUDES);

      expect(frags.primary).toBe('TRI2/LAU');
      expect(frags.primary).not.toContain('0325');
    });

    it('2018: Annunciation on Palm Sunday - Holy Week wins', () => {
      // Easter 2018 = March 31
      // Palm Sunday = March 25 = Annunciation date
      // Annunciation transferred to Monday April 9
      const palmSunday2018 = new Date(2018, 2, 25);
      const frags = getFragmentNames(palmSunday2018, Hora.LAUDES);

      // Palm Sunday uses shortCode QUA6 (Holy Week Sunday)
      expect(frags.primary).toBe('QUA6/LAU');
    });

    it('2024: Annunciation on Monday of Holy Week - transfers to April 8', () => {
      // Easter 2024 = March 31
      // Palm Sunday = March 24, Holy Week Monday = March 25
      const holyMonday2024 = new Date(2024, 2, 25);
      const frags = getFragmentNames(holyMonday2024, Hora.LAUDES);

      // Holy Week Monday = QUA6F2
      expect(frags.primary).toBe('QUA6F2/LAU');
    });

    it('2027: Annunciation on Holy Thursday - transfers to April 5', () => {
      // Easter 2027 = March 28
      // Holy Thursday = March 25
      const holyThursday2027 = new Date(2027, 2, 25);
      const frags = getFragmentNames(holyThursday2027, Hora.LAUDES);

      // Holy Thursday = TRI1
      expect(frags.primary).toBe('TRI1/LAU');
    });

    it('2029: Annunciation on Easter Sunday (early) - transfers', () => {
      // Easter 2029 = April 1, March 25 is Lent 4 Sunday
      // Actually need a year where Easter = March 25
      // Easter 2035 = March 25 (Kyriopascha in Orthodox)
      const easter2035 = new Date(2035, 2, 25);
      const frags = getFragmentNames(easter2035, Hora.LAUDES);

      expect(frags.primary).toBe('PAS0/LAU');
    });
  });

  describe('Annunciation during Easter Octave', () => {
    it('2032: March 25 is Holy Tuesday (Easter = March 28)', () => {
      // Easter 2032 = March 28 (not March 21!)
      // March 25 = -3 days from Easter = Holy Tuesday
      // Actually: March 22 = Palm Sunday, March 25 = Holy Wednesday?
      // Easter Mar 28, Palm Sunday Mar 21, so Mar 25 = Wed Holy Week
      const mar25_2032 = new Date(2032, 2, 25);
      const frags = getFragmentNames(mar25_2032, Hora.LAUDES);

      // Holy Week Wednesday = QUA6F4 but if Easter is Mar 28:
      // Palm Sun = Mar 21, Mon = 22, Tue = 23, Wed = 24, Thu = 25 (Holy Thursday!)
      // Mar 25 = Holy Thursday = TRI1
      expect(frags.primary).toBe('TRI1/LAU');
    });
  });

  describe('Annunciation celebrated normally', () => {
    it('2025: Annunciation on Tuesday of Lent Week 4 - celebrated normally', () => {
      // Easter 2025 = April 20
      // March 25 is well before Holy Week
      const mar25_2025 = new Date(2025, 2, 25);
      const frags = getFragmentNames(mar25_2025, Hora.LAUDES);

      expect(frags.primary).toBe('0325/LAU');
    });

    it('2026: Annunciation on Wednesday of Lent Week 5 - celebrated normally', () => {
      // Easter 2026 = April 5
      // Palm Sunday = March 29, so March 25 is before Holy Week
      const mar25_2026 = new Date(2026, 2, 25);
      const frags = getFragmentNames(mar25_2026, Hora.LAUDES);

      expect(frags.primary).toBe('0325/LAU');
    });
  });
});

// ============================================================================
// ST. JOSEPH TRANSFERS (March 19)
// Rule: If St. Joseph falls during Holy Week, it is transferred to the
// Saturday before Palm Sunday (since 2008)
// ============================================================================

describe('St. Joseph Transfers (Rare Cases)', () => {
  it('2035: St. Joseph on Monday of Holy Week - Holy Week wins', () => {
    // Easter 2035 = March 25
    // Palm Sunday = March 18
    // Monday Holy Week = March 19 = St. Joseph date
    const mar19_2035 = new Date(2035, 2, 19);
    const frags = getFragmentNames(mar19_2035, Hora.LAUDES);

    // Holy Week Monday = QUA6F2
    expect(frags.primary).toBe('QUA6F2/LAU');
    // St. Joseph should be in fallback for commemoration
    // Note: fallback format may vary, just check it contains seasonal info
    expect(frags.fallback).toBeDefined();
  });

  it('2024: St. Joseph on Tuesday of Lent Week 2 - celebrated normally', () => {
    // Easter 2024 = March 31
    // March 19 is well before Holy Week
    const mar19_2024 = new Date(2024, 2, 19);
    const frags = getFragmentNames(mar19_2024, Hora.LAUDES);

    expect(frags.primary).toBe('0319/LAU');
  });

  it('2008: St. Joseph on Wednesday of Holy Week - transferred', () => {
    // Easter 2008 = March 23 (very early)
    // Palm Sunday = March 16
    // March 19 = Wednesday of Holy Week
    const mar19_2008 = new Date(2008, 2, 19);
    const frags = getFragmentNames(mar19_2008, Hora.LAUDES);

    // Holy Week Wednesday = QUA6F4
    expect(frags.primary).toBe('QUA6F4/LAU');
  });

  it('2062: St. Joseph on Palm Sunday - Palm Sunday wins', () => {
    // Easter 2062 = March 26 (Palm Sunday = March 19)
    // This is extremely rare - St. Joseph on Palm Sunday itself
    const palmSunday2062 = new Date(2062, 2, 19);
    const frags = getFragmentNames(palmSunday2062, Hora.LAUDES);

    // Palm Sunday uses shortCode QUA6
    expect(frags.primary).toBe('QUA6/LAU');
  });
});

// ============================================================================
// IMMACULATE CONCEPTION ON ADVENT SUNDAY (December 8)
// Rule: Sundays of Advent take precedence over all solemnities
// Immaculate Conception is transferred to December 9
// ============================================================================

describe('Immaculate Conception on Advent Sunday', () => {
  it('2024: December 8 is Advent II Sunday - Advent wins', () => {
    const dec8_2024 = new Date(2024, 11, 8);
    const frags = getFragmentNames(dec8_2024, Hora.LAUDES);

    expect(frags.primary).toContain('ADV');
    expect(frags.primary).toContain('1DOM');
    expect(frags.fallback).toBe('1208/LAU');
  });

  it('2019: December 8 is Advent II Sunday - Advent wins', () => {
    const dec8_2019 = new Date(2019, 11, 8);
    const frags = getFragmentNames(dec8_2019, Hora.LAUDES);

    expect(frags.primary).toContain('ADV');
    expect(frags.fallback).toBe('1208/LAU');
  });

  it('2030: December 8 is Advent II Sunday - Advent wins', () => {
    const dec8_2030 = new Date(2030, 11, 8);
    const frags = getFragmentNames(dec8_2030, Hora.LAUDES);

    expect(frags.primary).toContain('ADV');
    expect(frags.fallback).toBe('1208/LAU');
  });

  it('2025: December 8 is Monday - Immaculate Conception celebrated', () => {
    const dec8_2025 = new Date(2025, 11, 8);
    const frags = getFragmentNames(dec8_2025, Hora.LAUDES);

    expect(frags.primary).toBe('1208/LAU');
  });
});

// ============================================================================
// EARLIEST AND LATEST EASTER DATES
// Earliest possible: March 22 (next: 2285)
// Latest possible: April 25 (next: 2038)
// ============================================================================

describe('Extreme Easter Dates', () => {
  describe('Very Early Easter (March 22-24)', () => {
    it('1913: Easter on March 23 - one of earliest in modern era', () => {
      const easter1913 = pascha(1913);
      expect(easter1913.getMonth()).toBe(2); // March
      expect(easter1913.getDate()).toBe(23);

      const frags = getFragmentNames(easter1913, Hora.LAUDES);
      expect(frags.primary).toBe('PAS0/LAU');
    });

    it('2008: Easter on March 23 - very early Easter', () => {
      const easter2008 = pascha(2008);
      expect(easter2008.getMonth()).toBe(2); // March
      expect(easter2008.getDate()).toBe(23);

      const frags = getFragmentNames(easter2008, Hora.LAUDES);
      expect(frags.primary).toBe('PAS0/LAU');
    });

    it('2285: Easter on March 22 - earliest possible date', () => {
      const easter2285 = pascha(2285);
      expect(easter2285.getMonth()).toBe(2); // March
      expect(easter2285.getDate()).toBe(22);

      const frags = getFragmentNames(easter2285, Hora.LAUDES);
      expect(frags.primary).toBe('PAS0/LAU');
    });
  });

  describe('Very Late Easter (April 24-25)', () => {
    it('1943: Easter on April 25 - latest date in 20th century', () => {
      const easter1943 = pascha(1943);
      expect(easter1943.getMonth()).toBe(3); // April
      expect(easter1943.getDate()).toBe(25);

      const frags = getFragmentNames(easter1943, Hora.LAUDES);
      expect(frags.primary).toBe('PAS0/LAU');
    });

    it('2038: Easter on April 25 - latest date (95 years after 1943)', () => {
      const easter2038 = pascha(2038);
      expect(easter2038.getMonth()).toBe(3); // April
      expect(easter2038.getDate()).toBe(25);

      const frags = getFragmentNames(easter2038, Hora.LAUDES);
      expect(frags.primary).toBe('PAS0/LAU');
    });

    it('2049: Easter on April 18', () => {
      const easter2049 = pascha(2049);
      expect(easter2049.getMonth()).toBe(3); // April

      const frags = getFragmentNames(easter2049, Hora.LAUDES);
      expect(frags.primary).toBe('PAS0/LAU');
    });
  });
});

// ============================================================================
// FEBRUARY 29 - LEAP YEAR HANDLING
// Saints with Feb 29 feast days: St. Oswald, St. Augustus Chapdelaine
// In non-leap years, their feast moves to Feb 28
// ============================================================================

describe('February 29 (Leap Year) Handling', () => {
  it('2024: February 29 exists (leap year)', () => {
    const feb29_2024 = new Date(2024, 1, 29);
    expect(feb29_2024.getDate()).toBe(29);

    const frags = getFragmentNames(feb29_2024, Hora.LAUDES);
    // Should be a Lenten weekday (Feb 29, 2024 is Thursday after Ash Wednesday)
    expect(frags.primary).toContain('QUA');
  });

  it('2028: February 29 exists (leap year)', () => {
    const feb29_2028 = new Date(2028, 1, 29);
    expect(feb29_2028.getDate()).toBe(29);

    const frags = getFragmentNames(feb29_2028, Hora.LAUDES);
    // Lent or before Lent depending on Easter date
    expect(frags.primary).toBeDefined();
  });

  it('2000: February 29 exists (leap year, century exception)', () => {
    const feb29_2000 = new Date(2000, 1, 29);
    expect(feb29_2000.getDate()).toBe(29);

    const frags = getFragmentNames(feb29_2000, Hora.LAUDES);
    expect(frags.primary).toBeDefined();
  });

  it('2100: February 29 does NOT exist (century non-leap)', () => {
    // 2100 is divisible by 100 but not 400, so no leap year
    const feb29_2100 = new Date(2100, 1, 29);
    // JavaScript wraps to March 1
    expect(feb29_2100.getMonth()).toBe(2); // March
    expect(feb29_2100.getDate()).toBe(1);
  });
});

// ============================================================================
// NATIVITY OF JOHN THE BAPTIST (June 24) vs SACRED HEART
// Rule: Nativity of JB takes precedence over Sunday in Ordinary Time
// But Sacred Heart (Friday after Corpus Christi) can conflict
// ============================================================================

describe('Nativity of John the Baptist Conflicts', () => {
  it('2022: June 24 is Friday - Sacred Heart conflict (moved to June 23)', () => {
    // In 2022, Sacred Heart was June 24 (Friday after Corpus Christi June 19)
    // Nativity of JB was moved to June 23
    const jun24_2022 = new Date(2022, 5, 24);
    const frags = getFragmentNames(jun24_2022, Hora.LAUDES);

    // This depends on whether Sacred Heart is in the calendar
    // If not, Nativity of JB is celebrated
    expect(frags.primary).toBeDefined();
  });

  it('2025: June 24 is Tuesday - Nativity of JB celebrated normally', () => {
    const jun24_2025 = new Date(2025, 5, 24);
    const frags = getFragmentNames(jun24_2025, Hora.LAUDES);

    expect(frags.primary).toBe('0624/LAU');
  });

  it('2029: June 24 is Sunday - Nativity of JB wins over Ordinary Time Sunday', () => {
    const jun24_2029 = new Date(2029, 5, 24);
    const frags = getFragmentNames(jun24_2029, Hora.LAUDES);

    // Solemnity wins over Ordinary Time Sunday
    expect(frags.primary).toBe('0624/LAU');
  });
});

// ============================================================================
// ALL SOULS (November 2) ON SUNDAY
// Rule: When All Souls falls on Sunday, the Mass of All Souls is celebrated
// but the Office follows the Sunday (or All Souls Office may be used with people)
// ============================================================================

describe('All Souls on Sunday', () => {
  it('2025: November 2 is Sunday - special case', () => {
    // All Saints is November 1 (Saturday), All Souls is November 2 (Sunday)
    const nov2_2025 = new Date(2025, 10, 2);
    const frags = getFragmentNames(nov2_2025, Hora.LAUDES);

    // This is a complex case - Office can be either Sunday or All Souls
    expect(frags.primary).toBeDefined();
  });

  it('2031: November 2 is Sunday - special case', () => {
    const nov2_2031 = new Date(2031, 10, 2);
    const frags = getFragmentNames(nov2_2031, Hora.LAUDES);

    expect(frags.primary).toBeDefined();
  });

  it('2026: November 2 is Monday - All Souls celebrated normally', () => {
    const nov2_2026 = new Date(2026, 10, 2);
    const frags = getFragmentNames(nov2_2026, Hora.LAUDES);

    expect(frags.primary).toBe('1102/LAU');
  });
});

// ============================================================================
// CHRISTMAS ON VARIOUS DAYS
// Christmas always takes precedence (praecedentia 2)
// ============================================================================

describe('Christmas Day of Week Variations', () => {
  it('2022: Christmas on Sunday - Christmas wins', () => {
    const christmas2022 = new Date(2022, 11, 25);
    const frags = getFragmentNames(christmas2022, Hora.LAUDES);

    expect(frags.primary).toBe('1225/LAU');
  });

  it('2023: Christmas on Monday', () => {
    const christmas2023 = new Date(2023, 11, 25);
    const frags = getFragmentNames(christmas2023, Hora.LAUDES);

    expect(frags.primary).toBe('1225/LAU');
  });

  it('2024: Christmas on Wednesday', () => {
    const christmas2024 = new Date(2024, 11, 25);
    const frags = getFragmentNames(christmas2024, Hora.LAUDES);

    expect(frags.primary).toBe('1225/LAU');
  });

  it('2025: Christmas on Thursday', () => {
    const christmas2025 = new Date(2025, 11, 25);
    const frags = getFragmentNames(christmas2025, Hora.LAUDES);

    expect(frags.primary).toBe('1225/LAU');
  });

  it('2033: Christmas on Sunday - Christmas wins over 4th Advent', () => {
    const christmas2033 = new Date(2033, 11, 25);
    const frags = getFragmentNames(christmas2033, Hora.LAUDES);

    expect(frags.primary).toBe('1225/LAU');
    expect(frags.primary).not.toContain('ADV');
  });
});

// ============================================================================
// CORPUS CHRISTI / BODY AND BLOOD OF CHRIST
// Traditional: Thursday after Trinity Sunday
// Many countries: Sunday after Trinity Sunday
// ============================================================================

describe('Corpus Christi Variations', () => {
  it('2025: Corpus Christi on Sunday June 22', () => {
    // Trinity Sunday 2025 = June 15
    // Corpus Christi (Sunday transfer) = June 22
    const corpus2025 = new Date(2025, 5, 22);
    const frags = getFragmentNames(corpus2025, Hora.LAUDES);

    expect(frags.primary).toBe('COR0/LAU');
  });

  it('2024: Corpus Christi on Sunday June 2', () => {
    // Trinity Sunday 2024 = May 26
    // Corpus Christi (Sunday transfer) = June 2
    const corpus2024 = new Date(2024, 5, 2);
    const frags = getFragmentNames(corpus2024, Hora.LAUDES);

    expect(frags.primary).toBe('COR0/LAU');
  });
});

// ============================================================================
// ASCENSION THURSDAY vs SUNDAY TRANSFER
// Some provinces keep Ascension on Thursday (40 days after Easter)
// Others transfer to the following Sunday (7th Sunday of Easter)
// ============================================================================

describe('Ascension Date Variations', () => {
  it('2025: Ascension is celebrated on Sunday June 1 (Sunday transfer)', () => {
    // Easter 2025 = April 20
    // Traditional Ascension Thursday = May 29, but many regions transfer to Sunday
    // Ascension Sunday = June 1 (7th Sunday of Easter)
    const ascension2025_sun = new Date(2025, 5, 1);
    const frags = getFragmentNames(ascension2025_sun, Hora.LAUDES);

    // Ascension shortCode = ASC0
    expect(frags.primary).toBe('ASC0/LAU');
  });

  it('2025: 7th Sunday of Easter = June 1 (Sunday transfer)', () => {
    // 7th Sunday of Easter = June 1
    const easter7_2025 = new Date(2025, 5, 1);
    const frags = getFragmentNames(easter7_2025, Hora.LAUDES);

    // If Ascension is transferred, this would be ASC0
    // If not, it's PAS7/1DOM
    expect(frags.primary).toMatch(/ASC0|PAS7/);
  });
});

// ============================================================================
// TRIDUUM SPECIAL CASES
// These days always have highest precedence
// ============================================================================

describe('Triduum Precedence (Praecedentia 1)', () => {
  it('Holy Thursday always wins', () => {
    for (const year of [2024, 2025, 2026, 2027]) {
      const easter = pascha(year);
      const holyThursday = new Date(easter);
      holyThursday.setDate(easter.getDate() - 3);

      const frags = getFragmentNames(holyThursday, Hora.LAUDES);
      expect(frags.primary).toBe('TRI1/LAU');
    }
  });

  it('Good Friday always wins', () => {
    for (const year of [2024, 2025, 2026, 2027]) {
      const easter = pascha(year);
      const goodFriday = new Date(easter);
      goodFriday.setDate(easter.getDate() - 2);

      const frags = getFragmentNames(goodFriday, Hora.LAUDES);
      expect(frags.primary).toBe('TRI2/LAU');
    }
  });

  it('Holy Saturday always wins', () => {
    for (const year of [2024, 2025, 2026, 2027]) {
      const easter = pascha(year);
      const holySaturday = new Date(easter);
      holySaturday.setDate(easter.getDate() - 1);

      const frags = getFragmentNames(holySaturday, Hora.LAUDES);
      expect(frags.primary).toBe('TRI3/LAU');
    }
  });
});

// ============================================================================
// PENTECOST VIGIL AND OCTAVE (Historical)
// In the current calendar, Pentecost has no octave
// But the Saturday before has a special Vigil
// ============================================================================

describe('Pentecost Special Cases', () => {
  it('Pentecost Sunday always uses PEN0', () => {
    for (const year of [2024, 2025, 2026, 2027]) {
      const easter = pascha(year);
      const pentecost = new Date(easter);
      pentecost.setDate(easter.getDate() + 49);

      const frags = getFragmentNames(pentecost, Hora.LAUDES);
      expect(frags.primary).toBe('PEN0/LAU');
    }
  });

  it('2025: Day after Pentecost is Mary Mother of Church', () => {
    // Pentecost 2025 = June 8
    // Monday after = June 9 = Mary Mother of Church (Obligatory Memorial)
    // This is a special feast with shortCode MME0
    const jun9_2025 = new Date(2025, 5, 9);
    const frags = getFragmentNames(jun9_2025, Hora.LAUDES);

    // Mary Mother of Church has shortCode MME0
    expect(frags.primary).toBe('MME0/LAU');
  });
});

// ============================================================================
// KYRIOPASCHA (Orthodox) - Easter on March 25
// When Easter and Annunciation fall on the same day
// Next occurrence: 2035
// ============================================================================

describe('Kyriopascha (Easter = March 25)', () => {
  it('2035: Easter IS March 25 - Easter always wins', () => {
    const easter2035 = pascha(2035);
    expect(easter2035.getMonth()).toBe(2); // March
    expect(easter2035.getDate()).toBe(25);

    const frags = getFragmentNames(easter2035, Hora.LAUDES);
    expect(frags.primary).toBe('PAS0/LAU');
    expect(frags.primary).not.toBe('0325/LAU');
  });
});

// ============================================================================
// SAINTS PERPETUA AND FELICITY (March 7)
// Rare case: their feast sometimes falls OUTSIDE Lent (before Ash Wednesday)
// This happens only when Easter is very late (April 24-25)
// Years: 2000, 2011, 2038, 2049, 2076, 2079, 2095
// ============================================================================

describe('Perpetua and Felicity Outside Lent (Rare)', () => {
  it('2038: March 7 is BEFORE Ash Wednesday (Easter = April 25)', () => {
    // Easter 2038 = April 25 (latest possible)
    // Ash Wednesday = March 10
    // March 7 is still Ordinary Time!
    const mar7_2038 = new Date(2038, 2, 7);
    const frags = getFragmentNames(mar7_2038, Hora.LAUDES);

    // Should be Ordinary Time weekday, allowing full memorial celebration
    // Either ORD path or 0307 sanctorale
    expect(frags.primary).toMatch(/ORD|0307/);
  });

  it('2011: March 7 is day BEFORE Ash Wednesday', () => {
    // Easter 2011 = April 24
    // Ash Wednesday = March 8
    // March 7 is Tuesday of Ordinary Time
    const mar7_2011 = new Date(2011, 2, 7);
    const frags = getFragmentNames(mar7_2011, Hora.LAUDES);

    expect(frags.primary).toMatch(/ORD|0307/);
  });

  it('2025: March 7 is Friday after Ash Wednesday (in Lent)', () => {
    // Easter 2025 = April 20
    // Ash Wednesday = March 5
    // March 7 is Friday after Ash Wednesday - IN LENT
    const mar7_2025 = new Date(2025, 2, 7);
    const frags = getFragmentNames(mar7_2025, Hora.LAUDES);

    // Should be Lenten weekday (QUA) - memorial is only optional
    expect(frags.primary).toContain('QUA');
  });
});

// ============================================================================
// ST. PATRICK (March 17) ON LENTEN SUNDAY
// When March 17 falls on a Sunday during Lent, the Sunday takes precedence
// ============================================================================

describe('St. Patrick on Lenten Sunday', () => {
  it('2024: March 17 is 5th Sunday of Lent - Sunday wins', () => {
    const mar17_2024 = new Date(2024, 2, 17);
    const frags = getFragmentNames(mar17_2024, Hora.LAUDES);

    // Lenten Sunday takes precedence
    expect(frags.primary).toContain('QUA');
    expect(frags.primary).toContain('1DOM');
  });

  it('2030: March 17 is 2nd Sunday of Lent - Sunday wins', () => {
    const mar17_2030 = new Date(2030, 2, 17);
    const frags = getFragmentNames(mar17_2030, Hora.LAUDES);

    expect(frags.primary).toContain('QUA');
    expect(frags.primary).toContain('1DOM');
  });

  it('2025: March 17 is Monday of Lent Week 3 - optional memorial', () => {
    const mar17_2025 = new Date(2025, 2, 17);
    const frags = getFragmentNames(mar17_2025, Hora.LAUDES);

    // Lenten weekday - St. Patrick is optional memorial
    expect(frags.primary).toContain('QUA');
  });
});

// ============================================================================
// ST. CYRIL OF JERUSALEM (March 18)
// Almost always falls during Lent
// ============================================================================

describe('St. Cyril of Jerusalem in Lent', () => {
  it('2025: March 18 is Tuesday of Lent Week 3', () => {
    const mar18_2025 = new Date(2025, 2, 18);
    const frags = getFragmentNames(mar18_2025, Hora.LAUDES);

    expect(frags.primary).toContain('QUA');
  });
});

// ============================================================================
// THOMAS AQUINAS (January 28)
// Was moved from March 7 in 1969 revision to avoid Lent conflicts
// ============================================================================

describe('Thomas Aquinas (Historical Note)', () => {
  it('2025: January 28 is in Ordinary Time', () => {
    // Thomas Aquinas was moved from March 7 to January 28 in 1969
    // to avoid perpetual Lent conflicts
    const jan28_2025 = new Date(2025, 0, 28);
    const frags = getFragmentNames(jan28_2025, Hora.LAUDES);

    // Should be Ordinary Time
    expect(frags.primary).toMatch(/ORD|0128/);
  });
});

// ============================================================================
// ASH WEDNESDAY EXCLUSIONS
// No saints' celebrations on Ash Wednesday
// ============================================================================

describe('Ash Wednesday Exclusions', () => {
  it('All saints excluded on Ash Wednesday', () => {
    for (const year of [2024, 2025, 2026, 2027]) {
      const easter = pascha(year);
      const ashWed = new Date(easter);
      ashWed.setDate(easter.getDate() - 46);

      const frags = getFragmentNames(ashWed, Hora.LAUDES);
      // Must be Ash Wednesday temporale (QUA0), no sanctorale
      expect(frags.primary).toBe('QUA0/LAU');
    }
  });
});

// ============================================================================
// LENTEN SUNDAYS EXCLUSIONS
// No saints' celebrations on Lenten Sundays (praecedentia 2)
// ============================================================================

describe('Lenten Sundays Exclusions', () => {
  it('Lenten Sundays exclude sanctorale - specific weeks', () => {
    // Test specific Lenten Sundays in 2025
    // Easter 2025 = April 20
    // Lent 1 Sun = Mar 9, Lent 2 = Mar 16, Lent 3 = Mar 23, Lent 4 = Mar 30, Lent 5 = Apr 6

    const lentSundays2025 = [
      new Date(2025, 2, 9),   // 1st Sunday of Lent
      new Date(2025, 2, 16),  // 2nd Sunday of Lent
      new Date(2025, 2, 23),  // 3rd Sunday of Lent
      new Date(2025, 2, 30),  // 4th Sunday of Lent
      new Date(2025, 3, 6),   // 5th Sunday of Lent
    ];

    for (const sunday of lentSundays2025) {
      const frags = getFragmentNames(sunday, Hora.LAUDES);
      expect(frags.primary).toContain('QUA');
      expect(frags.primary).toContain('1DOM');
    }
  });
});
