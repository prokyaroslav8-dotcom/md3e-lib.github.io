/* Atmos — weather as atmosphere */

import { loadData, saveData } from '../state.js';
import { icon, refreshIcons, toast } from '../utils.js';
import { getLanguage, tr } from '../i18n.js';

const LOCATIONS = [
  {
    id: 'zurich', name: 'Zurich', country: 'Switzerland', condition: 'clear', title: 'Soft light',
    summary: 'A clear afternoon with a gentle lake breeze and long shadows.',
    temp: 21, feels: 22, high: 24, low: 14, humidity: 48, wind: 9, uv: 4, pressure: 1018,
    sunrise: '07:12', sunset: '19:42',
    hourly: [21, 22, 23, 24, 23, 21, 19, 17],
    hourlyCond: ['clear', 'clear', 'clear', 'partly', 'partly', 'clear', 'clear', 'clear'],
    rain: [0, 0, 0, 0, 5, 5, 0, 0],
    daily: [[24, 14, 'clear'], [23, 13, 'partly'], [21, 12, 'cloud'], [19, 11, 'rain'], [22, 13, 'partly']],
  },
  {
    id: 'moscow', name: 'Moscow', country: 'Russia', condition: 'rain', title: 'Fine rain',
    summary: 'Low cloud and steady drizzle. The city sounds softer than usual.',
    temp: 8, feels: 6, high: 9, low: 4, humidity: 82, wind: 14, uv: 1, pressure: 1006,
    sunrise: '07:32', sunset: '17:58',
    hourly: [8, 8, 9, 9, 8, 7, 6, 5],
    hourlyCond: ['rain', 'rain', 'rain', 'cloud', 'cloud', 'rain', 'rain', 'cloud'],
    rain: [70, 75, 60, 40, 35, 55, 65, 30],
    daily: [[9, 4, 'rain'], [10, 5, 'cloud'], [12, 6, 'partly'], [11, 4, 'rain'], [9, 3, 'cloud']],
  },
  {
    id: 'lisbon', name: 'Lisbon', country: 'Portugal', condition: 'clear', title: 'Atlantic sun',
    summary: 'Bright, dry and unhurried. The light stays golden until late.',
    temp: 26, feels: 27, high: 28, low: 18, humidity: 39, wind: 17, uv: 7, pressure: 1022,
    sunrise: '07:46', sunset: '19:12',
    hourly: [26, 27, 28, 28, 27, 25, 23, 21],
    hourlyCond: ['clear', 'clear', 'clear', 'clear', 'clear', 'partly', 'clear', 'clear'],
    rain: [0, 0, 0, 0, 0, 0, 0, 0],
    daily: [[28, 18, 'clear'], [27, 18, 'clear'], [25, 17, 'partly'], [24, 16, 'partly'], [26, 17, 'clear']],
  },
  {
    id: 'kyoto', name: 'Kyoto', country: 'Japan', condition: 'cloud', title: 'Quiet overcast',
    summary: 'A soft grey ceiling over the city, with barely any wind.',
    temp: 17, feels: 17, high: 19, low: 12, humidity: 61, wind: 6, uv: 2, pressure: 1014,
    sunrise: '06:04', sunset: '17:24',
    hourly: [17, 18, 19, 19, 18, 16, 15, 13],
    hourlyCond: ['cloud', 'cloud', 'partly', 'partly', 'cloud', 'cloud', 'cloud', 'cloud'],
    rain: [10, 5, 5, 0, 10, 15, 15, 10],
    daily: [[19, 12, 'cloud'], [20, 13, 'partly'], [21, 13, 'clear'], [19, 12, 'rain'], [18, 11, 'cloud']],
  },
  {
    id: 'reykjavik', name: 'Reykjavik', country: 'Iceland', condition: 'snow', title: 'Snow showers',
    summary: 'Cold air, fast clouds and snow that arrives in quiet waves.',
    temp: 1, feels: -3, high: 2, low: -2, humidity: 76, wind: 28, uv: 0, pressure: 996,
    sunrise: '09:18', sunset: '16:42',
    hourly: [1, 1, 0, 0, -1, -1, -2, -2],
    hourlyCond: ['snow', 'snow', 'cloud', 'snow', 'snow', 'cloud', 'snow', 'cloud'],
    rain: [80, 75, 30, 65, 70, 25, 60, 20],
    daily: [[2, -2, 'snow'], [1, -3, 'snow'], [3, -1, 'cloud'], [4, 0, 'rain'], [2, -2, 'snow']],
  },
];

