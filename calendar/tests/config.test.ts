/**
 * Tests for config.ts - Regional and liturgical configuration
 */

import { describe, expect, test } from 'bun:test';
import {
  MissaleRomanum,
  MissaleRomanumInfo,
  AscensioConfig,
  CorpusChristiConfig,
  EpiphaniaConfig,
  DEFAULT_CONFIG,
  NATIONAL_CONFIGS,
  getCalendarConfig,
  createCalendarConfig,
  US_ASCENSION_THURSDAY_PROVINCES,
  usAscensionIsThursday
} from '../src/config';

describe('MissaleRomanum', () => {
  test('has three editions', () => {
    expect(Object.keys(MissaleRomanum)).toHaveLength(3);
  });

  test('editions have correct years', () => {
    expect(MissaleRomanumInfo[MissaleRomanum.EDITIO_TYPICA_1970].year).toBe(1970);
    expect(MissaleRomanumInfo[MissaleRomanum.EDITIO_TYPICA_TERTIA_2002].year).toBe(2002);
    expect(MissaleRomanumInfo[MissaleRomanum.EDITIO_TYPICA_TERTIA_EMENDATA_2008].year).toBe(2008);
  });

  test('editions have pope attribution', () => {
    expect(MissaleRomanumInfo[MissaleRomanum.EDITIO_TYPICA_1970].pope).toBe('Paul VI');
    expect(MissaleRomanumInfo[MissaleRomanum.EDITIO_TYPICA_TERTIA_2002].pope).toBe('John Paul II');
    expect(MissaleRomanumInfo[MissaleRomanum.EDITIO_TYPICA_TERTIA_EMENDATA_2008].pope).toBe('Benedict XVI');
  });
});

describe('AscensioConfig', () => {
  test('has Thursday and Sunday options', () => {
    expect(AscensioConfig.FERIA_V).toBe('FERIA_V');
    expect(AscensioConfig.DOMINICA).toBe('DOMINICA');
  });
});

describe('CorpusChristiConfig', () => {
  test('has Thursday and Sunday options', () => {
    expect(CorpusChristiConfig.FERIA_V).toBe('FERIA_V');
    expect(CorpusChristiConfig.DOMINICA).toBe('DOMINICA');
  });
});

describe('EpiphaniaConfig', () => {
  test('has January 6 and Sunday options', () => {
    expect(EpiphaniaConfig.IANUARII_6).toBe('IANUARII_6');
    expect(EpiphaniaConfig.DOMINICA).toBe('DOMINICA');
  });
});

describe('DEFAULT_CONFIG', () => {
  test('uses 2008 missal edition', () => {
    expect(DEFAULT_CONFIG.missale).toBe(MissaleRomanum.EDITIO_TYPICA_TERTIA_EMENDATA_2008);
  });

  test('celebrates Ascension on Thursday (traditional)', () => {
    expect(DEFAULT_CONFIG.ascensio).toBe(AscensioConfig.FERIA_V);
  });

  test('celebrates Corpus Christi on Thursday (traditional)', () => {
    expect(DEFAULT_CONFIG.corpusChristi).toBe(CorpusChristiConfig.FERIA_V);
  });

  test('celebrates Epiphany on January 6 (traditional)', () => {
    expect(DEFAULT_CONFIG.epiphania).toBe(EpiphaniaConfig.IANUARII_6);
  });

  test('uses Latin as default locale', () => {
    expect(DEFAULT_CONFIG.locale).toBe('la');
  });

  test('includes optional memorials by default', () => {
    expect(DEFAULT_CONFIG.includeOptionalMemorials).toBe(true);
  });
});

describe('NATIONAL_CONFIGS', () => {
  test('has Vatican (VA) configuration', () => {
    expect(NATIONAL_CONFIGS.VA).toBeDefined();
    expect(NATIONAL_CONFIGS.VA.locale).toBe('la');
  });

  test('Italy celebrates Ascension on Sunday', () => {
    expect(NATIONAL_CONFIGS.IT.ascensio).toBe(AscensioConfig.DOMINICA);
  });

  test('Italy celebrates Epiphany on January 6 (public holiday)', () => {
    expect(NATIONAL_CONFIGS.IT.epiphania).toBe(EpiphaniaConfig.IANUARII_6);
  });

  test('US celebrates Ascension on Sunday (most dioceses)', () => {
    expect(NATIONAL_CONFIGS.US.ascensio).toBe(AscensioConfig.DOMINICA);
  });

  test('US celebrates Epiphany on Sunday', () => {
    expect(NATIONAL_CONFIGS.US.epiphania).toBe(EpiphaniaConfig.DOMINICA);
  });

  test('Germany celebrates Ascension on Thursday (public holiday)', () => {
    expect(NATIONAL_CONFIGS.DE.ascensio).toBe(AscensioConfig.FERIA_V);
  });

  test('Germany celebrates Corpus Christi on Thursday', () => {
    expect(NATIONAL_CONFIGS.DE.corpusChristi).toBe(CorpusChristiConfig.FERIA_V);
  });

  test('France celebrates Ascension on Thursday (public holiday)', () => {
    expect(NATIONAL_CONFIGS.FR.ascensio).toBe(AscensioConfig.FERIA_V);
  });

  test('UK keeps Ascension on Thursday', () => {
    expect(NATIONAL_CONFIGS.GB.ascensio).toBe(AscensioConfig.FERIA_V);
  });

  test('Poland celebrates Corpus Christi on Thursday (public holiday)', () => {
    expect(NATIONAL_CONFIGS.PL.corpusChristi).toBe(CorpusChristiConfig.FERIA_V);
  });

  test('has 14+ national configurations', () => {
    expect(Object.keys(NATIONAL_CONFIGS).length).toBeGreaterThanOrEqual(14);
  });
});

