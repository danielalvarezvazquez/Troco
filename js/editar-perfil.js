/* ==========================================================================
   EDITAR PERFIL                       Propietario: P4 (sergiooleeonn)
   --------------------------------------------------------------------------
   Solo se editan este archivo, editar-perfil.html y perfil.html / perfil.js.
   ========================================================================== */
(function () {
  'use strict';

  var UI = window.USWAP_UI;

  UI.montarNav('perfil');

  var yo = USWAP.usuario(USWAP.yo());
  if (!yo) { window.location.href = 'index.html'; return; }

  var campos = {
    nombre: document.getElementById('nombre'),
    carrera: document.getElementById('carrera'),
    curso: document.getElementById('curso'),
    area: document.getElementById('area'),
    habilidades: document.getElementById('habilidades'),
    bio: document.getElementById('bio'),
    instagram: document.getElementById('instagram'),
    whatsapp: document.getElementById('whatsapp')
  };

  /* --- rellenar selects --- */
  campos.curso.innerHTML = USWAP.CURSOS.map(function (c) {
    return '<option value="' + c + '">' + c + 'º</option>';
  }).join('');
  campos.area.innerHTML = USWAP.AREAS.map(function (a) {
    return '<option value="' + UI.esc(a) + '">' + UI.esc(a) + '</option>';
  }).join('');

  /* --- precargar datos actuales --- */
  campos.nombre.value = yo.nombre || '';
  campos.carrera.value = yo.carrera || '';
  campos.curso.value = String(yo.curso || 1);
  campos.area.value = yo.area || USWAP.AREAS[0];
  campos.habilidades.value = (yo.habilidades || []).join(', ');
  campos.bio.value = yo.bio || '';
  campos.instagram.value = yo.instagram || '';
  campos.whatsapp.value = yo.whatsapp || '';

  /* --- contador de caracteres de "Sobre ti" (máx. 180) --- */
  var contadorBio = document.getElementById('contador-bio');
  function pintarContador() {
    if (!contadorBio) return;
    var n = campos.bio.value.length;
    contadorBio.textContent = n + ' / 180';
    contadorBio.style.color = n >= 170 ? 'var(--rojo)' : (n >= 150 ? 'var(--ambar)' : '');
  }
  pintarContador();
  campos.bio.addEventListener('input', pintarContador);

  /* --- guardar --- */
  document.getElementById('form-perfil').addEventListener('submit', function (e) {
    e.preventDefault();

    var nombre = campos.nombre.value.trim();
    if (!nombre) { UI.toast('El nombre no puede estar vacío'); campos.nombre.focus(); return; }

    var whatsapp = campos.whatsapp.value.replace(/[^\d]/g, '');
    if (whatsapp && (whatsapp.length < 9 || whatsapp.length > 15)) {
      UI.toast('El WhatsApp debe tener entre 9 y 15 dígitos');
      campos.whatsapp.focus();
      return;
    }

    var instagram = campos.instagram.value.trim();
    if (instagram.indexOf('@') !== -1) {
      UI.toast('El Instagram va sin @, por ejemplo: sergio.leon');
      campos.instagram.focus();
      return;
    }

    USWAP.actualizarPerfil({
      nombre: nombre,
      carrera: campos.carrera.value.trim(),
      curso: Number(campos.curso.value),
      area: campos.area.value,
      habilidades: campos.habilidades.value.split(',')
        .map(function (h) { return h.trim(); })
        .filter(function (h) { return h.length > 0; }),
      bio: campos.bio.value.trim(),
      instagram: instagram,
      whatsapp: whatsapp
    });

    UI.toast('Perfil guardado');
    setTimeout(function () { window.location.href = 'perfil.html'; }, 700);
  });
})();
