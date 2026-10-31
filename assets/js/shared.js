/* Shared navigation, search index, brand and footer */

import { PALETTES, paletteById } from './color.js';
import { tr } from './i18n.js';
import { getState, PALETTE_LIST } from './state.js';
import { escapeHTML, icon } from './utils.js';

export const NAV = [
  { id: 'overview', label: 'Overview', icon: 'house', route: '#/overview', index: '01', desc: 'The expressive showcase' },
  { id: 'components', label: 'Components', icon: 'blocks', route: '#/components/buttons', index: '02', desc: 'A living component playground' },
  { id: 'color', label: 'Color', icon: 'palette', route: '#/color', index: '03', desc: 'Dynamic color and tonal palettes' },
  { id: 'motion', label: 'Motion', icon: 'activity', route: '#/motion', index: '04', desc: 'Spring physics and choreography' },
  { id: 'shape', label: 'Shape', icon: 'shapes', route: '#/shape', index: '05', desc: 'Expressive geometry' },
  { id: 'type', label: 'Typography', icon: 'type', route: '#/type', index: '06', desc: 'The Google Sans Flex specimen' },
  { id: 'apps', label: 'Applications', icon: 'layout-grid', route: '#/apps/music', index: '07', desc: 'Five complete interfaces' },
  { id: 'foundations', label: 'Foundations', icon: 'book-open', route: '#/foundations', index: '08', desc: 'Design tokens and principles' },
];

export const COMPONENT_CATEGORIES = [
  { id: 'buttons', name: 'Buttons', icon: 'mouse-pointer-2', desc: 'Actions with weight, shape and rhythm.' },
  { id: 'cards', name: 'Cards', icon: 'layers', desc: 'Containers that create hierarchy without noise.' },
  { id: 'navigation', name: 'Navigation', icon: 'panel-left', desc: 'Wayfinding that adapts to its surface.' },
  { id: 'selection', name: 'Selection', icon: 'sliders-horizontal', desc: 'Controls that make choice feel tactile.' },
  { id: 'dialogs', name: 'Dialogs', icon: 'app-window', desc: 'Focused moments, entered and exited with care.' },
  { id: 'fields', name: 'Text fields', icon: 'text-cursor-input', desc: 'Input with clear labels and quiet feedback.' },
];

export const APPS = [
  { id: 'music', name: 'Chromatic', kind: 'Listening', icon: 'disc-3', seed: '#584A7A', palette: 'Iris', desc: 'A meditative player built around a living record.' },
  { id: 'weather', name: 'Atmos', kind: 'Weather', icon: 'cloud-sun', seed: '#2B6484', palette: 'Tide', desc: 'Forecast as atmosphere, not spreadsheet.' },
  { id: 'notes', name: 'Folio', kind: 'Notes', icon: 'notebook-pen', seed: '#536B57', palette: 'Jade', desc: 'A quiet place for unfinished thoughts.' },
  { id: 'home', name: 'Hearth', kind: 'Smart home', icon: 'house-plug', seed: '#3F5E55', palette: 'Moss', desc: 'A home that answers to a single gesture.' },
  { id: 'tasks', name: 'Dayline', kind: 'Tasks', icon: 'list-checks', seed: '#9A4F35', palette: 'Ember', desc: 'An agenda that celebrates small progress.' },
];

export function brandMark(className = '') {
  return `<span class="brand__mark ${className}" aria-hidden="true">
    <svg viewBox="0 0 24 24" fill="none">
      <rect x="5.4" y="5.4" width="13.2" height="13.2" rx="4.4" transform="rotate(45 12 12)" fill="currentColor"/>
      <circle cx="12" cy="12" r="3.2" fill="var(--primary)"/>
    </svg>
  </span>`;
}

export function brandLockup() {
  return `<a class="brand" href="#/overview" aria-label="Material Expressive — overview">
    ${brandMark()}
    <span class="brand__text">
      <span class="brand__name">Material Expressive</span>
      <span class="brand__sub">Design system <span>MD3E</span></span>
    </span>
  </a>`;
}

