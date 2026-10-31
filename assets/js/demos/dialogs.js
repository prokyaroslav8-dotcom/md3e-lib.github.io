import { specimen } from '../specimen.js';
import { icon, toast, trapFocus } from '../utils.js';

export const id = 'dialogs';
export const name = 'Dialogs';
export const iconName = 'app-window';
export const desc = 'Focused moments, entered and exited with care.';

function dialogMarkup({ iconName = 'sparkles', title, text, body = '', confirm = 'Confirm', cancel = 'Cancel', danger = false }) {
  return `<div class="md-dialog__icon">${icon(iconName)}</div>
    <h2 id="dialog-title">${title}</h2>
    <p>${text}</p>
    ${body}
    <div class="md-dialog__actions">
      <button type="button" class="md-btn md-btn--text" data-dialog-cancel>${cancel}</button>
      <button type="button" class="md-btn ${danger ? 'md-btn--danger' : 'md-btn--filled'}" data-dialog-confirm>${confirm}</button>
    </div>`;
}

export function openDialog(options) {
  const dialog = document.createElement('dialog');
  dialog.className = 'md-dialog';
  dialog.setAttribute('aria-labelledby', 'dialog-title');
  dialog.innerHTML = dialogMarkup(options);
  document.getElementById('overlay-root').appendChild(dialog);
  dialog.showModal();
  const release = trapFocus(dialog);
  const close = (result) => {
    release();
    dialog.close();
    dialog.remove();
    if (result) toast(result, options.toastIcon || 'check');
  };
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    close(null);
  });
  dialog.querySelector('[data-dialog-cancel]')?.addEventListener('click', () => close(options.cancelToast || null));
  dialog.querySelector('[data-dialog-confirm]')?.addEventListener('click', () => close(options.confirmToast || 'Confirmed'));
  dialog.addEventListener('click', (event) => { if (event.target === dialog) close(null); });
  return dialog;
}

export function openFullscreenDialog(options) {
  const dialog = document.createElement('dialog');
  dialog.className = 'md-dialog md-dialog--fullscreen';
  dialog.setAttribute('aria-labelledby', 'dialog-title');
  dialog.innerHTML = `<div class="md-dialog__top">
      <button type="button" class="icon-button" data-dialog-cancel aria-label="Close">${icon('x')}</button>
      <span class="tag">Full-screen dialog</span>
    </div>
    <div class="md-dialog__scroll">
      <h2 id="dialog-title">${options.title}</h2>
      <p>${options.text}</p>
      ${options.body}
    </div>
    <div class="md-dialog__actions">
      <button type="button" class="md-btn md-btn--text" data-dialog-cancel>Discard</button>
      <button type="button" class="md-btn md-btn--filled" data-dialog-confirm>${icon('check')}Save</button>
    </div>`;
  document.getElementById('overlay-root').appendChild(dialog);
  dialog.showModal();
  const release = trapFocus(dialog);
  const close = (result) => {
    release();
    dialog.close();
    dialog.remove();
    if (result) toast(result, 'check');
  };
  dialog.addEventListener('cancel', (event) => { event.preventDefault(); close(null); });
  dialog.querySelector('[data-dialog-cancel]')?.addEventListener('click', () => close(null));
  dialog.querySelector('[data-dialog-confirm]')?.addEventListener('click', () => close(options.confirmToast || 'Changes saved'));
  return dialog;
}

