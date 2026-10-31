/* ============================================================
   Foundations — token reference, scales and accessibility
   ============================================================ */

import { pageHead } from '../shared.js';
import { getRoles, resolveSeed, resolveTheme } from '../color.js';
import { getState, subscribe } from '../state.js';
import {
  $, $$, contrastGrade, copyText, icon, refreshIcons, toast, wcagContrast,
} from '../utils.js';
import { isRussian, tr } from '../i18n.js';

const SHAPE_TOKENS = [
  ['--r-xs', '8px', 'Inputs · small badges'],
  ['--r-sm', '12px', 'Chips · compact fields'],
  ['--r-md', '16px', 'Text fields · menus'],
  ['--r-lg', '22px', 'Buttons · list items'],
  ['--r-xl', '28px', 'Cards · panels'],
  ['--r-2xl', '36px', 'Sheets · feature blocks'],
  ['--r-3xl', '48px', 'Hero surfaces'],
  ['--r-full', '999px', 'Pills · switches'],
];

const SPACING_TOKENS = [
  ['--s-1', 4], ['--s-2', 8], ['--s-3', 12], ['--s-4', 16],
  ['--s-5', 20], ['--s-6', 24], ['--s-8', 32], ['--s-10', 40],
  ['--s-12', 48], ['--s-16', 64], ['--s-24', 96], ['--s-32', 128],
];

const TYPE_TOKENS = [
  ['--font-sans', 'Google Sans Flex', 'Display · body · labels'],
  ['--font-mono', 'Google Sans Code', 'Data · code · metadata'],
  ['--tracking-display', '−0.045em', 'Display tracking'],
  ['--tracking-headline', '−0.032em', 'Headline tracking'],
  ['--tracking-title', '−0.02em', 'Title tracking'],
  ['--tracking-body', '−0.006em', 'Body tracking'],
  ['--tracking-label', '0.08em', 'Label tracking'],
];

const MOTION_TOKENS = [
  ['--dur-1', '80ms', 'Micro feedback'],
  ['--dur-2', '140ms', 'Hover · state change'],
  ['--dur-3', '220ms', 'Small enter · exit'],
  ['--dur-4', '320ms', 'Container transform'],
  ['--dur-5', '450ms', 'Expressive reveal'],
  ['--dur-6', '620ms', 'Choreographed sequences'],
  ['--ease-standard', 'cubic-bezier(.2, 0, 0, 1)', 'Default spatial easing'],
  ['--ease-spring-soft', 'linear(…)', 'Spring-like bounce'],
  ['--ease-emphasized', 'cubic-bezier(.2, .9, .2, 1.06)', 'Expressive emphasis'],
];

const ELEVATIONS = [
  ['--elev-0', 'Flat', 'Inline content and quiet grouping.'],
  ['--elev-1', 'Raised', 'Cards and list items at rest.'],
  ['--elev-2', 'Floating', 'Hovered cards and FABs.'],
  ['--elev-3', 'Overlay', 'Menus and popovers.'],
  ['--elev-4', 'Dialog', 'Modal surfaces.'],
  ['--elev-5', 'Featured', 'Rare, high-emphasis moments.'],
];

const COLOR_ROLE_ROWS = [
  ['primary', '--md-primary', 'High-emphasis actions'],
  ['onPrimary', '--md-on-primary', 'Text on primary'],
  ['primaryContainer', '--md-primary-container', 'Expressive surfaces'],
  ['onPrimaryContainer', '--md-on-primary-container', 'Text on container'],
  ['secondaryContainer', '--md-secondary-container', 'Selected · tonal'],
  ['tertiary', '--md-tertiary', 'Delight · contrast'],
  ['tertiaryContainer', '--md-tertiary-container', 'Playful surfaces'],
  ['surface', '--md-surface', 'Page foundation'],
  ['surfaceContainer', '--md-surface-container', 'Grouping tone'],
  ['onSurface', '--md-on-surface', 'Primary text'],
  ['onSurfaceVariant', '--md-on-surface-variant', 'Secondary text'],
  ['outline', '--md-outline', 'Essential boundaries'],
  ['outlineVariant', '--md-outline-variant', 'Decorative dividers'],
  ['error', '--md-error', 'Critical feedback'],
];

const CONTRAST_PAIRS = [
  ['primary', 'onPrimary', 'Primary'],
  ['primaryContainer', 'onPrimaryContainer', 'Primary container'],
  ['tertiaryContainer', 'onTertiaryContainer', 'Tertiary container'],
  ['surface', 'onSurface', 'Surface'],
  ['surfaceContainer', 'onSurfaceVariant', 'Surface container'],
  ['error', 'onError', 'Error'],
];

