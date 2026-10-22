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

  var VERSION = 4;                 // subir si cambia la forma de los datos
  var KEY = 'uswap.v1';            // clave de localStorage

  var AREAS = ['Tecnología', 'Ciencias', 'Salud', 'Diseño', 'Humanidades', 'Economía'];
  var CURSOS = [1, 2, 3, 4, 5];
  var CATEGORIAS = ['Apuntes', 'Clases', 'Transporte', 'Comida', 'Tecnología', 'Creatividad', 'Idiomas', 'Favores'];

  /* ---------------------------------------------------------------- usuarios
     id, nombre, carrera, curso, area, habilidades[], bio, color, instagram, whatsapp
  */
  var USUARIOS = [
    { id: 'u1', nombre: 'Ana Ferrer', carrera: 'Ingeniería Informática', curso: 3, area: 'Tecnología',
      habilidades: ['Python', 'Diseño UI', 'Estadística'], bio: 'Tercero de Informática. Monto prototipos y doy clases de Python.',
      color: '#6366f1', instagram: 'ana.ferrer', whatsapp: '34600111222' },
    { id: 'u2', nombre: 'Marc Puig', carrera: 'Matemáticas', curso: 2, area: 'Ciencias',
      habilidades: ['Cálculo', 'LaTeX', 'Guitarra'], bio: 'Apuntes ordenados y clases de repaso de Cálculo.',
      color: '#0ea5e9', instagram: 'marc.puig', whatsapp: '34600222333' },
    { id: 'u3', nombre: 'Lucía Romero', carrera: 'Medicina', curso: 4, area: 'Salud',
      habilidades: ['Anatomía', 'Primeros auxilios', 'Dibujo'], bio: 'Cuarto de Medicina. Mis apuntes llevan dibujos a mano.',
      color: '#ec4899', instagram: 'lucia.romero', whatsapp: '34600333444' },
    { id: 'u4', nombre: 'Javier Barcala', carrera: 'ADE', curso: 3, area: 'Economía',
      habilidades: ['Excel', 'Contabilidad', 'Inglés'], bio: 'Tengo coche y voy a la estación todos los viernes.',
      color: '#f59e0b', instagram: 'javier.barcala', whatsapp: '34600444555' },
    { id: 'u5', nombre: 'Sergio León', carrera: 'Bellas Artes', curso: 2, area: 'Diseño',
      habilidades: ['Ilustración', 'Photoshop', 'Serigrafía'], bio: 'Hago ilustración editorial y carteles para TFGs.',
      color: '#10b981', instagram: 'sergio.leon', whatsapp: '34600555666' },
    { id: 'u6', nombre: 'Núria Costa', carrera: 'Derecho', curso: 5, area: 'Humanidades',
      habilidades: ['Redacción', 'Debate', 'Inglés C1'], bio: 'Corrijo textos académicos y preparo defensas orales.',
      color: '#8b5cf6', instagram: 'nuria.costa', whatsapp: '34600666777' },
    { id: 'u7', nombre: 'Tomás Vidal', carrera: 'Arquitectura', curso: 3, area: 'Diseño',
      habilidades: ['AutoCAD', 'Maquetas', 'Fotografía'], bio: 'Maquetas y planos a cambio de ayuda con estructuras.',
      color: '#ef4444', instagram: 'tomas.vidal', whatsapp: '34600777888' },
    { id: 'u8', nombre: 'Elena Sanz', carrera: 'Biología', curso: 1, area: 'Ciencias',
      habilidades: ['Laboratorio', 'Francés', 'Cocina'], bio: 'Primero de Biología. Llevo tupper vegano los martes.',
      color: '#14b8a6', instagram: 'elena.sanz', whatsapp: '34600888999' }
  ];

  /* ----------------------------------------------------------------- ofertas
     id, titulo, descripcion, tipo ('objeto'|'favor'), categoria, autorId,
     pideACambio, estado ('abierta'|'acordada'|'cerrada'), creadaEn (ISO), destacada
     acuerdo: { proponente, confirmadoPor:[uids], fecha }
       - abierta   → nadie ha propuesto cerrar
       - acordada  → una parte ha propuesto/confirmado; falta la otra
       - cerrada   → las dos partes han confirmado; se puede valorar
  */
  function haceHoras(h) { return new Date(Date.now() - h * 3600 * 1000).toISOString(); }

  function ofertasBase() {
    var base = [
      { id: 'o1', titulo: 'Apuntes completos de Estadística II', tipo: 'objeto', categoria: 'Apuntes', autorId: 'u2',
        descripcion: 'Temario entero, problemas resueltos y los 3 exámenes de años anteriores con soluciones. En PDF y fotocopia.',
        pideACambio: 'Clases de Python o apuntes de Cálculo II', estado: 'abierta', creadaEn: haceHoras(2), destacada: true },
      { id: 'o2', titulo: 'Clases de Python para principiantes', tipo: 'favor', categoria: 'Clases', autorId: 'u1',
        descripcion: 'Dos sesiones de una hora: variables, listas, bucles y funciones. Trae tu portátil. Nivel cero absoluto.',
        pideACambio: 'Apuntes de Estadística o un café de la máquina', estado: 'abierta', creadaEn: haceHoras(5), destacada: true },
      { id: 'o3', titulo: 'Te llevo en coche a la estación los viernes', tipo: 'favor', categoria: 'Transporte', autorId: 'u4',
        descripcion: 'Salgo a las 18:30 del parking de la ETSE dirección estación de tren. Quedan 3 plazas por viernes.',
        pideACambio: 'Ayuda con una hoja de Excel o apuntes de Contabilidad', estado: 'abierta', creadaEn: haceHoras(9) },
      { id: 'o4', titulo: 'Corrección de textos en inglés (nivel C1)', tipo: 'favor', categoria: 'Idiomas', autorId: 'u6',
        descripcion: 'Reviso tu TFG, abstract o carta de motivación. Devuelvo comentarios y versión limpia en 48 h.',
        pideACambio: 'Ilustración para la portada o maqueta de una sección', estado: 'abierta', creadaEn: haceHoras(14) },
      { id: 'o5', titulo: 'Ilustración personalizada para tu TFG', tipo: 'favor', categoria: 'Creatividad', autorId: 'u5',
        descripcion: 'Portada ilustrada o infografía a mano digital. Dos rondas de cambios incluidas.',
        pideACambio: 'Corrección de inglés o ayuda con Estadística', estado: 'abierta', creadaEn: haceHoras(20) },
      { id: 'o6', titulo: 'Tupper vegano casero los martes', tipo: 'favor', categoria: 'Comida', autorId: 'u8',
        descripcion: 'Menú semanal casero: lentejas, curry de garbanzos o pasta de verduras. Llevo el tupper a la ETSE.',
        pideACambio: 'Apuntes de primero de Biología o compañía para comer', estado: 'abierta', creadaEn: haceHoras(28) },
      { id: 'o7', titulo: 'Arreglo tu portátil o te instalo el software', tipo: 'favor', categoria: 'Tecnología', autorId: 'u1',
        descripcion: 'Limpieza, formateo, instalación de Python/Java/Office y configuración de Git. Sin coste de mano de obra.',
        pideACambio: 'Apuntes de Anatomía o transporte a la estación', estado: 'abierta', creadaEn: haceHoras(33) },
      { id: 'o8', titulo: 'Apuntes de Anatomía con dibujos a mano', tipo: 'objeto', categoria: 'Apuntes', autorId: 'u3',
        descripcion: 'Dos tomos encuadernados con esquemas dibujados a mano. Muy visuales para primer y segundo curso.',
        pideACambio: 'Clases de dibujo o ilustración para el TFG', estado: 'abierta', creadaEn: haceHoras(41) },
      /* Oferta ya cerrada: sirve para demostrar el acuerdo a dos bandas y la valoración.
         Ana (u1) propuso el acuerdo y Marc (u2, autor) lo confirmó. */
      { id: 'o9', titulo: 'Apuntes de Cálculo I con ejercicios resueltos', tipo: 'objeto', categoria: 'Apuntes', autorId: 'u2',
        descripcion: 'Temario completo, 40 ejercicios resueltos a mano y dos exámenes corregidos. Incluye formulario resumen.',
        pideACambio: 'Clases de Python o un café de la máquina', estado: 'cerrada', creadaEn: haceHoras(80),
        acuerdo: { proponente: 'u1', confirmadoPor: ['u1', 'u2'], fecha: haceHoras(20) } }
    ];

    /* toda oferta necesita el campo acuerdo, aunque esté vacío */
    return base.map(function (o) {
      if (!o.acuerdo) o.acuerdo = { proponente: null, confirmadoPor: [], fecha: null };
      return o;
    });
  }

  /* ------------------------------------------------------------- valoraciones
     id, ofertaId, deUsuarioId, aUsuarioId, estrellas (1-5), comentario, creadaEn
     Puntos: estrellas >= 4 suma +1 | estrellas <= 2 resta -1 | 3 no cuenta.
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
        categoria: datos.categoria || 'Favores', autorId: estado().yo,
        pideACambio: datos.pideACambio || '', estado: 'abierta',
        creadaEn: new Date().toISOString(), destacada: false
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
      ['nombre', 'carrera', 'curso', 'area', 'bio', 'instagram', 'whatsapp'].forEach(function (k) {
        if (datos[k] !== undefined && datos[k] !== '') u[k] = datos[k];
      });
      if (datos.habilidades) u.habilidades = datos.habilidades;
      persistir();
      return u;
    },

    /* --- reputación: +1 por valoración >= 4, -1 por <= 2, 0 si es 3 --- */
    puntosDe: function (uid) {
      return estado().valoraciones.reduce(function (total, v) {
        if (v.aUsuarioId !== uid) return total;
        if (v.estrellas >= 4) return total + 1;
        if (v.estrellas <= 2) return total - 1;
        return total;
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
