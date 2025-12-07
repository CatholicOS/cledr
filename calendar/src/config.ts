/**
 * CLEDR Liturgical Calendar - Configuration
 *
 * Regional and liturgical configuration options aligned with
 * liturgical-calendar-api LitSettings.php
 */

// =============================================================================
// ROMAN MISSAL EDITIONS
// =============================================================================

/**
 * Roman Missal editions
 * Different editions have slightly different calendars
 */
export enum MissaleRomanum {
  /** Missale Romanum 1970 (Paul VI, first edition) */
  EDITIO_TYPICA_1970 = 'EDITIO_TYPICA_1970',
  /** Missale Romanum 2002 (John Paul II, third edition) */
  EDITIO_TYPICA_TERTIA_2002 = 'EDITIO_TYPICA_TERTIA_2002',
  /** Missale Romanum 2008 (emendata) */
  EDITIO_TYPICA_TERTIA_EMENDATA_2008 = 'EDITIO_TYPICA_TERTIA_EMENDATA_2008',
}

/**
 * Missal edition metadata
 */
export const MissaleRomanumInfo: Record<MissaleRomanum, {
  year: number;
  pope: string;
  latin: string;
  description: string;
}> = {
  [MissaleRomanum.EDITIO_TYPICA_1970]: {
    year: 1970,
    pope: 'Paul VI',
    latin: 'Editio Typica',
    description: 'First edition after Vatican II'
  },
  [MissaleRomanum.EDITIO_TYPICA_TERTIA_2002]: {
    year: 2002,
    pope: 'John Paul II',
    latin: 'Editio Typica Tertia',
    description: 'Third typical edition'
  },
  [MissaleRomanum.EDITIO_TYPICA_TERTIA_EMENDATA_2008]: {
    year: 2008,
    pope: 'Benedict XVI',
    latin: 'Editio Typica Tertia Emendata',
    description: 'Third typical edition with corrections'
  }
};

// =============================================================================
// MOVEABLE FEAST CONFIGURATION
// =============================================================================

/**
 * Ascension configuration
 * Some countries celebrate Ascension on Thursday (traditional),
 * others transfer it to the following Sunday
 */
export enum AscensioConfig {
  /** Traditional: Thursday (39 days after Easter) */
  FERIA_V = 'FERIA_V',
  /** Transferred: Sunday (7th Sunday of Easter) */
  DOMINICA = 'DOMINICA'
}

/**
 * Corpus Christi (Corpus Domini) configuration
 * Some countries celebrate on Thursday (traditional),
 * others on the following Sunday
 */
export enum CorpusChristiConfig {
  /** Traditional: Thursday (60 days after Easter) */
  FERIA_V = 'FERIA_V',
  /** Transferred: Sunday after Trinity Sunday */
  DOMINICA = 'DOMINICA'
}

/**
 * Epiphany configuration
 * Some countries celebrate on January 6 (traditional),
 * others on the Sunday between January 2-8
 */
export enum EpiphaniaConfig {
  /** Traditional: January 6 */
  IANUARII_6 = 'IANUARII_6',
  /** Transferred: Sunday between January 2-8 */
  DOMINICA = 'DOMINICA'
}

// =============================================================================
// CALENDAR CONFIGURATION
// =============================================================================

/**
 * Calendar configuration options
 */
export interface CalendarConfig {
  /** Roman Missal edition to use */
  missale: MissaleRomanum;

  /** Ascension celebration day */
  ascensio: AscensioConfig;

  /** Corpus Christi celebration day */
  corpusChristi: CorpusChristiConfig;

  /** Epiphany celebration day */
  epiphania: EpiphaniaConfig;

  /** Locale for names (ISO 639-1) */
  locale: string;

  /** National/diocesan calendar to overlay */
  calendar?: string;

  /** Include optional memorials */
  includeOptionalMemorials: boolean;

  /** Include commemorations */
  includeCommemorations: boolean;
}

/**
 * Default configuration (Vatican/Universal)
 */
export const DEFAULT_CONFIG: CalendarConfig = {
  missale: MissaleRomanum.EDITIO_TYPICA_TERTIA_EMENDATA_2008,
  ascensio: AscensioConfig.FERIA_V,
  corpusChristi: CorpusChristiConfig.FERIA_V,
  epiphania: EpiphaniaConfig.IANUARII_6,
  locale: 'la',
  includeOptionalMemorials: true,
  includeCommemorations: false
};

// =============================================================================
// NATIONAL CALENDAR PRESETS
// =============================================================================

/**
 * National calendar configurations
 * Based on liturgical-calendar-api nation configs
 */
