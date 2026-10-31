/* ============================================================
   Shape System — corner mixer, silhouettes and applied examples
   ============================================================ */

import { pageHead } from '../shared.js';
import { $, $$, copyText, icon, refreshIcons, toast } from '../utils.js';

const PRESETS = [
  { id: 'soft', name: 'Soft', corners: [8, 8, 8, 8], rot: 0 },
  { id: 'expressive', name: 'Expressive', corners: [20, 20, 4, 20], rot: -2 },
  { id: 'arch', name: 'Arch', corners: [50, 50, 6, 6], rot: 0 },
  { id: 'leaf', name: 'Leaf', corners: [2, 50, 2, 50], rot: 6 },
  { id: 'cookie', name: 'Cookie', corners: [46, 54, 40, 60], rot: -4 },
  { id: 'pill', name: 'Pill', corners: [50, 50, 50, 50], rot: 0 },
  { id: 'directional', name: 'Directional', corners: [34, 4, 34, 4], rot: 0 },
];

const TOKENS = [
  { name: 'XS', value: 8, use: 'Inputs' },
  { name: 'SM', value: 12, use: 'Chips' },
  { name: 'MD', value: 16, use: 'Fields' },
  { name: 'LG', value: 22, use: 'Buttons' },
  { name: 'XL', value: 28, use: 'Cards' },
  { name: '2XL', value: 36, use: 'Sheets' },
  { name: '3XL', value: 48, use: 'Hero' },
];

function polarPath(petals, amplitude, steps = 160, base = 0.36) {
  const points = [];
  for (let i = 0; i < steps; i += 1) {
    const angle = (i / steps) * Math.PI * 2;
    const radius = base + amplitude * Math.cos(petals * angle);
    const x = 0.5 + Math.cos(angle) * radius;
    const y = 0.5 + Math.sin(angle) * radius;
    points.push(`${x.toFixed(4)} ${y.toFixed(4)}`);
  }
  return `M${points.join(' L')} Z`;
}

const SILHOUETTES = [
  { id: 'scallop', name: 'Cookie', note: 'soft repeat', path: polarPath(12, 0.035) },
  { id: 'clover', name: 'Clover', note: 'four lobes', path: polarPath(4, 0.145) },
  { id: 'burst', name: 'Burst', note: 'sharp energy', path: polarPath(14, 0.13) },
  { id: 'petal', name: 'Flower', note: 'eight petals', path: polarPath(8, 0.1) },
  { id: 'gem', name: 'Gem', note: 'angular', path: 'M0.5 0 L0.92 0.3 L0.78 0.9 L0.22 0.9 L0.08 0.3 Z' },
  { id: 'arch', name: 'Arch', note: 'rising form', path: 'M0 1 L0 0.5 A0.5 0.5 0 0 1 1 0.5 L1 1 Z' },
];

function shapeStyle(corners) {
  const [tl, tr, br, bl] = corners;
  return `border-radius:${tl}% ${tr}% ${br}% ${bl}%`;
}

