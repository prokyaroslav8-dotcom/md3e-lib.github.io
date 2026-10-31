import { specimen } from '../specimen.js';
import { icon, toast } from '../utils.js';

export const id = 'cards';
export const name = 'Cards';
export const iconName = 'layers';
export const desc = 'Containers that create hierarchy without noise.';

export function html() {
  return `<div class="studio-stack">
    ${specimen({
      kicker: '01 · Elevation',
      title: 'Three ways to sit on a surface',
      desc: 'Elevated cards separate with shadow, filled cards separate with tone, outlined cards separate with a single hairline. Pick by how much emphasis the content needs.',
      tools: `<div class="md-segmented" role="group" aria-label="Card emphasis">
        <button type="button" data-card-hover="lift" aria-pressed="true">Interactive</button>
        <button type="button" data-card-hover="flat" aria-pressed="false">Static</button>
      </div>`,
      body: `<div class="card-lab" id="card-lab">
        <article class="md-card md-card--elevated md-card--interactive js-card">
          <div class="card-art card-art--primary">
            <span class="card-art__arch"></span>
            <span class="card-art__ring"></span>
          </div>
          <div class="md-card__body">
            <div class="md-card__eyebrow">Surface study · 04</div>
            <h3 class="md-card__title">Tonal Fields</h3>
            <p class="md-card__text">Generative ambient recorded in one take, mastered for quiet rooms.</p>
            <div class="card-stat"><b>32:14</b><span>minutes · lossless</span></div>
          </div>
          <div class="md-card__actions">
            <button type="button" class="md-btn md-btn--text js-card-action" data-message="Added to queue">${icon('play')}Play</button>
          </div>
        </article>

        <article class="md-card md-card--filled md-card--interactive js-card">
          <div class="card-art card-art--tertiary">
            <span class="card-art__arch"></span>
            <span class="card-art__ring"></span>
          </div>
          <div class="md-card__body">
            <div class="md-card__eyebrow">Zurich · 18:40</div>
            <h3 class="md-card__title">21° and soft light</h3>
            <p class="md-card__text">A warm evening with low wind. Tomorrow cools by four degrees before noon.</p>
            <div class="card-stat"><b>4</b><span>day outlook</span></div>
          </div>
          <div class="md-card__actions">
            <button type="button" class="md-btn md-btn--text js-card-action" data-message="Forecast opened">${icon('cloud-sun')}Forecast</button>
          </div>
        </article>

        <article class="md-card md-card--outlined md-card--interactive js-card">
          <div class="card-art card-art--secondary">
            <span class="card-art__arch"></span>
            <span class="card-art__ring"></span>
          </div>
          <div class="md-card__body">
            <div class="md-card__eyebrow">Pinned note · today</div>
            <h3 class="md-card__title">Shape vocabulary</h3>
            <p class="md-card__text">Cookie for playful. Arch for calm. Asymmetric when the content needs a direction.</p>
            <div class="card-stat"><b>3</b><span>linked notes</span></div>
          </div>
          <div class="md-card__actions">
            <button type="button" class="md-btn md-btn--text js-card-action" data-message="Note opened">${icon('notebook-pen')}Open</button>
          </div>
        </article>
      </div>`,
      meta: ['Radius · 28 px', 'Elevation · 0 / 1', 'Body padding · 20 px'],
    })}

    ${specimen({
      kicker: '02 · Expressive card',
      title: 'One container, a clear direction',
      desc: 'Asymmetric corners make a card feel addressed to the reader. Hover to watch the geometry answer back.',
      tone: 'primary',
      body: `<article class="expressive-card" style="background:transparent;color:inherit;padding:0">
        <div>
          <span class="demo-label" style="opacity:.6">Weekly listening</span>
          <h3 style="margin-top:10px">Your palette is getting warmer.</h3>
          <p>You listened to 42% more tonal ambient this week. The Ember palette was your most used seed color across notes and playlists.</p>
          <div class="demo-row" style="margin-top:18px">
            <button type="button" class="md-btn md-btn--filled js-card-action" data-message="Insights opened">${icon('trending-up')}View insights</button>
            <button type="button" class="md-btn md-btn--text js-card-action" data-message="Report snoozed">Not now</button>
          </div>
        </div>
        <div class="sparkline" aria-hidden="true">
          <span style="--h:34%"></span><span style="--h:58%"></span><span style="--h:44%"></span>
          <span style="--h:88%"></span><span style="--h:66%"></span><span style="--h:74%"></span><span style="--h:96%"></span>
        </div>
      </article>`,
      meta: ['Radius · 40 / 40 / 12 / 40', 'Motion · spring-soft', 'Accent · primary container'],
    })}

    ${specimen({
      kicker: '03 · Anatomy',
      title: 'Measured, not eyeballed',
      desc: 'Cards share one padding scale, one radius scale and one elevation ladder. That is what makes a dense product feel calm.',
      body: `<div class="anatomy">
        <div class="anatomy__card">
          <article class="md-card md-card--filled">
            <div class="md-card__body">
              <div class="md-card__eyebrow">Anatomy</div>
              <h3 class="md-card__title">Container</h3>
              <p class="md-card__text">Padding, radius and elevation are tokens — not choices made per screen.</p>
            </div>
            <div class="md-card__actions">
              <button type="button" class="md-btn md-btn--tonal md-btn--sm js-card-action" data-message="Primary action">Action</button>
              <button type="button" class="md-btn md-btn--text md-btn--sm js-card-action" data-message="Secondary action">Dismiss</button>
            </div>
          </article>
          <span class="anatomy__guide"></span>
          <span class="anatomy__pin anatomy__pin--tl">radius · 28</span>
          <span class="anatomy__pin anatomy__pin--tr">padding · 20</span>
          <span class="anatomy__pin anatomy__pin--bl">elevation · 0</span>
          <span class="anatomy__pin anatomy__pin--br">gap · 8</span>
        </div>
      </div>`,
      meta: ['Padding · 20 px', 'Action gap · 8 px', 'Title · Title large'],
    })}
  </div>`;
}

export function mount(root) {
  root.querySelectorAll('.js-card-action').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      toast(button.dataset.message || 'Card action', 'layers');
    });
  });
  root.querySelectorAll('.js-card').forEach((card) => {
    card.addEventListener('click', () => toast('Card opened', 'layers'));
  });

  root.querySelectorAll('[data-card-hover]').forEach((button) => {
    button.addEventListener('click', () => {
      root.querySelectorAll('[data-card-hover]').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
      const interactive = button.dataset.cardHover === 'lift';
      root.querySelectorAll('#card-lab .md-card').forEach((card) => {
        card.classList.toggle('md-card--interactive', interactive);
      });
    });
  });
}