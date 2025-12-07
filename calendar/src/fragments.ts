/**
 * CLEDR Liturgical Calendar - Fragment Name Generator
 * Generates BMD fragment identifiers for liturgical content lookup
 *
 * Fragment naming convention:
 * - Temporale: {season}/{week}/{day}/{hora}
 * - Sanctorale: sancti/{month}/{day}/{hora}
 * - Proprium: proprium/{celebration_id}/{hora}
 */

import { findTemporale } from './temporale';
import { findSanctoraleCelebration } from './sanctorale';
import {
  tempus,
  hebdomadaTemporis,
  diesHebdomadae,
  cyclusDominicalis,
  cyclusFerialis,
  estDominica,
  pascha,
  addDies
} from './computus';
import {
  Tempus,
  TempusCodes,
  Dies,
  DiesCodes,
  CyclusDominicalis,
  CyclusFerialis,
  Gradus,
  Praecedentia,
  PraecedentiaValue
} from './types';
import type { DiesSpecialis } from './types';

// =============================================================================
// GRADUS RANKING (for proper precedence comparison)
// =============================================================================

/**
 * Numeric ranking for Gradus comparison (lower = higher precedence)
 */
const GradusRank: Record<Gradus, number> = {
  [Gradus.SOLLEMNITAS]: 1,
  [Gradus.FESTUM]: 2,
  [Gradus.MEMORIA]: 3,
  [Gradus.MEMORIA_AD_LIBITUM]: 4,
  [Gradus.COMMEMORATIO]: 5,
  [Gradus.FERIA]: 6
};

/**
 * Check if a Gradus is at least as high as another (>= in liturgical ranking)
 */
function gradusAtLeast(gradus: Gradus, threshold: Gradus): boolean {
  return GradusRank[gradus] <= GradusRank[threshold];
}

// =============================================================================
// SEASONAL PRECEDENCE CALCULATION
// =============================================================================

/**
 * Calculate the liturgical precedence for a seasonal day (not a named celebration)
 * This handles privileged Sundays, Lenten feriae, etc.
 */
function getSeasonalPraecedentia(date: Date): Praecedentia {
  const currentTempus = tempus(date);
  const sunday = estDominica(date);
  const annus = date.getFullYear();

  // Check for Easter Octave first (precedence 2)
  const easter = pascha(annus);
  const daysFromEaster = Math.round((date.getTime() - easter.getTime()) / (1000 * 60 * 60 * 24));
  if (daysFromEaster >= 0 && daysFromEaster <= 7) {
    return Praecedentia.DIES_OCTAVAE_PASCHAE_2;
  }

  // Sundays by season
  if (sunday) {
    switch (currentTempus) {
      case Tempus.ADVENTUS:
      case Tempus.QUADRAGESIMA:
      case Tempus.PASCHALE:
        return Praecedentia.DOMINICA_PRIVILEGIATA_2;
      case Tempus.NATIVITAS:
        return Praecedentia.DOMINICA_NATIVITATIS_6;
      case Tempus.ORDINARIUM:
      default:
        return Praecedentia.DOMINICA_ORDINARII_6;
    }
  }

  // Weekdays by season
  switch (currentTempus) {
    case Tempus.TRIDUUM:
      return Praecedentia.TRIDUUM_1;

    case Tempus.QUADRAGESIMA: {
      // Check for Ash Wednesday
      const ashWed = addDies(easter, -46);
      if (date.getTime() === ashWed.getTime()) {
        return Praecedentia.FERIA_IV_CINERUM_2;
      }
      // Check for Holy Week feriae (Mon-Wed)
      if (daysFromEaster >= -6 && daysFromEaster <= -4) {
        return Praecedentia.FERIA_HEBDOMADAE_SANCTAE_2;
      }
      // Regular Lenten feriae
      return Praecedentia.FERIA_QUADRAGESIMAE_9;
    }

    case Tempus.ADVENTUS: {
      // Dec 17-24 are privileged
      if (date.getMonth() === 11 && date.getDate() >= 17 && date.getDate() <= 24) {
        return Praecedentia.FERIA_ADVENTUS_17_24_9;
      }
      return Praecedentia.FERIA_ADVENTUS_13;
    }

    case Tempus.NATIVITAS:
      // Christmas Octave
      if (date.getMonth() === 11 && date.getDate() >= 26 && date.getDate() <= 31) {
        return Praecedentia.DIES_OCTAVAE_NATIVITATIS_9;
      }
      if (date.getMonth() === 0 && date.getDate() === 1) {
        return Praecedentia.DIES_OCTAVAE_NATIVITATIS_9;
      }
      return Praecedentia.FERIA_NATIVITATIS_13;

    case Tempus.PASCHALE:
      return Praecedentia.FERIA_PASCHAE_13;

    case Tempus.ORDINARIUM:
    default:
      return Praecedentia.FERIA_ORDINARII_14;
  }
}

