/* ============================================================
   Color Studio — dynamic color, roles, tonal scales and previews
   ============================================================ */

import {
  COLOR_ROLES,
  PALETTES,
  getRoles,
  getTonalPalettes,
  normalizeHex,
  paletteById,
  resolveSeed,
  resolveTheme,
} from '../color.js';
import { pageHead } from '../shared.js';
import { tr } from '../i18n.js';
import { getState, setCustomSeed, subscribe } from '../state.js';
import {
  $, $$, contrastGrade, copyText, icon, refreshIcons, toast, wcagContrast,
} from '../utils.js';

let unsubState = null;

const SURPRISE = ['#4E5B8E', '#2F6B52', '#A34B2D', '#2C5F8A', '#7C5A0E', '#8B4555', '#4B5D4F', '#6A4B7A', '#376C6A', '#8A5A2E', '#5B4D8A', '#87534B'];

function textOn(hex) {
  const value = hex.replace('#', '');
  const channels = [0, 2, 4].map((i) => parseInt(value.slice(i, i + 2), 16) / 255);
  const linear = channels.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  const luminance = 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
  return luminance > 0.52 ? '#1b1b1f' : '#ffffff';
}

function gradeChip(ratio) {
  const grade = contrastGrade(ratio);
  return `<span class="contrast-chip contrast-chip--${grade.tone}">${tr(grade.label)} · ${ratio.toFixed(1)}:1</span>`;
}

function renderAccentRoles(roles) {
  const [primary, primaryContainer, secondary, secondaryContainer, tertiary, tertiaryContainer] = COLOR_ROLES;
  const cards = [
    { role: primary, cls: 'role-card--hero', extra: `<span class="role-card__glyph">Aa</span>` },
    { role: primaryContainer, cls: '', extra: `<span class="role-card__glyph">Aa</span>` },
    { role: secondary, cls: '', extra: `<span class="role-card__glyph">Aa</span>` },
    { role: secondaryContainer, cls: '', extra: `<span class="role-card__glyph">Aa</span>` },
    { role: tertiary, cls: '', extra: `<span class="role-card__glyph">Aa</span>` },
    { role: tertiaryContainer, cls: '', extra: `<span class="role-card__glyph">Aa</span>` },
  ];
  return cards.map(({ role, cls, extra }) => {
    const background = roles[role.key];
    const foreground = roles[role.on];
    const ratio = wcagContrast(background, foreground);
    return `<button type="button" class="role-card ${cls}" style="--role-bg:${background};--role-fg:${foreground}" data-copy-hex="${background}" aria-label="${tr('Copy')} ${tr(role.name)} ${background}">
      <span class="role-card__head"><span>${tr(role.name)}</span>${gradeChip(ratio)}</span>
      ${extra}
      <span class="role-card__foot"><span>${background.toUpperCase()}</span>${icon('copy')}</span>
    </button>`;
  }).join('');
}

