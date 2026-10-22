/* ==========================================================================
   TABLÓN + FILTROS                    Propietario: P2 (Javierbarcala)
   --------------------------------------------------------------------------
   Solo se editan este archivo y index.html. No toques data.js, ui.js ni CSS.
   Pide a P1 cualquier campo o estilo que necesites.
   ========================================================================== */
(function () {
  'use strict';

  var UI = window.USWAP_UI;

  /* ---- estado de los filtros (vacío = sin filtrar) ----------------------
     área  → de qué va la petición (campo `area` de la oferta)
     rama  → gran bloque de estudios del autor (campo `rama` del usuario)
     curso → 1º..6º, Máster, Doctorado (campo `curso` del usuario)
  ---------------------------------------------------------------------- */
  var filtro = { texto: '', modo: '', area: '', rama: '', curso: '' };

  var elBuscador = document.getElementById('buscador');
  var elLista = document.getElementById('lista');
  var elInfo = document.getElementById('resultado-info');

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
    var modos = [
      { valor: '', texto: 'Todo' },
      { valor: 'trueque', texto: 'Trueque de favores y objetos' },
      { valor: 'clases', texto: 'Clases particulares' }
    ];
    var areas = [{ valor: '', texto: 'Todas las áreas' }].concat(
      USWAP.AREAS.map(function (a) { return { valor: a, texto: a }; })
    );
    var ramas = [{ valor: '', texto: 'Todas las ramas' }].concat(
      USWAP.RAMAS.map(function (r) { return { valor: r, texto: r }; })
    );
    var cursos = [{ valor: '', texto: 'Todos los cursos' }].concat(
      USWAP.CURSOS.map(function (c) { return { valor: c, texto: c }; })
    );

    pintarChips(document.getElementById('filtro-modo'), modos, 'modo');
    pintarChips(document.getElementById('filtro-areas'), areas, 'area');
    pintarChips(document.getElementById('filtro-ramas'), ramas, 'rama');
    pintarChips(document.getElementById('filtro-cursos'), cursos, 'curso');
  }

  /* ---- filtrar --------------------------------------------------------- */
  function filtrar() {
    var texto = filtro.texto.trim().toLowerCase();

    return USWAP.ofertas().filter(function (o) {
      var autor = USWAP.usuario(o.autorId) || {};
      var coincideTexto = !texto ||
        (o.titulo + ' ' + o.descripcion + ' ' + o.categoria + ' ' + (o.area || '') + ' ' +
         (autor.nombre || '') + ' ' + (autor.carrera || '') + ' ' + (autor.rama || ''))
          .toLowerCase().indexOf(texto) !== -1;

      var coincideArea = !filtro.area || o.area === filtro.area;
      var coincideRama = !filtro.rama || autor.rama === filtro.rama;
      var coincideCurso = !filtro.curso || String(autor.curso) === filtro.curso;

      var esClase = o.categoria === 'Clases';
      var coincideModo = !filtro.modo ||
        (filtro.modo === 'clases' ? esClase : !esClase);

      return coincideTexto && coincideArea && coincideRama && coincideCurso && coincideModo;
    }).sort(function (a, b) {
      if (!!b.destacada !== !!a.destacada) return (b.destacada ? 1 : 0) - (a.destacada ? 1 : 0);
      return new Date(b.creadaEn) - new Date(a.creadaEn);
    });
  }

  /* ---- una tarjeta del tablón ------------------------------------------ */
  function tarjeta(o) {
    var autor = USWAP.usuario(o.autorId) || { nombre: 'Anónimo', carrera: '', curso: '' };

    return '' +
      '<a class="card" href="oferta.html?id=' + encodeURIComponent(o.id) + '">' +
        '<div class="card-fila">' +
          UI.avatar(autor) +
          '<div class="usuario-linea">' +
            '<span class="usuario-nombre">' + UI.esc(autor.nombre) + '</span>' +
            '<span class="usuario-detalle">' + UI.esc(autor.carrera) + ' · ' + UI.curso(autor.curso) + '</span>' +
          '</div>' +
          '<span class="badge badge-azul" style="margin-left:auto">' + UI.esc(o.area) + '</span>' +
        '</div>' +
        '<h3 class="card-titulo">' + UI.esc(o.titulo) + '</h3>' +
        '<p class="card-texto">' + UI.esc(o.descripcion) + '</p>' +
        '<div class="cambio"><span>⇄</span><span><b>Pide a cambio:</b> ' + UI.esc(o.pideACambio) + '</span></div>' +
        '<div class="card-pie">' +
          '<span>' + (o.tipo === 'objeto' ? '📦 Objeto' : '🤝 Favor') + ' · ' + UI.esc(o.categoria) + ' · ' + UI.tiempo(o.creadaEn) + '</span>' +
          '<span>' + (o.destacada ? '<span class="badge badge-ambar">★ Destacada</span>' : '') + '</span>' +
        '</div>' +
      '</a>';
  }

  /* ---- pintar la lista -------------------------------------------------- */
  function pintarLista() {
    var resultados = filtrar();

    if (!resultados.length) {
      elLista.innerHTML = UI.vacio('Nada por aquí', 'Prueba a quitar algún filtro o busca otra cosa.');
      elInfo.textContent = '0 ofertas';
      return;
    }

    elLista.innerHTML = resultados.map(tarjeta).join('');
    elInfo.textContent = resultados.length + (resultados.length === 1 ? ' oferta' : ' ofertas') +
      (filtro.modo === 'clases' ? ' · clases particulares' : (filtro.modo === 'trueque' ? ' · trueques' : '')) +
      (filtro.area || filtro.rama || filtro.curso ? ' · filtros activos' : '');
  }

  /* ---- arranque --------------------------------------------------------- */
  UI.montarNav('inicio');
  pintarFiltros();
  pintarLista();

  elBuscador.addEventListener('input', function () {
    filtro.texto = elBuscador.value;
    pintarLista();
  });
})();
