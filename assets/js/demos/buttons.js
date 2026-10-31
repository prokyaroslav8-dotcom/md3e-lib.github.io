import { codePanel, specimen } from '../specimen.js';
import { icon, refreshIcons, toast } from '../utils.js';

export const id = 'buttons';
export const name = 'Buttons';
export const iconName = 'mouse-pointer-2';
export const desc = 'Actions with weight, shape and rhythm.';

const CODE = `<button class="md-btn md-btn--filled">
  Save changes
</button>

<button class="md-btn md-btn--tonal">
  Add to collection
</button>

<button class="md-fab md-fab--extended">
  <svg>…</svg>
  New note
</button>`;

export function html() {
  return `<div class="studio-stack">
    ${specimen({
      kicker: '01 · Emphasis',
      title: 'Choose a level of commitment',
      desc: 'Filled means primary. Tonal means supportive. Outlined means available. Text means quiet. The same action can speak at any volume without changing its meaning.',
      body: `<div class="button-lab">
        <div class="button-lab__stage button-lab__stage--primary">
          <span class="demo-label">Primary composition</span>
          <div class="demo-row">
            <button type="button" class="md-btn md-btn--filled md-btn--lg js-demo-btn" data-message="Filled button activated">${icon('check')}Save changes</button>
            <button type="button" class="md-btn md-btn--tonal md-btn--lg js-demo-btn" data-message="Tonal button activated">${icon('plus')}Add to collection</button>
          </div>
          <div class="demo-row">
            <button type="button" class="md-btn md-btn--outlined js-demo-btn" data-message="Outlined button activated">Save draft</button>
            <button type="button" class="md-btn md-btn--text js-demo-btn" data-message="Text button activated">Learn more ${icon('arrow-up-right')}</button>
            <button type="button" class="md-btn md-btn--filled md-btn--icon-only js-demo-btn" data-message="Icon button activated" aria-label="Favorite">${icon('heart')}</button>
          </div>
          <p class="demo-note" style="opacity:.72">Press any control — the ripple, state layer and focus ring are the same ones the whole site uses.</p>
        </div>
        <div class="button-lab__aside">
          ${codePanel(CODE, { label: 'Expressive HTML', id: 'code-buttons' })}
        </div>
      </div>`,
      meta: ['Shape · full', 'Height · 40 / 52 px', 'State layer · 8%', 'Icon gap · 8 px'],
    })}

    ${specimen({
      kicker: '02 · States',
      title: 'Five states, one behaviour',
      desc: 'State layers overlay the container rather than changing the color, so contrast stays predictable in any theme.',
      body: `<div class="state-grid">
        ${['Enabled', 'Hover', 'Focus', 'Pressed', 'Disabled'].map((state, index) => `<div class="state-cell">
          <button type="button" class="md-btn md-btn--tonal ${index === 1 ? 'sim-hover' : ''} ${index === 2 ? 'sim-focus' : ''} ${index === 3 ? 'sim-press' : ''} ${index === 4 ? 'sim-disabled' : ''}">Button</button>
          <span class="demo-label">${state}</span>
        </div>`).join('')}
      </div>`,
      meta: ['Hover · 8%', 'Focus · 10% + ring', 'Pressed · 10%', 'Disabled · 38% opacity'],
    })}

    ${specimen({
      kicker: '03 · Shape & size',
      title: 'Corners can carry tone',
      desc: 'Expressive buttons trade the pill for a friendlier asymmetric container — and morph on interaction to acknowledge the press.',
      tools: `<label class="md-switch">
        <input type="checkbox" id="btn-expressive" aria-label="Use expressive shapes">
        <span class="md-switch__track"><span class="md-switch__thumb"></span></span>
        <span class="md-switch__label">Expressive shape</span>
      </label>`,
      body: `<div class="demo-row" id="btn-shape-row">
        <button type="button" class="md-btn md-btn--filled md-btn--sm js-demo-btn" data-message="Small button">Small</button>
        <button type="button" class="md-btn md-btn--filled js-demo-btn" data-message="Medium button">Medium</button>
        <button type="button" class="md-btn md-btn--filled md-btn--lg js-demo-btn" data-message="Large button">${icon('sparkles')}Large action</button>
        <button type="button" class="md-btn md-btn--tonal md-btn--expressive md-btn--lg js-demo-btn" data-message="Expressive button">${icon('shapes')}Expressive</button>
      </div>
      <div class="demo-row" style="margin-top:18px">
        <button type="button" class="md-btn md-btn--outlined md-btn--danger" disabled>Unavailable</button>
        <button type="button" class="md-btn md-btn--elevated js-demo-btn" data-message="Elevated button">${icon('layers')}Elevated</button>
        <button type="button" class="md-btn md-btn--inverse js-demo-btn" data-message="Inverse button">${icon('contrast')}Inverse</button>
      </div>`,
      meta: ['Radius · full → expressive', 'Sizes · 32 / 40 / 52 px'],
    })}

    ${specimen({
      kicker: '04 · Floating actions',
      title: 'Actions that float, then unfold',
      desc: 'A FAB is a promise of one important action. When there are three, it becomes a menu with spring choreography.',
      body: `<div class="dialog-lab">
        <div class="demo-panel demo-panel--tonal">
          <span class="demo-label">Dock</span>
          <div class="fab-dock" id="fab-dock">
            <div class="fab-dock__actions">
              <button type="button" class="md-fab" data-dock-action="Sketch" aria-label="Sketch">${icon('pen-tool')}</button>
              <button type="button" class="md-fab" data-dock-action="Record" aria-label="Record">${icon('mic')}</button>
              <button type="button" class="md-fab" data-dock-action="Capture" aria-label="Capture">${icon('camera')}</button>
            </div>
            <button type="button" class="md-fab md-fab--primary md-fab--lg" id="fab-dock-toggle" aria-expanded="false" aria-label="Open quick actions">${icon('plus')}</button>
          </div>
        </div>
        <div class="demo-panel">
          <span class="demo-label">Sizes & variants</span>
          <div class="demo-row" style="margin-top:18px">
            <button type="button" class="md-fab md-fab--sm" aria-label="Small FAB">${icon('pencil')}</button>
            <button type="button" class="md-fab" aria-label="FAB">${icon('plus')}</button>
            <button type="button" class="md-fab md-fab--tertiary" aria-label="Tertiary FAB">${icon('wand-2')}</button>
          </div>
          <div class="demo-row" style="margin-top:18px">
            <button type="button" class="md-fab md-fab--extended" id="fab-extended">${icon('plus')}<span>New note</span></button>
          </div>
        </div>
        <div class="demo-panel demo-panel--tonal">
          <span class="demo-label">Anatomy</span>
          <div class="demo-col" style="margin-top:14px">
            <div class="spread"><span class="body-sm muted">Container</span><span class="tag tag--tonal">primary-container</span></div>
            <div class="spread"><span class="body-sm muted">Radius</span><span class="tag">16 px</span></div>
            <div class="spread"><span class="body-sm muted">Elevation</span><span class="tag">level 2 → 3</span></div>
            <div class="spread"><span class="body-sm muted">Icon</span><span class="tag">24 px</span></div>
          </div>
        </div>
      </div>`,
      meta: ['FAB · 56 px', 'Large FAB · 96 px', 'Extended · 56 px + 22 px padding'],
    })}
  </div>`;
}

