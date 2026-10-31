/* ============================================================
   Application shell: chrome, navigation, search, feedback
   ============================================================ */

import { applyGlobalTheme, normalizeHex, paletteById, PALETTES, resolveTheme } from './color.js';
import { applyLanguage, getLanguage, LANGUAGES, languageLabel, localizeTree, setLanguage, tr } from './i18n.js';
import { NAV, brandLockup, buildSearchIndex } from './shared.js';
import { getState, setCustomSeed, setPalette, setThemePref, subscribe, toggleTheme, setReduceMotion } from './state.js';
import { $, $$, escapeHTML, icon, reducedMotion, refreshIcons, scrollPageTo, trapFocus } from './utils.js';

let searchIndex = [];
let searchRows = [];
let activeSearchIndex = 0;
let palettePop = null;
let langPop = null;
let moreSheet = null;
let releaseSearchTrap = null;
let lastSearchTrigger = null;

const THEME_ICON = { light: 'moon', dark: 'sun' };

/* ---------- Top bar ---------- */

function paletteTriggerLabel() {
  const state = getState();
  if (state.palette === 'custom') return 'Custom';
  return paletteById(state.palette).name;
}

function renderTopbar() {
  const state = getState();
  const mode = resolveTheme(state);
  return `
    <a class="brand" href="#/overview" aria-label="Material Expressive — overview">
      <span class="brand__mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <rect x="5.4" y="5.4" width="13.2" height="13.2" rx="4.4" transform="rotate(45 12 12)" fill="currentColor"/>
          <circle cx="12" cy="12" r="3.2" fill="var(--primary)"/>
        </svg>
      </span>
      <span class="brand__text">
        <span class="brand__name">Material Expressive</span>
        <span class="brand__sub">Design system <span>MD3E</span></span>
      </span>
    </a>
    <div class="topbar-crumb" id="topbar-crumb">
      <span>Showcase</span><span class="slash">/</span><strong id="crumb-label">Overview</strong>
    </div>
    <div class="topbar-spacer"></div>
    <button type="button" class="search-trigger" data-action="open-search" aria-label="Search — open the command palette">
      ${icon('search')}
      <span class="search-trigger__label">Search components, tokens, apps…</span>
      <span class="kbd">Ctrl K</span>
    </button>
    <div class="top-actions">
      <div class="palette-anchor">
        <button type="button" class="palette-trigger" id="palette-trigger" aria-haspopup="dialog" aria-expanded="false" aria-label="Choose a color palette">
          <span class="palette-trigger__dots" aria-hidden="true"><span></span><span></span><span></span></span>
          <span class="palette-trigger__label" id="palette-trigger-label">${escapeHTML(paletteTriggerLabel())}</span>
          ${icon('chevron-down')}
        </button>
        <div id="palette-pop-slot"></div>
      </div>
      <button type="button" class="icon-button theme-toggle" data-action="toggle-theme" aria-label="Toggle dark theme" title="Toggle theme">
        ${icon(THEME_ICON[mode])}
      </button>
      <div class="lang-anchor">
        <button type="button" class="lang-trigger" id="lang-trigger" aria-haspopup="dialog" aria-expanded="false" aria-label="Change language">
          ${icon('languages')}<span id="lang-trigger-label">${languageLabel()}</span>
        </button>
        <div id="lang-pop-slot"></div>
      </div>
      <a class="tokens-btn" href="#/foundations">${icon('braces')}<span>Design tokens</span></a>
    </div>`;
}

function renderSidebar() {
  const showcase = NAV.slice(0, 7);
  const resources = NAV.slice(7);
  const state = getState();
  const seed = state.palette === 'custom' ? state.customSeed : paletteById(state.palette).seed;
  return `
    <nav class="sidebar__nav" aria-label="Showcase sections">
      <div class="nav-section">
        <div class="nav-section__label">Showcase</div>
        ${showcase.map((item) => navItemHTML(item)).join('')}
      </div>
      <div class="nav-section">
        <div class="nav-section__label">System</div>
        ${resources.map((item) => navItemHTML(item)).join('')}
      </div>
    </nav>
    <div class="sidebar__foot">
      <a class="seed-card" href="#/color" aria-label="Open color studio">
        <div class="seed-card__top">
          <span class="seed-card__label">Seed color</span>
          <span class="seed-card__arrow">${icon('arrow-up-right')}</span>
        </div>
        <div class="seed-card__name" id="seed-card-name">${escapeHTML(paletteTriggerLabel())}</div>
        <div class="seed-card__hex" id="seed-card-hex">${escapeHTML(normalizeHex(seed).toUpperCase())}</div>
        <div class="seed-swatches" aria-hidden="true">
          <span style="background:var(--primary)"></span>
          <span style="background:var(--secondary)"></span>
          <span style="background:var(--tertiary)"></span>
          <span style="background:var(--error)"></span>
        </div>
      </a>
    </div>`;
}

