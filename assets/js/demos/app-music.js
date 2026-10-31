/* Chromatic — a listening room demo */

import { loadData, saveData } from '../state.js';
import { icon, refreshIcons, toast, updateRangeFill } from '../utils.js';
import { tr } from '../i18n.js';

const TRACKS = [
  { title: 'Chromatic Drift', artist: 'Mira Vale', album: 'Tonal Fields', duration: 214, a: '#8b79b8', b: '#d8a7b8', c: '#2f2940' },
  { title: 'Soft Focus', artist: 'Noon Assembly', album: 'Surface Studies', duration: 188, a: '#6e8b7c', b: '#d9c49a', c: '#25332c' },
  { title: 'Quiet Geometry', artist: 'Aster Row', album: 'Shapes in Air', duration: 241, a: '#c07c63', b: '#e6c3a6', c: '#3d2822' },
  { title: 'After the Rain', artist: 'Mira Vale', album: 'Tonal Fields', duration: 202, a: '#6385a4', b: '#b8d0d8', c: '#22313d' },
  { title: 'Hearthlight', artist: 'Low Meridian', album: 'Warm Signals', duration: 176, a: '#9a6c52', b: '#e2b47e', c: '#35261d' },
];

const DEFAULTS = { index: 0, liked: [1], volume: 72, shuffle: false, repeat: 'off' };
let savedState = null;
let playing = false;
let progress = 46;
let timer = 0;

function getMusicState() {
  if (!savedState) savedState = { ...DEFAULTS, ...loadData('music', {}) };
  if (!Array.isArray(savedState.liked)) savedState.liked = [];
  savedState.index = Math.max(0, Math.min(TRACKS.length - 1, Number(savedState.index) || 0));
  savedState.volume = Math.max(0, Math.min(100, Number(savedState.volume) || 0));
  return savedState;
}

function persist() {
  saveData('music', getMusicState());
}

