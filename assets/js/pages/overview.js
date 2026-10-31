/* Overview — the expressive landing experience */

import { applyGlobalTheme, getRoles, PALETTES, paletteById, resolveSeed } from '../color.js';
import { applyPalette } from '../shell.js';
import { getState, subscribe } from '../state.js';
import { $, $$, escapeHTML, icon, refreshIcons, reducedMotion, scrollPageTo, springValue, toast } from '../utils.js';

let unsubState = null;
let cleanupSpring = null;
let playerTimer = null;

const SHAPE_PRESETS = [
  { name: 'Squircle', radius: '32%' },
  { name: 'Expressive', radius: '44px 44px 12px 44px' },
  { name: 'Arch', radius: '50% 50% 16px 16px / 62% 62% 16px 16px' },
  { name: 'Cookie', radius: '46% 54% 42% 58% / 54% 46% 58% 42%' },
  { name: 'Keyhole', radius: '50% 12% 50% 12%' },
  { name: 'Soft', radius: '14px' },
];

function heroStage() {
  const seed = resolveSeed(getState());
  return `
  <div class="hero-stage" id="hero-stage" aria-label="Interactive Material component composition">
    <div class="hero-stage__plane" aria-hidden="true"></div>

    <div class="stage-shape" aria-hidden="true">
      <span class="stage-shape__rings"></span>
      ${icon('sparkle')}
    </div>

    <article class="stage-card stage-player is-playing" id="stage-player" style="--d:120ms">
      <div class="player-art">
        <span class="player-art__label">Now playing</span>
        <span class="player-art__shape"></span>
        <span class="player-art__num">A·01 / 33⅓</span>
      </div>
      <div class="player-meta">
        <div class="player-meta__text">
          <div class="player-meta__track">Chromatic Drift</div>
          <div class="player-meta__artist">Tonal Fields — Surface Studies</div>
        </div>
        <button type="button" class="player-play" id="player-toggle" aria-label="Pause preview" aria-pressed="true">
          ${icon('pause')}
        </button>
      </div>
      <div class="player-progress">
        <span class="player-progress__time" id="player-elapsed">1:12</span>
        <span class="player-progress__bar"><span class="player-progress__fill" id="player-fill" style="width:34%"></span></span>
        <span class="player-progress__time">3:34</span>
      </div>
      <div class="player-controls">
        <button type="button" class="icon-button" data-stage-control="shuffle" aria-label="Shuffle">${icon('shuffle')}</button>
        <button type="button" class="icon-button" data-stage-control="previous" aria-label="Previous track">${icon('skip-back')}</button>
        <span class="eq" aria-hidden="true"><span></span><span></span><span></span><span></span></span>
        <button type="button" class="icon-button" data-stage-control="next" aria-label="Next track">${icon('skip-forward')}</button>
        <button type="button" class="icon-button" data-stage-control="repeat" aria-label="Repeat">${icon('repeat-2')}</button>
      </div>
    </article>

    <article class="stage-card stage-settings" style="--d:260ms">
      <div class="stage-settings__head">
        <span class="stage-settings__title">Evening blend</span>
        <span class="stage-settings__badge">${icon('sparkles')} Adaptive</span>
      </div>
      <div class="stage-setting">
        <span class="stage-setting__label">Ambient light</span>
        <label class="md-switch">
          <input type="checkbox" id="stage-ambient" checked aria-label="Ambient light">
          <span class="md-switch__track"><span class="md-switch__thumb"></span></span>
        </label>
      </div>
      <div class="stage-setting">
        <span class="stage-setting__label">Warmth</span>
        <span class="stage-mini-slider">
          <input type="range" class="md-slider" id="stage-warmth" min="0" max="100" value="62" aria-label="Warmth">
        </span>
        <span class="stage-setting__value" id="stage-warmth-value">62</span>
      </div>
      <div class="stage-setting">
        <span class="stage-setting__label">Palette</span>
        <span class="stage-setting__value" id="stage-seed" style="min-width:auto">${escapeHTML(paletteById(getState().palette).name)}</span>
      </div>
    </article>

    <article class="stage-card stage-dialog" id="stage-dialog" style="--d:420ms">
      <div class="stage-dialog__head">
        <span class="stage-dialog__icon">${icon('palette')}</span>
        <span class="stage-dialog__title">Make it yours?</span>
      </div>
      <p class="stage-dialog__text">Every surface on this page is generated from one seed color. Change it and watch the whole system respond.</p>
      <div class="stage-dialog__actions">
        <button type="button" class="md-btn md-btn--text" id="dialog-later">Not now</button>
        <button type="button" class="md-btn md-btn--tonal" data-action="open-color">Customize</button>
      </div>
    </article>

    <div class="stage-card stage-chips" style="--d:520ms" role="group" aria-label="Filters">
      <button type="button" class="md-chip" aria-pressed="true">${icon('check')}Tonal</button>
      <button type="button" class="md-chip">Vibrant</button>
      <button type="button" class="md-chip">Accessible</button>
    </div>

    <div class="stage-fab" id="stage-fab">
      <div class="stage-actions">
        <span class="stage-action-label"><span>New collection</span><button type="button" class="md-fab" data-fab-action="collection" aria-label="New collection">${icon('folder-plus')}</button></span>
        <span class="stage-action-label"><span>Add color</span><button type="button" class="md-fab" data-fab-action="color" aria-label="Add color">${icon('pipette')}</button></span>
        <span class="stage-action-label"><span>Shape</span><button type="button" class="md-fab" data-fab-action="shape" aria-label="Shape">${icon('shapes')}</button></span>
      </div>
      <button type="button" class="md-fab" id="fab-toggle" aria-label="Open quick actions" aria-expanded="false">${icon('plus')}</button>
    </div>

    <button type="button" class="hero-stage__reset" id="stage-reset" aria-label="Reset stage" title="Reset stage">${icon('rotate-ccw')}</button>
  </div>`;
}

