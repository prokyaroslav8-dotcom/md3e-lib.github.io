/* ============================================================
   Motion Lab — spring physics, choreography and tokens
   ============================================================ */

import { pageHead } from '../shared.js';
import { withThemeTransition } from '../shell.js';
import { tr } from '../i18n.js';
import { getState, setReduceMotion, subscribe, toggleTheme } from '../state.js';
import {
  $, $$, copyText, icon, refreshIcons, reducedMotion, springValue, toast,
} from '../utils.js';

let unsubState = null;
let cleanupSpring = null;
let travelsRight = true;

const PRESETS = {
  smooth: { stiffness: 170, damping: 22, mass: 1 },
  snappy: { stiffness: 380, damping: 30, mass: 0.9 },
  bouncy: { stiffness: 240, damping: 12, mass: 1.1 },
};

export function render() {
  unsubState?.();
  unsubState = null;
  cleanupSpring?.();
  cleanupSpring = null;

  const state = getState();
  const config = PRESETS.smooth;

  return {
    title: 'Motion Lab',
    html: `<div class="page motion-page">
      ${pageHead({
        index: '04',
        kicker: 'Motion lab',
        title: 'Motion you<br> can reason about.',
        lede: 'Expressive motion is not decoration. It is a sentence with a subject: what moved, from where, and why. Springs make that sentence feel physically true.',
        meta: ['Spring physics', 'Shared transitions', 'Reduced motion', '60 fps'],
      })}

      <section class="motion-hero-block">
        <div class="studio-section-head">
          <div>
            <span class="label-caps">01 / Spring studio</span>
            <h2>Release the mass.</h2>
          </div>
          <p>These controls drive a real damped spring — not a cubic-bezier approximation. Change stiffness, damping or mass and the same force moves the same object differently.</p>
        </div>

        <div class="spring-studio">
          <div class="spring-stage">
            <div class="spring-stage__top">
              <span class="demo-label">Live simulation</span>
              <span class="spring-readout mono" id="spring-readout">170 / 22 / 1.0</span>
            </div>
            <div class="spring-track" id="spring-track">
              <span class="spring-track__target" aria-hidden="true"></span>
              <span class="spring-track__label mono">target</span>
              <div class="spring-object" id="spring-object" aria-hidden="true">${icon('zap')}</div>
            </div>
            <div class="spring-actions">
              <button type="button" class="md-btn md-btn--filled" id="spring-release">${icon('play')}Release</button>
              <button type="button" class="md-btn md-btn--text" id="spring-reset">${icon('rotate-ccw')}Reset</button>
              <div class="spring-presets" role="group" aria-label="Spring presets">
                <button type="button" class="md-chip" data-spring-preset="smooth" aria-pressed="true">Smooth</button>
                <button type="button" class="md-chip" data-spring-preset="snappy" aria-pressed="false">Snappy</button>
                <button type="button" class="md-chip" data-spring-preset="bouncy" aria-pressed="false">Bouncy</button>
              </div>
            </div>
          </div>

          <aside class="spring-controls">
            <div class="spring-curve">
              <div class="spring-curve__head"><span class="demo-label">Position / time</span><span class="mono" id="spring-time">1.2 s settle</span></div>
              <svg viewBox="0 0 320 110" id="spring-curve-svg" role="img" aria-label="Spring position curve">
                <line x1="0" y1="86" x2="320" y2="86" stroke="var(--outline-variant)" stroke-dasharray="3 4"/>
                <line x1="0" y1="28" x2="320" y2="28" stroke="var(--outline-variant)" stroke-dasharray="3 4"/>
                <path id="spring-curve-path" d="" fill="none" stroke="var(--primary)" stroke-width="2.4" stroke-linecap="round"/>
                <circle id="spring-curve-dot" cx="0" cy="86" r="4" fill="var(--primary)"/>
              </svg>
              <div class="spring-curve__axis mono"><span>0</span><span>target</span></div>
            </div>
            <div class="spring-slider">
              <div class="md-slider-head"><span>Stiffness</span><output class="md-slider-value" id="stiffness-value">170</output></div>
              <input type="range" class="md-slider" id="spring-stiffness" min="60" max="500" step="1" value="${config.stiffness}" aria-label="Spring stiffness">
            </div>
            <div class="spring-slider">
              <div class="md-slider-head"><span>Damping</span><output class="md-slider-value" id="damping-value">${config.damping}</output></div>
              <input type="range" class="md-slider" id="spring-damping" min="4" max="60" step="1" value="${config.damping}" aria-label="Spring damping">
            </div>
            <div class="spring-slider">
              <div class="md-slider-head"><span>Mass</span><output class="md-slider-value" id="mass-value">1.0</output></div>
              <input type="range" class="md-slider" id="spring-mass" min="0.4" max="3" step="0.1" value="${config.mass}" aria-label="Spring mass">
            </div>
            <div class="spring-token">
              <span class="mono" id="spring-token-label">spring(170, 22, 1.0)</span>
              <button type="button" class="md-icon-btn md-icon-btn--sm" data-copy-spring aria-label="Copy spring token">${icon('copy')}</button>
            </div>
          </aside>
        </div>
      </section>

      <section class="motion-section">
        <div class="studio-section-head">
          <div>
            <span class="label-caps">02 / Choreography</span>
            <h2>Every element knows its cue.</h2>
          </div>
          <p>Expressive motion is staged. A trigger, a lead element, a supporting cast. These three demonstrations share one spring vocabulary.</p>
        </div>

        <div class="choreo-grid">
          <article class="choreo-card">
            <div class="choreo-card__head">
              <span class="demo-label">A / Stagger</span>
              <span class="tag">40 ms offsets</span>
            </div>
            <div class="choreo-menu-demo">
              <div class="choreo-menu" id="choreo-menu">
                <button type="button" class="choreo-menu__trigger" id="choreo-trigger" aria-expanded="false">
                  <span class="choreo-menu__icon">${icon('plus')}</span>
                  <span>Quick actions</span>
                  ${icon('chevron-down')}
                </button>
                <div class="choreo-menu__panel">
                  ${[
                    ['pen-tool', 'Sketch', 'Start from a blank shape'],
                    ['type', 'Write', 'Open a new note'],
                    ['palette', 'Recolor', 'Apply the active palette'],
                  ].map(([iconName, title, desc], index) => `<button type="button" class="choreo-menu__item" style="--i:${index}" data-choreo-action="${title}">
                    <span class="choreo-menu__item-icon">${icon(iconName)}</span>
                    <span><strong>${title}</strong><small>${desc}</small></span>
                  </button>`).join('')}
                </div>
              </div>
              <p class="demo-note">The trigger opens first; actions follow 40 ms apart, so the eye can parse the order.</p>
            </div>
          </article>

          <article class="choreo-card">
            <div class="choreo-card__head">
              <span class="demo-label">B / Shared element</span>
              <span class="tag">same object</span>
            </div>
            <div class="shared-demo" id="shared-demo">
              <button type="button" class="shared-card" id="shared-toggle" aria-expanded="false">
                <span class="shared-card__art">${icon('palette')}</span>
                <span class="shared-card__text"><strong>Surface study 04</strong><small>Tap to expand the same object</small></span>
                ${icon('chevron-down')}
              </button>
              <div class="shared-detail">
                <div class="shared-detail__inner">
                  <div class="shared-detail__graphic">${icon('sparkles')}</div>
                  <p>A shared element transition keeps identity intact. The card does not cross-fade into a new screen — it <em>becomes</em> the new screen.</p>
                  <div class="shared-detail__meta">
                    <span class="tag tag--tonal">container transform</span>
                    <span class="tag">spring-soft</span>
                  </div>
                </div>
              </div>
            </div>
            <p class="demo-note">The card grows in place. Content fades in only after the container has room for it.</p>
          </article>

          <article class="choreo-card">
            <div class="choreo-card__head">
              <span class="demo-label">C / State change</span>
              <span class="tag">theme</span>
            </div>
            <div class="theme-demo">
              <div class="theme-demo__visual" aria-hidden="true">
                <span class="theme-demo__circle"></span>
                <span class="theme-demo__line"></span>
                <span class="theme-demo__line theme-demo__line--short"></span>
              </div>
              <div class="theme-demo__copy">
                <strong id="theme-demo-label">Light theme</strong>
                <p>A circular reveal grows from the control you pressed. The system changes, not just the colors.</p>
              </div>
              <button type="button" class="md-btn md-btn--tonal" data-motion-theme>${icon('sun-moon')}Switch theme</button>
            </div>
            <p class="demo-note">The reveal is a view transition; with reduced motion it becomes an instant, solid swap.</p>
          </article>
        </div>
      </section>

      <section class="motion-section" id="motion-tokens">
        <div class="studio-section-head">
          <div>
            <span class="label-caps">03 / Tokens</span>
            <h2>Time, in useful units.</h2>
          </div>
          <p>Durations are short enough to feel immediate and long enough to be understood. Click play to see each token in isolation.</p>
        </div>
        <div class="token-table">
          <div class="token-table__head"><span>Token</span><span>Duration</span><span>Use</span><span>Preview</span></div>
          ${[
            ['short-1', 80, 'State change', 'cubic-bezier(0.2, 0, 0, 1)'],
            ['short-2', 140, 'Hover, small fades', 'cubic-bezier(0.2, 0, 0, 1)'],
            ['medium-1', 220, 'Ripple, selection', 'cubic-bezier(0.2, 0, 0, 1)'],
            ['medium-2', 320, 'Expand, collapse', 'cubic-bezier(0.2, 0, 0, 1)'],
            ['long-1', 450, 'Container transform', 'cubic-bezier(0.2, 0, 0, 1)'],
            ['long-2', 620, 'Page choreography', 'cubic-bezier(0.2, 0, 0, 1)'],
            ['expressive', 560, 'Playful emphasis', 'ease-spring-soft'],
          ].map(([token, duration, use], index) => `<div class="token-row" data-token-row data-duration="${duration}" data-ease="${use === 'Playful emphasis' ? 'ease-spring-soft' : 'cubic-bezier(0.2, 0, 0, 1)'}">
            <span class="token-row__name mono">${token}</span>
            <span class="token-row__duration">${duration} ms</span>
            <span class="token-row__use">${use}</span>
            <span class="token-row__preview">
              <span class="token-track"><span class="token-dot"></span></span>
              <button type="button" class="md-icon-btn md-icon-btn--sm" data-play-token="${index}" aria-label="Play ${token} token" data-duration="${duration}">${icon('play')}</button>
            </span>
          </div>`).join('')}
        </div>
        <div class="token-foot">
          <span class="mono">prefers-reduced-motion · respected everywhere</span>
          <label class="md-switch">
            <input type="checkbox" id="motion-reduce" ${state.reduceMotion ? 'checked' : ''} aria-label="Reduce motion">
            <span class="md-switch__track"><span class="md-switch__thumb"></span></span>
            <span class="md-switch__label">Reduce motion</span>
          </label>
        </div>
      </section>

      <section class="motion-section motion-accessibility">
        <div>
          <span class="label-caps">04 / Accessibility</span>
          <h2>Delight, with an off switch.</h2>
        </div>
        <div class="motion-accessibility__grid">
          <p>Every spring, reveal and shared transition on this site respects <span class="mono">prefers-reduced-motion</span>. <span class="motion-quiet-copy">When motion is reduced, the interface does not become less legible — it becomes quieter.</span></p>
          <ul>
            <li>${icon('check')}No auto-playing loops</li>
            <li>${icon('check')}No flashing or strobing</li>
            <li>${icon('check')}Focus states never animate away</li>
            <li>${icon('check')}State is always conveyed by more than motion</li>
          </ul>
        </div>
      </section>
    </div>`,
    mount(root) {
      mountSpring(root);
      mountChoreography(root);
      mountTokenTable(root);
      mountReducedMotion(root);
      unsubState = subscribe(() => syncMotionState(root));
      syncMotionState(root);
    },
  };
}

