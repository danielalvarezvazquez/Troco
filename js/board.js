/* ==========================================================================
   TABLÓN + FILTROS                    Propietario: P2 (Javierbarcala)
   --------------------------------------------------------------------------
   Solo se editan este archivo y index.html. No toques data.js, ui.js ni CSS.
   Pide a P1 cualquier campo o estilo que necesites.
   ========================================================================== */
(function () {
  'use strict';

  var UI = window.USWAP_UI;

  /* ---- estado de los filtros (vacío = sin filtrar) ---------------------- */
  var filtro = { texto: '', area: '', carrera: '', curso: '' };

  var elBuscador = document.getElementById('buscador');
  var elLista = document.getElementById('lista');
  var elInfo = document.getElementById('resultado-info');

  /* ---- carreras disponibles, sacadas de los usuarios -------------------- */
  function carreras() {
    var vistas = [], out = [];
    USWAP.usuarios().forEach(function (u) {
      if (u.carrera && vistas.indexOf(u.carrera) === -1) { vistas.push(u.carrera); out.push(u.carrera); }
    });
    return out;
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
    var areas = [{ valor: '', texto: 'Todas las áreas' }].concat(
      USWAP.AREAS.map(function (a) { return { valor: a, texto: a }; })
    );
    var carrerasOp = [{ valor: '', texto: 'Todas las carreras' }].concat(
      carreras().map(function (c) { return { valor: c, texto: c }; })
    );
    var cursos = [{ valor: '', texto: 'Todos los cursos' }].concat(
      USWAP.CURSOS.map(function (c) { return { valor: String(c), texto: c + 'º curso' }; })
    );

    pintarChips(document.getElementById('filtro-areas'), areas, 'area');
    pintarChips(document.getElementById('filtro-carreras'), carrerasOp, 'carrera');
    pintarChips(document.getElementById('filtro-cursos'), cursos, 'curso');
  }

  /* ---- filtrar --------------------------------------------------------- */
  function filtrar() {
    var texto = filtro.texto.trim().toLowerCase();

    return USWAP.ofertas().filter(function (o) {
      var autor = USWAP.usuario(o.autorId) || {};
      var coincideTexto = !texto ||
        (o.titulo + ' ' + o.descripcion + ' ' + o.categoria + ' ' + (autor.nombre || '') + ' ' +
         (autor.carrera || '')).toLowerCase().indexOf(texto) !== -1;

      var coincideArea = !filtro.area || autor.area === filtro.area;
      var coincideCarrera = !filtro.carrera || autor.carrera === filtro.carrera;
      var coincideCurso = !filtro.curso || String(autor.curso) === String(filtro.curso);

      return coincideTexto && coincideArea && coincideCarrera && coincideCurso;
    }).sort(function (a, b) {
      if (!!b.destacada !== !!a.destacada) return (b.destacada ? 1 : 0) - (a.destacada ? 1 : 0);
      return new Date(b.creadaEn) - new Date(a.creadaEn);
    });
  }

  /* ---- reputación del autor: ★ 4.8 (12) o etiqueta "Nuevo" -------------- */
  function reputacion(autor) {
    var total = autor && autor.id ? USWAP.valoracionesDe(autor.id).length : 0;
    if (!total) return '<span class="badge">Nuevo</span>';

    return '<span class="usuario-detalle">★ ' + USWAP.mediaDe(autor.id).toFixed(1) +
      ' (' + total + ')</span>';
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
            reputacion(autor) +
            '<span class="usuario-detalle">' + UI.esc(autor.carrera) + ' · ' + UI.esc(autor.curso) + 'º</span>' +
          '</div>' +
          '<span class="badge badge-azul" style="margin-left:auto">' + UI.esc(o.categoria) + '</span>' +
        '</div>' +
        '<h3 class="card-titulo">' + UI.esc(o.titulo) + '</h3>' +
        '<p class="card-texto">' + UI.esc(o.descripcion) + '</p>' +
        '<div class="cambio"><span>⇄</span><span><b>Pide a cambio:</b> ' + UI.esc(o.pideACambio) + '</span></div>' +
        '<div class="card-pie">' +
          '<span>' + (o.tipo === 'objeto' ? '📦 Objeto' : '🤝 Favor') + ' · ' + UI.tiempo(o.creadaEn) + '</span>' +
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
      (filtro.area || filtro.carrera || filtro.curso ? ' · filtros activos' : '');
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
