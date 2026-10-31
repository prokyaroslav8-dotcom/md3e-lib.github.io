/* Application bootstrap */

import { applyGlobalTheme } from './color.js';
import { initRouter } from './router.js';
import { initShell } from './shell.js';
import { getState, initState, subscribe } from './state.js';
import { $, bindRanges, bindRipples, refreshIcons } from './utils.js';

function boot() {
  initState();
  applyGlobalTheme(getState());
  initShell();
  bindRipples();

  // Keep the generated theme in sync when anything (e.g. a demo app) changes state.
  subscribe(() => applyGlobalTheme(getState()));

  initRouter();

  // Any range inputs added outside a page render should still fill correctly.
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node instanceof HTMLElement) bindRanges(node);
      }
    }
    refreshIcons();
  });
  observer.observe($('#main') || document.body, { childList: true, subtree: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}