function navItemHTML(item) {
  return `<a class="nav-item" data-nav="${item.id}" href="${item.route}">
    ${icon(item.icon)}
    <span class="nav-item__label">${escapeHTML(item.label)}</span>
    <span class="nav-item__index">${item.index}</span>
  </a>`;
}

function renderBottomNav() {
  const items = [
    { id: 'overview', label: 'Home', icon: 'house', route: '#/overview' },
    { id: 'components', label: 'Components', icon: 'blocks', route: '#/components/buttons' },
    { id: 'color', label: 'Color', icon: 'palette', route: '#/color' },
    { id: 'apps', label: 'Apps', icon: 'layout-grid', route: '#/apps/music' },
  ];
  return `<nav class="bottom-nav" aria-label="${tr('Primary navigation')}">
    ${items.map((item) => `<a class="bottom-nav__item" data-nav="${item.id}" href="${item.route}">
      <span class="nav-indicator">${icon(item.icon)}</span><span>${escapeHTML(item.label)}</span>
    </a>`).join('')}
    <button type="button" class="bottom-nav__item" data-action="open-more" aria-haspopup="dialog">
      <span class="nav-indicator">${icon('menu')}</span><span>More</span>
    </button>
  </nav>`;
}

/* ---------- Palette popover ---------- */

function renderPalettePop() {
  const state = getState();
  const current = state.palette;
  return `<div class="palette-pop" id="palette-pop" role="dialog" aria-label="Color palette">
    <div class="palette-pop__head">
      <div>
        <div class="palette-pop__title">Expressive palettes</div>
        <div class="palette-pop__sub">Dynamic color source</div>
      </div>
      ${icon('palette')}
    </div>
    ${PALETTES.map((p) => `<button type="button" class="palette-row" role="menuitemradio" aria-checked="${current === p.id}" data-set-palette="${p.id}">
      <span class="palette-row__swatches" aria-hidden="true">
        <span style="background:${p.seed}"></span>
        <span style="background:color-mix(in srgb, ${p.seed} 55%, #ffffff)"></span>
        <span style="background:color-mix(in srgb, ${p.seed} 30%, #ffffff)"></span>
      </span>
      <span class="palette-row__name">${p.name}</span>
      <span class="palette-row__hex">${p.seed.slice(1)}</span>
      <span class="palette-row__check">${icon('check')}</span>
    </button>`).join('')}
    <div class="palette-pop__divider"></div>
    <label class="palette-custom">
      <input type="color" value="${normalizeHex(state.customSeed || paletteById(state.palette).seed)}" data-action="custom-seed" aria-label="Custom seed color">
      <span class="palette-custom__text">
        <strong>Custom seed</strong>
        <span id="custom-seed-label">${state.customSeed ? state.customSeed.toUpperCase() : 'Pick any color'}</span>
      </span>
      ${icon('pipette')}
    </label>
    <div class="palette-pop__foot">
      <span>${PALETTES.length} curated palettes</span>
      <a href="#/color" data-action="close-palette">Open Color Studio</a>
    </div>
  </div>`;
}

function openPalette() {
  const slot = $('#palette-pop-slot');
  if (!slot) return;
  slot.innerHTML = renderPalettePop();
  palettePop = $('#palette-pop');
  const trigger = $('#palette-trigger');
  trigger?.setAttribute('aria-expanded', 'true');
  localizeTree(palettePop);
  refreshIcons(palettePop);
  const input = palettePop?.querySelector('input[type="color"]');
  input?.addEventListener('input', () => {
    const value = normalizeHex(input.value, '#6750A4');
    const label = $('#custom-seed-label');
    if (label) label.textContent = value.toUpperCase();
    setCustomSeed(value);
    applyGlobalTheme(getState());
    syncShellState();
  });
  requestAnimationFrame(() => input?.focus({ preventScroll: true }));
}