/**
 * Check if a transferred feast applies (e.g., Annunciation during Holy Week)
 * Returns the transfer date if applicable, null otherwise
 */
function getTransferDate(sanctorale: DiesSpecialis, date: Date): Date | null {
  // Annunciation (Mar 25) transfer rules
  if (sanctorale.id === 'annunciation' && sanctorale.month === 3 && sanctorale.day === 25) {
    const annus = date.getFullYear();
    const easter = pascha(annus);
    const daysFromEaster = Math.round((date.getTime() - easter.getTime()) / (1000 * 60 * 60 * 24));

    // If Mar 25 falls during Holy Week or Easter Octave, transfer to Monday after Easter Octave
    if (daysFromEaster >= -7 && daysFromEaster <= 7) {
      // Transfer to Monday after Divine Mercy Sunday (Easter + 8)
      return addDies(easter, 8);
    }
  }

  // St. Joseph (Mar 19) similar rules
  if (sanctorale.id === 'joseph_spouse_of_mary' && sanctorale.month === 3 && sanctorale.day === 19) {
    const annus = date.getFullYear();
    const easter = pascha(annus);
    const daysFromEaster = Math.round((date.getTime() - easter.getTime()) / (1000 * 60 * 60 * 24));

    // If Mar 19 falls during Holy Week, transfer
    if (daysFromEaster >= -7 && daysFromEaster <= 0) {
      // Transfer to the Saturday before Palm Sunday
      return addDies(easter, -8);
    }
  }

  return null;
}

/**
 * Compare precedence values (lower = higher priority)
 */
function hasPrecedence(a: Praecedentia, b: Praecedentia): boolean {
  return PraecedentiaValue[a] < PraecedentiaValue[b];
}

// =============================================================================
// HORA LITURGICA (Liturgy of the Hours)
// =============================================================================

/**
 * Liturgical Hours
 */
export enum Hora {
  INVITATORIUM = 'INV',
  OFFICIUM_LECTIONIS = 'OL',
  LAUDES = 'LAU',
  TERTIA = 'TER',
  SEXTA = 'SEX',
  NONA = 'NON',
  VESPERAE = 'VES',
  COMPLETORIUM = 'COM',
  // Mass parts
  MISSA_INTROITUS = 'MIS-INT',
  MISSA_COLLECTA = 'MIS-COL',
  MISSA_LECTIO_I = 'MIS-L1',
  MISSA_PSALMUS = 'MIS-PS',
  MISSA_LECTIO_II = 'MIS-L2',
  MISSA_EVANGELIUM = 'MIS-EV',
  MISSA_SUPER_OBLATA = 'MIS-SO',
  MISSA_PRAEFATIO = 'MIS-PR',
  MISSA_POST_COMMUNIONEM = 'MIS-PC'
}

/**
 * Latin names for hours
 */
