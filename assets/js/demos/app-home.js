/* Hearth — a smart home surface */

import { loadData, saveData } from '../state.js';
import { icon, refreshIcons, toast, updateRangeFill } from '../utils.js';
import { getLanguage, tr } from '../i18n.js';

const ROOMS = [
  { id: 'living', name: 'Living room' },
  { id: 'bedroom', name: 'Bedroom' },
  { id: 'kitchen', name: 'Kitchen' },
  { id: 'studio', name: 'Studio' },
];

const LIGHTS = [
  { id: 'living-main', name: 'Main light', room: 'living', on: true, brightness: 78, tone: 'Warm white' },
  { id: 'living-floor', name: 'Floor lamp', room: 'living', on: true, brightness: 42, tone: 'Soft amber' },
  { id: 'living-shelf', name: 'Shelf wash', room: 'living', on: false, brightness: 30, tone: 'Candlelight' },
  { id: 'bedroom-bed', name: 'Bedside pair', room: 'bedroom', on: false, brightness: 22, tone: 'Warm white' },
  { id: 'bedroom-ceiling', name: 'Ceiling', room: 'bedroom', on: false, brightness: 55, tone: 'Neutral' },
  { id: 'kitchen-counter', name: 'Counter', room: 'kitchen', on: true, brightness: 64, tone: 'Crisp white' },
  { id: 'kitchen-pendant', name: 'Pendants', room: 'kitchen', on: true, brightness: 48, tone: 'Warm white' },
  { id: 'studio-key', name: 'Key light', room: 'studio', on: true, brightness: 88, tone: 'Studio white' },
  { id: 'studio-fill', name: 'Fill panel', room: 'studio', on: false, brightness: 38, tone: 'Soft white' },
];

const SCENES = [
  { id: 'morning', name: 'Morning', icon: 'sunrise', target: 21, mode: 'Heat', note: 'Light, gradually' },
  { id: 'focus', name: 'Focus', icon: 'target', target: 20.5, mode: 'Auto', note: 'Studio and desk' },
  { id: 'evening', name: 'Evening', icon: 'moon', target: 22, mode: 'Heat', note: 'Low and warm' },
  { id: 'away', name: 'Away', icon: 'door-closed', target: 19, mode: 'Eco', note: 'Everything quiet' },
];

const SCENE_LIGHTS = {
  morning: { 'living-main': 82, 'living-floor': 55, 'bedroom-bed': 35, 'kitchen-counter': 75, 'kitchen-pendant': 55, 'studio-key': 0, 'studio-fill': 0 },
  focus: { 'living-main': 65, 'living-floor': 20, 'bedroom-bed': 0, 'kitchen-counter': 45, 'kitchen-pendant': 40, 'studio-key': 92, 'studio-fill': 55 },
  evening: { 'living-main': 32, 'living-floor': 24, 'bedroom-bed': 18, 'kitchen-counter': 38, 'kitchen-pendant': 30, 'studio-key': 0, 'studio-fill': 0 },
  away: {},
};

const DEFAULTS = {
  target: 21.5,
  mode: 'Heat',
  room: 'living',
  locked: true,
  blinds: 64,
  speaker: false,
  air: true,
  lights: Object.fromEntries(LIGHTS.map((light) => [light.id, { on: light.on, brightness: light.brightness }])),
};

let homeState = null;

function getHomeState() {
  if (!homeState) {
    const stored = loadData('home', {});
    homeState = {
      ...DEFAULTS,
      ...stored,
      lights: {
        ...DEFAULTS.lights,
        ...(stored.lights || {}),
      },
    };
  }
  return homeState;
}

function lightState(light) {
  return getHomeState().lights[light.id] || { on: light.on, brightness: light.brightness };
}

function tempLabel(value) {
  return `${value.toFixed(1)}°`;
}

function energyValue() {
  const state = getHomeState();
  const active = LIGHTS.reduce((sum, light) => {
    const item = lightState(light);
    return sum + (item.on ? item.brightness / 100 * 0.42 : 0.015);
  }, 0);
  return (2.6 + active + (state.air ? 0.35 : 0) + (state.speaker ? 0.18 : 0)).toFixed(1);
}

