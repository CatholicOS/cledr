/**
 * CLEDR Liturgical Calendar - Type Definitions
 * Latin-based enumerations per IGMR and Universal Norms
 */

// =============================================================================
// LITURGICAL SEASONS (Tempora Liturgica)
// =============================================================================

/**
 * Tempora Liturgica - Liturgical Seasons
 */
export enum Tempus {
  /** Tempus per Annum */
  ORDINARIUM = 'ORDINARIUM',
  /** Adventus Domini */
  ADVENTUS = 'ADVENTUS',
  /** Tempus Nativitatis */
  NATIVITAS = 'NATIVITAS',
  /** Quadragesima */
  QUADRAGESIMA = 'QUADRAGESIMA',
  /** Sacrum Triduum Paschale */
  TRIDUUM = 'TRIDUUM',
  /** Tempus Paschale */
  PASCHALE = 'PASCHALE'
}

/**
 * Short codes for seasons (ePrex compatibility)
 */
export const TempusCodes: Record<Tempus, string> = {
  [Tempus.ORDINARIUM]: 'ORD',
  [Tempus.ADVENTUS]: 'ADV',
  [Tempus.NATIVITAS]: 'NAT',
  [Tempus.QUADRAGESIMA]: 'QUA',
  [Tempus.TRIDUUM]: 'TRI',
  [Tempus.PASCHALE]: 'PAS'
};

// =============================================================================
// LITURGICAL RANKS (Gradus Celebrationis)
// =============================================================================

/**
 * Liturgical ranks per IGMR - from highest to lowest
 */
export enum Gradus {
  /** Solennità - highest rank */
  SOLLEMNITAS = 'SOLLEMNITAS',
  /** Festa */
  FESTUM = 'FESTUM',
  /** Memoria obbligatoria */
  MEMORIA = 'MEMORIA',
  /** Memoria facoltativa */
  MEMORIA_AD_LIBITUM = 'MEMORIA_AD_LIBITUM',
  /** Commemorazione */
  COMMEMORATIO = 'COMMEMORATIO',
  /** Feria (weekday) */
  FERIA = 'FERIA'
}

/**
 * Numeric priority for rank comparison (lower = higher priority)
 */
export const GradusPriority: Record<Gradus, number> = {
  [Gradus.SOLLEMNITAS]: 100,
  [Gradus.FESTUM]: 200,
  [Gradus.MEMORIA]: 300,
  [Gradus.MEMORIA_AD_LIBITUM]: 400,
  [Gradus.COMMEMORATIO]: 500,
  [Gradus.FERIA]: 600
};

// =============================================================================
// PRECEDENCE SYSTEM (14 Levels per UNLY)
// =============================================================================

/**
 * 14-level precedence system based on Universal Norms for the Liturgical Year
 * Lower number = higher precedence
 */
export enum Praecedentia {
  // Level 1: Triduum Paschale
  TRIDUUM_1 = 'TRIDUUM_1',

  // Level 2: Privileged celebrations
  SOLLEMNITAS_DOMINI_IN_CALENDARIO_2 = 'SOLLEMNITAS_DOMINI_IN_CALENDARIO_2',
  DOMINICA_PRIVILEGIATA_2 = 'DOMINICA_PRIVILEGIATA_2',  // Advent, Lent, Easter Sundays
  FERIA_IV_CINERUM_2 = 'FERIA_IV_CINERUM_2',            // Ash Wednesday
  FERIA_HEBDOMADAE_SANCTAE_2 = 'FERIA_HEBDOMADAE_SANCTAE_2',
  DIES_OCTAVAE_PASCHAE_2 = 'DIES_OCTAVAE_PASCHAE_2',

  // Level 3: General solemnities
  SOLLEMNITAS_GENERALIS_3 = 'SOLLEMNITAS_GENERALIS_3',

  // Level 4: Proper solemnities
  SOLLEMNITAS_PROPRIA_PATRONI_4A = 'SOLLEMNITAS_PROPRIA_PATRONI_4A',
  SOLLEMNITAS_DEDICATIONIS_4B = 'SOLLEMNITAS_DEDICATIONIS_4B',
  SOLLEMNITAS_TITULI_4C = 'SOLLEMNITAS_TITULI_4C',

  // Level 5: Feasts of the Lord in General Calendar
  FESTUM_DOMINI_5 = 'FESTUM_DOMINI_5',

  // Level 6: Sundays of Christmas and Ordinary Time
  DOMINICA_NATIVITATIS_6 = 'DOMINICA_NATIVITATIS_6',
  DOMINICA_ORDINARII_6 = 'DOMINICA_ORDINARII_6',

  // Level 7: Feasts of BVM and Saints
  FESTUM_BMV_7 = 'FESTUM_BMV_7',
  FESTUM_SANCTORUM_7 = 'FESTUM_SANCTORUM_7',

  // Level 8: Proper feasts
  FESTUM_PROPRIUM_8 = 'FESTUM_PROPRIUM_8',

