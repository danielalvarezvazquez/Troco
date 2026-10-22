/* ==========================================================================
   PUBLICAR OFERTA                     Propietario: P3 (tome123456)
   --------------------------------------------------------------------------
   Solo se editan este archivo y publicar.html.
   Los datos se guardan con USWAP.addOferta() (ver js/data.js, de P1).
   Incluye vista previa en vivo, contador de 70 caracteres y validaciones.
   ========================================================================== */
(function () {
  'use strict';

  var UI = window.USWAP_UI;
  var MAX_TITULO = 70;

  UI.montarNav('publicar');

  var form = document.getElementById('form-oferta');
  var titulo = document.getElementById('titulo');
  var descripcion = document.getElementById('descripcion');
  var categoria = document.getElementById('categoria');
  var pideACambio = document.getElementById('pideACambio');
  var preview = document.getElementById('preview');
  var contador = document.getElementById('contador-titulo');
  var boton = document.getElementById('btn-publicar');

  var yo = USWAP.usuario(USWAP.yo());

  var area = document.getElementById('area');

  area.innerHTML = USWAP.AREAS.map(function (a) {
    return '<option value="' + UI.esc(a) + '">' + UI.esc(a) + '</option>';
  }).join('');

  categoria.innerHTML = USWAP.CATEGORIAS.map(function (c) {
    return '<option value="' + UI.esc(c) + '">' + UI.esc(c) + '</option>';
  }).join('');

  function texto(valor, porDefecto) {
    var limpio = String(valor == null ? '' : valor).trim();
    return limpio || porDefecto;
  }

  function pintarPreview() {
    var valorTitulo = titulo.value.trim();

    if (!valorTitulo) {
      preview.innerHTML = UI.vacio(
        'Así se verá tu oferta',
        'Escribe un título para ver la tarjeta que aparecerá en el tablón.'
      );
      return;
    }

    var valorCategoria = categoria.value || 'Favores';
    var valorDescripcion = texto(
      descripcion.value,
      'Añade una descripción para explicar mejor lo que ofreces.'
    );
    var valorPide = texto(pideACambio.value, '—');

    preview.innerHTML =
      '<div class="card">' +
        '<div class="card-fila">' +
          UI.avatar(yo) +
          '<div class="usuario-linea">' +
            '<span class="usuario-nombre">' + UI.esc(yo.nombre) + ' · tú</span>' +
            '<span class="usuario-detalle">' + UI.esc(yo.carrera) + ' · ' + UI.curso(yo.curso) + '</span>' +
          '</div>' +
          '<span class="badge badge-azul" style="margin-left:auto">' + UI.esc(area.value || 'Otros') + '</span>' +
        '</div>' +
        '<h3 class="card-titulo">' + UI.esc(valorTitulo) + '</h3>' +
        '<p class="card-texto">' + UI.esc(valorDescripcion) + '</p>' +
        '<div class="cambio"><span>⇄</span><span><b>Pide a cambio:</b> ' + UI.esc(valorPide) + '</span></div>' +
        '<div class="card-pie">' +
          '<span>' + UI.esc(valorCategoria) + ' · ahora mismo</span>' +
          '<span class="badge badge-verde">Nueva</span>' +
        '</div>' +
      '</div>';
  }

  function actualizar() {
    contador.textContent = titulo.value.length + '/' + MAX_TITULO;
    boton.disabled = titulo.value.trim().length < 4;
    pintarPreview();
  }

  form.addEventListener('input', actualizar);
  form.addEventListener('change', function () {
    actualizar();
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var valorTitulo = titulo.value.trim();
    var valorPide = pideACambio.value.trim();

    if (valorTitulo.length < 4) {
      UI.toast('Pon un título de al menos 4 caracteres');
      titulo.focus();
      return;
    }

    if (!valorPide) {
      UI.toast('Indica qué pides a cambio');
      pideACambio.focus();
      return;
    }

    USWAP.addOferta({
      titulo: valorTitulo,
      descripcion: descripcion.value.trim(),
      categoria: categoria.value,
      area: area.value,
      pideACambio: valorPide
    });

    UI.toast('Oferta publicada');
    setTimeout(function () { window.location.href = 'index.html'; }, 700);
  });

  actualizar();
})();
