/**
 * Common Texts (Commune)
 *
 * The "Common" texts used when a saint doesn't have proper texts.
 * Aligned with liturgical-calendar-api LitCommon.php
 */

/**
 * Main categories of Common texts
 */
export enum LitCommon {
  /** Proper texts - saint has their own texts */
  PROPRIO = 'Proper',
  /** Common for Dedication of a Church */
  DEDICATIONIS_ECCLESIAE = 'Dedication of a Church',
  /** Common of the Blessed Virgin Mary */
  BEATAE_MARIAE_VIRGINIS = 'Blessed Virgin Mary',
  /** Common of Martyrs */
  MARTYRUM = 'Martyrs',
  /** Common of Pastors */
  PASTORUM = 'Pastors',
  /** Common of Doctors of the Church */
  DOCTORUM = 'Doctors',
  /** Common of Virgins */
  VIRGINUM = 'Virgins',
  /** Common of Holy Men and Women */
  SANCTORUM_ET_SANCTARUM = 'Holy Men and Women',
}

/**
 * Subcategories for Martyrs
 */
export enum LitCommonMartyrs {
  PRO_UNO_MARTYRE = 'For One Martyr',
  PRO_PLURIBUS_MARTYRIBUS = 'For Several Martyrs',
  PRO_MISSIONARIIS_MARTYRIBUS = 'For Missionary Martyrs',
  PRO_UNO_MISSIONARIO_MARTYRE = 'For One Missionary Martyr',
  PRO_PLURIBUS_MISSIONARIIS_MARTYRIBUS = 'For Several Missionary Martyrs',
  PRO_VIRGINE_MARTYRE = 'For a Virgin Martyr',
  PRO_SANCTA_MULIERE_MARTYRE = 'For a Holy Woman Martyr',
}

/**
 * Subcategories for Pastors
 */
export enum LitCommonPastors {
  PRO_PAPA = 'For a Pope',
  PRO_EPISCOPO = 'For a Bishop',
  PRO_UNO_PASTORE = 'For One Pastor',
  PRO_PLURIBUS_PASTORIBUS = 'For Several Pastors',
  PRO_FUNDATORIBUS_ECCLESIARUM = 'For Founders of a Church',
  PRO_UNO_FUNDATORE = 'For One Founder',
  PRO_PLURIBUS_FUNDATORIBUS = 'For Several Founders',
  PRO_MISSIONARIIS = 'For Missionaries',
}

/**
 * Subcategories for Virgins
 */
export enum LitCommonVirgins {
  PRO_UNA_VIRGINE = 'For One Virgin',
  PRO_PLURIBUS_VIRGINIBUS = 'For Several Virgins',
}

/**
 * Subcategories for Holy Men and Women
 */
export enum LitCommonSaints {
  PRO_PLURIBUS_SANCTIS = 'For Several Saints',
  PRO_UNO_SANCTO = 'For One Saint',
  PRO_ABBATE = 'For an Abbot',
  PRO_MONACHO = 'For a Monk',
  PRO_RELIGIOSIS = 'For Religious',
  PRO_IIS_QUI_OPERA_MISERICORDIAE = 'For Those Who Practiced Works of Mercy',
  PRO_EDUCATORIBUS = 'For Educators',
  PRO_SANCTIS_MULIERIBUS = 'For Holy Women',
}

/**
 * Latin translations for common texts
 */
export const LitCommonLatin: Record<LitCommon, string> = {
  [LitCommon.PROPRIO]: 'Proprium',
  [LitCommon.DEDICATIONIS_ECCLESIAE]: 'Commune Dedicationis Ecclesiae',
  [LitCommon.BEATAE_MARIAE_VIRGINIS]: 'Commune Beatae Mariae Virginis',
  [LitCommon.MARTYRUM]: 'Commune Martyrum',
  [LitCommon.PASTORUM]: 'Commune Pastorum',
  [LitCommon.DOCTORUM]: 'Commune Doctorum Ecclesiae',
  [LitCommon.VIRGINUM]: 'Commune Virginum',
  [LitCommon.SANCTORUM_ET_SANCTARUM]: 'Commune Sanctorum et Sanctarum',
};

/**
 * Get the fragment path for a common
 */
export function getCommonPath(common: LitCommon, hora: string): string {
  const commonMap: Record<LitCommon, string> = {
    [LitCommon.PROPRIO]: 'proprium',
    [LitCommon.DEDICATIONIS_ECCLESIAE]: 'dedicatio',
    [LitCommon.BEATAE_MARIAE_VIRGINIS]: 'bmv',
    [LitCommon.MARTYRUM]: 'martyres',
    [LitCommon.PASTORUM]: 'pastores',
    [LitCommon.DOCTORUM]: 'doctores',
    [LitCommon.VIRGINUM]: 'virgines',
    [LitCommon.SANCTORUM_ET_SANCTARUM]: 'sancti',
  };
  return `commune/${commonMap[common]}/${hora}`;
}
