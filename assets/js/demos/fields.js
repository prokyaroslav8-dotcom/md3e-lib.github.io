import { specimen } from '../specimen.js';
import { icon, refreshIcons, toast } from '../utils.js';

export const id = 'fields';
export const name = 'Text fields';
export const iconName = 'text-cursor-input';
export const desc = 'Input with clear labels and quiet feedback.';

export function html() {
  return `<div class="studio-stack">
    ${specimen({
      kicker: '01 · Filled',
      title: 'The label becomes the legend',
      desc: 'A filled field starts as a single line of text. On focus the label floats up and the container colour deepens — no placeholder ever disappears with the user&rsquo;s context inside it.',
      body: `<div class="field-lab">
        <div class="field-lab__group">
          <div class="field-lab__caption"><span class="demo-label">Basic</span></div>
          <div class="md-field">
            <div class="md-field__box">
              <input id="f-name" placeholder=" " autocomplete="name">
              <label class="md-field__label" for="f-name">Full name</label>
              <span class="md-field__line"></span>
            </div>
            <div class="md-field__support"><span>As it appears on your profile</span></div>
          </div>
        </div>
        <div class="field-lab__group">
          <div class="field-lab__caption"><span class="demo-label">With leading icon</span></div>
          <div class="md-field md-field--with-icon">
            <div class="md-field__box">
              <span class="md-field__icon">${icon('mail')}</span>
              <input id="f-email" type="email" placeholder=" " value="alex@studio.design">
              <label class="md-field__label" for="f-email">Email</label>
              <span class="md-field__line"></span>
            </div>
            <div class="md-field__support"><span id="f-email-help">We reply within one day</span></div>
          </div>
        </div>
        <div class="field-lab__group">
          <div class="field-lab__caption"><span class="demo-label">Password</span></div>
          <div class="md-field md-field--with-icon">
            <div class="md-field__box">
              <span class="md-field__icon">${icon('lock')}</span>
              <input id="f-password" type="password" placeholder=" " value="expressive-2026" style="padding-right:52px">
              <label class="md-field__label" for="f-password">Password</label>
              <span class="md-field__trailing">
                <button type="button" class="icon-button" id="f-password-toggle" aria-label="Show password">${icon('eye')}</button>
              </span>
              <span class="md-field__line"></span>
            </div>
          </div>
        </div>
        <div class="field-lab__group">
          <div class="field-lab__caption"><span class="demo-label">Text area · counter</span></div>
          <div class="md-field">
            <div class="md-field__box">
              <textarea id="f-note" placeholder=" " maxlength="120" rows="3"></textarea>
              <label class="md-field__label" for="f-note">Release note</label>
              <span class="md-field__line"></span>
            </div>
            <div class="md-field__support"><span>Markdown supported</span><span class="counter"><span id="f-note-count">0</span>/120</span></div>
          </div>
        </div>
      </div>`,
      meta: ['Height · 56 px', 'Radius · 12 px top', 'Label · body small', 'Focus · 2 px primary'],
    })}

    ${specimen({
      kicker: '02 · Outlined',
      title: 'A frame that lifts on focus',
      desc: 'Outlined fields put the label on the border, which keeps the container quiet on toned surfaces. Focus doubles the stroke instead of changing the fill.',
      body: `<div class="field-lab">
        <div class="field-lab__group">
          <div class="field-lab__caption"><span class="demo-label">Basic outlined</span></div>
          <div class="md-field md-field--outlined" style="--field-bg:var(--surface-low)">
            <div class="md-field__box">
              <input id="o-title" placeholder=" " value="Expressive surfaces">
              <label class="md-field__label" for="o-title">Title</label>
            </div>
            <div class="md-field__support"><span>Shown in the library</span></div>
          </div>
        </div>
        <div class="field-lab__group">
          <div class="field-lab__caption"><span class="demo-label">With trailing action</span></div>
          <div class="md-field md-field--outlined" style="--field-bg:var(--surface-low)">
            <div class="md-field__box">
              <input id="f-tag" placeholder=" " value="dynamic-color">
              <label class="md-field__label" for="f-tag">Tag</label>
              <span class="md-field__trailing"><button type="button" class="icon-button" aria-label="Clear tag" id="f-tag-clear">${icon('x')}</button></span>
            </div>
          </div>
        </div>
        <div class="field-lab__group">
          <div class="field-lab__caption"><span class="demo-label">Error — type an invalid email</span></div>
          <div class="md-field md-field--outlined" id="f-validate-field" style="--field-bg:var(--surface-low)">
            <div class="md-field__box">
              <input id="f-validate" type="email" placeholder=" " value="alex@studio">
              <label class="md-field__label" for="f-validate">Work email</label>
            </div>
            <div class="md-field__support"><span id="f-validate-message">Must contain an @ and a domain</span></div>
          </div>
        </div>
        <div class="field-lab__group">
          <div class="field-lab__caption"><span class="demo-label">Disabled</span></div>
          <div class="md-field md-field--outlined" style="--field-bg:var(--surface-low);opacity:.56">
            <div class="md-field__box">
              <input id="o-disabled" placeholder=" " value="Managed by your organization" disabled>
              <label class="md-field__label" for="o-disabled" style="top:0;transform:translateY(-50%);font-size:.6875rem">Workspace</label>
            </div>
          </div>
        </div>
      </div>`,
      meta: ['Stroke · 1 px → 2 px', 'Radius · 12 px', 'Label · on border'],
    })}

    ${specimen({
      kicker: '03 · A working form',
      title: 'Validation that stays calm',
      desc: 'Errors appear next to the field that caused them, never as a wall of red at the top. Submit with empty fields to see the states, or fill them to succeed.',
      tone: 'tonal',
      body: `<form class="form-demo" id="field-form" novalidate>
        <div class="form-demo__fields">
          <div class="md-field md-field--outlined" style="--field-bg:var(--surface-low)" data-field="name">
            <div class="md-field__box">
              <input id="form-name" name="name" placeholder=" " autocomplete="name">
              <label class="md-field__label" for="form-name">Your name</label>
            </div>
            <div class="md-field__support"><span class="error-text" hidden>Please tell us your name</span></div>
          </div>
          <div class="md-field md-field--outlined" style="--field-bg:var(--surface-low)" data-field="email">
            <div class="md-field__box">
              <input id="form-email" name="email" type="email" placeholder=" " autocomplete="email">
              <label class="md-field__label" for="form-email">Email</label>
            </div>
            <div class="md-field__support"><span class="error-text" hidden>That email doesn&rsquo;t look right</span></div>
          </div>
          <div class="md-field md-field--outlined" style="--field-bg:var(--surface-low)" data-field="message">
            <div class="md-field__box">
              <textarea id="form-message" name="message" placeholder=" " rows="4"></textarea>
              <label class="md-field__label" for="form-message">What are you building?</label>
            </div>
            <div class="md-field__support"><span class="error-text" hidden>Even one sentence helps</span><span class="counter"><span id="form-message-count">0</span>/240</span></div>
          </div>
          <div class="demo-row">
            <button type="submit" class="md-btn md-btn--filled md-btn--lg">${icon('send')}Send message</button>
            <button type="reset" class="md-btn md-btn--text md-btn--lg">Clear</button>
          </div>
        </div>
        <aside class="form-demo__aside">
          <span class="demo-label">Why it feels calm</span>
          <div class="demo-col" style="margin-top:10px">
            <div class="demo-caption" style="margin:0">${icon('check')}Labels never disappear</div>
            <div class="demo-caption" style="margin:0">${icon('check')}Errors live next to the cause</div>
            <div class="demo-caption" style="margin:0">${icon('check')}Counters prevent surprises</div>
            <div class="demo-caption" style="margin:0">${icon('check')}Success is confirmed with a snackbar</div>
          </div>
        </aside>
      </form>`,
      meta: ['Validation · on blur + submit', 'Feedback · inline + snackbar'],
    })}
  </div>`;
}

