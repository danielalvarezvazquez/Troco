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

  /* ---- recompensas visuales: insignia, brillo y arcoíris (P3) ------------ */
  (function inyectarEstilosRecompensas() {
    if (document.getElementById('usr-recompensas-css')) return;
    var css = [
      '.usr-avatar-wrap{position:relative;display:inline-flex;flex:0 0 auto;}',
      '.usr-badge{position:absolute;right:-4px;bottom:-4px;z-index:2;display:grid;place-items:center;' +
        'width:17px;height:17px;border-radius:999px;background:#fff;border:1px solid #e5e7eb;' +
        'font-size:9px;line-height:1;box-shadow:0 2px 7px rgba(15,23,42,.2);}',
      '.usr-badge--lg{right:-5px;bottom:-5px;width:23px;height:23px;font-size:13px;}',
      '.usr-marco-brillo{animation:usr-pulso 2.8s ease-in-out infinite;}',
      '@keyframes usr-pulso{0%,100%{filter:drop-shadow(0 0 2px var(--usr-color));}' +
        '50%{filter:drop-shadow(0 0 12px var(--usr-color));}}',
      '.usr-badge--glow{animation:usr-badge-pulso 2.8s ease-in-out infinite;}',
      '@keyframes usr-badge-pulso{0%,100%{box-shadow:0 2px 7px rgba(15,23,42,.2);}' +
        '50%{box-shadow:0 2px 7px rgba(15,23,42,.2),0 0 10px 2px var(--usr-color);}}',
      '.usr-nombre-brillo{animation:usr-texto-pulso 2.8s ease-in-out infinite;}',
      '@keyframes usr-texto-pulso{0%,100%{text-shadow:0 0 4px currentColor;}' +
        '50%{text-shadow:0 0 12px currentColor,0 0 24px currentColor;}}',
      '.usr-nombre-arcoiris{background:linear-gradient(90deg,#ff3b30,#ff9500,#ffcc00,#34c759,#00c7be,' +
        '#0a84ff,#5e5ce6,#ff2d55,#ff3b30);background-size:300% 100%;-webkit-background-clip:text;' +
        'background-clip:text;color:transparent;-webkit-text-fill-color:transparent;' +
        'animation:usr-arcoiris 4.5s linear infinite;}',
      '@keyframes usr-arcoiris{to{background-position:300% 50%;}}',
      '@media (prefers-reduced-motion: reduce){.usr-marco-brillo,.usr-badge--glow,' +
        '.usr-nombre-brillo,.usr-nombre-arcoiris{animation:none!important;}}'
    ].join('');
    var estilo = document.createElement('style');
    estilo.id = 'usr-recompensas-css';
    estilo.textContent = css;
    document.head.appendChild(estilo);
  })();

  function esRangoAlto(nivel) {
    return !!nivel && (nivel.id === 'diamante' || nivel.id === 'ascendente' ||
      nivel.id === 'inmortal' || nivel.id === 'radiante');
  }

  function claseNombre(nivel) {
    if (!nivel) return '';
    if (nivel.id === 'radiante') return 'usr-nombre-arcoiris';
    if (nivel.id === 'ascendente' || nivel.id === 'inmortal') return 'usr-nombre-brillo';
    return '';
  }

  /* ---- rangos: puntos por reseña; cada umbral duplica el anterior desde 40 -- */
  var NIVELES = [
    { id: 'hierro', nombre: 'Hierro', min: 0, color: '#475569', marco: '#94a3b8', icono: '🩶', clase: 'tier-hierro',
      premio: 'Marco de hierro y nombre en gris. El punto de partida.' },
    { id: 'bronce', nombre: 'Bronce', min: 40, color: '#b45309', marco: '#b45309', icono: '🥉', clase: 'tier-bronce',
      premio: 'Marco de bronce y nombre en cobre. Acceso completo al tablón.' },
    { id: 'plata', nombre: 'Plata', min: 80, color: '#64748b', marco: '#cbd5e1', icono: '🥈', clase: 'tier-plata',
      premio: 'Marco de plata y nombre en gris claro. Tu oferta se destaca 24 h.' },
    { id: 'oro', nombre: 'Oro', min: 160, color: '#a16207', marco: '#eab308', icono: '🥇', clase: 'tier-oro',
      premio: 'Marco dorado y nombre en oro. Sello verificado y prioridad en el tablón.' },
    { id: 'platino', nombre: 'Platino', min: 320, color: '#0e7490', marco: '#22d3ee', icono: '🛡️', clase: 'tier-platino',
      premio: 'Marco de platino y nombre en cian. 1 destacado al mes.' },
    { id: 'diamante', nombre: 'Diamante', min: 640, color: '#1d4ed8', marco: '#60a5fa', icono: '💎', clase: 'tier-diamante',
      premio: 'Marco de diamante y nombre en azul. 2 destacados al mes.' },
    { id: 'ascendente', nombre: 'Ascendente', min: 1280, color: '#6d28d9', marco: '#a78bfa', icono: '🔺', clase: 'tier-ascendente',
      premio: 'Marco ascendente y nombre en violeta. Perfil en portada una semana.' },
    { id: 'inmortal', nombre: 'Inmortal', min: 2560, color: '#b91c1c', marco: '#ef4444', icono: '👑', clase: 'tier-inmortal',
      premio: 'Marco inmortal y nombre en rojo. Destacados ilimitados.' },
    { id: 'radiante', nombre: 'Radiante', min: 5120, color: '#a21caf', marco: '#e879f9', icono: '🌟', clase: 'tier-radiante',
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
      if (!!a.usuario.avisoBaneo !== !!b.usuario.avisoBaneo) return a.usuario.avisoBaneo ? 1 : -1;
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

  /* Marco de avatar + insignia de esquina + color de nombre. */
  function avatarConMarco(usuario, nivel) {
    var color = nivel.marco || '#94a3b8';
    var alto = esRangoAlto(nivel);
    var sombra = '0 0 0 2px ' + color + (nivel.id === 'radiante' ? ', 0 0 12px ' + color : '');
    return '<span class="usr-avatar-wrap' + (alto ? ' usr-marco-brillo' : '') + '"' +
        ' style="border-radius:11px;box-shadow:' + sombra + ';--usr-color:' + color + '">' +
      UI.avatar(usuario, 'pequeno') +
      '<span class="usr-badge' + (alto ? ' usr-badge--glow' : '') + '" aria-hidden="true">' +
        (nivel.icono || '') + '</span>' +
    '</span>';
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
      '<div class="bloque" style="position:relative;overflow:hidden;background:radial-gradient(420px 200px at 100% 0%,rgba(234,179,8,.18),rgba(234,179,8,0) 70%),linear-gradient(160deg,#1e293b 0%,#0f172a 72%);color:#fff;border:1px solid rgba(234,179,8,.30);box-shadow:0 22px 44px -30px rgba(15,23,42,.95)">' +
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
          '<span class="usuario-nombre' + (claseNombre(nivel) ? ' ' + claseNombre(nivel) : '') + '"' +
            (nivel.id === 'radiante' ? '' : ' style="color:' + nivel.color + '"') + '>' +
            UI.esc(f.usuario.nombre) + '</span>' +
          '<span class="usuario-detalle">' + UI.esc(f.usuario.carrera) + ' · ' + UI.curso(f.usuario.curso) + ' · ' +
            UI.esc(f.usuario.rama) + '</span>' +
          '<span class="tier ' + nivel.clase + '" style="margin-top:2px">' + nivel.icono + ' ' + nivel.nombre +
            (f.num ? ' · ' + UI.estrellas(f.media, '') : '') +
            (f.usuario.avisoBaneo ? ' <span class="badge badge-rojo">⚠ En observación</span>' : '') + '</span>' +
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
          '<span class="' + claseNombre(nivel) + '" style="font-weight:700;font-size:12px;' +
            (nivel.id === 'radiante' ? '' : 'color:' + nivel.color + ';') + '">' +
            UI.esc(yo.nombre) + '</span>' +
          '<span class="usuario-detalle">marco + nombre</span>' +
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
        'Cómo se calcula: ★1 resta 20 puntos · ★2 no suma · ★3 suma 20 · ★4 suma 40 · ★5 suma 80. ' +
        'El primer rango se consigue con 40 puntos y cada uno siguiente duplica el anterior (40, 80, 160, 320…).</p>';
  }

  pintarMiPosicion();
  pintarChips();
  pintarLista();
  pintarRecompensas();
})();