/* ---------- Spring simulation ---------- */

function readConfig(root) {
  return {
    stiffness: Number(root.querySelector('#spring-stiffness')?.value || 170),
    damping: Number(root.querySelector('#spring-damping')?.value || 22),
    mass: Number(root.querySelector('#spring-mass')?.value || 1),
  };
}

function simulateSpring({ stiffness, damping, mass }, seconds = 1.2, samples = 100) {
  const dt = seconds / samples;
  let x = 0;
  let v = 0;
  const values = [];
  for (let i = 0; i < samples; i += 1) {
    const a = (-stiffness * (x - 1) - damping * v) / mass;
    v += a * dt;
    x += v * dt;
    values.push(x);
  }
  return values;
}

function drawCurve(root, config) {
  const values = simulateSpring(config);
  const path = root.querySelector('#spring-curve-path');
  const dot = root.querySelector('#spring-curve-dot');
  if (!path) return;
  const width = 320;
  const top = 28;
  const bottom = 86;
  const points = values.map((value, index) => {
    const x = (index / (values.length - 1)) * width;
    const y = bottom - (value / 1.22) * (bottom - top);
    return [x, Math.max(8, Math.min(103, y))];
  });
  const d = points.map(([x, y], index) => `${index === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  path.setAttribute('d', d);
  if (dot) {
    const last = points[points.length - 1];
    dot.setAttribute('cx', last[0]);
    dot.setAttribute('cy', last[1]);
  }
  const readout = root.querySelector('#spring-readout');
  if (readout) readout.textContent = `${config.stiffness} / ${config.damping} / ${config.mass.toFixed(1)}`;
  const token = root.querySelector('#spring-token-label');
  if (token) token.textContent = `spring(${config.stiffness}, ${config.damping}, ${config.mass.toFixed(1)})`;
  const valuesNodes = {
    '#stiffness-value': config.stiffness,
    '#damping-value': config.damping,
    '#mass-value': config.mass.toFixed(1),
  };
  for (const [selector, value] of Object.entries(valuesNodes)) {
    const node = root.querySelector(selector);
    if (node) node.textContent = String(value);
  }
  const time = root.querySelector('#spring-time');
  if (time) {
    const settle = Math.round((1.2 + (config.mass * 200) / Math.max(20, config.stiffness)) * 1000);
    time.textContent = `${(settle / 1000).toFixed(2)} ${tr('s settle')}`;
  }
}

function launchSpring(root) {
  const track = root.querySelector('#spring-track');
  const object = root.querySelector('#spring-object');
  if (!track || !object) return;
  const padding = 10;
  const max = track.clientWidth - object.offsetWidth - padding * 2;
  const from = travelsRight ? 0 : max;
  const to = travelsRight ? max : 0;
  travelsRight = !travelsRight;
  cleanupSpring?.();
  const config = readConfig(root);
  cleanupSpring = springValue({
    from,
    to,
    stiffness: config.stiffness,
    damping: config.damping,
    mass: config.mass,
    duration: 2400,
    onUpdate: (value) => {
      const clamped = Math.max(-18, Math.min(max + 18, value));
      object.style.transform = `translateX(${padding + clamped}px)`;
    },
  });
}

function resetSpring(root) {
  cleanupSpring?.();
  const object = root.querySelector('#spring-object');
  if (object) object.style.transform = 'translateX(10px)';
  travelsRight = true;
}

function mountSpring(root) {
  drawCurve(root, readConfig(root));
  resetSpring(root);
  ['#spring-stiffness', '#spring-damping', '#spring-mass'].forEach((selector) => {
    root.querySelector(selector)?.addEventListener('input', () => {
      cleanupSpring?.();
      drawCurve(root, readConfig(root));
      root.querySelectorAll('[data-spring-preset]').forEach((button) => button.setAttribute('aria-pressed', 'false'));
    });
  });
  root.querySelector('#spring-release')?.addEventListener('click', () => launchSpring(root));
  root.querySelector('#spring-reset')?.addEventListener('click', () => resetSpring(root));
  root.querySelectorAll('[data-spring-preset]').forEach((button) => {
    button.addEventListener('click', () => {
      const preset = PRESETS[button.dataset.springPreset];
      if (!preset) return;
      const map = { '#spring-stiffness': preset.stiffness, '#spring-damping': preset.damping, '#spring-mass': preset.mass };
      Object.entries(map).forEach(([selector, value]) => {
        const input = root.querySelector(selector);
        if (input) { input.value = String(value); input.dispatchEvent(new Event('input', { bubbles: true })); }
      });
      root.querySelectorAll('[data-spring-preset]').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
      resetSpring(root);
      requestAnimationFrame(() => launchSpring(root));
      toast(`${button.textContent.trim()} spring`, 'activity');
    });
  });
  root.querySelector('[data-copy-spring]')?.addEventListener('click', () => {
    const config = readConfig(root);
    const values = simulateSpring(config, 1.2, 60);
    const samples = values.map((value, index) => `${value.toFixed(3)}${index === values.length - 1 ? '' : ` ${((index / (values.length - 1)) * 100).toFixed(1)}%`}`);
    copyText(`linear(${samples.join(', ')})`, 'Spring sampled as CSS linear() easing');
  });
}

/* ---------- Choreography ---------- */

function mountChoreography(root) {
  const menu = root.querySelector('#choreo-menu');
  const trigger = root.querySelector('#choreo-trigger');
  trigger?.addEventListener('click', () => {
    const open = menu?.classList.toggle('is-open');
    trigger.setAttribute('aria-expanded', String(Boolean(open)));
  });
  root.querySelectorAll('[data-choreo-action]').forEach((button) => {
    button.addEventListener('click', () => {
      menu?.classList.remove('is-open');
      trigger?.setAttribute('aria-expanded', 'false');
      toast(`${button.dataset.choreoAction} action selected`, 'sparkles');
    });
  });

  const shared = root.querySelector('#shared-demo');
  const sharedToggle = root.querySelector('#shared-toggle');
  sharedToggle?.addEventListener('click', () => {
    const open = shared?.classList.toggle('is-expanded');
    sharedToggle.setAttribute('aria-expanded', String(Boolean(open)));
  });

  root.querySelector('[data-motion-theme]')?.addEventListener('click', (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    withThemeTransition(toggleTheme, { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
  });
}

/* ---------- Token table ---------- */

function mountTokenTable(root) {
  const play = (row) => {
    const dot = row.querySelector('.token-dot');
    if (!dot) return;
    const duration = Number(row.dataset.duration || 300);
    dot.getAnimations().forEach((animation) => animation.cancel());
    dot.style.transform = '';
    const rawEase = row.dataset.ease;
    const easing = rawEase === 'ease-spring-soft'
      ? (getComputedStyle(document.documentElement).getPropertyValue('--ease-spring-soft').trim() || 'cubic-bezier(0.34, 1.48, 0.64, 1)')
      : 'cubic-bezier(0.2, 0, 0, 1)';
    const distance = Math.max(0, (dot.parentElement?.clientWidth || 180) - 18);
    if (reducedMotion()) {
      dot.animate([{ opacity: 0.3 }, { opacity: 1 }], { duration: 180 });
      return;
    }
    const forward = dot.animate([
      { transform: 'translateX(0)' },
      { transform: `translateX(${distance}px)` },
    ], { duration, easing, fill: 'forwards' });
    forward.finished.then(() => {
      dot.animate([
        { transform: `translateX(${distance}px)` },
        { transform: 'translateX(0)' },
      ], { duration: 260, easing: 'ease-out', fill: 'forwards' });
    }).catch(() => {});
  };
  root.querySelectorAll('[data-play-token]').forEach((button) => {
    button.addEventListener('click', () => {
      const row = button.closest('[data-token-row]');
      if (row) play(row);
    });
  });
  root.querySelectorAll('[data-token-row]').forEach((row) => {
    row.addEventListener('click', (event) => {
      if (event.target.closest('button')) return;
      play(row);
    });
  });
}

/* ---------- Reduced motion ---------- */

function mountReducedMotion(root) {
  const toggle = root.querySelector('#motion-reduce');
  toggle?.addEventListener('change', () => {
    setReduceMotion(toggle.checked);
    document.dispatchEvent(new CustomEvent('app:motion', { detail: { reduce: toggle.checked } }));
    toast(toggle.checked ? 'Reduced motion enabled' : 'Full motion restored', 'activity');
  });
}

function syncMotionState(root) {
  const state = getState();
  const toggle = root.querySelector('#motion-reduce');
  if (toggle) toggle.checked = state.reduceMotion;
  const label = root.querySelector('#theme-demo-label');
  if (label) label.textContent = document.documentElement.dataset.theme === 'dark' ? 'Dark theme' : 'Light theme';
}