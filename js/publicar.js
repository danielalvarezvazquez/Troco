/* ==========================================================================
   PUBLICAR OFERTA                     Propietario: P3 (tome123456)
   --------------------------------------------------------------------------
   Solo se editan este archivo y publicar.html.
   Los datos se guardan con USWAP.addOferta() (ver js/data.js, de P1).
   ========================================================================== */
(function () {
  'use strict';

  var UI = window.USWAP_UI;

  UI.montarNav('publicar');

  var form = document.getElementById('form-oferta');
  var categoria = document.getElementById('categoria');

  categoria.innerHTML = USWAP.CATEGORIAS.map(function (c) {
    return '<option value="' + UI.esc(c) + '">' + UI.esc(c) + '</option>';
  }).join('');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var titulo = document.getElementById('titulo').value.trim();
    var descripcion = document.getElementById('descripcion').value.trim();

    if (titulo.length < 4) {
      UI.toast('Pon un título de al menos 4 caracteres');
      document.getElementById('titulo').focus();
      return;
    }

    USWAP.addOferta({
      titulo: titulo,
      descripcion: descripcion,
      tipo: document.getElementById('tipo').value,
      categoria: categoria.value
    });

    UI.toast('Petición publicada');
    setTimeout(function () { window.location.href = 'index.html'; }, 700);
  });
})();
