/* ============================================================
   Typography Studio — Google Sans Flex variable specimen
   ============================================================ */

import { pageHead } from '../shared.js';
import { $, $$, copyText, icon, refreshIcons, toast } from '../utils.js';

const PRESETS = [
  { id: 'display', name: 'Display', axes: { wght: 560, wdth: 96, opsz: 144, slnt: 0 }, size: 112 },
  { id: 'editorial', name: 'Editorial', axes: { wght: 430, wdth: 104, opsz: 72, slnt: 5 }, size: 96 },
  { id: 'ui', name: 'UI', axes: { wght: 560, wdth: 88, opsz: 17, slnt: 0 }, size: 76 },
  { id: 'poster', name: 'Poster', axes: { wght: 800, wdth: 128, opsz: 144, slnt: 0 }, size: 112 },
  { id: 'whisper', name: 'Whisper', axes: { wght: 300, wdth: 92, opsz: 40, slnt: 0 }, size: 80 },
];

const SCALE = [
  { name: 'Display', token: 'display-large', size: 57, line: 64, weight: 520, tracking: '-0.045em', sample: 'Design feels' },
  { name: 'Headline', token: 'headline-large', size: 32, line: 40, weight: 540, tracking: '-0.032em', sample: 'A typeface with intent' },
  { name: 'Title', token: 'title-large', size: 22, line: 28, weight: 560, tracking: '-0.02em', sample: 'Every word earns its place' },
  { name: 'Body', token: 'body-large', size: 16, line: 24, weight: 400, tracking: '-0.006em', sample: 'Readable at length, quiet in hierarchy, warm at every size.' },
  { name: 'Label', token: 'label-large', size: 11, line: 16, weight: 560, tracking: '0.08em', sample: 'SECTION LABEL · META · 08' },
];

const WEIGHTS = [100, 200, 300, 400, 500, 600, 700, 800, 900];

const FEATURES = [
  { id: 'liga', name: 'Ligatures', css: 'liga', sample: 'office fluffy ffi' },
  { id: 'tnum', name: 'Tabular numbers', css: 'tnum', sample: '12:48 · 1,280 · 09:15' },
  { id: 'zero', name: 'Slashed zero', css: 'zero', sample: '0O 100 2048' },
];

let typeState = {
  wght: 560,
  wdth: 96,
  opsz: 144,
  slnt: 0,
  size: 112,
  text: 'Expressive',
  features: ['liga'],
  preset: 'display',
};

