/* Shared utilities: DOM, icons, feedback, small interactions */

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

export function escapeHTML(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function icon(name, className = '') {
  return `<i data-lucide="${escapeHTML(name)}"${className ? ` class="${escapeHTML(className)}"` : ''} aria-hidden="true"></i>`;
}

export function refreshIcons() {
  if (!window.lucide || typeof window.lucide.createIcons !== 'function') return;
  // Lucide keeps data-lucide on the generated <svg>, which would make repeated
  // refresh calls re-replace their own output. Clear the attribute first so
  // only real <i> placeholders are hydrated.
  document.querySelectorAll('svg[data-lucide]').forEach((svg) => svg.removeAttribute('data-lucide'));
  window.lucide.createIcons({
    nameAttr: 'data-lucide',
    attrs: { 'stroke-width': 1.8, 'aria-hidden': 'true' },
  });
}

export function toast(message, iconName = 'check') {
  document.dispatchEvent(new CustomEvent('app:toast', { detail: { message, icon: iconName } }));
}

export async function copyText(text, message = 'Copied to clipboard') {
  try {
    await navigator.clipboard.writeText(text);
    toast(message, 'copy');
  } catch (error) {
    const area = document.createElement('textarea');
    area.value = text;
    area.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
    document.body.appendChild(area);
    area.select();
    try { document.execCommand('copy'); toast(message, 'copy'); }
    catch (e) { toast('Copy failed — select the text manually', 'circle-alert'); }
    area.remove();
  }
}

export function bindCopyButtons(root = document) {
  root.querySelectorAll('[data-copy]').forEach((btn) => {
    if (btn.dataset.copyBound) return;
    btn.dataset.copyBound = '1';
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-copy-target');
      const text = target ? ($(target)?.textContent ?? '') : btn.getAttribute('data-copy');
      copyText(text.trim(), btn.getAttribute('data-copy-message') || 'Copied to clipboard');
    });
  });
}

export function bindRipples() {
  if (document.documentElement.dataset.rippleBound) return;
  document.documentElement.dataset.rippleBound = '1';
  const selector = '.md-btn, .md-fab, .md-chip, .md-icon-btn, .md-segmented button, .nav-item, .bottom-nav__item, .color-demo__swatch, .palette-row, .md-menu__item';
  document.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    const host = event.target.closest(selector);
    if (!host || host.disabled || host.getAttribute('aria-disabled') === 'true') return;
    if (document.documentElement.dataset.reduceMotion === 'true') return;
    const rect = host.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2.1;
    const wave = document.createElement('span');
    wave.className = 'ripple-wave';
    wave.style.width = `${size}px`;
    wave.style.height = `${size}px`;
    wave.style.left = `${event.clientX - rect.left - size / 2}px`;
    wave.style.top = `${event.clientY - rect.top - size / 2}px`;
    // A class, never inline geometry. Inline styles on controls were causing
    // layout-affecting overrides in flex and grid contexts.
    host.classList.add('ripple-host');
    host.appendChild(wave);
    window.setTimeout(() => wave.remove(), 620);
  });
}

export function updateRangeFill(input) {
  const min = Number(input.min || 0);
  const max = Number(input.max || 100);
  const value = Number(input.value);
  const percent = max === min ? 0 : ((value - min) / (max - min)) * 100;
  input.style.setProperty('--fill', `${percent}%`);
  input.setAttribute('aria-valuetext', input.getAttribute('aria-valuetext') || String(value));
}

export function bindRanges(root = document) {
  root.querySelectorAll('input[type="range"].md-slider').forEach((input) => {
    updateRangeFill(input);
    if (input.dataset.rangeBound) return;
    input.dataset.rangeBound = '1';
    input.addEventListener('input', () => updateRangeFill(input));
  });
}

export function reducedMotion() {
  return document.documentElement.dataset.reduceMotion === 'true' ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function debounce(fn, delay = 120) {
  let timer;
  return (...args) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => fn(...args), delay);
  };
}

export function throttle(fn, frame = 16) {
  let last = 0;
  let raf = 0;
  return (...args) => {
    const now = performance.now();
    if (now - last >= frame) {
      last = now;
      fn(...args);
    } else if (!raf) {
      raf = requestAnimationFrame(() => {
        raf = 0;
        last = performance.now();
        fn(...args);
      });
    }
  };
}

/** Wait for the next frame (used for enter transitions without arbitrary sleeps). */
export function nextFrame() {
  return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
}

export function trapFocus(container, returnFocusTo = null) {
  const selector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const handler = (event) => {
    if (event.key !== 'Tab') return;
    const items = $$(selector, container).filter((el) => el.offsetParent !== null);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };
  container.addEventListener('keydown', handler);
  return () => {
    container.removeEventListener('keydown', handler);
    if (returnFocusTo && typeof returnFocusTo.focus === 'function') returnFocusTo.focus();
  };
}

export function wcagContrast(hexA, hexB) {
  const luminance = (hex) => {
    const value = hex.replace('#', '');
    const full = value.length === 3 ? value.split('').map((c) => c + c).join('') : value;
    const channels = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255);
    const linear = channels.map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
  };
  const a = luminance(hexA);
  const b = luminance(hexB);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

