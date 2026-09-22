/* ==========================================================================
   [NOME DO ESCRITÓRIO] — Scripts gerais do site
   - Menu de navegação (mobile)
   - Ano automático no rodapé
   - Envio do formulário de contacto via Formspree (AJAX, com fallback)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------------------------------------------------------- */
  /* Menu mobile                                                  */
  /* ---------------------------------------------------------- */
  var toggle = document.getElementById('nav-toggle');
  var links = document.getElementById('nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var isOpen = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Fecha o menu ao clicar num link (útil em mobile)
    links.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        links.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------------------------------------------------------- */
  /* Ano automático no rodapé                                     */
  /* ---------------------------------------------------------- */
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ---------------------------------------------------------- */
  /* Formulário de contacto                                       */
  /*                                                                */
  /* Envia via Formspree (https://formspree.io) para o email        */
  /* configurado no painel do Formspree — ver README.md para a      */
  /* configuração inicial e como trocar o email de destino mais     */
  /* tarde (não é necessário editar este ficheiro para isso).       */
  /* ---------------------------------------------------------- */
  var form = document.getElementById('contact-form');
  if (!form) return;

  var statusBox = document.getElementById('form-status');
  var submitBtn = form.querySelector('button[type="submit"]');

  function showStatus(type, message) {
    statusBox.textContent = message;
    statusBox.className = 'form-status is-visible ' + (type === 'success' ? 'is-success' : 'is-error');
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    // Honeypot anti-spam: se este campo (invisível para humanos) vier
    // preenchido, é quase certamente um bot — ignoramos silenciosamente.
    var honeypot = form.querySelector('input[name="_gotcha"]');
    if (honeypot && honeypot.value) {
      showStatus('success', 'Obrigado! A sua mensagem foi enviada.');
      form.reset();
      return;
    }

    var formData = new FormData(form);
    var actionUrl = form.getAttribute('action');

    if (!actionUrl || actionUrl.indexOf('YOUR_FORM_ID') !== -1) {
      showStatus('error', 'O formulário ainda não está configurado. Ver README.md para ligar ao Formspree.');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'A enviar…';

    fetch(actionUrl, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    })
      .then(function (response) {
        if (response.ok) {
          showStatus('success', 'Obrigado! A sua mensagem foi enviada com sucesso. Entraremos em contacto brevemente.');
          form.reset();
        } else {
          return response.json().then(function (data) {
            var errorMsg = (data && data.errors)
              ? data.errors.map(function (e) { return e.message; }).join(', ')
              : 'Não foi possível enviar a mensagem. Tente novamente ou contacte-nos por email.';
            showStatus('error', errorMsg);
          });
        }
      })
      .catch(function () {
        showStatus('error', 'Não foi possível enviar a mensagem. Verifique a sua ligação à internet e tente novamente.');
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar Mensagem';
      });
  });
});
