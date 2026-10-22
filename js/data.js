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

  var VERSION = 9;                 // subir si cambia la forma de los datos
  var KEY = 'uswap.v1';            // clave de localStorage

  var AREAS = ['Tecnología', 'Ciencias', 'Salud', 'Diseño', 'Humanidades', 'Economía'];
  var CURSOS = [1, 2, 3, 4, 5, 6];
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
    { id: 'u3', nombre: 'Lucía Romero', carrera: 'Medicina', curso: 6, area: 'Salud',
      habilidades: ['Anatomía', 'Primeros auxilios', 'Dibujo'], bio: 'Sexto curso de Medicina. Mis apuntes llevan dibujos a mano.',
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
    { id: 'u7', nombre: 'Tomás Vidal', carrera: 'Paisaje', curso: 3, area: 'Diseño',
      habilidades: ['AutoCAD', 'Maquetas', 'Fotografía'], bio: 'Tercero de Paisaje, en el campus de Lugo. Maquetas y planos a cambio de ayuda con estructuras.',
      color: '#ef4444', instagram: 'tomas.vidal', whatsapp: '34600777888' },
    { id: 'u8', nombre: 'Elena Sanz', carrera: 'Biología', curso: 1, area: 'Ciencias',
      habilidades: ['Laboratorio', 'Francés', 'Cocina'], bio: 'Primero de Biología. Llevo tupper vegano los martes.',
      color: '#14b8a6', instagram: 'elena.sanz', whatsapp: '34600888999' },
    { id: 'u9', nombre: 'Nerea Ibáñez', carrera: 'Derecho', curso: 5, area: 'Humanidades',
      habilidades: ['Contabilidad', 'Derecho mercantil', 'Excel'], bio: 'Quinto de Derecho. Resumo temarios y preparo casos prácticos.',
      color: '#0284c7', instagram: 'nerea.ibanez', whatsapp: '34600999000' },
    { id: 'u10', nombre: 'Pau Ferrán', carrera: 'Doble Grado en Ingeniería Informática y Matemáticas', curso: 5, area: 'Tecnología',
      habilidades: ['Python', 'Álgebra', 'Cálculo'], bio: 'Quinto del doble grado. Doy repaso de mates a gente de primero.',
      color: '#7c3aed', instagram: 'pau.ferran', whatsapp: '34600123123' },
    { id: 'u11', nombre: 'Iván Prats', carrera: 'Doble Grado en Matemáticas y Física', curso: 4, area: 'Ciencias',
      habilidades: ['Física', 'Python', 'Análisis de datos'], bio: 'Cuarto del doble grado. Laboratorio, simulaciones y prácticas.',
      color: '#0d9488', instagram: 'ivan.prats', whatsapp: '34600777444' },
    { id: 'u12', nombre: 'Uxía Nogueira', carrera: 'Farmacia', curso: 4, area: 'Salud',
      habilidades: ['Química orgánica', 'Formulación', 'Excel'], bio: 'Cuarto de Farmacia. Resúmenes de formulación magistral en tablas.',
      color: '#c026d3', instagram: 'uxia.nogueira', whatsapp: '34600333555' },
    { id: 'u13', nombre: 'Brais Lema', carrera: 'Veterinaria', curso: 3, area: 'Salud',
      habilidades: ['Anatomía animal', 'Cirugía', 'Gallego'], bio: 'Tercero de Veterinaria en Lugo. Cuido animales y presto apuntes con dibujos.',
      color: '#16a34a', instagram: 'brais.lema', whatsapp: '34600111223' },
    { id: 'u14', nombre: 'Sabela Ríos', carrera: 'Criminología', curso: 2, area: 'Humanidades',
      habilidades: ['Derecho penal', 'Estadística', 'Oratoria'], bio: 'Segundo de Criminología. Preparo defensas orales y análisis de datos.',
      color: '#64748b', instagram: 'sabela.rios', whatsapp: '34600444556' }
  ];

  /* ----------------------------------------------------------------- ofertas
     id, titulo, descripcion, tipo ('objeto'|'favor'), categoria, autorId,
     estado ('abierta'|'cerrada'), creadaEn (ISO), destacada

     Modelo: cada publicación es una PETICIÓN. titulo y descripcion dicen lo que
     el autor NECESITA; quien responde propone qué quiere a cambio.
  */
  function haceHoras(h) { return new Date(Date.now() - h * 3600 * 1000).toISOString(); }

  function ofertasBase() {
    return [
      { id: 'o1', titulo: 'Clases de Python aplicadas a Estadística II', tipo: 'favor', categoria: 'Clases', autorId: 'u2',
        descripcion: 'Quiero aprender a resolver los problemas de la asignatura con Python: listas, bucles y gráficos. Nivel cero.',
        estado: 'abierta', creadaEn: haceHoras(2), destacada: true },
      { id: 'o2', titulo: 'Apuntes de Estadística para el parcial', tipo: 'objeto', categoria: 'Apuntes', autorId: 'u1',
        descripcion: 'Voy justa y no tengo apuntes ordenados. Me valen los de cualquier año; si además me lo explicas una tarde, mejor.',
        estado: 'abierta', creadaEn: haceHoras(5), destacada: true },
      { id: 'o3', titulo: 'Ayuda con una hoja de Excel para Contabilidad', tipo: 'favor', categoria: 'Clases', autorId: 'u4',
        descripcion: 'Tengo que entregar un modelo de costes y me lío con las fórmulas y las tablas dinámicas.',
        estado: 'abierta', creadaEn: haceHoras(9) },
      { id: 'o4', titulo: 'Ilustración para la portada de mi TFG', tipo: 'favor', categoria: 'Creatividad', autorId: 'u6',
        descripcion: 'Trabajo sobre derecho laboral y quiero una portada ilustrada. Dos rondas de cambios.',
        estado: 'abierta', creadaEn: haceHoras(14) },
      { id: 'o5', titulo: 'Corrección de inglés para la memoria del TFG', tipo: 'favor', categoria: 'Idiomas', autorId: 'u5',
        descripcion: 'Tengo la memoria en inglés y se me escapan giros. Necesito revisión y comentarios.',
        estado: 'abierta', creadaEn: haceHoras(20) },
      { id: 'o6', titulo: 'Apuntes de primero de Biología', tipo: 'objeto', categoria: 'Apuntes', autorId: 'u8',
        descripcion: 'Me incorporé tarde y me faltan los apuntes de Bioquímica y de Genética.',
        estado: 'abierta', creadaEn: haceHoras(28) },
      { id: 'o7', titulo: 'Apuntes de Anatomía para un proyecto de datos', tipo: 'objeto', categoria: 'Apuntes', autorId: 'u1',
        descripcion: 'Estoy montando una visualización sobre salud y necesito material de referencia con esquemas.',
        estado: 'abierta', creadaEn: haceHoras(33) },
      { id: 'o8', titulo: 'Clases de dibujo para láminas anatómicas', tipo: 'favor', categoria: 'Clases', autorId: 'u3',
        descripcion: 'Estoy en sexto de Medicina y quiero ilustrar mejor mis láminas. También me vendría bien una mano con la portada del TFG.',
        estado: 'abierta', creadaEn: haceHoras(41) },
      { id: 'o9', titulo: 'Apuntes de Estadística para el TFG', tipo: 'objeto', categoria: 'Apuntes', autorId: 'u10',
        descripcion: 'Me falta toda la parte de estadística aplicada del trabajo de fin de grado.',
        estado: 'abierta', creadaEn: haceHoras(7) },
      { id: 'o10', titulo: 'Clases de Excel para las prácticas', tipo: 'favor', categoria: 'Clases', autorId: 'u9',
        descripcion: 'Entro de prácticas en un despacho y necesito soltura con hojas de cálculo y tablas dinámicas.',
        estado: 'abierta', creadaEn: haceHoras(12) },
      { id: 'o11', titulo: 'Repaso de óptica antes del parcial', tipo: 'favor', categoria: 'Clases', autorId: 'u11',
        descripcion: 'Voy justo con la parte de óptica y me vendría bien una hora de repaso con alguien que la lleve bien.',
        estado: 'abierta', creadaEn: haceHoras(16) },
      { id: 'o12', titulo: 'Repaso de Química Orgánica', tipo: 'favor', categoria: 'Clases', autorId: 'u12',
        descripcion: 'Me lío con los mecanismos de reacción y necesito repaso antes del parcial.',
        estado: 'abierta', creadaEn: haceHoras(22) },
      { id: 'o13', titulo: 'Apuntes de Anatomía Animal', tipo: 'objeto', categoria: 'Apuntes', autorId: 'u13',
        descripcion: 'Me faltan los del segundo parcial y entre semana no estoy en Santiago.',
        estado: 'abierta', creadaEn: haceHoras(30) },
      { id: 'o14', titulo: 'Apuntes de Derecho Penal para el trabajo de fin de curso', tipo: 'objeto', categoria: 'Apuntes', autorId: 'u14',
        descripcion: 'Necesito el temario y una tabla de datos para el análisis.',
        estado: 'abierta', creadaEn: haceHoras(36) },
      { id: 'o15', titulo: 'Ayuda con estructuras para la entrega de Paisaje', tipo: 'favor', categoria: 'Clases', autorId: 'u7',
        descripcion: 'Tenemos una entrega con cálculo de estructuras y estadística y voy perdido.',
        estado: 'abierta', creadaEn: haceHoras(26) }
    ];
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
      u8: [5, 3, 4],
      u9: [4, 5],
      u10: [5, 5, 4],
      u13: [4, 3]
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
        estado: 'abierta',
        creadaEn: new Date().toISOString(), destacada: false
      };
      estado().ofertas.unshift(o);
      persistir();
      return o;
    },
    addValoracion: function (datos) {
      var v = {
        id: id('v'), ofertaId: datos.ofertaId || 'manual', deUsuarioId: estado().yo,
        aUsuarioId: datos.aUsuarioId, estrellas: datos.estrellas,
        comentario: datos.comentario || '', creadaEn: new Date().toISOString()
      };
      estado().valoraciones.unshift(v);
      persistir();
      return v;
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