const CONDITION_LABELS = {
  clear: 'Clear',
  partly: 'Partly cloudy',
  cloud: 'Overcast',
  rain: 'Rain',
  snow: 'Snow',
  storm: 'Storm',
};

const CONDITION_ICONS = {
  clear: 'sun',
  partly: 'cloud-sun',
  cloud: 'cloud',
  rain: 'cloud-rain',
  snow: 'cloud-snow',
  storm: 'cloud-lightning',
};

const DEFAULTS = { location: 'zurich', unit: 'C' };
let weatherState = null;

function getWeatherState() {
  if (!weatherState) weatherState = { ...DEFAULTS, ...loadData('weather', {}) };
  if (!LOCATIONS.some((location) => location.id === weatherState.location)) weatherState.location = DEFAULTS.location;
  if (!['C', 'F'].includes(weatherState.unit)) weatherState.unit = 'C';
  return weatherState;
}

function activeLocation() {
  return LOCATIONS.find((location) => location.id === getWeatherState().location) || LOCATIONS[0];
}

function temp(value) {
  return getWeatherState().unit === 'F' ? Math.round(value * 9 / 5 + 32) : Math.round(value);
}

function unitLabel() {
  return getWeatherState().unit === 'F' ? '°F' : '°C';
}

function snowOrRain(condition) {
  return ['rain', 'snow', 'storm'].includes(condition);
}

function buildHourly(location) {
  const now = new Date();
  return location.hourly.map((value, index) => {
    const date = new Date(now.getTime() + index * 60 * 60 * 1000);
    const label = index === 0 ? tr('Now') : new Intl.DateTimeFormat(getLanguage() === 'ru' ? 'ru-RU' : 'en-GB', { hour: '2-digit', minute: '2-digit', hour12: false }).format(date);
    const condition = location.hourlyCond[index];
    return `<div class="weather-hour ${index === 0 ? 'is-now' : ''}">
      <span class="mono">${label}</span>
      <span class="weather-hour__icon" data-cond="${condition}">${icon(CONDITION_ICONS[condition])}</span>
      <strong>${temp(value)}°</strong>
      <span class="weather-hour__rain" aria-hidden="true"><span style="height:${Math.max(6, location.rain[index])}%"></span></span>
      <small class="mono">${location.rain[index]}%</small>
    </div>`;
  }).join('');
}

function buildDaily(location) {
  const now = new Date();
  const locale = getLanguage() === 'ru' ? 'ru-RU' : 'en-US';
  return location.daily.map(([high, low, condition], index) => {
    const date = new Date(now.getTime() + index * 86400000);
    const label = index === 0 ? tr('Today') : new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(date);
    const range = Math.max(4, high - low);
    const left = Math.max(0, Math.min(82, (low + 12) * 2.2));
    return `<div class="weather-day">
      <span class="weather-day__name">${label}</span>
      <span class="weather-day__condition" data-cond="${condition}">${icon(CONDITION_ICONS[condition])}<span>${tr(CONDITION_LABELS[condition])}</span></span>
      <span class="weather-day__track"><span class="weather-day__bar" style="left:${left}%;width:${range * 2.9}%;--day-a:${location.temp - low}"></span></span>
      <span class="weather-day__temps"><strong>${temp(high)}°</strong><small>${temp(low)}°</small></span>
    </div>`;
  }).join('');
}