export function pageHead({ index = '01', kicker = 'Showcase', title, lede, meta = [], split = false, aside = '' }) {
  return `<header class="page-head ${split ? 'page-head--split' : ''}">
    <div>
      <div class="page-head__index"><b>${escapeHTML(index)}</b><span class="line"></span><span>${escapeHTML(kicker)}</span></div>
      <h1 class="page-title">${title}</h1>
      ${lede ? `<p class="page-lede">${lede}</p>` : ''}
      ${meta.length ? `<div class="page-head__meta">${meta.map((item) => `<span class="tag">${item}</span>`).join('')}</div>` : ''}
    </div>
    ${aside ? `<div class="page-head__aside">${aside}</div>` : ''}
  </header>`;
}

export function paletteSwatches(current = getState().palette) {
  return `<div class="site-footer__palette" role="group" aria-label="Choose a color palette">
    ${PALETTES.map((p) => `<button type="button" data-set-palette="${p.id}" style="background:${p.seed}" aria-label="${p.name} palette" aria-pressed="${p.id === current}" title="${p.name}"></button>`).join('')}
    <button type="button" data-set-palette="custom" style="background:conic-gradient(from 20deg, #b94a68, #ad6b00, #476b54, #2c5f8a, #8b4555, #b94a68)" aria-label="Custom color" aria-pressed="${current === 'custom'}" title="Custom"></button>
  </div>`;
}

export function siteFooter() {
  const state = getState();
  const current = state.palette === 'custom' ? 'custom' : paletteById(state.palette).id;
  return `<footer class="site-footer">
    <div class="site-footer__inner">
      <div class="site-footer__main">
        <div class="site-footer__brand-block">
          <div class="site-footer__brand">
            ${brandMark()}
            <div>
              <div class="site-footer__title">Material Expressive</div>
              <p class="site-footer__desc">A living demonstration of Material Design 3 Expressive. Built with dynamic color, real spring physics and an unreasonable amount of care.</p>
            </div>
          </div>
          <p class="site-footer__col-title" style="margin-top:24px">Seed palette</p>
          ${paletteSwatches(current)}
        </div>
        <div>
          <div class="site-footer__col-title">Showcase</div>
          <div class="site-footer__links">
            <a href="#/components/buttons">Components</a>
            <a href="#/color">Color studio</a>
            <a href="#/motion">Motion lab</a>
            <a href="#/shape">Shape system</a>
            <a href="#/apps/music">Applications</a>
          </div>
        </div>
        <div>
          <div class="site-footer__col-title">System</div>
          <div class="site-footer__links">
            <a href="#/type">Typography</a>
            <a href="#/foundations">Design tokens</a>
            <a href="#/foundations#accessibility">Accessibility</a>
            <a href="#/foundations#motion-tokens">Motion tokens</a>
            <button type="button" class="site-footer__links" data-action="open-search" style="font-size:.8125rem;color:var(--on-surface-variant);text-align:left">Search <span class="kbd" style="margin-left:4px">⌘K</span></button>
          </div>
        </div>
      </div>
      <div class="site-footer__bottom">
        <p>An independent expressive design study. Material is a trademark of Google LLC. Not affiliated with Google.</p>
        <div class="site-footer__bottom-links">
          <a href="#/foundations">Tokens</a>
          <a href="#/overview">Top</a>
          <span>MMXXVI</span>
        </div>
      </div>
      <div class="site-footer__word" aria-hidden="true">Material Expressive</div>
    </div>
  </footer>`;
}

