import { pageHead } from '../shared.js';

export function stub({ title, lede, index = '02', kicker = 'Showcase' }) {
  return {
    title,
    html: `<div class="page">${pageHead({ index, kicker, title, lede })}<div class="specimen"><p class="muted">This studio is being assembled. The shell, dynamic color and navigation are already live.</p></div></div>`,
    mount() {},
  };
}