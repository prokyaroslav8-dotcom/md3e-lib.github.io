import { specimen } from '../specimen.js';
import { icon, refreshIcons, toast } from '../utils.js';

export const id = 'navigation';
export const name = 'Navigation';
export const iconName = 'panel-left';
export const desc = 'Wayfinding that adapts to its surface.';

const DESTINATIONS = [
  { id: 'home', label: 'Home', icon: 'house', title: 'Good evening', text: 'Your workspace is up to date.', tiles: ['3 new notes', 'Palette: Iris', 'Motion: spring-soft', '12 tasks due'] },
  { id: 'search', label: 'Search', icon: 'search', title: 'Search', text: 'Find anything across surfaces.', tiles: ['Recent: tokens', 'Recent: shapes', 'Saved searches', 'Filters: 3'] },
  { id: 'library', label: 'Library', icon: 'library', title: 'Library', text: 'Every artifact in one tonal place.', tiles: ['Components 42', 'Palettes 6', 'Motion 18', 'Foundations 9'] },
  { id: 'profile', label: 'Profile', icon: 'circle-user', title: 'Alex Rivera', text: 'Design systems · Zurich', tiles: ['Theme: Auto', 'Seed: #6750A4', 'Motion: Full', 'Sync: On'] },
];

function destinationTiles(destination) {
  return destination.tiles.map((tile, index) => `<div class="demo-tile ${index === 0 ? 'demo-tile--accent' : ''}">
    <strong>${tile.split(':')[0]}</strong>
    <span>${tile.includes(':') ? tile.split(':')[1].trim() : 'Expressive surface'}</span>
  </div>`).join('');
}

