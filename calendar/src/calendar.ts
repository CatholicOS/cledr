/**
 * CLEDR Liturgical Calendar - Calendar Resolution Engine
 * Combines Temporale + Sanctorale with 14-level precedence resolution
 */

import {
  Tempus, TempusCodes, Gradus, Praecedentia, PraecedentiaValue,
  Color, Genus, Dies, DiesCodes
} from './types';
import type { DiesLiturgicus, DiesSpecialis } from './types';

import {
  tempus, hebdomadaTemporis, hebdomadaPsalterii,
  cyclusDominicalis, cyclusFerialis, estDominica, diesHebdomadae, idemDies,
  feriaIVCinerum, dominicaInPalmis, feriaVInCenaDomini, feriaVIInPassioneDomini,
  sabbatumSanctum, pascha, dominicaIAdventus, addDies
} from './computus';

import { findTemporaleCelebration } from './temporale';
import { findSanctoraleCelebration } from './sanctorale';

// =============================================================================
// CALENDAR RESOLUTION ENGINE
// =============================================================================

/**
 * Find all celebrations for a given date
 * Returns both temporale and sanctorale celebrations sorted by precedence
 */
export function findCelebrations(date: Date): DiesSpecialis[] {
  const celebrations: DiesSpecialis[] = [];

  // Find temporale celebrations (moveable feasts)
  const temporale = findTemporaleCelebration(date);
  if (temporale) {
    celebrations.push(temporale);
  }

  // Find sanctorale celebrations (fixed feasts)
  const sanctorale = findSanctoraleCelebration(date);
  if (sanctorale) {
    celebrations.push(sanctorale);
  }

  // Sort by precedence (lower value = higher precedence)
  return celebrations.sort((a, b) =>
    PraecedentiaValue[a.praecedentia] - PraecedentiaValue[b.praecedentia]
  );
}

/**
 * Get the primary celebration for a date after precedence resolution
 * Implements the 14-level precedence system from UNLY
 */
export function resolvePrecedence(date: Date): DiesSpecialis | null {
  const celebrations = findCelebrations(date);
  return celebrations.length > 0 ? celebrations[0] : null;
}

/**
 * Check if a sanctorale celebration can be celebrated on a given date
 * Some memorials cannot be celebrated during privileged seasons
 */
export function canCelebrate(celebration: DiesSpecialis, date: Date): boolean {
  const currentTempus = tempus(date);
  const annus = date.getFullYear();

  // During Lent and Advent, optional memorials become commemorations
  if (celebration.gradus === Gradus.MEMORIA_AD_LIBITUM) {
    if (currentTempus === Tempus.QUADRAGESIMA || currentTempus === Tempus.ADVENTUS) {
      return false; // Cannot celebrate, only commemorate
    }
  }

  // During privileged days, most celebrations are suppressed
  const privilegedDays = [
    feriaIVCinerum(annus),      // Ash Wednesday
    dominicaInPalmis(annus),    // Palm Sunday
    feriaVInCenaDomini(annus),  // Holy Thursday
    feriaVIInPassioneDomini(annus), // Good Friday
    sabbatumSanctum(annus),     // Holy Saturday
    pascha(annus)               // Easter Sunday
  ];

  if (privilegedDays.some(d => idemDies(d, date))) {
    // Only highest precedence celebrations can occur
    return PraecedentiaValue[celebration.praecedentia] <= 204; // Level 2 or higher
  }

  return true;
}

// =============================================================================
// COMPLETE LITURGICAL DAY BUILDER
// =============================================================================

/**
 * Get the default liturgical color for a season/day
 */
