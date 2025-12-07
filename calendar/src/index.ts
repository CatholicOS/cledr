/**
 * CLEDR Liturgical Calendar
 * Common Liturgical Events Data Repository
 *
 * Complete liturgical calendar implementation with:
 * - Latin enumerations (IGMR compliant)
 * - 14-level precedence system (UNLY)
 * - Temporale (moveable feasts based on Easter)
 * - Sanctorale (General Roman Calendar)
 * - Calendar resolution engine
 *
 * @version 1.0.0
 * @license MIT
 */

// =============================================================================
// TYPE EXPORTS
// =============================================================================

// Enums and constants
export {
  // Liturgical seasons
  Tempus,
  TempusCodes,

  // Liturgical ranks
  Gradus,
  GradusPriority,

  // 14-level precedence system
  Praecedentia,
  PraecedentiaValue,

  // Liturgical colors
  Color,

  // Event types
  Genus,
  Fons,

  // Days of week
  Dies,
  DiesCodes,
  DiesNomina,

  // Liturgical cycles
  CyclusDominicalis,
  CyclusFerialis
} from './types';

// Type exports
export type {
  HebdomadaPsalterii,
  DiesLiturgicus,
  DiesSpecialis
} from './types';

// =============================================================================
// COMPUTUS EXPORTS (Easter & Moveable Feasts)
// =============================================================================

export {
  // Easter calculation
  computusPaschalis,
  pascha,

  // Moveable feasts
  pentecostes,
  ascensio,
  trinitas,
  corpusChristi,
  corIesu,
  corImmaculatumBMV,
  mariaMaterEcclesiae,

  // Lent & Holy Week
  feriaIVCinerum,
  dominicaInPalmis,
  feriaVInCenaDomini,
  feriaVIInPassioneDomini,
  sabbatumSanctum,
  dominicaInOctavaPaschae,

  // Advent & Christmas cycle
  christusRex,
  dominicaIAdventus,
  nativitas,
  sacraFamilia,
  epiphania,
  baptismaDomini,
  dominicaIIPostNativitatem,

  // Season & week calculations
  tempus,
  hebdomadaTemporis,
  hebdomadaPsalterii,

  // Liturgical year cycles
  estNovusAnnusLiturgicus,
  cyclusDominicalis,
  cyclusFerialis,

  // Utilities
  addDies,
  proximaDominica,
  diesInter,
  estDominica,
  diesHebdomadae,
  idemDies
} from './computus';

// =============================================================================
// TEMPORALE EXPORTS (Moveable Feasts Data)
// =============================================================================

export {
  TEMPORALE,
  findTemporale,
  findTemporaleCelebration,
  getTemporaleAnno
} from './temporale';

// =============================================================================
// SANCTORALE EXPORTS (Fixed Feasts Data)
// =============================================================================

export {
  // Monthly arrays
  SANCTORALE_JANUARY,
  SANCTORALE_FEBRUARY,
  SANCTORALE_MARCH,
  SANCTORALE_APRIL,
  SANCTORALE_MAY,
  SANCTORALE_JUNE,
  SANCTORALE_JULY,
  SANCTORALE_AUGUST,
  SANCTORALE_SEPTEMBER,
  SANCTORALE_OCTOBER,
  SANCTORALE_NOVEMBER,
  SANCTORALE_DECEMBER,

  // Combined array
  SANCTORALE,

  // Lookup functions
  findSanctorale,
  findSanctoraleCelebration,
  getSanctoraleByMonth
} from './sanctorale';

// =============================================================================
// CALENDAR EXPORTS (Main API)
// =============================================================================

export {
  // Resolution functions
  findCelebrations,
  resolvePrecedence,
  canCelebrate,

  // Main entry point
  getDiesLiturgicus,

  // Calendar range functions
  getCalendarRange,
  getCalendarMonth,
  getCalendarYear,
  getCalendarLiturgicalYear
} from './calendar';

// =============================================================================
// CONVENIENCE FUNCTIONS
// =============================================================================

import { getDiesLiturgicus } from './calendar';
import { DiesLiturgicus } from './types';

/**
 * Get today's liturgical day
 */
export function hodie(): DiesLiturgicus {
  return getDiesLiturgicus(new Date());
}

/**
 * Get liturgical day for a specific date string (YYYY-MM-DD)
 */
export function dies(dateString: string): DiesLiturgicus {
  const [year, month, day] = dateString.split('-').map(Number);
  return getDiesLiturgicus(new Date(year, month - 1, day));
}

// =============================================================================
// FRAGMENT NAME GENERATOR
// =============================================================================

export {
  // Enums
  Hora,
  HoraNomina,

  // Fragment generators
  getFragmentNames,
  getDayFragments,
  getMassFragments,
  getOfficiumFragments,
  generateExamples
} from './fragments';

export type { FragmentNames } from './fragments';

// =============================================================================
// LITURGICAL COLORS (GIRM)
// =============================================================================

export {
  LitColor,
  LitColorI18n,
  getSeasonColor,
  getColorName
} from './colors';

// =============================================================================
// COMMON TEXTS (COMMUNE)
// =============================================================================

export {
  // Main categories
  LitCommon,
  LitCommonLatin,

  // Subcategories
  LitCommonMartyrs,
  LitCommonPastors,
  LitCommonVirgins,
  LitCommonSaints,

  // Utilities
  getCommonPath
} from './commons';

// =============================================================================
// CONFIGURATION (Regional/National)
// =============================================================================

export {
  // Missal editions
  MissaleRomanum,
  MissaleRomanumInfo,

  // Moveable feast configuration
  AscensioConfig,
  CorpusChristiConfig,
  EpiphaniaConfig,

  // Calendar config
  DEFAULT_CONFIG,
  NATIONAL_CONFIGS,
  getCalendarConfig,
  createCalendarConfig,

  // US-specific
  US_ASCENSION_THURSDAY_PROVINCES,
  usAscensionIsThursday
} from './config';

export type { CalendarConfig, DioceseConfig } from './config';

// =============================================================================
// INTERNATIONALIZATION (i18n)
// =============================================================================

export {
  // Supported locales
  SUPPORTED_LOCALES,
  LOCALE_NAMES,

  // Translation tables
  TempusI18n,
  GradusI18n,
  ColorI18n,
  DiesI18n,
  TermsI18n,
  OrdinalesI18n,

  // Helper functions
  getSeasonName,
  getRankName,
  getLocalizedColorName,
  getDayName,
  getTerm,
  formatWeekName
} from './i18n';

export type { Locale } from './i18n';

// =============================================================================
// VERSION INFO
// =============================================================================

export const VERSION = '1.1.0';
export const CLEDR_STANDARD = '1.0';
