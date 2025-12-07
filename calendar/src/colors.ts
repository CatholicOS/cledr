/**
 * Liturgical Colors
 *
 * Based on GIRM (General Instruction of the Roman Missal)
 * Aligned with liturgical-calendar-api LitColor.php
 */

/**
 * Liturgical color enum with Latin names
 */
export enum LitColor {
  /** Green - Ordinary Time */
  VIRIDIS = 'green',
  /** Purple/Violet - Advent, Lent, Penance */
  PURPURA = 'purple',
  /** White - Christmas, Easter, Feasts of the Lord, BVM, Angels, Saints (non-martyrs) */
  ALBUS = 'white',
  /** Red - Palm Sunday, Good Friday, Pentecost, Martyrs, Apostles */
  RUBER = 'red',
  /** Rose - Gaudete Sunday (Advent III), Laetare Sunday (Lent IV) */
  ROSEA = 'rose',
}

/**
 * Liturgical color translations
 */
export const LitColorI18n: Record<LitColor, { la: string; en: string; it: string }> = {
  [LitColor.VIRIDIS]: { la: 'viridis', en: 'green', it: 'verde' },
  [LitColor.PURPURA]: { la: 'purpura', en: 'purple', it: 'viola' },
  [LitColor.ALBUS]: { la: 'albus', en: 'white', it: 'bianco' },
  [LitColor.RUBER]: { la: 'ruber', en: 'red', it: 'rosso' },
  [LitColor.ROSEA]: { la: 'rosea', en: 'rose', it: 'rosaceo' },
};

/**
 * Get color for a liturgical season
 */
export function getSeasonColor(season: string): LitColor {
  switch (season) {
    case 'ADVENT':
    case 'ADVENTUS':
    case 'LENT':
    case 'QUADRAGESIMA':
      return LitColor.PURPURA;
    case 'CHRISTMAS':
    case 'NATIVITAS':
    case 'EASTER':
    case 'PASCHALE':
      return LitColor.ALBUS;
    case 'ORDINARY':
    case 'ORDINARIUM':
    default:
      return LitColor.VIRIDIS;
  }
}

/**
 * Get color name in specified locale
 */
export function getColorName(color: LitColor, locale: 'la' | 'en' | 'it' = 'la'): string {
  return LitColorI18n[color][locale];
}
