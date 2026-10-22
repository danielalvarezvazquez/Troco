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

  /* --- escalera de rangos y lema de reputación --- */
  var rangos = (window.USWAP_RANK && window.USWAP_RANK.NIVELES)
    ? window.USWAP_RANK.NIVELES.slice().sort(function (a, b) { return a.min - b.min; })
    : [];
  var idxNivel = -1;
  rangos.forEach(function (n, i) { if (n.nombre === nivel.nombre) idxNivel = i; });
  var ratio = (rangos.length > 1 && idxNivel >= 0) ? idxNivel / (rangos.length - 1) : 0;
  var lema, corLema;
  if (ratio >= 0.5) { lema = 'Gran intercambiador'; corLema = '#6ee7b7'; }
  else if (ratio >= 0.3) { lema = 'Intercambiador de confianza'; corLema = '#c4b5fd'; }
  else if (ratio > 0) { lema = 'Intercambiador activo'; corLema = '#fcd34d'; }
  else { lema = 'Todavía sin reputación'; corLema = 'rgba(255,255,255,.45)'; }

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

  /* --- avatar con foto opcional (campo "foto", data URL) --- */
  function avatarPerfil(usuario, clase) {
    if (!usuario) return '';
    var foto = usuario.foto && /^data:image\//.test(usuario.foto) ? usuario.foto : '';
    if (!foto) return UI.avatar(usuario, clase);
    return '<div class="avatar ' + (clase || '') + '" style="background:' + UI.esc(usuario.color || '#6366f1') +
      ';padding:0;overflow:hidden">' +
      '<img src="' + foto + '" alt="" style="width:100%;height:100%;object-fit:cover;display:block">' +
    '</div>';
  }

  /* --- celda de la ficha inferior --- */
  function celda(valor, etiqueta, primera) {    return '<div class="stat" style="background:transparent;border:0;border-radius:0;text-align:left;' +
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
        '<div style="flex:0 0 auto;padding:3px;border-radius:23px;border:2px solid ' +
          (nivel.marco || 'rgba(255,255,255,.22)') + ';' +
          (nivel.id === 'radiante' ? 'box-shadow:0 0 16px ' + nivel.marco + ';' : '') + '">' +
          avatarPerfil(u, 'grande') +
        '</div>' +
        '<div style="min-width:0">' +
          '<h1 style="margin:0;font-size:24px;line-height:1.1;letter-spacing:-.9px;color:#fff">' + UI.esc(u.nombre) + '</h1>' +
          '<div style="margin-top:5px;font-size:12px;line-height:1.35;color:rgba(255,255,255,.72)">' +
            UI.esc(u.carrera) + '</div>' +
          '<div style="margin-top:2px;font-size:11px;color:rgba(255,255,255,.48)">' +
            UI.curso(u.curso) + ' · ' + UI.esc(u.rama) + '</div>' +
          '<div style="margin-top:7px;font-size:8.5px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;' +
            'color:rgba(255,255,255,.34)">USC · Santiago de Compostela</div>' +
          '<div style="margin-top:7px;width:38px;height:3px;border-radius:99px;background:' +
            (nivel.marco || 'rgba(255,255,255,.25)') + '"></div>' +
        '</div>' +
      '</div>' +

      '<div style="display:flex;align-items:center;justify-content:space-between;gap:14px;' +
        'margin-top:18px;padding-top:16px;border-top:1px solid rgba(255,255,255,.12)">' +

        '<div style="min-width:0">' +
          '<div style="display:flex;align-items:baseline;gap:7px">' +
            '<span style="font-size:42px;font-weight:800;letter-spacing:-2.2px;line-height:.95">' + mediaTxt + '</span>' +
            '<span style="font-size:11px;font-weight:600;color:rgba(255,255,255,.4)">/ 5</span>' +
          '</div>' +
          '<div style="display:flex;align-items:center;gap:8px;margin-top:8px">' +
            (total
              ? UI.estrellas(media, 'grande') +
                '<span style="font-size:10.5px;color:rgba(255,255,255,.55)">' + total +
                  (total === 1 ? ' reseña' : ' reseñas') + '</span>'
              : '<span style="font-size:11px;color:rgba(255,255,255,.5)">Sin reseñas todavía</span>') +
          '</div>' +
        '</div>' +

        '<button type="button" id="btn-rango" aria-expanded="false" aria-controls="rango-panel" ' +
          'style="flex:0 0 auto;background:none;border:0;padding:0;font-family:inherit;cursor:pointer;text-align:center">' +
          '<span style="display:block;font-size:8.5px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;' +
            'color:rgba(255,255,255,.42)">Rango</span>' +
          '<span class="tier ' + nivel.clase + '" style="display:inline-flex;margin-top:6px;background:#fff;' +
            'padding:7px 14px;border-radius:999px;font-size:13px;font-weight:800;letter-spacing:0">' +
            UI.esc(nivel.nombre) + '</span>' +
          '<span style="display:block;margin-top:7px;font-size:10px;font-weight:650;color:rgba(255,255,255,.58)">' +
            puntos + (Math.abs(puntos) === 1 ? ' pt' : ' pts') + ' ›</span>' +
        '</button>' +
      '</div>' +

      '<div style="margin-top:14px;padding:11px 13px;border-radius:12px;' +
        'background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.10)">' +
        '<div style="display:flex;align-items:center;gap:9px">' +
          '<span style="flex:0 0 auto;width:7px;height:7px;border-radius:99px;background:' + corLema + '"></span>' +
          '<span style="font-size:12.5px;font-weight:700;letter-spacing:-.2px">' + UI.esc(lema) + '</span>' +
        '</div>' +
        (total
          ? '<div style="margin-top:4px;padding-left:16px;font-size:10px;font-weight:600;color:rgba(255,255,255,.5)">' +
              positivas + (positivas === 1 ? ' positiva' : ' positivas') + ' · ' +
              neutras + (neutras === 1 ? ' neutra' : ' neutras') + ' · ' +
              negativas + (negativas === 1 ? ' negativa' : ' negativas') + '</div>'
          : '') +
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
      (u.habilidades && u.habilidades.length
        ? '<span class="usuario-detalle">' + u.habilidades.length + ' destacadas</span>'
        : '') +
    '</div>' +
    ((u.habilidades && u.habilidades.length)
      ? '<div class="bloque" style="padding:15px 16px">' +
          '<div style="display:flex;flex-wrap:wrap;gap:7px">' +
            u.habilidades.map(function (h) {
              return '<span style="display:inline-flex;align-items:center;gap:7px;padding:9px 14px;' +
                'border-radius:999px;background:#f3f4ff;color:#4343d6;font-size:13px;font-weight:650;' +
                'letter-spacing:-.1px">' +
                '<span style="width:6px;height:6px;border-radius:99px;background:#5b5bf6"></span>' +
                UI.esc(h) + '</span>';
            }).join('') +
          '</div>' +
        '</div>'
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
              (o.estado === 'cerrada' ? '#cbd5e1' : (o.estado === 'acordada' ? '#d97706' : '#16a34a')) + '"></span>' +
            '<span style="flex:1;min-width:0">' +
              '<span style="display:block;font-size:13.5px;font-weight:650;line-height:1.35;letter-spacing:-.1px">' +
                UI.esc(o.titulo) + '</span>' +
              '<span style="display:block;margin-top:3px;font-size:11px;color:var(--muted)">' +
                UI.esc(o.categoria) + ' · ' + UI.tiempo(o.creadaEn) +
                (o.estado === 'cerrada' ? ' · Cerrada' : (o.estado === 'acordada' ? ' · Acuerdo pendiente' : '')) + '</span>' +
            '</span>' +
            '<span style="flex:0 0 auto;color:#c3cbdb;font-size:18px;line-height:1">›</span>' +
          '</a>';
        }).join('') +
      '</div>'
    : UI.vacio(soyYo ? 'Todavía no has publicado nada' : 'Todavía no ha publicado nada',
        soyYo ? 'Pulsa en Publicar para crear tu primera oferta.' : '');

  /* -------------------------------------------------------- valoraciones */
  document.getElementById('num-val').textContent = '';

  var filasDist = [5, 4, 3, 2, 1].map(function (n) {
    var c = valoraciones.filter(function (v) { return v.estrellas === n; }).length;
    var pct = total ? Math.round((c / total) * 100) : 0;
    return '<div style="display:flex;align-items:center;gap:8px;margin-top:6px">' +
      '<span style="width:9px;text-align:right;font-size:10.5px;font-weight:700;color:var(--muted)">' + n + '</span>' +
      '<div style="flex:1;height:6px;border-radius:99px;background:#eef1f8;overflow:hidden">' +
        '<div style="height:100%;width:' + pct + '%;border-radius:99px;background:#f59e0b"></div>' +
      '</div>' +
      '<span style="width:16px;text-align:right;font-size:10.5px;color:var(--muted)">' + c + '</span>' +
    '</div>';
  }).join('');

  var contenedorVal = document.getElementById('valoraciones');

  if (!total) {
    contenedorVal.innerHTML = UI.vacio('Sin reseñas', 'Cierra tratos y pide que te valoren para subir en el ranking.');
  } else {
    contenedorVal.innerHTML =
      '<div class="bloque" style="padding:15px 16px">' +
        '<div style="display:flex;align-items:baseline;justify-content:space-between;gap:10px">' +
          '<span style="font-size:9px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:var(--muted)">' +
            'Reputación</span>' +
          '<span style="font-size:11px;font-weight:600;color:var(--muted)">' + total +
            (total === 1 ? ' reseña' : ' reseñas') + '</span>' +
        '</div>' +
        '<div style="margin-top:10px">' + filasDist + '</div>' +
      '</div>' +

      '<div style="display:flex;gap:7px;padding:2px 1px 0;overflow-x:auto">' +
        '<button type="button" class="chip chip-mini activo" data-filtro="recientes">Recientes</button>' +
        '<button type="button" class="chip chip-mini" data-filtro="positivas">Más positivas</button>' +
        '<button type="button" class="chip chip-mini" data-filtro="negativas">Más negativas</button>' +
      '</div>' +

      '<div id="lista-resenas"></div>';

    var listaResenas = document.getElementById('lista-resenas');

    function pintarResenas(filtro) {
      var lista = valoraciones.slice();
      if (filtro === 'positivas') {
        lista.sort(function (a, b) {
          return (b.estrellas - a.estrellas) || (new Date(b.creadaEn) - new Date(a.creadaEn));
        });
      } else if (filtro === 'negativas') {
        lista.sort(function (a, b) {
          return (a.estrellas - b.estrellas) || (new Date(b.creadaEn) - new Date(a.creadaEn));
        });
      } else {
        lista.sort(function (a, b) { return new Date(b.creadaEn) - new Date(a.creadaEn); });
      }

      listaResenas.innerHTML = lista.map(function (v, i) {
        var de = USWAP.usuario(v.deUsuarioId) || { nombre: 'Alguien', color: '#94a3b8' };
        return '<div style="padding:15px 2px' +
            (i < lista.length - 1 ? ';border-bottom:1px solid #eef1f7' : '') + '">' +
          '<div style="display:flex;align-items:center;justify-content:space-between;gap:10px">' +
            UI.estrellas(v.estrellas) +
            '<span class="usuario-detalle">' + UI.tiempo(v.creadaEn) + '</span>' +
          '</div>' +
          (v.comentario
            ? '<p style="margin:8px 0 0;font-size:13px;line-height:1.6;color:var(--tinta-suave)">“' +
                UI.esc(v.comentario) + '”</p>'
            : '') +
          '<div style="display:flex;align-items:center;gap:7px;margin-top:10px">' +
            avatarPerfil(de, 'pequeno') +
            '<span style="font-size:11.5px;font-weight:650">' + UI.esc(de.nombre) + '</span>' +
          '</div>' +
        '</div>';
      }).join('');
    }

    pintarResenas('recientes');

    Array.prototype.forEach.call(contenedorVal.querySelectorAll('[data-filtro]'), function (boton) {
      boton.addEventListener('click', function () {
        Array.prototype.forEach.call(contenedorVal.querySelectorAll('[data-filtro]'), function (b) {
          b.classList.remove('activo');
        });
        boton.classList.add('activo');
        pintarResenas(boton.getAttribute('data-filtro'));
      });
    });
  }

  /* ------------------------------------------------------ escalera de rangos */
  var filasRango = rangos.map(function (n, i) {
    var actual = n.nombre === nivel.nombre;
    return '<div style="display:flex;align-items:center;gap:11px;' +
        (actual ? 'padding:12px;background:var(--primario-suave);border-radius:12px;' : 'padding:11px 0;') +
        (i < rangos.length - 1 && !actual ? 'border-bottom:1px solid #eef1f7;' : '') + '">' +
        '<span style="flex:0 0 auto;width:28px;height:28px;border-radius:9px;display:grid;place-items:center;' +
          'font-size:10px;font-weight:800;background:' + (actual ? '#fff' : '#f1f4fa') + ';' +
          'color:' + (actual ? 'var(--primario-oscuro)' : '#8592a6') + '">' + (i + 1) + '</span>' +
        '<span style="flex:1;min-width:0">' +
          '<span style="display:block;font-size:13px;font-weight:700;letter-spacing:-.1px">' + UI.esc(n.nombre) + '</span>' +
          '<span style="display:block;margin-top:1px;font-size:10.5px;color:var(--muted)">' +
            (n.min <= 0 ? 'Desde el inicio' : 'Desde ' + n.min + (n.min === 1 ? ' punto' : ' puntos')) + '</span>' +
        '</span>' +
        (actual ? '<span class="badge badge-azul">estás aquí</span>' : '') +
      '</div>';
  }).join('');

  var fondo = document.createElement('div');
  fondo.id = 'rango-fondo';
  fondo.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,.45);z-index:80;display:none';

  var panel = document.createElement('div');
  panel.id = 'rango-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'true');
  panel.setAttribute('aria-label', 'Escalera de rangos');
  panel.style.cssText = 'position:fixed;left:50%;transform:translateX(-50%);width:100%;max-width:430px;' +
    'bottom:0;z-index:81;display:none;background:#fff;border-radius:22px 22px 0 0;' +
    'padding:18px 18px 26px;max-height:78vh;overflow:auto;' +
    'box-shadow:0 -24px 60px -30px rgba(15,23,42,.55)';
  panel.innerHTML =
    '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px">' +
      '<div>' +
        '<div style="font-size:9px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:var(--muted)">' +
          'Escalera de rangos</div>' +
        '<h2 style="margin:8px 0 3px;font-size:20px;letter-spacing:-.6px">' + UI.esc(nivel.nombre) + '</h2>' +
        '<div class="usuario-detalle">' + UI.esc(u.nombre) + ' · ' + puntos +
          (Math.abs(puntos) === 1 ? ' punto' : ' puntos') + '</div>' +
      '</div>' +
      '<button type="button" id="cerrar-rango" aria-label="Cerrar" ' +
        'style="flex:0 0 auto;width:32px;height:32px;border-radius:50%;border:1px solid var(--borde);' +
        'background:#fff;color:var(--muted);font-size:15px;line-height:1;cursor:pointer">✕</button>' +
    '</div>' +

    (prog.siguiente
      ? '<div style="margin-top:14px">' +
          '<div class="barra-progreso"><div style="width:' + prog.pct + '%"></div></div>' +
          '<div class="usuario-detalle" style="margin-top:7px">Te faltan ' + prog.faltan +
            (prog.faltan === 1 ? ' punto' : ' puntos') + ' para ' + UI.esc(prog.siguiente.nombre) + '</div>' +
        '</div>'
      : '<div class="usuario-detalle" style="margin-top:12px">Has llegado al rango más alto.</div>') +

    '<div style="margin-top:16px">' + filasRango + '</div>' +

    '<div style="margin-top:14px;padding-top:12px;border-top:1px solid #eef1f7;font-size:11px;line-height:1.55;color:var(--muted)">' +
      'Cada reseña suma 10 puntos por estrella: ★1 = 10, ★3 = 30 y ★5 = 50. Los puntos de todas las reseñas se acumulan.' +
    '</div>';

  document.body.appendChild(fondo);
  document.body.appendChild(panel);

  var btnRango = document.getElementById('btn-rango');
  var btnCerrar = document.getElementById('cerrar-rango');

  function abrirRango() {
    var ancho = window.innerWidth >= 720;
    panel.style.bottom = ancho ? '20px' : '0';
    panel.style.borderRadius = ancho ? '22px' : '22px 22px 0 0';
    panel.style.maxHeight = ancho ? '70vh' : '78vh';
    fondo.style.display = 'block';
    panel.style.display = 'block';
    btnRango.setAttribute('aria-expanded', 'true');
    btnCerrar.focus();
  }

  function cerrarRango() {
    fondo.style.display = 'none';
    panel.style.display = 'none';
    btnRango.setAttribute('aria-expanded', 'false');
    btnRango.focus();
  }

  btnRango.addEventListener('click', abrirRango);
  btnCerrar.addEventListener('click', cerrarRango);
  fondo.addEventListener('click', cerrarRango);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && panel.style.display === 'block') cerrarRango();
  });
})();
