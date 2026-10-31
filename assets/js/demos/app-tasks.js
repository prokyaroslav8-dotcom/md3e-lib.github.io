/* Dayline — an agenda that celebrates progress */

import { loadData, saveData } from '../state.js';
import { icon, refreshIcons, toast } from '../utils.js';
import { getLanguage, tr } from '../i18n.js';

const PROJECTS = [
  { id: 'design', name: 'Design', color: 'var(--primary)' },
  { id: 'work', name: 'Work', color: 'var(--tertiary)' },
  { id: 'personal', name: 'Personal', color: 'var(--secondary)' },
];

const SEEDS = [
  { id: 't-1', title: 'Review the motion token sheet', project: 'design', due: 0, done: false, priority: 'high' },
  { id: 't-2', title: 'Send accessibility notes to the team', project: 'work', due: 0, done: true, priority: 'medium' },
  { id: 't-3', title: 'Sketch the empty state for Folio', project: 'design', due: 0, done: false, priority: 'high' },
  { id: 't-4', title: 'Book the studio for Thursday', project: 'personal', due: 1, done: false, priority: 'low' },
  { id: 't-5', title: 'Read the dynamic color RFC', project: 'work', due: 2, done: false, priority: 'medium' },
  { id: 't-6', title: 'Water the plants', project: 'personal', due: 0, done: true, priority: 'low' },
  { id: 't-7', title: 'Polish the shape playground', project: 'design', due: 3, done: false, priority: 'medium' },
];

const FILTERS = [
  { id: 'today', name: 'Today', icon: 'sun' },
  { id: 'upcoming', name: 'Upcoming', icon: 'calendar-days' },
  { id: 'all', name: 'All', icon: 'layers' },
  { id: 'done', name: 'Done', icon: 'circle-check-big' },
];

let tasksState = null;

function getTasksState() {
  if (!tasksState) {
    const stored = loadData('tasks', null);
    tasksState = stored && Array.isArray(stored.tasks)
      ? stored
      : { tasks: SEEDS.map((task) => ({ ...task })), filter: 'today', project: 'all' };
    if (!FILTERS.some((filter) => filter.id === tasksState.filter)) tasksState.filter = 'today';
    if (!['all', ...PROJECTS.map((project) => project.id)].includes(tasksState.project)) tasksState.project = 'all';
  }
  return tasksState;
}

function persist() {
  saveData('tasks', getTasksState());
}

function projectName(id) {
  return tr(PROJECTS.find((project) => project.id === id)?.name || 'Personal');
}

function dueLabel(offset) {
  if (offset <= 0) return tr('Today');
  if (offset === 1) return tr('Tomorrow');
  const locale = getLanguage() === 'ru' ? 'ru-RU' : 'en-US';
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return new Intl.DateTimeFormat(locale, { weekday: 'short', month: 'short', day: 'numeric' }).format(date);
}

function completedCount() {
  return getTasksState().tasks.filter((task) => task.done).length;
}

function visibleTasks() {
  const state = getTasksState();
  let items = [...state.tasks];
  if (state.project !== 'all') items = items.filter((task) => task.project === state.project);
  if (state.filter === 'today') items = items.filter((task) => !task.done && task.due <= 0);
  else if (state.filter === 'upcoming') items = items.filter((task) => !task.done && task.due > 0);
  else if (state.filter === 'done') items = items.filter((task) => task.done);
  const priority = { high: 0, medium: 1, low: 2 };
  return items.sort((a, b) => Number(a.done) - Number(b.done) || (priority[a.priority] ?? 1) - (priority[b.priority] ?? 1) || a.due - b.due);
}

function filterCount(id) {
  const state = getTasksState();
  const base = state.project === 'all' ? state.tasks : state.tasks.filter((task) => task.project === state.project);
  if (id === 'today') return base.filter((task) => !task.done && task.due <= 0).length;
  if (id === 'upcoming') return base.filter((task) => !task.done && task.due > 0).length;
  if (id === 'done') return base.filter((task) => task.done).length;
  return base.length;
}

function taskHTML(task) {
  return `<article class="task-row ${task.done ? 'is-done' : ''}" data-task-id="${task.id}">
    <label class="task-check">
      <input type="checkbox" data-task-toggle ${task.done ? 'checked' : ''} aria-label="${task.done ? tr('Mark as not done') : tr('Mark as done')}">
      <span class="task-check__box">${icon('check')}</span>
    </label>
    <span class="task-row__priority" data-priority="${task.priority}" aria-label="${tr(task.priority)}"></span>
    <span class="task-row__copy">
      <strong>${task.title}</strong>
      <small>${projectName(task.project)} <span>·</span> ${dueLabel(task.due)}</small>
    </span>
    <button type="button" class="task-row__delete" data-task-delete aria-label="${tr('Delete task')}">${icon('x')}</button>
  </article>`;
}