function buildDetails(location) {
  const items = [
    ['droplets', tr('Humidity'), `${location.humidity}%`, tr('Relative humidity')],
    ['wind', tr('Wind'), `${location.wind} ${tr('km/h')}`, tr('North-west')],
    ['sun', tr('UV index'), String(location.uv), location.uv >= 6 ? tr('High') : location.uv >= 3 ? tr('Moderate') : tr('Low')],
    ['gauge', tr('Pressure'), `${location.pressure} ${tr('hPa')}`, tr('Stable')],
    ['sunrise', tr('Sunrise'), location.sunrise, tr('Local time')],
    ['sunset', tr('Sunset'), location.sunset, tr('Local time')],
  ];
  return items.map(([iconName, label, value, note]) => `<div class="weather-detail">
    <span class="weather-detail__icon">${icon(iconName)}</span>
    <span><span class="mono">${label}</span><strong>${value}</strong><small>${note}</small></span>
  </div>`).join('');
}

function buildMetrics(location) {
  return `<span>${icon('arrow-up')}${tr('High')} ${temp(location.high)}°</span>
    <span>${icon('arrow-down')}${tr('Low')} ${temp(location.low)}°</span>
    <span>${icon('droplets')}${tr('Feels like')} ${temp(location.feels)}°</span>`;
}