export const HoraNomina: Record<Hora, string> = {
  [Hora.INVITATORIUM]: 'Invitatorium',
  [Hora.OFFICIUM_LECTIONIS]: 'Officium Lectionis',
  [Hora.LAUDES]: 'Laudes Matutinae',
  [Hora.TERTIA]: 'Hora Tertia',
  [Hora.SEXTA]: 'Hora Sexta',
  [Hora.NONA]: 'Hora Nona',
  [Hora.VESPERAE]: 'Vesperae',
  [Hora.COMPLETORIUM]: 'Completorium',
  [Hora.MISSA_INTROITUS]: 'Antiphona ad Introitum',
  [Hora.MISSA_COLLECTA]: 'Collecta',
  [Hora.MISSA_LECTIO_I]: 'Lectio Prima',
  [Hora.MISSA_PSALMUS]: 'Psalmus Responsorius',
  [Hora.MISSA_LECTIO_II]: 'Lectio Secunda',
  [Hora.MISSA_EVANGELIUM]: 'Evangelium',
  [Hora.MISSA_SUPER_OBLATA]: 'Super Oblata',
  [Hora.MISSA_PRAEFATIO]: 'Praefatio',
  [Hora.MISSA_POST_COMMUNIONEM]: 'Post Communionem'
};

// =============================================================================
// FRAGMENT NAME GENERATORS
// =============================================================================

/**
 * Fragment naming result with all possible identifiers
 */
export interface FragmentNames {
  /** Primary fragment ID (most specific) */
  primary: string;
  /** Fallback fragment ID (less specific) */
  fallback?: string;
  /** Common/ferial fragment ID */
  common?: string;
  /** Season-based fragment ID */
  seasonal?: string;
  /** Full path for BMD lookup */
  bmdPath: string;
  /** ePrex compatible code */
  eprexCode: string;
  /** Lectionary cycle info */
  lectionary: {
    sunday: CyclusDominicalis;
    weekday: CyclusFerialis;
  };
}

/**
 * Get season code in lowercase for fragment paths
 */
function getSeasonPath(t: Tempus): string {
  // Use standard codes from TempusCodes
  return TempusCodes[t] || 'ORD';
}

/**
 * Get day code for fragment paths (using DiesCodes)
 */
function getDayPath(day: number): string {
  // Use standard codes from DiesCodes
  return DiesCodes[day as Dies] || '1DOM';
}

/**
 * Generate fragment names for a specific date and hour
 */
