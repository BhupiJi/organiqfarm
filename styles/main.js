/* main.js
   Small interactive behaviours.
   - mobile nav toggle
   - project modal open/close with keyboard support
   - simple contact form validation stub (no backend)
*/

/* DOM helpers */
const $ = selector => document.querySelector(selector);
const $$ = selector => Array.from(document.querySelectorAll(selector));

document.addEventListener('DOMContentLoaded', () => {
  // year in footer
  const y = new Date().getFullYear();
  document.getElementById('year')?.textContent = y;
  document.getElementById('year-2')?.textContent = y;

  // Mobile menu toggle
  const btn = $('#mobile-menu-button');
  const mobileMenu = $('#mobile-menu');
  if (btn && mobileMenu) {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      mobileMenu.hidden = expanded;
      $('#menu-open')?.classList.toggle('hidden');
      $('#menu-close')?.classList.toggle('hidden');
    });
  }

  // Project modal
  const modal = $('#project-modal');
  const modalTitle = $('#modal-title');
  const modalDesc = $('#modal-desc');
  const modalClose = $('#modal-close');

  $$('.btn-link[data-project]').forEach(btn => {
    btn.addEventListener('click', () => {
      const data = JSON.parse(btn.getAttribute('data-project') || '{}');
      modalTitle.textContent = data.title || 'Project';
      modalDesc.textContent = data.desc || '';
      openModal();
    });
  });

  function openModal() {
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('flex');
    // trap focus to close button for simple accessibility
    modalClose.focus();
  }
  function closeModal() {
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('flex');
  }

  modalClose?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });

  // Basic client-side form stub (no backend)
  const form = $('#contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // simple required check
      const valid = Array.from(form.querySelectorAll('[required]')).every(i => i.value.trim());
      if (!valid) {
        alert('Please fill all required fields.');
        return;
      }
      // For static hosting: suggest using a form service
      alert('Form ready. Connect a form backend (Formspree/Netlify/etc.) to receive messages.');
      form.reset();
    });
  }
});