function renderSurfaceBoard(roles) {
  const surfaceRoles = [
    ['Surface', 'surface'],
    ['Surface container lowest', 'surfaceContainerLowest'],
    ['Surface container low', 'surfaceContainerLow'],
    ['Surface container', 'surfaceContainer'],
    ['Surface container high', 'surfaceContainerHigh'],
    ['Surface container highest', 'surfaceContainerHighest'],
  ];
  const otherRoles = [
    { key: 'outline', on: 'surface', name: 'Outline', desc: 'Borders & boundaries' },
    { key: 'outlineVariant', on: 'surface', name: 'Outline variant', desc: 'Quiet dividers' },
    { key: 'error', on: 'onError', name: 'Error', desc: 'Critical feedback' },
    { key: 'onSurfaceVariant', on: 'surface', name: 'On surface variant', desc: 'Supporting text' },
  ];
  return `<div class="surface-board">
    <div class="surface-stack" role="list" aria-label="${tr('Surface container tones')}">
      ${surfaceRoles.map(([label, key]) => `<button type="button" class="surface-swatch" role="listitem" style="background:${roles[key]};color:${textOn(roles[key])}" data-copy-hex="${roles[key]}" aria-label="${tr('Copy')} ${tr(label)} ${roles[key]}">
        <span>${tr(label)}</span><span class="mono">${roles[key].toUpperCase()}</span>
      </button>`).join('')}
    </div>
    <div class="role-mini-grid">
      ${otherRoles.map((role) => {
        const bg = roles[role.key];
        const fg = roles[role.on];
        const ratio = wcagContrast(bg, fg);
        return `<button type="button" class="role-mini" style="--role-bg:${bg};--role-fg:${fg}" data-copy-hex="${bg}" aria-label="${tr('Copy')} ${tr(role.name)} ${bg}">
          <span class="role-mini__dot" style="background:${bg}"></span>
          <span class="role-mini__text"><strong>${tr(role.name)}</strong><span>${tr(role.desc)}</span></span>
          <span class="role-mini__hex mono">${bg.toUpperCase()}</span>
          ${gradeChip(ratio)}
        </button>`;
      }).join('')}
    </div>
  </div>`;
}

function renderTonalTables(seed, mode) {
  const palettes = getTonalPalettes(seed, mode);
  const entries = ['primary', 'secondary', 'tertiary', 'neutral', 'neutralVariant', 'error'];
  return entries.map((key) => {
    const palette = palettes[key];
    return `<div class="tonal-row">
      <div class="tonal-row__label">
        <span class="tonal-row__index mono">${palette.hue ? Math.round(palette.hue) + '°' : '—'}</span>
        <strong>${tr(palette.label)}</strong>
      </div>
      <div class="tonal-strip">
        ${palette.tones.map(({ tone, hex }) => `<button type="button" class="tonal-cell" style="background:${hex};color:${textOn(hex)}" data-copy-hex="${hex}" aria-label="${tr('Copy')} ${tr(palette.label)} ${tone} ${hex}">
          <span class="tonal-cell__tone">${tone}</span>
          <span class="tonal-cell__hex">${hex.slice(1)}</span>
        </button>`).join('')}
      </div>
    </div>`;
  }).join('');
}

function renderContrast(roles) {
  const pairs = [
    ['onPrimary', 'primary', 'On primary'],
    ['onPrimaryContainer', 'primaryContainer', 'On primary container'],
    ['onSecondary', 'secondary', 'On secondary'],
    ['onSecondaryContainer', 'secondaryContainer', 'On secondary container'],
    ['onTertiary', 'tertiary', 'On tertiary'],
    ['onSurface', 'surface', 'On surface'],
    ['onSurfaceVariant', 'surface', 'On surface variant'],
    ['onError', 'error', 'On error'],
  ];
  return pairs.map(([fgKey, bgKey, label]) => {
    const ratio = wcagContrast(roles[bgKey], roles[fgKey]);
    const grade = contrastGrade(ratio);
    return `<div class="contrast-row" style="background:${roles[bgKey]}">
      <span style="color:${roles[fgKey]}">${tr(label)}</span>
      <span class="contrast-row__sample" style="color:${roles[fgKey]}">Aa</span>
      <span class="contrast-row__meta"><span class="mono">${ratio.toFixed(2)}:1</span><span class="contrast-chip contrast-chip--${grade.tone}">${tr(grade.label)}</span></span>
    </div>`;
  }).join('');
}