export function getFragmentNames(date: Date, hora: Hora): FragmentNames {
  const currentTempus = tempus(date);
  const week = hebdomadaTemporis(date);
  const dayOfWeek = diesHebdomadae(date);
  const sunday = estDominica(date);

  const seasonPath = getSeasonPath(currentTempus);
  const weekStr = week.toString().padStart(2, '0');
  const dayPath = getDayPath(dayOfWeek);

  // Check for special celebrations
  const temporale = findTemporale(date);
  const sanctorale = findSanctoraleCelebration(date);

  // Get seasonal precedence (for privileged Sundays, feriae, etc.)
  const seasonalPraecedentia = getSeasonalPraecedentia(date);

  let primary: string;
  let fallback: string | undefined;
  let common: string | undefined;
  let seasonal: string | undefined;

  // Seasonal fragment path (always available as fallback)
  const seasonalPath = `${seasonPath}/${weekStr}/${dayPath}/${hora}`;

  // Check for feast transfer (e.g., Annunciation during Holy Week)
  let sanctoraleTransferred = false;
  if (sanctorale) {
    const transferDate = getTransferDate(sanctorale, date);
    if (transferDate) {
      // This sanctorale celebration is transferred - don't use it today
      sanctoraleTransferred = true;
    }
  }

  // Determine primary fragment based on liturgical precedence
  // Priority: Temporale celebrations > Seasonal precedence > Sanctorale
  if (temporale) {
    // Temporale celebration found - use it (already has correct precedence)
    const code = temporale.shortCode || temporale.code;
    primary = `${code}/${hora}`;
    fallback = seasonalPath;
    seasonal = `commune/${seasonPath}/${hora}`;
  } else if (sanctorale && !sanctoraleTransferred) {
    // Compare sanctorale precedence with seasonal precedence
    const sanctoralePraecedentia = sanctorale.praecedentia;

    if (hasPrecedence(sanctoralePraecedentia, seasonalPraecedentia)) {
      // Sanctorale wins - use its proper texts
      const code = sanctorale.shortCode || sanctorale.code;
      primary = `${code}/${hora}`;
      fallback = `sancti/${sanctorale.month?.toString().padStart(2, '0')}/${sanctorale.day?.toString().padStart(2, '0')}/${hora}`;
      common = `commune/${getCommonType(sanctorale)}/${hora}`;
      seasonal = seasonalPath;
    } else {
      // Seasonal wins (privileged Sunday/feria takes precedence)
      primary = seasonalPath;
      if (sunday) {
        seasonal = `${seasonPath}/${weekStr}/dom/${hora}`;
      }
      // Sanctorale may be commemorated (add to fallback)
      if (gradusAtLeast(sanctorale.gradus, Gradus.MEMORIA)) {
        common = `commune/${getCommonType(sanctorale)}/${hora}`;
        fallback = `${sanctorale.shortCode || sanctorale.code}/${hora}`;
      } else {
        common = `commune/feria/${hora}`;
      }
    }
  } else {
    // No special celebration - use seasonal texts
    primary = seasonalPath;
    if (sunday) {
      seasonal = `${seasonPath}/${weekStr}/dom/${hora}`;
    }
    common = `commune/feria/${hora}`;
  }

  // Build BMD path
  const cyclusDom = cyclusDominicalis(date);
  const cyclusFer = cyclusFerialis(date);
  // Build BMD path with consistent codes
  const cyclus = sunday ? cyclusDom : cyclusFer;
  const bmdPath = `${seasonPath}/${weekStr}/${dayPath}/${cyclus}/${hora}`;

  // Build ePrex code
  const tempusCode = TempusCodes[currentTempus];
  const daysCode = DiesCodes[dayOfWeek as Dies];
  const eprexCode = `${tempusCode}${weekStr}${daysCode}-${hora}`;

  return {
    primary,
    fallback,
    common,
    seasonal,
    bmdPath,
    eprexCode,
    lectionary: {
      sunday: cyclusDom,
      weekday: cyclusFer
    }
  };
}

/**
 * Determine common type for sanctorale entries
 */
function getCommonType(dies: DiesSpecialis): string {
  const id = dies.id.toLowerCase();

  // Marian feasts
  if (id.includes('mary') || id.includes('bmv') || id.includes('mariae') ||
      id.includes('assumption') || id.includes('immaculate')) {
    return 'bmv';
  }

  // Apostles
  if (id.includes('apostle') || id.includes('apostol')) {
    return 'apostoli';
  }

  // Martyrs
  if (id.includes('martyr')) {
    return 'martyres';
  }

  // Pastors/Bishops
  if (id.includes('bishop') || id.includes('pope') || id.includes('papa') ||
      id.includes('episcop') || id.includes('doctor')) {
    return 'pastores';
  }

  // Virgins
  if (id.includes('virgin')) {
    return 'virgines';
  }

  // Religious
  if (id.includes('religious') || id.includes('abbot') || id.includes('abbat')) {
    return 'religiosi';
  }

  // Default to saints
  return 'sancti';
}

/**
 * Generate all fragment names for a complete day (all hours)
 */
export function getDayFragments(date: Date): Record<Hora, FragmentNames> {
  const result = {} as Record<Hora, FragmentNames>;

  for (const hora of Object.values(Hora)) {
    result[hora] = getFragmentNames(date, hora);
  }

  return result;
}

/**
 * Generate fragment names for Mass readings
 */