function closePalette() {
  const slot = $('#palette-pop-slot');
  if (slot) slot.innerHTML = '';
  palettePop = null;
  $('#palette-trigger')?.setAttribute('aria-expanded', 'false');
}

function togglePalette() {
  if (palettePop) closePalette();
  else { closeLang(); openPalette(); }
}

/* ---------- Language popover ---------- */

function renderLangPop() {
  return `<div class="palette-pop lang-pop" id="lang-pop" role="dialog" aria-label="Language">
    <div class="palette-pop__head">
      <div>
        <div class="palette-pop__title">${tr('Language')}</div>
        <div class="palette-pop__sub">English · Русский</div>
      </div>
      ${icon('languages')}
    </div>
    ${LANGUAGES.map((language) => `<button type="button" class="palette-row" role="menuitemradio" aria-checked="${getLanguage() === language.id}" data-language="${language.id}">
      <span class="lang-row__badge">${language.short}</span>
      <span class="palette-row__name">${language.native}</span>
      <span class="palette-row__hex">${language.id === 'en' ? 'EN' : 'RU'}</span>
      <span class="palette-row__check">${icon('check')}</span>
    </button>`).join('')}
    <div class="palette-pop__foot">
      <span>${tr('The whole showcase switches language.')}</span>
    </div>
  </div>`;
}

function openLang() {
  const slot = $('#lang-pop-slot');
  if (!slot) return;
  slot.innerHTML = renderLangPop();
  langPop = $('#lang-pop');
  $('#lang-trigger')?.setAttribute('aria-expanded', 'true');
  localizeTree(langPop);
  refreshIcons(langPop);
  requestAnimationFrame(() => langPop?.querySelector('[data-language]')?.focus({ preventScroll: true }));
}

function closeLang() {
  const slot = $('#lang-pop-slot');
  if (slot) slot.innerHTML = '';
  langPop = null;
  $('#lang-trigger')?.setAttribute('aria-expanded', 'false');
}

function toggleLang() {
  if (langPop) closeLang();
  else { closePalette(); openLang(); }
}

/* ---------- More sheet (mobile) ---------- */

function renderMoreSheet() {
  const state = getState();
  const mode = state.themePref;
  return `<div class="more-sheet__handle" aria-hidden="true"></div>
    <div class="more-sheet__head">
      <div class="more-sheet__title">Explore</div>
      <button type="button" class="icon-button" data-action="close-more" aria-label="Close">${icon('x')}</button>
    </div>
    <div class="more-sheet__grid">
      ${NAV.map((item) => `<a class="more-sheet__item" data-nav="${item.id}" href="${item.route}" data-action="close-more">
        ${icon(item.icon)}<span>${escapeHTML(item.label)}</span>
      </a>`).join('')}
    </div>
    <div class="more-sheet__section">
      <div class="more-sheet__label">${tr('Theme')}</div>
      <div class="md-segmented" role="group" aria-label="${tr('Theme')}">
        <button type="button" data-theme-pref="light" aria-pressed="${mode === 'light'}">${tr('Light')}</button>
        <button type="button" data-theme-pref="dark" aria-pressed="${mode === 'dark'}">${tr('Dark')}</button>
        <button type="button" data-theme-pref="system" aria-pressed="${mode === 'system'}">${tr('Auto')}</button>
      </div>
    </div>
    <div class="more-sheet__section">
      <div class="more-sheet__label">${tr('Language')}</div>
      <div class="md-segmented" role="group" aria-label="${tr('Language')}">
        ${LANGUAGES.map((language) => `<button type="button" data-language="${language.id}" aria-pressed="${getLanguage() === language.id}">${language.native}</button>`).join('')}
      </div>
    </div>
    <div class="more-sheet__section">
      <div class="more-sheet__label">${tr('Motion')}</div>
      <div class="settings-row" style="background:var(--surface-high);border-radius:var(--r-md)">
        <div class="settings-row__text">
          <div class="settings-row__title">${tr('Reduce motion')}</div>
          <div class="settings-row__sub">${tr('Snap transitions and disable decorative movement')}</div>
        </div>
        <label class="md-switch">
          <input type="checkbox" id="more-reduce-motion" ${state.reduceMotion ? 'checked' : ''} aria-label="${tr('Reduce motion')}">
          <span class="md-switch__track"><span class="md-switch__thumb"></span></span>
        </label>
      </div>
    </div>
    <div class="more-sheet__section">
      <div class="more-sheet__label">${tr('Palette')}</div>
      <div class="more-sheet__themes">
        ${PALETTES.map((p) => `<button type="button" class="palette-row" style="width:auto;flex:1 1 130px" data-set-palette="${p.id}">
          <span class="palette-row__swatches" aria-hidden="true"><span style="background:${p.seed}"></span></span>
          <span class="palette-row__name">${p.name}</span>
        </button>`).join('')}
      </div>
    </div>`;
}

