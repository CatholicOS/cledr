/**
 * Tests for i18n.ts - Internationalization
 */

import { describe, expect, test } from 'bun:test';
import {
  SUPPORTED_LOCALES,
  LOCALE_NAMES,
  TempusI18n,
  GradusI18n,
  ColorI18n,
  DiesI18n,
  TermsI18n,
  OrdinalesI18n,
  getSeasonName,
  getRankName,
  getLocalizedColorName,
  getDayName,
  getTerm,
  formatWeekName,
  Locale
} from '../src/i18n';
import { Tempus, Gradus, Color, Dies } from '../src/types';

describe('SUPPORTED_LOCALES', () => {
  test('has 8 locales', () => {
    expect(SUPPORTED_LOCALES).toHaveLength(8);
  });

  test('includes Latin as primary', () => {
    expect(SUPPORTED_LOCALES).toContain('la');
  });

  test('includes major European languages', () => {
    expect(SUPPORTED_LOCALES).toContain('it');
    expect(SUPPORTED_LOCALES).toContain('en');
    expect(SUPPORTED_LOCALES).toContain('es');
    expect(SUPPORTED_LOCALES).toContain('fr');
    expect(SUPPORTED_LOCALES).toContain('de');
    expect(SUPPORTED_LOCALES).toContain('pt');
    expect(SUPPORTED_LOCALES).toContain('pl');
  });
});

describe('LOCALE_NAMES', () => {
  test('has native names for each locale', () => {
    expect(LOCALE_NAMES.la).toBe('Latina');
    expect(LOCALE_NAMES.it).toBe('Italiano');
    expect(LOCALE_NAMES.en).toBe('English');
    expect(LOCALE_NAMES.es).toBe('Español');
    expect(LOCALE_NAMES.fr).toBe('Français');
    expect(LOCALE_NAMES.de).toBe('Deutsch');
    expect(LOCALE_NAMES.pt).toBe('Português');
    expect(LOCALE_NAMES.pl).toBe('Polski');
  });
});

describe('TempusI18n - Seasons', () => {
  test('translates Advent correctly', () => {
    expect(TempusI18n[Tempus.ADVENTUS].la).toBe('Adventus');
    expect(TempusI18n[Tempus.ADVENTUS].it).toBe('Avvento');
    expect(TempusI18n[Tempus.ADVENTUS].en).toBe('Advent');
    expect(TempusI18n[Tempus.ADVENTUS].es).toBe('Adviento');
    expect(TempusI18n[Tempus.ADVENTUS].fr).toBe('Avent');
    expect(TempusI18n[Tempus.ADVENTUS].de).toBe('Advent');
  });

  test('translates Lent correctly', () => {
    expect(TempusI18n[Tempus.QUADRAGESIMA].la).toBe('Quadragesima');
    expect(TempusI18n[Tempus.QUADRAGESIMA].it).toBe('Quaresima');
    expect(TempusI18n[Tempus.QUADRAGESIMA].en).toBe('Lent');
    expect(TempusI18n[Tempus.QUADRAGESIMA].de).toBe('Fastenzeit');
    expect(TempusI18n[Tempus.QUADRAGESIMA].pl).toBe('Wielki Post');
  });

  test('translates Easter Time correctly', () => {
    expect(TempusI18n[Tempus.PASCHALE].la).toBe('Tempus Paschale');
    expect(TempusI18n[Tempus.PASCHALE].it).toBe('Tempo di Pasqua');
    expect(TempusI18n[Tempus.PASCHALE].en).toBe('Easter Time');
  });

  test('translates Ordinary Time correctly', () => {
    expect(TempusI18n[Tempus.ORDINARIUM].la).toBe('Tempus per Annum');
    expect(TempusI18n[Tempus.ORDINARIUM].it).toBe('Tempo Ordinario');
    expect(TempusI18n[Tempus.ORDINARIUM].en).toBe('Ordinary Time');
    expect(TempusI18n[Tempus.ORDINARIUM].de).toBe('Zeit im Jahreskreis');
  });

  test('has all seasons for all locales', () => {
    const seasons = Object.values(Tempus);
    for (const season of seasons) {
      for (const locale of SUPPORTED_LOCALES) {
        expect(TempusI18n[season][locale]).toBeDefined();
        expect(TempusI18n[season][locale].length).toBeGreaterThan(0);
      }
    }
  });
});