export function html() {
  return `<div class="studio-stack">
    ${specimen({
      kicker: '01 · Dialog family',
      title: 'Ask once, ask clearly',
      desc: 'A dialog interrupts on purpose. It carries a single decision, uses the scrim to focus attention, and returns focus to the control that opened it when it closes.',
      body: `<div class="dialog-lab">
        <div class="dialog-preview">
          <div class="demo-label">Basic</div>
          <div class="dialog-preview__card">
            <h4>Share this palette?</h4>
            <p>Anyone with the link can preview your seed color and tonal scales.</p>
            <div class="dialog-preview__actions">
              <button type="button" class="md-btn md-btn--text">Cancel</button>
              <button type="button" class="md-btn md-btn--filled" id="open-basic">Share</button>
            </div>
          </div>
          <p class="demo-note">A short heading plus two actions.</p>
        </div>
        <div class="dialog-preview">
          <div class="demo-label">Confirmation</div>
          <div class="dialog-preview__card">
            <h4>Delete this collection?</h4>
            <p>Twelve saved colors will be removed. This cannot be undone.</p>
            <div class="dialog-preview__actions">
              <button type="button" class="md-btn md-btn--text">Keep</button>
              <button type="button" class="md-btn md-btn--danger" id="open-confirm">Delete</button>
            </div>
          </div>
          <p class="demo-note">Destructive action, clear consequence.</p>
        </div>
        <div class="dialog-preview">
          <div class="demo-label">Full screen</div>
          <div class="dialog-preview__card">
            <h4>New expressive note</h4>
            <p>A full-screen dialog is for creating something with a form — and for small screens.</p>
            <div class="dialog-preview__actions">
              <button type="button" class="md-btn md-btn--filled" id="open-fullscreen">Open</button>
            </div>
          </div>
          <p class="demo-note">Becomes the whole surface on mobile.</p>
        </div>
      </div>`,
      meta: ['Width · 560 px max', 'Radius · 36 px', 'Scrim · 44% + blur', 'Motion · spring-soft'],
    })}

    ${specimen({
      kicker: '02 · Anatomy',
      title: 'Focused by construction',
      desc: 'The scrim dims and slightly blurs the product behind it. The container springs in from below with a small scale, then settles without bounce.',
      body: `<div class="button-lab">
        <div class="button-lab__stage">
          <div class="md-dialog" style="position:relative;box-shadow:var(--elev-4);transform:none;animation:none;width:100%;max-width:440px">
            <div class="md-dialog__icon">${icon('palette')}</div>
            <h2 style="font-size:1.375rem">Use Ember instead?</h2>
            <p>The whole interface will re-tone immediately. You can switch back at any time.</p>
            <div class="md-dialog__actions">
              <button type="button" class="md-btn md-btn--text">Keep Iris</button>
              <button type="button" class="md-btn md-btn--filled">Use Ember</button>
            </div>
          </div>
        </div>
        <div class="demo-col">
          <div class="spread"><span class="body-sm muted">Icon container</span><span class="tag">primary-container</span></div>
          <div class="spread"><span class="body-sm muted">Corner radius</span><span class="tag">36 px</span></div>
          <div class="spread"><span class="body-sm muted">Actions</span><span class="tag">text + filled</span></div>
          <div class="spread"><span class="body-sm muted">Alignment</span><span class="tag">end</span></div>
          <div class="spread"><span class="body-sm muted">Dismiss</span><span class="tag">Esc · scrim click</span></div>
        </div>
      </div>`,
      meta: ['Title · Headline small', 'Body · Body medium', 'Padding · 28 px'],
    })}
  </div>`;
}

export function mount(root) {
  root.querySelector('#open-basic')?.addEventListener('click', () => openDialog({
    iconName: 'share-2',
    title: 'Share this palette?',
    text: 'Anyone with the link can preview your seed color, tonal scales and live component states.',
    confirm: 'Copy link',
    cancel: 'Cancel',
    confirmToast: 'Palette link copied',
  }));
  root.querySelector('#open-confirm')?.addEventListener('click', () => openDialog({
    iconName: 'trash-2',
    title: 'Delete this collection?',
    text: 'Twelve saved colors will be removed from Iris. This action cannot be undone.',
    confirm: 'Delete collection',
    cancel: 'Keep it',
    danger: true,
    confirmToast: 'Collection deleted',
    toastIcon: 'trash-2',
  }));
  root.querySelector('#open-fullscreen')?.addEventListener('click', () => openFullscreenDialog({
    title: 'New expressive note',
    text: 'A full-screen dialog is the right pattern when creation needs room to breathe.',
    body: `<div class="md-dialog__field">
      <div class="md-field md-field--outlined" style="--field-bg:var(--surface-high)">
        <div class="md-field__box">
          <input id="fs-title" placeholder=" " value="Shape vocabulary">
          <label class="md-field__label" for="fs-title">Title</label>
          <span class="md-field__line"></span>
        </div>
      </div>
    </div>
    <div class="md-dialog__field">
      <div class="md-field md-field--outlined" style="--field-bg:var(--surface-high)">
        <div class="md-field__box">
          <textarea id="fs-body" placeholder=" " rows="5">Cookie for playful. Arch for calm. Asymmetric when the content needs a direction.</textarea>
          <label class="md-field__label" for="fs-body">Note</label>
        </div>
      </div>
    </div>
    <div class="demo-row" style="margin-top:22px">
      ${['Tonal', 'Expressive', 'Quiet'].map((chip) => `<button type="button" class="md-chip">${chip}</button>`).join('')}
    </div>`,
    confirmToast: 'Note saved',
  }));
}