function openMore() {
  moreSheet = $('#more-sheet');
  if (!moreSheet) return;
  moreSheet.innerHTML = renderMoreSheet();
  refreshIcons(moreSheet);
  localizeTree(moreSheet);
  moreSheet.showModal();
  moreSheet.querySelector('#more-reduce-motion')?.addEventListener('change', (event) => {
    setReduceMotion(event.target.checked);
    document.dispatchEvent(new CustomEvent('app:motion', { detail: { reduce: event.target.checked } }));
    document.dispatchEvent(new CustomEvent('app:toast', { detail: { message: event.target.checked ? 'Reduced motion enabled' : 'Full motion restored', icon: 'activity' } }));
  });
}

/* ---------- Command palette ---------- */

function renderSearchResults(query = '') {  const body = $('#cmdk-results');
  if (!body) return;
  const q = query.trim().toLowerCase();
  let entries = searchIndex;
  if (q) {
    entries = searchIndex
      .map((entry) => {
        const title = entry.title.toLowerCase();
        const haystack = `${title} ${entry.desc} ${entry.keywords} ${entry.type}`.toLowerCase();
        let score = -1;
        if (title.startsWith(q)) score = 100;
        else if (title.includes(q)) score = 70;
        else if (haystack.includes(q)) score = 40;
        else {
          const words = q.split(/\s+/).filter(Boolean);
          if (words.length && words.every((word) => haystack.includes(word))) score = 20;
        }
        if (entry.type === 'Palette' && q.startsWith('#')) score += 30;
        return { entry, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 40)
      .map((item) => item.entry);
  } else {
    entries = searchIndex.slice(0, 14);
  }

  if (!entries.length) {
    body.innerHTML = `<div class="cmdk__empty">
      <p>No matches for “${escapeHTML(query)}”.</p>
      <p style="margin-top:6px;font-size:12px">Try “buttons”, “palette”, “spring” or “weather”.</p>
    </div>`;
    searchRows = [];
    return;
  }

  const groups = new Map();
  for (const entry of entries) {
    if (!groups.has(entry.type)) groups.set(entry.type, []);
    groups.get(entry.type).push(entry);
  }

  let html = '';
  let index = 0;
  for (const [type, list] of groups) {
    html += `<div class="cmdk__group"><div class="cmdk__group-label">${escapeHTML(type)}</div>`;
    for (const entry of list) {
      html += `<button type="button" class="cmdk__item" role="option" aria-selected="${index === 0}" data-index="${index}" data-route="${entry.route || ''}" data-action-name="${entry.action || ''}" data-palette-id="${entry.palette || ''}" data-language-id="${entry.language || ''}">
        <span class="cmdk__icon">${icon(entry.icon)}</span>
        <span class="cmdk__text">
          <span class="cmdk__title">${escapeHTML(entry.title)}</span>
          <span class="cmdk__desc">${escapeHTML(entry.desc)}</span>
        </span>
        <span class="cmdk__key">${entry.type === 'Page' ? '↵' : entry.type === 'Palette' ? 'theme' : 'open'}</span>
      </button>`;
      index += 1;
    }
    html += '</div>';
  }
  body.innerHTML = html;
  searchRows = $$('.cmdk__item', body);
  activeSearchIndex = 0;
  refreshIcons(body);
  localizeTree(body);
}

function openSearch(initialQuery = '') {
  const overlay = $('#cmdk-overlay');
  if (!overlay) return;
  lastSearchTrigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  overlay.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => overlay.classList.add('is-open'));
  const input = $('#cmdk-input');
  if (input) {
    input.value = initialQuery;
    renderSearchResults(initialQuery);
    input.focus({ preventScroll: true });
  }
  releaseSearchTrap = trapFocus(overlay.querySelector('.cmdk'), lastSearchTrigger);
}

function closeSearch() {
  const overlay = $('#cmdk-overlay');
  if (!overlay || overlay.hidden) return;
  overlay.classList.remove('is-open');
  document.body.classList.remove('no-scroll');
  releaseSearchTrap?.();
  releaseSearchTrap = null;
  window.setTimeout(() => { overlay.hidden = true; }, 220);
}

function moveSearchSelection(delta) {
  if (!searchRows.length) return;
  activeSearchIndex = (activeSearchIndex + delta + searchRows.length) % searchRows.length;
  searchRows.forEach((row, i) => row.setAttribute('aria-selected', String(i === activeSearchIndex)));
  searchRows[activeSearchIndex].scrollIntoView({ block: 'nearest' });
}

function activateSearchRow(row) {
  if (!row) return;
  const { actionName, route, paletteId, languageId } = row.dataset;
  if (actionName === 'toggle-theme') {
    closeSearch();
    withThemeTransition(toggleTheme);
    return;
  }
  if (actionName === 'set-palette' && paletteId) {
    applyPalette(paletteId);
  }
  if (actionName === 'set-language' && languageId) {
    closeSearch();
    changeLanguage(languageId);
    return;
  }
  if (route) {
    const target = route.split('#')[1] ? `#${route.split('#')[1]}` : route;
    if (window.location.hash === target) {
      scrollPageTo(0);
      closeSearch();
    } else {
      window.location.hash = target;
    }
  }
  closeSearch();
}

function buildSearchOverlay() {
  const overlay = document.createElement('div');
  overlay.id = 'cmdk-overlay';
  overlay.className = 'cmdk-overlay';
  overlay.hidden = true;
  overlay.innerHTML = `<div class="cmdk" role="dialog" aria-modal="true" aria-label="Search Material Expressive">
    <div class="cmdk__search">
      ${icon('search')}
      <input id="cmdk-input" class="cmdk__input" type="text" role="combobox" aria-expanded="true" aria-controls="cmdk-results" aria-autocomplete="list" placeholder="Search components, tokens, apps…" autocomplete="off" spellcheck="false">
      <span class="cmdk__esc">ESC</span>
    </div>
    <div id="cmdk-results" class="cmdk__body" role="listbox" aria-label="Search results"></div>
    <div class="cmdk__foot">
      <div class="cmdk__hints">
        <span><span class="kbd">↑</span><span class="kbd">↓</span> Navigate</span>
        <span><span class="kbd">↵</span> Open</span>
        <span><span class="kbd">esc</span> Close</span>
      </div>
      <span>${searchIndex.length} indexed things</span>
    </div>
  </div>`;
  $('#overlay-root').appendChild(overlay);

  const input = $('#cmdk-input');
  input.addEventListener('input', () => renderSearchResults(input.value));
  input.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') { event.preventDefault(); moveSearchSelection(1); }
    if (event.key === 'ArrowUp') { event.preventDefault(); moveSearchSelection(-1); }
    if (event.key === 'Enter') { event.preventDefault(); activateSearchRow(searchRows[activeSearchIndex]); }
  });
  overlay.addEventListener('click', (event) => {
    const row = event.target.closest('.cmdk__item');
    if (row) { activateSearchRow(row); return; }
    if (event.target === overlay) closeSearch();
  });
}

