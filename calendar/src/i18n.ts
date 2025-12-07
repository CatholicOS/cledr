/**
 * CLEDR Liturgical Calendar - Internationalization
 *
 * Multi-language support for liturgical terms
 * Primary source: Latin (authoritative)
 * Translations: Italian, English, Spanish, French, German, Portuguese, Polish
 */

import { Tempus, Gradus, Color, Dies } from './types';
import { LitColor } from './colors';
import { LitCommon } from './commons';

// =============================================================================
// SUPPORTED LOCALES
// =============================================================================

export type Locale = 'la' | 'it' | 'en' | 'es' | 'fr' | 'de' | 'pt' | 'pl';

export const SUPPORTED_LOCALES: Locale[] = ['la', 'it', 'en', 'es', 'fr', 'de', 'pt', 'pl'];

export const LOCALE_NAMES: Record<Locale, string> = {
  la: 'Latina',
  it: 'Italiano',
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  pt: 'Português',
  pl: 'Polski'
};

// =============================================================================
// LITURGICAL SEASONS
// =============================================================================

export const TempusI18n: Record<Tempus, Record<Locale, string>> = {
  [Tempus.ORDINARIUM]: {
    la: 'Tempus per Annum',
    it: 'Tempo Ordinario',
    en: 'Ordinary Time',
    es: 'Tiempo Ordinario',
    fr: 'Temps Ordinaire',
    de: 'Zeit im Jahreskreis',
    pt: 'Tempo Comum',
    pl: 'Okres zwykły'
  },
  [Tempus.ADVENTUS]: {
    la: 'Adventus',
    it: 'Avvento',
    en: 'Advent',
    es: 'Adviento',
    fr: 'Avent',
    de: 'Advent',
    pt: 'Advento',
    pl: 'Adwent'
  },
  [Tempus.NATIVITAS]: {
    la: 'Tempus Nativitatis',
    it: 'Tempo di Natale',
    en: 'Christmas Time',
    es: 'Tiempo de Navidad',
    fr: 'Temps de Noël',
    de: 'Weihnachtszeit',
    pt: 'Tempo do Natal',
    pl: 'Okres Narodzenia Pańskiego'
  },
  [Tempus.QUADRAGESIMA]: {
    la: 'Quadragesima',
    it: 'Quaresima',
    en: 'Lent',
    es: 'Cuaresma',
    fr: 'Carême',
    de: 'Fastenzeit',
    pt: 'Quaresma',
    pl: 'Wielki Post'
  },
  [Tempus.TRIDUUM]: {
    la: 'Sacrum Triduum Paschale',
    it: 'Triduo Pasquale',
    en: 'Easter Triduum',
    es: 'Triduo Pascual',
    fr: 'Triduum Pascal',
    de: 'Österliches Triduum',
    pt: 'Tríduo Pascal',
    pl: 'Triduum Paschalne'
  },
  [Tempus.PASCHALE]: {
    la: 'Tempus Paschale',
    it: 'Tempo di Pasqua',
    en: 'Easter Time',
    es: 'Tiempo Pascual',
    fr: 'Temps Pascal',
    de: 'Osterzeit',
    pt: 'Tempo Pascal',
    pl: 'Okres Wielkanocny'
  }
};

// =============================================================================
// LITURGICAL RANKS
// =============================================================================

export const GradusI18n: Record<Gradus, Record<Locale, string>> = {
  [Gradus.SOLLEMNITAS]: {
    la: 'Sollemnitas',
    it: 'Solennità',
    en: 'Solemnity',
    es: 'Solemnidad',
    fr: 'Solennité',
    de: 'Hochfest',
    pt: 'Solenidade',
    pl: 'Uroczystość'
  },
  [Gradus.FESTUM]: {
    la: 'Festum',
    it: 'Festa',
    en: 'Feast',
    es: 'Fiesta',
    fr: 'Fête',
    de: 'Fest',
    pt: 'Festa',
    pl: 'Święto'
  },
  [Gradus.MEMORIA]: {
    la: 'Memoria',
    it: 'Memoria',
    en: 'Memorial',
    es: 'Memoria',
    fr: 'Mémoire',
    de: 'Gedenktag',
    pt: 'Memória',
    pl: 'Wspomnienie obowiązkowe'
  },
  [Gradus.MEMORIA_AD_LIBITUM]: {
    la: 'Memoria ad libitum',
    it: 'Memoria facoltativa',
    en: 'Optional Memorial',
    es: 'Memoria libre',
    fr: 'Mémoire facultative',
    de: 'Nichtgebotener Gedenktag',
    pt: 'Memória facultativa',
    pl: 'Wspomnienie dowolne'
  },
  [Gradus.COMMEMORATIO]: {
    la: 'Commemoratio',
    it: 'Commemorazione',
    en: 'Commemoration',
    es: 'Conmemoración',
    fr: 'Commémoraison',
    de: 'Gedenken',
    pt: 'Comemoração',
    pl: 'Wspomnienie'
  },
  [Gradus.FERIA]: {
    la: 'Feria',
    it: 'Feria',
    en: 'Weekday',
    es: 'Feria',
    fr: 'Férie',
    de: 'Wochentag',
    pt: 'Féria',
    pl: 'Dzień powszedni'
  }
};

