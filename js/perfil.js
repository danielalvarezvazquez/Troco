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

  /* --- resumen de reputación y tratos cerrados --- */
  var cerradas = ofertas.filter(function (o) { return o.estado === 'cerrada'; }).length;
  var positivas = 0, neutras = 0, negativas = 0;
  valoraciones.forEach(function (v) {
    if (v.estrellas >= 4) positivas += 1;
    else if (v.estrellas <= 2) negativas += 1;
    else neutras += 1;
  });

  var nivel = window.USWAP_RANK ? window.USWAP_RANK.tier(puntos) : { nombre: '—', icono: '', clase: '' };
  var prog = window.USWAP_RANK ? window.USWAP_RANK.progreso(puntos) : { pct: 0, siguiente: null, faltan: 0 };
  var clasificacion = window.USWAP_RANK ? window.USWAP_RANK.clasificacion() : [];
  var posicion = 0;
  clasificacion.forEach(function (f, i) { if (f.usuario.id === u.id) posicion = i + 1; });

  var total = valoraciones.length;
  var mediaTxt = total ? media.toFixed(1) : '—';
  var textoVal = total ? total + (total === 1 ? ' valoración' : ' valoraciones') : 'sin valoraciones';

  /* --- contacto: enlaces discretos, solo los que existen --- */
  var estiloEnlace = 'color:var(--tinta-suave);text-decoration:none;font-weight:650;font-size:12px;' +
    'border-bottom:1px solid #dfe4ee;padding-bottom:1px';
  var micro = '';
  if (u.instagram) {
    micro += '<a style="' + estiloEnlace + '" target="_blank" rel="noopener" href="https://instagram.com/' +
      encodeURIComponent(u.instagram) + '">Instagram ↗</a>';
  }
  if (soyYo && u.whatsapp) {
    micro += '<a style="' + estiloEnlace + '" target="_blank" rel="noopener" href="https://wa.me/' +
      encodeURIComponent(u.whatsapp) + '">WhatsApp ↗</a>';
  }

  function celda(valor, etiqueta, primera) {
    return '<div class="stat" style="background:transparent;border:0;border-radius:0;text-align:left;' +
        'padding:0 0 0 14px' + (primera ? '' : ';border-left:1px solid #eef1f7') + '">' +
        '<b style="font-size:17px;letter-spacing:-.5px">' + valor + '</b>' +
        '<span style="font-size:9.5px;letter-spacing:.1em">' + etiqueta + '</span>' +
      '</div>';
  }

  /* ------------------------------------------------------------ cabecera */
  document.getElementById('perfil').innerHTML = '' +
    '<div class="bloque" style="padding:20px 18px 16px">' +
      '<div style="display:flex;align-items:center;gap:14px">' +
        UI.avatar(u, 'grande') +
        '<div style="min-width:0">' +
          '<h1 style="margin:0;font-size:23px;line-height:1.12;letter-spacing:-.8px">' + UI.esc(u.nombre) + '</h1>' +
          '<div class="usuario-detalle" style="margin-top:4px;font-size:12px;line-height:1.35">' +
            UI.esc(u.carrera) + ' · ' + UI.esc(u.curso) + 'º curso · ' + UI.esc(u.area) + '</div>' +
        '</div>' +
      '</div>' +

      '<div style="display:flex;align-items:center;gap:9px;margin-top:16px;padding-top:14px;border-top:1px solid #eef1f7">' +
        '<b style="font-size:27px;line-height:1;letter-spacing:-1.2px">' + mediaTxt + '</b>' +
        (total ? UI.estrellas(media, 'grande') : '') +
        '<span class="usuario-detalle" style="margin-left:auto">' + textoVal + '</span>' +
      '</div>' +

      (total
        ? '<div style="display:flex;gap:14px;margin-top:9px;font-size:11.5px;font-weight:650">' +
            '<span style="color:var(--verde)">' + positivas + (positivas === 1 ? ' positiva' : ' positivas') + '</span>' +
            '<span style="color:var(--muted)">' + neutras + (neutras === 1 ? ' neutra' : ' neutras') + '</span>' +
            '<span style="color:var(--rojo)">' + negativas + (negativas === 1 ? ' negativa' : ' negativas') + '</span>' +
          '</div>'
        : '') +

      '<div style="display:flex;align-items:baseline;justify-content:space-between;gap:10px;margin-top:16px">' +
        '<span class="tier ' + nivel.clase + '" style="font-size:12px">' + UI.esc(nivel.nombre) + ' · ' + puntos + ' pts</span>' +
        (posicion ? '<span class="usuario-detalle">Puesto #' + posicion + '</span>' : '') +
      '</div>' +

      (prog.siguiente
        ? '<div class="barra-progreso" style="margin-top:10px"><div style="width:' + prog.pct + '%"></div></div>' +
          '<div class="usuario-detalle" style="margin-top:7px">Te faltan ' + prog.faltan + ' puntos para ' + UI.esc(prog.siguiente.nombre) + '</div>'
        : '') +

      (soyYo
        ? '<a class="btn btn-secundario" style="margin-top:18px" href="editar-perfil.html">Editar perfil</a>'
        : '<div class="fila" style="margin-top:18px">' +
            (u.whatsapp
              ? '<a class="btn btn-whatsapp" target="_blank" rel="noopener" href="https://wa.me/' + encodeURIComponent(u.whatsapp) + '">WhatsApp</a>'
              : '') +
            '<a class="btn btn-secundario" href="index.html">Ver ofertas</a>' +
          '</div>' +
          '<div class="usuario-detalle" style="margin-top:9px;text-align:center">Contacta para negociar el intercambio</div>') +

      (micro
        ? '<div style="display:flex;justify-content:center;gap:18px;margin-top:15px;padding-top:13px;border-top:1px solid #eef1f7">' +
            micro + '</div>'
        : '') +
    '</div>' +

    '<div class="stats" style="margin-top:12px;grid-template-columns:repeat(4,1fr);gap:0;background:#fff;' +
      'border:1px solid var(--borde);border-radius:var(--radio-sm);padding:13px 0">' +
      celda(total, total === 1 ? 'valoración' : 'valoraciones', true) +
      celda(ofertas.length, ofertas.length === 1 ? 'oferta' : 'ofertas') +
      celda(cerradas, cerradas === 1 ? 'cerrada' : 'cerradas') +
      celda(puntos, Math.abs(puntos) === 1 ? 'punto' : 'puntos') +
    '</div>' +

    (u.bio ? '<div class="bloque" style="margin-top:12px"><p class="detalle-texto" style="margin:0;line-height:1.55">' +
      UI.esc(u.bio) + '</p></div>' : '') +

    '<div class="seccion-titulo"><h2>Habilidades</h2></div>' +
    ((u.habilidades && u.habilidades.length)
      ? '<div class="chips" style="flex-wrap:wrap;overflow:visible">' +
        u.habilidades.map(function (h) {
          return '<span class="chip chip-mini" style="cursor:default">' + UI.esc(h) + '</span>';
        }).join('') + '</div>'
      : UI.vacio('Sin habilidades', soyYo
          ? 'Añádelas en Editar perfil para que te encuentren.'
          : 'Todavía no ha añadido habilidades.'));

  /* --------------------------------------------------- títulos que dependen de quién es */
  var tituloOfertas = document.getElementById('titulo-ofertas');
  if (tituloOfertas) tituloOfertas.textContent = soyYo ? 'Tus ofertas' : 'Sus ofertas';
  if (!soyYo) {
    var accionOfertas = document.getElementById('accion-ofertas');
    if (accionOfertas) accionOfertas.style.display = 'none';
  }

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
    : UI.vacio(soyYo ? 'Todavía no has publicado nada' : 'Todavía no ha publicado nada',
        soyYo ? 'Pulsa en Publicar para crear tu primera oferta.' : '');

  /* -------------------------------------------------------- valoraciones */
  document.getElementById('num-val').textContent = total ? total + ' en total' : '';
  document.getElementById('valoraciones').innerHTML = total
    ? valoraciones.map(function (v, i) {
        var de = USWAP.usuario(v.deUsuarioId) || { nombre: 'Alguien', color: '#94a3b8' };
        return '<div style="display:flex;gap:10px;align-items:flex-start;padding:13px 2px' +
            (i < total - 1 ? ';border-bottom:1px solid #eef1f7' : '') + '">' +
          UI.avatar(de, 'pequeno') +
          '<div style="flex:1;min-width:0">' +
            '<div style="display:flex;align-items:baseline;justify-content:space-between;gap:8px">' +
              '<span class="usuario-nombre">' + UI.esc(de.nombre) + '</span>' +
              '<span class="usuario-detalle">' + UI.tiempo(v.creadaEn) + '</span>' +
            '</div>' +
            '<div style="margin-top:3px">' + UI.estrellas(v.estrellas) + '</div>' +
            (v.comentario
              ? '<p class="detalle-texto" style="margin:6px 0 0;font-size:12.5px;line-height:1.5">“' + UI.esc(v.comentario) + '”</p>'
              : '') +
          '</div>' +
        '</div>';
      }).join('')
    : UI.vacio('Sin valoraciones', 'Cierra tratos y pide que te valoren para subir en el ranking.');
})();