function getDefaultColor(currentTempus: Tempus, date: Date): Color {
  const annus = date.getFullYear();

  switch (currentTempus) {
    case Tempus.ADVENTUS:
      // Rose on Gaudete Sunday (3rd Sunday of Advent)
      if (estDominica(date)) {
        const advent1 = dominicaIAdventus(annus);
        const weeksFromAdvent = Math.floor((date.getTime() - advent1.getTime()) / (7 * 24 * 60 * 60 * 1000));
        if (weeksFromAdvent === 2) return Color.ROSACEUS; // Gaudete
      }
      return Color.VIOLACEUS;

    case Tempus.NATIVITAS:
      return Color.ALBUS;

    case Tempus.QUADRAGESIMA:
      // Rose on Laetare Sunday (4th Sunday of Lent)
      if (estDominica(date)) {
        const cinerum = feriaIVCinerum(annus);
        const weeksSinceLent = Math.floor((date.getTime() - cinerum.getTime()) / (7 * 24 * 60 * 60 * 1000));
        if (weeksSinceLent === 3) return Color.ROSACEUS; // Laetare
      }
      return Color.VIOLACEUS;

    case Tempus.TRIDUUM:
      return Color.RUBER; // Good Friday: red; others: white

    case Tempus.PASCHALE:
      return Color.ALBUS;

    case Tempus.ORDINARIUM:
    default:
      return Color.VIRIDIS;
  }
}

/**
 * Get the feria (weekday) celebration for a date
 */
function getFerial(date: Date): DiesSpecialis {
  const currentTempus = tempus(date);
  const week = hebdomadaTemporis(date);
  const dayOfWeek = diesHebdomadae(date);

  // Determine precedence based on season
  let praecedentia: Praecedentia;
  switch (currentTempus) {
    case Tempus.TRIDUUM:
      praecedentia = Praecedentia.TRIDUUM_1;
      break;
    case Tempus.QUADRAGESIMA:
      praecedentia = Praecedentia.FERIA_QUADRAGESIMAE_9;
      break;
    case Tempus.ADVENTUS:
      // Dec 17-24 have higher precedence
      if (date.getMonth() === 11 && date.getDate() >= 17) {
        praecedentia = Praecedentia.FERIA_ADVENTUS_17_24_9;
      } else {
        praecedentia = Praecedentia.FERIA_ADVENTUS_13;
      }
      break;
    case Tempus.NATIVITAS:
      // Octave days have higher precedence
      if (date.getMonth() === 11 && date.getDate() >= 26 && date.getDate() <= 31) {
        praecedentia = Praecedentia.DIES_OCTAVAE_NATIVITATIS_9;
      } else {
        praecedentia = Praecedentia.FERIA_NATIVITATIS_13;
      }
      break;
    case Tempus.PASCHALE:
      praecedentia = Praecedentia.FERIA_PASCHAE_13;
      break;
    default:
      praecedentia = Praecedentia.FERIA_ORDINARII_14;
  }

  // Sundays have different precedence
  if (estDominica(date)) {
    switch (currentTempus) {
      case Tempus.ADVENTUS:
      case Tempus.QUADRAGESIMA:
      case Tempus.PASCHALE:
        praecedentia = Praecedentia.DOMINICA_PRIVILEGIATA_2;
        break;
      case Tempus.NATIVITAS:
        praecedentia = Praecedentia.DOMINICA_NATIVITATIS_6;
        break;
      default:
        praecedentia = Praecedentia.DOMINICA_ORDINARII_6;
    }
  }

  const tempusCode = TempusCodes[currentTempus];

  return {
    code: `${tempusCode}${week.toString().padStart(2, '0')}${dayOfWeek}`,
    id: `${currentTempus.toLowerCase()}/week-${week}/${dayOfWeek}`,
    shortCode: `${tempusCode}${week}`,
    genus: Genus.TEMPORALE,
    gradus: estDominica(date) ? Gradus.SOLLEMNITAS : Gradus.FERIA,
    praecedentia,
    priority: PraecedentiaValue[praecedentia],
    colores: [getDefaultColor(currentTempus, date)],
    nomina: {
      la: estDominica(date)
        ? `Dominica ${toRoman(week)} ${getSeasonNameLA(currentTempus)}`
        : `Feria ${toRoman(dayOfWeek + 1)} Hebdomadae ${toRoman(week)} ${getSeasonNameLA(currentTempus)}`,
      en: estDominica(date)
        ? `${toOrdinal(week)} Sunday ${getSeasonNameEN(currentTempus)}`
        : `${getDayNameEN(dayOfWeek)} of the ${toOrdinal(week)} Week ${getSeasonNameEN(currentTempus)}`
    },
    match: (d) => idemDies(d, date)
  };
}