export function mount(root) {
  root.querySelectorAll('.js-demo-btn').forEach((button) => {
    button.addEventListener('click', () => toast(button.dataset.message || 'Action activated', 'sparkles'));
  });

  const expressive = root.querySelector('#btn-expressive');
  const shapeRow = root.querySelector('#btn-shape-row');
  expressive?.addEventListener('change', () => {
    shapeRow?.querySelectorAll('.md-btn').forEach((button) => {
      button.classList.toggle('shape-swap--expressive', expressive.checked);
    });
    toast(expressive.checked ? 'Expressive shape enabled' : 'Pill shape restored', 'shapes');
  });

  const dock = root.querySelector('#fab-dock');
  const dockToggle = root.querySelector('#fab-dock-toggle');
  dockToggle?.addEventListener('click', () => {
    const open = dock?.classList.toggle('is-open');
    dockToggle.innerHTML = icon(open ? 'x' : 'plus');
    dockToggle.setAttribute('aria-expanded', String(Boolean(open)));
    refreshIcons();
  });
  root.querySelectorAll('[data-dock-action]').forEach((button) => {
    button.addEventListener('click', () => {
      dock?.classList.remove('is-open');
      dockToggle?.setAttribute('aria-expanded', 'false');
      if (dockToggle) dockToggle.innerHTML = icon('plus');
      toast(`${button.dataset.dockAction} action selected`, 'sparkles');
      refreshIcons();
    });
  });

  const extended = root.querySelector('#fab-extended');
  extended?.addEventListener('click', () => {
    const label = extended.querySelector('span');
    const expanded = extended.classList.toggle('is-collapsed');
    if (label) label.textContent = expanded ? '' : 'New note';
    if (expanded) extended.style.paddingInline = '0';
    else extended.style.paddingInline = '22px';
    toast(expanded ? 'Extended FAB collapsed' : 'New note created', 'plus');
  });
}