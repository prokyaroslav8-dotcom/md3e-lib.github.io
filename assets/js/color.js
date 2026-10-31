/* ============================================================
   Dynamic color engine
   Authentic Material tonal palettes via @material/material-color-utilities
   ============================================================ */

import {
  Hct,
  MaterialDynamicColors,
  SchemeTonalSpot,
  argbFromHex,
  hexFromArgb,
} from '../vendor/material-color.js';

export const PALETTES = [
  { id: 'iris', name: 'Iris', seed: '#6750A4', note: 'Calm, creative, unmistakably expressive.' },
  { id: 'jade', name: 'Jade', seed: '#2F6B52', note: 'Grounded, botanical, quietly confident.' },
  { id: 'ember', name: 'Ember', seed: '#A34B2D', note: 'Warm, tactile and alive.' },
  { id: 'tide', name: 'Tide', seed: '#2C5F8A', note: 'Clear-headed with a coastal ease.' },
  { id: 'saffron', name: 'Saffron', seed: '#7C5A0E', note: 'Sunlit, editorial, optimistic.' },
  { id: 'rose', name: 'Rose', seed: '#8B4555', note: 'Soft-spoken, warm and self-assured.' },
];

export const APP_SEEDS = {
  music: '#584A7A',
  weather: '#2B6484',
  notes: '#536B57',
  home: '#3F5E55',
  tasks: '#9A4F35',
};

const ROLE_KEYS = [
  'primary', 'onPrimary', 'primaryContainer', 'onPrimaryContainer', 'inversePrimary',
  'secondary', 'onSecondary', 'secondaryContainer', 'onSecondaryContainer',
  'tertiary', 'onTertiary', 'tertiaryContainer', 'onTertiaryContainer',
  'error', 'onError', 'errorContainer', 'onErrorContainer',
  'surface', 'surfaceDim', 'surfaceBright', 'surfaceContainerLowest', 'surfaceContainerLow',
  'surfaceContainer', 'surfaceContainerHigh', 'surfaceContainerHighest',
  'onSurface', 'onSurfaceVariant', 'outline', 'outlineVariant',
  'inverseSurface', 'inverseOnSurface', 'surfaceTint', 'scrim', 'shadow',
  'primaryFixed', 'primaryFixedDim', 'onPrimaryFixed', 'onPrimaryFixedVariant',
  'secondaryFixed', 'secondaryFixedDim', 'onSecondaryFixed', 'onSecondaryFixedVariant',
  'tertiaryFixed', 'tertiaryFixedDim', 'onTertiaryFixed', 'onTertiaryFixedVariant',
];

const ALIAS_MAP = {
  primary: 'primary',
  onPrimary: 'on-primary',
  primaryContainer: 'primary-container',
  onPrimaryContainer: 'on-primary-container',
  inversePrimary: 'inverse-primary',
  secondary: 'secondary',
  onSecondary: 'on-secondary',
  secondaryContainer: 'secondary-container',
  onSecondaryContainer: 'on-secondary-container',
  tertiary: 'tertiary',
  onTertiary: 'on-tertiary',
  tertiaryContainer: 'tertiary-container',
  onTertiaryContainer: 'on-tertiary-container',
  error: 'error',
  onError: 'on-error',
  errorContainer: 'error-container',
  onErrorContainer: 'on-error-container',
  surface: 'surface',
  surfaceDim: 'surface-dim',
  surfaceBright: 'surface-bright',
  surfaceContainerLowest: 'surface-lowest',
  surfaceContainerLow: 'surface-low',
  surfaceContainer: 'surface-container',
  surfaceContainerHigh: 'surface-high',
  surfaceContainerHighest: 'surface-highest',
  onSurface: 'on-surface',
  onSurfaceVariant: 'on-surface-variant',
  outline: 'outline',
  outlineVariant: 'outline-variant',
  inverseSurface: 'inverse-surface',
  inverseOnSurface: 'inverse-on-surface',
  surfaceTint: 'surface-tint',
  scrim: 'scrim',
  shadow: 'shadow-color',
  primaryFixed: 'primary-fixed',
  primaryFixedDim: 'primary-fixed-dim',
  onPrimaryFixed: 'on-primary-fixed',
  onPrimaryFixedVariant: 'on-primary-fixed-variant',
  secondaryFixed: 'secondary-fixed',
  secondaryFixedDim: 'secondary-fixed-dim',
  onSecondaryFixed: 'on-secondary-fixed',
  onSecondaryFixedVariant: 'on-secondary-fixed-variant',
  tertiaryFixed: 'tertiary-fixed',
  tertiaryFixedDim: 'tertiary-fixed-dim',
  onTertiaryFixed: 'on-tertiary-fixed',
  onTertiaryFixedVariant: 'on-tertiary-fixed-variant',
};

const kebab = (value) => value.replace(/([A-Z])/g, '-$1').toLowerCase();