function renderPreview(roles) {
  return `<div class="color-preview" style="background:${roles.surface};color:${roles.onSurface}">
    <div class="color-preview__bar" style="background:${roles.surfaceContainer};border-color:${roles.outlineVariant}">
      <span class="color-preview__mark" style="background:${roles.primary}"></span>
      <span style="color:${roles.onSurface}">${tr('Atlas')}</span>
      <span class="color-preview__search" style="background:${roles.surfaceContainerHighest};color:${roles.onSurfaceVariant}">${tr('Search')}</span>
      <span class="color-preview__avatar" style="background:${roles.tertiaryContainer};color:${roles.onTertiaryContainer}">AR</span>
    </div>
    <div class="color-preview__body">
      <div class="color-preview__hero" style="background:${roles.primaryContainer};color:${roles.onPrimaryContainer}">
        <div>
          <span class="label-caps" style="color:${roles.onPrimaryContainer};opacity:.65">Tuesday · 18:40</span>
          <h3>${tr('Good evening, Alex')}</h3>
          <p>Three surfaces are waiting for you.</p>
        </div>
        <button type="button" class="color-preview__fab" style="background:${roles.primary};color:${roles.onPrimary}" data-preview-action="edit" aria-label="Edit">${icon('plus')}</button>
      </div>
      <div class="color-preview__grid">
        <div class="color-preview__tile" style="background:${roles.surfaceContainerLow};color:${roles.onSurface}">
          <span class="color-preview__tile-icon" style="background:${roles.secondaryContainer};color:${roles.onSecondaryContainer}">${icon('palette')}</span>
          <strong>Palette</strong><span style="color:${roles.onSurfaceVariant}">Iris · 6 tones</span>
        </div>
        <div class="color-preview__tile" style="background:${roles.surfaceContainerLow};color:${roles.onSurface}">
          <span class="color-preview__tile-icon" style="background:${roles.tertiaryContainer};color:${roles.onTertiaryContainer}">${icon('shapes')}</span>
          <strong>Shapes</strong><span style="color:${roles.onSurfaceVariant}">8 expressive presets</span>
        </div>
      </div>
      <div class="color-preview__actions">
        <button type="button" class="md-btn md-btn--filled" style="background:${roles.primary};color:${roles.onPrimary}" data-preview-action="filled">Primary action</button>
        <button type="button" class="md-btn md-btn--tonal" style="background:${roles.secondaryContainer};color:${roles.onSecondaryContainer}" data-preview-action="tonal">Secondary</button>
        <button type="button" class="md-btn md-btn--outlined" style="border-color:${roles.outline};color:${roles.primary}" data-preview-action="outlined">Outlined</button>
      </div>
      <div class="color-preview__chips">
        <span class="md-chip" style="background:${roles.secondaryContainer};color:${roles.onSecondaryContainer};border-color:transparent">${icon('check')}Tonal</span>
        <span class="md-chip" style="border-color:${roles.outlineVariant};color:${roles.onSurfaceVariant}">Expressive</span>
        <span class="md-chip" style="border-color:${roles.outlineVariant};color:${roles.onSurfaceVariant}">Accessible</span>
      </div>
    </div>
  </div>`;
}