// =============================================================================
// LITURGICAL COLORS
// =============================================================================

export const ColorI18n: Record<Color, Record<Locale, string>> = {
  [Color.ALBUS]: {
    la: 'albus',
    it: 'bianco',
    en: 'white',
    es: 'blanco',
    fr: 'blanc',
    de: 'weiß',
    pt: 'branco',
    pl: 'biały'
  },
  [Color.RUBER]: {
    la: 'ruber',
    it: 'rosso',
    en: 'red',
    es: 'rojo',
    fr: 'rouge',
    de: 'rot',
    pt: 'vermelho',
    pl: 'czerwony'
  },
  [Color.VIRIDIS]: {
    la: 'viridis',
    it: 'verde',
    en: 'green',
    es: 'verde',
    fr: 'vert',
    de: 'grün',
    pt: 'verde',
    pl: 'zielony'
  },
  [Color.VIOLACEUS]: {
    la: 'violaceus',
    it: 'viola',
    en: 'purple',
    es: 'morado',
    fr: 'violet',
    de: 'violett',
    pt: 'roxo',
    pl: 'fioletowy'
  },
  [Color.ROSACEUS]: {
    la: 'rosaceus',
    it: 'rosaceo',
    en: 'rose',
    es: 'rosa',
    fr: 'rose',
    de: 'rosa',
    pt: 'rosa',
    pl: 'różowy'
  },
  [Color.NIGER]: {
    la: 'niger',
    it: 'nero',
    en: 'black',
    es: 'negro',
    fr: 'noir',
    de: 'schwarz',
    pt: 'preto',
    pl: 'czarny'
  },
  [Color.AUREUS]: {
    la: 'aureus',
    it: 'oro',
    en: 'gold',
    es: 'dorado',
    fr: 'or',
    de: 'gold',
    pt: 'dourado',
    pl: 'złoty'
  }
};

// =============================================================================
// DAYS OF THE WEEK
// =============================================================================

export const DiesI18n: Record<Dies, Record<Locale, string>> = {
  [Dies.DOMINICA]: {
    la: 'Dominica',
    it: 'Domenica',
    en: 'Sunday',
    es: 'Domingo',
    fr: 'Dimanche',
    de: 'Sonntag',
    pt: 'Domingo',
    pl: 'Niedziela'
  },
  [Dies.FERIA_II]: {
    la: 'Feria secunda',
    it: 'Lunedì',
    en: 'Monday',
    es: 'Lunes',
    fr: 'Lundi',
    de: 'Montag',
    pt: 'Segunda-feira',
    pl: 'Poniedziałek'
  },
  [Dies.FERIA_III]: {
    la: 'Feria tertia',
    it: 'Martedì',
    en: 'Tuesday',
    es: 'Martes',
    fr: 'Mardi',
    de: 'Dienstag',
    pt: 'Terça-feira',
    pl: 'Wtorek'
  },
  [Dies.FERIA_IV]: {
    la: 'Feria quarta',
    it: 'Mercoledì',
    en: 'Wednesday',
    es: 'Miércoles',
    fr: 'Mercredi',
    de: 'Mittwoch',
    pt: 'Quarta-feira',
    pl: 'Środa'
  },
  [Dies.FERIA_V]: {
    la: 'Feria quinta',
    it: 'Giovedì',
    en: 'Thursday',
    es: 'Jueves',
    fr: 'Jeudi',
    de: 'Donnerstag',
    pt: 'Quinta-feira',
    pl: 'Czwartek'
  },
  [Dies.FERIA_VI]: {
    la: 'Feria sexta',
    it: 'Venerdì',
    en: 'Friday',
    es: 'Viernes',
    fr: 'Vendredi',
    de: 'Freitag',
    pt: 'Sexta-feira',
    pl: 'Piątek'
  },
  [Dies.SABBATUM]: {
    la: 'Sabbatum',
    it: 'Sabato',
    en: 'Saturday',
    es: 'Sábado',
    fr: 'Samedi',
    de: 'Samstag',
    pt: 'Sábado',
    pl: 'Sobota'
  }
};