export function html() {
  return `<div class="studio-stack">
    ${specimen({
      kicker: '01 · Navigation bar',
      title: 'Three to five destinations, at thumb height',
      desc: 'The bar is the compact pattern: a persistent, always-reachable row of destinations with an animated tonal indicator.',
      body: `<div class="nav-demo">
        <div class="demo-frame">
          <div class="demo-frame__top">${icon('smartphone')}<span class="demo-frame__title" id="navbar-title">Good evening</span><span class="tag" style="margin-left:auto">compact</span></div>
          <div class="demo-frame__body">
            <p class="demo-note" id="navbar-text">Your workspace is up to date.</p>
            <div class="demo-frame__tiles" id="navbar-tiles">${destinationTiles(DESTINATIONS[0])}</div>
          </div>
          <nav class="demo-navbar demo-frame__nav" id="demo-navbar" aria-label="Demo navigation bar">
            ${DESTINATIONS.map((item, index) => `<button type="button" class="demo-navbar__item ${index === 0 ? 'is-active' : ''}" data-dest="${item.id}" ${index === 0 ? 'aria-current="page"' : ''}>
              <span class="demo-navbar__indicator">${icon(item.icon)}</span><span>${item.label}</span>
            </button>`).join('')}
          </nav>
        </div>
        <aside class="demo-panel demo-panel--tonal">
          <span class="demo-label">When to use it</span>
          <div class="demo-col" style="margin-top:14px">
            <div class="spread"><span class="body-sm">Destinations</span><span class="tag">3–5</span></div>
            <div class="spread"><span class="body-sm">Height</span><span class="tag">64–80 px</span></div>
            <div class="spread"><span class="body-sm">Indicator</span><span class="tag tag--tonal">secondary container</span></div>
            <div class="spread"><span class="body-sm">Icons</span><span class="tag">24 px + label</span></div>
          </div>
          <p class="demo-note" style="margin-top:16px">Try each destination — content and indicator move together.</p>
        </aside>
      </div>`,
      meta: ['Compact · bar', 'Medium · rail', 'Expanded · drawer'],
    })}

    ${specimen({
      kicker: '02 · Navigation rail',
      title: 'A rail that grows a spine',
      desc: 'On medium windows the rail keeps destinations reachable while freeing horizontal space. Expand it when labels matter more than room.',
      tools: `<label class="md-switch">
        <input type="checkbox" id="rail-expand" aria-label="Expand navigation rail">
        <span class="md-switch__track"><span class="md-switch__thumb"></span></span>
        <span class="md-switch__label">Extended</span>
      </label>`,
      body: `<div class="demo-frame demo-frame--rail" id="rail-frame" style="min-height:360px">
        <nav class="demo-rail demo-rail-panel" id="demo-rail" aria-label="Demo navigation rail">
          <button type="button" class="icon-button" id="rail-menu" aria-label="Menu">${icon('menu')}</button>
          ${DESTINATIONS.map((item, index) => `<button type="button" class="demo-rail__item ${index === 0 ? 'is-active' : ''}" data-dest="${item.id}">
            ${icon(item.icon)}<span>${item.label}</span>
          </button>`).join('')}
          <span style="flex:1"></span>
          <button type="button" class="demo-rail__item" data-rail-action>${icon('settings')}<span>Settings</span></button>
        </nav>
        <div class="demo-frame__main">
          <div class="demo-frame__top">${icon('panel-left')}<span class="demo-frame__title" id="rail-title">Good evening</span><span class="tag" style="margin-left:auto">medium</span></div>
          <div class="demo-frame__body">
            <p class="demo-note" id="rail-text">Your workspace is up to date.</p>
            <div class="demo-frame__tiles" id="rail-tiles">${destinationTiles(DESTINATIONS[0])}</div>
          </div>
        </div>
      </div>`,
      meta: ['Collapsed · 88 px', 'Extended · 200 px', 'Indicator · pill'],
    })}

    ${specimen({
      kicker: '03 · Navigation drawer',
      title: 'Room for every destination',
      desc: 'When the list gets long, the drawer takes over: it slides in on a spring, dims the content behind it and returns focus on close.',
      body: `<div class="demo-frame">
        <div class="demo-frame__top">
          <button type="button" class="icon-button" id="drawer-toggle" aria-label="Open navigation drawer" aria-expanded="false">${icon('menu')}</button>
          <span class="demo-frame__title" id="drawer-title">Good evening</span>
          <span class="tag" style="margin-left:auto">expanded</span>
        </div>
        <div class="demo-drawer-wrap" id="drawer-wrap">
          <aside class="demo-drawer demo-drawer-panel" aria-label="Demo navigation drawer">
            <div class="demo-drawer__title">Surface</div>
            ${DESTINATIONS.map((item, index) => `<button type="button" class="demo-drawer__item ${index === 0 ? 'is-active' : ''}" data-dest="${item.id}">${icon(item.icon)}<span>${item.label}</span></button>`).join('')}
            <div class="demo-drawer__rule"></div>
            <button type="button" class="demo-drawer__item" data-dest="settings">${icon('settings')}<span>Settings</span></button>
            <button type="button" class="demo-drawer__item" data-dest="help">${icon('circle-help')}<span>Help</span></button>
          </aside>
          <div class="demo-scrim" data-drawer-close></div>
          <div class="demo-frame__body" style="padding:22px">
            <p class="demo-note" id="drawer-text">Your workspace is up to date. Open the drawer to switch destinations.</p>
            <div class="demo-frame__tiles" id="drawer-tiles">${destinationTiles(DESTINATIONS[0])}</div>
          </div>
        </div>
      </div>`,
      meta: ['Width · 240–360 px', 'Scrim · 32%', 'Motion · spring-soft'],
    })}

    ${specimen({
      kicker: '04 · Tabs',
      title: 'Peer views, one shared indicator',
      desc: 'Tabs switch between siblings at the same level. The indicator travels on a spring instead of cutting.',
      body: `<div class="demo-panel">
        <div class="demo-tabs" role="tablist" id="demo-tabs">
          <button type="button" role="tab" aria-selected="true" data-tab="overview">Overview</button>
          <button type="button" role="tab" aria-selected="false" data-tab="activity">Activity</button>
          <button type="button" role="tab" aria-selected="false" data-tab="tokens">Tokens</button>
          <button type="button" role="tab" aria-selected="false" data-tab="access">Accessibility</button>
          <span class="demo-tabs__ink" id="tabs-ink"></span>
        </div>
        <div class="demo-tab-panels">
          <div role="tabpanel" data-panel="overview"><p class="demo-note">A tab represents a peer view of the same object. Four at most, so the row never scrolls on a phone.</p></div>
          <div role="tabpanel" data-panel="activity" hidden><p class="demo-note">Recent changes appear here with the same tonal hierarchy as the rest of the product.</p></div>
          <div role="tabpanel" data-panel="tokens" hidden><p class="demo-note">Each tab is a state layer plus a travelling indicator, both driven by motion tokens.</p></div>
          <div role="tabpanel" data-panel="access" hidden><p class="demo-note">Arrow keys move between tabs, Home and End jump to the edges, and the selected tab is announced.</p></div>
        </div>
      </div>`,
      meta: ['Height · 48 px', 'Indicator · 3 px', 'Roving tabindex'],
    })}
  </div>`;
}