function listHTML() {
  const items = visibleTasks();
  if (!items.length) {
    return `<div class="tasks-empty">
      <span class="tasks-empty__art">${icon('sparkles')}</span>
      <h3>${tr('Nothing here. Enjoy the space.')}</h3>
      <p>${tr('Add a task below, or switch filters to see the rest of the day.')}</p>
    </div>`;
  }
  return items.map(taskHTML).join('');
}

function progressHTML() {
  const state = getTasksState();
  const total = Math.max(1, state.tasks.length);
  const done = completedCount();
  const percent = Math.round(done / total * 100);
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percent / 100);
  return `<div class="tasks-progress">
    <div class="tasks-progress__ring">
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r="${radius}" class="tasks-ring__track"></circle>
        <circle cx="50" cy="50" r="${radius}" class="tasks-ring__value" style="stroke-dasharray:${circumference};stroke-dashoffset:${offset}"></circle>
      </svg>
      <span><strong>${percent}%</strong><small>${tr('complete')}</small></span>
    </div>
    <div class="tasks-progress__copy">
      <span class="app-label">${icon('activity')}${tr('Momentum')}</span>
      <h3>${done} ${tr('of')} ${state.tasks.length} ${tr('done')}</h3>
      <p>${percent >= 70 ? tr('A strong day. Protect the last quiet hour.') : tr('Small steps count. Keep the list human-sized.')}</p>
    </div>
  </div>`;
}

function sidebarHTML() {
  return `<aside class="tasks-side">
    ${progressHTML()}
    <nav class="task-filters" aria-label="${tr('Task filters')}">
      ${FILTERS.map((filter) => `<button type="button" data-task-filter="${filter.id}" aria-pressed="${getTasksState().filter === filter.id}">
        ${icon(filter.icon)}<span>${tr(filter.name)}</span><span class="mono">${filterCount(filter.id)}</span>
      </button>`).join('')}
    </nav>
    <div class="task-projects">
      <span class="app-label">${icon('folder')}${tr('Projects')}</span>
      <button type="button" data-task-project="all" aria-pressed="${getTasksState().project === 'all'}"><span class="task-project-dot" style="background:conic-gradient(var(--primary) 0 33%, var(--tertiary) 33% 66%, var(--secondary) 66% 100%)"></span>${tr('All projects')}<span class="mono">${getTasksState().tasks.length}</span></button>
      ${PROJECTS.map((project) => `<button type="button" data-task-project="${project.id}" aria-pressed="${getTasksState().project === project.id}"><span class="task-project-dot" style="background:${project.color}"></span>${projectName(project.id)}<span class="mono">${getTasksState().tasks.filter((task) => task.project === project.id).length}</span></button>`).join('')}
    </div>
    <div class="task-streak">
      <span class="task-streak__icon">${icon('flame')}</span>
      <div><strong>4 ${tr('day streak')}</strong><small>${tr('A little every day.')}</small></div>
      <div class="task-streak__days" aria-hidden="true">${Array.from({ length: 7 }, (v, i) => `<span class="${i < 4 ? 'is-lit' : ''}"></span>`).join('')}</div>
    </div>
  </aside>`;
}

function headingHTML() {
  const state = getTasksState();
  const items = visibleTasks();
  const date = new Intl.DateTimeFormat(getLanguage() === 'ru' ? 'ru-RU' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date());
  return `<header class="tasks-heading">
    <div>
      <span class="app-label">${icon('calendar-days')}${date}</span>
      <h2>${tr('Make today count.')}</h2>
      <p>${items.length} ${tr('tasks in view')} · ${tr('one thing at a time')}</p>
    </div>
    <span class="tasks-heading__count">${completedCount()}<small>/${state.tasks.length}</small></span>
  </header>`;
}