// =============================================================================
// COMPLETE LITURGICAL DAY
// =============================================================================

/**
 * Build complete liturgical day information for any date
 * This is the main entry point for the calendar
 */
export function getDiesLiturgicus(date: Date): DiesLiturgicus {
  const currentTempus = tempus(date);
  const week = hebdomadaTemporis(date);
  const dayOfWeek = diesHebdomadae(date);
  const cyclusDom = cyclusDominicalis(date);
  const cyclusFer = cyclusFerialis(date);
  const psalterWeek = hebdomadaPsalterii(date);

  // Find all celebrations
  const allCelebrations = findCelebrations(date);

  // Get the primary celebration (highest precedence)
  const primaryCelebration = allCelebrations[0] || getFerial(date);

  // Get commemorations (lower precedence celebrations that can be commemorated)
  const commemorations = allCelebrations.slice(1).filter(c =>
    canCelebrate(c, date) &&
    PraecedentiaValue[c.praecedentia] < 1200 // Higher than optional memorials
  );

  // Get alternatives (optional memorials)
  const alternatives = allCelebrations.filter(c =>
    c.gradus === Gradus.MEMORIA_AD_LIBITUM && canCelebrate(c, date)
  );

  // Build TitleCode (ePrex format)
  const tempusCode = TempusCodes[currentTempus];
  const weekCode = `ST${week.toString().padStart(2, '0')}`;
  const dayCode = DiesCodes[dayOfWeek as Dies];
  const yearCode = `Y-${cyclusDom}${cyclusFer}`;
  const titleCode = `TIT;${tempusCode};${weekCode};${dayCode};${yearCode}`;

  // Build CLEDR shortCode
  const shortCode = primaryCelebration.shortCode ||
    `${tempusCode.toLowerCase()}/${week.toString().padStart(2, '0')}/${dayOfWeek}`;

  return {
    date,
    tempus: currentTempus,
    hebdomada: week,
    hebdomadaPsalterii: psalterWeek,
    dies: dayOfWeek as Dies,
    cyclusDominicalis: cyclusDom,
    cyclusFerialis: cyclusFer,
    gradus: primaryCelebration.gradus,
    praecedentia: primaryCelebration.praecedentia,
    colores: primaryCelebration.colores,
    genus: primaryCelebration.genus,
    id: primaryCelebration.id,
    shortCode,
    titleCode,
    nomina: primaryCelebration.nomina,
    commemoratio: commemorations.length > 0
      ? commemorations.map(c => buildLiturgicalDay(c, date))
      : undefined,
    alternativae: alternatives.length > 0
      ? alternatives.map(c => buildLiturgicalDay(c, date))
      : undefined
  };
}

/**
 * Build a partial DiesLiturgicus from a DiesSpecialis
 */
