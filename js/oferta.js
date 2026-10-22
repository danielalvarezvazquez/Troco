/* ==========================================================================
   DETALLE DE OFERTA                   Propietario: P1 (Daniel)
   --------------------------------------------------------------------------
   Solo se editan este archivo y oferta.html.
   El chat es EXTERNO (WhatsApp / Instagram): aquí solo se generan los enlaces.
   ========================================================================== */
(function () {
  'use strict';

  var UI = window.USWAP_UI;
  var cont = document.getElementById('detalle');

  UI.montarNav('inicio');

  var oid = UI.param('id');
  var oferta = oid ? USWAP.oferta(oid) : null;

  if (!oferta) {
    cont.innerHTML = UI.vacio('Petición no encontrada', 'Puede que se haya eliminado. Vuelve al tablón.');
    return;
  }

  var autor = USWAP.usuario(oferta.autorId) || { nombre: 'Anónimo', carrera: '', curso: '' };
  var media = USWAP.mediaDe(autor.id);
  var numVal = USWAP.valoracionesDe(autor.id).length;
  var cerrada = oferta.estado === 'cerrada';

  var textoWa = 'Hola ' + autor.nombre + ', he visto tu petición "' + oferta.titulo +
    '" en USwap. ¿Sigue disponible? Te propongo: ';
  var enlaceWa = 'https://wa.me/' + encodeURIComponent(autor.whatsapp || '') +
    '?text=' + encodeURIComponent(textoWa);
  var enlaceIg = 'https://instagram.com/' + encodeURIComponent(autor.instagram || '');

  var otras = USWAP.ofertasDe(autor.id).filter(function (x) { return x.id !== oferta.id; }).slice(0, 2);

  cont.innerHTML = '' +
    '<div class="bloque">' +
      '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px">' +
        '<span class="badge badge-azul">' + UI.esc(oferta.categoria) + '</span>' +
        '<span class="badge">' + (oferta.tipo === 'objeto' ? '📦 Pide un objeto' : '🤝 Pide un favor') + '</span>' +
        (cerrada ? '<span class="badge badge-verde">Trato cerrado</span>' : '<span class="badge">Abierta</span>') +
      '</div>' +
      '<h1 class="detalle-titulo">' + UI.esc(oferta.titulo) + '</h1>' +
      '<p class="detalle-texto">' + UI.esc(oferta.descripcion) + '</p>' +
      '<div class="card-pie"><span>Publicada ' + UI.tiempo(oferta.creadaEn) + '</span>' +
        (oferta.destacada ? '<span class="badge badge-ambar">★ Destacada</span>' : '') + '</div>' +
    '</div>' +

    '<div class="seccion-titulo"><h2>Quién lo pide</h2>' +
      '<a href="perfil.html?u=' + encodeURIComponent(autor.id) + '">Ver perfil</a></div>' +

    '<div class="bloque">' +
      '<div class="card-fila">' +
        UI.avatar(autor, 'grande') +
        '<div class="usuario-linea">' +
          '<span class="usuario-nombre" style="font-size:15px">' + UI.esc(autor.nombre) + '</span>' +
          '<span class="usuario-detalle">' + UI.esc(autor.carrera) + ' · ' + UI.esc(autor.curso) + 'º · ' + UI.esc(autor.area) + '</span>' +
          '<span style="margin-top:3px">' + UI.estrellas(media) +
            ' <span class="usuario-detalle">' + (numVal ? media + ' (' + numVal + ')' : 'sin valoraciones') + '</span></span>' +
        '</div>' +
      '</div>' +
      (autor.bio ? '<p class="detalle-texto" style="margin-top:12px;font-size:13px">' + UI.esc(autor.bio) + '</p>' : '') +
      (autor.habilidades && autor.habilidades.length
        ? '<div class="chips" style="margin-top:10px;overflow-x:visible;flex-wrap:wrap">' +
          autor.habilidades.map(function (h) {
            return '<span class="chip chip-mini" style="cursor:default">' + UI.esc(h) + '</span>';
          }).join('') + '</div>'
        : '') +
    '</div>' +

    '<div class="seccion-titulo"><h2>Contacto</h2><span class="usuario-detalle">chat externo</span></div>' +
    '<div class="bloque">' +
      '<p class="detalle-texto" style="font-size:12.5px;margin-bottom:12px">' +
        'USwap no tiene chat propio: se negocia por WhatsApp o Instagram y se vuelve aquí para cerrar el trato.</p>' +
      '<div class="fila">' +
        '<a class="btn btn-whatsapp" href="' + enlaceWa + '" target="_blank" rel="noopener">WhatsApp</a>' +
        '<a class="btn btn-instagram" href="' + enlaceIg + '" target="_blank" rel="noopener">Instagram</a>' +
      '</div>' +
      '<button class="btn btn-primario btn-bloque" id="btn-cerrar"' + (cerrada ? ' disabled style="opacity:.55"' : '') + '>' +
        (cerrada ? 'Trato ya cerrado' : 'He cerrado el trato · Valorar') + '</button>' +
    '</div>' +

    (otras.length ? '<div class="seccion-titulo"><h2>Más de ' + UI.esc(autor.nombre.split(' ')[0]) + '</h2></div>' +
      '<div class="lista">' + otras.map(function (x) {
        return '<a class="card" href="oferta.html?id=' + encodeURIComponent(x.id) + '">' +
          '<h3 class="card-titulo" style="margin-top:0">' + UI.esc(x.titulo) + '</h3>' +
          '<div class="card-pie"><span>' + UI.esc(x.categoria) + '</span><span>' + UI.tiempo(x.creadaEn) + '</span></div>' +
        '</a>';
      }).join('') + '</div>' : '');

  var btn = document.getElementById('btn-cerrar');
  if (btn && !cerrada) {
    btn.addEventListener('click', function () {
      window.location.href = 'valorar.html?id=' + encodeURIComponent(oferta.id) +
        '&con=' + encodeURIComponent(autor.id);
    });
  }
})();
