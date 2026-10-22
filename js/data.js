/* ==========================================================================
   USwap — CONTRATO DE DATOS            Propietario: P1 (Daniel)
   --------------------------------------------------------------------------
   Este archivo es la "base de datos" de la app y el contrato compartido.
   Si necesitas un campo nuevo, PÍDESELO A P1. No lo edites por tu cuenta.

   Reglas técnicas (no negociables):
   - Sin módulos ES, sin fetch, sin librerías: funciona abriendo el .html.
   - Todo se guarda en localStorage bajo la clave "uswap.v1".
   - Los datos semilla se regeneran con USWAP.reset() (botón "Reiniciar demo").
   ========================================================================== */
(function () {
  'use strict';

  var VERSION = 6;                 // subir si cambia la forma de los datos
  var KEY = 'uswap.v1';            // clave de localStorage

  /* Área = de qué va la PETICIÓN (vive en la oferta, no en la persona) */
  var AREAS = ['Tecnología', 'Matemáticas', 'Ciencias', 'Salud', 'Ciencias jurídicas',
               'Lenguaje', 'Habilidades', 'Ciencias sociales', 'Otros'];

  /* Rama = gran bloque de estudios (vive en la persona) */
  var RAMAS = ['Artes y Humanidades', 'Ciencias', 'Ciencias de la Salud',
               'Ciencias Sociales y Jurídicas', 'Ingeniería y Arquitectura'];

  /* Curso: 1º a 6º de grado + posgrados. Se guarda como texto. */
  var CURSOS = ['1º', '2º', '3º', '4º', '5º', '6º', 'Máster', 'Doctorado'];

  var CATEGORIAS = ['Apuntes', 'Clases', 'Transporte', 'Comida', 'Objetos', 'Creatividad', 'Idiomas', 'Favores'];

  /* ---------------------------------------------------------------- usuarios
     id, nombre, carrera (texto libre), rama, curso, habilidades[], bio, color,
     instagram, whatsapp
  */
  var USUARIOS = [
    { id: 'u1', nombre: 'Ana Ferrer', carrera: 'Ingeniería Informática', rama: 'Ingeniería y Arquitectura', curso: '3º',
      habilidades: ['Python', 'Diseño UI', 'Estadística'], bio: 'Tercero de Informática en la USC. Monto prototipos y doy clases de Python en la ETSE.',
      color: '#6366f1', instagram: 'ana.ferrer', whatsapp: '34600111222' },
    { id: 'u2', nombre: 'Marc Puig', carrera: 'Matemáticas', rama: 'Ciencias', curso: '2º',
      habilidades: ['Cálculo', 'LaTeX', 'Guitarra'], bio: 'Apuntes ordenados y clases de repaso de Cálculo en el Campus Vida.',
      color: '#0ea5e9', instagram: 'marc.puig', whatsapp: '34600222333' },
    { id: 'u3', nombre: 'Lucía Romero', carrera: 'Medicina', rama: 'Ciencias de la Salud', curso: '4º',
      habilidades: ['Anatomía', 'Primeros auxilios', 'Dibujo'], bio: 'Cuarto de Medicina en la USC. Mis apuntes llevan dibujos a mano.',
      color: '#ec4899', instagram: 'lucia.romero', whatsapp: '34600333444' },
    { id: 'u4', nombre: 'Javier Barcala', carrera: 'ADE', rama: 'Ciencias Sociales y Jurídicas', curso: '3º',
      habilidades: ['Excel', 'Contabilidad', 'Inglés'], bio: 'Tengo coche y bajo a la estación de Santiago todos los viernes.',
      color: '#f59e0b', instagram: 'javier.barcala', whatsapp: '34600444555' },
    { id: 'u5', nombre: 'Sergio León', carrera: 'Bellas Artes', rama: 'Artes y Humanidades', curso: '2º',
      habilidades: ['Ilustración', 'Photoshop', 'Serigrafía'], bio: 'Hago ilustración editorial y carteles para TFGs. Campus de Pontevedra.',
      color: '#10b981', instagram: 'sergio.leon', whatsapp: '34600555666' },
    { id: 'u6', nombre: 'Núria Costa', carrera: 'Derecho', rama: 'Ciencias Sociales y Jurídicas', curso: '5º',
      habilidades: ['Redacción', 'Debate', 'Inglés C1'], bio: 'Corrijo textos académicos y preparo defensas orales en la Facultad de Derecho.',
      color: '#8b5cf6', instagram: 'nuria.costa', whatsapp: '34600666777' },
    { id: 'u7', nombre: 'Tomás Vidal', carrera: 'Arquitectura', rama: 'Ingeniería y Arquitectura', curso: '3º',
      habilidades: ['AutoCAD', 'Maquetas', 'Fotografía'], bio: 'Maquetas y planos a cambio de ayuda con estructuras. Campus de Santiago.',
      color: '#ef4444', instagram: 'tomas.vidal', whatsapp: '34600777888' },
    { id: 'u8', nombre: 'Elena Sanz', carrera: 'Biología', rama: 'Ciencias', curso: '1º',
      habilidades: ['Laboratorio', 'Francés', 'Cocina'], bio: 'Primero de Biología. Llevo tupper vegano los martes a la ETSE.',
      color: '#14b8a6', instagram: 'elena.sanz', whatsapp: '34600888999' },
    { id: 'u9', nombre: 'Irene Bosch', carrera: 'Máster en Ciencia de Datos', rama: 'Ingeniería y Arquitectura', curso: 'Máster',
      habilidades: ['R', 'Visualización de datos', 'SQL'], bio: 'Máster de Ciencia de Datos. Busco encuestas para el TFM.',
      color: '#0f766e', instagram: 'irene.bosch', whatsapp: '34600999000' },
    { id: 'u10', nombre: 'Pau Mir', carrera: 'Doctorado en Física', rama: 'Ciencias', curso: 'Doctorado',
      habilidades: ['Física', 'Python', 'Divulgación'], bio: 'Investigando en física de materiales y dando prácticas en la Facultad de Física.',
      color: '#7c3aed', instagram: 'pau.mir', whatsapp: '34600123123' }
  ];

  /* ----------------------------------------------------------------- ofertas
     id, titulo, descripcion, tipo ('objeto'|'favor'), categoria, area (de la petición),
     autorId, pideACambio, estado ('abierta'|'acordada'|'cerrada'), creadaEn (ISO), destacada
     acuerdo: { proponente, confirmadoPor:[uids], fecha }
       - abierta   → nadie ha propuesto cerrar
       - acordada  → una parte ha propuesto/confirmado; falta la otra
       - cerrada   → las dos partes han confirmado; se puede valorar
  */
  function haceHoras(h) { return new Date(Date.now() - h * 3600 * 1000).toISOString(); }

  function ofertasBase() {
    var base = [
      { id: 'o1', titulo: 'Apuntes completos de Estadística II', tipo: 'objeto', categoria: 'Apuntes', area: 'Matemáticas', autorId: 'u2',
        descripcion: 'Temario entero, problemas resueltos y los 3 exámenes de años anteriores con soluciones. PDF y fotocopia en la Biblioteca Concepción Arenal.',
        pideACambio: 'Clases de Python o apuntes de Cálculo II', estado: 'abierta', creadaEn: haceHoras(2), destacada: true },
      { id: 'o2', titulo: 'Clases de Python para principiantes', tipo: 'favor', categoria: 'Clases', area: 'Tecnología', autorId: 'u1',
        descripcion: 'Dos sesiones de una hora: variables, listas, bucles y funciones. Trae tu portátil. Nivel cero, quedamos en la ETSE.',
        pideACambio: 'Apuntes de Estadística o un café de la máquina', estado: 'abierta', creadaEn: haceHoras(5), destacada: true },
      { id: 'o3', titulo: 'Te llevo en coche a la estación los viernes', tipo: 'favor', categoria: 'Transporte', area: 'Otros', autorId: 'u4',
        descripcion: 'Salgo a las 18:30 del parking de la ETSE dirección estación de tren de Santiago. Quedan 3 plazas por viernes.',
        pideACambio: 'Ayuda con una hoja de Excel o apuntes de Contabilidad', estado: 'abierta', creadaEn: haceHoras(9) },
      { id: 'o4', titulo: 'Corrección de textos en inglés (nivel C1)', tipo: 'favor', categoria: 'Idiomas', area: 'Lenguaje', autorId: 'u6',
        descripcion: 'Reviso tu TFG, abstract o carta de motivación. Devuelvo comentarios y versión limpia en 48 h.',
        pideACambio: 'Ilustración para la portada o maqueta de una sección', estado: 'abierta', creadaEn: haceHoras(14) },
      { id: 'o5', titulo: 'Ilustración personalizada para tu TFG', tipo: 'favor', categoria: 'Creatividad', area: 'Habilidades', autorId: 'u5',
        descripcion: 'Portada ilustrada o infografía a mano digital. Dos rondas de cambios incluidas.',
        pideACambio: 'Corrección de inglés o ayuda con Estadística', estado: 'abierta', creadaEn: haceHoras(20) },
      { id: 'o6', titulo: 'Tupper vegano casero los martes', tipo: 'favor', categoria: 'Comida', area: 'Otros', autorId: 'u8',
        descripcion: 'Menú semanal casero: lentejas, curry de garbanzos o pasta de verduras. Llevo el tupper a la ETSE (Campus Vida).',
        pideACambio: 'Apuntes de primero de Biología o compañía para comer', estado: 'abierta', creadaEn: haceHoras(28) },
      { id: 'o7', titulo: 'Arreglo tu portátil o te instalo el software', tipo: 'favor', categoria: 'Favores', area: 'Tecnología', autorId: 'u1',
        descripcion: 'Limpieza, formateo, instalación de Python/Java/Office y configuración de Git. Sin coste de mano de obra; quedamos en la ETSE o en la biblioteca.',
        pideACambio: 'Apuntes de Anatomía o transporte a la estación', estado: 'abierta', creadaEn: haceHoras(33) },
      { id: 'o8', titulo: 'Apuntes de Anatomía con dibujos a mano', tipo: 'objeto', categoria: 'Apuntes', area: 'Salud', autorId: 'u3',
        descripcion: 'Dos tomos encuadernados con esquemas dibujados a mano. Muy visuales para primer y segundo curso de Medicina.',
        pideACambio: 'Clases de dibujo o ilustración para el TFG', estado: 'abierta', creadaEn: haceHoras(41) },
      /* Oferta ya cerrada: sirve para demostrar el acuerdo a dos bandas y la valoración.
         Ana (u1) propuso el acuerdo y Marc (u2, autor) lo confirmó. */
      { id: 'o9', titulo: 'Apuntes de Cálculo I con ejercicios resueltos', tipo: 'objeto', categoria: 'Apuntes', area: 'Matemáticas', autorId: 'u2',
        descripcion: 'Temario completo, 40 ejercicios resueltos a mano y dos exámenes corregidos. Incluye formulario resumen.',
        pideACambio: 'Clases de Python o un café de la máquina', estado: 'cerrada', creadaEn: haceHoras(80),
        acuerdo: { proponente: 'u1', confirmadoPor: ['u1', 'u2'], fecha: haceHoras(20) } },
      { id: 'o10', titulo: 'Repaso de Derecho Civil para el examen', tipo: 'favor', categoria: 'Clases', area: 'Ciencias jurídicas', autorId: 'u6',
        descripcion: 'Dos sesiones de repaso de obligaciones y contratos, con casos prácticos y esquemas de respuesta.',
        pideACambio: 'Ayuda con Excel o una ilustración para apuntes', estado: 'abierta', creadaEn: haceHoras(12) },
      { id: 'o11', titulo: 'Necesito 40 respuestas para mi encuesta del TFM', tipo: 'favor', categoria: 'Favores', area: 'Ciencias sociales', autorId: 'u9',
        descripcion: 'Encuesta anónima de 5 minutos sobre hábitos de consumo en el campus. Comparto los resultados con quien la haga.',
        pideACambio: 'Que la respondas y la pases a un par de personas', estado: 'abierta', creadaEn: haceHoras(7), destacada: true },
      { id: 'o12', titulo: 'Prácticas de laboratorio de Física', tipo: 'favor', categoria: 'Clases', area: 'Ciencias', autorId: 'u10',
        descripcion: 'Preparo el guion de prácticas y te ayudo con la toma de datos y el tratamiento de errores.',
        pideACambio: 'Apuntes de Matemáticas o ayuda con LaTeX', estado: 'abierta', creadaEn: haceHoras(30) }
    ];

    /* toda oferta necesita el campo acuerdo, aunque esté vacío */
    return base.map(function (o) {
      if (!o.acuerdo) o.acuerdo = { proponente: null, confirmadoPor: [], fecha: null };
      return o;
    });
  }

  /* ------------------------------------------------------------- valoraciones
     id, ofertaId, deUsuarioId, aUsuarioId, estrellas (1-5), comentario, creadaEn
     Puntos: 10 por estrella (★1 = 10 … ★5 = 50). Sin reseñas, 0 puntos.
  */
  var COMENTARIOS = [
    'Muy puntual y todo clarísimo.',
    'Trato genial, repetiría sin duda.',
    'Cumplió exactamente lo acordado.',
    'Buen material, aunque tardó un poco.',
    'No respondió a los mensajes.',
    'Me ayudó muchísimo con el examen.'
  ];

  function valoracionesBase() {
    var patron = {
      u1: [5, 5, 4, 5],
      u2: [5, 4, 4, 5, 5],
      u3: [3, 4, 2, 5],
      u4: [4, 4, 5],
      u5: [1, 2, 3],
      u6: [5, 5, 4, 4, 5, 5],
      u7: [4, 2, 4],
      u8: [5, 3, 4]
    };
    var out = [], n = 0;
    Object.keys(patron).forEach(function (uid) {
      patron[uid].forEach(function (estrellas, i) {
        n += 1;
        out.push({
          id: 'v' + n, ofertaId: 'seed', deUsuarioId: 'u' + ((n % 8) + 1), aUsuarioId: uid,
          estrellas: estrellas, comentario: COMENTARIOS[(n + i) % COMENTARIOS.length],
          creadaEn: haceHoras(n * 13)
        });
      });
    });
    return out;
  }

  /* ---------------------------------------------------------------- almacén */
  function copia(o) { return JSON.parse(JSON.stringify(o)); }

  function semilla() {
    return { version: VERSION, yo: 'u1', usuarios: copia(USUARIOS), ofertas: ofertasBase(), valoraciones: valoracionesBase() };
  }

  var _estado = null;   // caché en memoria (funciona aunque localStorage falle)
  var _memoria = null;  // respaldo cuando localStorage no está disponible

  function estado() {
    if (_estado) return _estado;
    try {
      var raw = window.localStorage.getItem(KEY);
      if (raw) _estado = JSON.parse(raw);
    } catch (e) { /* file:// sin permisos de storage */ }
    if (!_estado) _estado = _memoria;
    if (!_estado || _estado.version !== VERSION) { _estado = semilla(); persistir(); }
    return _estado;
  }

  function persistir() {
    _memoria = _estado;
    try { window.localStorage.setItem(KEY, JSON.stringify(_estado)); } catch (e) { /* demo sin persistencia */ }
  }

  function guardarCambios() { persistir(); }

  function id(prefix) { return prefix + Date.now().toString(36) + Math.floor(Math.random() * 1000); }

  /* -------------------------------------------------------------------- API */
  window.USWAP = {
    AREAS: AREAS,
    RAMAS: RAMAS,
    CURSOS: CURSOS,
    CATEGORIAS: CATEGORIAS,

    estado: estado,
    guardar: guardarCambios,

    reset: function () {
      _estado = semilla();
      _memoria = _estado;
      try { window.localStorage.setItem(KEY, JSON.stringify(_estado)); } catch (e) {}
      return _estado;
    },

    /* --- usuario actual (modo demo: se puede cambiar desde la cabecera) --- */
    yo: function () { return estado().yo; },
    setYo: function (uid) { estado().yo = uid; persistir(); },

    /* --- lecturas --- */
    usuarios: function () { return estado().usuarios; },
    usuario: function (uid) {
      var us = estado().usuarios;
      for (var i = 0; i < us.length; i++) if (us[i].id === uid) return us[i];
      return null;
    },
    ofertas: function () { return estado().ofertas; },
    oferta: function (oid) {
      var os = estado().ofertas;
      for (var i = 0; i < os.length; i++) if (os[i].id === oid) return os[i];
      return null;
    },
    valoraciones: function () { return estado().valoraciones; },
    valoracionesDe: function (uid) {
      return estado().valoraciones.filter(function (v) { return v.aUsuarioId === uid; });
    },
    ofertasDe: function (uid) {
      return estado().ofertas.filter(function (o) { return o.autorId === uid; });
    },

    /* --- escrituras --- */
    addOferta: function (datos) {
      var o = {
        id: id('o'), titulo: datos.titulo, descripcion: datos.descripcion, tipo: datos.tipo || 'favor',
        categoria: datos.categoria || 'Favores', area: datos.area || 'Otros', autorId: estado().yo,
        pideACambio: datos.pideACambio || '', estado: 'abierta',
        creadaEn: new Date().toISOString(), destacada: false,
        acuerdo: { proponente: null, confirmadoPor: [], fecha: null }
      };
      estado().ofertas.unshift(o);
      persistir();
      return o;
    },
    addValoracion: function (datos) {
      /* una valoración por persona y trato */
      if (datos.ofertaId && datos.ofertaId !== 'manual' &&
          window.USWAP.yaValoro(datos.ofertaId, estado().yo)) return null;

      var estrellas = Math.max(1, Math.min(5, Number(datos.estrellas) || 0));
      var v = {
        id: id('v'), ofertaId: datos.ofertaId || 'manual', deUsuarioId: estado().yo,
        aUsuarioId: datos.aUsuarioId, estrellas: estrellas,
        comentario: datos.comentario || '', creadaEn: new Date().toISOString()
      };
      estado().valoraciones.unshift(v);
      persistir();
      return v;
    },
    /* --- acuerdo a dos bandas ---
       Cualquiera de las dos partes propone; la otra confirma.
       Solo se cierra cuando confirman el autor y otra persona distinta. */
    proponerAcuerdo: function (oid) {
      var o = window.USWAP.oferta(oid);
      if (!o || o.estado === 'cerrada') return o;
      var yo = estado().yo;
      if (!o.acuerdo) o.acuerdo = { proponente: null, confirmadoPor: [], fecha: null };
      if (o.acuerdo.confirmadoPor.indexOf(yo) === -1) o.acuerdo.confirmadoPor.push(yo);
      o.acuerdo.proponente = yo;
      o.estado = 'acordada';
      persistir();
      return o;
    },
    confirmarAcuerdo: function (oid) {
      var o = window.USWAP.oferta(oid);
      if (!o || o.estado === 'cerrada') return o;
      var yo = estado().yo;
      if (!o.acuerdo) o.acuerdo = { proponente: null, confirmadoPor: [], fecha: null };
      if (o.acuerdo.confirmadoPor.indexOf(yo) === -1) o.acuerdo.confirmadoPor.push(yo);

      var confirmaAutor = o.acuerdo.confirmadoPor.indexOf(o.autorId) !== -1;
      if (confirmaAutor && o.acuerdo.confirmadoPor.length >= 2) {
        o.estado = 'cerrada';
        o.acuerdo.fecha = new Date().toISOString();
      } else {
        o.estado = 'acordada';
      }
      persistir();
      return o;
    },
    /* uids de las personas implicadas en el trato (autor + quien confirmó) */
    participantes: function (oid) {
      var o = window.USWAP.oferta(oid);
      if (!o) return [];
      var ids = [o.autorId];
      var conf = (o.acuerdo && o.acuerdo.confirmadoPor) || [];
      conf.forEach(function (uid) { if (ids.indexOf(uid) === -1) ids.push(uid); });
      return ids;
    },
    /* la persona a la que le toca valorar/valorar yo, relativa al usuario actual */
    otraParteDe: function (oid) {
      var yo = estado().yo;
      var otros = window.USWAP.participantes(oid).filter(function (uid) { return uid !== yo; });
      return otros.length ? window.USWAP.usuario(otros[0]) : null;
    },
    /* ¿el usuario ya valoró esta oferta? evita valoraciones duplicadas */
    yaValoro: function (oid, deUid) {
      var de = deUid || estado().yo;
      return estado().valoraciones.some(function (v) {
        return v.ofertaId === oid && v.deUsuarioId === de;
      });
    },

    cerrarTrato: function (oid) {
      var o = window.USWAP.oferta(oid);
      if (o) { o.estado = 'cerrada'; persistir(); }
      return o;
    },
    actualizarPerfil: function (datos) {
      var u = window.USWAP.usuario(estado().yo);
      if (!u) return null;
      ['nombre', 'carrera', 'rama', 'curso', 'bio', 'instagram', 'whatsapp'].forEach(function (k) {
        if (datos[k] !== undefined && datos[k] !== '') u[k] = datos[k];
      });
      if (datos.habilidades) u.habilidades = datos.habilidades;
      persistir();
      return u;
    },

    /* --- reputación: 10 puntos por estrella (0★ = 0, 5★ = 50) --- */
    puntosDe: function (uid) {
      return estado().valoraciones.reduce(function (total, v) {
        if (v.aUsuarioId !== uid) return total;
        return total + (Number(v.estrellas) || 0) * 10;
      }, 0);
    },
    mediaDe: function (uid) {
      var vs = window.USWAP.valoracionesDe(uid);
      if (!vs.length) return 0;
      var suma = vs.reduce(function (a, v) { return a + v.estrellas; }, 0);
      return Math.round((suma / vs.length) * 10) / 10;
    }
  };
})();
