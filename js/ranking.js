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
    { id: 'observacion', nombre: 'En observación', min: -9999, icono: '⚠️', clase: 'tier-observacion',
      premio: 'Sin recompensas hasta recuperar puntos positivos. Dos valoraciones negativas seguidas y la cuenta revisa sus ofertas.' },
    { id: 'bronce', nombre: 'Bronce', min: 0, icono: '🥉', clase: 'tier-bronce',
      premio: 'Insignia de bienvenida en el perfil y acceso al tablón completo.' },
    { id: 'plata', nombre: 'Plata', min: 3, icono: '🥈', clase: 'tier-plata',
      premio: 'Tu oferta aparece destacada en el tablón durante 24 h.' },
    { id: 'oro', nombre: 'Oro', min: 6, icono: '🥇', clase: 'tier-oro',
      premio: 'Sello verificado, prioridad en el tablón y 1 destacado al mes.' },
    { id: 'elite', nombre: 'Élite', min: 10, icono: '💎', clase: 'tier-elite',
      premio: '2 destacados al mes, insignia Élite y acceso anticipado a las ofertas nuevas.' }
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
    var base = actual.min === -9999 ? 0 : actual.min;
    var rango = sig.min - base;
    var hecho = puntos - base;
    return { pct: Math.max(0, Math.min(100, Math.round((hecho / rango) * 100))), faltan: sig.min - puntos, siguiente: sig };
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

  /* --------------------------------------------------------- solo en ranking.html */
  var cont = document.getElementById('ranking');
  if (!cont) return;

  UI.montarNav('ranking');

  var yo = USWAP.yo();
  var lista = clasificacion();
  var misPuntos = USWAP.puntosDe(yo);
  var miNivel = tier(misPuntos);
  var miProg = progreso(misPuntos);
  var miPos = 0;
  lista.forEach(function (f, i) { if (f.usuario.id === yo) miPos = i + 1; });

  /* --- tarjeta "mi posición" --- */
  document.getElementById('mi-posicion').innerHTML =
    '<div class="bloque" style="background:linear-gradient(135deg,#5b5bf6,#8b5cf6);color:#fff;border:none">' +
      '<div style="display:flex;align-items:center;gap:11px">' +
        UI.avatar(USWAP.usuario(yo), 'pequeno') +
        '<div class="usuario-linea" style="flex:1">' +
          '<span class="usuario-nombre" style="color:#fff">Tu posición: #' + miPos + '</span>' +
          '<span class="usuario-detalle" style="color:rgba(255,255,255,.8)">' +
            miNivel.icono + ' ' + miNivel.nombre + ' · ' + misPuntos + ' pts</span>' +
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

  /* --- clasificación --- */
  document.getElementById('total-gente').textContent = lista.length + ' estudiantes';
  cont.innerHTML = lista.map(function (f, i) {
    var nivel = tier(f.puntos);
    var medallas = ['🥇', '🥈', '🥉'];
    return '<div class="rank-item' + (f.usuario.id === yo ? ' yo' : '') + '">' +
      '<div class="rank-pos' + (i < 3 ? ' top' : '') + '">' + (medallas[i] || (i + 1)) + '</div>' +
      UI.avatar(f.usuario, 'pequeno') +
      '<div class="usuario-linea" style="flex:1">' +
        '<span class="usuario-nombre">' + UI.esc(f.usuario.nombre) + '</span>' +
        '<span class="usuario-detalle">' + UI.esc(f.usuario.carrera) + ' · ' + UI.esc(f.usuario.curso) + 'º</span>' +
        '<span class="tier ' + nivel.clase + '" style="margin-top:2px">' + nivel.icono + ' ' + nivel.nombre +
          (f.num ? ' · ' + UI.estrellas(f.media, '') + '' : '') + '</span>' +
      '</div>' +
      '<div class="rank-puntos">' + f.puntos + '<small>puntos</small></div>' +
    '</div>';
  }).join('');

  /* --- recompensas --- */
  document.getElementById('recompensas').innerHTML =
    NIVELES.slice().reverse().map(function (n) {
      var actual = n.id === miNivel.id;
      return '<div class="recompensa">' +
        '<div class="recompensa-icono"' + (actual ? ' style="background:#eeefff"' : '') + '>' + n.icono + '</div>' +
        '<div class="recompensa-texto"><b>' + n.nombre +
          (actual ? ' <span class="badge badge-azul">tu nivel</span>' : '') +
          '<span class="usuario-detalle" style="font-weight:600"> · desde ' + (n.min <= 0 ? 0 : n.min) + ' pts</span></b>' +
          UI.esc(n.premio) +
        '</div>' +
      '</div>';
    }).join('') +
    '<p class="usuario-detalle" style="margin:14px 0 0;line-height:1.5">' +
      'Cómo se calcula: cada valoración de ★4 o ★5 suma 1 punto, ★3 no puntúa y ★1 o ★2 resta 1 punto. ' +
      'El total sale de todas las valoraciones recibidas.</p>';
})();
