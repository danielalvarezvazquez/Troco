/* ==========================================================================
   Troco — COMPONENTES COMUNES         Propietario: P1 (Daniel)
   --------------------------------------------------------------------------
   Cabecera, navegación inferior, avatares, estrellas, avisos.
   Si necesitas un componente nuevo, pídeselo a P1. No edites este archivo.
   Se usa como: USWAP_UI.montarNav('inicio' | 'publicar' | 'ranking' | 'perfil')
   ========================================================================== */
(function () {
  'use strict';

  function esc(txt) {
    return String(txt == null ? '' : txt)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function iniciales(nombre) {
    return String(nombre || '?').trim().split(/\s+/).slice(0, 2)
      .map(function (p) { return p.charAt(0).toUpperCase(); }).join('');
  }

  function avatar(u, clase) {
    if (!u) return '';
    return '<div class="avatar ' + (clase || '') + '" style="background:' + esc(u.color || '#6366f1') + '">' +
      esc(iniciales(u.nombre)) + '</div>';
  }

  function estrellas(media, clase) {
    var llenas = Math.round(Number(media) || 0);
    var html = '<span class="estrellas ' + (clase || '') + '" title="' + esc(media) + ' / 5">';
    for (var i = 1; i <= 5; i++) html += i <= llenas ? '★' : '<span class="gris">★</span>';
    return html + '</span>';
  }

  function tiempo(iso) {
    var ms = Date.now() - new Date(iso).getTime();
    var min = Math.round(ms / 60000);
    if (min < 1) return 'ahora mismo';
    if (min < 60) return 'hace ' + min + ' min';
    var h = Math.round(min / 60);
    if (h < 24) return 'hace ' + h + ' h';
    var d = Math.round(h / 24);
    return d === 1 ? 'ayer' : 'hace ' + d + ' días';
  }

  /* Curso: acepta 3, '3º', 'Máster' o 'Doctorado' y devuelve texto seguro */
  function curso(valor) {
    if (valor === undefined || valor === null || valor === '') return '';
    var v = String(valor);
    if (v.indexOf('º') !== -1 || v === 'Máster' || v === 'Doctorado') return v;
    return v + 'º';
  }

  function param(nombre) {
    var m = new RegExp('[?&]' + nombre + '=([^&#]*)').exec(window.location.search);
    return m ? decodeURIComponent(m[1].replace(/\+/g, ' ')) : '';
  }

  var _toastTimer = null;
  function toast(mensaje) {
    var el = document.getElementById('toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'toast';
      el.className = 'toast';
      document.body.appendChild(el);
    }
    el.textContent = mensaje;
    el.classList.add('visible');
    clearTimeout(_toastTimer);
    _toastTimer = setTimeout(function () { el.classList.remove('visible'); }, 2400);
  }

  function vacio(titulo, texto) {
    return '<div class="vacio"><strong>' + esc(titulo) + '</strong>' + esc(texto) + '</div>';
  }

  /* --------------------------------------------------------------- navegación */
  var ITEMS = [
    { id: 'inicio', href: 'index.html', icono: '🧭', texto: 'Tablón' },
    { id: 'publicar', href: 'publicar.html', icono: '➕', texto: 'Publicar' },
    { id: 'ranking', href: 'ranking.html', icono: '🏆', texto: 'Ranking' },
    { id: 'perfil', href: 'perfil.html', icono: '👤', texto: 'Perfil' }
  ];

  function montarNav(activo) {
    var yo = USWAP.usuario(USWAP.yo());

    var topbar = document.getElementById('topbar');
    if (topbar) {
      var opciones = USWAP.usuarios().map(function (u) {
        return '<option value="' + esc(u.id) + '"' + (u.id === USWAP.yo() ? ' selected' : '') + '>' +
          esc(u.nombre) + '</option>';
      }).join('');
      topbar.className = 'topbar';
      topbar.innerHTML =
        '<a class="marca" href="index.html"><span class="marca-punto">T</span>Troco</a>' +
        '<div class="topbar-derecha">' +
          '<select class="selector-yo" id="selector-yo" title="Cambiar de usuario (modo demo)">' + opciones + '</select>' +
          '<button class="chip chip-mini" id="btn-reset" title="Reiniciar los datos de la demo">↺</button>' +
          '<button class="chip chip-mini" id="btn-salir" title="Cerrar sesión">⏏</button>' +
        '</div>';

      document.getElementById('selector-yo').addEventListener('change', function (e) {
        USWAP.setYo(e.target.value);
        window.location.reload();
      });
      document.getElementById('btn-reset').addEventListener('click', function () {
        if (window.confirm('¿Empezar de cero? Se borran las peticiones y valoraciones que hayáis añadido.')) {
          USWAP.reset();
          window.location.href = 'index.html';
        }
      });
      document.getElementById('btn-salir').addEventListener('click', function () {
        USWAP.salir();
        window.location.href = 'login.html';
      });
    }

    var nav = document.getElementById('bottomnav');
    if (nav) {
      nav.className = 'bottomnav';
      nav.innerHTML = ITEMS.map(function (it) {
        return '<a class="nav-item' + (it.id === activo ? ' activo' : '') + '" href="' + it.href + '">' +
          '<span class="icono">' + it.icono + '</span>' + it.texto + '</a>';
      }).join('');
    }

    return yo;
  }

  window.USWAP_UI = {
    esc: esc,
    iniciales: iniciales,
    avatar: avatar,
    estrellas: estrellas,
    tiempo: tiempo,
    curso: curso,
    param: param,
    toast: toast,
    vacio: vacio,
    montarNav: montarNav
  };

  /* --------------------------------------------------------------------------
     Red de seguridad: si un script falla, NUNCA dejar la página en blanco.
     Muestra un aviso con la causa y la solución (recargar sin caché).
     -------------------------------------------------------------------------- */
  function mostrarError(mensaje) {
    var caja = document.getElementById('error-js');
    if (!caja) {
      caja = document.createElement('div');
      caja.id = 'error-js';
      caja.className = 'error-js';
      caja.setAttribute('role', 'alert');
      document.body.appendChild(caja);
    }
    caja.innerHTML = '<b>Algo ha fallado al cargar esta pantalla.</b>' +
      '<span>Pulsa <b>Ctrl + F5</b> para recargar sin caché. Si sigue igual, avisa a P1.</span>' +
      '<code>' + esc(mensaje) + '</code>';
    caja.style.display = 'block';
  }

  window.addEventListener('error', function (e) {
    mostrarError((e && e.message) || 'Error desconocido');
  });
  window.addEventListener('unhandledrejection', function (e) {
    mostrarError((e && e.reason && (e.reason.message || e.reason)) || 'Promesa rechazada');
  });

  /* --------------------------------------------------------------------------
     Control de sesión: sin sesión no se ve nada salvo login y registro.
     Se comprueba la versión de data.js para no romper con cachés antiguas.
     -------------------------------------------------------------------------- */
  (function proteger() {
    var archivo = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    if (archivo === 'login.html' || archivo === 'registro.html') return;
    if (!window.USWAP || typeof USWAP.sesion !== 'function') return;
    if (!USWAP.sesion()) window.location.replace('login.html');
  })();
})();