describe('getCalendarConfig', () => {
  test('returns Italy config for IT', () => {
    const config = getCalendarConfig('IT');
    expect(config.locale).toBe('it');
    expect(config.ascensio).toBe(AscensioConfig.DOMINICA);
    expect(config.calendar).toBe('IT');
  });

  test('returns US config for US', () => {
    const config = getCalendarConfig('US');
    expect(config.locale).toBe('en');
    expect(config.epiphania).toBe(EpiphaniaConfig.DOMINICA);
  });

  test('is case-insensitive', () => {
    const config1 = getCalendarConfig('it');
    const config2 = getCalendarConfig('IT');
    expect(config1.locale).toBe(config2.locale);
  });

  test('returns default config for unknown nation', () => {
    const config = getCalendarConfig('XX');
    expect(config.locale).toBe('la');
    expect(config.ascensio).toBe(AscensioConfig.FERIA_V);
  });

  test('merges national config with defaults', () => {
    const config = getCalendarConfig('IT');
    // Should have national overrides
    expect(config.locale).toBe('it');
    // Should inherit defaults
    expect(config.missale).toBe(MissaleRomanum.EDITIO_TYPICA_TERTIA_EMENDATA_2008);
    expect(config.includeOptionalMemorials).toBe(true);
  });
});

describe('createCalendarConfig', () => {
  test('creates config with custom options', () => {
    const config = createCalendarConfig({
      locale: 'es',
      ascensio: AscensioConfig.DOMINICA
    });
    expect(config.locale).toBe('es');
    expect(config.ascensio).toBe(AscensioConfig.DOMINICA);
  });

  test('inherits defaults for unspecified options', () => {
    const config = createCalendarConfig({ locale: 'fr' });
    expect(config.missale).toBe(MissaleRomanum.EDITIO_TYPICA_TERTIA_EMENDATA_2008);
    expect(config.corpusChristi).toBe(CorpusChristiConfig.FERIA_V);
  });

  test('can override all options', () => {
    const config = createCalendarConfig({
      missale: MissaleRomanum.EDITIO_TYPICA_1970,
      ascensio: AscensioConfig.DOMINICA,
      corpusChristi: CorpusChristiConfig.DOMINICA,
      epiphania: EpiphaniaConfig.DOMINICA,
      locale: 'pt',
      includeOptionalMemorials: false,
      includeCommemorations: true
    });
    expect(config.missale).toBe(MissaleRomanum.EDITIO_TYPICA_1970);
    expect(config.ascensio).toBe(AscensioConfig.DOMINICA);
    expect(config.corpusChristi).toBe(CorpusChristiConfig.DOMINICA);
    expect(config.epiphania).toBe(EpiphaniaConfig.DOMINICA);
    expect(config.locale).toBe('pt');
    expect(config.includeOptionalMemorials).toBe(false);
    expect(config.includeCommemorations).toBe(true);
  });
});

describe('US Ascension Thursday Provinces', () => {
  test('has known provinces that keep Thursday', () => {
    expect(US_ASCENSION_THURSDAY_PROVINCES).toContain('BOSTON');
    expect(US_ASCENSION_THURSDAY_PROVINCES).toContain('NEW_YORK');
    expect(US_ASCENSION_THURSDAY_PROVINCES).toContain('PHILADELPHIA');
    expect(US_ASCENSION_THURSDAY_PROVINCES).toContain('HARTFORD');
    expect(US_ASCENSION_THURSDAY_PROVINCES).toContain('NEWARK');
    expect(US_ASCENSION_THURSDAY_PROVINCES).toContain('OMAHA');
  });

  test('usAscensionIsThursday returns true for Boston', () => {
    expect(usAscensionIsThursday('BOSTON')).toBe(true);
    expect(usAscensionIsThursday('boston')).toBe(true);
  });

  test('usAscensionIsThursday returns true for New York', () => {
    expect(usAscensionIsThursday('NEW_YORK')).toBe(true);
    expect(usAscensionIsThursday('new_york')).toBe(true);
  });

  test('usAscensionIsThursday returns false for Los Angeles', () => {
    expect(usAscensionIsThursday('LOS_ANGELES')).toBe(false);
    expect(usAscensionIsThursday('Chicago')).toBe(false);
  });
});