export function contrastGrade(ratio) {
  if (ratio >= 7) return { label: 'AAA', tone: 'strong' };
  if (ratio >= 4.5) return { label: 'AA', tone: 'good' };
  if (ratio >= 3) return { label: 'AA Large', tone: 'fair' };
  return { label: 'Fail', tone: 'poor' };
}

export function springValue({ from = 0, to = 1, stiffness = 170, damping = 18, mass = 1, onUpdate, onComplete, duration = 1600 }) {
  if (reducedMotion()) {
    onUpdate?.(to);
    onComplete?.();
    return () => {};
  }
  let x = from;
  let velocity = 0;
  let raf = 0;
  let previous = performance.now();
  const start = previous;
  const tick = (now) => {
    const delta = Math.min((now - previous) / 1000, 0.064);
    previous = now;
    const springForce = -stiffness * (x - to);
    const dampingForce = -damping * velocity;
    const acceleration = (springForce + dampingForce) / mass;
    velocity += acceleration * delta;
    x += velocity * delta;
    if (!Number.isFinite(x)) x = to;
    onUpdate?.(x);
    if ((Math.abs(velocity) < 0.004 && Math.abs(to - x) < 0.002) || now - start > duration) {
      onUpdate?.(to);
      onComplete?.();
      return;
    }
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}

export function scrollPageTo(top, behavior = 'smooth') {
  window.scrollTo({ top, behavior: reducedMotion() ? 'auto' : behavior });
}

/* ------------------------------------------------------------
   Display type fitting
   Expressive headlines are set large. Russian words are longer
   than their English counterparts, so we measure the real DOM and
   scale only when a word would otherwise break or overflow. This
   keeps every headline intact without shrinking the whole design.
   ------------------------------------------------------------ */

function textNodesIn(element) {
  const nodes = [];
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      if (node.parentElement?.closest('svg')) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  let node = walker.nextNode();
  while (node) {
    nodes.push(node);
    node = walker.nextNode();
  }
  return nodes;
}

function textLineCount(element) {
  const tops = new Set();
  for (const node of textNodesIn(element)) {
    const range = document.createRange();
    range.selectNodeContents(node);
    for (const rect of range.getClientRects()) {
      if (rect.width > 1) tops.add(Math.round(rect.top));
    }
  }
  return tops.size;
}

function wordOverflows(element) {
  const style = getComputedStyle(element);
  const box = element.getBoundingClientRect();
  const left = box.left + parseFloat(style.paddingLeft || 0);
  const right = box.right - parseFloat(style.paddingRight || 0);
  const tolerance = 1.5;
  for (const node of textNodesIn(element)) {
    const source = node.nodeValue;
    const tokens = source.match(/\S+/g) || [];
    let cursor = 0;
    for (const token of tokens) {
      const start = source.indexOf(token, cursor);
      if (start < 0) continue;
      cursor = start + token.length;
      if (token.length < 2) continue;
      const range = document.createRange();
      range.setStart(node, start);
      range.setEnd(node, start + token.length);
      const rects = Array.from(range.getClientRects()).filter((rect) => rect.width > 1);
      if (rects.length > 1) return true;
      for (const rect of rects) {
        if (rect.right > right + tolerance || rect.left < left - tolerance) return true;
      }
    }
  }
  return false;
}

function fitHeroTitle(element) {
  const lines = Array.from(element.querySelectorAll('.line > span')).filter((span) => span.textContent.trim());
  if (!lines.length) return;
  element.style.removeProperty('font-size');
  const base = parseFloat(getComputedStyle(element).fontSize);
  if (!Number.isFinite(base) || base < 12) return;
  const fits = () => lines.every((line) => textLineCount(line) <= 1);
  if (fits()) return;
  let low = base * 0.38;
  let high = base;
  for (let step = 0; step < 8; step += 1) {
    const mid = (low + high) / 2;
    element.style.fontSize = `${mid}px`;
    if (fits()) low = mid;
    else high = mid;
  }
  element.style.fontSize = `${Math.max(20, Math.floor(low * 10) / 10)}px`;
}

function fitHeadlineWords(element) {
  element.style.removeProperty('font-size');
  if (!wordOverflows(element)) return;
  const base = parseFloat(getComputedStyle(element).fontSize);
  if (!Number.isFinite(base) || base < 12) return;
  let low = base * 0.48;
  let high = base;
  for (let step = 0; step < 6; step += 1) {
    const mid = (low + high) / 2;
    element.style.fontSize = `${mid}px`;
    if (wordOverflows(element)) high = mid;
    else low = mid;
  }
  element.style.fontSize = `${Math.max(20, Math.floor(low * 10) / 10)}px`;
}

export function fitDisplayType(root = document) {
  if (!root?.querySelectorAll) return;
  const heroes = Array.from(root.querySelectorAll('.hero__title'));
  const headlines = Array.from(root.querySelectorAll(
    '.page-title, .section-title, .manifesto__title, .foundation-cta h2, .motion-accessibility h2, .app-hero__title, .stage-dialog__title'
  )).filter((element) => !heroes.some((hero) => hero.contains(element)));
  for (const element of heroes) {
    try { fitHeroTitle(element); } catch (error) { /* measurement is best-effort */ }
  }
  for (const element of headlines) {
    try { fitHeadlineWords(element); } catch (error) { /* measurement is best-effort */ }
  }
}