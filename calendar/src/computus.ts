/**
 * CLEDR Liturgical Calendar - Computus & Date Calculations
 * Core algorithms for Easter and moveable feast calculations
 */

// =============================================================================
// EASTER CALCULATION (Computus Paschalis)
// =============================================================================

/**
 * Calculate Easter Sunday using the Meeus/Jones/Butcher algorithm
 * Valid for Gregorian calendar years 1583-2499
 *
 * @param annus - Year (1583-2499)
 * @returns Date of Easter Sunday
 */
export function computusPaschalis(annus: number): Date {
  // Century-specific parameters (m, q) per Meeus
  let m: number, q: number;

  if (annus >= 1583 && annus <= 1699) { m = 22; q = 2; }
  else if (annus >= 1700 && annus <= 1799) { m = 23; q = 3; }
  else if (annus >= 1800 && annus <= 1899) { m = 23; q = 4; }
  else if (annus >= 1900 && annus <= 2099) { m = 24; q = 5; }
  else if (annus >= 2100 && annus <= 2199) { m = 24; q = 6; }
  else if (annus >= 2200 && annus <= 2299) { m = 25; q = 0; }
  else if (annus >= 2300 && annus <= 2399) { m = 26; q = 1; }
  else if (annus >= 2400 && annus <= 2499) { m = 25; q = 1; }
  else { m = 24; q = 5; } // Default to 1900-2099

  const a = annus % 19;
  const b = annus % 4;
  const c = annus % 7;
  const d = (19 * a + m) % 30;
  const e = (2 * b + 4 * c + 6 * d + q) % 7;
  const f = 22 + d + e;

  // March or April
  return f > 31
    ? new Date(annus, 3, f - 31)  // April (month index 3)
    : new Date(annus, 2, f);       // March (month index 2)
}

// =============================================================================
// MOVEABLE FEASTS (Festa Mobilia)
// =============================================================================

/** Pascha - Easter Sunday */
export const pascha = computusPaschalis;

/** Dominica Pentecostes - Pentecost: Easter + 49 days */
export function pentecostes(annus: number): Date {
  return addDies(pascha(annus), 49);
}

/** Ascensio Domini - Ascension: Easter + 39 days (moved to Sunday in most countries) */
export function ascensio(annus: number, inDominica = true): Date {
  const date = addDies(pascha(annus), 39);
  return inDominica ? proximaDominica(date) : date;
}

/** Ss.mae Trinitatis - Trinity Sunday: Easter + 56 days (Sunday after Pentecost) */
export function trinitas(annus: number): Date {
  return addDies(pascha(annus), 56);
}

/** Ss.mi Corporis et Sanguinis Christi - Corpus Christi: Easter + 60 days (moved to Sunday) */
export function corpusChristi(annus: number, inDominica = true): Date {
  const date = addDies(pascha(annus), 60);
  return inDominica ? proximaDominica(date) : date;
}

/** Ss.mi Cordis Iesu - Sacred Heart: Friday after Corpus Christi (Easter + 68 days) */
export function corIesu(annus: number): Date {
  return addDies(pascha(annus), 68);
}

/** Cor Immaculatum BMV - Immaculate Heart of Mary: Saturday after Sacred Heart (Easter + 69 days) */
export function corImmaculatumBMV(annus: number): Date {
  return addDies(pascha(annus), 69);
}

/** Maria Mater Ecclesiae - Mary Mother of Church: Monday after Pentecost (Easter + 50 days) */
export function mariaMaterEcclesiae(annus: number): Date {
  return addDies(pascha(annus), 50);
}

/** Feria IV Cinerum - Ash Wednesday: Easter - 46 days */
export function feriaIVCinerum(annus: number): Date {
  return addDies(pascha(annus), -46);
}

/** Dominica in Palmis - Palm Sunday: Easter - 7 days */
export function dominicaInPalmis(annus: number): Date {
  return addDies(pascha(annus), -7);
}

/** Feria V in Cena Domini - Holy Thursday: Easter - 3 days */
export function feriaVInCenaDomini(annus: number): Date {
  return addDies(pascha(annus), -3);
}

/** Feria VI in Passione Domini - Good Friday: Easter - 2 days */
export function feriaVIInPassioneDomini(annus: number): Date {
  return addDies(pascha(annus), -2);
}

/** Sabbatum Sanctum - Holy Saturday: Easter - 1 day */
export function sabbatumSanctum(annus: number): Date {
  return addDies(pascha(annus), -1);
}

/** Dominica in octava Paschae - Divine Mercy Sunday: Easter + 7 days */
export function dominicaInOctavaPaschae(annus: number): Date {
  return addDies(pascha(annus), 7);
}