function seedPanel(state, palettes) {
  const seed = resolveSeed(state);
  const palette = state.palette === 'custom' ? { id: 'custom', name: 'Custom', note: 'Your own source color.' } : paletteById(state.palette);
  const mode = resolveTheme(state);
  return `<div class="seed-panel">
    <div class="seed-panel__visual" style="background:${seed}">
      <span class="seed-panel__aura" style="background:${seed}"></span>
      <div class="seed-panel__meta">
        <span class="label-caps">Seed color</span>
        <strong>${palette.name}</strong>
        <span class="mono">${seed.toUpperCase()}</span>
      </div>
      <div class="seed-panel__swatch-ring" aria-hidden="true"></div>
      <button type="button" class="seed-panel__random" data-color-random aria-label="Randomize seed color">${icon('dices')}</button>
    </div>
    <div class="seed-panel__controls">
      <div class="seed-panel__row">
        <div>
          <span class="label-caps">Appearance</span>
          <p class="seed-panel__hint">Every role updates in place.</p>
        </div>
        <div class="md-segmented" role="group" aria-label="Appearance">
          <button type="button" data-theme-pref="light" aria-pressed="${state.themePref === 'light'}">${icon('sun')}<span>Light</span></button>
          <button type="button" data-theme-pref="dark" aria-pressed="${state.themePref === 'dark'}">${icon('moon')}<span>Dark</span></button>
          <button type="button" data-theme-pref="system" aria-pressed="${state.themePref === 'system'}">Auto</button>
        </div>
      </div>
      <div class="seed-panel__row">
        <div>
          <span class="label-caps">Custom source</span>
          <p class="seed-panel__hint">Pick any hue — tonal roles are derived with HCT.</p>
        </div>
        <div class="seed-picker">
          <label class="seed-picker__swatch" style="background:${seed}" aria-label="Choose seed color">
            <input type="color" id="seed-color" value="${seed}" aria-label="Seed color">
          </label>
          <input class="seed-picker__hex mono" id="seed-hex" type="text" value="${seed.toUpperCase()}" maxlength="7" aria-label="Seed color hex" spellcheck="false">
          <button type="button" class="md-icon-btn md-icon-btn--outlined" data-color-copy aria-label="${tr('Copy seed color')}">${icon('copy')}</button>
        </div>
      </div>
      <div class="seed-panel__row seed-panel__row--actions">
        <div class="demo-row">
          <button type="button" class="md-btn md-btn--filled" data-color-export>${icon('download')}Export theme</button>
          <button type="button" class="md-btn md-btn--tonal" data-color-css>${icon('code')}Copy CSS</button>
        </div>
        <span class="seed-panel__saved">${icon('check')}Saved locally</span>
      </div>
      <div class="preset-grid">
        ${PALETTES.map((item) => `<button type="button" class="preset-card" data-set-palette="${item.id}" aria-pressed="${state.palette === item.id}">
          <span class="preset-card__swatch" style="background:${item.seed}"></span>
          <span class="preset-card__text"><strong>${item.name}</strong><span>${item.seed.toUpperCase()}</span></span>
          <span class="preset-card__check">${icon('check')}</span>
        </button>`).join('')}
      </div>
      <p class="seed-panel__note">${tr(palette.note)}</p>
    </div>
  </div>`;
}

