/* Persistent application state with a tiny subscription store */

import { PALETTES, paletteById, resolveSeed, resolveTheme } from './color.js';

const STORAGE_KEY = 'mat-ex-state';

const DEFAULTS = {
  themePref: 'light',      // light | dark | system
  palette: 'iris',         // palette id or "custom"
  customSeed: null,
  reduceMotion: false,
  lastApp: 'music',
  lang: 'en',              // en | ru
};

const listeners = new Set();

function read() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULTS };
    const parsed = JSON.parse(raw);
    return { ...DEFAULTS, ...parsed };
  } catch (error) {
    return { ...DEFAULTS };
  }
}

let state = read();

function persist() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (error) { /* storage disabled */ }
}

function syncDocument() {
  const root = document.documentElement;
  const resolved = resolveTheme(state);
  root.dataset.theme = resolved;
  root.dataset.themePref = state.themePref;
  root.dataset.lang = state.lang === 'ru' ? 'ru' : 'en';
  root.lang = state.lang === 'ru' ? 'ru' : 'en';
  if (state.reduceMotion) root.dataset.reduceMotion = 'true';
  else delete root.dataset.reduceMotion;
}

function emit() {
  const snapshot = { ...state };
  listeners.forEach((fn) => {
    try { fn(snapshot); } catch (error) { console.error(error); }
  });
  document.dispatchEvent(new CustomEvent('app:state', { detail: snapshot }));
}

export function getState() {
  return { ...state };
}

export function setState(patch, { silent = false } = {}) {
  state = { ...state, ...patch };
  persist();
  syncDocument();
  if (!silent) emit();
  return getState();
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function initState() {
  syncDocument();
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (state.themePref === 'system') {
      syncDocument();
      emit();
    }
  });
  return getState();
}

export function setThemePref(pref) {
  return setState({ themePref: pref });
}

export function toggleTheme() {
  const resolved = resolveTheme(state);
  return setState({ themePref: resolved === 'dark' ? 'light' : 'dark' });
}

export function setPalette(id) {
  if (id === 'custom') return setState({ palette: 'custom' });
  const palette = paletteById(id);
  return setState({ palette: palette.id, customSeed: null });
}

export function setCustomSeed(hex) {
  return setState({ palette: 'custom', customSeed: hex });
}

export function setReduceMotion(value) {
  return setState({ reduceMotion: Boolean(value) });
}

export function currentSeed() {
  return resolveSeed(state);
}

export function currentPalette() {
  if (state.palette === 'custom') {
    return { id: 'custom', name: 'Custom', seed: resolveSeed(state), note: 'Your own seed color.' };
  }
  return paletteById(state.palette);
}

export const PALETTE_LIST = PALETTES;

/* Generic JSON storage for the demo applications. */
export function loadData(key, fallback) {
  try {
    const raw = localStorage.getItem(`mat-ex-${key}`);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (error) {
    return fallback;
  }
}

export function saveData(key, value) {
  try { localStorage.setItem(`mat-ex-${key}`, JSON.stringify(value)); } catch (error) { /* ignore */ }
}