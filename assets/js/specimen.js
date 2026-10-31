/* Reusable specimen and code-panel markup for the studios */

import { escapeHTML, icon } from './utils.js';

export function specimen({ kicker = 'Specimen', title, desc = '', body, tools = '', meta = [], tone = '', id = '', padded = true }) {
  return `<section class="specimen ${tone ? `specimen--${tone}` : ''} ${padded ? '' : 'specimen--flush'}" ${id ? `id="${id}"` : ''}>
    <header class="specimen__head">
      <div>
        <div class="specimen__kicker"><span class="dot"></span>${escapeHTML(kicker)}</div>
        <div class="specimen__title">${escapeHTML(title)}</div>
        ${desc ? `<p class="specimen__desc">${desc}</p>` : ''}
      </div>
      ${tools ? `<div class="specimen__tools">${tools}</div>` : ''}
    </header>
    <div class="specimen__body">${body}</div>
    ${meta.length ? `<footer class="specimen__meta">${meta.map((item) => `<span>${item}</span>`).join('')}</footer>` : ''}
  </section>`;
}

function highlight(code) {
  let html = escapeHTML(code);
  html = html.replace(/(&lt;\/?)([a-z0-9-]+)/g, '$1<span class="tok-selector">$2</span>');
  html = html.replace(/(\s)([a-z-]+)(=)/g, '$1<span class="tok-prop">$2</span>$3');
  html = html.replace(/(&quot;[^&]*?&quot;)/g, '<span class="tok-value">$1</span>');
  html = html.replace(/(--[a-z0-9-]+)/g, '<span class="tok-prop">$1</span>');
  html = html.replace(/(\b\d+(?:\.\d+)?(?:px|ms|s|%|em|rem)?\b)/g, '<span class="tok-value">$1</span>');
  return html;
}

export function codePanel(code, { label = 'Source', id = '' } = {}) {
  return `<div class="code-panel">
    <div class="code-panel__head">
      <span>${escapeHTML(label)}</span>
      <button type="button" class="code-panel__copy" data-copy-target="#${id || 'cp'}" data-copy-message="Snippet copied">${icon('copy')}copy</button>
    </div>
    <pre id="${id || 'cp'}"><code>${highlight(code)}</code></pre>
  </div>`;
}

export function metaTag(text) {
  return `<span>${text}</span>`;
}