export function render() {
  unsubState?.();
  unsubState = null;
  const state = getState();
  const mode = resolveTheme(state);
  const seed = resolveSeed(state);
  const roles = getRoles(seed, mode);
  const palettes = getTonalPalettes(seed, mode);
  const palette = state.palette === 'custom' ? { name: 'Custom' } : paletteById(state.palette);

  const html = `<div class="page color-page">
    ${pageHead({
      index: '03',
      kicker: 'Color studio',
      title: 'Color, grown<br>from a seed.',
      lede: 'One source color, mapped into a complete Material tonal system. Change the seed and every role — surfaces, accents, outlines and states — follows with contrast intact.',
      meta: ['HCT color space', '12 tonal stops', 'Dynamic roles', 'WCAG contrast'],
    })}
    <div class="color-studio" id="color-studio">
      <section aria-labelledby="color-source-title">
        <div class="studio-section-head">
          <div>
            <span class="label-caps">01 / Source</span>
            <h2 id="color-source-title">Start with a color you love.</h2>
          </div>
          <p>Material derives a tonal palette from the hue and chroma of your seed, then assigns roles by tone. Surfaces stay neutral; accents keep their voice.</p>
        </div>
        ${seedPanel(state, palettes)}
      </section>

      <section class="color-block" aria-labelledby="color-roles-title">
        <div class="studio-section-head">
          <div>
            <span class="label-caps">02 / Roles</span>
            <h2 id="color-roles-title">Expression, with a job to do.</h2>
          </div>
          <p>Each role has a defined purpose and a paired “on” color. Click any swatch to copy its hex value.</p>
        </div>
        <div class="role-board">
          <div class="accent-roles" id="accent-roles">${renderAccentRoles(roles)}</div>
          <div id="surface-board">${renderSurfaceBoard(roles)}</div>
        </div>
      </section>

      <section class="color-block" aria-labelledby="color-tonal-title">
        <div class="studio-section-head">
          <div>
            <span class="label-caps">03 / Tonal palettes</span>
            <h2 id="color-tonal-title">Twelve tones, one family.</h2>
          </div>
          <p>Every role is sampled from a tonal palette at a defined tone. The same palettes feed light and dark schemes without inventing new colors.</p>
        </div>
        <div class="tonal-wrap">
          <div class="tonal-head">
            <span class="mono">Palette / hue</span>
            <span class="mono">0 → 100 tone</span>
          </div>
          <div id="tonal-tables">${renderTonalTables(seed, mode)}</div>
          <p class="tonal-hint">${icon('mouse-pointer-click')}Click any tone to copy its hex value</p>
        </div>
      </section>

      <section class="color-block color-block--split" aria-labelledby="color-contrast-title">
        <div>
          <div class="studio-section-head studio-section-head--stack">
            <div>
              <span class="label-caps">04 / Contrast</span>
              <h2 id="color-contrast-title">Accessible by default.</h2>
            </div>
            <p>Roles are paired by construction. This is the contrast of the current scheme, measured with WCAG 2.2.</p>
          </div>
          <div class="contrast-grid" id="contrast-rows">${renderContrast(roles)}</div>
        </div>
        <aside class="contrast-note">
          <span class="contrast-note__mark">AA</span>
          <h3>Contrast is a token, not an afterthought.</h3>
          <p>Text roles are assigned against their containers by the color algorithm. If a seed cannot support a legible pair, the tone is adjusted automatically.</p>
          <div class="contrast-note__stats">
            <div><strong>4.5:1</strong><span>minimum body contrast</span></div>
            <div><strong>3:1</strong><span>minimum large text</span></div>
            <div><strong>1</strong><span>source color needed</span></div>
          </div>
          <a class="text-link" href="#/foundations#accessibility">Read the accessibility notes ${icon('arrow-right')}</a>
        </aside>
      </section>

      <section class="color-block" aria-labelledby="color-preview-title">
        <div class="studio-section-head">
          <div>
            <span class="label-caps">05 / In context</span>
            <h2 id="color-preview-title">The whole product, re-tinted.</h2>
          </div>
          <p>A live composition using only the roles above. Switch theme or seed — nothing here is hard-coded.</p>
        </div>
        <div class="preview-wrap" id="color-preview">${renderPreview(roles)}</div>
      </section>
    </div>
  </div>`;

  return {
    title: 'Color Studio',
    html,
    mount(root) {
      const studio = root.querySelector('#color-studio');
      bindStudio(studio);
      unsubState = subscribe(() => refreshStudio(studio));
      refreshStudio(studio);
    },
  };
}