  // Level 9: Advent weekdays Dec 17-24
  FERIA_ADVENTUS_17_24_9 = 'FERIA_ADVENTUS_17_24_9',
  DIES_OCTAVAE_NATIVITATIS_9 = 'DIES_OCTAVAE_NATIVITATIS_9',
  FERIA_QUADRAGESIMAE_9 = 'FERIA_QUADRAGESIMAE_9',

  // Level 10: Obligatory memorials
  MEMORIA_OBLIGATORIA_10 = 'MEMORIA_OBLIGATORIA_10',

  // Level 11: Proper obligatory memorials
  MEMORIA_OBLIGATORIA_PROPRIA_11 = 'MEMORIA_OBLIGATORIA_PROPRIA_11',

  // Level 12: Optional memorials
  MEMORIA_AD_LIBITUM_12 = 'MEMORIA_AD_LIBITUM_12',

  // Level 13: Advent, Christmas, Lent weekdays
  FERIA_ADVENTUS_13 = 'FERIA_ADVENTUS_13',
  FERIA_NATIVITATIS_13 = 'FERIA_NATIVITATIS_13',
  FERIA_PASCHAE_13 = 'FERIA_PASCHAE_13',

  // Level 14: Ordinary Time weekdays
  FERIA_ORDINARII_14 = 'FERIA_ORDINARII_14'
}

/**
 * Numeric values for precedence comparison
 */
export const PraecedentiaValue: Record<Praecedentia, number> = {
  [Praecedentia.TRIDUUM_1]: 100,
  [Praecedentia.SOLLEMNITAS_DOMINI_IN_CALENDARIO_2]: 200,
  [Praecedentia.DOMINICA_PRIVILEGIATA_2]: 201,
  [Praecedentia.FERIA_IV_CINERUM_2]: 202,
  [Praecedentia.FERIA_HEBDOMADAE_SANCTAE_2]: 203,
  [Praecedentia.DIES_OCTAVAE_PASCHAE_2]: 204,
  [Praecedentia.SOLLEMNITAS_GENERALIS_3]: 300,
  [Praecedentia.SOLLEMNITAS_PROPRIA_PATRONI_4A]: 400,
  [Praecedentia.SOLLEMNITAS_DEDICATIONIS_4B]: 401,
  [Praecedentia.SOLLEMNITAS_TITULI_4C]: 402,
  [Praecedentia.FESTUM_DOMINI_5]: 500,
  [Praecedentia.DOMINICA_NATIVITATIS_6]: 600,
  [Praecedentia.DOMINICA_ORDINARII_6]: 601,
  [Praecedentia.FESTUM_BMV_7]: 700,
  [Praecedentia.FESTUM_SANCTORUM_7]: 701,
  [Praecedentia.FESTUM_PROPRIUM_8]: 800,
  [Praecedentia.FERIA_ADVENTUS_17_24_9]: 900,
  [Praecedentia.DIES_OCTAVAE_NATIVITATIS_9]: 901,
  [Praecedentia.FERIA_QUADRAGESIMAE_9]: 902,
  [Praecedentia.MEMORIA_OBLIGATORIA_10]: 1000,
  [Praecedentia.MEMORIA_OBLIGATORIA_PROPRIA_11]: 1100,
  [Praecedentia.MEMORIA_AD_LIBITUM_12]: 1200,
  [Praecedentia.FERIA_ADVENTUS_13]: 1300,
  [Praecedentia.FERIA_NATIVITATIS_13]: 1301,
  [Praecedentia.FERIA_PASCHAE_13]: 1302,
  [Praecedentia.FERIA_ORDINARII_14]: 1400
};

// =============================================================================
// LITURGICAL COLORS (Colores Liturgici)
// =============================================================================

/**
 * Liturgical colors - Latin terminology
 */
export enum Color {
  /** White - purity, joy, glory */
  ALBUS = 'ALBUS',
  /** Red - martyrdom, Holy Spirit */
  RUBER = 'RUBER',
  /** Green - hope, ordinary time */
  VIRIDIS = 'VIRIDIS',
  /** Violet/Purple - penance, preparation */
  VIOLACEUS = 'VIOLACEUS',
  /** Rose - joy in penance (Gaudete, Laetare) */
  ROSACEUS = 'ROSACEUS',
  /** Black - mourning (optional) */
  NIGER = 'NIGER',
  /** Gold - can replace white, red, green */
  AUREUS = 'AUREUS'
}

// =============================================================================
// EVENT TYPES
// =============================================================================

/**
 * Event type classification
 */
export enum Genus {
  /** Moveable feast (Easter-dependent) */
  TEMPORALE = 'TEMPORALE',
  /** Fixed feast (calendar date) */
  SANCTORALE = 'SANCTORALE',
  /** Regional celebration */
  LOCALE = 'LOCALE'
}

/**
 * Source/authority of the celebration
 */
export enum Fons {
  /** Calendarium Romanum Generale - Universal Church */
  CRG = 'CRG',
  /** Martyrologium Romanum - in Martyrology but not CRG */
  MR = 'MR',
  /** Local celebration - diocesan/national */
  LOCALE = 'LOCALE'
}

// =============================================================================
// DAY OF WEEK (Dies Hebdomadae)
// =============================================================================

