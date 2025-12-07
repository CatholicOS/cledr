/**
 * Tests for colors.ts - Liturgical Colors
 */

import { describe, expect, test } from 'bun:test';
import {
  LitColor,
  LitColorI18n,
  getSeasonColor,
  getColorName
} from '../src/colors';

describe('LitColor enum', () => {
  test('has 5 liturgical colors', () => {
    expect(Object.keys(LitColor)).toHaveLength(5);
  });

  test('has correct Latin names', () => {
    expect(LitColor.VIRIDIS).toBe('green');
    expect(LitColor.PURPURA).toBe('purple');
    expect(LitColor.ALBUS).toBe('white');
    expect(LitColor.RUBER).toBe('red');
    expect(LitColor.ROSEA).toBe('rose');
  });
});

describe('LitColorI18n', () => {
  test('has Latin translations', () => {
    expect(LitColorI18n[LitColor.VIRIDIS].la).toBe('viridis');
    expect(LitColorI18n[LitColor.PURPURA].la).toBe('purpura');
    expect(LitColorI18n[LitColor.ALBUS].la).toBe('albus');
    expect(LitColorI18n[LitColor.RUBER].la).toBe('ruber');
    expect(LitColorI18n[LitColor.ROSEA].la).toBe('rosea');
  });

  test('has English translations', () => {
    expect(LitColorI18n[LitColor.VIRIDIS].en).toBe('green');
    expect(LitColorI18n[LitColor.PURPURA].en).toBe('purple');
    expect(LitColorI18n[LitColor.ALBUS].en).toBe('white');
    expect(LitColorI18n[LitColor.RUBER].en).toBe('red');
    expect(LitColorI18n[LitColor.ROSEA].en).toBe('rose');
  });

  test('has Italian translations', () => {
    expect(LitColorI18n[LitColor.VIRIDIS].it).toBe('verde');
    expect(LitColorI18n[LitColor.PURPURA].it).toBe('viola');
    expect(LitColorI18n[LitColor.ALBUS].it).toBe('bianco');
    expect(LitColorI18n[LitColor.RUBER].it).toBe('rosso');
    expect(LitColorI18n[LitColor.ROSEA].it).toBe('rosaceo');
  });
});

describe('getSeasonColor', () => {
  test('returns purple for Advent', () => {
    expect(getSeasonColor('ADVENT')).toBe(LitColor.PURPURA);
    expect(getSeasonColor('ADVENTUS')).toBe(LitColor.PURPURA);
  });

  test('returns purple for Lent', () => {
    expect(getSeasonColor('LENT')).toBe(LitColor.PURPURA);
    expect(getSeasonColor('QUADRAGESIMA')).toBe(LitColor.PURPURA);
  });

  test('returns white for Christmas', () => {
    expect(getSeasonColor('CHRISTMAS')).toBe(LitColor.ALBUS);
    expect(getSeasonColor('NATIVITAS')).toBe(LitColor.ALBUS);
  });

  test('returns white for Easter', () => {
    expect(getSeasonColor('EASTER')).toBe(LitColor.ALBUS);
    expect(getSeasonColor('PASCHALE')).toBe(LitColor.ALBUS);
  });

  test('returns green for Ordinary Time', () => {
    expect(getSeasonColor('ORDINARY')).toBe(LitColor.VIRIDIS);
    expect(getSeasonColor('ORDINARIUM')).toBe(LitColor.VIRIDIS);
  });

  test('returns green for unknown season', () => {
    expect(getSeasonColor('UNKNOWN')).toBe(LitColor.VIRIDIS);
  });
});

describe('getColorName', () => {
  test('returns Latin by default', () => {
    expect(getColorName(LitColor.VIRIDIS)).toBe('viridis');
    expect(getColorName(LitColor.PURPURA)).toBe('purpura');
  });

  test('returns English when specified', () => {
    expect(getColorName(LitColor.VIRIDIS, 'en')).toBe('green');
    expect(getColorName(LitColor.PURPURA, 'en')).toBe('purple');
  });

  test('returns Italian when specified', () => {
    expect(getColorName(LitColor.VIRIDIS, 'it')).toBe('verde');
    expect(getColorName(LitColor.PURPURA, 'it')).toBe('viola');
  });
});