export function render() {
  return {
    title: 'Shape System',
    html: `<div class="page shape-page">
      ${pageHead({
        index: '05',
        kicker: 'Shape system',
        title: 'Shape is a language.',
        lede: 'Before a word is read, a silhouette has already spoken. Material’s shape scale moves from quiet inputs to expressive containers — consistent enough to build trust, bold enough to have a mood.',
        meta: ['7 shape tokens', '4 corners + 4 axes', '11 silhouettes', 'Live CSS'],
      })}

      <section class="shape-hero">
        <div class="studio-section-head">
          <div>
            <span class="label-caps">01 / Shape mixer</span>
            <h2>Give the geometry a voice.</h2>
          </div>
          <p>Move any corner independently, or lock them together. Every control writes real CSS — copy it straight into a component.</p>
        </div>

        <div class="shape-lab">
          <div class="shape-stage">
            <div class="shape-stage__meta">
              <span class="demo-label">Live preview</span>
              <span class="shape-stage__size mono" id="shape-size-label">320 × 288 px</span>
            </div>
            <div class="shape-preview-wrap">
              <div class="shape-preview" id="shape-preview">
                <div class="shape-preview__content">
                  <span class="shape-preview__eyebrow">Expressive shape</span>
                  <strong id="shape-preview-name">Expressive</strong>
                  <span class="shape-preview__aa">Aa</span>
                  <span class="shape-preview__caption" id="shape-preview-caption">20% · 20% · 4% · 20%</span>
                </div>
              </div>
            </div>
            <div class="shape-stage__foot">
              <span class="mono" id="shape-css-label">border-radius: 20% 20% 4% 20%;</span>
              <button type="button" class="md-btn md-btn--tonal md-btn--sm" id="shape-copy-css">${icon('copy')}Copy CSS</button>
            </div>
          </div>

          <aside class="shape-controls">
            <div class="shape-presets" role="group" aria-label="Shape presets">
              ${PRESETS.map((preset, index) => `<button type="button" class="shape-preset" data-shape-preset="${preset.id}" aria-pressed="${index === 1}">
                <span class="shape-preset__mini" style="${shapeStyle(preset.corners)};rotate:${preset.rot}deg"></span>
                <span>${preset.name}</span>
              </button>`).join('')}
            </div>

            <div class="shape-options">
              <div class="shape-option">
                <span class="demo-label">Link corners</span>
                <label class="md-switch">
                  <input type="checkbox" id="shape-link" aria-label="Link corners">
                  <span class="md-switch__track"><span class="md-switch__thumb"></span></span>
                </label>
              </div>
              <div class="shape-option">
                <span class="demo-label">Rotate</span>
                <div class="shape-rotate">
                  <input type="range" class="md-slider" id="shape-rotate" min="-15" max="15" step="1" value="0" aria-label="Rotate preview">
                  <output class="shape-rotate__value mono" id="shape-rotate-value">0°</output>
                </div>
              </div>
              <div class="shape-option">
                <span class="demo-label">Size</span>
                <div class="shape-rotate">
                  <input type="range" class="md-slider" id="shape-size" min="220" max="360" step="2" value="320" aria-label="Preview size">
                  <output class="shape-rotate__value mono" id="shape-size-value">320 px</output>
                </div>
              </div>
            </div>

            <div class="corner-controls">
              ${[
                ['TL', 'Top left', 20],
                ['TR', 'Top right', 20],
                ['BR', 'Bottom right', 4],
                ['BL', 'Bottom left', 20],
              ].map(([key, label, value]) => `<div class="corner-control" data-corner="${key}">
                <div class="md-slider-head"><span>${label}</span><output class="md-slider-value" data-corner-value="${key}">${value}%</output></div>
                <input type="range" class="md-slider" min="0" max="50" step="1" value="${value}" data-corner-input="${key}" aria-label="${label} corner radius">
              </div>`).join('')}
            </div>

            <div class="shape-silhouettes">
              <span class="demo-label">Expressive silhouettes</span>
              <div class="silhouette-grid">
                ${SILHOUETTES.map((item) => `<button type="button" class="silhouette" data-silhouette="${item.id}" aria-label="${item.name} shape">
                  <span class="silhouette__shape" style="clip-path:url(#shape-${item.id})"></span>
                  <span class="silhouette__name">${item.name}</span>
                </button>`).join('')}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section class="shape-section" aria-labelledby="shape-scale-title">
        <div class="studio-section-head">
          <div>
            <span class="label-caps">02 / Scale</span>
            <h2 id="shape-scale-title">Seven stops, one rhythm.</h2>
          </div>
          <p>Shape tokens step from 8 px to 48 px. Larger surfaces earn larger radii; small controls stay precise.</p>
        </div>
        <div class="shape-token-row">
          ${TOKENS.map((token, index) => `<button type="button" class="shape-token" data-shape-token="${token.value}" aria-pressed="${index === 4}">
            <span class="shape-token__shape" style="border-radius:${token.value}px"></span>
            <span class="shape-token__meta"><strong>${token.name}</strong><span>${token.value} px · ${token.use}</span></span>
          </button>`).join('')}
        </div>
      </section>

      <section class="shape-section" aria-labelledby="shape-applied-title">
        <div class="studio-section-head">
          <div>
            <span class="label-caps">03 / In use</span>
            <h2 id="shape-applied-title">Hierarchy you can see.</h2>
          </div>
          <p>Container shape sets the stage; action shape sets the tone. Used together, they make a screen legible before any copy is read.</p>
        </div>
        <div class="shape-applied">
          <article class="shape-use shape-use--container">
            <span class="demo-label">Container · Arch</span>
            <div class="shape-use__canvas">
              <span class="shape-use__big">Aa</span>
              <div class="shape-use__chips">
                <span class="md-chip">${icon('check')}Curated</span>
                <span class="md-chip">Shared</span>
              </div>
            </div>
            <div class="shape-use__copy">
              <h3>Let surfaces feel architectural.</h3>
              <p>An arch is calm but directional. It works for welcome panels, players and anything that should hold attention without shouting.</p>
            </div>
          </article>

          <article class="shape-use shape-use--action">
            <span class="demo-label">Action · Expressive</span>
            <div class="shape-use__actions">
              <button type="button" class="md-btn md-btn--filled md-btn--expressive md-btn--lg" data-shape-action>${icon('plus')}Create</button>
              <button type="button" class="md-fab md-fab--tertiary" aria-label="More actions" data-shape-action>${icon('sparkles')}</button>
              <span class="shape-use__meta mono">56 px · 28%</span>
            </div>
            <div class="shape-use__copy">
              <h3>Actions should announce themselves.</h3>
              <p>A different corner on a button makes it a character in the scene — especially when it morphs as you press it.</p>
            </div>
          </article>

          <article class="shape-use shape-use--selection">
            <span class="demo-label">Selection · Cookie</span>
            <div class="shape-use__select">
              <span class="silhouette__shape" style="clip-path:url(#shape-clover);background:var(--primary)"></span>
              <label class="md-check">
                <input type="checkbox" checked>
                <span class="md-check__box"></span>
                <span class="md-check__label">Playful by default<small>Shape can carry emotion, not only hierarchy</small></span>
              </label>
            </div>
            <div class="shape-use__copy">
              <h3>Keep selection precise.</h3>
              <p>Expressive geometry belongs on the container. The control itself stays unambiguous, a quiet circle you can trust.</p>
            </div>
          </article>
        </div>
      </section>

      <svg class="shape-defs" width="0" height="0" aria-hidden="true">
        <defs>
          ${SILHOUETTES.map((item) => `<clipPath id="shape-${item.id}" clipPathUnits="objectBoundingBox"><path d="${item.path}"/></clipPath>`).join('')}
        </defs>
      </svg>
    </div>`,
    mount(root) {
      mountShapeLab(root);
      root.querySelectorAll('[data-shape-action]').forEach((button) => {
        button.addEventListener('click', () => toast('Shape action pressed', 'shapes'));
      });
    },
  };
}