function heroCopy() {
  return `
  <div class="hero__copy">
    <span class="hero__eyebrow"><span class="hero-chip">${icon('sparkles')}MD3E</span>Material Design 3 Expressive</span>
    <h1 class="hero__title">
      <span class="line"><span>Design</span></span>
      <span class="line"><span>that feels</span></span>
      <span class="line"><span><em class="hero-different">different.
        <svg viewBox="0 0 300 14" preserveAspectRatio="none" aria-hidden="true"><path d="M3 10.5C46 4.5 96 3.5 148 6.5c40 2.2 88 3.2 149-1.5"/></svg>
      </em></span></span>
    </h1>
    <p class="hero__sub">Explore the next dimension of expressive digital experiences. Color, motion, shape and type working as one responsive system.</p>
    <div class="hero__actions">
      <a class="md-btn md-btn--filled md-btn--lg" href="#/components/buttons">${icon('blocks')}Explore components</a>
      <a class="md-btn md-btn--tonal md-btn--lg" href="#/color">${icon('palette')}Open color studio</a>
    </div>
    <div class="hero__foot">
      <span class="hero__fact">${icon('droplets')}<strong>Dynamic color</strong> from one seed</span>
      <span class="hero__fact">${icon('activity')}<strong>Spring motion</strong> with intent</span>
      <span class="hero__fact">${icon('shapes')}<strong>Adaptive shape</strong> at 8 scales</span>
      <span class="hero__scroll">Scroll to explore ${icon('arrow-down')}</span>
    </div>
  </div>`;
}

function manifesto() {
  return `
  <section class="manifesto section-block reveal">
    <div>
      <span class="eyebrow"><span class="eyebrow-index">01</span><span class="eyebrow-dot"></span>Philosophy</span>
      <h2 class="manifesto__title" style="margin-top:18px">Expressive is not louder. It&rsquo;s <em>clearer.</em></h2>
      <p class="manifesto__intro">Material 3 Expressive gives an interface a point of view: bolder geometry, hierarchy you can feel, and motion that explains itself. Three principles hold the whole system together.</p>
    </div>
    <div class="manifesto__principles">
      <article class="principle">
        <span class="principle__num">01</span>
        <div>
          <h3>Shape carries meaning</h3>
          <p>Silhouette and corner radius do the work borders used to. A pill means “commit”, a squircle means “settle in”, an asymmetric container means “this belongs to you”.</p>
          <span class="principle__spec">Shape scale · XS to 3XL</span>
        </div>
      </article>
      <article class="principle">
        <span class="principle__num">02</span>
        <div>
          <h3>Motion explains</h3>
          <p>Every transition answers a question: where did this come from, where is it going, and what changed? Springs make the answer feel physical instead of merely pretty.</p>
          <span class="principle__spec">Springs · 250–700 ms</span>
        </div>
      </article>
      <article class="principle">
        <span class="principle__num">03</span>
        <div>
          <h3>Color belongs to the user</h3>
          <p>Dynamic color derives an entire tonal system from a single source. Surfaces stay calm, accents stay legible, and the interface never looks like someone else&rsquo;s brand.</p>
          <span class="principle__spec">HCT · Contrast enforced</span>
        </div>
      </article>
    </div>
  </section>`;
}

