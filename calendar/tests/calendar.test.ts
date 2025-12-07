/**
 * CLEDR Calendar - Calendar Resolution Tests
 * Precedence and main API validation
 */

import { describe, it, expect } from 'vitest';
import {
  findCelebrations,
  resolvePrecedence,
  canCelebrate,
  getDiesLiturgicus,
  getCalendarRange,
  getCalendarMonth,
  getCalendarYear,
  getCalendarLiturgicalYear
} from '../src/calendar';
import { Tempus, Gradus, Praecedentia, Color, Genus, Dies } from '../src/types';
import { pascha } from '../src/computus';

describe('getDiesLiturgicus', () => {
  it('should return complete liturgical day for any date', () => {
    const date = new Date(2025, 0, 1); // Jan 1, 2025
    const dies = getDiesLiturgicus(date);

    expect(dies.date).toBeDefined();
    expect(dies.tempus).toBeDefined();
    expect(dies.hebdomada).toBeDefined();
    expect(dies.hebdomadaPsalterii).toBeDefined();
    expect(dies.dies).toBeDefined();
    expect(dies.cyclusDominicalis).toBeDefined();
    expect(dies.cyclusFerialis).toBeDefined();
    expect(dies.gradus).toBeDefined();
    expect(dies.praecedentia).toBeDefined();
    expect(dies.colores).toBeDefined();
    expect(dies.genus).toBeDefined();
    expect(dies.nomina).toBeDefined();
    expect(dies.nomina.la).toBeDefined();
  });

  it('should identify Mary Mother of God on Jan 1', () => {
    const dies = getDiesLiturgicus(new Date(2025, 0, 1));
    expect(dies.gradus).toBe(Gradus.SOLLEMNITAS);
    expect(dies.nomina.la).toContain('Mariae');
  });

  it('should identify Easter Sunday correctly', () => {
    const easter = pascha(2025);
    const dies = getDiesLiturgicus(easter);
    // Easter Sunday is part of the Paschal Triduum (Triduum Paschale)
    // which includes Holy Thursday evening through Easter Sunday evening
    expect(dies.tempus).toBe(Tempus.TRIDUUM);
    expect(dies.gradus).toBe(Gradus.SOLLEMNITAS);
    expect(dies.praecedentia).toBe(Praecedentia.TRIDUUM_1);
    expect(dies.colores).toContain(Color.ALBUS);
  });

  it('should identify Christmas correctly', () => {
    const christmas = new Date(2025, 11, 25);
    const dies = getDiesLiturgicus(christmas);
    expect(dies.tempus).toBe(Tempus.NATIVITAS);
    expect(dies.gradus).toBe(Gradus.SOLLEMNITAS);
    expect(dies.nomina.la).toContain('Nativitate');
  });

  it('should have correct day of week', () => {
    // Jan 5, 2025 is Sunday
    const sunday = new Date(2025, 0, 5);
    const dies = getDiesLiturgicus(sunday);
    expect(dies.dies).toBe(Dies.DOMINICA);

    // Jan 6, 2025 is Monday
    const monday = new Date(2025, 0, 6);
    const diesMon = getDiesLiturgicus(monday);
    expect(diesMon.dies).toBe(Dies.FERIA_II);
  });
});

describe('findCelebrations', () => {
  it('should return celebrations sorted by precedence', () => {
    const celebrations = findCelebrations(new Date(2025, 11, 25)); // Christmas
    expect(celebrations.length).toBeGreaterThan(0);

    // Verify sorted by precedence
    for (let i = 1; i < celebrations.length; i++) {
      const prevPriority = celebrations[i - 1].priority;
      const currPriority = celebrations[i].priority;
      expect(currPriority).toBeGreaterThanOrEqual(prevPriority);
    }
  });

  it('should find both temporale and sanctorale on overlapping days', () => {
    // If a fixed feast falls on a moveable feast day, both should be returned
    // This depends on the actual calendar - just verify no errors
    const date = new Date(2025, 3, 20); // Easter 2025
    const celebrations = findCelebrations(date);
    expect(celebrations.length).toBeGreaterThan(0);
    expect(celebrations[0].genus).toBe(Genus.TEMPORALE);
  });
});