function sceneChipsHTML(activeScene = '') {
  return SCENES.map((scene) => `<button type="button" class="home-scene ${scene.id === activeScene ? 'is-active' : ''}" data-scene="${scene.id}">
    ${icon(scene.icon)}<span><strong>${tr(scene.name)}</strong><small>${tr(scene.note)}</small></span>
  </button>`).join('');
}

function roomTabsHTML() {
  const state = getHomeState();
  return ROOMS.map((room) => {
    const roomLights = LIGHTS.filter((light) => light.room === room.id);
    const active = roomLights.filter((light) => lightState(light).on).length;
    return `<button type="button" class="home-room ${state.room === room.id ? 'is-active' : ''}" data-room="${room.id}" aria-selected="${state.room === room.id}">
      <span>${tr(room.name)}</span><span class="mono">${active}/${roomLights.length}</span>
    </button>`;
  }).join('');
}

function lightCardsHTML() {
  const state = getHomeState();
  return LIGHTS.filter((light) => light.room === state.room).map((light) => {
    const item = lightState(light);
    return `<article class="light-card ${item.on ? 'is-on' : ''}" data-light-id="${light.id}">
      <div class="light-card__top">
        <span class="light-card__icon">${icon('lightbulb')}</span>
        <span class="light-card__copy"><strong>${tr(light.name)}</strong><small><span data-light-readout>${item.brightness}%</span> · ${tr(light.tone)}</small></span>
        <label class="md-switch">
          <input type="checkbox" data-light-toggle ${item.on ? 'checked' : ''} aria-label="${tr(light.name)}">
          <span class="md-switch__track"><span class="md-switch__thumb"></span></span>
        </label>
      </div>
      <input type="range" class="md-slider" data-light-brightness min="1" max="100" step="1" value="${item.brightness}" aria-label="${tr('Brightness')} · ${tr(light.name)}">
    </article>`;
  }).join('');
}

function updateEnergyUI(app) {
  const value = energyValue();
  const total = app.querySelector('#home-energy-value');
  if (total) total.textContent = value;
  const bars = app.querySelectorAll('[data-energy-bar]');
  bars.forEach((bar, index) => {
    const lit = LIGHTS.filter((light) => lightState(light).on).length;
    bar.style.height = `${Math.min(100, 18 + ((index + 1) * 7 + lit * 4))}%`;
  });
}

function renderLights(app) {
  const panel = app.querySelector('#home-lights');
  if (panel) {
    panel.innerHTML = lightCardsHTML();
    refreshIcons(panel);
    panel.querySelectorAll('input[type="range"].md-slider').forEach((input) => updateRangeFill(input));
  }
  const rooms = app.querySelector('#home-rooms');
  if (rooms) rooms.innerHTML = roomTabsHTML();
  updateEnergyUI(app);
}