function rolesNow() {
  return getRoles(resolveSeed(getState()), resolveTheme(getState()));
}

function colorRowsHTML(roles) {
  return COLOR_ROLE_ROWS.map(([role, token, use]) => `<div class="token-browser__row" data-token-category="color" data-token-row data-color-row="${role}">
    <span class="token-swatch" style="background:${roles[role]}" data-color-swatch="${role}"></span>
    <span class="token-name mono">${token}</span>
    <span class="token-value mono" data-color-value="${role}">${roles[role]}</span>
    <span class="token-preview">${use}</span>
  </div>`).join('');
}

function shapeRowsHTML() {
  return SHAPE_TOKENS.map(([token, value, use]) => `<div class="token-browser__row" data-token-category="shape" data-token-row>
    <span class="token-shape-preview" style="border-radius:${value}"></span>
    <span class="token-name mono">${token}</span>
    <span class="token-value mono">${value}</span>
    <span class="token-preview">${use}</span>
  </div>`).join('');
}

function spacingRowsHTML() {
  return SPACING_TOKENS.map(([token, value]) => `<div class="token-browser__row" data-token-category="space" data-token-row>
    <span class="token-space-preview" style="width:${Math.max(3, value / 1.6)}px"></span>
    <span class="token-name mono">${token}</span>
    <span class="token-value mono">${value}px</span>
    <span class="token-preview">${value <= 16 ? 'Component rhythm' : value <= 48 ? 'Layout gaps' : 'Section spacing'}</span>
  </div>`).join('');
}

function typeRowsHTML() {
  return TYPE_TOKENS.map(([token, value, use]) => `<div class="token-browser__row" data-token-category="type" data-token-row>
    <span class="token-type-preview" style="${token.includes('font') ? 'font-family:var(--font-mono);font-size:9px' : 'font-family:var(--font-mono);font-size:8px'}">Aa</span>
    <span class="token-name mono">${token}</span>
    <span class="token-value mono">${value}</span>
    <span class="token-preview">${use}</span>
  </div>`).join('');
}

function motionRowsHTML() {
  return MOTION_TOKENS.map(([token, value, use]) => `<div class="token-browser__row" data-token-category="motion" data-token-row>
    <span class="token-motion-preview"><span style="${token.startsWith('--dur') ? `animation-duration:${value}` : 'animation-duration:450ms'}"></span></span>
    <span class="token-name mono">${token}</span>
    <span class="token-value mono">${value}</span>
    <span class="token-preview">${use}</span>
  </div>`).join('');
}

function elevationRowsHTML() {
  return ELEVATIONS.map(([token, name, use], index) => `<div class="token-browser__row" data-token-category="elevation" data-token-row>
    <span class="token-elevation-preview" style="box-shadow:var(${token})"></span>
    <span class="token-name mono">${token}</span>
    <span class="token-value mono">level ${index}</span>
    <span class="token-preview">${name} · ${use}</span>
  </div>`).join('');
}