/* ---------- Theme transitions & palette ---------- */

export function withThemeTransition(mutate, origin) {
  const x = origin?.x ?? window.innerWidth / 2;
  const y = origin?.y ?? 0;
  const root = document.documentElement;
  root.style.setProperty('--vt-x', `${x}px`);
  root.style.setProperty('--vt-y', `${y}px`);
  if (!document.startViewTransition || reducedMotion()) {
    mutate();
    applyGlobalTheme(getState());
    return;
  }
  const transition = document.startViewTransition(() => {
    mutate();
    applyGlobalTheme(getState());
  });
  transition.finished.finally(() => {
    root.style.removeProperty('--vt-x');
    root.style.removeProperty('--vt-y');
  });
}

export function applyPalette(id, customSeed = null, notify = true) {
  if (customSeed) {
    setCustomSeed(normalizeHex(customSeed));
  } else {
    setPalette(id);
  }
  applyGlobalTheme(getState());
  if (notify) {
    const palette = id === 'custom' ? { name: 'Custom', seed: normalizeHex(customSeed) } : paletteById(id);
    const message = getLanguage() === 'ru' ? `${palette.name}: палитра применена` : `${palette.name} palette applied`;
    document.dispatchEvent(new CustomEvent('app:toast', { detail: { message, icon: 'palette' } }));
  }
  closePalette();
}