function dimensions() {
  const state = getState();
  return `
  <section class="section-block reveal" id="expression">
    <div class="section-heading">
      <div>
        <span class="eyebrow"><span class="eyebrow-index">02</span><span class="eyebrow-dot"></span>Interactive</span>
        <h2 class="section-title" style="margin-top:14px">Four dimensions of expression</h2>
      </div>
      <div class="section-heading__copy">
        <p>Nothing here is a screenshot. Slide, tap, morph and type — the demos respond the way the real system does, with the same tokens the rest of this site runs on.</p>
      </div>
    </div>

    <div class="dimensions reveal-stagger">
      <article class="dimension dimension--color">
        <div class="dimension__top">
          <span class="dimension__index">01 · Color</span>
          <a class="dimension__arrow" href="#/color" aria-label="Open color studio">${icon('arrow-up-right')}</a>
        </div>
        <div class="dimension__body">
          <h3>Color that belongs.</h3>
          <p>Six curated palettes, or a system grown from a single seed color. Tonal, legible and unmistakably yours.</p>
        </div>
        <div class="dimension__demo">
          <div class="color-demo">
            <div class="color-demo__swatches" id="dimension-swatches">
              ${PALETTES.map((p) => `<button type="button" class="color-demo__swatch" data-set-palette="${p.id}" aria-pressed="${state.palette === p.id}" aria-label="${p.name} palette" title="${p.name}"><span style="background:${p.seed}"></span></button>`).join('')}
            </div>
            <div class="color-demo__row">
              <span class="color-demo__current" id="dimension-seed-label">${escapeHTML(paletteById(state.palette).name)} · ${escapeHTML(paletteById(state.palette).seed.toUpperCase())}</span>
            </div>
            <span class="color-demo__hint">Tap a swatch — the entire interface follows.</span>
          </div>
        </div>
      </article>

      <article class="dimension dimension--motion">
        <div class="dimension__top">
          <span class="dimension__index">02 · Motion</span>
          <a class="dimension__arrow" href="#/motion" aria-label="Open motion lab">${icon('arrow-up-right')}</a>
        </div>
        <div class="dimension__body">
          <h3>Physics you can feel.</h3>
          <p>Springs replace curves. Release it and watch the mass settle.</p>
        </div>
        <div class="dimension__demo">
          <div class="motion-demo">
            <div class="motion-track" id="motion-track">
              <div class="motion-ball" id="motion-ball">${icon('zap')}</div>
            </div>
            <div class="motion-demo__foot">
              <span class="motion-demo__label">stiffness <b>170</b> · damping <b>18</b></span>
              <button type="button" class="md-btn md-btn--tonal md-btn--sm" id="motion-release">${icon('play')}Release</button>
            </div>
          </div>
        </div>
      </article>

      <article class="dimension dimension--shape">
        <div class="dimension__top">
          <span class="dimension__index">03 · Shape</span>
          <a class="dimension__arrow" href="#/shape" aria-label="Open shape system">${icon('arrow-up-right')}</a>
        </div>
        <div class="dimension__body">
          <h3>Geometry with a mood.</h3>
          <p>Corners speak before the text does.</p>
        </div>
        <div class="dimension__demo">
          <div class="shape-demo">
            <div class="shape-demo__object" id="dimension-shape" style="--demo-r:32%">${icon('shapes')}</div>
          </div>
          <button type="button" class="md-btn md-btn--outlined md-btn--sm" id="shape-cycle" style="margin-top:8px">${icon('wand-2')}Morph shape</button>
        </div>
      </article>

      <article class="dimension dimension--type">
        <div class="dimension__top">
          <span class="dimension__index">04 · Type</span>
          <a class="dimension__arrow" href="#/type" aria-label="Open typography studio">${icon('arrow-up-right')}</a>
        </div>
        <div class="dimension__body">
          <h3>A voice for every weight.</h3>
          <p>Google Sans Flex carries the message from whisper to declaration.</p>
          <div class="type-demo__controls" style="margin-top:18px">
            <input type="range" class="md-slider" id="dimension-weight" min="100" max="900" step="10" value="560" aria-label="Font weight">
            <span class="type-demo__value" id="dimension-weight-value">wght 560</span>
          </div>
        </div>
        <div class="dimension__demo" aria-hidden="true">
          <span class="type-demo__word">Expressive</span>
        </div>
        <span class="type-demo__word" id="dimension-word" style="position:absolute;left:clamp(20px,2.5vw,30px);bottom:22px;--demo-weight:560;font-size:clamp(1.6rem,2.4vw,2.1rem)">Expressive</span>
      </article>
    </div>
  </section>`;
}