export function html() {
  const state = getHomeState();
  const locale = getLanguage() === 'ru' ? 'ru-RU' : 'en-US';
  const date = new Intl.DateTimeFormat(locale, { weekday: 'long', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date());
  return `<div class="home-app" data-home>
    <header class="app-topbar home-topbar">
      <div class="app-brand">
        <span class="app-brand__mark">${icon('house-plug')}</span>
        <span class="app-brand__text"><strong>Hearth</strong><small>${tr('A home that answers')}</small></span>
      </div>
      <div class="app-topbar__actions">
        <span class="app-live">${icon('wifi')}${tr('All systems calm')}</span>
        <button type="button" class="app-avatar" aria-label="${tr('Profile')}">MK</button>
      </div>
    </header>

    <div class="home-body">
      <section class="home-intro">
        <div>
          <span class="app-label">${icon('clock-3')}${date} · ${tr('Home')}</span>
          <h2 class="home-title">${tr('Your home is')}<br>${tr('settling in.')}</h2>
          <p class="home-sub">${LIGHTS.filter((light) => lightState(light).on).length} ${tr('lights on')} · ${tr('Climate steady at')} ${tempLabel(state.target)}</p>
        </div>
        <div class="home-scenes" role="group" aria-label="Scenes">${sceneChipsHTML()}</div>
      </section>

      <div class="home-summary">
        <article class="thermostat-card">
          <div class="thermostat-card__head"><span class="app-label">${icon('thermometer')}${tr('Living room')}</span><span class="tag">${tr(state.mode)}</span></div>
          <div class="thermostat-ring" style="--temp:${Math.round((state.target - 16) / 8 * 100)}%">
            <div class="thermostat-ring__inner">
              <span class="mono">${tr('Target')}</span>
              <strong id="home-target">${tempLabel(state.target)}</strong>
              <span class="thermostat-mode" id="home-mode">${tr(state.mode)}</span>
            </div>
          </div>
          <div class="thermostat-controls">
            <button type="button" class="thermostat-step" data-temp-step="-0.5" aria-label="${tr('Lower temperature')}">${icon('minus')}</button>
            <span class="mono">16° — 24°</span>
            <button type="button" class="thermostat-step" data-temp-step="0.5" aria-label="${tr('Raise temperature')}">${icon('plus')}</button>
          </div>
          <div class="thermostat-modes" role="group" aria-label="Climate mode">
            ${['Heat', 'Cool', 'Auto', 'Eco'].map((mode) => `<button type="button" data-home-mode="${mode}" aria-pressed="${state.mode === mode}">${tr(mode)}</button>`).join('')}
          </div>
        </article>

        <article class="energy-card">
          <div class="energy-card__head">
            <span class="app-label">${icon('leaf')}${tr('Energy today')}</span>
            <span class="tag">−12%</span>
          </div>
          <div class="energy-card__value"><strong id="home-energy-value">${energyValue()}</strong><span class="mono">${tr('kWh')}</span></div>
          <p>${tr('A little lower than your weekly average.')}</p>
          <div class="energy-chart" aria-hidden="true">
            ${Array.from({ length: 12 }, (v, i) => `<span style="height:${18 + ((i + 1) * 6 + (i % 3) * 9)}%" data-energy-bar></span>`).join('')}
          </div>
          <div class="energy-card__foot"><span class="mono">06:00</span><span class="mono">${tr('Now')}</span></div>
          <div class="energy-card__solar">${icon('sun')}<span>${tr('Solar covered')} <strong>42%</strong></span>${icon('arrow-up-right')}</div>
        </article>
      </div>

      <section class="home-rooms" aria-labelledby="home-rooms-title">
        <div class="home-section-head">
          <div><span class="app-label">${icon('lamp-floor')}${tr('Rooms')}</span><h3 id="home-rooms-title">${tr('Light, by room')}</h3></div>
          <button type="button" class="md-btn md-btn--text md-btn--sm" id="home-all-off">${icon('power')}${tr('All lights off')}</button>
        </div>
        <div class="home-room-tabs" role="tablist" aria-label="Rooms" id="home-rooms">${roomTabsHTML()}</div>
        <div class="home-lights" id="home-lights">${lightCardsHTML()}</div>
      </section>

      <section class="home-devices" aria-labelledby="home-devices-title">
        <div class="home-section-head">
          <div><span class="app-label">${icon('layout-grid')}${tr('More at home')}</span><h3 id="home-devices-title">${tr('The quiet helpers')}</h3></div>
          <span class="mono">${tr('4 devices')}</span>
        </div>
        <div class="home-device-grid">
          <article class="home-device ${state.locked ? 'is-on' : ''}" data-device="lock">
            <span class="home-device__icon">${icon('lock')}</span>
            <div><strong>${tr('Front door')}</strong><small id="home-lock-status">${state.locked ? tr('Locked') : tr('Unlocked')}</small></div>
            <label class="md-switch"><input type="checkbox" id="home-lock" ${state.locked ? 'checked' : ''} aria-label="${tr('Front door lock')}"><span class="md-switch__track"><span class="md-switch__thumb"></span></span></label>
          </article>
          <article class="home-device ${state.speaker ? 'is-on' : ''}" data-device="speaker">
            <span class="home-device__icon">${icon('speaker')}</span>
            <div><strong>${tr('Living room speaker')}</strong><small id="home-speaker-status">${state.speaker ? tr('Playing soft focus') : tr('Paused')}</small></div>
            <label class="md-switch"><input type="checkbox" id="home-speaker" ${state.speaker ? 'checked' : ''} aria-label="${tr('Living room speaker')}"><span class="md-switch__track"><span class="md-switch__thumb"></span></span></label>
          </article>
          <article class="home-device home-device--blinds" data-device="blinds">
            <span class="home-device__icon">${icon('blinds')}</span>
            <div><strong>${tr('Blinds')}</strong><small><span id="home-blinds-value">${state.blinds}%</span> ${tr('open')}</small></div>
            <input type="range" class="md-slider" id="home-blinds" min="0" max="100" step="1" value="${state.blinds}" aria-label="${tr('Blinds position')}">
          </article>
          <article class="home-device ${state.air ? 'is-on' : ''}" data-device="air">
            <span class="home-device__icon">${icon('wind')}</span>
            <div><strong>${tr('Air purifier')}</strong><small id="home-air-status">${state.air ? tr('Air is clean') : tr('Standby')}</small></div>
            <label class="md-switch"><input type="checkbox" id="home-air" ${state.air ? 'checked' : ''} aria-label="${tr('Air purifier')}"><span class="md-switch__track"><span class="md-switch__thumb"></span></span></label>
          </article>
        </div>
      </section>
    </div>
  </div>`;
}

export function mount(root) {
  const app = root.querySelector('[data-home]') || root;
  const state = getHomeState();
  let timer = 0;

  const persist = () => saveData('home', state);

  const updateThermostat = () => {
    const target = app.querySelector('#home-target');
    if (target) target.textContent = tempLabel(state.target);
    const ring = app.querySelector('.thermostat-ring');
    if (ring) ring.style.setProperty('--temp', `${Math.round((state.target - 16) / 8 * 100)}%`);
    app.querySelectorAll('[data-home-mode]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.homeMode === state.mode)));
    const mode = app.querySelector('#home-mode');
    if (mode) mode.textContent = tr(state.mode);
    const tag = app.querySelector('.thermostat-card__head .tag');
    if (tag) tag.textContent = tr(state.mode);
  };

  app.querySelectorAll('[data-temp-step]').forEach((button) => {
    button.addEventListener('click', () => {
      state.target = Math.max(16, Math.min(24, Math.round((state.target + Number(button.dataset.tempStep)) * 2) / 2));
      persist();
      updateThermostat();
    });
  });

  app.querySelectorAll('[data-home-mode]').forEach((button) => {
    button.addEventListener('click', () => {
      state.mode = button.dataset.homeMode;
      persist();
      updateThermostat();
      toast(`${tr('Climate mode')} · ${tr(state.mode)}`, 'thermometer');
    });
  });

  app.querySelectorAll('[data-scene]').forEach((button) => {
    button.addEventListener('click', () => {
      const scene = SCENES.find((item) => item.id === button.dataset.scene);
      if (!scene) return;
      state.target = scene.target;
      state.mode = scene.mode;
      const map = SCENE_LIGHTS[scene.id] || {};
      for (const light of LIGHTS) {
        const item = state.lights[light.id] || {};
        const brightness = map[light.id];
        if (typeof brightness === 'number') {
          item.on = brightness > 0;
          item.brightness = Math.max(1, brightness);
        } else if (!Object.keys(map).length) {
          item.on = false;
        }
        state.lights[light.id] = item;
      }
      persist();
      app.querySelectorAll('[data-scene]').forEach((item) => item.classList.toggle('is-active', item === button));
      updateThermostat();
      renderLights(app);
      toast(`${tr('Scene applied')} · ${tr(scene.name)}`, scene.icon);
    });
  });

  app.querySelector('#home-rooms')?.addEventListener('click', (event) => {
    const tab = event.target.closest('[data-room]');
    if (!tab) return;
    state.room = tab.dataset.room;
    persist();
    renderLights(app);
  });

  app.querySelector('#home-lights')?.addEventListener('change', (event) => {
    const toggle = event.target.closest('[data-light-toggle]');
    if (!toggle) return;
    const card = toggle.closest('[data-light-id]');
    const light = LIGHTS.find((item) => item.id === card?.dataset.lightId);
    if (!light) return;
    const item = state.lights[light.id] || { on: false, brightness: 50 };
    item.on = toggle.checked;
    state.lights[light.id] = item;
    card.classList.toggle('is-on', item.on);
    persist();
    renderLights(app);
    const active = LIGHTS.filter((entry) => lightState(entry).on).length;
    const sub = app.querySelector('.home-sub');
    if (sub) sub.textContent = `${active} ${tr('lights on')} · ${tr('Climate steady at')} ${tempLabel(state.target)}`;
  });

  app.querySelector('#home-lights')?.addEventListener('input', (event) => {
    const slider = event.target.closest('[data-light-brightness]');
    if (!slider) return;
    const card = slider.closest('[data-light-id]');
    const light = LIGHTS.find((item) => item.id === card?.dataset.lightId);
    if (!light) return;
    const item = state.lights[light.id] || { on: true, brightness: 50 };
    item.brightness = Number(slider.value);
    item.on = true;
    state.lights[light.id] = item;
    updateRangeFill(slider);
    const readout = card.querySelector('[data-light-readout]');
    if (readout) readout.textContent = `${item.brightness}%`;
    card.classList.add('is-on');
    persist();
    updateEnergyUI(app);
  });

  app.querySelector('#home-all-off')?.addEventListener('click', () => {
    for (const light of LIGHTS) {
      state.lights[light.id] = { ...(state.lights[light.id] || {}), on: false };
    }
    persist();
    app.querySelectorAll('[data-scene]').forEach((item) => item.classList.remove('is-active'));
    renderLights(app);
    const sub = app.querySelector('.home-sub');
    if (sub) sub.textContent = `0 ${tr('lights on')} · ${tr('Climate steady at')} ${tempLabel(state.target)}`;
    toast(tr('All lights off'), 'power');
  });

  app.querySelector('#home-lock')?.addEventListener('change', (event) => {
    state.locked = event.target.checked;
    persist();
    const status = app.querySelector('#home-lock-status');
    if (status) status.textContent = state.locked ? tr('Locked') : tr('Unlocked');
    event.target.closest('.home-device')?.classList.toggle('is-on', state.locked);
  });

  app.querySelector('#home-speaker')?.addEventListener('change', (event) => {
    state.speaker = event.target.checked;
    persist();
    const status = app.querySelector('#home-speaker-status');
    if (status) status.textContent = state.speaker ? tr('Playing soft focus') : tr('Paused');
    event.target.closest('.home-device')?.classList.toggle('is-on', state.speaker);
    updateEnergyUI(app);
  });

  app.querySelector('#home-air')?.addEventListener('change', (event) => {
    state.air = event.target.checked;
    persist();
    const status = app.querySelector('#home-air-status');
    if (status) status.textContent = state.air ? tr('Air is clean') : tr('Standby');
    event.target.closest('.home-device')?.classList.toggle('is-on', state.air);
    updateEnergyUI(app);
  });

  const blinds = app.querySelector('#home-blinds');
  if (blinds) {
    updateRangeFill(blinds);
    blinds.addEventListener('input', () => {
      state.blinds = Number(blinds.value);
      updateRangeFill(blinds);
      const value = app.querySelector('#home-blinds-value');
      if (value) value.textContent = `${state.blinds}%`;
      persist();
    });
  }

  app.querySelectorAll('input[type="range"].md-slider').forEach((input) => updateRangeFill(input));
  refreshIcons(app);

  return () => {
    window.clearTimeout(timer);
    persist();
  };
}