export function mount(root) {
  const password = root.querySelector('#f-password');
  const passwordToggle = root.querySelector('#f-password-toggle');
  passwordToggle?.addEventListener('click', () => {
    const show = password?.type === 'password';
    if (password) password.type = show ? 'text' : 'password';
    passwordToggle.innerHTML = icon(show ? 'eye-off' : 'eye');
    passwordToggle.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
    refreshIcons();
  });

  const note = root.querySelector('#f-note');
  note?.addEventListener('input', () => {
    const counter = root.querySelector('#f-note-count');
    if (counter) counter.textContent = String(note.value.length);
  });

  root.querySelector('#f-tag-clear')?.addEventListener('click', () => {
    const tag = root.querySelector('#f-tag');
    if (tag) { tag.value = ''; tag.focus(); }
    toast('Tag cleared', 'x');
  });

  const validate = root.querySelector('#f-validate');
  const validateField = root.querySelector('#f-validate-field');
  const validateMessage = root.querySelector('#f-validate-message');
  const checkEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
  validate?.addEventListener('blur', () => {
    const ok = checkEmail(validate.value);
    validateField?.classList.toggle('md-field--error', !ok);
    if (validateMessage) {
      validateMessage.textContent = ok ? 'Looks good — we will use this address' : 'Must contain an @ and a domain';
      validateMessage.style.color = ok ? 'var(--primary)' : '';
    }
  });

  const form = root.querySelector('#field-form');
  const message = root.querySelector('#form-message');
  message?.addEventListener('input', () => {
    const counter = root.querySelector('#form-message-count');
    if (counter) counter.textContent = String(message.value.length);
  });
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const text = String(data.get('message') || '').trim();
    const checks = [
      ['name', name.length > 1],
      ['email', checkEmail(email)],
      ['message', text.length > 2],
    ];
    let valid = true;
    for (const [field, ok] of checks) {
      const wrapper = form.querySelector(`[data-field="${field}"]`);
      const error = wrapper?.querySelector('.error-text');
      wrapper?.classList.toggle('md-field--error', !ok);
      if (error) error.hidden = ok;
      if (!ok) valid = false;
    }
    if (!valid) {
      toast('Check the highlighted fields', 'circle-alert');
      form.querySelector('.md-field--error input, .md-field--error textarea')?.focus();
      return;
    }
    toast(`Thanks, ${name.split(' ')[0]} — message sent`, 'send');
    form.reset();
    const counter = root.querySelector('#form-message-count');
    if (counter) counter.textContent = '0';
    form.querySelectorAll('.md-field--error').forEach((field) => field.classList.remove('md-field--error'));
    form.querySelectorAll('.error-text').forEach((error) => { error.hidden = true; });
  });
  form?.addEventListener('reset', () => {
    const counter = root.querySelector('#form-message-count');
    if (counter) counter.textContent = '0';
    form.querySelectorAll('.md-field--error').forEach((field) => field.classList.remove('md-field--error'));
    form.querySelectorAll('.error-text').forEach((error) => { error.hidden = true; });
  });
}