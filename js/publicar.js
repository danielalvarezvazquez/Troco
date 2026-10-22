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
  var carrera = document.getElementById('carrera');
  var preview = document.getElementById('preview');
  var contador = document.getElementById('contador-titulo');
  var boton = document.getElementById('btn-publicar');
  var avisoContenido = document.getElementById('aviso-contenido');

  /* ---- filtro de contenido inapropiado ---------------------------------
     Lista corta y comprobada por palabra completa: solo para que la demo no
     publique insultos ni contenido violento o sexual. No es un moderador real.
  ---------------------------------------------------------------------- */
  var PALABRAS_INAPROPIADAS = [
    'puta', 'puto', 'hijoputa', 'mierda', 'cabron', 'cabrona', 'gilipollas',
    'imbecil', 'idiota', 'estupido', 'estupida', 'subnormal', 'retrasado', 'retrasada',
    'maricon', 'marica', 'polla', 'joder', 'follar', 'violar', 'violacion',
    'asesinar', 'asesinato', 'matar', 'nazi', 'racista', 'machista',
    'porno', 'pornografia', 'sexo', 'desnudo', 'desnuda', 'droga', 'cocaina'
  ];

  function normalizar(texto) {
    return String(texto || '').toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9ñ\s]/g, ' ');
  }

  function esInapropiado(texto) {
    var limpio = ' ' + normalizar(texto).replace(/\s+/g, ' ') + ' ';
    for (var i = 0; i < PALABRAS_INAPROPIADAS.length; i++) {
      if (limpio.indexOf(' ' + PALABRAS_INAPROPIADAS[i] + ' ') !== -1) return true;
    }
    return false;
  }

  function mostrarAviso(visible) {
    if (avisoContenido) avisoContenido.classList.toggle('oculto', !visible);
  }

  var yo = USWAP.usuario(USWAP.yo());

  var area = document.getElementById('area');

  area.innerHTML = USWAP.AREAS.map(function (a) {
    return '<option value="' + UI.esc(a) + '">' + UI.esc(a) + '</option>';
  }).join('');

  categoria.innerHTML = USWAP.CATEGORIAS.map(function (c) {
    return '<option value="' + UI.esc(c) + '">' + UI.esc(c) + '</option>';
  }).join('');

  /* carreras de la USC; si la del perfil no está en la lista, se añade delante */
  var listaCarreras = USWAP.CARRERAS.slice();
  if (yo.carrera && listaCarreras.indexOf(yo.carrera) === -1) listaCarreras.unshift(yo.carrera);

  carrera.innerHTML = listaCarreras.map(function (c) {
    return '<option value="' + UI.esc(c) + '"' + (c === yo.carrera ? ' selected' : '') + '>' +
      UI.esc(c) + '</option>';
  }).join('');

  function texto(valor, porDefecto) {
    var limpio = String(valor == null ? '' : valor).trim();
    return limpio || porDefecto;
  }

  function pintarPreview() {
    var valorTitulo = titulo.value.trim();

    if (!valorTitulo) {
      preview.innerHTML = UI.vacio(
        'Así se verá tu petición',
        'Escribe un título para ver la tarjeta que aparecerá en el tablón.'
      );
      return;
    }

    var valorCategoria = categoria.value || 'Favores';
    var valorDescripcion = texto(
      descripcion.value,
      'Añade una descripción para explicar mejor lo que necesitas.'
    );

    preview.innerHTML =
      '<div class="card">' +
        '<div class="card-fila">' +
          UI.avatar(yo) +
          '<div class="usuario-linea">' +
            '<span class="usuario-nombre">' + UI.esc(yo.nombre) + ' · tú</span>' +
            '<span class="usuario-detalle">' + UI.esc(carrera.value || yo.carrera) + ' · ' + UI.curso(yo.curso) + '</span>' +
          '</div>' +
          '<span class="badge badge-azul" style="margin-left:auto">' + UI.esc(area.value || 'Otros') + '</span>' +
        '</div>' +
        '<h3 class="card-titulo">' + UI.esc(valorTitulo) + '</h3>' +
        '<p class="card-texto">' + UI.esc(valorDescripcion) + '</p>' +
        '<div class="card-pie">' +
          '<span>' + UI.esc(valorCategoria) + ' · ahora mismo</span>' +
          '<span class="badge badge-verde">Nueva</span>' +
        '</div>' +
      '</div>';
  }

  function actualizar() {
    contador.textContent = titulo.value.length + '/' + MAX_TITULO;
    boton.disabled = titulo.value.trim().length < 4;
    mostrarAviso(false);
    pintarPreview();
  }

  form.addEventListener('input', actualizar);
  form.addEventListener('change', function () {
    actualizar();
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var valorTitulo = titulo.value.trim();

    if (valorTitulo.length < 4) {
      UI.toast('Pon un título de al menos 4 caracteres');
      titulo.focus();
      return;
    }

    /* nada que ofenda: se corta antes de publicar y se invita a reescribirlo */
    if (esInapropiado(valorTitulo + ' ' + descripcion.value)) {
      mostrarAviso(true);
      avisoContenido.scrollIntoView({ block: 'center', behavior: 'smooth' });
      UI.toast('Esto no es apropiado. Edítalo antes de publicar.');
      titulo.focus();
      return;
    }

    mostrarAviso(false);

    USWAP.addOferta({
      titulo: valorTitulo,
      descripcion: descripcion.value.trim(),
      categoria: categoria.value,
      area: area.value
    });

    /* si ha elegido otra carrera, se guarda también en su perfil */
    if (carrera.value && carrera.value !== yo.carrera) {
      USWAP.actualizarPerfil({ carrera: carrera.value });
      yo.carrera = carrera.value;
    }

    UI.toast('Publicado. A ver si alguien se anima.');
    setTimeout(function () { window.location.href = 'index.html'; }, 700);
  });

  actualizar();
})();