export function html() {
  const state = getTasksState();
  return `<div class="tasks-app" data-tasks>
    <header class="app-topbar tasks-topbar">
      <div class="app-brand">
        <span class="app-brand__mark">${icon('list-checks')}</span>
        <span class="app-brand__text"><strong>Dayline</strong><small>${tr('An agenda with room to breathe')}</small></span>
      </div>
      <div class="app-topbar__actions">
        <span class="app-live">${icon('flame')}4 ${tr('day streak')}</span>
        <button type="button" class="app-avatar" aria-label="${tr('Profile')}">DR</button>
      </div>
    </header>

    <div class="tasks-body">
      ${sidebarHTML()}
      <section class="tasks-main">
        ${headingHTML()}
        <form class="task-add" id="task-add">
          <span class="task-add__icon">${icon('plus')}</span>
          <input type="text" id="task-input" placeholder="${tr('Add a task for today…')}" maxlength="120" autocomplete="off" aria-label="${tr('New task')}">
          <label class="task-add__project">
            <span class="sr-only">${tr('Project')}</span>
            <select id="task-project" aria-label="${tr('Project')}">
              ${PROJECTS.map((project) => `<option value="${project.id}">${projectName(project.id)}</option>`).join('')}
            </select>
            ${icon('chevron-down')}
          </label>
          <button type="submit" class="md-btn md-btn--filled md-btn--sm">${icon('arrow-up')}${tr('Add')}</button>
        </form>
        <div class="task-list" id="task-list">${listHTML()}</div>
        <div class="tasks-main__foot">
          <button type="button" class="md-btn md-btn--text md-btn--sm" id="tasks-clear">${icon('sparkles')}${tr('Clear completed')}</button>
          <span class="mono">${state.tasks.filter((task) => task.done).length} ${tr('completed')}</span>
        </div>
      </section>
    </div>
  </div>`;
}

export function mount(root) {
  const app = root.querySelector('[data-tasks]') || root;
  const state = getTasksState();
  const list = app.querySelector('#task-list');
  const form = app.querySelector('#task-add');
  const input = app.querySelector('#task-input');
  const projectSelect = app.querySelector('#task-project');
  let filter = state.filter;
  let project = state.project;

  const renderAll = () => {
    state.filter = filter;
    state.project = project;
    if (list) {
      list.innerHTML = listHTML();
      refreshIcons(list);
    }
    const side = app.querySelector('.tasks-side');
    if (side) {
      side.outerHTML = sidebarHTML();
      bindSidebar();
      refreshIcons(app);
    }
    const main = app.querySelector('.tasks-main');
    const heading = main?.querySelector('.tasks-heading');
    if (heading) {
      heading.outerHTML = headingHTML();
      refreshIcons(main);
    }
    persist();
  };

  const bindSidebar = () => {
    app.querySelectorAll('[data-task-filter]').forEach((button) => {
      button.addEventListener('click', () => {
        filter = button.dataset.taskFilter;
        renderAll();
      });
    });
    app.querySelectorAll('[data-task-project]').forEach((button) => {
      button.addEventListener('click', () => {
        project = button.dataset.taskProject;
        renderAll();
      });
    });
  };

  const toggleTask = (row) => {
    const task = state.tasks.find((item) => item.id === row.dataset.taskId);
    if (!task) return;
    task.done = !task.done;
    row.classList.toggle('is-done', task.done);
    persist();
    toast(tr(task.done ? 'Task complete' : 'Task reopened'), task.done ? 'check' : 'rotate-ccw');
    renderAll();
  };

  list?.addEventListener('change', (event) => {
    const toggle = event.target.closest('[data-task-toggle]');
    if (!toggle) return;
    const row = toggle.closest('[data-task-id]');
    if (row) toggleTask(row);
  });
  list?.addEventListener('click', (event) => {
    const del = event.target.closest('[data-task-delete]');
    if (!del) return;
    const row = del.closest('[data-task-id]');
    const task = state.tasks.find((item) => item.id === row?.dataset.taskId);
    if (!task) return;
    const index = state.tasks.indexOf(task);
    state.tasks.splice(index, 1);
    persist();
    renderAll();
    toast(tr('Task deleted'), 'trash-2');
  });

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const title = input?.value.trim();
    if (!title) {
      input?.focus();
      return;
    }
    state.tasks.unshift({
      id: `t-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
      title,
      project: projectSelect?.value || 'work',
      due: 0,
      done: false,
      priority: 'medium',
    });
    if (input) input.value = '';
    persist();
    renderAll();
    toast(tr('Task added'), 'plus');
    input?.focus();
  });

  app.querySelector('#tasks-clear')?.addEventListener('click', () => {
    state.tasks = state.tasks.filter((task) => !task.done);
    if (!state.tasks.length) {
      // Keep the editor friendly with one fresh placeholder instead of an empty shell.
      state.tasks = [{ id: `t-${Date.now()}`, title: tr('Plan the next small step'), project: 'design', due: 0, done: false, priority: 'low' }];
    }
    persist();
    renderAll();
    toast(tr('Completed tasks cleared'), 'sparkles');
  });

  bindSidebar();
  refreshIcons(app);
  return () => persist();
}