export function buildSearchIndex() {
  const index = [
    { title: 'Overview', desc: 'A more expressive way to interact', type: 'Page', icon: 'house', route: '#/overview', keywords: 'home hero material design' },
    { title: 'Component playground', desc: 'Buttons, cards, navigation, selection, dialogs, fields', type: 'Page', icon: 'blocks', route: '#/components/buttons', keywords: 'playground kit' },
    { title: 'Color studio', desc: 'Dynamic color, tonal palettes and color roles', type: 'Page', icon: 'palette', route: '#/color', keywords: 'palette seed hue tone dynamic theme' },
    { title: 'Motion lab', desc: 'Springs, shared transitions and choreography', type: 'Page', icon: 'activity', route: '#/motion', keywords: 'animation spring physics transition' },
    { title: 'Shape system', desc: 'Expressive geometry and corner controls', type: 'Page', icon: 'shapes', route: '#/shape', keywords: 'radius squircle cookie morph corner' },
    { title: 'Typography studio', desc: 'Google Sans Flex variable type specimen', type: 'Page', icon: 'type', route: '#/type', keywords: 'font weight width optical size display headline' },
    { title: 'Applications', desc: 'Five complete expressive interfaces', type: 'Page', icon: 'layout-grid', route: '#/apps/music', keywords: 'music weather notes smart home tasks app' },
    { title: 'Foundations', desc: 'Tokens, elevation, state layers and accessibility', type: 'Page', icon: 'book-open', route: '#/foundations', keywords: 'design tokens principles system spacing elevation' },
    { title: 'Search', desc: 'Find any component, page or token', type: 'Action', icon: 'search', route: '#/overview', keywords: 'find command palette' },
    { title: 'English', desc: 'Switch the interface language to English', type: 'Language', icon: 'languages', action: 'set-language', language: 'en', route: '#/overview', keywords: 'language english en switch locale' },
    { title: 'Русский', desc: 'Переключить язык интерфейса на русский', type: 'Language', icon: 'languages', action: 'set-language', language: 'ru', route: '#/overview', keywords: 'язык русский ru language locale' },
    { title: 'Toggle light / dark theme', desc: 'Preview the entire system in another mode', type: 'Action', icon: 'sun-moon', action: 'toggle-theme', keywords: 'dark light mode theme appearance' },
  ];

  for (const category of COMPONENT_CATEGORIES) {
    index.push({
      title: category.name,
      desc: category.desc,
      type: 'Component',
      icon: category.icon,
      route: `#/components/${category.id}`,
      keywords: `${category.name} components ui ${category.id}`,
    });
  }

  const componentEntries = [
    ['Buttons', 'Filled, tonal, outlined, text, FAB and extended FAB', 'mouse-pointer-2', '#/components/buttons', 'button filled tonal outlined text fab extended action'],
    ['Cards', 'Elevated, filled, outlined and expressive cards', 'layers', '#/components/cards', 'card container elevation filled outlined expressive'],
    ['Navigation bar & rail', 'Adaptive navigation patterns', 'panel-left', '#/components/navigation', 'navigation rail bar drawer tab'],
    ['Switches', 'Tactile on / off controls', 'toggle-right', '#/components/selection', 'switch toggle selection'],
    ['Slider', 'Continuous values with expressive handles', 'sliders-horizontal', '#/components/selection', 'range slider value'],
    ['Chips', 'Filter, assist and input chips', 'badge-check', '#/components/selection', 'chip filter assist input'],
    ['Dialogs', 'Basic, confirmation and full-screen dialogs', 'app-window', '#/components/dialogs', 'modal dialog confirmation fullscreen'],
    ['Text fields', 'Filled and outlined input', 'text-cursor-input', '#/components/fields', 'text field input form label'],
  ];
  for (const [title, desc, iconName, route, keywords] of componentEntries) {
    index.push({ title, desc, type: 'Component', icon: iconName, route, keywords });
  }

  for (const app of APPS) {
    index.push({
      title: `${app.name} — ${app.kind}`,
      desc: app.desc,
      type: 'Application',
      icon: app.icon,
      route: `#/apps/${app.id}`,
      keywords: `app demo ${app.kind} ${app.name} ${app.id}`,
    });
  }

  for (const palette of PALETTES) {
    index.push({
      title: `${palette.name} palette`,
      desc: `${palette.seed} · ${tr(palette.note)}`,
      type: 'Palette',
      icon: 'droplet',
      action: 'set-palette',
      palette: palette.id,
      route: '#/color',
      keywords: `color palette seed ${palette.name} ${palette.seed}`,
    });
  }

  return index;
}