export function render() {
  const roles = rolesNow();
  const state = getState();
  const seed = resolveSeed(state);

  const html = `<div class="page foundations-page">
    ${pageHead({
      index: '08',
      kicker: 'Foundations',
      title: 'The system beneath<br> the surface.',
      lede: 'A design system is not a component library. It is a set of decisions small enough to reuse and strong enough to survive context. These are the tokens that make Material Expressive feel like one product.',
      meta: ['3 token layers', '56 live values', 'Live contrast', 'WCAG AA'],
    })}

    <section class="foundation-layers" aria-labelledby="foundation-layers-title">
      <div class="studio-section-head">
        <div>
          <span class="label-caps">01 / Architecture</span>
          <h2 id="foundation-layers-title">Three layers, one truth.</h2>
        </div>
        <p>Reference tokens hold raw values. System tokens assign meaning. Component tokens make a local decision without inventing a new language.</p>
      </div>
      <div class="layer-diagram">
        <article class="layer-card layer-card--reference">
          <span class="layer-card__index mono">L0</span>
          <div class="layer-card__head"><span class="demo-label">Reference</span><span class="tag">raw</span></div>
          <h3>Values without opinion.</h3>
          <div class="layer-card__code mono">#6750A4 · 28px · 450ms · 1.5rem</div>
          <div class="layer-card__swatches" aria-hidden="true">
            ${['#6750A4', '#E9DDFF', '#2F6B52', '#A34B2D', '#2C5F8A', '#8B4555'].map((color) => `<span style="background:${color}"></span>`).join('')}
          </div>
        </article>
        <span class="layer-arrow" aria-hidden="true">${icon('arrow-right')}</span>
        <article class="layer-card layer-card--system">
          <span class="layer-card__index mono">L1</span>
          <div class="layer-card__head"><span class="demo-label">System</span><span class="tag">semantic</span></div>
          <h3>Values with a job.</h3>
          <div class="layer-card__code mono">--md-primary<br>--r-xl<br>--dur-5</div>
          <div class="layer-card__pills"><span class="tag tag--tonal">primary</span><span class="tag">surface</span><span class="tag">outline</span></div>
        </article>
        <span class="layer-arrow" aria-hidden="true">${icon('arrow-right')}</span>
        <article class="layer-card layer-card--component">
          <span class="layer-card__index mono">L2</span>
          <div class="layer-card__head"><span class="demo-label">Component</span><span class="tag">local</span></div>
          <h3>Values in context.</h3>
          <div class="layer-card__code mono">--btn-bg<br>--card-radius<br>--sheet-enter</div>
          <button type="button" class="md-btn md-btn--filled md-btn--sm layer-card__button" data-foundation-demo>${icon('pointer')}Try the token</button>
        </article>
      </div>
    </section>

    <section class="foundation-browser-section" aria-labelledby="foundation-browser-title">
      <div class="studio-section-head">
        <div>
          <span class="label-caps">02 / Token browser</span>
          <h2 id="foundation-browser-title">Look under the hood.</h2>
        </div>
        <p>Filter the live dictionary. Color values follow the current seed and theme; everything else is the actual token used by this site.</p>
      </div>
      <div class="token-browser">
        <div class="token-browser__toolbar">
          <div class="token-browser__tabs" role="tablist" aria-label="Token categories">
            ${[
              ['all', 'All'], ['color', 'Color'], ['shape', 'Shape'], ['type', 'Type'],
              ['space', 'Space'], ['elevation', 'Elevation'], ['motion', 'Motion'],
            ].map(([id, label], index) => `<button type="button" role="tab" class="token-browser__tab" data-token-tab="${id}" aria-selected="${index === 0}">${label}<span>${id === 'all' ? '56' : id === 'color' ? '14' : id === 'shape' ? '8' : id === 'type' ? '7' : id === 'space' ? '12' : id === 'elevation' ? '6' : '9'}</span></button>`).join('')}
          </div>
          <div class="token-browser__actions">
            <label class="md-field md-field--compact md-field--outlined token-search">
              <input type="search" placeholder="Filter tokens" id="token-search" aria-label="Filter tokens">
              ${icon('search')}
            </label>
            <button type="button" class="md-btn md-btn--tonal md-btn--sm" id="copy-tokens">${icon('copy')}Copy CSS</button>
          </div>
        </div>
        <div class="token-browser__head" aria-hidden="true"><span></span><span>Token</span><span>Value</span><span>Applied to</span></div>
        <div class="token-browser__body" id="token-browser-body" role="tabpanel">
          ${colorRowsHTML(roles)}
          ${shapeRowsHTML()}
          ${spacingRowsHTML()}
          ${typeRowsHTML()}
          ${elevationRowsHTML()}
          ${motionRowsHTML()}
        </div>
        <div class="token-browser__empty" id="token-empty" hidden>No tokens match that filter.</div>
        <div class="token-browser__foot">
          <span class="mono" id="token-count">${tr('56 tokens · seed')} ${seed}</span>
          <span class="muted">Every row is a live custom property.</span>
        </div>
      </div>
    </section>

    <section class="foundation-section" aria-labelledby="foundation-scales-title">
      <div class="studio-section-head">
        <div>
          <span class="label-caps">03 / Scales</span>
          <h2 id="foundation-scales-title">Rhythm you can feel.</h2>
        </div>
        <p>Spacing, shape and type are tuned together. A 4-point spacing grid and a seven-stop shape scale keep unrelated screens on speaking terms.</p>
      </div>
      <div class="scale-duo">
        <article class="scale-card">
          <div class="scale-card__head"><span class="demo-label">Spacing scale</span><span class="mono">4 → 128 px</span></div>
          <div class="spacing-scale">
            ${SPACING_TOKENS.map(([token, value]) => `<div class="spacing-row"><span class="mono">${token}</span><span class="spacing-bar" style="width:calc(${value} / 128 * 100%)"></span><span class="mono">${value}</span></div>`).join('')}
          </div>
        </article>
        <article class="scale-card">
          <div class="scale-card__head"><span class="demo-label">Shape scale</span><span class="mono">8 → 48 px</span></div>
          <div class="shape-scale">
            ${SHAPE_TOKENS.slice(0, 7).map(([token, value]) => `<div class="shape-scale__item"><span style="border-radius:${value}"></span><span class="mono">${token.replace('--r-', '')}</span><small>${value}</small></div>`).join('')}
          </div>
        </article>
      </div>
    </section>

    <section class="foundation-section" aria-labelledby="foundation-elevation-title">
      <div class="studio-section-head">
        <div>
          <span class="label-caps">04 / Elevation</span>
          <h2 id="foundation-elevation-title">Depth without drama.</h2>
        </div>
        <p>Elevation is a hierarchy cue, not a decoration budget. Each level adds a little more separation and a little more responsibility.</p>
      </div>
      <div class="elevation-row">
        ${ELEVATIONS.map(([token, name, use], index) => `<article class="elevation-card" style="box-shadow:var(${token})">
          <span class="elevation-card__level mono">0${index}</span>
          <div><strong>${name}</strong><span class="mono">${token}</span></div>
          <p>${use}</p>
        </article>`).join('')}
      </div>
    </section>

    <section class="foundation-section" aria-labelledby="foundation-state-title">
      <div class="studio-section-head">
        <div>
          <span class="label-caps">05 / Interaction</span>
          <h2 id="foundation-state-title">Feedback is a material.</h2>
        </div>
        <p>State layers are translucent overlays, not color changes. They preserve the surface underneath while making interaction visible and measurable.</p>
      </div>
      <div class="state-lab">
        <div class="state-lab__stage">
          <button type="button" class="state-lab__target" id="state-target">${icon('hand-pointer')}<span>Hover, focus or press</span></button>
        </div>
        <div class="state-lab__legend">
          ${[
            ['Hover', '8%', '0.08'],
            ['Focus', '10%', '0.1'],
            ['Pressed', '10%', '0.1'],
            ['Dragged', '16%', '0.16'],
          ].map(([label, percent, value], index) => `<div class="state-layer-row">
            <span class="state-layer-swatch" style="--layer-opacity:${value}"></span>
            <span><strong>${label}</strong><span class="mono">opacity ${percent}</span></span>
            <span class="state-layer-bar"><span style="width:${Number(value) * 500}%"></span></span>
          </div>`).join('')}
        </div>
      </div>
    </section>

    <section class="foundation-section" id="accessibility" aria-labelledby="foundation-a11y-title">
      <div class="studio-section-head">
        <div>
          <span class="label-caps">06 / Accessibility</span>
          <h2 id="foundation-a11y-title">Contrast is a feature.</h2>
        </div>
        <p>These ratios come from the live palette. They are computed, not asserted. If a palette cannot carry text at AA, it is not ready to ship.</p>
      </div>
      <div class="a11y-lab">
        <div class="contrast-board" id="contrast-board">
          ${CONTRAST_PAIRS.map(([bgRole, fgRole, label]) => {
            const ratio = wcagContrast(roles[bgRole], roles[fgRole]);
            const grade = contrastGrade(ratio);
            return `<div class="contrast-pair" data-contrast-pair data-bg="${bgRole}" data-fg="${fgRole}">
              <span class="contrast-pair__sample" style="background:${roles[bgRole]};color:${roles[fgRole]}"><strong>Aa</strong><span>${label}</span></span>
              <div class="contrast-pair__meta"><span><strong class="mono" data-contrast-ratio>${ratio.toFixed(2)}</strong><span class="contrast-grade contrast-grade--${grade.tone}" data-contrast-grade>${grade.label}</span></span><span class="mono">${bgRole} / ${fgRole}</span></div>
            </div>`;
          }).join('')}
        </div>
        <aside class="a11y-notes">
          <span class="demo-label">The non-negotiables</span>
          <ul>
            ${[
              ['focus', 'Visible focus on every interactive element'],
              ['touchpad', 'Touch targets of at least 48 × 48 px'],
              ['keyboard', 'Full keyboard path, logical order'],
              ['eye', 'AA contrast for text, 3:1 for large text'],
              ['activity', 'Reduced motion respected at the system level'],
              ['volume-2', 'Live regions announce asynchronous change'],
            ].map(([iconName, text]) => `<li>${icon(iconName)}<span>${text}</span>${icon('check')}</li>`).join('')}
          </ul>
          <div class="a11y-target"><span class="a11y-target__box">48</span><span>Minimum target<br><small class="mono">48 × 48 px</small></span></div>
        </aside>
      </div>
    </section>

    <section class="foundation-section" id="motion-tokens" aria-labelledby="foundation-motion-title">
      <div class="studio-section-head">
        <div>
          <span class="label-caps">07 / Motion</span>
          <h2 id="foundation-motion-title">Time, with intention.</h2>
        </div>
        <p>Durations are short enough to feel immediate and long enough to be understood. Easings carry personality without postponing the task.</p>
      </div>
      <div class="motion-token-list">
        ${MOTION_TOKENS.slice(0, 6).map(([token, value, use], index) => `<div class="motion-token">
          <span class="mono">${token}</span>
          <span class="motion-token__track"><span class="motion-token__fill" style="--i:${index}"></span></span>
          <span class="mono">${value}</span>
          <span class="muted">${use}</span>
        </div>`).join('')}
      </div>
    </section>

    <section class="foundation-principles">
      <article class="principle-card principle-card--wide">
        <span class="label-caps">Principle 01</span>
        <h2>One source,<br>many surfaces.</h2>
        <p>A token is a promise that two screens will agree. Change the seed, and every role — from a switch track to a dialog scrim — moves together.</p>
        <div class="principle-card__swatches">${['primary', 'secondaryContainer', 'tertiary', 'surfaceContainer', 'outline'].map((role) => `<span style="background:${roles[role]}"></span>`).join('')}</div>
      </article>
      <article class="principle-card">
        <span class="label-caps">Principle 02</span>
        <h2>Contrast before character.</h2>
        <p>A palette earns its personality only after it can carry text, icons and states without apology.</p>
      </article>
      <article class="principle-card principle-card--accent">
        <span class="label-caps">Principle 03</span>
        <h2>Motion respects attention.</h2>
        <p>Animation should clarify cause and effect. When attention is limited, the system becomes still — not slower.</p>
      </article>
      <div class="principle-card principle-card--cta">
        <span class="label-caps">Take it with you</span>
        <p class="principle-card__big">The whole system is copyable.</p>
        <div class="demo-row">
          <button type="button" class="md-btn md-btn--filled" id="copy-all-tokens">${icon('braces')}Copy all tokens</button>
          <a class="md-btn md-btn--outlined" href="#/color">${icon('palette')}Tune the palette</a>
        </div>
      </div>
    </section>

    <section class="foundation-cta">
      <div>
        <span class="eyebrow"><span class="eyebrow-dot"></span>${isRussian() ? 'Следующий шаг' : 'Next step'}</span>
        <h2>See the tokens<br>in motion.</h2>
        <p>Components are tokens with a job. Visit the playground and watch the system respond.</p>
      </div>
      <div class="foundation-cta__actions">
        <a class="md-btn md-btn--filled md-btn--lg" href="#/components/buttons">${icon('blocks')}Open components</a>
        <a class="md-btn md-btn--text md-btn--lg" href="#/motion">${icon('activity')}Visit motion lab</a>
      </div>
    </section>
  </div>`;

  return {
    title: 'Foundations — Design Tokens',
    html,
    mount(root) {
      mountBrowser(root);
      const cleanup = mountLiveColors(root);
      root.querySelectorAll('[data-foundation-demo]').forEach((button) => {
        button.addEventListener('click', () => {
          button.animate([
            { transform: 'scale(1)' },
            { transform: 'scale(0.94)' },
            { transform: 'scale(1)' },
          ], { duration: 260, easing: 'cubic-bezier(0.34, 1.48, 0.64, 1)' });
          toast('Component token applied locally', 'braces');
        });
      });
      root.querySelector('#state-target')?.addEventListener('click', () => toast('State layer at 10%', 'hand-pointer'));
      return cleanup;
    },
  };
}