describe('GradusI18n - Ranks', () => {
  test('translates Solemnity correctly', () => {
    expect(GradusI18n[Gradus.SOLLEMNITAS].la).toBe('Sollemnitas');
    expect(GradusI18n[Gradus.SOLLEMNITAS].it).toBe('Solennità');
    expect(GradusI18n[Gradus.SOLLEMNITAS].en).toBe('Solemnity');
    expect(GradusI18n[Gradus.SOLLEMNITAS].de).toBe('Hochfest');
  });

  test('translates Feast correctly', () => {
    expect(GradusI18n[Gradus.FESTUM].la).toBe('Festum');
    expect(GradusI18n[Gradus.FESTUM].it).toBe('Festa');
    expect(GradusI18n[Gradus.FESTUM].en).toBe('Feast');
  });

  test('translates Memorial correctly', () => {
    expect(GradusI18n[Gradus.MEMORIA].la).toBe('Memoria');
    expect(GradusI18n[Gradus.MEMORIA].en).toBe('Memorial');
    expect(GradusI18n[Gradus.MEMORIA].de).toBe('Gedenktag');
  });

  test('translates Optional Memorial correctly', () => {
    expect(GradusI18n[Gradus.MEMORIA_AD_LIBITUM].la).toBe('Memoria ad libitum');
    expect(GradusI18n[Gradus.MEMORIA_AD_LIBITUM].en).toBe('Optional Memorial');
    expect(GradusI18n[Gradus.MEMORIA_AD_LIBITUM].it).toBe('Memoria facoltativa');
  });

  test('has all ranks for all locales', () => {
    const ranks = Object.values(Gradus);
    for (const rank of ranks) {
      for (const locale of SUPPORTED_LOCALES) {
        expect(GradusI18n[rank][locale]).toBeDefined();
      }
    }
  });
});

describe('ColorI18n - Colors', () => {
  test('translates white correctly', () => {
    expect(ColorI18n[Color.ALBUS].la).toBe('albus');
    expect(ColorI18n[Color.ALBUS].it).toBe('bianco');
    expect(ColorI18n[Color.ALBUS].en).toBe('white');
    expect(ColorI18n[Color.ALBUS].es).toBe('blanco');
  });

  test('translates red correctly', () => {
    expect(ColorI18n[Color.RUBER].la).toBe('ruber');
    expect(ColorI18n[Color.RUBER].it).toBe('rosso');
    expect(ColorI18n[Color.RUBER].en).toBe('red');
  });

  test('translates purple correctly', () => {
    expect(ColorI18n[Color.VIOLACEUS].la).toBe('violaceus');
    expect(ColorI18n[Color.VIOLACEUS].it).toBe('viola');
    expect(ColorI18n[Color.VIOLACEUS].en).toBe('purple');
    expect(ColorI18n[Color.VIOLACEUS].de).toBe('violett');
  });

  test('translates green correctly', () => {
    expect(ColorI18n[Color.VIRIDIS].la).toBe('viridis');
    expect(ColorI18n[Color.VIRIDIS].it).toBe('verde');
    expect(ColorI18n[Color.VIRIDIS].en).toBe('green');
  });

  test('translates rose correctly', () => {
    expect(ColorI18n[Color.ROSACEUS].la).toBe('rosaceus');
    expect(ColorI18n[Color.ROSACEUS].it).toBe('rosaceo');
    expect(ColorI18n[Color.ROSACEUS].en).toBe('rose');
  });
});

describe('DiesI18n - Days', () => {
  test('translates Sunday correctly', () => {
    expect(DiesI18n[Dies.DOMINICA].la).toBe('Dominica');
    expect(DiesI18n[Dies.DOMINICA].it).toBe('Domenica');
    expect(DiesI18n[Dies.DOMINICA].en).toBe('Sunday');
    expect(DiesI18n[Dies.DOMINICA].es).toBe('Domingo');
  });

  test('translates Monday correctly', () => {
    expect(DiesI18n[Dies.FERIA_II].la).toBe('Feria secunda');
    expect(DiesI18n[Dies.FERIA_II].it).toBe('Lunedì');
    expect(DiesI18n[Dies.FERIA_II].en).toBe('Monday');
  });

  test('translates Saturday correctly', () => {
    expect(DiesI18n[Dies.SABBATUM].la).toBe('Sabbatum');
    expect(DiesI18n[Dies.SABBATUM].it).toBe('Sabato');
    expect(DiesI18n[Dies.SABBATUM].en).toBe('Saturday');
  });

  test('has all days for all locales', () => {
    const days = Object.values(Dies).filter(d => typeof d === 'number') as Dies[];
    for (const day of days) {
      for (const locale of SUPPORTED_LOCALES) {
        expect(DiesI18n[day][locale]).toBeDefined();
      }
    }
  });
});