/** D.N. Iesu Christi Regis - Christ the King: Sunday before Advent */
export function christusRex(annus: number): Date {
  return addDies(dominicaIAdventus(annus), -7);
}

// =============================================================================
// ADVENT & CHRISTMAS CYCLE
// =============================================================================

/** Dominica I Adventus - First Sunday of Advent */
export function dominicaIAdventus(annus: number): Date {
  const natale = new Date(annus, 11, 25); // December 25
  let diesHebdomadae = natale.getDay();
  if (diesHebdomadae === 0) diesHebdomadae = 7; // Sunday = 7 for calculation

  const daysBack = 21 + diesHebdomadae; // 4 Sundays before Christmas
  return addDies(natale, -daysBack);
}

/** Nativitas Domini - Christmas */
export function nativitas(annus: number): Date {
  return new Date(annus, 11, 25);
}

/** Sacra Familia - Holy Family: Sunday after Christmas (or Dec 30 if Christmas is Sunday) */
export function sacraFamilia(annus: number): Date {
  const natale = nativitas(annus);
  if (natale.getDay() === 0) {
    // Christmas is Sunday, Holy Family is Dec 30
    return new Date(annus, 11, 30);
  }
  return proximaDominica(natale);
}

/** In Epiphania Domini - Epiphany (Jan 6 or Sunday between Jan 2-8) */
export function epiphania(annus: number, fixedDate = true): Date {
  if (fixedDate) {
    return new Date(annus, 0, 6);
  }
  // Transferred to Sunday between Jan 2-8
  const jan2 = new Date(annus, 0, 2);
  return proximaDominica(jan2);
}

/** In Baptismate Domini - Baptism of the Lord: Sunday after Epiphany */
export function baptismaDomini(annus: number): Date {
  const epiphaniaDate = epiphania(annus);
  // If Epiphany is Jan 7 or 8, Baptism is the next day (Monday)
  if (epiphaniaDate.getDate() >= 7) {
    return addDies(epiphaniaDate, 1);
  }
  // Otherwise, it's the Sunday after Epiphany
  return proximaDominica(addDies(epiphaniaDate, 1));
}

/** Dominica II post Nativitatem - Second Sunday after Christmas (if exists) */
export function dominicaIIPostNativitatem(annus: number): Date | null {
  const jan6 = new Date(annus, 0, 6);
  const dayOfWeek = jan6.getDay();

  // Returns null if there's no room for a second Sunday between Christmas and Epiphany
  if (dayOfWeek === 0 || dayOfWeek === 1 || dayOfWeek === 6) {
    return null;
  }

  const daysToSunday = (7 - dayOfWeek) % 7;
  if (daysToSunday === 0) return null;

  return new Date(annus, 0, 6 - dayOfWeek);
}

// =============================================================================
// LITURGICAL SEASON DETERMINATION
// =============================================================================

import { Tempus } from './types';

/**
 * Determine the liturgical season for a given date
 */
export function tempus(date: Date): Tempus {
  const annus = date.getFullYear();

  // Advent: First Sunday of Advent to Dec 24
  const adventus1 = dominicaIAdventus(annus);
  const natale = nativitas(annus);

  if (date >= adventus1 && date < natale) {
    return Tempus.ADVENTUS;
  }

  // Christmas: Dec 25 to Baptism of the Lord
  const baptisma = baptismaDomini(annus);

  if (date >= natale || date < baptisma) {
    // Check if we're still in previous year's Christmas season
    if (date.getMonth() === 0 && date < baptisma) {
      return Tempus.NATIVITAS;
    }
    if (date.getMonth() === 11 && date >= natale) {
      return Tempus.NATIVITAS;
    }
  }

  // Lent: Ash Wednesday to Holy Thursday (exclusive)
  const cinerum = feriaIVCinerum(annus);
  const cenaDomini = feriaVInCenaDomini(annus);

  if (date >= cinerum && date < cenaDomini) {
    return Tempus.QUADRAGESIMA;
  }

  // Paschal Triduum: Holy Thursday evening to Easter Sunday evening
  const paschaDomini = pascha(annus);

  if (date >= cenaDomini && date <= paschaDomini) {
    return Tempus.TRIDUUM;
  }

  // Easter: Easter Monday to Pentecost
  const pentecostesDate = pentecostes(annus);

  if (date > paschaDomini && date <= pentecostesDate) {
    return Tempus.PASCHALE;
  }

  // Ordinary Time (everything else)
  return Tempus.ORDINARIUM;
}

// =============================================================================
// WEEK CALCULATIONS
// =============================================================================

/**
 * Get the week number within the current liturgical season
 */