function adaptive() {
  return `
  <section class="section-block adaptive reveal" id="adaptive">
    <div class="adaptive__copy">
      <span class="eyebrow"><span class="eyebrow-index">03</span><span class="eyebrow-dot"></span>Adaptive</span>
      <h2 class="section-title" style="margin-top:14px">One system, every surface.</h2>
      <p class="section-lede">Components don&rsquo;t just shrink — they reorganise. Navigation moves to where the thumb can reach it, content re-flows, and density responds to the space it is given.</p>
      <div class="adaptive__controls">
        <label class="adaptive__control-label" for="adaptive-width">
          <span>Preview width</span>
          <output id="adaptive-output">768 px</output>
        </label>
        <input type="range" class="md-slider md-slider--expressive" id="adaptive-width" min="320" max="980" step="4" value="768" aria-label="Preview width">
        <div class="md-segmented" role="group" aria-label="Layout presets">
          <button type="button" data-adaptive-preset="360" aria-pressed="false">Compact</button>
          <button type="button" data-adaptive-preset="768" aria-pressed="true">Medium</button>
          <button type="button" data-adaptive-preset="980" aria-pressed="false">Expanded</button>
        </div>
      </div>
    </div>
    <div class="adaptive__stage">
      <span class="adaptive__readout" id="adaptive-readout">medium · rail</span>
      <div class="adaptive-preview" id="adaptive-preview" style="--preview-width:768px">
        <div class="adaptive-preview__bar">
          <span class="adaptive-preview__dot"></span>
          <span class="adaptive-preview__title">Surface</span>
          <span class="adaptive-preview__search"></span>
        </div>
        <div class="adaptive-preview__layout">
          <div class="adaptive-preview__rail" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span></div>
          <div class="adaptive-preview__body">
            <div class="adaptive-preview__hero">
              <h4>Good evening, Alex</h4>
              <p>Your expressive workspace is ready</p>
            </div>
            <div class="adaptive-preview__chips"><span></span><span></span><span></span></div>
            <div class="adaptive-preview__row">
              <div class="adaptive-preview__tile"><b></b><span></span></div>
              <div class="adaptive-preview__tile"><b></b><span></span></div>
              <div class="adaptive-preview__tile"><b></b><span></span></div>
            </div>
          </div>
        </div>
        <div class="adaptive-preview__bottom-nav" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
      </div>
    </div>
  </section>`;
}