export function changeLanguage(id) {
  const next = id === 'ru' ? 'ru' : 'en';
  if (next === getLanguage()) {
    closeLang();
    moreSheet?.close();
    return;
  }
  closePalette();
  closeLang();
  moreSheet?.close();
  setLanguage(next);
  rerenderChrome();
  document.dispatchEvent(new CustomEvent('app:language', { detail: { lang: next } }));
  applyLanguage(document.body);
  const message = next === 'ru' ? 'Язык переключён на русский' : 'Language switched to English';
  document.dispatchEvent(new CustomEvent('app:toast', { detail: { message, icon: 'languages' } }));
}

export function rerenderChrome() {
  const topbar = $('#topbar');
  const sidebar = $('#sidebar');
  const bottom = $('#bottom-nav');
  if (topbar) topbar.innerHTML = renderTopbar();
  if (sidebar) sidebar.innerHTML = renderSidebar();
  if (bottom) bottom.innerHTML = renderBottomNav();
  syncShellState();
  refreshIcons();
  const overlay = $('#cmdk-overlay');
  if (overlay && !overlay.hidden) {
    const input = $('#cmdk-input');
    renderSearchResults(input?.value || '');
    applyLanguage(overlay);
  }
}

/* ---------- Snackbar ---------- */

function showSnackbar({ message, icon: iconName = 'check' }) {
  const host = $('#snackbar-host');
  if (!host) return;
  while (host.children.length >= 3) host.firstElementChild?.remove();
  const bar = document.createElement('div');
  bar.className = 'snackbar';
  bar.innerHTML = `${icon(iconName)}<span>${escapeHTML(tr(message))}</span>`;
  host.appendChild(bar);
  refreshIcons(bar);
  window.setTimeout(() => {
    bar.classList.add('is-leaving');
    window.setTimeout(() => bar.remove(), 260);
  }, 2800);
}

/* ---------- Scroll behaviour ---------- */

function bindScroll() {
  const topbar = $('#topbar');
  const backToTop = $('#back-to-top');
  const progress = $('#scroll-progress-bar');
  let scheduled = false;
  const update = () => {
    scheduled = false;
    const y = window.scrollY;
    topbar?.classList.toggle('is-scrolled', y > 8);
    backToTop?.classList.toggle('is-visible', y > 640);
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(y / max, 1) : 0;
      progress.style.setProperty('--progress', ratio.toFixed(4));
    }
  };
  window.addEventListener('scroll', () => {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });
  update();
}

/* ---------- Public helpers ---------- */

export function updateActiveNav(pageId) {
  $$('[data-nav]').forEach((item) => {
    const active = item.dataset.nav === pageId;
    item.classList.toggle('is-active', active);
    if (active) item.setAttribute('aria-current', 'page');
    else item.removeAttribute('aria-current');
  });
  const current = NAV.find((item) => item.id === pageId);
  const crumb = $('#crumb-label');
  if (crumb && current) crumb.textContent = current.label;
}

export function setDocumentTitle(title) {
  document.title = title ? `${tr(title)} — Material Expressive` : 'Material Expressive — A more expressive way to interact';
}

export function syncShellState() {
  const state = getState();
  const mode = resolveTheme(state);
  const label = paletteTriggerLabel();
  const triggerLabel = $('#palette-trigger-label');
  if (triggerLabel) triggerLabel.textContent = label;
  const seedName = $('#seed-card-name');
  if (seedName) seedName.textContent = label;
  const seedHex = $('#seed-card-hex');
  if (seedHex) seedHex.textContent = normalizeHex(state.palette === 'custom' ? state.customSeed : paletteById(state.palette).seed).toUpperCase();
  const themeButton = $('[data-action="toggle-theme"]');
  if (themeButton) {
    themeButton.innerHTML = icon(THEME_ICON[mode]);
    themeButton.setAttribute('aria-label', mode === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  }
  $$('[data-set-palette]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.setPalette === state.palette));
  });
  $$('[data-theme-pref]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.themePref === state.themePref));
  });
  if (palettePop) {
    $$('.palette-row', palettePop).forEach((row) => row.setAttribute('aria-checked', String(row.dataset.setPalette === state.palette)));
  }
  refreshIcons(themeButton?.parentElement || document);
}

