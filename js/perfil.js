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

  /* --- contacto: enlaces discretos sobre la credencial --- */
  var estiloEnlace = 'color:rgba(255,255,255,.62);text-decoration:none;font-weight:600;font-size:11.5px;' +
    'border-bottom:1px solid rgba(255,255,255,.22);padding-bottom:1px';
  var micro = '';
  if (u.instagram) {
    micro += '<a style="' + estiloEnlace + '" target="_blank" rel="noopener" href="https://instagram.com/' +
      encodeURIComponent(u.instagram) + '">Instagram ↗</a>';
  }
  if (soyYo && u.whatsapp) {
    micro += '<a style="' + estiloEnlace + '" target="_blank" rel="noopener" href="https://wa.me/' +
      encodeURIComponent(u.whatsapp) + '">WhatsApp ↗</a>';
  }

  /* --- celda de la ficha inferior --- */
  function celda(valor, etiqueta, primera) {
    return '<div class="stat" style="background:transparent;border:0;border-radius:0;text-align:left;' +
        'padding:0 0 0 13px' + (primera ? '' : ';border-left:1px solid #eef1f7') + '">' +
        '<b style="font-size:16.5px;letter-spacing:-.5px;font-variant-numeric:tabular-nums">' + valor + '</b>' +
        '<span style="font-size:9.5px;text-transform:none;letter-spacing:.01em;font-weight:600">' + etiqueta + '</span>' +
      '</div>';
  }

  /* --------------------------------------------------- credencial superior */
  document.getElementById('perfil').innerHTML = '' +
    '<div style="position:relative;border-radius:22px;padding:18px 18px 42px;color:#fff;' +
      'background:radial-gradient(120% 115% at 88% -18%, rgba(91,91,246,.62) 0%, rgba(91,91,246,0) 58%),' +
      'linear-gradient(158deg,#16203a 0%,#0d1424 100%)">' +

      '<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;' +
        'font-size:9px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.48)">' +
        '<span>Credencial USwap</span>' +
        (posicion ? '<span>Puesto ' + posicion + '</span>' : '') +
      '</div>' +

      '<div style="display:flex;align-items:center;gap:14px;margin-top:16px">' +
        '<div style="flex:0 0 auto;padding:3px;border-radius:23px;border:1px solid rgba(255,255,255,.22)">' +
          UI.avatar(u, 'grande') +
        '</div>' +
        '<div style="min-width:0">' +
          '<h1 style="margin:0;font-size:24px;line-height:1.1;letter-spacing:-.9px;color:#fff">' + UI.esc(u.nombre) + '</h1>' +
          '<div style="margin-top:5px;font-size:12px;line-height:1.35;color:rgba(255,255,255,.72)">' +
            UI.esc(u.carrera) + '</div>' +
          '<div style="margin-top:2px;font-size:11px;color:rgba(255,255,255,.48)">' +
            UI.esc(u.curso) + 'º curso · ' + UI.esc(u.area) + '</div>' +
        '</div>' +
      '</div>' +

      '<div style="display:flex;align-items:flex-end;justify-content:space-between;gap:14px;' +
        'margin-top:18px;padding-top:15px;border-top:1px solid rgba(255,255,255,.12)">' +
        '<div style="min-width:0">' +
          '<div style="display:flex;align-items:baseline;gap:8px">' +
            '<span style="font-size:30px;font-weight:800;letter-spacing:-1.6px;line-height:1">' + mediaTxt + '</span>' +
            (total ? UI.estrellas(media, '') : '') +
          '</div>' +
          (total
            ? '<div style="display:flex;gap:11px;margin-top:6px;font-size:10.5px;font-weight:650;flex-wrap:wrap">' +
                '<span style="color:#6ee7b7">' + positivas + (positivas === 1 ? ' positiva' : ' positivas') + '</span>' +
                '<span style="color:rgba(255,255,255,.5)">' + neutras + (neutras === 1 ? ' neutra' : ' neutras') + '</span>' +
                '<span style="color:#fca5a5">' + negativas + (negativas === 1 ? ' negativa' : ' negativas') + '</span>' +
              '</div>'
            : '<div style="margin-top:6px;font-size:10.5px;color:rgba(255,255,255,.5)">Sin valoraciones todavía</div>') +
        '</div>' +
        '<div style="text-align:right;flex:0 0 auto">' +
          '<div style="font-size:9px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.48)">' +
            UI.esc(nivel.nombre) + '</div>' +
          '<div style="margin-top:3px;font-size:16px;font-weight:750;letter-spacing:-.3px">' + puntos +
            '<span style="font-size:10px;font-weight:600;color:rgba(255,255,255,.55)">' +
              (Math.abs(puntos) === 1 ? ' pt' : ' pts') + '</span></div>' +
        '</div>' +
      '</div>' +

      (prog.siguiente
        ? '<div class="barra-progreso" style="margin-top:16px;background:rgba(255,255,255,.14)">' +
            '<div style="width:' + prog.pct + '%;background:#fff"></div>' +
          '</div>' +
          '<div style="margin-top:7px;font-size:10.5px;color:rgba(255,255,255,.5)">' +
            'Te faltan ' + prog.faltan + ' puntos para ' + UI.esc(prog.siguiente.nombre) + '</div>'
        : '') +

      (soyYo
        ? '<a class="btn" style="margin-top:18px;background:#fff;color:#0f172a;box-shadow:none" href="editar-perfil.html">Editar perfil</a>'
        : '<div class="fila" style="margin-top:18px">' +
            (u.whatsapp
              ? '<a class="btn btn-whatsapp" target="_blank" rel="noopener" href="https://wa.me/' + encodeURIComponent(u.whatsapp) + '">WhatsApp</a>'
              : '') +
            '<a class="btn" style="background:rgba(255,255,255,.10);border-color:rgba(255,255,255,.22);color:#fff" href="index.html">Ver ofertas</a>' +
          '</div>' +
          '<div style="margin-top:9px;text-align:center;font-size:10.5px;color:rgba(255,255,255,.5)">' +
            'Contacta para negociar el intercambio</div>') +

      (micro
        ? '<div style="display:flex;justify-content:center;gap:18px;margin-top:15px;padding-top:13px;' +
            'border-top:1px solid rgba(255,255,255,.12)">' + micro + '</div>'
        : '') +
    '</div>' +

    /* --- ficha de cifras, montada sobre la credencial --- */
    '<div class="stats" style="margin:-28px 12px 0;position:relative;grid-template-columns:repeat(4,1fr);gap:0;' +
      'background:#fff;border:1px solid var(--borde);border-radius:14px;padding:13px 2px;' +
      'box-shadow:0 18px 32px -26px rgba(15,23,42,.7)">' +
      celda(total, total === 1 ? 'valoración' : 'valoraciones', true) +
      celda(ofertas.length, ofertas.length === 1 ? 'oferta' : 'ofertas') +
      celda(cerradas, cerradas === 1 ? 'cerrada' : 'cerradas') +
      celda(puntos, Math.abs(puntos) === 1 ? 'punto' : 'puntos') +
    '</div>' +

    (u.bio
      ? '<div class="bloque" style="margin-top:14px;padding:15px 16px;border-left:3px solid var(--primario);' +
          'border-radius:4px 14px 14px 4px">' +
          '<p class="detalle-texto" style="margin:0;font-size:13px;line-height:1.6">' + UI.esc(u.bio) + '</p>' +
        '</div>'
      : '') +

    '<div class="seccion-titulo"><h2>Habilidades</h2>' +
      (u.habilidades && u.habilidades.length ? '<span class="usuario-detalle">' + u.habilidades.length + '</span>' : '') +
    '</div>' +
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
    ? '<div class="bloque" style="padding:2px 15px">' +
        ofertas.map(function (o, i) {
          return '<a href="oferta.html?id=' + encodeURIComponent(o.id) + '" style="display:flex;align-items:center;' +
              'gap:11px;padding:13px 0;text-decoration:none;color:inherit' +
              (i < ofertas.length - 1 ? ';border-bottom:1px solid #eef1f7' : '') + '">' +
            '<span style="flex:0 0 auto;width:6px;height:6px;border-radius:99px;background:' +
              (o.estado === 'cerrada' ? '#cbd5e1' : '#16a34a') + '"></span>' +
            '<span style="flex:1;min-width:0">' +
              '<span style="display:block;font-size:13.5px;font-weight:650;line-height:1.35;letter-spacing:-.1px">' +
                UI.esc(o.titulo) + '</span>' +
              '<span style="display:block;margin-top:3px;font-size:11px;color:var(--muted)">' +
                UI.esc(o.categoria) + ' · ' + UI.tiempo(o.creadaEn) +
                (o.estado === 'cerrada' ? ' · Cerrada' : '') + '</span>' +
            '</span>' +
            '<span style="flex:0 0 auto;color:#c3cbdb;font-size:18px;line-height:1">›</span>' +
          '</a>';
        }).join('') +
      '</div>'
    : UI.vacio(soyYo ? 'Todavía no has publicado nada' : 'Todavía no ha publicado nada',
        soyYo ? 'Pulsa en Publicar para crear tu primera oferta.' : '');

  /* -------------------------------------------------------- valoraciones */
  document.getElementById('num-val').textContent = total ? total + ' en total' : '';
  document.getElementById('valoraciones').innerHTML = total
    ? valoraciones.map(function (v, i) {
        var de = USWAP.usuario(v.deUsuarioId) || { nombre: 'Alguien', color: '#94a3b8' };
        return '<div style="padding:15px 2px' +
            (i < total - 1 ? ';border-bottom:1px solid #eef1f7' : '') + '">' +
          '<div style="display:flex;align-items:center;justify-content:space-between;gap:10px">' +
            UI.estrellas(v.estrellas) +
            '<span class="usuario-detalle">' + UI.tiempo(v.creadaEn) + '</span>' +
          '</div>' +
          (v.comentario
            ? '<p style="margin:8px 0 0;font-size:13px;line-height:1.6;color:var(--tinta-suave)">“' +
                UI.esc(v.comentario) + '”</p>'
            : '') +
          '<div style="display:flex;align-items:center;gap:7px;margin-top:10px">' +
            UI.avatar(de, 'pequeno') +
            '<span style="font-size:11.5px;font-weight:650">' + UI.esc(de.nombre) + '</span>' +
          '</div>' +
        '</div>';
      }).join('')
    : UI.vacio('Sin valoraciones', 'Cierra tratos y pide que te valoren para subir en el ranking.');
})();