function mountShapeLab(root) {
  const preview = root.querySelector('#shape-preview');
  const state = { corners: [20, 20, 4, 20], rotated: 0, size: 320, linked: false, silhouette: null, name: 'Expressive' };

  const apply = () => {
    if (!preview) return;
    preview.style.width = `${state.size}px`;
    preview.style.height = `${Math.round(state.size * 0.9)}px`;
    preview.style.borderRadius = state.silhouette ? '0' : state.corners.map((value) => `${value}%`).join(' ');
    preview.style.clipPath = state.silhouette ? `url(#shape-${state.silhouette})` : 'none';
    preview.style.transform = `rotate(${state.rotated}deg)`;
    const name = root.querySelector('#shape-preview-name');
    if (name) name.textContent = state.name;
    const caption = root.querySelector('#shape-preview-caption');
    if (caption) caption.textContent = state.silhouette ? `${state.name} silhouette` : state.corners.map((value) => `${value}%`).join(' · ');
    const css = root.querySelector('#shape-css-label');
    if (css) css.textContent = state.silhouette ? `clip-path: url(#shape-${state.silhouette});` : `border-radius: ${state.corners.map((value) => `${value}%`).join(' ')};`;
    const sizeLabel = root.querySelector('#shape-size-label');
    if (sizeLabel) sizeLabel.textContent = `${state.size} × ${Math.round(state.size * 0.9)} px`;
    const rotateValue = root.querySelector('#shape-rotate-value');
    if (rotateValue) rotateValue.textContent = `${state.rotated}°`;
    const sizeValue = root.querySelector('#shape-size-value');
    if (sizeValue) sizeValue.textContent = `${state.size} px`;
    root.querySelectorAll('[data-corner-value]').forEach((output) => {
      const key = output.dataset.cornerValue;
      const index = ['TL', 'TR', 'BR', 'BL'].indexOf(key);
      output.textContent = `${state.corners[index]}%`;
    });
    root.querySelectorAll('[data-corner-input]').forEach((input) => {
      const index = ['TL', 'TR', 'BR', 'BL'].indexOf(input.dataset.cornerInput);
      if (document.activeElement !== input) input.value = String(state.corners[index]);
    });
  };

  root.querySelectorAll('[data-corner-input]').forEach((input) => {
    input.addEventListener('input', () => {
      const index = ['TL', 'TR', 'BR', 'BL'].indexOf(input.dataset.cornerInput);
      const value = Number(input.value);
      state.silhouette = null;
      if (state.linked) state.corners = [value, value, value, value];
      else state.corners[index] = value;
      state.name = 'Custom';
      root.querySelectorAll('[data-shape-preset]').forEach((button) => button.setAttribute('aria-pressed', 'false'));
      root.querySelectorAll('[data-shape-token]').forEach((button) => button.setAttribute('aria-pressed', 'false'));
      apply();
    });
  });

  root.querySelector('#shape-link')?.addEventListener('change', (event) => {
    state.linked = event.target.checked;
    if (state.linked) {
      state.corners = [state.corners[0], state.corners[0], state.corners[0], state.corners[0]];
      apply();
    }
  });

  root.querySelector('#shape-rotate')?.addEventListener('input', (event) => {
    state.rotated = Number(event.target.value);
    apply();
  });

  root.querySelector('#shape-size')?.addEventListener('input', (event) => {
    state.size = Number(event.target.value);
    apply();
  });

  root.querySelectorAll('[data-shape-preset]').forEach((button) => {
    button.addEventListener('click', () => {
      const preset = PRESETS.find((item) => item.id === button.dataset.shapePreset);
      if (!preset) return;
      state.corners = [...preset.corners];
      state.rotated = preset.rot;
      state.silhouette = null;
      state.name = preset.name;
      const rotate = root.querySelector('#shape-rotate');
      if (rotate) rotate.value = String(preset.rot);
      root.querySelectorAll('[data-shape-preset]').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
      root.querySelectorAll('[data-shape-token]').forEach((item) => item.setAttribute('aria-pressed', 'false'));
      apply();
    });
  });

  root.querySelectorAll('[data-shape-token]').forEach((button) => {
    button.addEventListener('click', () => {
      const px = Number(button.dataset.shapeToken);
      const percent = Math.round((px / state.size) * 100);
      state.corners = [percent, percent, percent, percent];
      state.silhouette = null;
      state.name = `Radius ${px}`;
      const link = root.querySelector('#shape-link');
      if (link) link.checked = false;
      state.linked = false;
      root.querySelectorAll('[data-shape-token]').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
      root.querySelectorAll('[data-shape-preset]').forEach((item) => item.setAttribute('aria-pressed', 'false'));
      apply();
    });
  });

  root.querySelectorAll('[data-silhouette]').forEach((button) => {
    button.addEventListener('click', () => {
      const silhouette = SILHOUETTES.find((item) => item.id === button.dataset.silhouette);
      if (!silhouette) return;
      state.silhouette = silhouette.id;
      state.name = silhouette.name;
      root.querySelectorAll('[data-silhouette]').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
      root.querySelectorAll('[data-shape-preset]').forEach((item) => item.setAttribute('aria-pressed', 'false'));
      apply();
    });
  });

  root.querySelector('#shape-copy-css')?.addEventListener('click', () => {
    const css = state.silhouette
      ? `clip-path: url(#shape-${state.silhouette});`
      : `border-radius: ${state.corners.map((value) => `${value}%`).join(' ')};`;
    copyText(css, 'Shape CSS copied');
  });

  apply();
  refreshIcons(root);
}