function refreshStudio(studio) {
  if (!studio) return;
  const state = getState();
  const mode = resolveTheme(state);
  const seed = resolveSeed(state);
  const roles = getRoles(seed, mode);

  const accents = studio.querySelector('#accent-roles');
  if (accents) { accents.innerHTML = renderAccentRoles(roles); refreshIcons(accents); }
  const surfaces = studio.querySelector('#surface-board');
  if (surfaces) { surfaces.innerHTML = renderSurfaceBoard(roles); refreshIcons(surfaces); }
  const tonal = studio.querySelector('#tonal-tables');
  if (tonal) { tonal.innerHTML = renderTonalTables(seed, mode); refreshIcons(tonal); }
  const contrast = studio.querySelector('#contrast-rows');
  if (contrast) contrast.innerHTML = renderContrast(roles);
  const preview = studio.querySelector('#color-preview');
  if (preview) { preview.innerHTML = renderPreview(roles); refreshIcons(preview); }

  const colorInput = studio.querySelector('#seed-color');
  if (colorInput && document.activeElement !== colorInput) colorInput.value = seed;
  const hexInput = studio.querySelector('#seed-hex');
  if (hexInput && document.activeElement !== hexInput) hexInput.value = seed.toUpperCase();
  const swatch = studio.querySelector('.seed-picker__swatch');
  if (swatch) swatch.style.background = seed;
  const visual = studio.querySelector('.seed-panel__visual');
  if (visual) visual.style.background = seed;
  const aura = studio.querySelector('.seed-panel__aura');
  if (aura) aura.style.background = seed;
  const seedLabel = studio.querySelector('.seed-panel__meta .mono');
  if (seedLabel) seedLabel.textContent = seed.toUpperCase();
  const seedName = studio.querySelector('.seed-panel__meta strong');
  if (seedName) seedName.textContent = state.palette === 'custom' ? 'Custom' : paletteById(state.palette).name;
  const note = studio.querySelector('.seed-panel__note');
  if (note) note.textContent = state.palette === 'custom' ? tr('Your own source color.') : tr(paletteById(state.palette).note);

  studio.querySelectorAll('[data-theme-pref]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.themePref === state.themePref));
  });
  studio.querySelectorAll('[data-set-palette]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.setPalette === state.palette));
  });
}

function bindStudio(studio) {
  if (!studio) return;
  const colorInput = studio.querySelector('#seed-color');
  let seedFrame = 0;
  colorInput?.addEventListener('input', () => {
    if (seedFrame) return;
    seedFrame = requestAnimationFrame(() => {
      seedFrame = 0;
      setCustomSeed(normalizeHex(colorInput.value));
    });
  });

  const hexInput = studio.querySelector('#seed-hex');
  const applyHex = () => {
    const value = normalizeHex(hexInput.value, resolveSeed(getState()));
    setCustomSeed(value);
    hexInput.value = value.toUpperCase();
  };
  hexInput?.addEventListener('change', applyHex);
  hexInput?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') { event.preventDefault(); applyHex(); hexInput.blur(); }
  });

  studio.querySelector('[data-color-random]')?.addEventListener('click', () => {
    let next = SURPRISE[Math.floor(Math.random() * SURPRISE.length)];
    const current = resolveSeed(getState());
    if (next === current) next = SURPRISE[(SURPRISE.indexOf(next) + 1) % SURPRISE.length];
    setCustomSeed(next);
    toast(`Seed color: ${next.toUpperCase()}`, 'dices');
  });

  studio.querySelector('[data-color-copy]')?.addEventListener('click', () => {
    copyText(resolveSeed(getState()).toUpperCase(), 'Seed color copied');
  });

  studio.querySelector('[data-color-css]')?.addEventListener('click', () => {
    const state = getState();
    const roles = getRoles(resolveSeed(state), resolveTheme(state));
    const lines = Object.entries(roles).map(([key, value]) => `  --md-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`);
    copyText(`:root {\n${lines.join('\n')}\n}`, 'Theme CSS copied');
  });

  studio.querySelector('[data-color-export]')?.addEventListener('click', () => {
    const state = getState();
    const mode = resolveTheme(state);
    const seed = resolveSeed(state);
    const payload = {
      name: state.palette === 'custom' ? 'Custom' : paletteById(state.palette).name,
      seed,
      mode,
      roles: getRoles(seed, mode),
      tonalPalettes: getTonalPalettes(seed, mode),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `material-expressive-${seed.replace('#', '')}-${mode}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    toast('Theme JSON exported', 'download');
  });

  studio.addEventListener('click', (event) => {
    const copyTarget = event.target.closest('[data-copy-hex]');
    if (copyTarget) {
      copyText(copyTarget.dataset.copyHex.toUpperCase(), `Copied ${copyTarget.dataset.copyHex.toUpperCase()}`);
      return;
    }
    const previewAction = event.target.closest('[data-preview-action]');
    if (previewAction) toast(`Preview action: ${previewAction.dataset.previewAction}`, 'sparkles');
  });
}