function formatTime(value) {
  const seconds = Math.max(0, Math.round(value));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

function artStyle(track) {
  return `--art-a:${track.a};--art-b:${track.b};--art-c:${track.c}`;
}

function queueHTML(activeIndex) {
  return TRACKS.map((track, index) => `<button type="button" class="music-queue__item ${index === activeIndex ? 'is-active' : ''}" data-track-index="${index}" aria-label="${tr('Play')} ${tr(track.title)}">
    <span class="music-queue__index mono">${String(index + 1).padStart(2, '0')}</span>
    <span class="music-queue__thumb" style="${artStyle(track)}"></span>
    <span class="music-queue__text"><strong>${tr(track.title)}</strong><small>${track.artist} · ${tr(track.album)}</small></span>
    <span class="music-queue__duration mono">${formatTime(track.duration)}</span>
    <span class="music-queue__playing" aria-hidden="true">${icon('audio-lines')}</span>
  </button>`).join('');
}

export function html() {
  const state = getMusicState();
  const track = TRACKS[state.index];
  return `<div class="music-app" data-music>
    <header class="app-topbar music-topbar">
      <div class="app-brand">
        <span class="app-brand__mark">${icon('disc-3')}</span>
        <span class="app-brand__text"><strong>Chromatic</strong><small>${tr('Listening room')}</small></span>
      </div>
      <div class="app-topbar__actions">
        <span class="app-live">${icon('radio')}${tr('Live session')}</span>
        <button type="button" class="app-avatar" aria-label="${tr('Profile')}">MV</button>
      </div>
    </header>

    <div class="music-body">
      <section class="music-now" aria-label="Now playing">
        <div class="music-art-wrap">
          <div class="music-art" style="${artStyle(track)}" data-music-art>
            <span class="music-art__shape"></span>
            <span class="music-art__shape music-art__shape--two"></span>
            <span class="music-art__mono mono">${tr('Tonal Fields')}</span>
            <span class="music-art__disc" aria-hidden="true"></span>
          </div>
          <div class="music-wave" aria-hidden="true">
            ${Array.from({ length: 18 }, (v, i) => `<span style="--i:${i}"></span>`).join('')}
          </div>
        </div>

        <div class="music-info">
          <span class="app-label">${icon('audio-lines')}${tr('Now playing')}</span>
          <h2 class="music-title" data-music-title>${tr(track.title)}</h2>
          <p class="music-artist" data-music-artist>${track.artist} <span>·</span> ${tr(track.album)}</p>

          <div class="music-progress">
            <input type="range" class="md-slider" id="music-progress" min="0" max="${track.duration}" step="1" value="${progress}" aria-label="Playback position">
            <div class="music-times"><span class="mono" data-music-current>${formatTime(progress)}</span><span class="mono" data-music-duration>${formatTime(track.duration)}</span></div>
          </div>

          <div class="music-controls">
            <button type="button" class="music-control ${state.shuffle ? 'is-active' : ''}" id="music-shuffle" aria-label="Shuffle" aria-pressed="${state.shuffle}">${icon('shuffle')}</button>
            <button type="button" class="music-control" id="music-prev" aria-label="Previous track">${icon('skip-back')}</button>
            <button type="button" class="music-play" id="music-play" aria-label="Play">${icon('play')}</button>
            <button type="button" class="music-control" id="music-next" aria-label="Next track">${icon('skip-forward')}</button>
            <button type="button" class="music-control ${state.repeat !== 'off' ? 'is-active' : ''}" id="music-repeat" aria-label="Repeat" aria-pressed="${state.repeat !== 'off'}">${icon(state.repeat === 'one' ? 'repeat-1' : 'repeat')}</button>
          </div>

          <div class="music-volume">
            ${icon('volume-2')}
            <input type="range" class="md-slider" id="music-volume" min="0" max="100" step="1" value="${state.volume}" aria-label="Volume">
            <span class="mono" data-music-volume>${state.volume}%</span>
            <button type="button" class="music-like ${state.liked.includes(state.index) ? 'is-liked' : ''}" id="music-like" aria-label="Like this track" aria-pressed="${state.liked.includes(state.index)}">${icon('heart')}</button>
          </div>
        </div>
      </section>

      <aside class="music-queue" aria-label="Queue">
        <div class="music-queue__head">
          <div><span class="app-label">${tr('Queue')}</span><h3>${tr('Up next')}</h3></div>
          <span class="music-queue__count mono">${TRACKS.length} tracks</span>
        </div>
        <div class="music-queue__list" id="music-queue">${queueHTML(state.index)}</div>
        <div class="music-queue__foot">
          <span class="mono">${tr('Total')} · ${formatTime(TRACKS.reduce((sum, track) => sum + track.duration, 0))}</span>
          <span class="music-queue__sim">${icon('headphones')}${tr('Simulated playback')}</span>
        </div>
      </aside>
    </div>

    <footer class="music-footer">
      <div class="music-footer__signal" aria-hidden="true">${Array.from({ length: 28 }, (v, i) => `<span style="--i:${i}"></span>`).join('')}</div>
      <span class="music-footer__note">${tr('A quiet listening room built from one seed, one spring and a single object of attention.')}</span>
      <span class="mono">MMXXVI</span>
    </footer>
  </div>`;
}

export function mount(root) {
  const state = getMusicState();
  const app = root.querySelector('[data-music]') || root;
  const art = app.querySelector('[data-music-art]');
  const title = app.querySelector('[data-music-title]');
  const artist = app.querySelector('[data-music-artist]');
  const current = app.querySelector('[data-music-current]');
  const duration = app.querySelector('[data-music-duration]');
  const progressInput = app.querySelector('#music-progress');
  const volumeInput = app.querySelector('#music-volume');
  const playBtn = app.querySelector('#music-play');
  const likeBtn = app.querySelector('#music-like');
  const queue = app.querySelector('#music-queue');
  const volumeLabel = app.querySelector('[data-music-volume]');

  if (progressInput) {
    progress = Math.min(progress, TRACKS[state.index].duration - 1);
    updateRangeFill(progressInput);
  }
  if (volumeInput) updateRangeFill(volumeInput);

  const renderTrack = () => {
    const track = TRACKS[state.index];
    if (art) art.setAttribute('style', artStyle(track));
    if (title) title.textContent = tr(track.title);
    if (artist) artist.innerHTML = `${track.artist} <span>·</span> ${tr(track.album)}`;
    if (duration) duration.textContent = formatTime(track.duration);
    if (progressInput) {
      progressInput.max = String(track.duration);
      progressInput.value = String(progress);
      updateRangeFill(progressInput);
    }
    if (current) current.textContent = formatTime(progress);
    if (queue) {
      queue.innerHTML = queueHTML(state.index);
      refreshIcons(queue);
    }
    if (likeBtn) {
      const liked = state.liked.includes(state.index);
      likeBtn.classList.toggle('is-liked', liked);
      likeBtn.setAttribute('aria-pressed', String(liked));
    }
  };

  const renderProgress = () => {
    if (progressInput) {
      progressInput.value = String(progress);
      updateRangeFill(progressInput);
    }
    if (current) current.textContent = formatTime(progress);
  };

  const setPlaying = (value) => {
    playing = value;
    app.classList.toggle('is-playing', playing);
    if (playBtn) {
      playBtn.innerHTML = icon(playing ? 'pause' : 'play');
      playBtn.setAttribute('aria-label', tr(playing ? 'Pause' : 'Play'));
      refreshIcons(playBtn);
    }
  };

  const tick = () => {
    if (!playing) return;
    progress += 0.25;
    if (progress >= TRACKS[state.index].duration) {
      goNext();
      return;
    }
    renderProgress();
  };

  const startTimer = () => {
    window.clearInterval(timer);
    timer = window.setInterval(tick, 250);
  };

  const goNext = () => {
    if (state.shuffle && TRACKS.length > 1) {
      let next = state.index;
      while (next === state.index) next = Math.floor(Math.random() * TRACKS.length);
      state.index = next;
    } else {
      state.index = (state.index + 1) % TRACKS.length;
    }
    progress = 0;
    persist();
    renderTrack();
    setPlaying(playing);
  };

  const goPrev = () => {
    if (progress > 4) {
      progress = 0;
      renderProgress();
      return;
    }
    state.index = (state.index - 1 + TRACKS.length) % TRACKS.length;
    progress = 0;
    persist();
    renderTrack();
    setPlaying(playing);
  };

  playBtn?.addEventListener('click', () => {
    if (!playing && progress >= TRACKS[state.index].duration - 1) progress = 0;
    setPlaying(!playing);
    if (playing) startTimer();
  });
  app.querySelector('#music-next')?.addEventListener('click', goNext);
  app.querySelector('#music-prev')?.addEventListener('click', goPrev);

  app.querySelector('#music-shuffle')?.addEventListener('click', (event) => {
    state.shuffle = !state.shuffle;
    event.currentTarget.classList.toggle('is-active', state.shuffle);
    event.currentTarget.setAttribute('aria-pressed', String(state.shuffle));
    persist();
  });

  app.querySelector('#music-repeat')?.addEventListener('click', (event) => {
    state.repeat = state.repeat === 'off' ? 'all' : state.repeat === 'all' ? 'one' : 'off';
    const button = event.currentTarget;
    button.innerHTML = icon(state.repeat === 'one' ? 'repeat-1' : 'repeat');
    button.classList.toggle('is-active', state.repeat !== 'off');
    button.setAttribute('aria-pressed', String(state.repeat !== 'off'));
    button.setAttribute('aria-label', tr(state.repeat === 'one' ? 'Repeat one' : state.repeat === 'all' ? 'Repeat all' : 'Repeat off'));
    refreshIcons(button);
    persist();
    toast(tr(state.repeat === 'one' ? 'Repeat one' : state.repeat === 'all' ? 'Repeat all' : 'Repeat off'), 'repeat');
  });

  progressInput?.addEventListener('input', () => {
    progress = Number(progressInput.value);
    renderProgress();
  });

  volumeInput?.addEventListener('input', () => {
    state.volume = Number(volumeInput.value);
    if (volumeLabel) volumeLabel.textContent = `${state.volume}%`;
    updateRangeFill(volumeInput);
    persist();
  });

  likeBtn?.addEventListener('click', () => {
    const index = state.liked.indexOf(state.index);
    if (index >= 0) state.liked.splice(index, 1);
    else state.liked.push(state.index);
    persist();
    const liked = state.liked.includes(state.index);
    likeBtn.classList.toggle('is-liked', liked);
    likeBtn.setAttribute('aria-pressed', String(liked));
    toast(tr(liked ? 'Added to favorites' : 'Removed from favorites'), 'heart');
  });

  queue?.addEventListener('click', (event) => {
    const item = event.target.closest('[data-track-index]');
    if (!item) return;
    const index = Number(item.dataset.trackIndex);
    if (!Number.isFinite(index)) return;
    state.index = index;
    progress = 0;
    persist();
    renderTrack();
    setPlaying(true);
    startTimer();
  });

  renderTrack();
  setPlaying(false);
  refreshIcons(app);

  return () => {
    window.clearInterval(timer);
    timer = 0;
    playing = false;
    app.classList.remove('is-playing');
  };
}
