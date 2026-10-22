/* ==========================================================================
   RANKING + RECOMPENSAS               Propietario: P3 (tome123456)
   --------------------------------------------------------------------------
   Solo se editan este archivo y ranking.html.
   Este archivo también lo carga perfil.html (solo para leer niveles), así que
   NO debe fallar si no existe #ranking en la página.
   ========================================================================== */
(function () {
  'use strict';

  var UI = window.USWAP_UI;

  /* ---- niveles: se aplica el de mayor "min" que no supere los puntos ----- */
  var NIVELES = [
    { id: 'hierro', nombre: 'Hierro', min: -9999, icono: '🩶', clase: 'tier-hierro',
      premio: 'Sin recompensas hasta recuperar puntos positivos. Dos valoraciones negativas seguidas y la cuenta revisa sus ofertas.' },
    { id: 'bronce', nombre: 'Bronce', min: 0, icono: '🥉', clase: 'tier-bronce',
      premio: 'Insignia de bienvenida en el perfil y acceso al tablón completo.' },
    { id: 'plata', nombre: 'Plata', min: 2, icono: '🥈', clase: 'tier-plata',
      premio: 'Tu oferta aparece destacada en el tablón durante 24 h.' },
    { id: 'oro', nombre: 'Oro', min: 4, icono: '🥇', clase: 'tier-oro',
      premio: 'Sello verificado y prioridad en el tablón.' },
    { id: 'platino', nombre: 'Platino', min: 6, icono: '🛡️', clase: 'tier-platino',
      premio: '1 destacado al mes y acceso anticipado a las ofertas nuevas.' },
    { id: 'diamante', nombre: 'Diamante', min: 9, icono: '💎', clase: 'tier-diamante',
      premio: '2 destacados al mes e insignia Diamante.' },
    { id: 'ascendente', nombre: 'Ascendente', min: 12, icono: '🔺', clase: 'tier-ascendente',
      premio: 'Perfil en la portada del tablón durante una semana.' },
    { id: 'inmortal', nombre: 'Inmortal', min: 16, icono: '👑', clase: 'tier-inmortal',
      premio: 'Destacados ilimitados y sello Inmortal.' },
    { id: 'radiante', nombre: 'Radiante', min: 20, icono: '🌟', clase: 'tier-radiante',
      premio: 'Máximo rango: tu perfil se muestra como referencia de la comunidad.' }
  ];

  function tier(puntos) {
    var elegido = NIVELES[0];
    NIVELES.forEach(function (n) { if (puntos >= n.min) elegido = n; });
    return elegido;
  }

  function siguiente(puntos) {
    for (var i = 0; i < NIVELES.length; i++) {
      if (NIVELES[i].min > puntos) return NIVELES[i];
    }
    return null;
  }

  function progreso(puntos) {
    var actual = tier(puntos);
    var sig = siguiente(puntos);
    if (!sig) return { pct: 100, faltan: 0, siguiente: null };
    var objetivo = sig.min;
    var pct = objetivo > 0
      ? Math.max(0, Math.min(100, Math.round((Math.max(0, puntos) / objetivo) * 100)))
      : 0;
    return { pct: pct, faltan: Math.max(0, sig.min - puntos), siguiente: sig };
  }

  function clasificacion() {
    return USWAP.usuarios().map(function (u) {
      return {
        usuario: u,
        puntos: USWAP.puntosDe(u.id),
        media: USWAP.mediaDe(u.id),
        num: USWAP.valoracionesDe(u.id).length
      };
    }).sort(function (a, b) {
      if (b.puntos !== a.puntos) return b.puntos - a.puntos;
      if (b.media !== a.media) return b.media - a.media;
      return b.num - a.num;
    });
  }

  window.USWAP_RANK = {
    NIVELES: NIVELES,
    tier: tier,
    siguiente: siguiente,
    progreso: progreso,
    clasificacion: clasificacion
  };

  /* ------------------------------------------------------ solo en ranking.html */
  var cont = document.getElementById('ranking');
  if (!cont) return;

  UI.montarNav('ranking');

  var yoId = USWAP.yo();
  var yo = USWAP.usuario(yoId);
  var todos = clasificacion();
  var miPuntos = USWAP.puntosDe(yoId);
  var miNivel = tier(miPuntos);
  var miProg = progreso(miPuntos);
  var miPos = 0;
  todos.forEach(function (f, i) { if (f.usuario.id === yoId) miPos = i + 1; });

  var areaActiva = 'Todas';
  var elChips = document.getElementById('filtro-area');

  /* ---- tarjeta "tu posición": nunca se filtra ---------------------------- */
  function pintarMiPosicion() {
    var el = document.getElementById('mi-posicion');
    if (!el || !yo) return;

    el.innerHTML =
      '<div class="bloque" style="background:linear-gradient(135deg,#5b5bf6,#8b5cf6);color:#fff;border:none">' +
        '<div style="display:flex;align-items:center;gap:11px">' +
          UI.avatar(yo, 'pequeno') +
          '<div class="usuario-linea" style="flex:1">' +
            '<span class="usuario-nombre" style="color:#fff">Tu posición: #' + miPos + '</span>' +
            '<span class="usuario-detalle" style="color:rgba(255,255,255,.8)">' +
              miNivel.icono + ' ' + miNivel.nombre + ' · ' + miPuntos + ' pts</span>' +
          '</div>' +
          '<span class="badge" style="background:rgba(255,255,255,.2);color:#fff">' + miNivel.nombre + '</span>' +
        '</div>' +
        '<div class="barra-progreso" style="margin-top:14px;background:rgba(255,255,255,.25)">' +
          '<div style="width:' + miProg.pct + '%;background:#fff"></div>' +
        '</div>' +
        '<div class="usuario-detalle" style="color:rgba(255,255,255,.85);margin-top:8px">' +
          (miProg.siguiente
            ? 'Te faltan ' + miProg.faltan + ' puntos para ' + miProg.siguiente.icono + ' ' + miProg.siguiente.nombre
            : 'Nivel máximo alcanzado 💎') +
        '</div>' +
      '</div>';
  }

  /* ---- chips de área ------------------------------------------------------ */
  function pintarChips() {
    if (!elChips) return;

    var opciones = ['Todas'].concat(USWAP.AREAS);
    elChips.innerHTML = opciones.map(function (area) {
      var activo = area === areaActiva;
      return '<button type="button" class="chip' + (activo ? ' activo' : '') + '"' +
        ' data-area="' + UI.esc(area) + '" aria-pressed="' + activo + '">' + UI.esc(area) + '</button>';
    }).join('');

    elChips.addEventListener('click', function (evento) {
      var boton = evento.target.closest('.chip');
      if (!boton) return;
      areaActiva = boton.getAttribute('data-area');
      elChips.querySelectorAll('.chip').forEach(function (chip) {
        var activo = chip === boton;
        chip.classList.toggle('activo', activo);
        chip.setAttribute('aria-pressed', String(activo));
      });
      pintarLista();
    });
  }

  /* ---- clasificación filtrada -------------------------------------------- */
  function visibles() {
    if (areaActiva === 'Todas') return todos;
    return todos.filter(function (f) { return f.usuario.area === areaActiva; });
  }

  function pintarLista() {
    var lista = visibles();
    var total = document.getElementById('total-gente');
    if (total) {
      total.textContent = lista.length + (lista.length === 1 ? ' estudiante' : ' estudiantes') +
        (areaActiva === 'Todas' ? '' : ' · ' + areaActiva);
    }

    if (!lista.length) {
      cont.innerHTML = UI.vacio('Nadie por aquí', 'No hay estudiantes en ' + areaActiva + '. Prueba con otra área.');
      return;
    }

    var medallas = ['🥇', '🥈', '🥉'];
    cont.innerHTML = lista.map(function (f, i) {
      var nivel = tier(f.puntos);
      var puesto = areaActiva === 'Todas' && medallas[i] ? medallas[i] : (i + 1);
      return '<div class="rank-item' + (f.usuario.id === yoId ? ' yo' : '') + '">' +
        '<div class="rank-pos' + (i < 3 ? ' top' : '') + '">' + puesto + '</div>' +
        UI.avatar(f.usuario, 'pequeno') +
        '<div class="usuario-linea" style="flex:1">' +
          '<span class="usuario-nombre">' + UI.esc(f.usuario.nombre) + '</span>' +
          '<span class="usuario-detalle">' + UI.esc(f.usuario.carrera) + ' · ' + UI.esc(f.usuario.curso) + 'º · ' +
            UI.esc(f.usuario.area) + '</span>' +
          '<span class="tier ' + nivel.clase + '" style="margin-top:2px">' + nivel.icono + ' ' + nivel.nombre +
            (f.num ? ' · ' + UI.estrellas(f.media, '') : '') + '</span>' +
        '</div>' +
        '<div class="rank-puntos">' + f.puntos + '<small>puntos</small></div>' +
      '</div>';
    }).join('');
  }

  /* ---- recompensas: desbloqueadas / pendientes --------------------------- */
  function filaNivel(nivel, desbloqueado, esActual) {
    var esObservacion = nivel.id === 'observacion';
    var estado = esObservacion
      ? '<span class="badge badge-rojo">Estado actual</span>'
      : desbloqueado
        ? '<span class="badge badge-verde">✔ Desbloqueado</span>'
        : '<span class="badge" style="background:#f1f5f9;color:#64748b">🔒 Bloqueado</span>';

    var estilo = esObservacion
      ? 'background:#fff5f5;border:1px solid #fecaca;border-radius:12px;padding:11px;margin-bottom:8px'
      : desbloqueado
        ? 'background:#f2fbf5;border-bottom:none;border-radius:12px;padding:11px;margin-bottom:8px'
        : 'opacity:.62;padding:11px 0';

    return '<div class="recompensa" style="' + estilo + '">' +
      '<div class="recompensa-icono" style="' +
        (esObservacion ? 'background:#fee2e2' : desbloqueado ? 'background:#e4f7ea' : '') + '">' + nivel.icono + '</div>' +
      '<div class="recompensa-texto">' +
        '<b>' + nivel.nombre +
          (esActual
            ? ' <span class="badge ' + (esObservacion ? 'badge-rojo' : 'badge-azul') + '">Tu nivel</span>'
            : '') +
          (esObservacion
            ? ''
            : '<span class="usuario-detalle" style="font-weight:600"> · desde ' + (nivel.min <= 0 ? 0 : nivel.min) + ' pts</span>') +
        '</b>' +
        UI.esc(nivel.premio) +
        '<div style="margin-top:4px">' + estado + '</div>' +
      '</div>' +
    '</div>';
  }

  function pintarRecompensas() {
    var el = document.getElementById('recompensas');
    if (!el) return;

    var filas = [];
    if (miNivel.id === 'observacion') {
      filas.push({ nivel: miNivel, desbloqueado: false, actual: true });
    }
    NIVELES.forEach(function (n) {
      if (n.id === 'observacion') return;
      filas.push({ nivel: n, desbloqueado: miPuntos >= n.min, actual: n.id === miNivel.id });
    });

    var desbloqueadas = filas.filter(function (f) { return f.nivel.id !== 'observacion' && f.desbloqueado; }).length;
    var resumen = miNivel.id === 'observacion'
      ? 'Estás en observación: vuelve a 0 puntos para empezar a desbloquear recompensas.'
      : 'Llevas ' + desbloqueadas + ' de ' + (NIVELES.length - 1) + ' recompensas desbloqueadas.';

    var html = filas.map(function (f) {
      var bloque = filaNivel(f.nivel, f.desbloqueado, f.actual);
      if (f.actual) {
        bloque += '<div style="padding:0 4px 14px">' +
          '<div class="barra-progreso"><div style="width:' + miProg.pct + '%"></div></div>' +
          '<div class="usuario-detalle" style="margin-top:6px">' +
            (miProg.siguiente
              ? 'Te faltan ' + miProg.faltan + ' puntos para ' + miProg.siguiente.icono + ' ' + miProg.siguiente.nombre
              : 'Has desbloqueado todas las recompensas 💎') +
          '</div>' +
        '</div>';
      }
      return bloque;
    }).join('');

    el.innerHTML =
      '<p class="usuario-detalle" style="margin:0 0 6px">' + resumen + '</p>' +
      html +
      '<p class="usuario-detalle" style="margin:14px 0 0;line-height:1.5">' +
        'Cómo se calcula: cada valoración de ★4 o ★5 suma 1 punto, ★3 no puntúa y ★1 o ★2 resta 1 punto. ' +
        'El total sale de todas las valoraciones recibidas.</p>';
  }

  pintarMiPosicion();
  pintarChips();
  pintarLista();
  pintarRecompensas();
})();
