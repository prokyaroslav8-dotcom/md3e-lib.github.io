/* Folio — a quiet notes app */

import { loadData, saveData } from '../state.js';
import { escapeHTML, icon, refreshIcons, toast } from '../utils.js';
import { getLanguage, tr } from '../i18n.js';

const TONES = [
  { id: 'sage', label: 'Sage' },
  { id: 'rose', label: 'Rose' },
  { id: 'amber', label: 'Amber' },
  { id: 'sky', label: 'Sky' },
];

const SEEDS = [
  {
    id: 'n-quiet', title: 'The shape of quiet', tone: 'sage', pinned: true,
    body: 'Silence is not the absence of information. It is the room a product leaves for a person to think.\n\nStart with the loudest element. Remove one layer of emphasis. Then another. What remains is usually the thing that mattered.',
    updatedAt: Date.now() - 1000 * 60 * 22,
  },
  {
    id: 'n-material', title: 'Material notes · 08', tone: 'rose', pinned: true,
    body: 'Expressive is not louder. It is more specific.\n\n— Use shape to describe hierarchy\n— Let color carry one clear emotion\n— Give motion a subject and a destination\n— Keep the reading path quiet',
    updatedAt: Date.now() - 1000 * 60 * 60 * 5,
  },
  {
    id: 'n-questions', title: 'Open questions for the team', tone: 'amber', pinned: false,
    body: 'What would this screen feel like if it trusted the user more?\n\nCould the primary action be a shape instead of a button? Does the transition explain the change, or merely decorate it?\n\nTry the quieter version first.',
    updatedAt: Date.now() - 1000 * 60 * 60 * 27,
  },
  {
    id: 'n-sunday', title: 'Sunday, slowly', tone: 'sky', pinned: false,
    body: 'Coffee. A long table. The particular light that makes every surface look like it has been waiting for you.\n\nNo notifications before noon. A small rule, but a good one.',
    updatedAt: Date.now() - 1000 * 60 * 60 * 51,
  },
];

let notesState = null;
let saveTimer = 0;
let listTimer = 0;
let searchTerm = '';

function getNotesState() {
  if (!notesState) {
    const stored = loadData('notes', null);
    if (stored && Array.isArray(stored.notes)) notesState = stored;
    else notesState = { notes: SEEDS.map((note) => ({ ...note })), selectedId: SEEDS[0].id };
    if (!notesState.notes.length) notesState.selectedId = null;
    if (!notesState.notes.some((note) => note.id === notesState.selectedId)) notesState.selectedId = notesState.notes[0]?.id || null;
  }
  return notesState;
}

function persist() {
  saveData('notes', getNotesState());
}

function selectedNote() {
  const state = getNotesState();
  return state.notes.find((note) => note.id === state.selectedId) || null;
}

function wordCount(note) {
  if (!note) return 0;
  return `${note.title} ${note.body}`.trim().split(/\s+/).filter(Boolean).length;
}