function buildLiturgicalDay(celebration: DiesSpecialis, date: Date): DiesLiturgicus {
  const currentTempus = tempus(date);
  const week = hebdomadaTemporis(date);
  const dayOfWeek = diesHebdomadae(date);

  return {
    date,
    tempus: currentTempus,
    hebdomada: week,
    hebdomadaPsalterii: hebdomadaPsalterii(date),
    dies: dayOfWeek as Dies,
    cyclusDominicalis: cyclusDominicalis(date),
    cyclusFerialis: cyclusFerialis(date),
    gradus: celebration.gradus,
    praecedentia: celebration.praecedentia,
    colores: celebration.colores,
    genus: celebration.genus,
    id: celebration.id,
    shortCode: celebration.shortCode,
    titleCode: '',
    nomina: celebration.nomina
  };
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Convert number to Roman numeral
 */
function toRoman(num: number): string {
  const romanNumerals: [number, string][] = [
    [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
  ];

  let result = '';
  for (const [value, numeral] of romanNumerals) {
    while (num >= value) {
      result += numeral;
      num -= value;
    }
  }
  return result;
}

/**
 * Convert number to ordinal (English)
 */
function toOrdinal(num: number): string {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const v = num % 100;
  return num + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}

/**
 * Get season name in Latin (genitive case)
 */
function getSeasonNameLA(t: Tempus): string {
  switch (t) {
    case Tempus.ADVENTUS: return 'Adventus';
    case Tempus.NATIVITAS: return 'Temporis Nativitatis';
    case Tempus.QUADRAGESIMA: return 'Quadragesimae';
    case Tempus.TRIDUUM: return 'Tridui Paschalis';
    case Tempus.PASCHALE: return 'Temporis Paschalis';
    case Tempus.ORDINARIUM: return 'per Annum';
    default: return '';
  }
}

/**
 * Get season name in English
 */
function getSeasonNameEN(t: Tempus): string {
  switch (t) {
    case Tempus.ADVENTUS: return 'of Advent';
    case Tempus.NATIVITAS: return 'of the Christmas Season';
    case Tempus.QUADRAGESIMA: return 'of Lent';
    case Tempus.TRIDUUM: return 'of the Paschal Triduum';
    case Tempus.PASCHALE: return 'of Easter';
    case Tempus.ORDINARIUM: return 'in Ordinary Time';
    default: return '';
  }
}

/**
 * Get day name in English
 */
function getDayNameEN(day: number): string {
  const names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return names[day] || '';
}

// =============================================================================
// CALENDAR RANGE FUNCTIONS
// =============================================================================

/**
 * Get liturgical calendar for a date range
 */
export function getCalendarRange(start: Date, end: Date): DiesLiturgicus[] {
  const result: DiesLiturgicus[] = [];
  const current = new Date(start);

  while (current <= end) {
    result.push(getDiesLiturgicus(new Date(current)));
    current.setDate(current.getDate() + 1);
  }

  return result;
}

/**
 * Get liturgical calendar for a month
 */
export function getCalendarMonth(annus: number, mensis: number): DiesLiturgicus[] {
  const start = new Date(annus, mensis - 1, 1);
  const end = new Date(annus, mensis, 0); // Last day of month
  return getCalendarRange(start, end);
}

/**
 * Get liturgical calendar for a year (civil year)
 */
export function getCalendarYear(annus: number): DiesLiturgicus[] {
  const start = new Date(annus, 0, 1);
  const end = new Date(annus, 11, 31);
  return getCalendarRange(start, end);
}

/**
 * Get liturgical calendar for a liturgical year
 * (First Sunday of Advent to Saturday before next Advent)
 */
export function getCalendarLiturgicalYear(annus: number): DiesLiturgicus[] {
  const start = dominicaIAdventus(annus - 1);
  const end = addDies(dominicaIAdventus(annus), -1);
  return getCalendarRange(start, end);
}

// =============================================================================
// EXPORTS
// =============================================================================

// Re-export enums and constants
export {
  Tempus, TempusCodes, Gradus, Praecedentia, PraecedentiaValue,
  Color, Genus, Fons, Dies, DiesCodes,
  CyclusDominicalis, CyclusFerialis
} from './types';

// Re-export types
export type { DiesLiturgicus, DiesSpecialis, HebdomadaPsalterii } from './types';

// Re-export computus functions
export {
  computusPaschalis, pascha, pentecostes, ascensio, trinitas,
  corpusChristi, corIesu, corImmaculatumBMV, mariaMaterEcclesiae,
  feriaIVCinerum, dominicaInPalmis, feriaVInCenaDomini,
  feriaVIInPassioneDomini, sabbatumSanctum, dominicaInOctavaPaschae,
  christusRex, dominicaIAdventus, nativitas, sacraFamilia,
  epiphania, baptismaDomini,
  tempus, hebdomadaTemporis, hebdomadaPsalterii,
  cyclusDominicalis, cyclusFerialis
} from './computus';
