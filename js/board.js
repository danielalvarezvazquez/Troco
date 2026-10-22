/* ==========================================================================
   TABLÓN + FILTROS                    Propietario: P2 (Javierbarcala)
   --------------------------------------------------------------------------
   Solo se editan este archivo y index.html. No toques data.js, ui.js ni CSS.
   Pide a P1 cualquier campo o estilo que necesites.

   Filtros: modo (trueque / clases), área de la petición, rama y curso del
   autor, más el buscador de texto. Además: orden, reputación del autor,
   botón de limpiar, estado vacío con sugerencias y atajos de teclado.
   ========================================================================== */
(function () {
  'use strict';

  var UI = window.USWAP_UI;

  /* ---- estado de los filtros (vacío = sin filtrar) ----------------------
     área    → de qué va la petición (campo `area` de la oferta)
     carrera → grado del autor, de la lista de carreras de la USC
     curso   → 1º..6º, Máster, Doctorado (campo `curso` del usuario)
  ---------------------------------------------------------------------- */
  var filtro = { texto: '', categoria: '', area: '', carrera: '', curso: '' };

  var elBuscador = document.getElementById('buscador');
  var elLista = document.getElementById('lista');
  var elInfo = document.getElementById('resultado-info');
  var elLimpiar = document.getElementById('btn-limpiar');
  var elOrden = document.getElementById('orden');

  /* ---- ¿hay algún filtro puesto? ---------------------------------------- */
  function hayFiltros() {
    return !!(filtro.texto.trim() || filtro.categoria || filtro.area || filtro.carrera || filtro.curso);
  }

  /* ---- dejar el tablón como al entrar ----------------------------------- */
  function limpiarFiltros() {
    filtro.texto = '';
    filtro.categoria = '';
    filtro.area = '';
    filtro.carrera = '';
    filtro.curso = '';
    elBuscador.value = '';
    pintarFiltros();
    pintarLista();
  }

  /* ---- pintar una fila de chips ---------------------------------------- */
  function pintarChips(contenedor, opciones, campo) {
    contenedor.innerHTML = opciones.map(function (op) {
      var activo = filtro[campo] === op.valor;
      return '<button class="chip' + (activo ? ' activo' : '') + '" data-campo="' + campo +
        '" data-valor="' + UI.esc(op.valor) + '">' + UI.esc(op.texto) + '</button>';
    }).join('');

    contenedor.querySelectorAll('.chip').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var campoActual = btn.getAttribute('data-campo');
        var valor = btn.getAttribute('data-valor');
        /* el chip "Todos…" (valor vacío) siempre limpia el filtro */
        filtro[campoActual] = (valor === '' || filtro[campoActual] === valor) ? '' : valor;
        pintarFiltros();
        pintarLista();
      });
    });
  }

  function pintarFiltros() {
    var categorias = [{ valor: '', texto: 'Todas las categorías' }].concat(
      USWAP.CATEGORIAS.map(function (c) { return { valor: c, texto: c }; })
    );
    var areas = [{ valor: '', texto: 'Todas las áreas' }].concat(
      USWAP.AREAS.map(function (a) { return { valor: a, texto: a }; })
    );
    var carreras = [{ valor: '', texto: 'Todas las carreras' }].concat(
      USWAP.CARRERAS.map(function (c) { return { valor: c, texto: c }; })
    );
    var cursos = [{ valor: '', texto: 'Todos los cursos' }].concat(
      USWAP.CURSOS.map(function (c) { return { valor: c, texto: c }; })
    );

    pintarChips(document.getElementById('filtro-categorias'), categorias, 'categoria');
    pintarChips(document.getElementById('filtro-areas'), areas, 'area');
    pintarChips(document.getElementById('filtro-carreras'), carreras, 'carrera');
    pintarChips(document.getElementById('filtro-cursos'), cursos, 'curso');
  }

  /* ---- filtrar y ordenar ------------------------------------------------ */
  function filtrar() {
    var texto = filtro.texto.trim().toLowerCase();
    var orden = elOrden ? elOrden.value : 'destacada';

    return USWAP.ofertas().filter(function (o) {
      var autor = USWAP.usuario(o.autorId) || {};
      var coincideTexto = !texto ||
        (o.titulo + ' ' + o.descripcion + ' ' + o.categoria + ' ' + (o.area || '') + ' ' +
         (autor.nombre || '') + ' ' + (autor.carrera || '') + ' ' + (autor.rama || ''))
          .toLowerCase().indexOf(texto) !== -1;

      var coincideCategoria = !filtro.categoria || o.categoria === filtro.categoria;
      var coincideArea = !filtro.area || o.area === filtro.area;
      var coincideCarrera = !filtro.carrera || autor.carrera === filtro.carrera;
      var coincideCurso = !filtro.curso || String(autor.curso) === filtro.curso;

      return coincideTexto && coincideCategoria && coincideArea && coincideCarrera && coincideCurso;
    }).sort(function (a, b) {
      if (orden === 'valoracion') {
        var diferencia = USWAP.mediaDe(b.autorId) - USWAP.mediaDe(a.autorId);
        if (diferencia) return diferencia;
        return new Date(b.creadaEn) - new Date(a.creadaEn);
      }
      if (orden !== 'reciente' && !!b.destacada !== !!a.destacada) {
        return (b.destacada ? 1 : 0) - (a.destacada ? 1 : 0);
      }
      return new Date(b.creadaEn) - new Date(a.creadaEn);
    });
  }

  /* ---- reputación del autor: ★ 4.8 (12) o etiqueta "Nuevo" -------------- */
  function reputacion(autor) {
    var total = autor && autor.id ? USWAP.valoracionesDe(autor.id).length : 0;
    /* una cuenta con aviso de expulsión se muestra con cero estrellas, no como "Nuevo" */
    if (!total && autor && autor.avisoBaneo) {
      return '<span class="usuario-detalle" style="color:#fca5a5">★ 0.0 (0)</span>';
    }
    if (!total) return '<span class="badge">Nuevo</span>';

    return '<span class="usuario-detalle">★ ' + USWAP.mediaDe(autor.id).toFixed(1) +
      ' (' + total + ')</span>';
  }

  /* ---- color de la categoría: tiñe el filo de la tarjeta y el chip ------- */
  var COLOR_CATEGORIA = {
    'Apuntes': '#6d5efc',
    'Enseñanza': '#2f7cf6',
    'Favores': '#0f9d58',
    'Objetos': '#db2777',
    'Otros': '#64748b'
  };

  /* ---- una tarjeta del tablón ------------------------------------------ */
  function tarjeta(o) {
    var autor = USWAP.usuario(o.autorId) || { nombre: 'Anónimo', carrera: '', curso: '' };
    var color = COLOR_CATEGORIA[o.categoria] || '#6d5efc';

    return '' +
      '<a class="card" href="oferta.html?id=' + encodeURIComponent(o.id) + '" style="--cat:' + color + '">' +
        '<div class="card-fila">' +
          UI.avatar(autor) +
          '<div class="usuario-linea">' +
            '<span class="usuario-nombre">' + UI.esc(autor.nombre) + '</span>' +
            reputacion(autor) +
            '<span class="usuario-detalle">' + UI.esc(autor.carrera) + ' · ' + UI.curso(autor.curso) + '</span>' +
          '</div>' +
          '<span class="badge badge-azul" style="margin-left:auto">' + UI.esc(o.area) + '</span>' +
        '</div>' +
        '<h3 class="card-titulo">' + UI.esc(o.titulo) + '</h3>' +
        '<p class="card-texto">' + UI.esc(o.descripcion) + '</p>' +
        '<div class="card-pie">' +
          '<span class="card-meta">' +
            '<span class="card-cat" style="color:' + color + ';background:' + color + '1a">' +
              UI.esc(o.categoria) + '</span>' +
            UI.tiempo(o.creadaEn) +
          '</span>' +
          '<span class="card-acciones">' +
            (o.destacada ? '<span class="badge badge-ambar">★ Destacada</span>' : '') +
            (autor.avisoBaneo ? '<span class="badge badge-rojo">⚠ En observación</span>' : '') +
            '<span class="card-cta">Ver y responder <span aria-hidden="true">→</span></span>' +
          '</span>' +
        '</div>' +
      '</a>';
  }

  /* ---- categorías más frecuentes del tablón ----------------------------- */
  function categoriasFrecuentes() {
    var cuenta = {};
    USWAP.ofertas().forEach(function (o) {
      if (USWAP.CATEGORIAS.indexOf(o.categoria) === -1) return;
      cuenta[o.categoria] = (cuenta[o.categoria] || 0) + 1;
    });
    return USWAP.CATEGORIAS.filter(function (c) { return cuenta[c]; })
      .sort(function (a, b) { return cuenta[b] - cuenta[a]; })
      .slice(0, 3);
  }

  /* ---- pintar la lista -------------------------------------------------- */
  function pintarLista() {
    var resultados = filtrar();

    if (elLimpiar) elLimpiar.classList.toggle('oculto', !hayFiltros());

    if (!resultados.length) {
      var sugerencias = categoriasFrecuentes().map(function (c) {
        return '<button class="chip" type="button" data-categoria="' + UI.esc(c) + '">' +
          UI.esc(c) + '</button>';
      }).join('');

      elLista.innerHTML =
        '<div class="vacio">' +
          '<strong>Nadie ha pedido eso todavía</strong>' +
          'Prueba a quitar algún filtro o a buscar otra cosa.' +
          '<div class="chips" style="justify-content:center;flex-wrap:wrap;margin:14px 0 6px">' +
            sugerencias +
          '</div>' +
          '<button class="chip chip-mini" type="button" id="btn-ver-todo">Ver todo</button>' +
        '</div>';

      elLista.querySelectorAll('[data-categoria]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          filtro.texto = btn.getAttribute('data-categoria');
          elBuscador.value = filtro.texto;
          pintarLista();
        });
      });
      document.getElementById('btn-ver-todo').addEventListener('click', limpiarFiltros);

      elInfo.textContent = '0 peticiones';
      return;
    }

    elLista.innerHTML = resultados.map(tarjeta).join('') +
      '<a class="sugerencia-publicar" href="publicar.html">' +
        '¿No está lo que buscas? Publícalo →' +
      '</a>';
    elInfo.textContent = resultados.length + (resultados.length === 1 ? ' petición' : ' peticiones') +
      (filtro.categoria || filtro.area || filtro.carrera || filtro.curso ? ' · filtros activos' : '');
  }

  /* ---- arranque --------------------------------------------------------- */
  UI.montarNav('inicio');

  /* saludo con el nombre de quien está mirando: suena a persona, no a app */
  var yo = USWAP.usuario(USWAP.yo());
  var elSub = document.getElementById('hero-sub');
  if (yo && elSub) {
    elSub.textContent = 'Buenas, ' + yo.nombre.split(' ')[0] +
      '. Esto es lo que piden otros estudiantes de la USC.';
  }

  pintarFiltros();
  pintarLista();

  elBuscador.addEventListener('input', function () {
    filtro.texto = elBuscador.value;
    pintarLista();
  });

  if (elLimpiar) elLimpiar.addEventListener('click', limpiarFiltros);
  if (elOrden) elOrden.addEventListener('change', pintarLista);

  /* ---- volver arriba ---------------------------------------------------- */
  var elContenido = document.querySelector('.contenido');
  var elArriba = document.getElementById('btn-arriba');

  if (elContenido && elArriba) {
    elContenido.addEventListener('scroll', function () {
      elArriba.classList.toggle('visible', elContenido.scrollTop > 420);
    });
    elArriba.addEventListener('click', function () {
      elContenido.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---- atajos de teclado: "/" busca y Esc limpia ------------------------ */
  document.addEventListener('keydown', function (e) {
    if (e.key === '/' && document.activeElement !== elBuscador) {
      e.preventDefault();
      elBuscador.focus();
      return;
    }
    if (e.key === 'Escape' && (document.activeElement === elBuscador || hayFiltros())) {
      limpiarFiltros();
      elBuscador.blur();
    }
  });
})();
