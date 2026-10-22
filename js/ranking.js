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

  /* ---- rangos: 10 puntos por estrella; umbrales acumulados ---------------- */
  var NIVELES = [
    { id: 'hierro', nombre: 'Hierro', min: 0, color: '#475569', marco: '#94a3b8', icono: '🩶', clase: 'tier-hierro',
      premio: 'Marco de hierro y nombre en gris. El punto de partida.' },
    { id: 'bronce', nombre: 'Bronce', min: 50, color: '#b45309', marco: '#b45309', icono: '🥉', clase: 'tier-bronce',
      premio: 'Marco de bronce y nombre en cobre. Acceso completo al tablón.' },
    { id: 'plata', nombre: 'Plata', min: 100, color: '#64748b', marco: '#cbd5e1', icono: '🥈', clase: 'tier-plata',
      premio: 'Marco de plata y nombre en gris claro. Tu oferta se destaca 24 h.' },
    { id: 'oro', nombre: 'Oro', min: 150, color: '#a16207', marco: '#eab308', icono: '🥇', clase: 'tier-oro',
      premio: 'Marco dorado y nombre en oro. Sello verificado y prioridad en el tablón.' },
    { id: 'platino', nombre: 'Platino', min: 200, color: '#0e7490', marco: '#22d3ee', icono: '🛡️', clase: 'tier-platino',
      premio: 'Marco de platino y nombre en cian. 1 destacado al mes.' },
    { id: 'diamante', nombre: 'Diamante', min: 250, color: '#1d4ed8', marco: '#60a5fa', icono: '💎', clase: 'tier-diamante',
      premio: 'Marco de diamante y nombre en azul. 2 destacados al mes.' },
    { id: 'ascendente', nombre: 'Ascendente', min: 300, color: '#6d28d9', marco: '#a78bfa', icono: '🔺', clase: 'tier-ascendente',
      premio: 'Marco ascendente y nombre en violeta. Perfil en portada una semana.' },
    { id: 'inmortal', nombre: 'Inmortal', min: 400, color: '#b91c1c', marco: '#ef4444', icono: '👑', clase: 'tier-inmortal',
      premio: 'Marco inmortal y nombre en rojo. Destacados ilimitados.' },
    { id: 'radiante', nombre: 'Radiante', min: 500, color: '#a21caf', marco: '#e879f9', icono: '🌟', clase: 'tier-radiante',
      premio: 'Marco radiante con brillo y nombre en magenta. Referencia de la comunidad.' }
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

  /* Marco de avatar + color de nombre: la recompensa visible del rango. */
  function avatarConMarco(usuario, nivel) {
    var color = nivel.marco || '#94a3b8';
    var sombra = '0 0 0 2px ' + color + (nivel.id === 'radiante' ? ', 0 0 12px ' + color : '');
    return '<span style="display:inline-flex;flex:0 0 auto;border-radius:11px;box-shadow:' + sombra + '">' +
      UI.avatar(usuario, 'pequeno') + '</span>';
  }

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

  var ramaActiva = 'Todas';
  var elChips = document.getElementById('filtro-rama');

  /* ---- tarjeta "tu posición": nunca se filtra ---------------------------- */
  function pintarMiPosicion() {
    var el = document.getElementById('mi-posicion');
    if (!el || !yo) return;

    el.innerHTML =
      '<div class="bloque" style="background:linear-gradient(135deg,#5b5bf6,#8b5cf6);color:#fff;border:none">' +
        '<div style="display:flex;align-items:center;gap:11px">' +
          avatarConMarco(yo, miNivel) +
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

  /* ---- chips de rama ------------------------------------------------------ */
  function pintarChips() {
    if (!elChips) return;

    var opciones = ['Todas'].concat(USWAP.RAMAS);
    elChips.innerHTML = opciones.map(function (rama) {
      var activo = rama === ramaActiva;
      return '<button type="button" class="chip' + (activo ? ' activo' : '') + '"' +
        ' data-rama="' + UI.esc(rama) + '" aria-pressed="' + activo + '">' + UI.esc(rama) + '</button>';
    }).join('');

    elChips.addEventListener('click', function (evento) {
      var boton = evento.target.closest('.chip');
      if (!boton) return;
      ramaActiva = boton.getAttribute('data-rama');
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
    if (ramaActiva === 'Todas') return todos;
    return todos.filter(function (f) { return f.usuario.rama === ramaActiva; });
  }

  function pintarLista() {
    var lista = visibles();
    var total = document.getElementById('total-gente');
    if (total) {
      total.textContent = lista.length + (lista.length === 1 ? ' estudiante' : ' estudiantes') +
        (ramaActiva === 'Todas' ? '' : ' · ' + ramaActiva);
    }

    if (!lista.length) {
      cont.innerHTML = UI.vacio('Nadie por aquí', 'No hay estudiantes en ' + ramaActiva + '. Prueba con otra rama.');
      return;
    }

    var medallas = ['🥇', '🥈', '🥉'];
    cont.innerHTML = lista.map(function (f, i) {
      var nivel = tier(f.puntos);
      var puesto = ramaActiva === 'Todas' && medallas[i] ? medallas[i] : (i + 1);
      return '<div class="rank-item' + (f.usuario.id === yoId ? ' yo' : '') + '">' +
        '<div class="rank-pos' + (i < 3 ? ' top' : '') + '">' + puesto + '</div>' +
        avatarConMarco(f.usuario, nivel) +
        '<div class="usuario-linea" style="flex:1">' +
          '<span class="usuario-nombre" style="color:' + nivel.color + '">' + UI.esc(f.usuario.nombre) + '</span>' +
          '<span class="usuario-detalle">' + UI.esc(f.usuario.carrera) + ' · ' + UI.curso(f.usuario.curso) + ' · ' +
            UI.esc(f.usuario.rama) + '</span>' +
          '<span class="tier ' + nivel.clase + '" style="margin-top:2px">' + nivel.icono + ' ' + nivel.nombre +
            (f.num ? ' · ' + UI.estrellas(f.media, '') : '') + '</span>' +
        '</div>' +
        '<div class="rank-puntos">' + f.puntos + '<small>puntos</small></div>' +
      '</div>';
    }).join('');
  }

  /* ---- recompensas: desbloqueadas / pendientes --------------------------- */
  function filaNivel(nivel, desbloqueado, esActual) {
    var estado = desbloqueado
      ? '<span class="badge badge-verde">✔ Desbloqueado</span>'
      : '<span class="badge" style="background:#f1f5f9;color:#64748b">🔒 Bloqueado</span>';

    var estilo = desbloqueado
      ? 'background:#f2fbf5;border-bottom:none;border-radius:12px;padding:11px;margin-bottom:8px'
      : 'opacity:.62;padding:11px 0';

    return '<div class="recompensa" style="' + estilo + '">' +
      '<div class="recompensa-icono" style="' + (desbloqueado ? 'background:#e4f7ea' : '') + '">' + nivel.icono + '</div>' +
      '<div class="recompensa-texto">' +
        '<b>' + nivel.nombre +
          (esActual ? ' <span class="badge badge-azul">Tu nivel</span>' : '') +
          '<span class="usuario-detalle" style="font-weight:600"> · desde ' + nivel.min + ' pts</span>' +
        '</b>' +
        UI.esc(nivel.premio) +
        '<div style="display:flex;align-items:center;gap:8px;margin-top:8px">' +
          avatarConMarco(yo, nivel) +
          '<span style="color:' + nivel.color + ';font-weight:700;font-size:12px">' + UI.esc(yo.nombre) + '</span>' +
          '<span class="usuario-detalle">marco + color</span>' +
        '</div>' +
        '<div style="margin-top:4px">' + estado + '</div>' +
      '</div>' +
    '</div>';
  }

  function pintarRecompensas() {
    var el = document.getElementById('recompensas');
    if (!el || !yo) return;

    var desbloqueadas = 0;
    var html = NIVELES.map(function (nivel) {
      var desbloqueado = miPuntos >= nivel.min;
      if (desbloqueado) desbloqueadas += 1;
      var esActual = nivel.id === miNivel.id;
      var bloque = filaNivel(nivel, desbloqueado, esActual);
      if (esActual) {
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
      '<p class="usuario-detalle" style="margin:0 0 6px">Llevas ' + desbloqueadas + ' de ' + NIVELES.length + ' recompensas desbloqueadas.</p>' +
      html +
      '<p class="usuario-detalle" style="margin:14px 0 0;line-height:1.5">' +
        'Cómo se calcula: cada reseña suma 10 puntos por estrella (★1 = 10, ★2 = 20, ★3 = 30, ★4 = 40 y ★5 = 50). ' +
        'Sin reseñas tienes 0 puntos. Los umbrales de cada rango son acumulados.</p>';
  }

  pintarMiPosicion();
  pintarChips();
  pintarLista();
  pintarRecompensas();
})();