export function render() {
  const state = { ...typeState, features: [...typeState.features] };

  return {
    title: 'Typography Studio',
    html: `<div class="page type-page">
      ${pageHead({
        index: '06',
        kicker: 'Typography studio',
        title: 'Type is a voice,<br> not a costume.',
        lede: 'Google Sans Flex is a variable instrument: four axes, nine weights and an optical range that moves from billboard to interface without losing its temperament. Here it is, fully exposed.',
        meta: ['4 variable axes', '9 weights', '5 scale roles', 'Live CSS'],
      })}

      <section class="type-lab" aria-labelledby="type-lab-title">
        <div class="type-stage">
          <div class="type-stage__head">
            <span class="demo-label">01 / Variable specimen</span>
            <span class="type-stage__meta mono" id="type-meta">wght ${state.wght} · wdth ${state.wdth} · opsz ${state.opsz}</span>
          </div>
          <div class="type-stage__canvas">
            <span class="type-ghost" aria-hidden="true">Aa</span>
            <div class="type-specimen no-i18n" id="type-specimen" contenteditable="true" spellcheck="false" role="textbox" aria-label="Editable type specimen" aria-multiline="false">${state.text}</div>
            <div class="type-stage__rule"><span></span><span class="mono">Google Sans Flex</span><span></span></div>
          </div>
          <div class="type-stage__foot">
            <div class="type-stage__foot-copy">
              <strong id="type-foot-title">Display</strong>
              <span class="mono" id="type-foot-css">font-variation-settings: 'wght' ${state.wght}, 'wdth' ${state.wdth}, 'opsz' ${state.opsz};</span>
            </div>
            <div class="type-stage__foot-actions">
              <span class="type-count mono" id="type-count">${state.text.length} chars</span>
              <button type="button" class="md-icon-btn md-icon-btn--sm" id="type-reset-text" aria-label="Reset specimen text" title="Reset text">${icon('rotate-ccw')}</button>
              <button type="button" class="md-btn md-btn--tonal md-btn--sm" id="type-copy">${icon('copy')}Copy CSS</button>
            </div>
          </div>
        </div>

        <aside class="type-controls" aria-label="Variable font controls">
          <div class="type-presets" role="group" aria-label="Type presets">
            ${PRESETS.map((preset) => `<button type="button" class="type-preset" data-type-preset="${preset.id}" aria-pressed="${preset.id === state.preset}">${preset.name}</button>`).join('')}
          </div>

          <div class="type-controls__sliders">
            ${[
              ['wght', 'Weight', 100, 900, 10, state.wght, 'Wght'],
              ['wdth', 'Width', 75, 151, 1, state.wdth, 'Wdth'],
              ['opsz', 'Optical size', 8, 144, 1, state.opsz, 'Opsz'],
              ['slnt', 'Slant', 0, 10, 1, state.slnt, 'Slant'],
              ['size', 'Preview size', 48, 160, 1, state.size, 'Px'],
            ].map(([id, label, min, max, step, value, unit]) => `<div class="type-slider" data-axis="${id}">
              <div class="md-slider-head"><span>${label}</span><output class="md-slider-value" id="type-${id}-value">${value}${unit === 'Px' ? ' px' : ''}</output></div>
              <input type="range" class="md-slider" id="type-${id}" data-type-axis="${id}" min="${min}" max="${max}" step="${step}" value="${value}" aria-label="${label}">
            </div>`).join('')}
          </div>

          <div class="type-controls__foot">
            <span class="demo-label">CSS output</span>
            <div class="type-code" id="type-code"><code>font-family: 'Google Sans Flex';<br>font-variation-settings:<br>  'wght' ${state.wght}, 'wdth' ${state.wdth},<br>  'opsz' ${state.opsz};<br>font-style: oblique ${state.slnt}deg;</code></div>
          </div>
        </aside>
      </section>

      <section class="type-section" aria-labelledby="type-scale-title">
        <div class="studio-section-head">
          <div>
            <span class="label-caps">02 / Scale</span>
            <h2 id="type-scale-title">Five roles, one rhythm.</h2>
          </div>
          <p>A type scale is a contract. These roles keep hierarchy legible across a phone, a desktop and everything between. Select a role to load it into the specimen.</p>
        </div>
        <div class="type-scale">
          ${SCALE.map((item, index) => `<button type="button" class="type-scale__row" data-type-scale="${index}" aria-label="Apply ${item.name} scale">
            <span class="type-scale__index mono">${String(index + 1).padStart(2, '0')}</span>
            <span class="type-scale__sample" style="font-size:clamp(1.3rem, ${item.size / 14}vw, ${item.size / 10}rem);font-weight:${item.weight};letter-spacing:${item.tracking};line-height:${item.line / item.size}">${item.sample}</span>
            <span class="type-scale__meta"><strong>${item.name}</strong><span class="mono">${item.size} / ${item.line} · ${item.weight}</span><span class="mono type-scale__token">--type-${item.token}</span></span>
          </button>`).join('')}
        </div>
      </section>

      <section class="type-section" aria-labelledby="type-weight-title">
        <div class="studio-section-head">
          <div>
            <span class="label-caps">03 / Weight</span>
            <h2 id="type-weight-title">Volume, not decoration.</h2>
          </div>
          <p>Every weight has a job. Thin for atmosphere, regular for reading, medium for interface, bold for declaration. Click a weight to hear it in the specimen.</p>
        </div>
        <div class="weight-matrix">
          ${WEIGHTS.map((weight, index) => `<button type="button" class="weight-cell ${weight === state.wght ? 'is-active' : ''}" data-type-weight="${weight}" aria-pressed="${weight === state.wght}">
            <span class="weight-cell__aa" style="font-weight:${weight}">Aa</span>
            <span class="weight-cell__meta"><span class="mono">${weight}</span><span>${['Thin', 'Extra light', 'Light', 'Regular', 'Medium', 'Semibold', 'Bold', 'Extra bold', 'Black'][index]}</span></span>
            <span class="weight-cell__bar" style="height:${13 + index * 6}%"></span>
          </button>`).join('')}
        </div>
      </section>

      <section class="type-section type-pairing-section" aria-labelledby="type-pairing-title">
        <div class="studio-section-head">
          <div>
            <span class="label-caps">04 / Pairing</span>
            <h2 id="type-pairing-title">The interface and its footnotes.</h2>
          </div>
          <p>Google Sans Flex carries the voice. Google Sans Code handles the evidence — labels, measurements and the small print that keeps a product honest.</p>
        </div>
        <div class="type-pairing">
          <article class="type-pairing__editorial">
            <span class="demo-label">Flex · editorial</span>
            <h3>Soft geometry,<br>clear intention.</h3>
            <p>Wide apertures and round terminals keep long passages friendly. Optical sizing tightens the display cuts without making them brittle.</p>
            <div class="type-pairing__byline"><span class="md-avatar md-avatar--sm">ME</span><span><strong>Material Expressive</strong><small>Type specimen · MMXXVI</small></span></div>
          </article>
          <article class="type-pairing__code">
            <span class="demo-label">Code · technical</span>
            <div class="type-pairing__code-head">
              <span class="mono">tokens.type.css</span>
              <button type="button" class="md-icon-btn md-icon-btn--sm" data-copy="font-family: 'Google Sans Code', monospace;" data-copy-message="Font stack copied" aria-label="Copy font stack">${icon('copy')}</button>
            </div>
            <pre class="type-code-block"><code><span class="tok-comment">/* display */</span>
<span class="tok-prop">font-family</span>: <span class="tok-value">'Google Sans Flex'</span>;
<span class="tok-prop">font-variation-settings</span>:
  <span class="tok-value">'wght' 560, 'wdth' 96</span>;

<span class="tok-comment">/* evidence */</span>
<span class="tok-prop">font-family</span>: <span class="tok-value">'Google Sans Code'</span>;
<span class="tok-prop">font-size</span>: <span class="tok-value">0.6875rem</span>;
<span class="tok-prop">font-feature-settings</span>: <span class="tok-value">'tnum' 1</span>;</code></pre>
          </article>
        </div>
      </section>

      <section class="type-section" aria-labelledby="type-open-type-title">
        <div class="studio-section-head">
          <div>
            <span class="label-caps">05 / Details</span>
            <h2 id="type-open-type-title">The small decisions.</h2>
          </div>
          <p>OpenType features are micro-typography with macro effect. Toggle them on a real string and watch the difference happen at reading speed.</p>
        </div>
        <div class="otf-lab">
          <div class="otf-sample" id="otf-sample">office fluffy ffi · 12:48 · 1,280 · 09:15 · 0O 100 2048</div>
          <div class="otf-controls" role="group" aria-label="OpenType features">
            ${FEATURES.map((feature) => `<button type="button" class="md-chip" data-otf="${feature.css}" aria-pressed="${state.features.includes(feature.css)}">${icon(feature.css === 'liga' ? 'link' : 'hash')}${feature.name}</button>`).join('')}
          </div>
          <p class="demo-note" id="otf-note">Ligatures are on. Tabular figures and the slashed zero are off by default.</p>
        </div>
      </section>

      <section class="type-section type-applied-section" aria-labelledby="type-applied-title">
        <div class="studio-section-head">
          <div>
            <span class="label-caps">06 / In use</span>
            <h2 id="type-applied-title">A page, set with care.</h2>
          </div>
          <p>Hierarchy is not a font size chart. It is the order in which the eye is allowed to travel.</p>
        </div>
        <div class="type-in-use">
          <div class="type-in-use__article">
            <span class="eyebrow">Field notes <span class="eyebrow-dot"></span> No. 08</span>
            <h3>Why softer letters<br>make harder products.</h3>
            <p class="type-in-use__lede">A product can be precise without being cold. Round terminals, open counters and a gentle optical axis give the interface a human hand.</p>
            <p>When typography is treated as a system rather than a final coat of paint, every state inherits the same temperament. Buttons feel like headings. Labels feel like captions. Nothing has to shout to be understood.</p>
            <div class="type-in-use__meta"><span class="mono">6 min read</span><span class="mono">Type & systems</span><span class="mono">MMXXVI</span></div>
          </div>
          <aside class="type-in-use__aside">
            <span class="demo-label">Reading rhythm</span>
            <div class="reading-meter" aria-hidden="true">
              ${Array.from({ length: 9 }, (v, i) => `<span style="--w:${[84, 94, 78, 88, 96, 70, 90, 82, 62][i]}%"></span>`).join('')}
            </div>
            <dl class="type-in-use__facts">
              <div><dt>Body</dt><dd>Google Sans Flex · 400</dd></div>
              <div><dt>Measure</dt><dd>62 characters</dd></div>
              <div><dt>Leading</dt><dd>1.6 ×</dd></div>
              <div><dt>Tracking</dt><dd>−0.006 em</dd></div>
            </dl>
          </aside>
        </div>
      </section>
    </div>`,
    mount(root) {
      return mountTypeLab(root);
    },
  };
}

