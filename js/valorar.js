/* ==========================================================================
   VALORAR TRATO                       Propietario: P1 (Daniel)
   --------------------------------------------------------------------------
   Requisitos:
   - Solo se valora cuando el trato está CERRADO (acuerdo de las dos partes).
   - Cada persona valora una sola vez por trato.
   - Se valora a la otra parte del trato: ★1-5 + comentario opcional.
   - El comentario y las estrellas quedan en el perfil del valorado.
   El cálculo de puntos vive en data.js (puntosDe); los niveles en ranking.js.
   ========================================================================== */
(function () {
  'use strict';

  var UI = window.USWAP_UI;
  var cont = document.getElementById('valorar');

  UI.montarNav('ranking');

  var oid = UI.param('id');
  var conId = UI.param('con');
  var oferta = oid ? USWAP.oferta(oid) : null;
  var estrellas = 0;

  function volver(mensajeTitulo, mensajeTexto, enlace, textoEnlace) {
    cont.innerHTML = '<div class="bloque" style="text-align:center;padding:28px 18px">' +
      '<div style="font-size:38px;line-height:1">🔒</div>' +
      '<h2 style="margin:12px 0 6px;font-size:19px;letter-spacing:-.4px">' + UI.esc(mensajeTitulo) + '</h2>' +
      '<p class="detalle-texto" style="margin-bottom:16px">' + UI.esc(mensajeTexto) + '</p>' +
      (enlace ? '<a class="btn btn-primario" href="' + enlace + '">' + UI.esc(textoEnlace) + '</a>' : '') +
      '</div>';
  }

  /* ---------------------------------------------------- validaciones previas */
  if (oferta && oferta.estado !== 'cerrada') {
    volver('El trato aún no está cerrado',
      'Primero las dos partes tenéis que confirmar el acuerdo. Cuando esté cerrado podréis valoraros.',
      'oferta.html?id=' + encodeURIComponent(oferta.id), 'Volver a la oferta');
    return;
  }

  if (oferta && typeof USWAP.yaValoro === 'function' && USWAP.yaValoro(oferta.id, USWAP.yo())) {
    volver('Ya has valorado este trato',
      'Solo se puede valorar una vez por intercambio. Tu comentario ya aparece en el perfil de la otra persona.',
      'index.html', 'Volver al tablón');
    return;
  }

  var valorado = conId ? USWAP.usuario(conId) : null;
  if (!valorado && oferta && typeof USWAP.otraParteDe === 'function') valorado = USWAP.otraParteDe(oferta.id);
  if (!valorado) {
    var candidatos = USWAP.usuarios().filter(function (u) { return u.id !== USWAP.yo(); });
    valorado = candidatos[0] || USWAP.usuario(USWAP.yo());
  }

  /* ------------------------------------------------------------------ form */
  function pintarFormulario() {
    var puntosAntes = USWAP.puntosDe(valorado.id);
    var media = USWAP.mediaDe(valorado.id);

    cont.innerHTML = '' +
      '<section class="hero"><h1>¿Cómo ha ido?</h1>' +
        '<p>Valora el intercambio con ' + UI.esc(valorado.nombre) + '. Tu comentario quedará en su perfil.</p></section>' +

      (oferta ? '<div class="bloque" style="display:flex;gap:11px;align-items:center;margin-bottom:14px">' +
        UI.avatar(USWAP.usuario(oferta.autorId) || valorado, 'pequeno') +
        '<div class="usuario-linea"><span class="usuario-nombre">' + UI.esc(oferta.titulo) + '</span>' +
        '<span class="usuario-detalle">Trato cerrado · ' + UI.esc(oferta.categoria) + '</span></div></div>' : '') +

      '<div class="bloque">' +
        '<div style="display:flex;flex-direction:column;align-items:center;gap:10px;padding:6px 0 14px">' +
          UI.avatar(valorado, 'grande') +
          '<div style="text-align:center">' +
            '<div style="font-weight:700">' + UI.esc(valorado.nombre) + '</div>' +
            '<div class="usuario-detalle">' + UI.esc(valorado.carrera) + ' · ' + UI.curso(valorado.curso) + '</div>' +
          '</div>' +
          '<div class="usuario-detalle">' + (media ? UI.estrellas(media) + ' ' + media : 'Sin valoraciones todavía') +
            ' · ' + puntosAntes + ' pts</div>' +
        '</div>' +

        '<div class="divisor"></div>' +

        '<div style="text-align:center;padding:6px 0 2px">' +
          '<div class="estrellas-selector" id="selector-estrellas" style="justify-content:center">' +
            [1, 2, 3, 4, 5].map(function (n) {
              return '<button class="estrella-btn" data-n="' + n + '" aria-label="' + n + ' estrellas">★</button>';
            }).join('') +
          '</div>' +
          '<div id="texto-estrellas" class="usuario-detalle" style="margin-top:8px">Toca para puntuar</div>' +
        '</div>' +

        '<label class="label" for="comentario">Comentario (opcional)</label>' +
        '<textarea class="textarea" id="comentario" maxlength="200" placeholder="Cuenta cómo fue el intercambio…"></textarea>' +

        '<button class="btn btn-primario btn-bloque" id="btn-enviar">Enviar valoración</button>' +
      '</div>' +

      '<p class="usuario-detalle" style="text-align:center;margin-top:14px">' +
        '★1 resta 20 · ★2 no suma · ★3 suma 20 · ★4 suma 40 · ★5 suma 80. Solo se puede valorar una vez.</p>';

    document.querySelectorAll('.estrella-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        estrellas = Number(btn.getAttribute('data-n'));
        document.querySelectorAll('.estrella-btn').forEach(function (b) {
          b.classList.toggle('activa', Number(b.getAttribute('data-n')) <= estrellas);
        });
        var etiquetas = ['', 'Muy mal', 'Mal', 'Normal', 'Bien', 'Excelente'];
        document.getElementById('texto-estrellas').textContent = estrellas + ' de 5 · ' + etiquetas[estrellas];
      });
    });

    document.getElementById('btn-enviar').addEventListener('click', enviar);
  }

  /* ----------------------------------------------------------------- enviar */
  function enviar() {
    if (!estrellas) { UI.toast('Elige de 1 a 5 estrellas'); return; }

    var comentario = document.getElementById('comentario').value.trim();
    var puntosAntes = USWAP.puntosDe(valorado.id);

    var creada = USWAP.addValoracion({
      ofertaId: oid || 'manual',
      aUsuarioId: valorado.id,
      estrellas: estrellas,
      comentario: comentario
    });

    if (!creada) { UI.toast('Ya has valorado este trato'); return; }

    var puntosDespues = USWAP.puntosDe(valorado.id);
    var delta = puntosDespues - puntosAntes;
    var nivel = window.USWAP_RANK ? window.USWAP_RANK.tier(puntosDespues).nombre : '—';

    cont.innerHTML = '' +
      '<div class="bloque" style="text-align:center;padding:30px 20px">' +
        '<div style="font-size:44px;line-height:1">' + (delta >= 0 ? '🎉' : '📉') + '</div>' +
        '<h2 style="margin:12px 0 6px;font-size:20px;letter-spacing:-.4px">Valoración enviada</h2>' +
        '<p class="detalle-texto">Has puntuado a <b>' + UI.esc(valorado.nombre) + '</b> con ' +
          UI.estrellas(estrellas) + '.</p>' +
        (comentario
          ? '<p class="detalle-texto" style="font-size:12.5px;font-style:italic">“' + UI.esc(comentario) + '”</p>'
          : '') +
        '<div class="stats" style="margin-top:18px">' +
          '<div class="stat"><b>' + delta + '</b><span>puntos</span></div>' +
          '<div class="stat"><b>' + puntosDespues + '</b><span>total</span></div>' +
          '<div class="stat"><b>' + nivel + '</b><span>nivel</span></div>' +
        '</div>' +
        '<p class="usuario-detalle" style="margin-top:14px">Esta reseña ' +
          (delta < 0 ? 'resta ' + Math.abs(delta) : 'suma ' + delta) + ' puntos al ranking.</p>' +
        '<p class="usuario-detalle" style="margin-top:14px">Tu comentario ya se ve en el perfil de ' +
          UI.esc(valorado.nombre) + '.</p>' +
        '<a class="btn btn-primario" style="margin-top:16px" href="perfil.html?u=' + encodeURIComponent(valorado.id) + '">' +
          'Ver su perfil</a>' +
        '<div class="fila" style="margin-top:8px">' +
          '<a class="btn btn-secundario" href="index.html">Al tablón</a>' +
          '<a class="btn btn-secundario" href="ranking.html">Ranking</a>' +
        '</div>' +
      '</div>';
  }

  pintarFormulario();
})();
