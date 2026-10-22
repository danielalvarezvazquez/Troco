/* ==========================================================================
   DETALLE DE OFERTA                   Propietario: P1 (Daniel)
   --------------------------------------------------------------------------
   Flujo del trato:
     abierta  → cualquiera pulsa "Hemos llegado a un acuerdo"
     acordada → la otra parte confirma → se cierra
     cerrada  → las dos partes pueden valorarse (una vez cada una)
   El chat es EXTERNO: aquí solo se generan los enlaces de WhatsApp/Instagram.
   ========================================================================== */
(function () {
  'use strict';

  var UI = window.USWAP_UI;
  var cont = document.getElementById('detalle');

  UI.montarNav('inicio');

  var oid = UI.param('id');
  var oferta = oid ? USWAP.oferta(oid) : null;

  if (!oferta) {
    cont.innerHTML = UI.vacio('Oferta no encontrada', 'Puede que se haya eliminado. Vuelve al tablón.');
    return;
  }

  var yo = USWAP.yo();
  var autor = USWAP.usuario(oferta.autorId) || { nombre: 'Anónimo', carrera: '', curso: '', color: '#94a3b8' };
  var media = USWAP.mediaDe(autor.id);
  var numVal = USWAP.valoracionesDe(autor.id).length;

  /* Si el navegador tiene una versión antigua de data.js en caché, la página
     debe seguir viéndose: se avisa en el bloque de trato en vez de romperse. */
  var apiAcuerdo = typeof USWAP.proponerAcuerdo === 'function' &&
                   typeof USWAP.confirmarAcuerdo === 'function' &&
                   typeof USWAP.participantes === 'function' &&
                   typeof USWAP.otraParteDe === 'function';

  var estado = oferta.estado || 'abierta';
  var confirmados = (oferta.acuerdo && oferta.acuerdo.confirmadoPor) || [];
  var yoConfirme = confirmados.indexOf(yo) !== -1;
  var participantes = apiAcuerdo ? USWAP.participantes(oferta.id) : [oferta.autorId];
  var otraParte = apiAcuerdo ? USWAP.otraParteDe(oferta.id) : null;
  var yaValorado = (typeof USWAP.yaValoro === 'function') ? USWAP.yaValoro(oferta.id, yo) : false;

  var mensajeWa = 'Hola ' + autor.nombre + ', he visto tu petición "' + oferta.titulo +
    '" en Troco. ¿Sigue disponible? Te propongo: ';
  var enlaceWa = 'https://wa.me/' + encodeURIComponent(autor.whatsapp || '') +
    '?text=' + encodeURIComponent(mensajeWa);
  var enlaceIg = 'https://instagram.com/' + encodeURIComponent(autor.instagram || '');

  /* --------------------------------------------------------------- bloques */

  function bloqueContacto() {
    if (estado === 'cerrada') {
      return '<div class="bloque">' +
        '<p class="detalle-texto" style="margin:0;font-size:13px">' +
          'Este trato ya está cerrado. El contacto se mantiene visible por si necesitáis hablar.</p>' +
        '<div class="fila" style="margin-top:12px">' +
          '<a class="btn btn-secundario" href="https://wa.me/' + encodeURIComponent(autor.whatsapp || '') + '" target="_blank" rel="noopener">WhatsApp</a>' +
          '<a class="btn btn-secundario" href="' + enlaceIg + '" target="_blank" rel="noopener">Instagram</a>' +
        '</div></div>';
    }
    return '<div class="bloque">' +
      '<p class="detalle-texto" style="font-size:12.5px;margin-bottom:12px">' +
        'Hablad por WhatsApp o Instagram. Cuando lo tengáis claro, volved aquí y cerrad el trato.</p>' +
      '<button type="button" class="btn btn-secundario" id="btn-copiar" style="margin-bottom:8px">Copiar mensaje</button>' +
      '<div class="fila">' +
        '<a class="btn btn-whatsapp" href="' + enlaceWa + '" target="_blank" rel="noopener">WhatsApp</a>' +
        '<a class="btn btn-instagram" href="' + enlaceIg + '" target="_blank" rel="noopener">Instagram</a>' +
      '</div></div>';
  }

  function avataresParticipantes() {
    return participantes.map(function (uid) {
      var u = USWAP.usuario(uid);
      return u ? UI.avatar(u, 'pequeno') : '';
    }).join('');
  }

  function bloqueAcuerdo() {
    if (!apiAcuerdo) {
      return '<div class="bloque acuerdo">' +
        '<div class="acuerdo-titulo">Hay una versión antigua en caché</div>' +
        '<p class="acuerdo-texto">La página funciona, pero el cierre del trato no está disponible. ' +
          'Pulsa <b>Ctrl + F5</b> para recargar sin caché; si sigue igual, arranca el servidor con ' +
          '<code>abrir-app.bat</code>.</p>' +
      '</div>';
    }

    if (estado === 'abierta') {
      return '<div class="bloque acuerdo">' +
        '<div class="acuerdo-titulo">¿Habéis llegado a un acuerdo?</div>' +
        '<p class="acuerdo-texto">Cuando las dos partes lo confirméis, el trato se cierra y podréis valoraros.</p>' +
        '<button class="btn btn-primario" id="btn-acuerdo">Hemos llegado a un acuerdo</button>' +
      '</div>';
    }

    if (estado === 'acordada') {
      var texto = yoConfirme
        ? 'Has confirmado el acuerdo. Falta que la otra persona lo confirme.'
        : 'La otra parte ha propuesto cerrar el trato. Confírmalo si está hecho.';
      return '<div class="bloque acuerdo">' +
        '<div class="acuerdo-cabecera">' + avataresParticipantes() +
          '<span class="badge badge-ambar">Acuerdo pendiente</span></div>' +
        '<div class="acuerdo-titulo" style="margin-top:10px">Falta una confirmación</div>' +
        '<p class="acuerdo-texto">' + UI.esc(texto) + '</p>' +
        '<button class="btn ' + (yoConfirme ? 'btn-secundario' : 'btn-primario') + '" id="btn-confirmar"' +
          (yoConfirme ? ' disabled style="opacity:.6"' : '') + '>' +
          (yoConfirme ? 'Esperando a la otra parte' : 'Confirmar acuerdo') +
        '</button>' +
      '</div>';
    }

    /* cerrada */
    var boton;
    if (yaValorado) {
      boton = '<p class="acuerdo-texto" style="margin-bottom:10px">Ya has valorado este trato.</p>' +
        (otraParte
          ? '<a class="btn btn-secundario" href="perfil.html?u=' + encodeURIComponent(otraParte.id) + '">Ver perfil de ' + UI.esc(otraParte.nombre) + '</a>'
          : '');
    } else if (otraParte) {
      boton = '<a class="btn btn-primario" href="valorar.html?id=' + encodeURIComponent(oferta.id) +
        '&con=' + encodeURIComponent(otraParte.id) + '">Valorar a ' + UI.esc(otraParte.nombre) + '</a>';
    } else {
      boton = '<p class="acuerdo-texto" style="margin:0">No hay otra persona a la que valorar en este trato.</p>';
    }

    return '<div class="bloque acuerdo">' +
      '<div class="acuerdo-cabecera">' + avataresParticipantes() +
        '<span class="badge badge-verde">Trato cerrado</span></div>' +
      '<div class="acuerdo-titulo" style="margin-top:10px">Intercambio completado</div>' +
      '<p class="acuerdo-texto">Cerrado ' + UI.tiempo(oferta.acuerdo && oferta.acuerdo.fecha ? oferta.acuerdo.fecha : oferta.creadaEn) +
        '. Valorad cómo ha ido: las estrellas y el comentario quedan en el perfil.</p>' +
      boton +
    '</div>';
  }

  /* --------------------------------------------------------------- pintado */

  var otras = USWAP.ofertasDe(autor.id).filter(function (x) { return x.id !== oferta.id; }).slice(0, 2);

  cont.innerHTML = '' +
    '<div class="bloque">' +
      '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px">' +
        '<span class="badge badge-azul">' + UI.esc(oferta.area) + '</span>' +
        '<span class="badge">' + UI.esc(oferta.categoria) + '</span>' +
        (estado === 'cerrada' ? '<span class="badge badge-verde">Trato cerrado</span>'
          : estado === 'acordada' ? '<span class="badge badge-ambar">Acuerdo pendiente</span>'
          : '<span class="badge">Abierta</span>') +
      '</div>' +
      '<h1 class="detalle-titulo">' + UI.esc(oferta.titulo) + '</h1>' +
      '<p class="detalle-texto">' + UI.esc(oferta.descripcion) + '</p>' +
      '<div class="card-pie"><span>Publicada ' + UI.tiempo(oferta.creadaEn) + '</span>' +
        (oferta.destacada ? '<span class="badge badge-ambar">★ Destacada</span>' : '') + '</div>' +
    '</div>' +

    '<div class="seccion-titulo"><h2>Quién lo pide</h2></div>' +

    '<div class="bloque">' +
      '<div class="card-fila">' +
        '<a class="avatar-enlace" href="perfil.html?u=' + encodeURIComponent(autor.id) + '"' +
          ' title="Ver perfil y valoraciones de ' + UI.esc(autor.nombre) + '"' +
          ' aria-label="Ver perfil y valoraciones de ' + UI.esc(autor.nombre) + '">' +
          UI.avatar(autor, 'grande') +
        '</a>' +
        '<div class="usuario-linea">' +
          '<span class="usuario-nombre" style="font-size:15px">' + UI.esc(autor.nombre) + '</span>' +
          '<span class="usuario-detalle">' + UI.esc(autor.carrera) + ' · ' + UI.curso(autor.curso) + ' · ' + UI.esc(autor.rama) + '</span>' +
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

    '<div class="seccion-titulo"><h2>Contacto</h2><span class="usuario-detalle">por WhatsApp o Instagram</span></div>' +
    bloqueContacto() +

    '<div class="seccion-titulo"><h2>Trato</h2></div>' +
    bloqueAcuerdo() +

    (otras.length ? '<div class="seccion-titulo"><h2>Más de ' + UI.esc(autor.nombre.split(' ')[0]) + '</h2></div>' +
      '<div class="lista">' + otras.map(function (x) {
        return '<a class="card" href="oferta.html?id=' + encodeURIComponent(x.id) + '">' +
          '<h3 class="card-titulo" style="margin-top:0">' + UI.esc(x.titulo) + '</h3>' +
          '<div class="card-pie"><span>' + UI.esc(x.categoria) + '</span><span>' + UI.tiempo(x.creadaEn) + '</span></div>' +
        '</a>';
      }).join('') + '</div>' : '');

  /* --------------------------------------------------------------- acciones */

  var btnCopiar = document.getElementById('btn-copiar');
  if (btnCopiar) {
    /* Respaldo: si el navegador no permite el portapapeles (p. ej. file://),
       se muestra el texto para copiarlo a mano. Nunca debe lanzar un error. */
    var copiarAMano = function () {
      try {
        window.prompt('Copia el mensaje:', mensajeWa);
      } catch (e) {
        UI.toast('No se pudo copiar: copia el mensaje manualmente');
      }
    };

    btnCopiar.addEventListener('click', function () {
      var intentado = false;
      try {
        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
          intentado = true;
          navigator.clipboard.writeText(mensajeWa).then(function () {
            UI.toast('Mensaje copiado');
          }).catch(copiarAMano);
        }
      } catch (e) {
        intentado = false;
      }
      if (!intentado) copiarAMano();
    });
  }

  var btnAcuerdo = document.getElementById('btn-acuerdo');
  if (btnAcuerdo) {
    btnAcuerdo.addEventListener('click', function () {
      USWAP.proponerAcuerdo(oferta.id);
      window.location.reload();
    });
  }

  var btnConfirmar = document.getElementById('btn-confirmar');
  if (btnConfirmar && !yoConfirme) {
    btnConfirmar.addEventListener('click', function () {
      USWAP.confirmarAcuerdo(oferta.id);
      window.location.reload();
    });
  }
})();
