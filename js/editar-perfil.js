/* ==========================================================================
   EDITAR PERFIL                       Propietario: P4 (sergiooleeonn)
   --------------------------------------------------------------------------
   Solo se editan este archivo, editar-perfil.html y perfil.html / perfil.js.
   Pestañas: perfil (foto, nombre, descripción, habilidades), estudios, contacto.
   La foto se guarda como campo opcional "foto" (data URL) usando la API
   pública USWAP.estado() + USWAP.guardar(); no requiere cambios en data.js.
   ========================================================================== */
(function () {
  'use strict';

  var UI = window.USWAP_UI;

  UI.montarNav('perfil');

  var yo = USWAP.usuario(USWAP.yo());
  if (!yo) { window.location.href = 'index.html'; return; }

  var campos = {
    nombre: document.getElementById('nombre'),
    carrera: document.getElementById('carrera'),
    curso: document.getElementById('curso'),
    rama: document.getElementById('rama'),
    habilidades: document.getElementById('habilidades'),
    bio: document.getElementById('bio'),
    instagram: document.getElementById('instagram'),
    whatsapp: document.getElementById('whatsapp')
  };

  /* ------------------------------------------------------------- pestañas */
  var botonesTab = document.querySelectorAll('[data-tab]');
  var paneles = document.querySelectorAll('[data-panel]');
  var BASE_TAB = 'flex:1;border:0;padding:9px 6px;border-radius:9px;font-family:inherit;' +
    'font-size:12px;font-weight:700;cursor:pointer';
  var TAB_ON = ';background:#fff;color:#0f172a;box-shadow:0 1px 2px rgba(15,23,42,.10)';
  var TAB_OFF = ';background:transparent;color:#8592a6';

  function activarTab(nombre) {
    Array.prototype.forEach.call(botonesTab, function (b) {
      var on = b.getAttribute('data-tab') === nombre;
      b.style.cssText = BASE_TAB + (on ? TAB_ON : TAB_OFF);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    Array.prototype.forEach.call(paneles, function (p) {
      p.hidden = p.getAttribute('data-panel') !== nombre;
    });
  }

  Array.prototype.forEach.call(botonesTab, function (b) {
    b.addEventListener('click', function () { activarTab(b.getAttribute('data-tab')); });
  });

  /* --------------------------------------------------------------- selects */
  campos.curso.innerHTML = USWAP.CURSOS.map(function (c) {
    return '<option value="' + UI.esc(c) + '">' + UI.esc(c) + '</option>';
  }).join('');
  campos.rama.innerHTML = USWAP.RAMAS.map(function (r) {
    return '<option value="' + UI.esc(r) + '">' + UI.esc(r) + '</option>';
  }).join('');

  /* ------------------------------------------------------------- precarga */
  campos.nombre.value = yo.nombre || '';
  campos.carrera.value = yo.carrera || '';
  campos.curso.value = yo.curso || USWAP.CURSOS[0];
  campos.rama.value = yo.rama || USWAP.RAMAS[0];
  campos.bio.value = yo.bio || '';
  campos.instagram.value = yo.instagram || '';
  campos.whatsapp.value = yo.whatsapp || '';

  /* ------------------------------------------------- contador de "Sobre ti" */
  var contadorBio = document.getElementById('contador-bio');
  function pintarContador() {
    if (!contadorBio) return;
    var n = campos.bio.value.length;
    contadorBio.textContent = n + ' / 180';
    contadorBio.style.color = n >= 170 ? 'var(--rojo)' : (n >= 150 ? 'var(--ambar)' : '');
  }
  pintarContador();
  campos.bio.addEventListener('input', pintarContador);

  /* ------------------------------------------------------------------ foto */
  var fotoActual = (yo.foto && /^data:image\//.test(yo.foto)) ? yo.foto : '';
  var fotoPreview = document.getElementById('foto-preview');
  var fotoInput = document.getElementById('foto-input');

  function pintarFoto() {
    if (fotoActual) {
      fotoPreview.innerHTML = '<img src="' + fotoActual + '" alt="" ' +
        'style="width:100%;height:100%;object-fit:cover;display:block">';
    } else {
      fotoPreview.innerHTML = '';
      fotoPreview.textContent = UI.iniciales(campos.nombre.value || yo.nombre);
      fotoPreview.style.background = yo.color || '#6366f1';
    }
  }

  fotoInput.addEventListener('change', function () {
    var f = fotoInput.files && fotoInput.files[0];
    if (!f) return;
    if (!/^image\//.test(f.type)) { UI.toast('Elige una imagen JPG o PNG'); return; }
    if (f.size > 5 * 1024 * 1024) { UI.toast('La imagen no puede pasar de 5 MB'); return; }

    var lector = new FileReader();
    lector.onload = function () {
      var img = new Image();
      img.onload = function () {
        var lado = 220;
        var lienzo = document.createElement('canvas');
        lienzo.width = lado;
        lienzo.height = lado;
        var ctx = lienzo.getContext('2d');
        var escala = Math.max(lado / img.width, lado / img.height);
        var w = img.width * escala;
        var h = img.height * escala;
        ctx.drawImage(img, (lado - w) / 2, (lado - h) / 2, w, h);
        fotoActual = lienzo.toDataURL('image/jpeg', 0.82);
        pintarFoto();
        UI.toast('Foto lista. Pulsa Guardar cambios');
      };
      img.onerror = function () { UI.toast('No se pudo leer la imagen'); };
      img.src = lector.result;
    };
    lector.onerror = function () { UI.toast('No se pudo leer el archivo'); };
    lector.readAsDataURL(f);
  });

  document.getElementById('foto-quitar').addEventListener('click', function () {
    fotoActual = '';
    fotoInput.value = '';
    pintarFoto();
  });

  campos.nombre.addEventListener('input', function () { if (!fotoActual) pintarFoto(); });

  /* ------------------------------------------------------------ habilidades */
  var CATALOGO = [
    { titulo: 'Tecnología e informática', items: ['Python', 'Java', 'C', 'SQL', 'Bases de datos', 'Redes', 'Linux', 'Git', 'Diseño UI', 'Ofimática'] },
    { titulo: 'Matemáticas y física', items: ['Cálculo', 'Álgebra', 'Estadística', 'LaTeX', 'R', 'MATLAB', 'Física', 'Análisis de datos'] },
    { titulo: 'Biología y laboratorio', items: ['Laboratorio', 'Microbiología', 'Genética', 'Botánica', 'Zoología', 'Química', 'Bioquímica', 'Enología'] },
    { titulo: 'Salud', items: ['Anatomía', 'Fisiología', 'Primeros auxilios', 'Enfermería', 'Farmacología', 'Nutrición', 'Fisioterapia', 'Psicología', 'Odontología'] },
    { titulo: 'Derecho y empresa', items: ['Derecho civil', 'Redacción jurídica', 'Debate', 'Contabilidad', 'Finanzas', 'Fiscalidad', 'Marketing', 'Gestión de proyectos', 'Recursos humanos'] },
    { titulo: 'Arte y diseño', items: ['Ilustración', 'Dibujo', 'Pintura', 'Escultura', 'Serigrafía', 'Fotografía', 'Photoshop', 'Maquetas', 'Dibujo técnico', 'Edición de vídeo'] },
    { titulo: 'Arquitectura', items: ['AutoCAD', 'Urbanismo', 'Topografía', 'Planos'] },
    { titulo: 'Letras, historia y comunicación', items: ['Redacción', 'Corrección de textos', 'Gallego', 'Latín', 'Historia', 'Periodismo', 'Investigación'] },
    { titulo: 'Idiomas', items: ['Inglés', 'Francés', 'Portugués', 'Alemán', 'Italiano'] },
    { titulo: 'Vida y oficios', items: ['Apuntes', 'Clases particulares', 'Transporte', 'Cocina gallega', 'Repostería', 'Guitarra', 'Gaita', 'Guía del Camino'] }
  ];

  var TODAS = [];
  CATALOGO.forEach(function (g) {
    g.items.forEach(function (h) { TODAS.push(h); });
  });

  var seleccion = (yo.habilidades || []).slice();
  var contChips = document.getElementById('habilidades-chips');

  function chip(h) {
    var on = seleccion.indexOf(h) !== -1;
    return '<button type="button" data-hab="' + UI.esc(h) + '" ' +
      'style="display:inline-flex;align-items:center;gap:6px;padding:8px 12px;border-radius:999px;' +
      'font-family:inherit;font-size:12px;font-weight:650;cursor:pointer;' +
      'border:1px solid ' + (on ? '#5b5bf6' : '#e6eaf2') + ';' +
      'background:' + (on ? '#5b5bf6' : '#fff') + ';' +
      'color:' + (on ? '#fff' : '#475569') + '">' +
      (on ? '<span style="font-size:10px">✓</span>' : '') + UI.esc(h) + '</button>';
  }

  function pintarHabilidades() {
    var html = '';

    var extras = seleccion.filter(function (h) { return TODAS.indexOf(h) === -1; });
    if (extras.length) {
      html += '<div style="font-size:12px;font-weight:700;letter-spacing:0;color:#64748b;margin:2px 0 7px">Tuyas</div>' +
        '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px">' +
          extras.map(chip).join('') +
        '</div>';
    }

    CATALOGO.forEach(function (g) {
      html += '<div style="font-size:12px;font-weight:700;letter-spacing:0;color:#64748b;margin:14px 0 7px">' +
          UI.esc(g.titulo) + '</div>' +
        '<div style="display:flex;flex-wrap:wrap;gap:6px">' + g.items.map(chip).join('') + '</div>';
    });

    contChips.innerHTML = html;

    Array.prototype.forEach.call(contChips.querySelectorAll('[data-hab]'), function (b) {
      b.addEventListener('click', function () { alternar(b.getAttribute('data-hab')); });
    });
  }

  function alternar(h) {
    var i = seleccion.indexOf(h);
    if (i === -1) {
      if (seleccion.length >= 10) { UI.toast('Máximo 10 habilidades'); return; }
      seleccion.push(h);
    } else {
      seleccion.splice(i, 1);
    }
    pintarHabilidades();
  }

  function anadirHabilidad() {
    var v = campos.habilidades.value.trim();
    if (!v) return;
    var repetida = seleccion.some(function (h) { return h.toLowerCase() === v.toLowerCase(); });
    if (repetida) { UI.toast('Ya tienes esa habilidad'); campos.habilidades.value = ''; return; }
    if (seleccion.length >= 10) { UI.toast('Máximo 10 habilidades'); return; }
    seleccion.push(v);
    campos.habilidades.value = '';
    pintarHabilidades();
  }

  document.getElementById('btn-add-habilidad').addEventListener('click', anadirHabilidad);
  campos.habilidades.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { e.preventDefault(); anadirHabilidad(); }
  });

  pintarHabilidades();
  pintarFoto();

  /* ---------------------------------------------------------------- guardar */
  document.getElementById('form-perfil').addEventListener('submit', function (e) {
    e.preventDefault();

    var nombre = campos.nombre.value.trim();
    if (!nombre) {
      activarTab('perfil');
      UI.toast('El nombre no puede estar vacío');
      campos.nombre.focus();
      return;
    }

    var whatsapp = campos.whatsapp.value.replace(/[^\d]/g, '');
    if (whatsapp && (whatsapp.length < 9 || whatsapp.length > 15)) {
      activarTab('contacto');
      UI.toast('El WhatsApp debe tener entre 9 y 15 dígitos');
      campos.whatsapp.focus();
      return;
    }

    var instagram = campos.instagram.value.trim();
    if (instagram.indexOf('@') !== -1) {
      activarTab('contacto');
      UI.toast('El Instagram va sin @, por ejemplo: sergio.leon');
      campos.instagram.focus();
      return;
    }

    USWAP.actualizarPerfil({
      nombre: nombre,
      carrera: campos.carrera.value.trim(),
      curso: campos.curso.value,
      rama: campos.rama.value,
      habilidades: seleccion,
      bio: campos.bio.value.trim(),
      instagram: instagram,
      whatsapp: whatsapp
    });

    var actualizado = USWAP.usuario(USWAP.yo());
    if (actualizado) {
      if (fotoActual) actualizado.foto = fotoActual;
      else delete actualizado.foto;
      USWAP.guardar();
    }

    UI.toast('Perfil guardado');
    setTimeout(function () { window.location.href = 'perfil.html'; }, 700);
  });
})();