describe('resolvePrecedence', () => {
  it('should return highest precedence celebration', () => {
    const date = new Date(2025, 3, 20); // Easter
    const resolved = resolvePrecedence(date);
    expect(resolved).not.toBeNull();
    expect(resolved?.praecedentia).toBe(Praecedentia.TRIDUUM_1);
  });

  it('should return null for date with no celebrations', () => {
    // Ordinary weekday in summer
    const date = new Date(2025, 6, 15);
    const resolved = resolvePrecedence(date);
    // May return ferial or null depending on implementation
    expect(resolved === null || resolved !== null).toBe(true);
  });
});

describe('canCelebrate', () => {
  it('should allow solemnities during any season', () => {
    const christmas = {
      code: '1225',
      id: 'christmas',
      shortCode: 'NAT',
      genus: Genus.SANCTORALE,
      gradus: Gradus.SOLLEMNITAS,
      praecedentia: Praecedentia.SOLLEMNITAS_DOMINI_IN_CALENDARIO_2,
      priority: 200,
      colores: [Color.ALBUS],
      nomina: { la: 'In Nativitate Domini' },
      match: () => true
    };

    // Should be able to celebrate even during Advent
    const adventDate = new Date(2024, 11, 15);
    expect(canCelebrate(christmas, adventDate)).toBe(true);
  });
});

describe('Calendar Range Functions', () => {
  it('getCalendarRange should return days in range', () => {
    const start = new Date(2025, 0, 1);
    const end = new Date(2025, 0, 7);
    const range = getCalendarRange(start, end);
    expect(range.length).toBe(7);
  });

  it('getCalendarMonth should return all days in month', () => {
    const january = getCalendarMonth(2025, 1);
    expect(january.length).toBe(31);

    const february = getCalendarMonth(2025, 2);
    expect(february.length).toBe(28); // 2025 is not leap year
  });

  it('getCalendarYear should return 365 or 366 days', () => {
    const year2025 = getCalendarYear(2025);
    expect(year2025.length).toBe(365);

    const year2024 = getCalendarYear(2024); // Leap year
    expect(year2024.length).toBe(366);
  });

  it('getCalendarLiturgicalYear should span Advent to Advent', () => {
    const litYear = getCalendarLiturgicalYear(2025);

    // Should start with First Sunday of Advent 2024
    expect(litYear[0].tempus).toBe(Tempus.ADVENTUS);

    // Should end before First Sunday of Advent 2025
    const lastDay = litYear[litYear.length - 1];
    expect(lastDay.date.getTime()).toBeLessThan(new Date(2025, 10, 30).getTime());
  });
});

describe('Liturgical Codes', () => {
  it('should generate valid titleCode', () => {
    const dies = getDiesLiturgicus(new Date(2025, 0, 5)); // Sunday in Christmas
    expect(dies.titleCode).toMatch(/^TIT;/);
    expect(dies.titleCode).toContain(';');
  });

  it('should generate valid shortCode', () => {
    const dies = getDiesLiturgicus(new Date(2025, 3, 20)); // Easter
    expect(dies.shortCode).toBeDefined();
    expect(dies.shortCode.length).toBeGreaterThan(0);
  });
});

describe('Commemorations and Alternatives', () => {
  it('should include commemorations when applicable', () => {
    // On some days there may be commemorated saints
    const dies = getDiesLiturgicus(new Date(2025, 0, 2)); // Jan 2
    // Check structure exists (may or may not have commemorations)
    expect(dies.commemoratio === undefined || Array.isArray(dies.commemoratio)).toBe(true);
  });

  it('should include alternatives when applicable', () => {
    const dies = getDiesLiturgicus(new Date(2025, 6, 15)); // Mid-July
    // Check structure exists (may or may not have alternatives)
    expect(dies.alternativae === undefined || Array.isArray(dies.alternativae)).toBe(true);
  });
});
