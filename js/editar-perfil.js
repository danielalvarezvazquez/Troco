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

  /* --- guardar --- */
  document.getElementById('form-perfil').addEventListener('submit', function (e) {
    e.preventDefault();

    var nombre = campos.nombre.value.trim();
    if (!nombre) { UI.toast('El nombre no puede estar vacío'); campos.nombre.focus(); return; }

    USWAP.actualizarPerfil({
      nombre: nombre,
      carrera: campos.carrera.value.trim(),
      curso: Number(campos.curso.value),
      area: campos.area.value,
      habilidades: campos.habilidades.value.split(',')
        .map(function (h) { return h.trim(); })
        .filter(function (h) { return h.length > 0; }),
      bio: campos.bio.value.trim(),
      instagram: campos.instagram.value.trim().replace(/^@/, ''),
      whatsapp: campos.whatsapp.value.trim().replace(/[^\d]/g, '')
    });

    UI.toast('Perfil guardado');
    setTimeout(function () { window.location.href = 'perfil.html'; }, 700);
  });
})();
