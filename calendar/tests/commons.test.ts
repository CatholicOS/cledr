/**
 * Tests for commons.ts - Common Texts (Commune)
 */

import { describe, expect, test } from 'bun:test';
import {
  LitCommon,
  LitCommonMartyrs,
  LitCommonPastors,
  LitCommonVirgins,
  LitCommonSaints,
  LitCommonLatin,
  getCommonPath
} from '../src/commons';

describe('LitCommon enum', () => {
  test('has 8 main categories', () => {
    expect(Object.keys(LitCommon)).toHaveLength(8);
  });

  test('has Proper (Proprium)', () => {
    expect(LitCommon.PROPRIO).toBe('Proper');
  });

  test('has Dedication of a Church', () => {
    expect(LitCommon.DEDICATIONIS_ECCLESIAE).toBe('Dedication of a Church');
  });

  test('has Blessed Virgin Mary', () => {
    expect(LitCommon.BEATAE_MARIAE_VIRGINIS).toBe('Blessed Virgin Mary');
  });

  test('has Martyrs', () => {
    expect(LitCommon.MARTYRUM).toBe('Martyrs');
  });

  test('has Pastors', () => {
    expect(LitCommon.PASTORUM).toBe('Pastors');
  });

  test('has Doctors', () => {
    expect(LitCommon.DOCTORUM).toBe('Doctors');
  });

  test('has Virgins', () => {
    expect(LitCommon.VIRGINUM).toBe('Virgins');
  });

  test('has Holy Men and Women', () => {
    expect(LitCommon.SANCTORUM_ET_SANCTARUM).toBe('Holy Men and Women');
  });
});

describe('LitCommonMartyrs', () => {
  test('has subcategories for martyrs', () => {
    expect(LitCommonMartyrs.PRO_UNO_MARTYRE).toBe('For One Martyr');
    expect(LitCommonMartyrs.PRO_PLURIBUS_MARTYRIBUS).toBe('For Several Martyrs');
    expect(LitCommonMartyrs.PRO_MISSIONARIIS_MARTYRIBUS).toBe('For Missionary Martyrs');
    expect(LitCommonMartyrs.PRO_UNO_MISSIONARIO_MARTYRE).toBe('For One Missionary Martyr');
    expect(LitCommonMartyrs.PRO_PLURIBUS_MISSIONARIIS_MARTYRIBUS).toBe('For Several Missionary Martyrs');
    expect(LitCommonMartyrs.PRO_VIRGINE_MARTYRE).toBe('For a Virgin Martyr');
    expect(LitCommonMartyrs.PRO_SANCTA_MULIERE_MARTYRE).toBe('For a Holy Woman Martyr');
  });
});

describe('LitCommonPastors', () => {
  test('has subcategories for pastors', () => {
    expect(LitCommonPastors.PRO_PAPA).toBe('For a Pope');
    expect(LitCommonPastors.PRO_EPISCOPO).toBe('For a Bishop');
    expect(LitCommonPastors.PRO_UNO_PASTORE).toBe('For One Pastor');
    expect(LitCommonPastors.PRO_PLURIBUS_PASTORIBUS).toBe('For Several Pastors');
    expect(LitCommonPastors.PRO_FUNDATORIBUS_ECCLESIARUM).toBe('For Founders of a Church');
    expect(LitCommonPastors.PRO_UNO_FUNDATORE).toBe('For One Founder');
    expect(LitCommonPastors.PRO_PLURIBUS_FUNDATORIBUS).toBe('For Several Founders');
    expect(LitCommonPastors.PRO_MISSIONARIIS).toBe('For Missionaries');
  });
});

describe('LitCommonVirgins', () => {
  test('has subcategories for virgins', () => {
    expect(LitCommonVirgins.PRO_UNA_VIRGINE).toBe('For One Virgin');
    expect(LitCommonVirgins.PRO_PLURIBUS_VIRGINIBUS).toBe('For Several Virgins');
  });
});

describe('LitCommonSaints', () => {
  test('has subcategories for holy men and women', () => {
    expect(LitCommonSaints.PRO_PLURIBUS_SANCTIS).toBe('For Several Saints');
    expect(LitCommonSaints.PRO_UNO_SANCTO).toBe('For One Saint');
    expect(LitCommonSaints.PRO_ABBATE).toBe('For an Abbot');
    expect(LitCommonSaints.PRO_MONACHO).toBe('For a Monk');
    expect(LitCommonSaints.PRO_RELIGIOSIS).toBe('For Religious');
    expect(LitCommonSaints.PRO_IIS_QUI_OPERA_MISERICORDIAE).toBe('For Those Who Practiced Works of Mercy');
    expect(LitCommonSaints.PRO_EDUCATORIBUS).toBe('For Educators');
    expect(LitCommonSaints.PRO_SANCTIS_MULIERIBUS).toBe('For Holy Women');
  });
});

describe('LitCommonLatin', () => {
  test('has Latin translations for all commons', () => {
    expect(LitCommonLatin[LitCommon.PROPRIO]).toBe('Proprium');
    expect(LitCommonLatin[LitCommon.DEDICATIONIS_ECCLESIAE]).toBe('Commune Dedicationis Ecclesiae');
    expect(LitCommonLatin[LitCommon.BEATAE_MARIAE_VIRGINIS]).toBe('Commune Beatae Mariae Virginis');
    expect(LitCommonLatin[LitCommon.MARTYRUM]).toBe('Commune Martyrum');
    expect(LitCommonLatin[LitCommon.PASTORUM]).toBe('Commune Pastorum');
    expect(LitCommonLatin[LitCommon.DOCTORUM]).toBe('Commune Doctorum Ecclesiae');
    expect(LitCommonLatin[LitCommon.VIRGINUM]).toBe('Commune Virginum');
    expect(LitCommonLatin[LitCommon.SANCTORUM_ET_SANCTARUM]).toBe('Commune Sanctorum et Sanctarum');
  });
});

describe('getCommonPath', () => {
  test('generates path for Proper', () => {
    expect(getCommonPath(LitCommon.PROPRIO, 'laudes')).toBe('commune/proprium/laudes');
  });

  test('generates path for Dedication', () => {
    expect(getCommonPath(LitCommon.DEDICATIONIS_ECCLESIAE, 'vesperae')).toBe('commune/dedicatio/vesperae');
  });

  test('generates path for BVM', () => {
    expect(getCommonPath(LitCommon.BEATAE_MARIAE_VIRGINIS, 'missa')).toBe('commune/bmv/missa');
  });

  test('generates path for Martyrs', () => {
    expect(getCommonPath(LitCommon.MARTYRUM, 'officium')).toBe('commune/martyres/officium');
  });

  test('generates path for Pastors', () => {
    expect(getCommonPath(LitCommon.PASTORUM, 'laudes')).toBe('commune/pastores/laudes');
  });

  test('generates path for Doctors', () => {
    expect(getCommonPath(LitCommon.DOCTORUM, 'missa')).toBe('commune/doctores/missa');
  });

  test('generates path for Virgins', () => {
    expect(getCommonPath(LitCommon.VIRGINUM, 'vesperae')).toBe('commune/virgines/vesperae');
  });

  test('generates path for Saints', () => {
    expect(getCommonPath(LitCommon.SANCTORUM_ET_SANCTARUM, 'completorium')).toBe('commune/sancti/completorium');
  });
});
