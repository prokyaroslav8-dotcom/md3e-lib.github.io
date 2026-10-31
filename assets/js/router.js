/* Hash router with lazy page modules */

import { setDocumentTitle, updateActiveNav } from './shell.js';
import { applyLanguage } from './i18n.js';
import { siteFooter } from './shared.js';
import { $, bindCopyButtons, bindRanges, fitDisplayType, refreshIcons, reducedMotion } from './utils.js';

const PAGES = {
  overview: { load: () => import('./pages/overview.js'), nav: 'overview' },
  components: { load: () => import('./pages/components.js'), nav: 'components' },
  color: { load: () => import('./pages/color-studio.js'), nav: 'color' },
  motion: { load: () => import('./pages/motion.js'), nav: 'motion' },
  shape: { load: () => import('./pages/shapes.js'), nav: 'shape' },
  type: { load: () => import('./pages/typography.js'), nav: 'type' },
  apps: { load: () => import('./pages/apps.js'), nav: 'apps' },
  foundations: { load: () => import('./pages/foundations.js'), nav: 'foundations' },
};

let revealObserver = null;
let currentCleanup = null;

function parseRoute() {
  const raw = window.location.hash.replace(/^#\/?/, '');
  const [path, anchor = ''] = raw.split('#');
  const parts = path.split('/').filter(Boolean);
  const page = PAGES[parts[0]] ? parts[0] : 'overview';
  return {
    page,
    param: parts[1] ? decodeURIComponent(parts[1]) : '',
    section: anchor ? decodeURIComponent(anchor) : '',
  };
}

function revealTargets(root) {
  revealObserver?.disconnect();
  const targets = Array.from(root.querySelectorAll('.reveal, .reveal-stagger'));
  if (!('IntersectionObserver' in window) || reducedMotion()) {
    targets.forEach((target) => target.classList.add('is-visible'));
    return;
  }
  revealObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  targets.forEach((target, index) => {
    target.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 60}ms`);
    revealObserver.observe(target);
  });
  // Safety net: never leave content invisible if the observer misses an element.
  window.setTimeout(() => targets.forEach((target) => target.classList.add('is-visible')), 2400);
}

async function renderRoute({ preserveScroll = false } = {}) {
  const savedScroll = window.scrollY;
  const route = parseRoute();
  const config = PAGES[route.page];
  const container = $('#main');
  if (!container) return;

  // Pages that start timers or global listeners return a cleanup function.
  if (typeof currentCleanup === 'function') {
    try { currentCleanup(); } catch (error) { console.error('[router] cleanup failed', error); }
  }
  currentCleanup = null;

  let module;
  try {
    module = await config.load();
  } catch (error) {
    console.error('[router] failed to load page', route.page, error);
    container.innerHTML = `<div class="page"><div class="specimen"><h1 class="page-title">Something went wrong</h1><p class="page-lede">The page module could not be loaded. ${String(error?.message || '')}</p></div></div>`;
    return;
  }

  const result = await module.render({ param: route.param, route });
  container.innerHTML = `<div class="route-view" id="route-view">${result.html}</div>${siteFooter()}`;
  const view = $('#route-view');
  const cleanup = await result.mount?.(view, { param: route.param, route });
  currentCleanup = typeof cleanup === 'function' ? cleanup : null;

  refreshIcons(container);
  bindCopyButtons(container);
  bindRanges(container);
  revealTargets(container);
  applyLanguage(container);
  fitDisplayType(container);
  // Metrics change once the real display faces arrive. Re-fit without a flash.
  if (document.fonts?.ready) {
    document.fonts.ready.then(() => {
      if (document.body.contains(container)) fitDisplayType(container);
    }).catch(() => {});
  }

  updateActiveNav(config.nav);
  setDocumentTitle(result.title);

  if (preserveScroll) {
    window.scrollTo({ top: savedScroll, behavior: 'auto' });
  } else {
    window.scrollTo({ top: 0, behavior: 'auto' });
    const progress = $('#scroll-progress-bar');
    progress?.style.setProperty('--progress', '0');
  }

  if (route.section) {
    const target = document.getElementById(route.section);
    if (target) {
      window.setTimeout(() => {
        target.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });
      }, 120);
    }
  }

  if (!preserveScroll) container.focus({ preventScroll: true });
}

export function initRouter() {
  window.addEventListener('hashchange', () => renderRoute());
  window.addEventListener('app:language', () => renderRoute({ preserveScroll: true }));
  let fitTimer = 0;
  window.addEventListener('resize', () => {
    window.clearTimeout(fitTimer);
    fitTimer = window.setTimeout(() => {
      const view = $('#route-view');
      if (view) fitDisplayType(view);
    }, 140);
  });
  if (!window.location.hash) window.location.replace('#/overview');
  renderRoute();
}

export function navigate(route) {
  const target = route.startsWith('#') ? route : `#${route}`;
  if (window.location.hash === target) {
    window.scrollTo({ top: 0, behavior: reducedMotion() ? 'auto' : 'smooth' });
    return;
  }
  window.location.hash = target;
}