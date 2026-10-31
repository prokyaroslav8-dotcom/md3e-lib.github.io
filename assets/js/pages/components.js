/* Component playground controller */

import { COMPONENT_CATEGORIES, pageHead } from '../shared.js';
import { icon } from '../utils.js';
import * as buttons from '../demos/buttons.js';
import * as cards from '../demos/cards.js';
import * as navigation from '../demos/navigation.js';
import * as selection from '../demos/selection.js';
import * as dialogs from '../demos/dialogs.js';
import * as fields from '../demos/fields.js';

const DEMOS = { buttons, cards, navigation, selection, dialogs, fields };
const META = {
  buttons: ['6 variants', 'Real ripple', 'Keyboard ready'],
  cards: ['4 card types', 'Live hover', 'Tonal surfaces'],
  navigation: ['3 patterns', 'Adaptive', 'Animated indicator'],
  selection: ['5 controls', 'Live state', 'Persistent logic'],
  dialogs: ['3 patterns', 'Focus trap', 'Esc to close'],
  fields: ['2 styles', 'Live validation', 'Floating labels'],
};

export function render({ param }) {
  const activeId = DEMOS[param] ? param : 'buttons';
  const demo = DEMOS[activeId];
  const category = COMPONENT_CATEGORIES.find((item) => item.id === activeId);

  const html = `<div class="page">
    ${pageHead({
      index: '02',
      kicker: 'Component playground',
      title: 'Every control,<br>with a pulse.',
      lede: 'One complete Material component kit — measured, themed, accessible and genuinely interactive. Every button presses, every switch commits, every dialog traps focus the way it should.',
      meta: ['42 controls', '6 categories', 'Light / dark', 'WCAG AA'],
    })}

    <nav class="category-bar" aria-label="Component categories">
      ${COMPONENT_CATEGORIES.map((item) => `<a class="category-bar__item" href="#/components/${item.id}" ${item.id === activeId ? 'aria-current="page"' : ''}>
        ${icon(item.icon)}<span>${item.name}</span>
      </a>`).join('')}
      <span class="category-bar__count">${String(COMPONENT_CATEGORIES.findIndex((item) => item.id === activeId) + 1).padStart(2, '0')} / ${String(COMPONENT_CATEGORIES.length).padStart(2, '0')}</span>
    </nav>

    <div class="studio-intro">
      <h2>${category.name}</h2>
      <p>${category.desc} Every specimen below is a real control, built on the same tokens that power the rest of Material Expressive.</p>
    </div>

    <div data-demo-root>${demo.html()}</div>
  </div>`;

  return {
    title: `${category.name} — Components`,
    html,
    mount(root) {
      demo.mount(root.querySelector('[data-demo-root]') || root);
      // Keyboard support for segmented controls and tab-like groups.
      root.querySelectorAll('.md-segmented').forEach((group) => {
        group.addEventListener('keydown', (event) => {
          if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
          const buttons = Array.from(group.querySelectorAll('button'));
          const current = buttons.indexOf(document.activeElement);
          if (current < 0) return;
          event.preventDefault();
          const next = (current + (event.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length;
          buttons[next].focus();
          buttons[next].click();
        });
      });
    },
  };
}