function appsStrip() {
  const apps = [
    {
      id: 'music', cls: 'tile-music', kind: 'Listening', name: 'Chromatic', desc: 'A meditative player built around a living record.',
      art: `<div class="tile-music__wave" aria-hidden="true">${Array.from({ length: 14 }, (v, i) => `<span style="--i:${i % 7}"></span>`).join('')}</div><div class="tile-music__disc" aria-hidden="true"></div>`,
    },
    {
      id: 'weather', cls: 'tile-weather', kind: 'Weather', name: 'Atmos', desc: 'Forecast as atmosphere, not spreadsheet.',
      art: `<div class="tile-weather__sun" aria-hidden="true"></div><div class="app-tile__foot"><div class="tile-weather__temp">21°</div><div class="tile-weather__cond">Soft light · Zurich</div></div>`,
    },
    {
      id: 'notes', cls: 'tile-notes', kind: 'Notes', name: 'Folio', desc: 'A quiet place for unfinished thoughts.',
      art: `<div class="note-stack" aria-hidden="true"><span>shape notes</span><span>quieter surfaces</span><span>tokens for spring?</span></div>`,
    },
    {
      id: 'home', cls: 'tile-home', kind: 'Smart home', name: 'Hearth', desc: 'A home that answers to a single gesture.',
      art: `<div class="tile-home__ring" aria-hidden="true"></div><div class="app-tile__foot"><div class="tile-weather__cond">Living room · 21.5°</div></div>`,
    },
    {
      id: 'tasks', cls: 'tile-tasks', kind: 'Tasks', name: 'Dayline', desc: 'An agenda that celebrates small progress.',
      art: `<div class="tile-tasks__list" aria-hidden="true">
        <div><i>${icon('check')}</i><span>Review motion tokens</span></div>
        <div><i></i><span>Ship expressive shapes</span></div>
        <div><i></i><span>Polish color studio</span></div>
      </div>`,
    },
  ];
  return `
  <section class="section-block reveal" id="applications">
    <div class="section-heading">
      <div>
        <span class="eyebrow"><span class="eyebrow-index">04</span><span class="eyebrow-dot"></span>Applied</span>
        <h2 class="section-title" style="margin-top:14px">The system, in the wild</h2>
      </div>
      <div class="section-heading__copy">
        <p>Five complete interfaces, each with its own palette and composition, all built from the same expression vocabulary.</p>
        <p><a class="text-link" href="#/apps/music">Browse all applications ${icon('arrow-right')}</a></p>
      </div>
    </div>
    <div class="apps-strip">
      ${apps.map((app) => `<a class="app-tile ${app.cls} app-tile--${app.id}" href="#/apps/${app.id}">
        <div class="app-tile__top">
          <span class="app-tile__kind">${app.kind}</span>
          <span class="app-tile__arrow">${icon('arrow-up-right')}</span>
        </div>
        <div class="app-tile__art">${app.art}</div>
        <div class="app-tile__foot">
          <div class="app-tile__name">${app.name}</div>
          <p class="app-tile__desc">${app.desc}</p>
        </div>
      </a>`).join('')}
    </div>
  </section>`;
}

function tokenCta() {
  const roles = getRoles(resolveSeed(getState()), getState().themePref === 'dark' ? 'dark' : 'light');
  return `
  <section class="token-cta reveal" id="tokens">
    <div class="token-cta__copy">
      <span class="eyebrow"><span class="eyebrow-dot"></span>Design tokens</span>
      <h2>Built from tokens, not guesses.</h2>
      <p>Every color, radius, duration and elevation on this page resolves to a variable. Change one value and the entire product stays coherent.</p>
      <div class="token-cta__actions">
        <a class="md-btn md-btn--filled" href="#/foundations">${icon('braces')}Explore foundations</a>
        <button type="button" class="md-btn md-btn--outlined" data-copy-target="#token-snippet" data-copy-message="CSS variables copied">${icon('copy')}Copy variables</button>
      </div>
    </div>
    <div class="token-cta__code">
      <div class="code-panel">
        <div class="code-panel__head"><span>theme.css · live values</span><button type="button" class="code-panel__copy" data-copy-target="#token-snippet">${icon('copy')}copy</button></div>
        <pre id="token-snippet"><code><span class="tok-comment">:root {</span>
  <span class="tok-prop">--md-primary</span>: <span class="tok-value" id="tok-primary">${roles.primary}</span>;   <span class="tok-comment">/* dynamic color */</span>
  <span class="tok-prop">--md-tertiary</span>: <span class="tok-value" id="tok-tertiary">${roles.tertiary}</span>;
  <span class="tok-prop">--r-xl</span>: <span class="tok-value">28px</span>;          <span class="tok-comment">/* shape scale */</span>
  <span class="tok-prop">--dur-5</span>: <span class="tok-value">450ms</span>;         <span class="tok-comment">/* motion duration */</span>
  <span class="tok-prop">--ease-spring</span>: <span class="tok-value">linear(…)</span>; <span class="tok-comment">/* expressive easing */</span>
}</code></pre>
      </div>
    </div>
  </section>`;
}

