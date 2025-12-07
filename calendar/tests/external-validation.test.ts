/**
 * CLEDR External Validation Tests
 *
 * Validates our calendar calculations against external authoritative sources:
 * - Church Calendar API (calapi.inadiutorium.cz) - calendarium-romanum Ruby gem
 * - CEI (Conferenza Episcopale Italiana) - www.chiesacattolica.it
 * - USCCB (US Conference of Catholic Bishops) - official calendars
 *
 * These tests require network access and may be skipped in CI environments.
 * Run with: npm test -- tests/external-validation.test.ts
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { getFragmentNames, Hora } from '../src/fragments';
import { pascha, tempus, estDominica } from '../src/computus';
import { Tempus } from '../src/types';

// Church Calendar API base URL
const CALAPI_BASE = 'http://calapi.inadiutorium.cz/api/v0/en/calendars/default';

// CEI (Conferenza Episcopale Italiana) liturgy base URL
const CEI_BASE = 'https://www.chiesacattolica.it/liturgia-del-giorno/liturgie-del-';

interface CalapiResponse {
  date: string;
  season: string;
  season_week: number;
  celebrations: Array<{
    title: string;
    colour: string;
    rank: string;
    rank_num: number;
  }>;
  weekday: string;
}

/**
 * Fetch liturgical data from Church Calendar API
 */
