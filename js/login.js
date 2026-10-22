/* ==========================================================================
   INICIAR SESIÓN                        Propietario: P1 (Daniel)
   --------------------------------------------------------------------------
   Demo sin backend: la sesión y los usuarios viven en localStorage.
   Las contraseñas se guardan con un hash djb2 (NO es seguridad real).
   ========================================================================== */
(function () {
  'use strict';

  var UI = window.USWAP_UI;
  var form = document.getElementById('form-login');
  var email = document.getElementById('email');
  var password = document.getElementById('password');

  /* si ya hay sesión, directo a la app */
  if (USWAP.sesion()) { window.location.replace('index.html'); return; }

  function entrar(correo, clave) {
    var u = USWAP.entrar(correo, clave);
    if (!u) {
      UI.toast('Correo o contraseña incorrectos');
      password.value = '';
      password.focus();
      return;
    }
    USWAP_UI.toast('Hola, ' + u.nombre.split(' ')[0]);
    window.location.href = 'index.html';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!email.value.trim()) { UI.toast('Escribe tu correo'); email.focus(); return; }
    if (!password.value) { UI.toast('Escribe tu contraseña'); password.focus(); return; }
    entrar(email.value, password.value);
  });

  document.querySelectorAll('[data-demo]').forEach(function (boton) {
    boton.addEventListener('click', function () {
      entrar(boton.getAttribute('data-demo'), 'demo1234');
    });
  });
})();