function mountBrowser(root) {
  let activeCategory = 'all';
  let query = '';
  const body = root.querySelector('#token-browser-body');
  const empty = root.querySelector('#token-empty');
  const count = root.querySelector('#token-count');

  const applyFilter = () => {
    if (!body) return;
    const term = query.trim().toLowerCase();
    let visible = 0;
    body.querySelectorAll('[data-token-row]').forEach((row) => {
      const matchesCategory = activeCategory === 'all' || row.dataset.tokenCategory === activeCategory;
      const matchesQuery = !term || row.textContent.toLowerCase().includes(term);
      row.hidden = !(matchesCategory && matchesQuery);
      if (!row.hidden) visible += 1;
    });
    if (empty) empty.hidden = visible !== 0;
    if (count) count.textContent = `${visible} ${tr('tokens')} · ${tr('seed')} ${resolveSeed(getState())}`;
  };

  root.querySelectorAll('[data-token-tab]').forEach((tab) => {
    tab.addEventListener('click', () => {
      activeCategory = tab.dataset.tokenTab;
      root.querySelectorAll('[data-token-tab]').forEach((item) => item.setAttribute('aria-selected', String(item === tab)));
      applyFilter();
    });
  });
  root.querySelectorAll('.token-browser__tabs').forEach((group) => {
    group.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      const tabs = $$('[data-token-tab]', group);
      const current = tabs.indexOf(document.activeElement);
      if (current < 0) return;
      event.preventDefault();
      const target = tabs[(current + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
      target.focus();
      target.click();
    });
  });

  root.querySelector('#token-search')?.addEventListener('input', (event) => {
    query = event.target.value;
    applyFilter();
  });

  root.querySelector('#copy-tokens')?.addEventListener('click', () => {
    const roles = rolesNow();
    const lines = [];
    for (const [role, token] of COLOR_ROLE_ROWS) lines.push(`  ${token}: ${roles[role]};`);
    for (const [token, value] of SHAPE_TOKENS) lines.push(`  ${token}: ${value};`);
    for (const [token, value] of SPACING_TOKENS) lines.push(`  ${token}: ${value}px;`);
    for (const [token, value] of MOTION_TOKENS) lines.push(`  ${token}: ${value};`);
    for (const [token] of ELEVATIONS) {
      const value = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
      lines.push(`  ${token}: ${value};`);
    }
    copyText(`:root {\n${lines.join('\n')}\n}`, 'Token CSS copied');
  });

  root.querySelector('#copy-all-tokens')?.addEventListener('click', () => {
    const roles = rolesNow();
    const data = {
      seed: resolveSeed(getState()),
      mode: resolveTheme(getState()),
      color: Object.fromEntries(COLOR_ROLE_ROWS.map(([role, token]) => [token, roles[role]])),
      shape: Object.fromEntries(SHAPE_TOKENS.map(([token, value]) => [token, value])),
      spacing: Object.fromEntries(SPACING_TOKENS.map(([token, value]) => [token, `${value}px`])),
      motion: Object.fromEntries(MOTION_TOKENS.map(([token, value]) => [token, value])),
    };
    copyText(JSON.stringify(data, null, 2), 'Token JSON copied');
  });

  applyFilter();
}