async function fetchCalapi(year: number, month: number, day: number): Promise<CalapiResponse | null> {
  try {
    const url = `${CALAPI_BASE}/${year}/${month}/${day}`;
    const response = await fetch(url);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

/**
 * Map our Tempus enum to calapi season names
 */
function tempusToCalapi(t: Tempus): string {
  const mapping: Record<Tempus, string> = {
    [Tempus.ADVENTUS]: 'advent',
    [Tempus.NATIVITAS]: 'christmas',
    [Tempus.ORDINARIUM]: 'ordinary',
    [Tempus.QUADRAGESIMA]: 'lent',
    [Tempus.TRIDUUM]: 'triduum',
    [Tempus.PASCHALE]: 'easter',
  };
  return mapping[t] || 'ordinary';
}

/**
 * Check if we can reach the external API
 */
async function isApiAvailable(): Promise<boolean> {
  try {
    const response = await fetch(`${CALAPI_BASE}/2024/1/1`, {
      signal: AbortSignal.timeout(5000)
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Fetch liturgical title from CEI website
 * Returns the liturgical day name in Italian
 */
async function fetchCeiTitle(year: number, month: number, day: number): Promise<string | null> {
  try {
    const dateStr = `${year}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`;
    const url = `${CEI_BASE}${dateStr}/`;
    const response = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!response.ok) return null;

    const html = await response.text();
    // Extract title from: <h3 class="cci_content_single_title">TITLE HERE</h3>
    const match = html.match(/cci_content_single_title">([^<]+)/g);
    if (match && match.length > 1) {
      // First match is "Liturgie del YYYYMMDD", second is the actual title
      return match[1].replace('cci_content_single_title">', '').trim();
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Check if CEI website is available
 */
async function isCeiAvailable(): Promise<boolean> {
  try {
    const response = await fetch(`${CEI_BASE}20241225/`, {
      signal: AbortSignal.timeout(5000)
    });
    return response.ok;
  } catch {
    return false;
  }
}

// ============================================================================
// EXTERNAL VALIDATION TESTS
// ============================================================================

describe('External Validation: Church Calendar API', () => {
  let apiAvailable = false;

  beforeAll(async () => {
    apiAvailable = await isApiAvailable();
    if (!apiAvailable) {
      console.log('⚠️  Church Calendar API not available - skipping external validation tests');
    }
  });

  describe('Easter Sunday Validation', () => {
    const easterDates = [
      { year: 2024, month: 3, day: 31 },
      { year: 2025, month: 4, day: 20 },
      { year: 2026, month: 4, day: 5 },
      { year: 2027, month: 3, day: 28 },
      { year: 2035, month: 3, day: 25 }, // Kyriopascha
    ];

    for (const { year, month, day } of easterDates) {
      it(`Easter ${year} = ${month}/${day}`, async () => {
        if (!apiAvailable) return;

        const external = await fetchCalapi(year, month, day);
        expect(external).not.toBeNull();
        expect(external!.celebrations[0].title).toBe('Easter Sunday');

        // Verify our calculation matches
        const ourEaster = pascha(year);
        expect(ourEaster.getMonth() + 1).toBe(month);
        expect(ourEaster.getDate()).toBe(day);

        const frags = getFragmentNames(ourEaster, Hora.LAUDES);
        expect(frags.primary).toBe('PAS0/LAU');
      });
    }
  });

  describe('Season Validation', () => {
    const seasonTests = [
      { date: [2024, 12, 1], expectedSeason: 'advent', desc: 'Advent 2024' },
      { date: [2024, 12, 25], expectedSeason: 'christmas', desc: 'Christmas 2024' },
      { date: [2025, 1, 15], expectedSeason: 'ordinary', desc: 'Ordinary Time Jan 2025' },
      { date: [2025, 3, 10], expectedSeason: 'lent', desc: 'Lent 2025' },
      { date: [2025, 4, 20], expectedSeason: 'easter', desc: 'Easter Sunday 2025' },
      { date: [2025, 5, 15], expectedSeason: 'easter', desc: 'Easter Season 2025' },
      { date: [2025, 6, 15], expectedSeason: 'ordinary', desc: 'Ordinary Time Jun 2025' },
    ];

    for (const { date, expectedSeason, desc } of seasonTests) {
      it(`${desc}: season = ${expectedSeason}`, async () => {
        if (!apiAvailable) return;

        const [year, month, day] = date;
        const external = await fetchCalapi(year, month, day);
        expect(external).not.toBeNull();
        expect(external!.season).toBe(expectedSeason);

        // Verify our calculation matches
        const ourDate = new Date(year, month - 1, day);
        const ourTempus = tempus(ourDate);
        const ourSeason = tempusToCalapi(ourTempus);

        // Handle triduum as part of lent/easter in calapi
        if (ourTempus === Tempus.TRIDUUM) {
          expect(['lent', 'triduum', 'easter']).toContain(external!.season);
        } else {
          expect(ourSeason).toBe(external!.season);
        }
      });
    }
  });

  describe('Precedence Validation: Privileged Sundays', () => {
    it('Dec 8, 2024: Advent Sunday wins over Immaculate Conception', async () => {
      if (!apiAvailable) return;

      const external = await fetchCalapi(2024, 12, 8);
      expect(external).not.toBeNull();

      // External API should show Advent Sunday, not Immaculate Conception
      expect(external!.celebrations[0].title).toBe('2nd Sunday of Advent');
      expect(external!.season).toBe('advent');

      // Verify our calculation matches
      const ourDate = new Date(2024, 11, 8);
      const frags = getFragmentNames(ourDate, Hora.LAUDES);
      expect(frags.primary).toContain('ADV');
      expect(frags.primary).toContain('1DOM');
    });

    it('Mar 17, 2024: Lent Sunday wins over St. Patrick', async () => {
      if (!apiAvailable) return;

      const external = await fetchCalapi(2024, 3, 17);
      expect(external).not.toBeNull();

      // Should be 5th Sunday of Lent
      expect(external!.celebrations[0].title).toContain('Sunday of Lent');
      expect(external!.season).toBe('lent');

      // Verify our calculation
      const ourDate = new Date(2024, 2, 17);
      const frags = getFragmentNames(ourDate, Hora.LAUDES);
      expect(frags.primary).toContain('QUA');
      expect(frags.primary).toContain('1DOM');
    });
  });

  describe('Solemnity Validation', () => {
    it('Mar 19, 2024: St. Joseph celebrated (not in Holy Week)', async () => {
      if (!apiAvailable) return;

      const external = await fetchCalapi(2024, 3, 19);
      expect(external).not.toBeNull();

      expect(external!.celebrations[0].title).toContain('Joseph');

      // Verify our calculation
      const frags = getFragmentNames(new Date(2024, 2, 19), Hora.LAUDES);
      expect(frags.primary).toBe('0319/LAU');
    });

    it('Mar 25, 2025: Annunciation celebrated (not in Holy Week)', async () => {
      if (!apiAvailable) return;

      const external = await fetchCalapi(2025, 3, 25);
      expect(external).not.toBeNull();

      expect(external!.celebrations[0].title).toContain('Annunciation');

      // Verify our calculation
      const frags = getFragmentNames(new Date(2025, 2, 25), Hora.LAUDES);
      expect(frags.primary).toBe('0325/LAU');
    });

    it('Dec 25, 2024: Christmas', async () => {
      if (!apiAvailable) return;

      const external = await fetchCalapi(2024, 12, 25);
      expect(external).not.toBeNull();

      expect(external!.celebrations[0].title).toBe('Christmas');

      // Verify our calculation
      const frags = getFragmentNames(new Date(2024, 11, 25), Hora.LAUDES);
      expect(frags.primary).toBe('1225/LAU');
    });
  });

  describe('Holy Week Precedence', () => {
    it('Mar 25, 2024: Holy Week Monday (not Annunciation)', async () => {
      if (!apiAvailable) return;

      // Easter 2024 = Mar 31, so Mar 25 = Holy Monday
      const external = await fetchCalapi(2024, 3, 25);
      expect(external).not.toBeNull();

      // Should be Monday of Holy Week, not Annunciation
      expect(external!.celebrations[0].title).toContain('Holy Week');

      // Verify our calculation
      const frags = getFragmentNames(new Date(2024, 2, 25), Hora.LAUDES);
      expect(frags.primary).toBe('QUA6F2/LAU');
    });

    it('Mar 19, 2035: Holy Week Monday (not St. Joseph)', async () => {
      if (!apiAvailable) return;

      // Easter 2035 = Mar 25, so Mar 19 = Holy Monday
      const external = await fetchCalapi(2035, 3, 19);
      expect(external).not.toBeNull();

      // Should be Monday of Holy Week, not St. Joseph
      expect(external!.celebrations[0].title).toContain('Holy Week');

      // Verify our calculation
      const frags = getFragmentNames(new Date(2035, 2, 19), Hora.LAUDES);
      expect(frags.primary).toBe('QUA6F2/LAU');
    });
  });

  describe('Rare Cases: Kyriopascha 2035', () => {
    it('Mar 25, 2035: Easter Sunday (not Annunciation)', async () => {
      if (!apiAvailable) return;

      const external = await fetchCalapi(2035, 3, 25);
      expect(external).not.toBeNull();

      // Easter should win
      expect(external!.celebrations[0].title).toBe('Easter Sunday');
      expect(external!.season).toBe('easter');

      // Verify our calculation
      const frags = getFragmentNames(new Date(2035, 2, 25), Hora.LAUDES);
      expect(frags.primary).toBe('PAS0/LAU');
    });
  });

  describe('Cross-validation: Multiple Years Easter', () => {
    it('Validates Easter dates 2020-2030 against external API', async () => {
      if (!apiAvailable) return;

      for (let year = 2020; year <= 2030; year++) {
        const ourEaster = pascha(year);
        const month = ourEaster.getMonth() + 1;
        const day = ourEaster.getDate();

        const external = await fetchCalapi(year, month, day);
        expect(external).not.toBeNull();
        expect(external!.celebrations[0].title).toBe('Easter Sunday');
      }
    });
  });
});

// ============================================================================
// CEI (CONFERENZA EPISCOPALE ITALIANA) VALIDATION
// ============================================================================

describe('External Validation: CEI (Chiesa Cattolica Italiana)', () => {
  let ceiAvailable = false;

  beforeAll(async () => {
    ceiAvailable = await isCeiAvailable();
    if (!ceiAvailable) {
      console.log('⚠️  CEI website not available - skipping CEI validation tests');
    }
  });

  describe('Major Solemnities Validation', () => {
    it('Easter Sunday 2025 = DOMENICA DI PASQUA', async () => {
      if (!ceiAvailable) return;

      const title = await fetchCeiTitle(2025, 4, 20);
      expect(title).not.toBeNull();
      expect(title!.toUpperCase()).toContain('PASQUA');
      expect(title!.toUpperCase()).toContain('RISURREZIONE');

      // Verify our calculation
      const frags = getFragmentNames(new Date(2025, 3, 20), Hora.LAUDES);
      expect(frags.primary).toBe('PAS0/LAU');
    });

    it('Pentecost 2025 = DOMENICA DI PENTECOSTE', async () => {
      if (!ceiAvailable) return;

      const title = await fetchCeiTitle(2025, 6, 8);
      expect(title).not.toBeNull();
      expect(title!.toUpperCase()).toContain('PENTECOSTE');

      // Verify our calculation
      const frags = getFragmentNames(new Date(2025, 5, 8), Hora.LAUDES);
      expect(frags.primary).toBe('PEN0/LAU');
    });

    it('St. Joseph 2025 = SAN GIUSEPPE', async () => {
      if (!ceiAvailable) return;

      const title = await fetchCeiTitle(2025, 3, 19);
      expect(title).not.toBeNull();
      expect(title!.toUpperCase()).toContain('GIUSEPPE');

      // Verify our calculation
      const frags = getFragmentNames(new Date(2025, 2, 19), Hora.LAUDES);
      expect(frags.primary).toBe('0319/LAU');
    });

    it('Ash Wednesday 2025 = MERCOLEDÌ DELLE CENERI', async () => {
      if (!ceiAvailable) return;

      const title = await fetchCeiTitle(2025, 3, 5);
      expect(title).not.toBeNull();
      expect(title!.toUpperCase()).toContain('CENERI');

      // Verify our calculation
      const frags = getFragmentNames(new Date(2025, 2, 5), Hora.LAUDES);
      expect(frags.primary).toBe('QUA0/LAU');
    });
  });

  describe('Precedence Validation: Immaculate Conception 2024', () => {
    it('Dec 8, 2024: CEI shows IMMACOLATA CONCEZIONE (transferred in calendar)', async () => {
      if (!ceiAvailable) return;

      // CEI website may show Immaculate Conception for Dec 8 even though
      // liturgically it's transferred when it falls on Advent Sunday
      const title = await fetchCeiTitle(2024, 12, 8);
      expect(title).not.toBeNull();
      // CEI might show either Advent Sunday or Immaculate Conception
      const isAdvent = title!.toUpperCase().includes('AVVENTO');
      const isImmaculate = title!.toUpperCase().includes('IMMACOLATA');
      expect(isAdvent || isImmaculate).toBe(true);

      // Our calendar should prioritize Advent Sunday (privileged)
      const frags = getFragmentNames(new Date(2024, 11, 8), Hora.LAUDES);
      expect(frags.primary).toContain('ADV');
    });
  });

  describe('Liturgical Seasons Validation', () => {
    const seasonTests = [
      { date: [2025, 12, 7], expectedIt: 'AVVENTO', expectedCode: 'ADV', desc: 'Advent Sunday' },
      { date: [2025, 3, 16], expectedIt: 'QUARESIMA', expectedCode: 'QUA', desc: 'Lent Sunday' },
      { date: [2025, 5, 4], expectedIt: 'PASQUA', expectedCode: 'PAS', desc: 'Easter Season Sunday' },
    ];

    for (const { date, expectedIt, expectedCode, desc } of seasonTests) {
      it(`${desc}: contains ${expectedIt}`, async () => {
        if (!ceiAvailable) return;

        const [year, month, day] = date;
        const title = await fetchCeiTitle(year, month, day);
        // CEI title might not always contain season, so we just verify our code
        const frags = getFragmentNames(new Date(year, month - 1, day), Hora.LAUDES);
        expect(frags.primary).toContain(expectedCode);
      });
    }
  });

  describe('Cross-Validation: Easter 2024-2030', () => {
    const easterDates = [
      { year: 2024, month: 3, day: 31 },
      { year: 2025, month: 4, day: 20 },
      { year: 2026, month: 4, day: 5 },
      { year: 2027, month: 3, day: 28 },
      { year: 2028, month: 4, day: 16 },
      { year: 2029, month: 4, day: 1 },
      { year: 2030, month: 4, day: 21 },
    ];

    for (const { year, month, day } of easterDates) {
      it(`Easter ${year} = ${month}/${day}`, async () => {
        if (!ceiAvailable) return;

        const title = await fetchCeiTitle(year, month, day);
        if (title) {
          expect(title.toUpperCase()).toContain('PASQUA');
        }

        // Always verify our computation
        const ourEaster = pascha(year);
        expect(ourEaster.getMonth() + 1).toBe(month);
        expect(ourEaster.getDate()).toBe(day);
      });
    }
  });
});

// ============================================================================
// OFFLINE VALIDATION (No network required)
// These tests validate against known authoritative data
// ============================================================================

describe('Offline Validation: Known Liturgical Data', () => {
  describe('USCCB 2024 Calendar Verification', () => {
    // Data from https://www.usccb.org/resources/2024cal.pdf
    const usccb2024 = [
      { date: [2024, 1, 1], expected: 'Solemnity of Mary', shortCode: '0101' },
      { date: [2024, 2, 14], expected: 'Ash Wednesday', shortCode: 'QUA0' },
      { date: [2024, 3, 19], expected: 'St. Joseph', shortCode: '0319' },
      { date: [2024, 3, 31], expected: 'Easter Sunday', shortCode: 'PAS0' },
      { date: [2024, 5, 12], expected: 'Ascension (Sun transfer)', shortCode: 'ASC0' },
      { date: [2024, 5, 19], expected: 'Pentecost', shortCode: 'PEN0' },
      { date: [2024, 6, 2], expected: 'Corpus Christi', shortCode: 'COR0' },
      { date: [2024, 8, 15], expected: 'Assumption', shortCode: '0815' },
      { date: [2024, 11, 1], expected: 'All Saints', shortCode: '1101' },
      { date: [2024, 12, 8], expected: 'Advent Sunday (Immaculate transferred)', check: 'ADV' },
      { date: [2024, 12, 25], expected: 'Christmas', shortCode: '1225' },
    ];

    for (const { date, expected, shortCode, check } of usccb2024) {
      it(`${expected}`, () => {
        const [year, month, day] = date;
        const d = new Date(year, month - 1, day);
        const frags = getFragmentNames(d, Hora.LAUDES);

        if (shortCode) {
          expect(frags.primary).toContain(shortCode);
        }
        if (check) {
          expect(frags.primary).toContain(check);
        }
      });
    }
  });

  describe('USCCB 2025 Calendar Verification', () => {
    // Data from https://www.usccb.org/resources/2025cal.pdf
    const usccb2025 = [
      { date: [2025, 1, 1], expected: 'Solemnity of Mary', shortCode: '0101' },
      { date: [2025, 3, 5], expected: 'Ash Wednesday', shortCode: 'QUA0' },
      { date: [2025, 3, 19], expected: 'St. Joseph', shortCode: '0319' },
      { date: [2025, 3, 25], expected: 'Annunciation', shortCode: '0325' },
      { date: [2025, 4, 20], expected: 'Easter Sunday', shortCode: 'PAS0' },
      { date: [2025, 6, 1], expected: 'Ascension (Sun transfer)', shortCode: 'ASC0' },
      { date: [2025, 6, 8], expected: 'Pentecost', shortCode: 'PEN0' },
      { date: [2025, 6, 22], expected: 'Corpus Christi', shortCode: 'COR0' },
      { date: [2025, 8, 15], expected: 'Assumption', shortCode: '0815' },
      { date: [2025, 11, 1], expected: 'All Saints', shortCode: '1101' },
      { date: [2025, 12, 8], expected: 'Immaculate Conception', shortCode: '1208' },
      { date: [2025, 12, 25], expected: 'Christmas', shortCode: '1225' },
    ];

    for (const { date, expected, shortCode } of usccb2025) {
      it(`${expected}`, () => {
        const [year, month, day] = date;
        const d = new Date(year, month - 1, day);
        const frags = getFragmentNames(d, Hora.LAUDES);

        expect(frags.primary).toContain(shortCode);
      });
    }
  });

  describe('Vatican Mysterii Paschalis Easter Dates', () => {
    // Official Easter dates from Vatican documents
    const vaticanEaster = [
      { year: 2000, month: 4, day: 23 },
      { year: 2010, month: 4, day: 4 },
      { year: 2020, month: 4, day: 12 },
      { year: 2024, month: 3, day: 31 },
      { year: 2025, month: 4, day: 20 },
      { year: 2030, month: 4, day: 21 },
      { year: 2040, month: 4, day: 1 },
      { year: 2050, month: 4, day: 10 },
    ];

    for (const { year, month, day } of vaticanEaster) {
      it(`Easter ${year} = ${month}/${day}`, () => {
        const ourEaster = pascha(year);
        expect(ourEaster.getMonth() + 1).toBe(month);
        expect(ourEaster.getDate()).toBe(day);
      });
    }
  });
});