// =============================================================================
// COMMON LITURGICAL TERMS
// =============================================================================

export const TermsI18n: Record<string, Record<Locale, string>> = {
  // Mass parts
  introitus: {
    la: 'Introitus',
    it: 'Introito',
    en: 'Entrance Antiphon',
    es: 'Antífona de entrada',
    fr: 'Antienne d\'entrée',
    de: 'Eröffnungsvers',
    pt: 'Antífona de entrada',
    pl: 'Antyfona na wejście'
  },
  collecta: {
    la: 'Collecta',
    it: 'Colletta',
    en: 'Collect',
    es: 'Oración colecta',
    fr: 'Prière d\'ouverture',
    de: 'Tagesgebet',
    pt: 'Oração do dia',
    pl: 'Kolekta'
  },
  lectio_prima: {
    la: 'Lectio prima',
    it: 'Prima lettura',
    en: 'First Reading',
    es: 'Primera lectura',
    fr: 'Première lecture',
    de: 'Erste Lesung',
    pt: 'Primeira leitura',
    pl: 'Pierwsze czytanie'
  },
  psalmus: {
    la: 'Psalmus responsorius',
    it: 'Salmo responsoriale',
    en: 'Responsorial Psalm',
    es: 'Salmo responsorial',
    fr: 'Psaume responsorial',
    de: 'Antwortpsalm',
    pt: 'Salmo responsorial',
    pl: 'Psalm responsoryjny'
  },
  lectio_secunda: {
    la: 'Lectio secunda',
    it: 'Seconda lettura',
    en: 'Second Reading',
    es: 'Segunda lectura',
    fr: 'Deuxième lecture',
    de: 'Zweite Lesung',
    pt: 'Segunda leitura',
    pl: 'Drugie czytanie'
  },
  alleluia: {
    la: 'Alleluia',
    it: 'Canto al Vangelo',
    en: 'Gospel Acclamation',
    es: 'Aleluya',
    fr: 'Alléluia',
    de: 'Ruf vor dem Evangelium',
    pt: 'Aclamação ao Evangelho',
    pl: 'Aklamacja przed Ewangelią'
  },
  evangelium: {
    la: 'Evangelium',
    it: 'Vangelo',
    en: 'Gospel',
    es: 'Evangelio',
    fr: 'Évangile',
    de: 'Evangelium',
    pt: 'Evangelho',
    pl: 'Ewangelia'
  },
  offertorium: {
    la: 'Offertorium',
    it: 'Offertorio',
    en: 'Offertory',
    es: 'Ofertorio',
    fr: 'Offertoire',
    de: 'Gabenbereitung',
    pt: 'Ofertório',
    pl: 'Antyfona na przygotowanie darów'
  },
  super_oblata: {
    la: 'Super oblata',
    it: 'Sulle offerte',
    en: 'Prayer over the Offerings',
    es: 'Oración sobre las ofrendas',
    fr: 'Prière sur les offrandes',
    de: 'Gabengebet',
    pt: 'Oração sobre as oferendas',
    pl: 'Modlitwa nad darami'
  },
  praefatio: {
    la: 'Praefatio',
    it: 'Prefazio',
    en: 'Preface',
    es: 'Prefacio',
    fr: 'Préface',
    de: 'Präfation',
    pt: 'Prefácio',
    pl: 'Prefacja'
  },
  communio: {
    la: 'Communio',
    it: 'Antifona alla comunione',
    en: 'Communion Antiphon',
    es: 'Antífona de comunión',
    fr: 'Antienne de communion',
    de: 'Kommunionvers',
    pt: 'Antífona da comunhão',
    pl: 'Antyfona na Komunię'
  },
  post_communionem: {
    la: 'Post communionem',
    it: 'Dopo la comunione',
    en: 'Prayer after Communion',
    es: 'Oración después de la comunión',
    fr: 'Prière après la communion',
    de: 'Schlussgebet',
    pt: 'Oração depois da comunhão',
    pl: 'Modlitwa po Komunii'
  },

  // Liturgy of the Hours
  invitatorium: {
    la: 'Invitatorium',
    it: 'Invitatorio',
    en: 'Invitatory',
    es: 'Invitatorio',
    fr: 'Invitatoire',
    de: 'Invitatorium',
    pt: 'Invitatório',
    pl: 'Wezwanie'
  },
  hymnus: {
    la: 'Hymnus',
    it: 'Inno',
    en: 'Hymn',
    es: 'Himno',
    fr: 'Hymne',
    de: 'Hymnus',
    pt: 'Hino',
    pl: 'Hymn'
  },
  antiphona: {
    la: 'Antiphona',
    it: 'Antifona',
    en: 'Antiphon',
    es: 'Antífona',
    fr: 'Antienne',
    de: 'Antiphon',
    pt: 'Antífona',
    pl: 'Antyfona'
  },
  canticum: {
    la: 'Canticum',
    it: 'Cantico',
    en: 'Canticle',
    es: 'Cántico',
    fr: 'Cantique',
    de: 'Canticum',
    pt: 'Cântico',
    pl: 'Pieśń'
  },
  lectio_brevis: {
    la: 'Lectio brevis',
    it: 'Lettura breve',
    en: 'Short Reading',
    es: 'Lectura breve',
    fr: 'Lecture brève',
    de: 'Kurzlesung',
    pt: 'Leitura breve',
    pl: 'Czytanie krótkie'
  },
  responsorium: {
    la: 'Responsorium',
    it: 'Responsorio',
    en: 'Responsory',
    es: 'Responsorio',
    fr: 'Répons',
    de: 'Responsorium',
    pt: 'Responsório',
    pl: 'Responsorium'
  },
  benedictus: {
    la: 'Benedictus',
    it: 'Benedictus',
    en: 'Benedictus',
    es: 'Benedictus',
    fr: 'Benedictus',
    de: 'Benedictus',
    pt: 'Benedictus',
    pl: 'Benedictus'
  },
  magnificat: {
    la: 'Magnificat',
    it: 'Magnificat',
    en: 'Magnificat',
    es: 'Magnificat',
    fr: 'Magnificat',
    de: 'Magnificat',
    pt: 'Magnificat',
    pl: 'Magnificat'
  },
  nunc_dimittis: {
    la: 'Nunc dimittis',
    it: 'Nunc dimittis',
    en: 'Nunc Dimittis',
    es: 'Nunc dimittis',
    fr: 'Nunc dimittis',
    de: 'Nunc dimittis',
    pt: 'Nunc dimittis',
    pl: 'Nunc dimittis'
  },
  oratio: {
    la: 'Oratio',
    it: 'Orazione',
    en: 'Prayer',
    es: 'Oración',
    fr: 'Oraison',
    de: 'Oration',
    pt: 'Oração',
    pl: 'Modlitwa'
  },

  // Hours
  officium_lectionis: {
    la: 'Officium lectionis',
    it: 'Ufficio delle letture',
    en: 'Office of Readings',
    es: 'Oficio de lecturas',
    fr: 'Office des lectures',
    de: 'Lesehore',
    pt: 'Ofício das leituras',
    pl: 'Godzina czytań'
  },
  laudes: {
    la: 'Laudes matutinae',
    it: 'Lodi mattutine',
    en: 'Morning Prayer',
    es: 'Laudes',
    fr: 'Laudes',
    de: 'Laudes',
    pt: 'Laudes',
    pl: 'Jutrznia'
  },
  tertia: {
    la: 'Hora tertia',
    it: 'Terza',
    en: 'Midmorning Prayer',
    es: 'Tercia',
    fr: 'Tierce',
    de: 'Terz',
    pt: 'Hora Terça',
    pl: 'Modlitwa przedpołudniowa'
  },
  sexta: {
    la: 'Hora sexta',
    it: 'Sesta',
    en: 'Midday Prayer',
    es: 'Sexta',
    fr: 'Sexte',
    de: 'Sext',
    pt: 'Hora Sexta',
    pl: 'Modlitwa południowa'
  },
  nona: {
    la: 'Hora nona',
    it: 'Nona',
    en: 'Midafternoon Prayer',
    es: 'Nona',
    fr: 'None',
    de: 'Non',
    pt: 'Hora Nona',
    pl: 'Modlitwa popołudniowa'
  },
  vesperae: {
    la: 'Vesperae',
    it: 'Vespri',
    en: 'Evening Prayer',
    es: 'Vísperas',
    fr: 'Vêpres',
    de: 'Vesper',
    pt: 'Vésperas',
    pl: 'Nieszpory'
  },
  completorium: {
    la: 'Completorium',
    it: 'Compieta',
    en: 'Night Prayer',
    es: 'Completas',
    fr: 'Complies',
    de: 'Komplet',
    pt: 'Completas',
    pl: 'Kompleta'
  }
};