export function normalizeHex(value, fallback = '#6750A4') {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  if (/^#[0-9a-f]{6}$/i.test(trimmed)) return trimmed.toLowerCase();
  if (/^#[0-9a-f]{3}$/i.test(trimmed)) {
    return `#${trimmed.slice(1).split('').map((c) => c + c).join('')}`.toLowerCase();
  }
  if (/^[0-9a-f]{6}$/i.test(trimmed)) return `#${trimmed.toLowerCase()}`;
  return fallback;
}

export function resolveTheme(state) {
  const pref = state.themePref || 'light';
  if (pref === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return pref === 'dark' ? 'dark' : 'light';
}

export function paletteById(id) {
  return PALETTES.find((p) => p.id === id) || PALETTES[0];
}

export function resolveSeed(state) {
  if (state.palette === 'custom' && state.customSeed) return normalizeHex(state.customSeed);
  return paletteById(state.palette).seed;
}

function makeScheme(seed, mode) {
  const hct = Hct.fromInt(argbFromHex(normalizeHex(seed)));
  return new SchemeTonalSpot(hct, mode === 'dark', 0.0);
}

export function getRoles(seed, mode = 'light') {
  const scheme = makeScheme(seed, mode);
  const roles = {};
  for (const key of ROLE_KEYS) {
    const color = MaterialDynamicColors[key];
    roles[key] = color ? hexFromArgb(color.getArgb(scheme)) : '#000000';
  }
  return roles;
}

function tones(palette) {
  return [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 100].map((tone) => ({
    tone,
    hex: hexFromArgb(palette.tone(tone)),
  }));
}

export function getTonalPalettes(seed, mode = 'light') {
  const scheme = makeScheme(seed, mode);
  return {
    primary: { label: 'Primary', tones: tones(scheme.primaryPalette), hue: scheme.primaryPalette.hue },
    secondary: { label: 'Secondary', tones: tones(scheme.secondaryPalette), hue: scheme.secondaryPalette.hue },
    tertiary: { label: 'Tertiary', tones: tones(scheme.tertiaryPalette), hue: scheme.tertiaryPalette.hue },
    neutral: { label: 'Neutral', tones: tones(scheme.neutralPalette), hue: scheme.neutralPalette.hue },
    neutralVariant: { label: 'Neutral variant', tones: tones(scheme.neutralVariantPalette), hue: scheme.neutralVariantPalette.hue },
    error: { label: 'Error', tones: tones(scheme.errorPalette), hue: scheme.errorPalette.hue },
  };
}

export function applyGlobalTheme(state) {
  const mode = resolveTheme(state);
  const seed = resolveSeed(state);
  const roles = getRoles(seed, mode);
  const root = document.documentElement;

  for (const [key, value] of Object.entries(roles)) {
    root.style.setProperty(`--md-${kebab(key)}`, value);
    if (ALIAS_MAP[key]) root.style.setProperty(`--${ALIAS_MAP[key]}`, value);
  }
  root.style.setProperty('--theme-seed', seed);
  root.dataset.theme = mode;
  root.dataset.seed = seed;
  root.dataset.palette = state.palette || 'iris';
  root.style.colorScheme = mode;

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', roles.surface);
  return { mode, seed, roles };
}

export function applyScopedTheme(element, seed, mode = 'light') {
  if (!element) return;
  const roles = getRoles(seed, mode);
  for (const [key, value] of Object.entries(roles)) {
    element.style.setProperty(`--md-${kebab(key)}`, value);
    if (ALIAS_MAP[key]) element.style.setProperty(`--${ALIAS_MAP[key]}`, value);
  }
  element.dataset.theme = mode;
  element.dataset.seed = seed;
  element.style.colorScheme = mode;
  return roles;
}

export function schemeStyle(seed, mode = 'light') {
  const roles = getRoles(seed, mode);
  const parts = [];
  for (const [key, value] of Object.entries(roles)) {
    parts.push(`--md-${kebab(key)}:${value}`);
    if (ALIAS_MAP[key]) parts.push(`--${ALIAS_MAP[key]}:${value}`);
  }
  return parts.join(';');
}

export const COLOR_ROLES = [
  { key: 'primary', on: 'onPrimary', name: 'Primary', variable: '--md-primary', desc: 'High-emphasis actions and brand moments.' },
  { key: 'primaryContainer', on: 'onPrimaryContainer', name: 'Primary container', variable: '--md-primary-container', desc: 'Supporting emphasis and expressive surfaces.' },
  { key: 'secondary', on: 'onSecondary', name: 'Secondary', variable: '--md-secondary', desc: 'A quieter companion for secondary actions.' },
  { key: 'secondaryContainer', on: 'onSecondaryContainer', name: 'Secondary container', variable: '--md-secondary-container', desc: 'Selected states, chips and tonal groups.' },
  { key: 'tertiary', on: 'onTertiary', name: 'Tertiary', variable: '--md-tertiary', desc: 'A contrasting accent for moments of delight.' },
  { key: 'tertiaryContainer', on: 'onTertiaryContainer', name: 'Tertiary container', variable: '--md-tertiary-container', desc: 'Playful contrast without visual noise.' },
  { key: 'surface', on: 'onSurface', name: 'Surface', variable: '--md-surface', desc: 'The foundation every component rests on.' },
  { key: 'surfaceContainer', on: 'onSurface', name: 'Surface container', variable: '--md-surface-container', desc: 'Grouping and separation by tone.' },
  { key: 'outline', on: 'surface', name: 'Outline', variable: '--md-outline', desc: 'Borders and essential boundaries.' },
  { key: 'error', on: 'onError', name: 'Error', variable: '--md-error', desc: 'Destructive actions and critical feedback.' },
];

export function roleContrast(seed, mode) {
  const roles = getRoles(seed, mode);
  return COLOR_ROLES.map((role) => ({
    ...role,
    background: roles[role.key],
    foreground: roles[role.on],
  }));
}