function cssFor(state) {
  return `font-family: 'Google Sans Flex';
font-variation-settings: 'wght' ${state.wght}, 'wdth' ${state.wdth}, 'opsz' ${state.opsz};
font-style: oblique ${state.slnt}deg;
font-size: ${state.size}px;`;
}

function mountTypeLab(root) {
  const specimen = root.querySelector('#type-specimen');
  const ghost = root.querySelector('.type-ghost');
  const meta = root.querySelector('#type-meta');
  const cssLabel = root.querySelector('#type-foot-css');
  const code = root.querySelector('#type-code');
  const footTitle = root.querySelector('#type-foot-title');
  const count = root.querySelector('#type-count');
  const otfSample = root.querySelector('#otf-sample');
  const otfNote = root.querySelector('#otf-note');

  const specimenOverflows = () => {
    if (!specimen) return false;
    const box = specimen.getBoundingClientRect();
    const left = box.left + 2;
    const right = box.right - 2;
    const walker = document.createTreeWalker(specimen, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) => (node.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT),
    });
    let node = walker.nextNode();
    while (node) {
      const source = node.nodeValue;
      for (const token of source.match(/\S+/g) || []) {
        const start = source.indexOf(token);
        if (start < 0 || token.length < 2) continue;
        const range = document.createRange();
        range.setStart(node, start);
        range.setEnd(node, start + token.length);
        const rects = Array.from(range.getClientRects()).filter((rect) => rect.width > 1);
        if (rects.length > 1) return true;
        for (const rect of rects) {
          if (rect.right > right || rect.left < left) return true;
        }
      }
      node = walker.nextNode();
    }
    return false;
  };

  const setSpecimenSize = (value) => {
    specimen?.style.setProperty('--spec-size', `${Math.round(value)}px`);
  };

  const fitSpecimen = () => {
    if (!specimen) return;
    const requested = typeState.size;
    setSpecimenSize(requested);
    if (!specimenOverflows()) return;
    let low = 24;
    let high = requested;
    for (let step = 0; step < 7; step += 1) {
      const mid = (low + high) / 2;
      setSpecimenSize(mid);
      if (specimenOverflows()) high = mid;
      else low = mid;
    }
    setSpecimenSize(Math.max(24, low));
  };

  const apply = () => {
    const { wght, wdth, opsz, slnt, size } = typeState;
    const settings = `'wght' ${wght}, 'wdth' ${wdth}, 'opsz' ${opsz}`;
    for (const node of [specimen, ghost, otfSample].filter(Boolean)) {
      node.style.fontVariationSettings = settings;
      node.style.fontStyle = `oblique ${slnt}deg`;
    }
    if (specimen) specimen.style.setProperty('--spec-size', `${size}px`);
    if (ghost) ghost.style.fontSize = `clamp(15rem, ${Math.round(size * 2.3)}px, 27rem)`;
    if (meta) meta.textContent = `wght ${wght} · wdth ${wdth} · opsz ${opsz}`;
    if (cssLabel) cssLabel.textContent = `font-variation-settings: 'wght' ${wght}, 'wdth' ${wdth}, 'opsz' ${opsz};`;
    if (code) {
      code.innerHTML = `<code>font-family: 'Google Sans Flex';<br>font-variation-settings:<br>  'wght' ${wght}, 'wdth' ${wdth},<br>  'opsz' ${opsz};<br>font-style: oblique ${slnt}deg;</code>`;
    }
    if (count) count.textContent = `${typeState.text.length} chars`;
    if (footTitle) {
      const preset = PRESETS.find((item) => item.id === typeState.preset);
      footTitle.textContent = preset ? preset.name : 'Custom';
    }
    root.querySelectorAll('[data-type-axis]').forEach((input) => {
      const axis = input.dataset.typeAxis;
      if (document.activeElement !== input) input.value = String(typeState[axis]);
      const output = root.querySelector(`#type-${axis}-value`);
      if (output) output.textContent = axis === 'size' ? `${typeState[axis]} px` : String(typeState[axis]);
    });
    root.querySelectorAll('[data-type-preset]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.typePreset === typeState.preset));
    });
    root.querySelectorAll('[data-type-weight]').forEach((button) => {
      const active = Number(button.dataset.typeWeight) === typeState.wght;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    const activeFeatures = new Set(typeState.features);
    for (const node of [specimen, otfSample].filter(Boolean)) {
      node.style.fontFeatureSettings = Array.from(activeFeatures).map((feature) => `'${feature}' 1`).join(', ') || 'normal';
    }
    root.querySelectorAll('[data-otf]').forEach((button) => {
      button.setAttribute('aria-pressed', String(activeFeatures.has(button.dataset.otf)));
    });
    if (otfNote) {
      const enabled = FEATURES.filter((feature) => activeFeatures.has(feature.css)).map((feature) => tr(feature.name));
      otfNote.textContent = enabled.length
        ? `${tr('On')}: ${enabled.join(', ')}. ${tr('The rest stay quiet.')}`
        : tr('All OpenType features are off. The string relaxes to its default rhythm.');
    }
    fitSpecimen();
  };

  root.querySelectorAll('[data-type-axis]').forEach((input) => {
    input.addEventListener('input', () => {
      const axis = input.dataset.typeAxis;
      typeState[axis] = Number(input.value);
      typeState.preset = '';
      if (axis === 'wght') {
        typeState.preset = '';
      }
      apply();
    });
  });

  root.querySelectorAll('[data-type-preset]').forEach((button) => {
    button.addEventListener('click', () => {
      const preset = PRESETS.find((item) => item.id === button.dataset.typePreset);
      if (!preset) return;
      typeState = { ...typeState, ...preset.axes, size: preset.size, preset: preset.id };
      apply();
    });
  });

  root.querySelectorAll('[data-type-weight]').forEach((button) => {
    button.addEventListener('click', () => {
      typeState.wght = Number(button.dataset.typeWeight);
      typeState.preset = '';
      apply();
    });
  });

  root.querySelectorAll('[data-type-scale]').forEach((button) => {
    button.addEventListener('click', () => {
      const item = SCALE[Number(button.dataset.typeScale)];
      if (!item) return;
      typeState.wght = item.weight;
      typeState.size = Math.max(64, Math.min(140, item.size * 1.8));
      typeState.text = item.sample;
      typeState.preset = '';
      if (specimen) specimen.textContent = item.sample;
      apply();
      toast(`${item.name} applied`, 'type');
    });
  });

  root.querySelectorAll('[data-otf]').forEach((button) => {
    button.addEventListener('click', () => {
      const feature = button.dataset.otf;
      const index = typeState.features.indexOf(feature);
      if (index >= 0) typeState.features.splice(index, 1);
      else typeState.features.push(feature);
      apply();
    });
  });

  specimen?.addEventListener('input', () => {
    typeState.text = specimen.textContent.replace(/\s+/g, ' ').slice(0, 160);
    if (specimen.textContent !== typeState.text && specimen.textContent.length > 160) {
      specimen.textContent = typeState.text;
    }
    if (count) count.textContent = `${typeState.text.length} chars`;
    fitSpecimen();
  });
  specimen?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') event.preventDefault();
  });

  root.querySelector('#type-reset-text')?.addEventListener('click', () => {
    typeState.text = 'Expressive';
    typeState.size = 96;
    if (specimen) specimen.textContent = typeState.text;
    apply();
    specimen?.focus();
  });

  root.querySelector('#type-copy')?.addEventListener('click', () => {
    copyText(cssFor(typeState), 'Type CSS copied');
  });

  root.querySelectorAll('[data-copy]').forEach((button) => {
    button.addEventListener('click', () => copyText(button.dataset.copy, button.dataset.copyMessage || 'Copied'));
  });

  apply();
  refreshIcons(root);

  const canvas = root.querySelector('.type-stage__canvas');
  let fitFrame = 0;
  let lastWidth = 0;
  let observer = null;
  if (canvas && 'ResizeObserver' in window) {
    observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width || 0;
      if (Math.abs(width - lastWidth) < 1) return;
      lastWidth = width;
      cancelAnimationFrame(fitFrame);
      fitFrame = requestAnimationFrame(fitSpecimen);
    });
    observer.observe(canvas);
  }
  return () => {
    observer?.disconnect();
    cancelAnimationFrame(fitFrame);
  };
}