// =============================================================================
// ORDINAL NUMBERS
// =============================================================================

export const OrdinalesI18n: Record<number, Record<Locale, string>> = {
  1: { la: 'I', it: 'I', en: '1st', es: '1º', fr: '1er', de: '1.', pt: '1º', pl: '1.' },
  2: { la: 'II', it: 'II', en: '2nd', es: '2º', fr: '2e', de: '2.', pt: '2º', pl: '2.' },
  3: { la: 'III', it: 'III', en: '3rd', es: '3º', fr: '3e', de: '3.', pt: '3º', pl: '3.' },
  4: { la: 'IV', it: 'IV', en: '4th', es: '4º', fr: '4e', de: '4.', pt: '4º', pl: '4.' },
  5: { la: 'V', it: 'V', en: '5th', es: '5º', fr: '5e', de: '5.', pt: '5º', pl: '5.' },
  6: { la: 'VI', it: 'VI', en: '6th', es: '6º', fr: '6e', de: '6.', pt: '6º', pl: '6.' },
  7: { la: 'VII', it: 'VII', en: '7th', es: '7º', fr: '7e', de: '7.', pt: '7º', pl: '7.' },
  // ... continues for all needed ordinals
  34: { la: 'XXXIV', it: 'XXXIV', en: '34th', es: '34º', fr: '34e', de: '34.', pt: '34º', pl: '34.' }
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get localized season name
 */
export function getSeasonName(tempus: Tempus, locale: Locale = 'la'): string {
  return TempusI18n[tempus][locale];
}

/**
 * Get localized rank name
 */
export function getRankName(gradus: Gradus, locale: Locale = 'la'): string {
  return GradusI18n[gradus][locale];
}

/**
 * Get localized color name
 */
export function getLocalizedColorName(color: Color, locale: Locale = 'la'): string {
  return ColorI18n[color][locale];
}

/**
 * Get localized day name
 */
export function getDayName(dies: Dies, locale: Locale = 'la'): string {
  return DiesI18n[dies][locale];
}

/**
 * Get localized term
 */
export function getTerm(key: string, locale: Locale = 'la'): string {
  return TermsI18n[key]?.[locale] ?? key;
}

/**
 * Format week name (e.g., "II Domenica di Avvento")
 */
export function formatWeekName(
  tempus: Tempus,
  week: number,
  dies: Dies,
  locale: Locale = 'la'
): string {
  const ordinal = OrdinalesI18n[week]?.[locale] ?? week.toString();
  const dayName = DiesI18n[dies][locale];
  const seasonName = TempusI18n[tempus][locale];

  switch (locale) {
    case 'la':
      return `${dayName} ${ordinal} ${seasonName}`;
    case 'it':
      return `${dayName} ${ordinal} ${seasonName}`;
    case 'en':
      return `${ordinal} ${dayName} of ${seasonName}`;
    case 'es':
      return `${dayName} ${ordinal} de ${seasonName}`;
    case 'fr':
      return `${ordinal} ${dayName} de ${seasonName}`;
    case 'de':
      return `${ordinal} ${dayName} ${seasonName}`;
    case 'pt':
      return `${ordinal} ${dayName} do ${seasonName}`;
    case 'pl':
      return `${ordinal} ${dayName} ${seasonName}`;
    default:
      return `${ordinal} ${dayName} ${seasonName}`;
  }
}
