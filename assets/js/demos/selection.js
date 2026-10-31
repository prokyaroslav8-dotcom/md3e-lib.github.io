import { specimen } from '../specimen.js';
import { icon, refreshIcons, toast } from '../utils.js';

export const id = 'selection';
export const name = 'Selection';
export const iconName = 'sliders-horizontal';
export const desc = 'Controls that make choice feel tactile.';

export function html() {
  return `<div class="studio-stack">
    ${specimen({
      kicker: '01 · Switches',
      title: 'A binary decision with a body',
      desc: 'Switches take effect immediately. The handle grows when it commits, so the state change is visible before you read the label.',
      body: `<div class="settings-list" style="max-width:640px">
        <div class="settings-row">
          <div class="settings-row__text">
            <div class="settings-row__title">Dynamic color</div>
            <div class="settings-row__sub">Derive every surface from one seed color</div>
          </div>
          <label class="md-switch"><input type="checkbox" id="switch-master" checked aria-label="Dynamic color"><span class="md-switch__track"><span class="md-switch__thumb"></span></span></label>
        </div>
        <div class="settings-row">
          <div class="settings-row__text">
            <div class="settings-row__title">Expressive motion</div>
            <div class="settings-row__sub">Spring physics for containers and indicators</div>
          </div>
          <label class="md-switch"><input type="checkbox" class="switch-child" checked aria-label="Expressive motion"><span class="md-switch__track"><span class="md-switch__thumb"></span></span></label>
        </div>
        <div class="settings-row">
          <div class="settings-row__text">
            <div class="settings-row__title">High contrast text</div>
            <div class="settings-row__sub">Increase foreground separation in both themes</div>
          </div>
          <label class="md-switch"><input type="checkbox" class="switch-child" aria-label="High contrast text"><span class="md-switch__track"><span class="md-switch__thumb"></span></span></label>
        </div>
        <div class="settings-row">
          <div class="settings-row__text">
            <div class="settings-row__title">Sync across surfaces</div>
            <div class="settings-row__sub">Requires an account — unavailable in this demo</div>
          </div>
          <label class="md-switch"><input type="checkbox" disabled aria-label="Sync across surfaces"><span class="md-switch__track"><span class="md-switch__thumb"></span></span></label>
        </div>
      </div>`,
      meta: ['Track · 52 × 32', 'Handle · 16 → 24 px', 'Label · body medium'],
    })}

    ${specimen({
      kicker: '02 · Checkboxes & radios',
      title: 'Multi-select and exclusive choice',
      desc: 'Checkboxes select many things at once and support an indeterminate parent. Radios present a small set of mutually exclusive options with enough room to explain each one.',
      body: `<div class="check-columns">
        <div>
          <div class="demo-label" style="margin-bottom:12px">Notification channels</div>
          <div class="demo-col">
            <label class="md-check">
              <input type="checkbox" id="check-all" checked>
              <span class="md-check__box"></span>
              <span class="md-check__label">Select all<small>3 of 4 enabled</small></span>
            </label>
            <div class="demo-divider" style="margin:2px 0 2px 32px"></div>
            ${[
              ['Product updates', 'New components, palettes and labs', true],
              ['Design reviews', 'Weekly critique notes', true],
              ['Release notes', 'When a version ships', true],
              ['Research invites', 'Occasional usability sessions', false],
            ].map(([title, sub, checked], index) => `<label class="md-check">
              <input type="checkbox" class="check-child" ${checked ? 'checked' : ''} data-index="${index}">
              <span class="md-check__box"></span>
              <span class="md-check__label">${title}<small>${sub}</small></span>
            </label>`).join('')}
          </div>
        </div>
        <div>
          <div class="demo-label" style="margin-bottom:12px">Density</div>
          <div class="radio-cards" style="grid-template-columns:1fr">
            ${[
              ['Comfortable', 'More air around every control', 'cozy', true],
              ['Default', 'The system default for desktop', 'default', false],
              ['Compact', 'Maximum information per pixel', 'compact', false],
            ].map(([title, sub, value, checked]) => `<label class="radio-card">
              <input type="radio" name="density" value="${value}" ${checked ? 'checked' : ''}>
              <span class="radio-card__top">
                <span class="radio-card__name">${title}</span>
                <span class="radio-card__check">${icon('check')}</span>
              </span>
              <span class="radio-card__desc">${sub}</span>
            </label>`).join('')}
          </div>
          <div class="demo-panel demo-panel--tonal" style="margin-top:14px">
            <div class="demo-label">Preview</div>
            <div class="settings-list" id="density-preview" style="--row-gap:0px">
              ${[1, 2, 3].map((row) => `<div class="settings-row" style="min-height:var(--preview-row,62px)"><div class="settings-row__text"><div class="settings-row__title">List item ${row}</div><div class="settings-row__sub">Density responds immediately</div></div>${icon('chevron-right')}</div>`).join('')}
            </div>
          </div>
        </div>
      </div>`,
      meta: ['Checkbox · 20 px', 'Radio · 20 px', 'Touch target · 48 px'],
    })}

    ${specimen({
      kicker: '03 · Sliders',
      title: 'Continuous values with a physical handle',
      desc: 'Sliders adjust settings that cannot be counted precisely. The expressive variant trades the circle for a squircle and a thicker track.',
      body: `<div class="slider-lab">
        <div class="slider-lab__cell">
          <div class="md-slider-head"><span>Brightness</span><output class="md-slider-value" id="slider-brightness-value">72</output></div>
          <input type="range" class="md-slider" id="slider-brightness" min="0" max="100" value="72" aria-label="Brightness">
          <div class="demo-panel demo-panel--tonal" style="display:flex;align-items:center;gap:12px">
            ${icon('sun-medium')}<div class="md-progress" style="flex:1"><span id="brightness-bar" style="width:72%"></span></div>${icon('sun')}
          </div>
        </div>
        <div class="slider-lab__cell">
          <div class="md-slider-head"><span>Volume</span><output class="md-slider-value" id="slider-volume-value">40</output></div>
          <input type="range" class="md-slider" id="slider-volume" min="0" max="100" value="40" aria-label="Volume">
          <div class="demo-row">${icon('volume-x')}<span class="body-sm muted">Silent</span><span class="grow"></span><span class="body-sm muted">Full</span>${icon('volume-2')}</div>
        </div>
        <div class="slider-lab__cell">
          <div class="md-slider-head"><span>Expressive corner</span><output class="md-slider-value" id="slider-corner-value">46</output></div>
          <input type="range" class="md-slider md-slider--expressive" id="slider-corner" min="0" max="100" value="46" aria-label="Expressive corner">
          <div class="shape-demo" style="width:100%;justify-content:center">
            <div class="shape-demo__object" id="slider-corner-preview" style="--demo-r:24%;width:84px;height:84px;color:var(--primary)">${icon('shapes')}</div>
          </div>
        </div>
      </div>`,
      meta: ['Track · 4 px / 8 px', 'Handle · 20 px / 28 px', 'Touch target · 40 px'],
    })}

    ${specimen({
      kicker: '04 · Chips',
      title: 'Compact choices, removable values',
      desc: 'Chips compress a filter, an attribute or a token into a single line. Selected chips get a check and a tonal container; input chips can be removed.',
      body: `<div class="chip-lab">
        <div>
          <div class="demo-label" style="margin-bottom:10px">Filter — multi select</div>
          <div class="chip-lab__row" id="chip-filters">
            ${['Tonal', 'Expressive', 'Accessible', 'Motion', 'Dynamic'].map((label, index) => `<button type="button" class="md-chip" aria-pressed="${index < 2}" data-chip="${label}">${icon('check')}${label}</button>`).join('')}
          </div>
          <p class="demo-note" id="chip-summary" style="margin-top:12px">2 filters active</p>
        </div>
        <div>
          <div class="demo-label" style="margin-bottom:10px">Input — removable</div>
          <div class="chip-lab__row" id="chip-inputs">
            ${['design-systems', 'expressive'].map((label) => `<span class="md-chip md-chip--filled" data-input-chip="${label}">${label}<button type="button" class="md-chip__remove" aria-label="Remove ${label}">${icon('x')}</button></span>`).join('')}
            <form class="md-chip md-chip--input" id="chip-form" style="padding-right:6px">
              ${icon('plus')}<input type="text" id="chip-input" placeholder="Add tag" style="border:0;background:transparent;outline:none;width:88px;font-size:.8125rem" aria-label="Add a tag">
            </form>
          </div>
        </div>
        <div>
          <div class="demo-label" style="margin-bottom:10px">Assist</div>
          <div class="chip-lab__row">
            <button type="button" class="md-chip js-assist">${icon('calendar-plus')}Add to calendar</button>
            <button type="button" class="md-chip js-assist">${icon('map-pin')}Directions</button>
            <button type="button" class="md-chip js-assist">${icon('share-2')}Share</button>
          </div>
        </div>
      </div>`,
      meta: ['Height · 32 px', 'Radius · 8 px', 'Gap · 8 px'],
    })}
  </div>`;
}