function mountLiveColors(root) {
  const update = () => {
    const roles = rolesNow();
    root.querySelectorAll('[data-color-row]').forEach((row) => {
      const role = row.dataset.colorRow;
      const swatch = row.querySelector('[data-color-swatch]');
      const value = row.querySelector('[data-color-value]');
      if (swatch) swatch.style.background = roles[role];
      if (value) value.textContent = roles[role];
    });
    root.querySelectorAll('[data-contrast-pair]').forEach((pair) => {
      const bg = roles[pair.dataset.bg];
      const fg = roles[pair.dataset.fg];
      const sample = pair.querySelector('.contrast-pair__sample');
      if (sample) {
        sample.style.background = bg;
        sample.style.color = fg;
      }
      const ratio = wcagContrast(bg, fg);
      const grade = contrastGrade(ratio);
      const ratioNode = pair.querySelector('[data-contrast-ratio]');
      const gradeNode = pair.querySelector('[data-contrast-grade]');
      if (ratioNode) ratioNode.textContent = ratio.toFixed(2);
      if (gradeNode) {
        gradeNode.textContent = grade.label;
        gradeNode.className = `contrast-grade contrast-grade--${grade.tone}`;
      }
    });
    const count = root.querySelector('#token-count');
    if (count) {
      const visible = Array.from(root.querySelectorAll('[data-token-row]')).filter((row) => !row.hidden).length;
      count.textContent = `${visible} ${tr('tokens')} · ${tr('seed')} ${resolveSeed(getState())}`;
    }
  };
  update();
  const unsubscribe = subscribe(update);
  return () => unsubscribe();
}