function dateLabel() {
  const locale = getLanguage() === 'ru' ? 'ru-RU' : 'en-US';
  return new Intl.DateTimeFormat(locale, { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date());
}

export function html() {
  const state = getWeatherState();
  const location = activeLocation();
  return `<div class="weather-app" data-weather>
    <header class="app-topbar weather-topbar">
      <div class="app-brand">
        <span class="app-brand__mark">${icon('cloud-sun')}</span>
        <span class="app-brand__text"><strong>Atmos</strong><small>${tr('Weather, with atmosphere')}</small></span>
      </div>
      <div class="app-topbar__actions">
        <div class="weather-units" role="group" aria-label="Temperature units">
          <button type="button" data-unit="C" aria-pressed="${state.unit === 'C'}">°C</button>
          <button type="button" data-unit="F" aria-pressed="${state.unit === 'F'}">°F</button>
        </div>
        <label class="weather-location">
          ${icon('map-pin')}
          <select id="weather-location" aria-label="Choose location">
            ${LOCATIONS.map((item) => `<option value="${item.id}" ${item.id === location.id ? 'selected' : ''}>${item.name}</option>`).join('')}
          </select>
          ${icon('chevron-down')}
        </label>
        <button type="button" class="app-icon-button" id="weather-refresh" aria-label="Refresh forecast">${icon('refresh-cw')}</button>
      </div>
    </header>

    <div class="weather-body">
      <section class="weather-hero" aria-labelledby="weather-title">
        <div class="weather-hero__copy">
          <span class="app-label">${icon('map-pin')}<span id="weather-date">${dateLabel()}</span> · <span id="weather-city">${location.name}</span></span>
          <div class="weather-temperature"><span id="weather-temp">${temp(location.temp)}</span><sup id="weather-unit">${unitLabel()}</sup></div>
          <h2 id="weather-title" class="weather-title">${tr(location.title)}</h2>
          <p class="weather-summary" id="weather-summary">${tr(location.summary)}</p>
          <div class="weather-metrics" id="weather-metrics">${buildMetrics(location)}</div>
        </div>
        <div class="weather-visual" data-condition="${location.condition}" id="weather-visual" aria-hidden="true">
          <span class="weather-glow"></span>
          <span class="weather-sun"></span>
          <span class="weather-cloud weather-cloud--one"></span>
          <span class="weather-cloud weather-cloud--two"></span>
          <span class="weather-rain"></span>
          <span class="weather-snow"></span>
          <span class="weather-bolt">${icon('zap')}</span>
          <span class="weather-visual__label mono">${tr(CONDITION_LABELS[location.condition])} · ${temp(location.temp)}${unitLabel()}</span>
        </div>
      </section>

      <section class="weather-hourly" aria-labelledby="weather-hourly-title">
        <div class="weather-section-head">
          <div><span class="app-label">${icon('clock-3')}${tr('Next 8 hours')}</span><h3 id="weather-hourly-title">${tr('The day, hour by hour')}</h3></div>
          <span class="mono" id="weather-updated">${tr('Updated just now')}</span>
        </div>
        <div class="weather-hours" id="weather-hours">${buildHourly(location)}</div>
      </section>

      <div class="weather-lower">
        <section class="weather-daily" aria-labelledby="weather-daily-title">
          <div class="weather-section-head">
            <div><span class="app-label">${icon('calendar-days')}${tr('Forecast')}</span><h3 id="weather-daily-title">${tr('Five days ahead')}</h3></div>
            <span class="mono">${location.name}</span>
          </div>
          <div class="weather-days" id="weather-days">${buildDaily(location)}</div>
        </section>

        <section class="weather-details" aria-labelledby="weather-details-title">
          <div class="weather-section-head">
            <div><span class="app-label">${icon('sliders-horizontal')}${tr('Conditions')}</span><h3 id="weather-details-title">${tr('The details')}</h3></div>
          </div>
          <div class="weather-detail-grid" id="weather-details">${buildDetails(location)}</div>
        </section>
      </div>
    </div>
  </div>`;
}

export function mount(root) {
  const app = root.querySelector('[data-weather]') || root;
  const state = getWeatherState();
  let refreshTimer = 0;
  let refreshing = false;

  const render = () => {
    const location = activeLocation();
    const setText = (selector, value) => {
      const node = app.querySelector(selector);
      if (node) node.textContent = value;
    };
    setText('#weather-date', dateLabel());
    setText('#weather-city', location.name);
    setText('#weather-temp', String(temp(location.temp)));
    setText('#weather-unit', unitLabel());
    setText('#weather-title', tr(location.title));
    setText('#weather-summary', tr(location.summary));
    const metrics = app.querySelector('#weather-metrics');
    if (metrics) metrics.innerHTML = buildMetrics(location);
    const visual = app.querySelector('#weather-visual');
    if (visual) {
      visual.dataset.condition = location.condition;
      const label = visual.querySelector('.weather-visual__label');
      if (label) label.textContent = `${tr(CONDITION_LABELS[location.condition])} · ${temp(location.temp)}${unitLabel()}`;
    }
    const hours = app.querySelector('#weather-hours');
    if (hours) hours.innerHTML = buildHourly(location);
    const days = app.querySelector('#weather-days');
    if (days) days.innerHTML = buildDaily(location);
    const details = app.querySelector('#weather-details');
    if (details) details.innerHTML = buildDetails(location);
    app.querySelectorAll('[data-unit]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.unit === state.unit)));
    app.querySelectorAll('.weather-hour__icon, .weather-day__condition').forEach((node) => {
      const condition = node.dataset.cond;
      if (condition) node.setAttribute('title', tr(CONDITION_LABELS[condition]));
    });
    const select = app.querySelector('#weather-location');
    if (select) select.value = location.id;
    refreshIcons(app);
  };

  app.querySelectorAll('[data-unit]').forEach((button) => {
    button.addEventListener('click', () => {
      state.unit = button.dataset.unit;
      saveData('weather', state);
      render();
    });
  });

  app.querySelector('#weather-location')?.addEventListener('change', (event) => {
    state.location = event.target.value;
    saveData('weather', state);
    render();
  });

  app.querySelector('#weather-refresh')?.addEventListener('click', (event) => {
    if (refreshing) return;
    refreshing = true;
    const button = event.currentTarget;
    button.classList.add('is-spinning');
    const updated = app.querySelector('#weather-updated');
    if (updated) updated.textContent = tr('Refreshing…');
    window.clearTimeout(refreshTimer);
    refreshTimer = window.setTimeout(() => {
      refreshing = false;
      button.classList.remove('is-spinning');
      if (updated) updated.textContent = tr('Updated just now');
      toast(tr('Forecast refreshed'), 'cloud-sun');
    }, 900);
  });

  render();
  return () => window.clearTimeout(refreshTimer);
}