/* ---------- Global interactions ---------- */

function bindGlobalActions() {
  document.addEventListener('click', (event) => {
    const actionTarget = event.target.closest('[data-action]');
    const action = actionTarget?.dataset.action;
    if (action) {
      if (action === 'open-search') { event.preventDefault(); openSearch(); return; }
      if (action === 'toggle-theme') {
        const rect = actionTarget.getBoundingClientRect();
        withThemeTransition(toggleTheme, { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
        return;
      }
      if (action === 'custom-seed') return;
      if (action === 'close-palette') { closePalette(); return; }
      if (action === 'open-more') { openMore(); return; }
      if (action === 'close-more') { moreSheet?.close(); return; }
      if (action === 'set-language') {
        const language = actionTarget.dataset.language;
        if (language) changeLanguage(language);
        return;
      }
    }

    const languageButton = event.target.closest('[data-language]');
    if (languageButton) {
      changeLanguage(languageButton.dataset.language);
      return;
    }

    const langTrigger = event.target.closest('#lang-trigger');
    if (langTrigger) { toggleLang(); return; }

    const paletteTrigger = event.target.closest('#palette-trigger');
    if (paletteTrigger) { togglePalette(); return; }

    const paletteButton = event.target.closest('[data-set-palette]');
    if (paletteButton) {
      const id = paletteButton.dataset.setPalette;
      if (id === 'custom') {
        applyPalette('custom', getState().customSeed || paletteById(getState().palette).seed, false);
        document.dispatchEvent(new CustomEvent('app:toast', { detail: { message: 'Custom seed ready — open the Color Studio', icon: 'pipette' } }));
        closePalette();
      } else {
        applyPalette(id);
      }
      moreSheet?.close();
      return;
    }

    const themePrefButton = event.target.closest('[data-theme-pref]');
    if (themePrefButton) {
      setThemePref(themePrefButton.dataset.themePref);
      syncShellState();
      return;
    }

    if (palettePop && !event.target.closest('#palette-pop') && !event.target.closest('#palette-trigger')) closePalette();
    if (langPop && !event.target.closest('#lang-pop') && !event.target.closest('#lang-trigger')) closeLang();
  });

  document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if ((event.ctrlKey || event.metaKey) && key === 'k') {
      event.preventDefault();
      openSearch();
      return;
    }
    if (key === 'escape') {
      closePalette();
      closeLang();
      return;
    }
    if (key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey) {
      const target = event.target;
      const typing = target instanceof HTMLElement && (target.isContentEditable || /input|textarea|select/i.test(target.tagName));
      const overlay = $('#cmdk-overlay');
      if (!typing && overlay?.hidden) {
        event.preventDefault();
        openSearch();
      }
    }
  });

  document.addEventListener('app:toast', (event) => showSnackbar(event.detail));
  $('#back-to-top')?.addEventListener('click', () => scrollPageTo(0));
  document.querySelector('.skip-link')?.addEventListener('click', (event) => {
    event.preventDefault();
    const main = $('#main');
    main?.focus();
    main?.scrollIntoView({ block: 'start' });
  });
}

/* ---------- Boot ---------- */

export function initShell() {
  searchIndex = buildSearchIndex();
  const topbar = $('#topbar');
  const sidebar = $('#sidebar');
  const bottom = $('#bottom-nav');
  if (topbar) topbar.innerHTML = renderTopbar();
  if (sidebar) sidebar.innerHTML = renderSidebar();
  if (bottom) bottom.innerHTML = renderBottomNav();

  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  progress.innerHTML = '<div class="scroll-progress__bar" id="scroll-progress-bar"></div>';
  $('#app')?.prepend(progress);

  const sheet = document.createElement('dialog');
  sheet.id = 'more-sheet';
  sheet.className = 'more-sheet';
  $('#overlay-root')?.appendChild(sheet);

  buildSearchOverlay();
  bindGlobalActions();
  bindScroll();

  subscribe(() => syncShellState());
  syncShellState();
  refreshIcons();
  applyLanguage(document.body);

  window.addEventListener('hashchange', () => { closePalette(); closeLang(); });
}