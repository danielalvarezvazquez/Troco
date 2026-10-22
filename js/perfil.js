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
  var nivelAlto = nivel.id === 'diamante' || nivel.id === 'ascendente' ||
    nivel.id === 'inmortal' || nivel.id === 'radiante';
  var nivelArcoiris = nivel.id === 'radiante';
  var nivelBrilloNombre = nivel.id === 'ascendente' || nivel.id === 'inmortal';
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
  var mediaTxt = total ? media.toFixed(1) : (u.avisoBaneo ? '0.0' : '-');

  /* --- descuentos en comercios de Compostela (se pagan con puntos) --- */
  var TIENDAS = [
    { id: 'copy10', nombre: 'CopyCampus', tipo: 'copisteria', valor: '10%', detalle: 'Fotocopias y encuadernación', precio: 250 },
    { id: 'campus15', nombre: 'Copistería Campus', tipo: 'copisteria', valor: '15%', detalle: 'Material de oficina y plastificados', precio: 400 },
    { id: 'etse', nombre: 'Cafetería ETSE', tipo: 'comida', valor: 'Gratis', detalle: 'Café o infusión por la mañana', precio: 300 },
    { id: 'take', nombre: 'Take', tipo: 'comida', valor: '6,50 €', detalle: 'Menú + bebida', precio: 500 },
    { id: 'pizza', nombre: 'Pizzería Obradoiro', tipo: 'comida', valor: '2x1', detalle: 'Pizzas medianas de martes a jueves', precio: 750 },
    { id: 'yoga', nombre: 'Yoga Compostela', tipo: 'gimnasio', valor: '1 clase', detalle: 'Clase suelta de iniciación', precio: 600 },
    { id: 'gym', nombre: 'Gimnasio Compostela', tipo: 'gimnasio', valor: 'Gratis', detalle: 'Matrícula del curso completo', precio: 1500 },
    { id: 'libro', nombre: 'Librería Universitaria', tipo: 'libreria', valor: '10%', detalle: 'Manuales y lectura recomendada', precio: 1000 },
    { id: 'cine', nombre: 'Cine Compostela', tipo: 'ocio', valor: '5 €', detalle: 'Entrada de cualquier sesión', precio: 550 },
    { id: 'sala', nombre: 'Sala Riquela', tipo: 'ocio', valor: '2x1', detalle: 'Conciertos entre semana', precio: 900 }
  ];
  var TIPOS = [
    { id: '', texto: 'Todos' },
    { id: 'copisteria', texto: 'Copistería' },
    { id: 'comida', texto: 'Comida' },
    { id: 'gimnasio', texto: 'Gimnasio' },
    { id: 'libreria', texto: 'Librería' },
    { id: 'ocio', texto: 'Ocio' }
  ];
  var NOMBRE_TIPO = {};
  TIPOS.forEach(function (t) { if (t.id) NOMBRE_TIPO[t.id] = t.texto; });

  /* puntos gastados = canjes guardados en el estado compartido */
  function canjesDe(uid) {
    var est = USWAP.estado();
    if (!est.canjes) est.canjes = [];
    return est.canjes.filter(function (c) { return c.uid === uid; });
  }
  var gastados = canjesDe(u.id).reduce(function (acc, c) { return acc + (c.precio || 0); }, 0);
  /* puntosDe ya descuenta lo canjeado, así que el saldo es el propio saldo neto */
  var saldo = Math.max(0, puntos);

  /* --- contacto: enlaces discretos sobre la credencial --- */
  var estiloEnlace = 'color:rgba(255,255,255,.66);text-decoration:none;font-weight:600;font-size:12px;' +
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
  function celda(valor, etiqueta, primera, idValor) {
    return '<div class="stat" style="background:transparent;border:0;border-radius:0;text-align:left;' +
        'padding:0 0 0 14px' + (primera ? '' : ';border-left:1px solid #eef1f7') + '">' +
        '<b' + (idValor ? ' id="' + idValor + '"' : '') +
          ' style="font-size:17px;letter-spacing:-.5px;font-variant-numeric:tabular-nums">' + valor + '</b>' +
        '<span style="font-size:10.5px;text-transform:none;letter-spacing:0;font-weight:600">' + etiqueta + '</span>' +
      '</div>';
  }

  /* --------------------------------------------------- credencial superior */
  var corRango = nivel.color || '#5b5bf6';
  var corMarco = nivel.marco || '#8b5cf6';

  function aclarar(hex, cantidade) {
    if (!/^#[0-9a-f]{6}$/i.test(hex || '')) return hex;
    function canal(i) {
      var v = parseInt(hex.substr(i, 2), 16);
      return Math.round(v + (255 - v) * cantidade);
    }
    return 'rgb(' + canal(1) + ',' + canal(3) + ',' + canal(5) + ')';
  }
  if (corRango === corMarco) corRango = aclarar(corRango, 0.38);

  var intensidade = 0.18 + ratio * 0.34;
  var senMovemento = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  document.getElementById('perfil').innerHTML = '' +
    '<div style="position:relative">' +
      '<div id="marco-glow" style="position:absolute;inset:-3px;border-radius:28px;pointer-events:none;' +
        'background:linear-gradient(140deg,' + corMarco + ',' + corRango + ',' + corMarco + ');' +
        'filter:blur(18px);opacity:' + intensidade.toFixed(2) + '"></div>' +

      '<div style="position:relative;border-radius:25px;padding:2px;' +
        'background:linear-gradient(140deg,' + corMarco + ',' + corRango + ' 45%,' + corMarco + ')">' +
        '<div style="position:relative;overflow:hidden;border-radius:23px;padding:18px 18px 22px;color:#fff;' +
          'background:radial-gradient(120% 115% at 88% -18%, rgba(91,91,246,.45) 0%, rgba(91,91,246,0) 58%),' +
          'linear-gradient(158deg,#17213b 0%,#0c1220 100%)">' +

      '<div id="brillo-paso" style="position:absolute;inset:0;pointer-events:none">' +
        '<div id="brillo-barra" style="position:absolute;top:-30%;left:-70%;width:55%;height:165%;' +
          'transform:rotate(10deg);' +
          'background:linear-gradient(105deg,rgba(255,255,255,0),rgba(255,255,255,.16),rgba(255,255,255,0));' +
          'opacity:0"></div>' +
      '</div>' +

      '<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;' +
        'font-size:11.5px;color:rgba(255,255,255,.55)">' +
        '<span>Perfil Troco</span>' +
        (posicion
          ? (posicion === 1
              ? '<span style="background:rgba(250,204,21,.16);border:1px solid rgba(250,204,21,.38);' +
                  'color:#fde68a;padding:3px 9px;border-radius:999px;font-size:11px;font-weight:700">' +
                  '👑 Nº 1 del ranking</span>'
              : '<span style="background:rgba(255,255,255,.10);border:1px solid rgba(255,255,255,.14);' +
                  'padding:3px 9px;border-radius:999px;font-size:11px">Nº ' + posicion + ' del ranking</span>')
          : '') +
      '</div>' +

      '<div style="display:flex;align-items:center;gap:14px;margin-top:15px">' +
        '<div class="usr-avatar-wrap' + (nivelAlto ? ' usr-marco-brillo' : '') + '"' +
          ' style="flex:0 0 auto;padding:3px;border-radius:23px;border:2px solid ' +
          (nivel.marco || 'rgba(255,255,255,.22)') + ';' +
          (nivel.id === 'radiante' ? 'box-shadow:0 0 18px ' + nivel.marco + ';' : '') +
          '--usr-color:' + (nivel.marco || '#94a3b8') + '">' +
          avatarPerfil(u, 'grande') +
          '<span class="usr-badge usr-badge--lg' + (nivelAlto ? ' usr-badge--glow' : '') +
            '" aria-hidden="true">' + (nivel.icono || '') + '</span>' +
          (posicion === 1
            ? '<span class="corona-top" aria-label="Número 1 del ranking" ' +
                'style="position:absolute;top:-14px;left:50%;transform:translateX(-50%);z-index:3;' +
                'font-size:20px;line-height:1;filter:drop-shadow(0 3px 6px rgba(0,0,0,.55))">👑</span>'
            : '') +
        '</div>' +
        '<div style="min-width:0">' +
          (nivelArcoiris
            ? '<h1 class="usr-nombre-arcoiris" style="margin:0;font-size:25px;line-height:1.08;letter-spacing:-.8px">'
            : '<h1 class="' + (nivelBrilloNombre ? 'usr-nombre-brillo' : '') +
              '" style="margin:0;font-size:25px;line-height:1.08;letter-spacing:-.8px;color:' +
              (nivelBrilloNombre ? (nivel.marco || '#fff') : '#fff') + '">') +
            UI.esc(u.nombre) + '</h1>' +
          '<div style="margin-top:5px;font-size:13px;line-height:1.35;color:rgba(255,255,255,.78)">' +
            UI.esc(u.carrera) + '</div>' +
          '<div style="margin-top:2px;font-size:11.5px;color:rgba(255,255,255,.5)">' +
            UI.curso(u.curso) + ' · ' + UI.esc(u.rama) + '</div>' +
          '<div style="margin-top:6px;font-size:11px;color:rgba(255,255,255,.4)">' +
            'USC · Santiago de Compostela</div>' +
        '</div>' +
      '</div>' +

      /* --- reputación + rango --- */
      '<div style="display:flex;align-items:flex-end;justify-content:space-between;gap:14px;margin-top:20px">' +
        '<div style="min-width:0">' +
          '<div style="display:flex;align-items:baseline;gap:6px">' +
            '<span style="font-size:47px;font-weight:800;letter-spacing:-2.6px;line-height:.9;' +
              'background:linear-gradient(180deg,#ffffff 20%,#c7d2fe 100%);-webkit-background-clip:text;' +
              'background-clip:text;color:transparent">' + mediaTxt + '</span>' +
            '<span style="font-size:12px;color:rgba(255,255,255,.4)">/ 5</span>' +
          '</div>' +
          '<div style="display:flex;align-items:center;gap:8px;margin-top:7px">' +
            (total
              ? UI.estrellas(media, 'grande')
              : '<span style="font-size:11.5px;color:rgba(255,255,255,.5)">Sin reseñas todavía</span>') +
          '</div>' +
        '</div>' +

        '<button type="button" id="btn-rango" aria-expanded="false" aria-controls="rango-panel" ' +
          'style="flex:0 0 auto;text-align:right;background:none;border:0;padding:0;color:#fff;' +
          'font-family:inherit;cursor:pointer">' +
          '<span style="display:block;font-size:11px;color:rgba(255,255,255,.45)">Rango</span>' +
          '<span class="tier ' + nivel.clase + '" style="display:block;margin-top:3px;font-size:16px;' +
            'font-weight:800;letter-spacing:-.2px">' + UI.esc(nivel.nombre) + '</span>' +
          '<span id="cred-puntos" style="display:block;margin-top:4px;font-size:11.5px;color:rgba(255,255,255,.6)">' +
            puntos + (Math.abs(puntos) === 1 ? ' pt' : ' pts') + ' ›</span>' +
        '</button>' +
      '</div>' +

      '<div style="display:flex;align-items:center;gap:8px;margin-top:10px">' +
        '<span style="font-size:11.5px;color:rgba(255,255,255,.5)">' + total +
          (total === 1 ? ' reseña' : ' reseñas') + '</span>' +
        '<span style="width:3px;height:3px;border-radius:99px;background:rgba(255,255,255,.3)"></span>' +
        '<span style="font-size:11.5px;color:rgba(255,255,255,.5)">' +
          positivas + (positivas === 1 ? ' positiva' : ' positivas') + '</span>' +
        (negativas
          ? '<span style="width:3px;height:3px;border-radius:99px;background:rgba(255,255,255,.3)"></span>' +
            '<span style="font-size:11.5px;color:#fca5a5">' + negativas +
              (negativas === 1 ? ' negativa' : ' negativas') + '</span>'
          : '') +
      '</div>' +

      (prog.siguiente
        ? '<div style="margin-top:12px">' +
            '<div style="height:7px;border-radius:99px;background:rgba(255,255,255,.13);overflow:hidden">' +
              '<div style="height:100%;width:' + prog.pct + '%;border-radius:99px;' +
                'background:linear-gradient(90deg,' + corMarco + ',' + corRango + ')"></div>' +
            '</div>' +
            '<div style="display:flex;justify-content:space-between;gap:8px;margin-top:7px;' +
              'font-size:11px;color:rgba(255,255,255,.5)">' +
              '<span>' + prog.pct + '% hacia ' + UI.esc(prog.siguiente.nombre) + '</span>' +
              '<span>faltan ' + prog.faltan + (prog.faltan === 1 ? ' punto' : ' puntos') + '</span>' +
            '</div>' +
          '</div>'
        : '<div style="margin-top:12px;font-size:11px;color:rgba(255,255,255,.5)">Nivel máximo alcanzado</div>') +

      '<div style="display:flex;align-items:center;gap:9px;margin-top:14px;padding:10px 12px;' +
        'border-radius:12px;background:linear-gradient(90deg,rgba(255,255,255,.10),rgba(255,255,255,.03));' +
        'border:1px solid rgba(255,255,255,.09)">' +
        '<span style="flex:0 0 auto;width:7px;height:7px;border-radius:99px;background:' + corLema + ';' +
          'box-shadow:0 0 8px ' + corLema + '"></span>' +
        '<span style="font-size:13px;font-weight:650;letter-spacing:-.15px">' + UI.esc(lema) + '</span>' +
      '</div>' +

      (soyYo
        ? '<div style="display:flex;align-items:center;gap:7px;margin-top:12px;font-size:11.5px;' +
            'color:rgba(255,255,255,.55)">' +
            '<span>Saldo para descuentos</span>' +
            '<b id="cred-saldo" style="font-size:13px;color:#fff">' + saldo + ' pts</b>' +
          '</div>'
        : '') +

      (soyYo
        ? '<a class="btn" style="margin-top:16px;background:#fff;color:#0f172a;box-shadow:none" href="editar-perfil.html">Editar perfil</a>'
        : '<div class="fila" style="margin-top:16px">' +
            (u.whatsapp
              ? '<a class="btn btn-whatsapp" target="_blank" rel="noopener" href="https://wa.me/' + encodeURIComponent(u.whatsapp) + '">WhatsApp</a>'
              : '') +
            '<a class="btn" style="background:rgba(255,255,255,.10);border-color:rgba(255,255,255,.22);color:#fff" href="index.html">Ver peticiones</a>' +
          '</div>' +
          '<div style="margin-top:9px;text-align:center;font-size:11px;color:rgba(255,255,255,.5)">' +
            'Contacta para negociar el intercambio</div>') +

      (micro
        ? '<div style="display:flex;justify-content:center;gap:18px;margin-top:15px;padding-top:13px;' +
            'border-top:1px solid rgba(255,255,255,.10)">' + micro + '</div>'
        : '') +
        '</div>' +
      '</div>' +
    '</div>' +

    /* --- ficha de cifras, montada sobre la credencial --- */
    '<div class="stats" style="margin:-26px 12px 0;position:relative;grid-template-columns:repeat(4,1fr);gap:0;' +
      'background:#fff;border:1px solid var(--borde);border-radius:16px;padding:14px 2px;' +
      'box-shadow:0 20px 34px -26px rgba(15,23,42,.7)">' +
      celda(total, total === 1 ? 'reseña' : 'reseñas', true) +
      celda(ofertas.length, ofertas.length === 1 ? 'petición' : 'peticiones') +
      celda(cerradas, cerradas === 1 ? 'trato cerrado' : 'tratos cerrados') +
      celda(puntos, Math.abs(puntos) === 1 ? 'punto' : 'puntos', false, 'stat-puntos') +
    '</div>' +

    /* --- aviso de expulsión (cuentas en observación) --- */
    (u.avisoBaneo
      ? '<div class="bloque" style="margin-top:12px;border-color:#fecaca;background:#fef2f2">' +
          '<div style="display:flex;gap:10px;align-items:flex-start">' +
            '<span style="font-size:17px;line-height:1.2">⚠️</span>' +
            '<div>' +
              '<b style="display:block;font-size:13px;color:#b91c1c;margin-bottom:2px">Aviso de expulsión</b>' +
              '<span style="font-size:12.5px;color:#7f1d1d;line-height:1.45">' + UI.esc(u.avisoBaneo) + '</span>' +
            '</div>' +
          '</div>' +
        '</div>'
      : '') +

    (u.bio
      ? '<div class="bloque" style="margin-top:14px;padding:16px 18px;border-radius:16px;' +
          'border-left:3px solid var(--primario)">' +
          '<p class="detalle-texto" style="margin:0;font-size:13.5px;line-height:1.65">' + UI.esc(u.bio) + '</p>' +
        '</div>'
      : '') +

    '<div class="seccion-titulo"><h2 style="font-size:15px;letter-spacing:-.2px">Habilidades</h2>' +
      (u.habilidades && u.habilidades.length
        ? '<span class="usuario-detalle">' + u.habilidades.length + '</span>'
        : '') +
    '</div>' +
    ((u.habilidades && u.habilidades.length)
      ? '<div class="bloque" style="padding:15px 16px;border-radius:16px">' +
          '<div style="display:flex;flex-wrap:wrap;gap:7px">' +
            u.habilidades.map(function (h) {
              return '<span style="display:inline-flex;align-items:center;gap:7px;padding:8px 13px;' +
                'border-radius:12px;background:#f3f4ff;color:#4343d6;font-size:12.5px;font-weight:600;' +
                'letter-spacing:-.1px">' +
                '<span style="width:5px;height:5px;border-radius:99px;background:#5b5bf6"></span>' +
                UI.esc(h) + '</span>';
            }).join('') +
          '</div>' +
        '</div>'
      : UI.vacio('Sin habilidades', soyYo
          ? 'Añádelas en Editar perfil para que te encuentren.'
          : 'Todavía no ha añadido habilidades.')) +

    (soyYo
      ? '<div class="seccion-titulo"><h2 style="font-size:15px;letter-spacing:-.2px">Descuentos</h2>' +
      '<span class="usuario-detalle" id="desc-saldo-top">' + saldo + ' pts</span></div>' +
    '<div class="bloque" style="padding:0;border-radius:16px;overflow:hidden">' +
      '<button type="button" id="desc-toggle" aria-expanded="true" aria-controls="desc-cuerpo" ' +
        'style="width:100%;display:flex;align-items:center;gap:12px;padding:14px 15px;background:none;' +
        'border:0;font-family:inherit;cursor:pointer;text-align:left">' +
        '<span style="flex:1;min-width:0">' +
          '<span style="display:block;font-size:13px;font-weight:700;letter-spacing:-.1px">' +
            (soyYo ? 'Canjea tus puntos' : 'Descuentos en Compostela') + '</span>' +
          '<span id="desc-sub" style="display:block;margin-top:2px;font-size:11.5px;color:var(--muted)"></span>' +
        '</span>' +
        '<span id="desc-chevron" style="font-size:13px;color:var(--muted);transition:transform .22s;' +
          'transform:rotate(180deg)">▾</span>' +
      '</button>' +
      '<div id="desc-cuerpo" style="display:block;padding:0 15px 15px">' +
        '<div style="display:flex;align-items:center;gap:9px;margin-bottom:11px">' +
          '<div style="flex:1;height:6px;border-radius:99px;background:#eef1f8;overflow:hidden">' +
            '<div id="desc-barra" style="height:100%;width:100%;border-radius:99px;' +
              'background:linear-gradient(90deg,#5b5bf6,#8b5cf6)"></div>' +
          '</div>' +
          '<span id="desc-cartera" style="font-size:11px;font-weight:600;color:var(--muted)"></span>' +
        '</div>' +
        '<div id="desc-filtros" style="display:flex;gap:6px;overflow-x:auto;padding:2px 0 11px"></div>' +
        '<div id="desc-lista" style="display:grid;grid-template-columns:1fr 1fr;gap:9px"></div>' +
      '</div>' +
    '</div>' +
      '<div class="usuario-detalle" style="margin:9px 4px 0;line-height:1.5">' +
        'Ganas puntos con cada reseña (★3 +20, ★4 +40, ★5 +80). Se canjean enseñando tu credencial Troco en el comercio.' +
      '</div>'
      : '');

  /* --- brillo del marco + entrada animada --- */
  var marcoGlow = document.getElementById('marco-glow');
  if (marcoGlow && marcoGlow.animate && !senMovemento) {
    marcoGlow.animate([
      { opacity: intensidade, transform: 'scale(.995)' },
      { opacity: Math.min(intensidade + 0.28, 0.95), transform: 'scale(1.012)' }
    ], { duration: 2400, iterations: Infinity, direction: 'alternate', easing: 'ease-in-out' });
  }

  var brilloBarra = document.getElementById('brillo-barra');
  if (brilloBarra && brilloBarra.animate && !senMovemento) {
    brilloBarra.animate([
      { left: '-70%', opacity: 0 },
      { opacity: .85, offset: 0.2 },
      { left: '135%', opacity: 0 }
    ], { duration: 5200, iterations: Infinity, easing: 'ease-in-out', delay: 900 });
  }

  var coroa = document.querySelector('.corona-top');
  if (coroa && coroa.animate && !senMovemento) {
    coroa.animate([
      { transform: 'translateX(-50%) translateY(0) rotate(-2deg)' },
      { transform: 'translateX(-50%) translateY(-3px) rotate(2deg)' }
    ], { duration: 1800, iterations: Infinity, direction: 'alternate', easing: 'ease-in-out' });
  }

  if (!senMovemento) {
    Array.prototype.forEach.call(document.querySelectorAll('#perfil > *'), function (el, i) {
      if (!el.animate) return;
      el.animate(
        [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }],
        { duration: 420, delay: i * 55, easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'backwards' }
      );
    });
  }

  function dinamizar(selector) {
    Array.prototype.forEach.call(document.querySelectorAll(selector), function (el) {
      el.style.transition = 'transform .18s ease, box-shadow .18s ease';
      el.addEventListener('mouseenter', function () {
        el.style.transform = 'translateY(-2px)';
        el.style.boxShadow = '0 16px 30px -24px rgba(15,23,42,.55)';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transform = '';
        el.style.boxShadow = '';
      });
    });
  }

  /* ------------------------------------------ desplegable de descuentos */
  var filtroTipo = '';
  var descCuerpo = document.getElementById('desc-cuerpo');
  var descToggle = document.getElementById('desc-toggle');
  var descChevron = document.getElementById('desc-chevron');

  function saldoActual() {
    /* se calcula en vivo: al canjear, baja al momento */
    return Math.max(0, USWAP.puntosDe(u.id));
  }

  function yaCanjeado(tiendaId) {
    return canjesDe(u.id).some(function (c) { return c.tiendaId === tiendaId; });
  }

  function pintarDescuentos() {
    var contSaldo = document.getElementById('desc-saldo-top');
    if (!contSaldo) return;

    var saldoAhora = saldoActual();
    var disponibles = TIENDAS.filter(function (t) {
      return !yaCanjeado(t.id) && t.precio <= saldoAhora;
    }).length;

    contSaldo.textContent = saldoAhora + ' pts';
    document.getElementById('desc-sub').textContent =
      disponibles + (disponibles === 1 ? ' descuento a tu alcance' : ' descuentos a tu alcance');

    var barra = document.getElementById('desc-barra');
    var gastadoTotal = canjesDe(u.id).reduce(function (acc, c) { return acc + (c.precio || 0); }, 0);
    var ganados = Math.max(0, saldoAhora + gastadoTotal);
    if (barra) {
      var pct = ganados > 0 ? Math.round((saldoAhora / ganados) * 100) : 0;
      barra.style.width = Math.max(0, Math.min(100, pct)) + '%';
    }
    var cartera = document.getElementById('desc-cartera');
    if (cartera) {
      cartera.textContent = saldoAhora + ' de ' + ganados + ' pts';
    }
    var credSaldo = document.getElementById('cred-saldo');
    if (credSaldo) credSaldo.textContent = saldoAhora + ' pts';
    var credPuntos = document.getElementById('cred-puntos');
    if (credPuntos) {
      credPuntos.textContent = saldoAhora + (Math.abs(saldoAhora) === 1 ? ' pt' : ' pts') + ' ›';
    }
    var statPuntos = document.getElementById('stat-puntos');
    if (statPuntos) statPuntos.textContent = saldoAhora;

    document.getElementById('desc-filtros').innerHTML = TIPOS.map(function (tp) {
      return '<button type="button" class="chip chip-mini' + (filtroTipo === tp.id ? ' activo' : '') +
        '" data-tipo="' + tp.id + '">' + tp.texto + '</button>';
    }).join('');

    var lista = TIENDAS.filter(function (t) { return !filtroTipo || t.tipo === filtroTipo; });

    document.getElementById('desc-lista').innerHTML = lista.map(function (t) {
      var canjeado = yaCanjeado(t.id);
      var alcanza = t.precio <= saldoAhora;
      var boton;

      if (canjeado) {
        boton = '<span style="font-size:10.5px;font-weight:700;color:#16a34a">Canjeado ✓</span>';
      } else if (!soyYo) {
        boton = '';
      } else if (alcanza) {
        boton = '<button type="button" data-canje="' + t.id + '" style="border:0;border-radius:999px;' +
          'padding:6px 10px;background:#0f172a;color:#fff;font-family:inherit;font-size:10.5px;' +
          'font-weight:700;cursor:pointer">Canjear</button>';
      } else {
        boton = '<span style="font-size:10.5px;font-weight:650;color:#8592a6">Faltan ' +
          (t.precio - saldoAhora) + '</span>';
      }

      return '<div class="tienda-card" style="background:' + (canjeado ? '#f6fdf9' : '#fff') + ';' +
          'border:1px solid ' + (canjeado ? '#dcf3e6' : '#e9edf5') + ';border-radius:14px;padding:11px 12px;' +
          'display:flex;flex-direction:column;' + (canjeado || alcanza ? '' : 'opacity:.72;') + '">' +
        '<span style="align-self:flex-start;font-size:9.5px;font-weight:700;color:#4343d6;background:#eef0ff;' +
          'border-radius:6px;padding:2px 6px">' + UI.esc(NOMBRE_TIPO[t.tipo] || 'Otros') + '</span>' +
        '<div style="margin-top:8px;font-size:19px;font-weight:800;letter-spacing:-.7px;line-height:1;' +
          'color:#0f172a">' + UI.esc(t.valor) + '</div>' +
        '<div style="margin-top:3px;font-size:12px;font-weight:650;letter-spacing:-.1px">' + UI.esc(t.nombre) + '</div>' +
        '<div style="margin-top:2px;font-size:10.5px;color:var(--muted);line-height:1.4;flex:1">' +
          UI.esc(t.detalle) + '</div>' +
        '<div style="display:flex;align-items:center;justify-content:space-between;gap:6px;margin-top:9px">' +
          '<span style="font-size:11.5px;font-weight:800;color:#0f172a">' + t.precio +
            '<span style="font-size:9.5px;font-weight:600;color:var(--muted)"> pts</span></span>' +
          boton +
        '</div>' +
      '</div>';
    }).join('');

    dinamizar('.tienda-card');

    Array.prototype.forEach.call(document.querySelectorAll('#desc-filtros [data-tipo]'), function (b) {
      b.addEventListener('click', function () {
        filtroTipo = b.getAttribute('data-tipo');
        pintarDescuentos();
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll('#desc-lista [data-canje]'), function (b) {
      b.addEventListener('click', function () { canjear(b.getAttribute('data-canje')); });
    });
  }

  function canjear(tiendaId) {
    var tienda = null;
    TIENDAS.forEach(function (x) { if (x.id === tiendaId) tienda = x; });
    if (!tienda) return;

    var saldoAhora = saldoActual();
    if (tienda.precio > saldoAhora) {
      UI.toast('Te faltan ' + (tienda.precio - saldoAhora) + ' puntos');
      return;
    }

    var est = USWAP.estado();
    if (!est.canjes) est.canjes = [];
    est.canjes.push({
      id: 'c' + Date.now().toString(36),
      uid: u.id,
      tiendaId: tienda.id,
      precio: tienda.precio,
      fecha: new Date().toISOString()
    });
    USWAP.guardar();

    pintarDescuentos();
    UI.toast('Canjeado: ' + tienda.valor + ' en ' + tienda.nombre);
  }

  if (descToggle && descCuerpo) {
    descToggle.addEventListener('click', function () {
      var aberto = descCuerpo.style.display !== 'none';
      descCuerpo.style.display = aberto ? 'none' : 'block';
      descToggle.setAttribute('aria-expanded', aberto ? 'false' : 'true');
      descChevron.style.transform = aberto ? '' : 'rotate(180deg)';
      if (!aberto) pintarDescuentos();
    });
  }

  pintarDescuentos();

  /* --------------------------------------------------- títulos que dependen de quién es */
  var tituloOfertas = document.getElementById('titulo-ofertas');
  if (tituloOfertas) tituloOfertas.textContent = soyYo ? 'Tus peticiones' : 'Sus peticiones';
  if (!soyYo) {
    var accionOfertas = document.getElementById('accion-ofertas');
    if (accionOfertas) accionOfertas.style.display = 'none';
  }

  /* ------------------------------------------------------------- ofertas */
  document.getElementById('ofertas').innerHTML = ofertas.length
    ? '<div class="bloque" style="padding:4px 16px;border-radius:16px">' +
        ofertas.map(function (o, i) {
          return '<a href="oferta.html?id=' + encodeURIComponent(o.id) + '" style="display:flex;align-items:center;' +
              'gap:11px;padding:14px 0;text-decoration:none;color:inherit' +
              (i < ofertas.length - 1 ? ';border-bottom:1px solid #eef1f7' : '') + '">' +
            '<span style="flex:0 0 auto;width:6px;height:6px;border-radius:99px;background:' +
              (o.estado === 'cerrada' ? '#cbd5e1' : (o.estado === 'acordada' ? '#d97706' : '#16a34a')) + '"></span>' +
            '<span style="flex:1;min-width:0">' +
              '<span style="display:block;font-size:13.5px;font-weight:650;line-height:1.4;letter-spacing:-.1px">' +
                UI.esc(o.titulo) + '</span>' +
              '<span style="display:block;margin-top:3px;font-size:11.5px;color:var(--muted)">' +
                UI.esc(o.categoria) + ' · ' + UI.tiempo(o.creadaEn) +
                (o.estado === 'cerrada' ? ' · Cerrada' : (o.estado === 'acordada' ? ' · Acuerdo pendiente' : '')) + '</span>' +
            '</span>' +
            '<span style="flex:0 0 auto;color:#c3cbdb;font-size:18px;line-height:1">›</span>' +
          '</a>';
        }).join('') +
      '</div>'
    : UI.vacio(soyYo ? 'Todavía no has publicado nada' : 'Todavía no ha publicado nada',
        soyYo ? 'Pulsa en Publicar para crear tu primera petición.' : '');

  /* -------------------------------------------------------- reseñas */
  document.getElementById('num-val').textContent = '';

  var filasDist = [5, 4, 3, 2, 1].map(function (n) {
    var c = valoraciones.filter(function (v) { return v.estrellas === n; }).length;
    var pct = total ? Math.round((c / total) * 100) : 0;
    return '<div style="display:flex;align-items:center;gap:9px;margin-top:7px">' +
      '<span style="width:9px;text-align:right;font-size:11px;font-weight:700;color:var(--muted)">' + n + '</span>' +
      '<div style="flex:1;height:7px;border-radius:99px;background:#eef1f8;overflow:hidden">' +
        '<div style="height:100%;width:' + pct + '%;border-radius:99px;' +
          'background:linear-gradient(90deg,#fbbf24,#f59e0b)"></div>' +
      '</div>' +
      '<span style="width:16px;text-align:right;font-size:11px;color:var(--muted)">' + c + '</span>' +
    '</div>';
  }).join('');

  var contenedorVal = document.getElementById('valoraciones');

  if (!total) {
    contenedorVal.innerHTML = UI.vacio('Sin reseñas', 'Cierra tratos y pide que te valoren para subir en el ranking.');
  } else {
    contenedorVal.innerHTML =
      '<div class="bloque" style="padding:16px 17px;border-radius:16px">' +
        '<div style="display:flex;align-items:baseline;justify-content:space-between;gap:10px">' +
          '<span style="font-size:13px;font-weight:700;letter-spacing:-.2px">Reputación</span>' +
          '<span style="font-size:11.5px;font-weight:600;color:var(--muted)">' + total +
            (total === 1 ? ' reseña' : ' reseñas') + '</span>' +
        '</div>' +
        '<div style="margin-top:9px">' + filasDist + '</div>' +
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

      listaResenas.innerHTML = lista.map(function (v) {
        var de = USWAP.usuario(v.deUsuarioId) || { nombre: 'Alguien', color: '#94a3b8' };
        return '<div class="resena-card" style="background:#fff;border:1px solid #e9edf5;border-radius:16px;' +
            'padding:14px 15px;margin-bottom:9px">' +
          '<div style="display:flex;align-items:center;justify-content:space-between;gap:10px">' +
            UI.estrellas(v.estrellas) +
            '<span class="usuario-detalle">' + UI.tiempo(v.creadaEn) + '</span>' +
          '</div>' +
          (v.comentario
            ? '<p style="margin:9px 0 0;font-size:13.5px;line-height:1.65;color:var(--tinta-suave)">“' +
                UI.esc(v.comentario) + '”</p>'
            : '') +
          '<div style="display:flex;align-items:center;gap:8px;margin-top:11px">' +
            avatarPerfil(de, 'pequeno') +
            '<span style="font-size:12px;font-weight:650">' + UI.esc(de.nombre) + '</span>' +
          '</div>' +
        '</div>';
      }).join('');

      dinamizar('.resena-card');
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
          'color:' + (actual ? 'var(--primario-oscuro)' : (n.color || '#8592a6')) + '">' + (i + 1) + '</span>' +
        '<span style="flex:1;min-width:0">' +
          '<span style="display:block;font-size:13px;font-weight:700;letter-spacing:-.1px;color:' +
            (n.color || '#0f172a') + '">' + UI.esc(n.nombre) + '</span>' +
          '<span style="display:block;margin-top:1px;font-size:11px;color:var(--muted)">' +
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
        '<div style="font-size:12px;color:var(--muted)">Escalera de rangos</div>' +
        '<h2 style="margin:6px 0 3px;font-size:21px;letter-spacing:-.6px;color:' + corRango + '">' +
          UI.esc(nivel.nombre) + '</h2>' +
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

    '<div style="margin-top:14px;padding-top:12px;border-top:1px solid #eef1f7;font-size:11.5px;' +
      'line-height:1.55;color:var(--muted)">' +
      '★1 resta 20, ★2 no suma, ★3 suma 20, ★4 suma 40 y ★5 suma 80.' +
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