export function mount(root) {
  const master = root.querySelector('#switch-master');
  const children = Array.from(root.querySelectorAll('.switch-child'));
  master?.addEventListener('change', () => {
    children.forEach((child) => { child.checked = master.checked; });
    toast(master.checked ? 'All settings enabled' : 'All settings disabled', 'toggle-right');
  });
  children.forEach((child) => {
    child.addEventListener('change', () => {
      if (master) master.checked = children.every((item) => item.checked);
    });
  });
  root.querySelectorAll('.md-switch input:not(:disabled)').forEach((input) => {
    input.addEventListener('change', () => toast(input.checked ? 'Setting enabled' : 'Setting disabled', input.checked ? 'check' : 'x'));
  });

  const checkAll = root.querySelector('#check-all');
  const checkChildren = Array.from(root.querySelectorAll('.check-child'));
  const syncParent = () => {
    const checked = checkChildren.filter((item) => item.checked).length;
    if (!checkAll) return;
    checkAll.checked = checked === checkChildren.length;
    checkAll.indeterminate = checked > 0 && checked < checkChildren.length;
    const label = checkAll.closest('.md-check')?.querySelector('small');
    if (label) label.textContent = `${checked} of ${checkChildren.length} enabled`;
  };
  checkAll?.addEventListener('change', () => {
    checkChildren.forEach((child) => { child.checked = checkAll.checked; });
    syncParent();
  });
  checkChildren.forEach((child) => child.addEventListener('change', syncParent));
  syncParent();

  const preview = root.querySelector('#density-preview');
  root.querySelectorAll('input[name="density"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      const value = radio.value;
      const height = value === 'compact' ? 44 : value === 'cozy' ? 78 : 62;
      preview?.style.setProperty('--preview-row', `${height}px`);
      toast(`Density: ${value}`, 'ruler');
    });
  });

  const brightness = root.querySelector('#slider-brightness');
  brightness?.addEventListener('input', () => {
    const value = brightness.value;
    const label = root.querySelector('#slider-brightness-value');
    const bar = root.querySelector('#brightness-bar');
    if (label) label.textContent = value;
    if (bar) bar.style.width = `${value}%`;
  });
  const volume = root.querySelector('#slider-volume');
  volume?.addEventListener('input', () => {
    const label = root.querySelector('#slider-volume-value');
    if (label) label.textContent = volume.value;
  });
  const corner = root.querySelector('#slider-corner');
  corner?.addEventListener('input', () => {
    const label = root.querySelector('#slider-corner-value');
    const shape = root.querySelector('#slider-corner-preview');
    if (label) label.textContent = corner.value;
    if (shape) shape.style.setProperty('--demo-r', `${8 + Number(corner.value) * 0.42}%`);
  });

  const filters = root.querySelector('#chip-filters');
  const summary = root.querySelector('#chip-summary');
  const updateSummary = () => {
    const selected = filters?.querySelectorAll('[aria-pressed="true"]') ?? [];
    if (summary) summary.textContent = `${selected.length} filter${selected.length === 1 ? '' : 's'} active`;
  };
  filters?.querySelectorAll('.md-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      const pressed = chip.getAttribute('aria-pressed') === 'true';
      chip.setAttribute('aria-pressed', String(!pressed));
      updateSummary();
    });
  });
  updateSummary();

  root.querySelector('#chip-inputs')?.addEventListener('click', (event) => {
    const remove = event.target.closest('.md-chip__remove');
    if (remove) {
      const chip = remove.closest('[data-input-chip]');
      chip?.remove();
      toast('Tag removed', 'x');
    }
  });
  const chipForm = root.querySelector('#chip-form');
  chipForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = root.querySelector('#chip-input');
    const value = input?.value.trim();
    if (!value || !input) return;
    const chip = document.createElement('span');
    chip.className = 'md-chip md-chip--filled';
    chip.dataset.inputChip = value;
    chip.innerHTML = `${value}<button type="button" class="md-chip__remove" aria-label="Remove ${value}">${icon('x')}</button>`;
    chipForm.before(chip);
    refreshIcons(chip);
    input.value = '';
    toast(`“${value}” added`, 'plus');
  });

  root.querySelectorAll('.js-assist').forEach((chip) => {
    chip.addEventListener('click', () => toast(`${chip.textContent.trim()} activated`, 'sparkles'));
  });
}