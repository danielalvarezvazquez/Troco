/* ==========================================================================
   PERFIL                              Propietario: P4 (sergiooleeonn)
   --------------------------------------------------------------------------
   Solo se editan este archivo, perfil.html y editar-perfil.html.
   Muestra el perfil de ?u=<id> o, si no hay parámetro, el del usuario actual.
   Los niveles vienen de window.USWAP_RANK (js/ranking.js, de P3).
   ========================================================================== */
(function () {
  'use strict';

  var UI = window.USWAP_UI;

  UI.montarNav('perfil');

  var uid = UI.param('u') || USWAP.yo();
  var u = USWAP.usuario(uid) || USWAP.usuario(USWAP.yo());
  var soyYo = u.id === USWAP.yo();

  var puntos = USWAP.puntosDe(u.id);
  var media = USWAP.mediaDe(u.id);
  var valoraciones = USWAP.valoracionesDe(u.id);
  var ofertas = USWAP.ofertasDe(u.id);
  var nivel = window.USWAP_RANK ? window.USWAP_RANK.tier(puntos) : { nombre: '—', icono: '', clase: '' };
  var prog = window.USWAP_RANK ? window.USWAP_RANK.progreso(puntos) : { pct: 0, siguiente: null, faltan: 0 };
  var clasificacion = window.USWAP_RANK ? window.USWAP_RANK.clasificacion() : [];
  var posicion = 0;
  clasificacion.forEach(function (f, i) { if (f.usuario.id === u.id) posicion = i + 1; });

  /* ------------------------------------------------------------ cabecera */
  document.getElementById('perfil').innerHTML = '' +
    '<div class="bloque" style="text-align:center;padding:24px 18px">' +
      UI.avatar(u, 'grande') +
      '<h1 style="margin:12px 0 3px;font-size:21px;letter-spacing:-.5px">' + UI.esc(u.nombre) + '</h1>' +
      '<div class="usuario-detalle">' + UI.esc(u.carrera) + ' · ' + UI.esc(u.curso) + 'º curso · ' + UI.esc(u.area) + '</div>' +
      '<div style="margin-top:9px">' + UI.estrellas(media) +
        ' <span class="usuario-detalle">' + (valoraciones.length ? media + ' · ' + valoraciones.length + ' valoraciones' : 'sin valoraciones') + '</span></div>' +
      '<div class="tier ' + nivel.clase + '" style="margin-top:11px;font-size:12.5px">' +
        nivel.icono + ' ' + nivel.nombre + ' · ' + puntos + ' pts' +
        (posicion ? ' · #' + posicion : '') + '</div>' +
      (prog.siguiente
        ? '<div class="barra-progreso" style="margin-top:12px"><div style="width:' + prog.pct + '%"></div></div>' +
          '<div class="usuario-detalle" style="margin-top:7px">Te faltan ' + prog.faltan + ' puntos para ' + prog.siguiente.nombre + '</div>'
        : '') +
      (soyYo
        ? '<a class="btn btn-secundario btn-bloque" href="editar-perfil.html">Editar perfil</a>'
        : '<a class="btn btn-secundario btn-bloque" href="index.html">Ver peticiones en el tablón</a>') +
    '</div>' +

    '<div class="stats" style="margin-top:12px">' +
      '<div class="stat"><b>' + media.toFixed(1) + '</b><span>estrellas</span></div>' +
      '<div class="stat"><b>' + ofertas.length + '</b><span>peticiones</span></div>' +
      '<div class="stat"><b>' + puntos + '</b><span>puntos</span></div>' +
    '</div>' +

    (u.bio ? '<div class="bloque" style="margin-top:12px"><p class="detalle-texto" style="margin:0">' + UI.esc(u.bio) + '</p></div>' : '') +

    '<div class="seccion-titulo"><h2>Habilidades</h2></div>' +
    ((u.habilidades && u.habilidades.length)
      ? '<div class="chips" style="flex-wrap:wrap;overflow:visible">' +
        u.habilidades.map(function (h) {
          return '<span class="chip chip-mini" style="cursor:default">' + UI.esc(h) + '</span>';
        }).join('') + '</div>'
      : UI.vacio('Sin habilidades', 'Añade tus habilidades para que te encuentren.') // si soy yo, invita a editar
    ) +

    '<div class="seccion-titulo"><h2>Contacto</h2></div>' +
    '<div class="bloque"><div class="fila">' +
      '<a class="btn btn-whatsapp" target="_blank" rel="noopener" href="https://wa.me/' + encodeURIComponent(u.whatsapp || '') + '">WhatsApp</a>' +
      '<a class="btn btn-instagram" target="_blank" rel="noopener" href="https://instagram.com/' + encodeURIComponent(u.instagram || '') + '">Instagram</a>' +
    '</div></div>';

  /* ------------------------------------------------------------- ofertas */
  document.getElementById('ofertas').innerHTML = ofertas.length
    ? ofertas.map(function (o) {
        return '<a class="card" href="oferta.html?id=' + encodeURIComponent(o.id) + '">' +
          '<div style="display:flex;justify-content:space-between;gap:8px;align-items:flex-start">' +
            '<h3 class="card-titulo" style="margin:0">' + UI.esc(o.titulo) + '</h3>' +
            '<span class="badge ' + (o.estado === 'cerrada' ? 'badge-verde' : 'badge-azul') + '">' +
              (o.estado === 'cerrada' ? 'Cerrada' : 'Abierta') + '</span>' +
          '</div>' +
          '<div class="card-pie"><span>' + UI.esc(o.categoria) + '</span><span>' + UI.tiempo(o.creadaEn) + '</span></div>' +
        '</a>';
      }).join('')
    : UI.vacio('Todavía no ha publicado nada', soyYo ? 'Pulsa en Publicar para crear tu primera petición.' : '');

  /* -------------------------------------------------------- valoraciones */
  document.getElementById('num-val').textContent = valoraciones.length ? valoraciones.length + ' en total' : '';
  document.getElementById('valoraciones').innerHTML = valoraciones.length
    ? valoraciones.map(function (v) {
        var de = USWAP.usuario(v.deUsuarioId) || { nombre: 'Alguien', color: '#94a3b8' };
        return '<div class="bloque" style="padding:13px">' +
          '<div class="card-fila">' +
            UI.avatar(de, 'pequeno') +
            '<div class="usuario-linea" style="flex:1">' +
              '<span class="usuario-nombre">' + UI.esc(de.nombre) + '</span>' +
              '<span class="usuario-detalle">' + UI.tiempo(v.creadaEn) + '</span>' +
            '</div>' +
            UI.estrellas(v.estrellas) +
          '</div>' +
          (v.comentario ? '<p class="detalle-texto" style="margin:9px 0 0;font-size:12.5px">“' + UI.esc(v.comentario) + '”</p>' : '') +
        '</div>';
      }).join('')
    : UI.vacio('Sin valoraciones', 'Cierra tratos y pide que te valoren para subir en el ranking.');
})();