export const NATIONAL_CONFIGS: Record<string, Partial<CalendarConfig>> = {
  // Vatican / Universal Church (default)
  VA: {
    ascensio: AscensioConfig.FERIA_V,
    corpusChristi: CorpusChristiConfig.FERIA_V,
    epiphania: EpiphaniaConfig.IANUARII_6,
    locale: 'la'
  },

  // Italy
  IT: {
    ascensio: AscensioConfig.DOMINICA,
    corpusChristi: CorpusChristiConfig.DOMINICA,
    epiphania: EpiphaniaConfig.IANUARII_6,  // Public holiday
    locale: 'it',
    calendar: 'IT'
  },

  // United States
  US: {
    ascensio: AscensioConfig.DOMINICA,  // Most dioceses
    corpusChristi: CorpusChristiConfig.DOMINICA,
    epiphania: EpiphaniaConfig.DOMINICA,
    locale: 'en',
    calendar: 'US'
  },

  // United Kingdom
  GB: {
    ascensio: AscensioConfig.FERIA_V,  // Still Thursday
    corpusChristi: CorpusChristiConfig.DOMINICA,
    epiphania: EpiphaniaConfig.DOMINICA,
    locale: 'en',
    calendar: 'GB'
  },

  // Germany
  DE: {
    ascensio: AscensioConfig.FERIA_V,  // Public holiday
    corpusChristi: CorpusChristiConfig.FERIA_V,  // Public holiday in some states
    epiphania: EpiphaniaConfig.IANUARII_6,  // Public holiday in some states
    locale: 'de',
    calendar: 'DE'
  },

  // France
  FR: {
    ascensio: AscensioConfig.FERIA_V,  // Public holiday
    corpusChristi: CorpusChristiConfig.DOMINICA,
    epiphania: EpiphaniaConfig.DOMINICA,
    locale: 'fr',
    calendar: 'FR'
  },

  // Spain
  ES: {
    ascensio: AscensioConfig.DOMINICA,
    corpusChristi: CorpusChristiConfig.DOMINICA,
    epiphania: EpiphaniaConfig.IANUARII_6,  // Public holiday
    locale: 'es',
    calendar: 'ES'
  },

  // Poland
  PL: {
    ascensio: AscensioConfig.FERIA_V,
    corpusChristi: CorpusChristiConfig.FERIA_V,  // Public holiday
    epiphania: EpiphaniaConfig.IANUARII_6,  // Public holiday
    locale: 'pl',
    calendar: 'PL'
  },

  // Brazil
  BR: {
    ascensio: AscensioConfig.DOMINICA,
    corpusChristi: CorpusChristiConfig.FERIA_V,  // Public holiday in some states
    epiphania: EpiphaniaConfig.DOMINICA,
    locale: 'pt',
    calendar: 'BR'
  },

  // Philippines
  PH: {
    ascensio: AscensioConfig.DOMINICA,
    corpusChristi: CorpusChristiConfig.DOMINICA,
    epiphania: EpiphaniaConfig.DOMINICA,
    locale: 'en',
    calendar: 'PH'
  },

  // Ireland
  IE: {
    ascensio: AscensioConfig.DOMINICA,
    corpusChristi: CorpusChristiConfig.DOMINICA,
    epiphania: EpiphaniaConfig.DOMINICA,
    locale: 'en',
    calendar: 'IE'
  },

  // Australia
  AU: {
    ascensio: AscensioConfig.DOMINICA,
    corpusChristi: CorpusChristiConfig.DOMINICA,
    epiphania: EpiphaniaConfig.DOMINICA,
    locale: 'en',
    calendar: 'AU'
  },

  // Canada
  CA: {
    ascensio: AscensioConfig.DOMINICA,
    corpusChristi: CorpusChristiConfig.DOMINICA,
    epiphania: EpiphaniaConfig.DOMINICA,
    locale: 'en',
    calendar: 'CA'
  },

  // Mexico
  MX: {
    ascensio: AscensioConfig.DOMINICA,
    corpusChristi: CorpusChristiConfig.DOMINICA,
    epiphania: EpiphaniaConfig.IANUARII_6,
    locale: 'es',
    calendar: 'MX'
  },

  // Argentina
  AR: {
    ascensio: AscensioConfig.DOMINICA,
    corpusChristi: CorpusChristiConfig.DOMINICA,
    epiphania: EpiphaniaConfig.DOMINICA,
    locale: 'es',
    calendar: 'AR'
  }
};

/**
 * Get configuration for a specific nation
 */
export function getCalendarConfig(nation: string): CalendarConfig {
  const nationalConfig = NATIONAL_CONFIGS[nation.toUpperCase()];
  if (nationalConfig) {
    return { ...DEFAULT_CONFIG, ...nationalConfig };
  }
  return { ...DEFAULT_CONFIG };
}

/**
 * Create custom calendar configuration
 */
export function createCalendarConfig(options: Partial<CalendarConfig>): CalendarConfig {
  return { ...DEFAULT_CONFIG, ...options };
}

// =============================================================================
// DIOCESE CONFIGURATION
// =============================================================================

/**
 * Diocese-specific configurations
 * Format: NATION_DIOCESE (e.g., US_CHICAGO, IT_MILANO)
 */
export interface DioceseConfig extends CalendarConfig {
  /** Diocese name */
  name: string;
  /** Patron saint(s) */
  patroni?: string[];
  /** Dedication anniversary */
  dedicatio?: { month: number; day: number };
  /** Additional proper celebrations */
  propria?: string[];
}

/**
 * US diocesan variations for Ascension
 * Most US dioceses transfer to Sunday, but some provinces retain Thursday
 */
export const US_ASCENSION_THURSDAY_PROVINCES = [
  'BOSTON',
  'HARTFORD',
  'NEW_YORK',
  'NEWARK',
  'OMAHA',
  'PHILADELPHIA'
];

/**
 * Check if a US diocese celebrates Ascension on Thursday
 */
export function usAscensionIsThursday(diocese: string): boolean {
  return US_ASCENSION_THURSDAY_PROVINCES.some(
    p => diocese.toUpperCase().includes(p)
  );
}