function formatUpdated(timestamp) {
  const delta = Date.now() - timestamp;
  const minutes = Math.round(delta / 60000);
  if (minutes < 1) return tr('just now');
  if (minutes < 60) return getLanguage() === 'ru' ? `${minutes} мин назад` : `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return getLanguage() === 'ru' ? `${hours} ч назад` : `${hours} h ago`;
  return new Intl.DateTimeFormat(getLanguage() === 'ru' ? 'ru-RU' : 'en-US', { month: 'short', day: 'numeric' }).format(new Date(timestamp));
}

function listHTML() {
  const state = getNotesState();
  const term = searchTerm.trim().toLowerCase();
  const notes = state.notes
    .filter((note) => !term || `${tr(note.title)} ${tr(note.body)}`.toLowerCase().includes(term))
    .sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.updatedAt - a.updatedAt);

  if (!notes.length) {
    return `<div class="notes-list__empty">${icon('search-x')}<strong>${term ? tr('Nothing found') : tr('No notes yet')}</strong><span>${term ? tr('Try a shorter phrase.') : tr('Start with a single sentence.')}</span></div>`;
  }

  return notes.map((note) => `<button type="button" class="note-card ${note.id === state.selectedId ? 'is-active' : ''}" data-note-id="${note.id}" data-tone="${note.tone}" aria-current="${note.id === state.selectedId ? 'true' : 'false'}">
    <div class="note-card__top">
      <span class="note-card__tone"></span>
      <span class="note-card__date mono">${formatUpdated(note.updatedAt)}</span>
      ${note.pinned ? `<span class="note-card__pin">${icon('pin')}</span>` : ''}
    </div>
    <strong class="note-card__title">${tr(note.title) || tr('Untitled note')}</strong>
    <span class="note-card__excerpt">${tr(note.body).replace(/\s+/g, ' ').trim() || tr('A blank page, waiting.')}</span>
    <span class="note-card__meta mono">${wordCount(note)} ${tr('words')}</span>
  </button>`).join('');
}

function editorHTML(note) {
  if (!note) {
    return `<div class="notes-empty">
      <span class="notes-empty__icon">${icon('notebook-pen')}</span>
      <h3>${tr('A quiet place for the next thought.')}</h3>
      <p>${tr('Create a note and start with one honest sentence.')}</p>
      <button type="button" class="md-btn md-btn--filled" id="notes-empty-new">${icon('plus')}${tr('New note')}</button>
    </div>`;
  }
  return `<div class="notes-editor__toolbar">
    <div class="notes-editor__status">
      <span class="notes-saved"><span class="pulse-dot"></span><span id="note-status">${tr('Saved')} · ${formatUpdated(note.updatedAt)}</span></span>
      ${note.pinned ? `<span class="tag tag--tonal">${icon('pin')}${tr('Pinned')}</span>` : ''}
    </div>
    <div class="notes-editor__actions">
      <div class="note-tones" role="group" aria-label="Note tone">
        ${TONES.map((tone) => `<button type="button" class="note-tone" data-note-tone="${tone.id}" data-tone="${tone.id}" aria-label="${tone.label} paper" title="${tone.label}" aria-pressed="${note.tone === tone.id}"></button>`).join('')}
      </div>
      <button type="button" class="app-icon-button note-pin ${note.pinned ? 'is-active' : ''}" id="note-pin" aria-label="Pin note" aria-pressed="${note.pinned}">${icon('pin')}</button>
      <button type="button" class="app-icon-button note-delete" id="note-delete" aria-label="Delete note" data-armed="false">${icon('trash-2')}</button>
    </div>
  </div>
  <div class="notes-editor__page" data-tone="${note.tone}">
    <input class="notes-title" id="note-title" value="${escapeHTML(tr(note.title))}" placeholder="${tr('Untitled note')}" aria-label="${tr('Note title')}">
    <div class="notes-meta-row">
      <span class="mono">${new Intl.DateTimeFormat(getLanguage() === 'ru' ? 'ru-RU' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date(note.updatedAt))}</span>
      <span class="mono" id="note-words">${wordCount(note)} ${tr('words')}</span>
    </div>
    <textarea class="note-body" id="note-body" placeholder="${tr('Start writing…')}" aria-label="${tr('Note body')}">${escapeHTML(tr(note.body))}</textarea>
    <div class="notes-editor__foot">
      <span class="notes-editor__hint">${icon('keyboard')}${tr('Changes save automatically')}</span>
      <span class="notes-editor__chars mono" id="note-chars">${note.body.length} / 4000</span>
    </div>
  </div>`;
}

export function html() {
  const state = getNotesState();
  const note = selectedNote();
  return `<div class="notes-app" data-notes>
    <header class="app-topbar notes-topbar">
      <div class="app-brand">
        <span class="app-brand__mark">${icon('notebook-pen')}</span>
        <span class="app-brand__text"><strong>Folio</strong><small>${tr('Notes, without noise')}</small></span>
      </div>
      <label class="notes-search">
        ${icon('search')}
        <input type="search" id="notes-search" placeholder="${tr('Find a note')}" aria-label="Find a note">
        <span class="kbd">/</span>
      </label>
      <div class="app-topbar__actions">
        <button type="button" class="md-btn md-btn--filled md-btn--sm" id="notes-new">${icon('plus')}${tr('New note')}</button>
        <button type="button" class="app-avatar" aria-label="${tr('Profile')}">AL</button>
      </div>
    </header>

    <div class="notes-body">
      <aside class="notes-side" aria-label="Notes">
        <div class="notes-side__head">
          <span class="app-label">${icon('layers')}${tr('All notes')}</span>
          <span class="mono" id="notes-count">${state.notes.length}</span>
        </div>
        <div class="notes-list" id="notes-list">${listHTML()}</div>
        <div class="notes-side__foot">
          <span class="mono">${tr('Local to this browser')}</span>
          ${icon('lock')}
        </div>
      </aside>

      <section class="notes-editor" id="notes-editor" aria-label="Note editor">
        ${editorHTML(note)}
      </section>
    </div>
  </div>`;
}

export function mount(root) {
  const app = root.querySelector('[data-notes]') || root;
  const state = getNotesState();
  const list = app.querySelector('#notes-list');
  const editor = app.querySelector('#notes-editor');
  const count = app.querySelector('#notes-count');
  const search = app.querySelector('#notes-search');
  let armedTimer = 0;

  const renderList = () => {
    if (!list) return;
    list.innerHTML = listHTML();
    if (count) count.textContent = String(state.notes.length);
    refreshIcons(list);
  };

  const renderEditor = () => {
    if (!editor) return;
    editor.innerHTML = editorHTML(selectedNote());
    refreshIcons(editor);
    bindEditor();
    const active = list?.querySelector('.is-active');
    if (active && list) active.scrollIntoView({ block: 'nearest' });
  };

  const scheduleSave = (immediate = false) => {
    window.clearTimeout(saveTimer);
    const status = app.querySelector('#note-status');
    if (status) status.textContent = tr('Saving…');
    saveTimer = window.setTimeout(() => {
      persist();
      const node = app.querySelector('#note-status');
      if (node) node.textContent = `${tr('Saved')} · ${formatUpdated(selectedNote()?.updatedAt || Date.now())}`;
    }, immediate ? 0 : 420);
  };

  const scheduleList = () => {
    window.clearTimeout(listTimer);
    listTimer = window.setTimeout(renderList, 450);
  };

  function bindEditor() {
    const note = selectedNote();
    if (!note) {
      app.querySelector('#notes-empty-new')?.addEventListener('click', createNote);
      return;
    }
    const title = app.querySelector('#note-title');
    const body = app.querySelector('#note-body');
    const words = app.querySelector('#note-words');
    const chars = app.querySelector('#note-chars');
    const status = app.querySelector('#note-status');
    const pin = app.querySelector('#note-pin');
    const del = app.querySelector('#note-delete');

    title?.addEventListener('input', () => {
      note.title = title.value.slice(0, 120);
      note.updatedAt = Date.now();
      if (words) words.textContent = `${wordCount(note)} ${tr('words')}`;
      scheduleSave();
      scheduleList();
    });
    body?.addEventListener('input', () => {
      note.body = body.value.slice(0, 4000);
      note.updatedAt = Date.now();
      if (words) words.textContent = `${wordCount(note)} ${tr('words')}`;
      if (chars) chars.textContent = `${note.body.length} / 4000`;
      scheduleSave();
      scheduleList();
    });
    body?.addEventListener('keydown', (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        persist();
        if (status) status.textContent = `${tr('Saved')} · ${tr('just now')}`;
        toast(tr('Note saved'), 'notebook-pen');
      }
    });
    app.querySelectorAll('[data-note-tone]').forEach((button) => {
      button.addEventListener('click', () => {
        note.tone = button.dataset.noteTone;
        note.updatedAt = Date.now();
        persist();
        app.querySelectorAll('[data-note-tone]').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
        const page = app.querySelector('.notes-editor__page');
        if (page) page.dataset.tone = note.tone;
        renderList();
      });
    });
    pin?.addEventListener('click', () => {
      note.pinned = !note.pinned;
      note.updatedAt = Date.now();
      persist();
      renderEditor();
      renderList();
      toast(tr(note.pinned ? 'Note pinned' : 'Note unpinned'), 'pin');
    });
    del?.addEventListener('click', () => {
      if (del.dataset.armed !== 'true') {
        del.dataset.armed = 'true';
        del.classList.add('is-armed');
        del.innerHTML = icon('trash-2');
        del.setAttribute('aria-label', tr('Click again to delete'));
        toast(tr('Click again to delete'), 'trash-2');
        window.clearTimeout(armedTimer);
        armedTimer = window.setTimeout(() => {
          del.dataset.armed = 'false';
          del.classList.remove('is-armed');
          del.setAttribute('aria-label', tr('Delete note'));
        }, 3000);
        return;
      }
      const index = state.notes.findIndex((item) => item.id === note.id);
      if (index >= 0) state.notes.splice(index, 1);
      state.selectedId = state.notes[index]?.id || state.notes[index - 1]?.id || null;
      persist();
      renderList();
      renderEditor();
      toast(tr('Note deleted'), 'trash-2');
    });
  }

  function selectNote(id) {
    if (!state.notes.some((note) => note.id === id)) return;
    state.selectedId = id;
    persist();
    renderList();
    renderEditor();
  }

  function createNote() {
    const note = { id: `n-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`, title: '', body: '', tone: 'sage', pinned: false, updatedAt: Date.now() };
    state.notes.unshift(note);
    state.selectedId = note.id;
    persist();
    renderList();
    renderEditor();
    app.querySelector('#note-title')?.focus();
  }

  list?.addEventListener('click', (event) => {
    const card = event.target.closest('[data-note-id]');
    if (card) selectNote(card.dataset.noteId);
  });

  app.querySelector('#notes-new')?.addEventListener('click', createNote);
  search?.addEventListener('input', () => {
    searchTerm = search.value;
    renderList();
  });
  document.addEventListener('keydown', handleShortcut);
  function handleShortcut(event) {
    if (event.key !== '/' || event.target.matches('input, textarea, [contenteditable]')) return;
    event.preventDefault();
    search?.focus();
  }

  renderList();
  bindEditor();
  refreshIcons(app);

  return () => {
    window.clearTimeout(saveTimer);
    window.clearTimeout(listTimer);
    window.clearTimeout(armedTimer);
    document.removeEventListener('keydown', handleShortcut);
    persist();
  };
}