function syncDestination(scope, destination) {
  const title = scope.querySelector('[id$="-title"]');
  const text = scope.querySelector('[id$="-text"]');
  const tiles = scope.querySelector('[id$="-tiles"]');
  if (title) title.textContent = destination.title;
  if (text) text.textContent = destination.text;
  if (tiles) tiles.innerHTML = destinationTiles(destination);
}

function bindNavigationSet(scope) {
  scope.querySelectorAll('[data-dest]').forEach((button) => {
    button.addEventListener('click', () => {
      const destination = DESTINATIONS.find((item) => item.id === button.dataset.dest);
      if (!destination) {
        toast(`${button.textContent.trim()} · demo destination`, 'compass');
        return;
      }
      scope.querySelectorAll('[data-dest]').forEach((item) => {
        item.classList.toggle('is-active', item === button);
        if (item === button) item.setAttribute('aria-current', 'page');
        else item.removeAttribute('aria-current');
      });
      syncDestination(scope, destination);
    });
  });
}

export function mount(root) {
  bindNavigationSet(root);

  const rail = root.querySelector('#demo-rail');
  root.querySelector('#rail-expand')?.addEventListener('change', (event) => {
    rail?.classList.toggle('demo-rail--expanded', event.target.checked);
    root.querySelector('#rail-frame')?.classList.toggle('demo-frame--expanded-rail', event.target.checked);
  });
  root.querySelector('#rail-menu')?.addEventListener('click', () => toast('Rail menu', 'menu'));

  const drawerWrap = root.querySelector('#drawer-wrap');
  const drawerToggle = root.querySelector('#drawer-toggle');
  const setDrawer = (open) => {
    drawerWrap?.classList.toggle('is-open', open);
    drawerToggle?.setAttribute('aria-expanded', String(open));
    if (drawerToggle) drawerToggle.setAttribute('aria-label', open ? 'Close navigation drawer' : 'Open navigation drawer');
  };
  drawerToggle?.addEventListener('click', () => setDrawer(!drawerWrap?.classList.contains('is-open')));
  root.querySelector('[data-drawer-close]')?.addEventListener('click', () => setDrawer(false));
  root.querySelectorAll('#drawer-wrap [data-dest]').forEach((button) => {
    button.addEventListener('click', () => setDrawer(false));
  });
  root.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && drawerWrap?.classList.contains('is-open')) setDrawer(false);
  });

  const tabs = root.querySelector('#demo-tabs');
  const ink = root.querySelector('#tabs-ink');
  const moveInk = () => {
    const active = tabs?.querySelector('[aria-selected="true"]');
    if (!active || !ink) return;
    ink.style.left = `${active.offsetLeft}px`;
    ink.style.width = `${active.offsetWidth}px`;
  };
  root.querySelectorAll('#demo-tabs [role="tab"]').forEach((tab) => {
    tab.addEventListener('click', () => {
      root.querySelectorAll('#demo-tabs [role="tab"]').forEach((item) => item.setAttribute('aria-selected', String(item === tab)));
      root.querySelectorAll('[data-panel]').forEach((panel) => { panel.hidden = panel.dataset.panel !== tab.dataset.tab; });
      moveInk();
    });
  });
  window.requestAnimationFrame(moveInk);
  if (tabs) new ResizeObserver(moveInk).observe(tabs);

  root.querySelectorAll('[data-rail-action]').forEach((button) => {
    button.addEventListener('click', () => toast('Settings opened', 'settings'));
  });
  refreshIcons();
}