/* ============================================================
   Applications — five complete expressive interfaces
   ============================================================ */

import { APPS, pageHead } from '../shared.js';
import { applyScopedTheme, getRoles, resolveTheme, schemeStyle } from '../color.js';
import { tr } from '../i18n.js';
import { getState, setState, subscribe } from '../state.js';
import { $, fitDisplayType, icon, refreshIcons } from '../utils.js';
import * as music from '../demos/app-music.js';
import * as weather from '../demos/app-weather.js';
import * as notes from '../demos/app-notes.js';
import * as home from '../demos/app-home.js';
import * as tasks from '../demos/app-tasks.js';

const DEMOS = { music, weather, notes, home, tasks };

const ABOUT = {
  music: {
    lede: 'A listening room that behaves like a single surface. The record, progress and queue share one palette, one spring and one point of attention.',
    features: [
      ['disc-3', 'One object, many states', 'The record is the navigation, the state and the atmosphere.'],
      ['audio-lines', 'Motion follows playback', 'Waveforms and progress respond to the same clock, without decoration.'],
      ['accessibility', 'Keyboard first', 'Every control is reachable, labelled and visibly focused.'],
    ],
  },
  weather: {
    lede: 'Weather is a feeling before it is a number. Atmos leads with atmosphere, then reveals the measurements for people who want them.',
    features: [
      ['sun-medium', 'Atmosphere as data', 'Gradients, light and shape encode condition before the first number.'],
      ['thermometer', 'Units without friction', 'Celsius and Fahrenheit switch instantly, including hourly and daily values.'],
      ['map-pin', 'Place, remembered', 'The selected city and unit preference survive a reload.'],
    ],
  },
  notes: {
    lede: 'A writing surface that gets out of the way. Folio keeps structure quiet: one list, one page, one place for the next sentence.',
    features: [
      ['notebook-pen', 'Autosave, invisibly', 'Every keystroke is persisted locally, with a calm save status instead of a spinner.'],
      ['palette', 'Tone as memory', 'Four paper tints let notes group themselves without folders or tags.'],
      ['search', 'Find the unfinished', 'Search across titles and bodies instantly, without leaving the editor.'],
    ],
  },
  home: {
    lede: 'A home interface that answers to a gesture. Hearth brings climate, light and scenes into one calm control surface.',
    features: [
      ['sliders-horizontal', 'Climate in one control', 'Target temperature, mode and current state live in a single tactile dial.'],
      ['lightbulb', 'Rooms, not device lists', 'Lights group by the way people actually use a home.'],
      ['sparkles', 'Scenes with consequence', 'Morning, Focus, Evening and Away change several devices at once.'],
    ],
  },
  tasks: {
    lede: 'An agenda that celebrates progress. Dayline turns a list into a rhythm: a few priorities, visible momentum and room to breathe.',
    features: [
      ['circle-check-big', 'Progress you can see', 'A live ring turns completed work into momentum, not a score.'],
      ['list-filter', 'Today, not everything', 'Filters keep the current moment in focus while the rest stays close.'],
      ['flame', 'Small wins compound', 'A quiet streak rewards consistency without turning work into a game.'],
    ],
  },
};

export function render({ param }) {
  const active = APPS.find((app) => app.id === param) || APPS[0];
  const demo = DEMOS[active.id];
  const about = ABOUT[active.id];
  const state = getState();
  const mode = resolveTheme(state);
  const roles = getRoles(active.seed, mode);
  const next = APPS[(APPS.indexOf(active) + 1) % APPS.length];

  const html = `<div class="page apps-page">
    ${pageHead({
      index: '07',
      kicker: 'Applications',
      title: 'Five products,<br> one language.',
      lede: 'The same expressive system, applied with a different temperament. Each interface has its own seed, composition and rhythm — and every control is real.',
      meta: ['5 interfaces', 'Persistent state', 'Scoped palettes', 'Fully interactive'],
    })}

    <nav class="app-switcher" aria-label="Applications">
      ${APPS.map((app) => `<a class="app-switcher__item" href="#/apps/${app.id}" ${app.id === active.id ? 'aria-current="page"' : ''} style="--app-seed:${app.seed}">
        <span class="app-switcher__icon">${icon(app.icon)}</span>
        <span class="app-switcher__text"><strong>${app.name}</strong><small>${tr(app.kind)}</small></span>
        <span class="app-switcher__dot"></span>
      </a>`).join('')}
    </nav>

    <div class="app-stage-wrap">
      <div class="app-stage__meta">
        <span class="app-stage__live"><span class="pulse-dot"></span>${icon('mouse-pointer-2')}Interactive prototype</span>
        <span class="mono">${active.name} · ${tr('seed')} ${active.seed} · ${active.palette}</span>
      </div>
      <section class="app-stage" data-app-stage style="${schemeStyle(active.seed, mode)}" aria-label="${active.name} — ${tr('Interactive prototype')}">
        <div data-app-root>${demo.html()}</div>
      </section>
    </div>

    <section class="app-about">
      <div class="app-about__intro">
        <span class="label-caps">About this interface</span>
        <h2>${active.name} <span>· ${tr(active.kind)}</span></h2>
        <p>${tr(about.lede)}</p>
        <div class="app-about__palette">
          <span class="app-about__seed" style="background:${active.seed}"></span>
          <span><strong>${active.palette}</strong><small class="mono">${tr('seed')} ${active.seed}</small></span>
          <button type="button" class="md-btn md-btn--tonal md-btn--sm" data-copy="${active.seed}" data-copy-message="${tr('Seed color copied')}">${icon('copy')}${tr('Copy seed')}</button>
        </div>
      </div>
      <div class="app-about__features">
        ${about.features.map(([iconName, title, copy]) => `<article class="app-feature">
          <span class="app-feature__icon">${icon(iconName)}</span>
          <h3>${tr(title)}</h3>
          <p>${tr(copy)}</p>
        </article>`).join('')}
      </div>
    </section>

    <section class="app-next">
      <div>
        <span class="label-caps">Keep exploring</span>
        <h2>Next interface</h2>
      </div>
      <a class="app-next__link" href="#/apps/${next.id}" style="--app-seed:${next.seed}">
        <span class="app-next__icon">${icon(next.icon)}</span>
        <span><strong>${next.name}</strong><small>${tr(next.kind)} · ${next.palette}</small></span>
        ${icon('arrow-right')}
      </a>
    </section>

    <div class="app-scope-colors" aria-hidden="true">
      ${['primary', 'primaryContainer', 'secondaryContainer', 'tertiary', 'tertiaryContainer', 'surfaceContainer'].map((role) => `<span style="background:${roles[role]}"></span>`).join('')}
    </div>
  </div>`;

  return {
    title: `${active.name} — Applications`,
    html,
    mount(root) {
      const stage = root.querySelector('[data-app-stage]');
      if (stage) applyScopedTheme(stage, active.seed, resolveTheme(getState()));
      setState({ lastApp: active.id }, { silent: true });
      const cleanupDemo = demo.mount(root.querySelector('[data-app-root]') || root, { app: active });
      let currentMode = resolveTheme(getState());
      const unsubscribe = subscribe((nextState) => {
        const modeNext = resolveTheme(nextState);
        if (modeNext === currentMode) return;
        currentMode = modeNext;
        if (stage) applyScopedTheme(stage, active.seed, modeNext);
      });
      refreshIcons(root);
      fitDisplayType(root);
      return () => {
        if (typeof cleanupDemo === 'function') cleanupDemo();
        unsubscribe();
      };
    },
  };
}