describe('TermsI18n - Liturgical Terms', () => {
  test('translates Mass parts', () => {
    expect(TermsI18n.introitus.la).toBe('Introitus');
    expect(TermsI18n.introitus.en).toBe('Entrance Antiphon');
    expect(TermsI18n.collecta.la).toBe('Collecta');
    expect(TermsI18n.collecta.en).toBe('Collect');
    expect(TermsI18n.evangelium.la).toBe('Evangelium');
    expect(TermsI18n.evangelium.en).toBe('Gospel');
  });

  test('translates Liturgy of Hours', () => {
    expect(TermsI18n.laudes.la).toBe('Laudes matutinae');
    expect(TermsI18n.laudes.en).toBe('Morning Prayer');
    expect(TermsI18n.vesperae.la).toBe('Vesperae');
    expect(TermsI18n.vesperae.en).toBe('Evening Prayer');
    expect(TermsI18n.completorium.la).toBe('Completorium');
    expect(TermsI18n.completorium.en).toBe('Night Prayer');
  });

  test('has Benedictus and Magnificat', () => {
    expect(TermsI18n.benedictus.la).toBe('Benedictus');
    expect(TermsI18n.magnificat.la).toBe('Magnificat');
  });
});

describe('OrdinalesI18n - Ordinal Numbers', () => {
  test('has Roman numerals for Latin', () => {
    expect(OrdinalesI18n[1].la).toBe('I');
    expect(OrdinalesI18n[2].la).toBe('II');
    expect(OrdinalesI18n[3].la).toBe('III');
    expect(OrdinalesI18n[4].la).toBe('IV');
  });

  test('has ordinal suffixes for English', () => {
    expect(OrdinalesI18n[1].en).toBe('1st');
    expect(OrdinalesI18n[2].en).toBe('2nd');
    expect(OrdinalesI18n[3].en).toBe('3rd');
    expect(OrdinalesI18n[4].en).toBe('4th');
  });

  test('has week 34 for longest possible Ordinary Time', () => {
    expect(OrdinalesI18n[34]).toBeDefined();
    expect(OrdinalesI18n[34].la).toBe('XXXIV');
    expect(OrdinalesI18n[34].en).toBe('34th');
  });
});

describe('getSeasonName', () => {
  test('returns Latin by default', () => {
    expect(getSeasonName(Tempus.ADVENTUS)).toBe('Adventus');
  });

  test('returns Italian when specified', () => {
    expect(getSeasonName(Tempus.ADVENTUS, 'it')).toBe('Avvento');
  });

  test('returns English when specified', () => {
    expect(getSeasonName(Tempus.QUADRAGESIMA, 'en')).toBe('Lent');
  });
});

describe('getRankName', () => {
  test('returns Latin by default', () => {
    expect(getRankName(Gradus.SOLLEMNITAS)).toBe('Sollemnitas');
  });

  test('returns English when specified', () => {
    expect(getRankName(Gradus.FESTUM, 'en')).toBe('Feast');
  });
});

describe('getLocalizedColorName', () => {
  test('returns Latin by default', () => {
    expect(getLocalizedColorName(Color.ALBUS)).toBe('albus');
  });

  test('returns Italian when specified', () => {
    expect(getLocalizedColorName(Color.RUBER, 'it')).toBe('rosso');
  });
});

describe('getDayName', () => {
  test('returns Latin by default', () => {
    expect(getDayName(Dies.DOMINICA)).toBe('Dominica');
  });

  test('returns English when specified', () => {
    expect(getDayName(Dies.DOMINICA, 'en')).toBe('Sunday');
  });
});

describe('getTerm', () => {
  test('returns Latin term by default', () => {
    expect(getTerm('collecta')).toBe('Collecta');
  });

  test('returns English term when specified', () => {
    expect(getTerm('collecta', 'en')).toBe('Collect');
  });

  test('returns key if term not found', () => {
    expect(getTerm('unknown_term')).toBe('unknown_term');
  });
});

describe('formatWeekName', () => {
  test('formats Latin correctly', () => {
    const result = formatWeekName(Tempus.ADVENTUS, 1, Dies.DOMINICA, 'la');
    expect(result).toContain('Dominica');
    expect(result).toContain('I');
    expect(result).toContain('Adventus');
  });

  test('formats Italian correctly', () => {
    const result = formatWeekName(Tempus.ADVENTUS, 1, Dies.DOMINICA, 'it');
    expect(result).toContain('Domenica');
    expect(result).toContain('I');
    expect(result).toContain('Avvento');
  });

  test('formats English correctly', () => {
    const result = formatWeekName(Tempus.ADVENTUS, 1, Dies.DOMINICA, 'en');
    expect(result).toContain('1st');
    expect(result).toContain('Sunday');
    expect(result).toContain('Advent');
  });

  test('formats Lent Sunday correctly', () => {
    const result = formatWeekName(Tempus.QUADRAGESIMA, 4, Dies.DOMINICA, 'en');
    expect(result).toContain('4th');
    expect(result).toContain('Sunday');
    expect(result).toContain('Lent');
  });
});