export function render() {
  unsubState?.();
  unsubState = null;
  window.clearInterval(playerTimer);
  playerTimer = null;
  cleanupSpring?.();
  cleanupSpring = null;

  const html = `
  <div class="page page--flush">
    <section class="hero">
      ${heroCopy()}
      ${heroStage()}
    </section>
    ${manifesto()}
    ${dimensions()}
    ${adaptive()}
    ${appsStrip()}
    ${tokenCta()}
  </div>`;

  return {
    title: 'Overview',
    html,
    mount(root) {
      mountHero(root);
      mountDimensions(root);
      mountAdaptive(root);
      unsubState = subscribe((state) => syncOverviewState(root, state));
      syncOverviewState(root, getState());
    },
  };
}

/* ---------- Hero ---------- */

function mountHero(root) {
  const stage = $('#hero-stage', root);
  if (!stage) return;
  const player = $('#stage-player', root);
  const toggle = $('#player-toggle', root);
  const fill = $('#player-fill', root);
  const elapsed = $('#player-elapsed', root);
  const duration = 214;
  let position = 72;
  let playing = true;

  const setPlaying = (value) => {
    playing = value;
    player?.classList.toggle('is-playing', playing);
    if (toggle) {
      toggle.innerHTML = icon(playing ? 'pause' : 'play');
      toggle.setAttribute('aria-label', playing ? 'Pause preview' : 'Play preview');
      toggle.setAttribute('aria-pressed', String(playing));
      refreshIcons(toggle);
    }
    window.clearInterval(playerTimer);
    if (playing) {
      playerTimer = window.setInterval(() => {
        position = (position + 1) % duration;
        renderPlayerProgress();
      }, 1000);
    }
  };
  const renderPlayerProgress = () => {
    const percent = (position / duration) * 100;
    if (fill) fill.style.width = `${percent}%`;
    if (elapsed) {
      const minutes = Math.floor(position / 60);
      const seconds = String(position % 60).padStart(2, '0');
      elapsed.textContent = `${minutes}:${seconds}`;
    }
  };
  renderPlayerProgress();
  setPlaying(true);
  toggle?.addEventListener('click', () => setPlaying(!playing));

  root.querySelectorAll('[data-stage-control]').forEach((button) => {
    button.addEventListener('click', () => toast(`${button.getAttribute('aria-label')} · preview control`, 'music'));
  });

  const warmth = $('#stage-warmth', root);
  const warmthValue = $('#stage-warmth-value', root);
  const applyWarmth = () => {
    const value = Number(warmth?.value ?? 62);
    stage.style.setProperty('--stage-warmth', String(value / 100));
    if (warmthValue) warmthValue.textContent = String(value);
  };
  warmth?.addEventListener('input', applyWarmth);
  applyWarmth();

  const ambient = $('#stage-ambient', root);
  ambient?.addEventListener('change', () => {
    stage.classList.toggle('is-dim', !ambient.checked);
    if (warmth) warmth.disabled = !ambient.checked;
    toast(ambient.checked ? 'Ambient light on' : 'Ambient light dimmed', ambient.checked ? 'sun' : 'moon');
  });

  root.querySelectorAll('.stage-chips .md-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      const isPressed = chip.getAttribute('aria-pressed') === 'true';
      chip.setAttribute('aria-pressed', String(!isPressed));
      const leading = chip.querySelector('.lucide');
      if (!isPressed && !leading) chip.insertAdjacentHTML('afterbegin', icon('check'));
      if (isPressed && leading) leading.remove();
      refreshIcons(chip);
    });
  });

  const dialog = $('#stage-dialog', root);
  $('#dialog-later', root)?.addEventListener('click', () => {
    dialog?.classList.add('is-dismissed');
    toast('Stage dialog dismissed — reset any time', 'x');
  });
  stage.querySelector('[data-action="open-color"]')?.addEventListener('click', (event) => {
    event.preventDefault();
    window.location.hash = '#/color';
  });

  const fab = $('#stage-fab', root);
  const fabToggle = $('#fab-toggle', root);
  fabToggle?.addEventListener('click', (event) => {
    event.stopPropagation();
    const open = fab?.classList.toggle('is-open');
    fabToggle.setAttribute('aria-expanded', String(Boolean(open)));
  });
  root.querySelectorAll('[data-fab-action]').forEach((button) => {
    button.addEventListener('click', () => {
      const action = button.dataset.fabAction;
      fab?.classList.remove('is-open');
      fabToggle?.setAttribute('aria-expanded', 'false');
      if (action === 'color') window.location.hash = '#/color';
      else if (action === 'shape') window.location.hash = '#/shape';
      else toast('Collection created · demo action', 'folder-plus');
    });
  });

  $('#stage-reset', root)?.addEventListener('click', () => {
    dialog?.classList.remove('is-dismissed');
    fab?.classList.remove('is-open');
    stage.classList.remove('is-dim');
    if (ambient) ambient.checked = true;
    if (warmth) { warmth.value = 62; warmth.disabled = false; applyWarmth(); }
    setPlaying(true);
    root.querySelectorAll('.stage-chips .md-chip').forEach((chip, index) => {
      chip.setAttribute('aria-pressed', String(index === 0));
    });
    toast('Stage reset', 'rotate-ccw');
  });
}