export function hebdomadaTemporis(date: Date): number {
  const annus = date.getFullYear();
  const currentTempus = tempus(date);

  switch (currentTempus) {
    case Tempus.ADVENTUS: {
      const adventus1 = dominicaIAdventus(annus);
      return Math.floor(diesInter(adventus1, date) / 7) + 1;
    }

    case Tempus.NATIVITAS: {
      // Week of Christmas season (1 = Christmas week, 2 = after New Year)
      const refYear = date.getMonth() >= 11 ? annus : annus - 1;
      const nataleRef = nativitas(refYear);
      const weeksFromChristmas = Math.floor(diesInter(nataleRef, date) / 7);
      return weeksFromChristmas + 1;
    }

    case Tempus.QUADRAGESIMA: {
      const cinerum = feriaIVCinerum(annus);
      // Lent weeks: Week 0 = Ash Wed to Saturday, Week 1 = First Sunday of Lent, etc.
      const daysFromAshWed = diesInter(cinerum, date);
      if (daysFromAshWed < 4) return 0; // Days after Ash Wednesday before First Sunday
      return Math.floor((daysFromAshWed + 3) / 7);
    }

    case Tempus.TRIDUUM: {
      // Triduum doesn't have weeks
      return 0;
    }

    case Tempus.PASCHALE: {
      const paschaDomini = pascha(annus);
      return Math.floor(diesInter(paschaDomini, date) / 7) + 1;
    }

    case Tempus.ORDINARIUM:
    default: {
      const baptisma = baptismaDomini(annus);
      const cinerum = feriaIVCinerum(annus);
      const pentecostesDate = pentecostes(annus);
      const adventus1 = dominicaIAdventus(annus);

      // First part: Baptism to Ash Wednesday
      if (date < cinerum) {
        return Math.floor(diesInter(baptisma, date) / 7) + 1;
      }

      // Second part: After Pentecost
      // Calculate from the end (week 34 is always before Advent)
      const totalWeeksAfterPentecost = Math.floor(diesInter(pentecostesDate, adventus1) / 7);
      const weeksFromPentecost = Math.floor(diesInter(pentecostesDate, date) / 7);
      return 34 - totalWeeksAfterPentecost + weeksFromPentecost + 1;
    }
  }
}

/**
 * Get the psalter week (1-4 cycle)
 */
export function hebdomadaPsalterii(date: Date): 1 | 2 | 3 | 4 {
  const week = hebdomadaTemporis(date) % 4;
  return (week === 0 ? 4 : week) as 1 | 2 | 3 | 4;
}

// =============================================================================
// LITURGICAL YEAR CYCLES
// =============================================================================

import { CyclusDominicalis, CyclusFerialis } from './types';

/**
 * Check if date is in the new liturgical year (after First Sunday of Advent)
 */
export function estNovusAnnusLiturgicus(date: Date): boolean {
  return date >= dominicaIAdventus(date.getFullYear());
}

/**
 * Get the Sunday lectionary cycle (A, B, C)
 * Cycle A = Matthew, B = Mark, C = Luke
 */
export function cyclusDominicalis(date: Date): CyclusDominicalis {
  const annus = estNovusAnnusLiturgicus(date)
    ? date.getFullYear()
    : date.getFullYear() - 1;

  const cyclus = annus % 3;
  switch (cyclus) {
    case 0: return CyclusDominicalis.A;
    case 1: return CyclusDominicalis.B;
    default: return CyclusDominicalis.C;
  }
}

/**
 * Get the weekday lectionary cycle (I, II - biennial)
 */
export function cyclusFerialis(date: Date): CyclusFerialis {
  const annus = estNovusAnnusLiturgicus(date)
    ? date.getFullYear() + 1
    : date.getFullYear();

  return annus % 2 === 1 ? CyclusFerialis.I : CyclusFerialis.II;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Add days to a date
 */
export function addDies(date: Date, dies: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + dies);
  return result;
}

/**
 * Get the next Sunday after a date (or the date itself if it's Sunday)
 */
export function proximaDominica(date: Date): Date {
  const dayOfWeek = date.getDay();
  if (dayOfWeek === 0) return date; // Already Sunday
  const daysUntilSunday = 7 - dayOfWeek;
  return addDies(date, daysUntilSunday);
}

/**
 * Get days between two dates
 */
export function diesInter(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.floor((date2.getTime() - date1.getTime()) / oneDay);
}

/**
 * Check if a date is Sunday
 */
export function estDominica(date: Date): boolean {
  return date.getDay() === 0;
}

/**
 * Get day of week as Dies enum value
 */
export function diesHebdomadae(date: Date): number {
  return date.getDay();
}

/**
 * Compare two dates (ignoring time)
 */
export function idemDies(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
}