/**
 * Days of the week - Latin terminology
 */
export enum Dies {
  DOMINICA = 0,    // Sunday
  FERIA_II = 1,    // Monday
  FERIA_III = 2,   // Tuesday
  FERIA_IV = 3,    // Wednesday
  FERIA_V = 4,     // Thursday
  FERIA_VI = 5,    // Friday
  SABBATUM = 6     // Saturday
}

/**
 * Short codes for days - Latin planetary notation
 * Format: {ordinal}{3-letter Latin abbreviation}
 */
export const DiesCodes: Record<Dies, string> = {
  [Dies.DOMINICA]: '1DOM',   // Dominica (dies Solis)
  [Dies.FERIA_II]: '2LUN',   // Lunae dies
  [Dies.FERIA_III]: '3MAR',  // Martis dies
  [Dies.FERIA_IV]: '4MER',   // Mercurii dies
  [Dies.FERIA_V]: '5IOV',    // Iovis dies
  [Dies.FERIA_VI]: '6VEN',   // Veneris dies
  [Dies.SABBATUM]: '7SAB'    // Sabbatum
};

/**
 * Full Latin names for days
 */
export const DiesNomina: Record<Dies, string> = {
  [Dies.DOMINICA]: 'Dominica',
  [Dies.FERIA_II]: 'Feria secunda',
  [Dies.FERIA_III]: 'Feria tertia',
  [Dies.FERIA_IV]: 'Feria quarta',
  [Dies.FERIA_V]: 'Feria quinta',
  [Dies.FERIA_VI]: 'Feria sexta',
  [Dies.SABBATUM]: 'Sabbatum'
};

// =============================================================================
// LITURGICAL CYCLES (Cycli Liturgici)
// =============================================================================

/**
 * Sunday lectionary cycle (3-year)
 */
export enum CyclusDominicalis {
  A = 'A',  // Matthew
  B = 'B',  // Mark
  C = 'C'   // Luke
}

/**
 * Weekday lectionary cycle (2-year / biennial)
 */
export enum CyclusFerialis {
  I = 'I',   // Odd years
  II = 'II'  // Even years
}

/**
 * Psalter week (4-week cycle)
 */
export type HebdomadaPsalterii = 1 | 2 | 3 | 4;

// =============================================================================
// LITURGICAL DAY INTERFACE
// =============================================================================

/**
 * Complete liturgical day information
 */
export interface DiesLiturgicus {
  /** Calendar date */
  date: Date;

  /** Liturgical season */
  tempus: Tempus;

  /** Week number within season (1-34) */
  hebdomada: number;

  /** Psalter week (1-4) */
  hebdomadaPsalterii: HebdomadaPsalterii;

  /** Day of week */
  dies: Dies;

  /** Sunday cycle (A/B/C) */
  cyclusDominicalis: CyclusDominicalis;

  /** Weekday cycle (I/II) */
  cyclusFerialis: CyclusFerialis;

  /** Liturgical rank */
  gradus: Gradus;

  /** Precedence level */
  praecedentia: Praecedentia;

  /** Liturgical colors (primary + optional alternatives) */
  colores: Color[];

  /** Event type */
  genus: Genus;

  /** Celebration ID (CLEDR canonical) */
  id: string;

  /** Short code for content lookup */
  shortCode: string;

  /** ePrex TitleCode for BMD lookup */
  titleCode: string;

  /** Names in multiple languages */
  nomina: {
    la: string;   // Latin (authoritative)
    it?: string;  // Italian
    en?: string;  // English
    es?: string;  // Spanish
    fr?: string;  // French
  };

  /** Optional: commemorated saints/events */
  commemoratio?: DiesLiturgicus[];

  /** Optional: alternative celebrations (memorials ad libitum) */
  alternativae?: DiesLiturgicus[];
}

// =============================================================================
// SPECIAL DAY DEFINITION
// =============================================================================

/**
 * Definition for special liturgical days (from ePrex SpecialDay)
 */
export interface DiesSpecialis {
  /** Unique code (0001-9999) */
  code: string;

  /** CLEDR canonical ID */
  id: string;

  /** Short code (PAS0, TRI1, etc.) */
  shortCode: string;

  /** Event type */
  genus: Genus;

  /** Liturgical rank */
  gradus: Gradus;

  /** Precedence */
  praecedentia: Praecedentia;

  /** Priority for sorting (lower = higher) */
  priority: number;

  /** Liturgical colors */
  colores: Color[];

  /** Names */
  nomina: {
    la: string;
    it?: string;
    en?: string;
  };

  /**
   * Match function: determines if this special day applies to a given date
   * For fixed feasts: checks month/day
   * For moveable feasts: calculates from Easter
   */
  match: (date: Date, easter: Date) => boolean;

  /** Optional: fixed month (1-12) for SANCTORALE */
  month?: number;

  /** Optional: fixed day (1-31) for SANCTORALE */
  day?: number;

  /** Optional: days from Easter for TEMPORALE */
  daysFromEaster?: number;

  /** External IDs for cross-reference */
  externalIds?: {
    romcal?: string;
    litcalApi?: string;
    eprex?: string;
  };
}