/* ---------- Dimension demos ---------- */

function mountDimensions(root) {
  const track = $('#motion-track', root);
  const ball = $('#motion-ball', root);
  let atEnd = false;
  $('#motion-release', root)?.addEventListener('click', () => {
    if (!track || !ball) return;
    const distance = track.clientWidth - ball.offsetWidth - 20;
    cleanupSpring?.();
    const from = atEnd ? distance : 0;
    const to = atEnd ? 0 : distance;
    atEnd = !atEnd;
    cleanupSpring = springValue({
      from,
      to,
      stiffness: 170,
      damping: 18,
      duration: 1500,
      onUpdate: (value) => { ball.style.transform = `translateX(${value}px)`; },
    });
  });

  const shape = $('#dimension-shape', root);
  let shapeIndex = 0;
  $('#shape-cycle', root)?.addEventListener('click', () => {
    shapeIndex = (shapeIndex + 1) % SHAPE_PRESETS.length;
    const preset = SHAPE_PRESETS[shapeIndex];
    shape?.style.setProperty('--demo-r', preset.radius);
    toast(`${preset.name} shape`, 'shapes');
  });

  const weight = $('#dimension-weight', root);
  const weightValue = $('#dimension-weight-value', root);
  const word = $('#dimension-word', root);
  const setWeight = () => {
    const value = weight?.value ?? '560';
    if (weightValue) weightValue.textContent = `wght ${value}`;
    word?.style.setProperty('--demo-weight', value);
  };
  weight?.addEventListener('input', setWeight);
  setWeight();
}

/* ---------- Adaptive preview ---------- */

function layoutName(width) {
  if (width < 480) return 'compact · bottom bar';
  if (width < 760) return 'medium · rail';
  return 'expanded · extended rail';
}

function mountAdaptive(root) {
  const slider = $('#adaptive-width', root);
  const preview = $('#adaptive-preview', root);
  const output = $('#adaptive-output', root);
  const readout = $('#adaptive-readout', root);
  const setWidth = (value) => {
    const width = Math.max(320, Math.min(980, Number(value)));
    if (preview) preview.style.setProperty('--preview-width', `${width}px`);
    if (slider) slider.value = String(width);
    if (output) output.textContent = `${width} px`;
    if (readout) readout.textContent = layoutName(width);
    root.querySelectorAll('[data-adaptive-preset]').forEach((button) => {
      button.setAttribute('aria-pressed', String(Number(button.dataset.adaptivePreset) === width));
    });
  };
  slider?.addEventListener('input', () => setWidth(slider.value));
  root.querySelectorAll('[data-adaptive-preset]').forEach((button) => {
    button.addEventListener('click', () => setWidth(button.dataset.adaptivePreset));
  });
  setWidth(slider?.value ?? 768);
}

/* ---------- Live state sync ---------- */

function syncOverviewState(root, state) {
  const palette = state.palette === 'custom'
    ? { name: 'Custom', seed: state.customSeed || '#6750A4' }
    : paletteById(state.palette);
  const label = $('#dimension-seed-label', root);
  if (label) label.textContent = `${palette.name} · ${palette.seed.toUpperCase()}`;
  const stageSeed = $('#stage-seed', root);
  if (stageSeed) stageSeed.textContent = palette.name;
  root.querySelectorAll('[data-set-palette]').forEach((swatch) => {
    swatch.setAttribute('aria-pressed', String(swatch.dataset.setPalette === state.palette));
  });
  applyGlobalTheme(state);
  const mode = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
  const roles = getRoles(palette.seed, mode);
  const primary = $('#tok-primary', root);
  const tertiary = $('#tok-tertiary', root);
  if (primary) primary.textContent = roles.primary;
  if (tertiary) tertiary.textContent = roles.tertiary;
}