export function getMassFragments(date: Date): {
  introitus: FragmentNames;
  collecta: FragmentNames;
  lectioI: FragmentNames;
  psalmus: FragmentNames;
  lectioII?: FragmentNames;
  evangelium: FragmentNames;
  superOblata: FragmentNames;
  praefatio: FragmentNames;
  postCommunionem: FragmentNames;
} {
  const sunday = estDominica(date);

  return {
    introitus: getFragmentNames(date, Hora.MISSA_INTROITUS),
    collecta: getFragmentNames(date, Hora.MISSA_COLLECTA),
    lectioI: getFragmentNames(date, Hora.MISSA_LECTIO_I),
    psalmus: getFragmentNames(date, Hora.MISSA_PSALMUS),
    lectioII: sunday ? getFragmentNames(date, Hora.MISSA_LECTIO_II) : undefined,
    evangelium: getFragmentNames(date, Hora.MISSA_EVANGELIUM),
    superOblata: getFragmentNames(date, Hora.MISSA_SUPER_OBLATA),
    praefatio: getFragmentNames(date, Hora.MISSA_PRAEFATIO),
    postCommunionem: getFragmentNames(date, Hora.MISSA_POST_COMMUNIONEM)
  };
}

/**
 * Generate fragment names for Liturgy of the Hours
 */
export function getOfficiumFragments(date: Date): {
  invitatorium: FragmentNames;
  officiumLectionis: FragmentNames;
  laudes: FragmentNames;
  tertia: FragmentNames;
  sexta: FragmentNames;
  nona: FragmentNames;
  vesperae: FragmentNames;
  completorium: FragmentNames;
} {
  return {
    invitatorium: getFragmentNames(date, Hora.INVITATORIUM),
    officiumLectionis: getFragmentNames(date, Hora.OFFICIUM_LECTIONIS),
    laudes: getFragmentNames(date, Hora.LAUDES),
    tertia: getFragmentNames(date, Hora.TERTIA),
    sexta: getFragmentNames(date, Hora.SEXTA),
    nona: getFragmentNames(date, Hora.NONA),
    vesperae: getFragmentNames(date, Hora.VESPERAE),
    completorium: getFragmentNames(date, Hora.COMPLETORIUM)
  };
}

// =============================================================================
// EXAMPLE GENERATOR
// =============================================================================

/**
 * Generate example fragment names for demonstration
 */
export function generateExamples(): Array<{
  date: string;
  description: string;
  fragments: {
    laudes: string;
    collecta: string;
    evangelium: string;
  };
}> {
  const examples = [
    { date: new Date(2025, 0, 1), desc: 'Sanctae Mariae Matris Dei' },
    { date: new Date(2025, 0, 6), desc: 'In Epiphania Domini' },
    { date: new Date(2025, 2, 5), desc: 'Feria IV Cinerum' },
    { date: new Date(2025, 3, 13), desc: 'Dominica in Palmis' },
    { date: new Date(2025, 3, 17), desc: 'Feria V in Cena Domini' },
    { date: new Date(2025, 3, 18), desc: 'Feria VI in Passione Domini' },
    { date: new Date(2025, 3, 20), desc: 'Dominica Paschae' },
    { date: new Date(2025, 5, 8), desc: 'Dominica Pentecostes' },
    { date: new Date(2025, 5, 29), desc: 'Ss. Petri et Pauli' },
    { date: new Date(2025, 7, 15), desc: 'In Assumptione B.M.V.' },
    { date: new Date(2025, 10, 1), desc: 'Omnium Sanctorum' },
    { date: new Date(2025, 11, 25), desc: 'In Nativitate Domini' }
  ];

  return examples.map(({ date, desc }) => ({
    date: date.toISOString().split('T')[0],
    description: desc,
    fragments: {
      laudes: getFragmentNames(date, Hora.LAUDES).primary,
      collecta: getFragmentNames(date, Hora.MISSA_COLLECTA).primary,
      evangelium: getFragmentNames(date, Hora.MISSA_EVANGELIUM).primary
    }
  }));
}
