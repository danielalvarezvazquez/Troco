/* ==========================================================================
   Troco — CONTRATO DE DATOS            Propietario: P1 (Daniel)
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

  var VERSION = 13;                // subir si cambia la forma de los datos
  var KEY = 'uswap.v1';            // clave de localStorage

  /* Puntos por reseña según las estrellas.
     ★1 = −20 · ★2 = 0 · ★3 = +20 · ★4 = +40 · ★5 = +80 */
  var PUNTOS_ESTRELLA = { 1: -20, 2: 0, 3: 20, 4: 40, 5: 80 };

  function puntosPorEstrellas(n) { return PUNTOS_ESTRELLA[Number(n)] || 0; }

  /* Hash djb2: suficiente para una demo sin backend (NO es seguridad real) */
  function hashPass(texto) {
    var h = 5381, s = String(texto || '');
    for (var i = 0; i < s.length; i++) h = (((h << 5) + h) ^ s.charCodeAt(i)) >>> 0;
    return h.toString(16);
  }

  /* Área = de qué va la PETICIÓN (vive en la oferta, no en la persona) */
  var AREAS = ['Tecnología', 'Matemáticas', 'Ciencias', 'Salud', 'Ciencias jurídicas',
               'Lenguaje', 'Habilidades', 'Ciencias sociales', 'Otros'];

  /* Rama = gran bloque de estudios (vive en la persona) */
  var RAMAS = ['Artes y Humanidades', 'Ciencias', 'Ciencias de la Salud',
               'Ciencias Sociales y Jurídicas', 'Ingeniería y Arquitectura'];

  /* Curso: 1º a 6º de grado + posgrados. Se guarda como texto. */
  var CURSOS = ['1º', '2º', '3º', '4º', '5º', '6º', 'Máster', 'Doctorado'];

  /* Categoría = qué se intercambia. Sin separar favores/objetos/clases. */
  var CATEGORIAS = ['Favores', 'Enseñanza', 'Apuntes', 'Objetos', 'Otros'];

  /* Carreras y grados que se imparten en la USC (campus de Santiago, Lugo y
     Pontevedra), más los posgrados que usan los perfiles de la demo. Se usa
     para el filtro del tablón y para elegir tu carrera al publicar. */
  var CARRERAS = [
    'Administración y Dirección de Empresas',
    'Bellas Artes',
    'Biología',
    'Bioquímica',
    'Biotecnología',
    'Ciencia Política y de la Administración',
    'Ciencias de la Cultura y Difusión Cultural',
    'Comunicación Audiovisual',
    'Criminología',
    'Derecho',
    'Dirección y Gestión Pública',
    'Economía',
    'Educación Social',
    'Empresa y Tecnología',
    'Enfermería',
    'Farmacia',
    'Filosofía',
    'Física',
    'Fisioterapia',
    'Geografía y Ordenación del Territorio',
    'Gestión Cultural',
    'Historia',
    'Historia del Arte',
    'Ingeniería Agrícola y Agroalimentaria',
    'Ingeniería Civil',
    'Ingeniería de Procesos Químicos Industriales',
    'Ingeniería Forestal y del Medio Natural',
    'Ingeniería Informática',
    'Ingeniería Química',
    'Inteligencia Artificial',
    'Lengua y Literatura Españolas',
    'Lengua y Literatura Gallegas',
    'Lengua y Literatura Inglesas',
    'Lenguas y Literaturas Modernas',
    'Magisterio en Educación Infantil',
    'Magisterio en Educación Primaria',
    'Matemáticas',
    'Medicina',
    'Nutrición Humana y Dietética',
    'Odontología',
    'Óptica y Optometría',
    'Paisaje',
    'Pedagogía',
    'Periodismo',
    'Psicología',
    'Química',
    'Relaciones Laborales y Recursos Humanos',
    'Robótica',
    'Trabajo Social',
    'Veterinaria',
    'Doble Grado en Comunicación Audiovisual y Periodismo',
    'Doble Grado en Educación Infantil y Primaria',
    'Doble Grado en Farmacia y Óptica y Optometría',
    'Doble Grado en Ingeniería Agrícola y Forestal',
    'Doble Grado en Ingeniería Informática y Matemáticas',
    'Doble Grado en Matemáticas y Física',
    'Doble Grado en Química y Biología',
    'Doble Grado en Química y Física',
    /* posgrados que aparecen en los perfiles de ejemplo */
    'Máster en Ciencia de Datos',
    'Doctorado en Física'
  ];

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
    { id: 'u4', nombre: 'Javier Barcala', carrera: 'Administración y Dirección de Empresas', rama: 'Ciencias Sociales y Jurídicas', curso: '3º',
      habilidades: ['Excel', 'Contabilidad', 'Inglés'], bio: 'Tengo coche y bajo a la estación de Santiago todos los viernes.',
      color: '#f59e0b', instagram: 'javier.barcala', whatsapp: '34600444555' },
    { id: 'u5', nombre: 'Sergio León', carrera: 'Bellas Artes', rama: 'Artes y Humanidades', curso: '2º',
      habilidades: ['Ilustración', 'Dibujo', 'Pintura', 'Escultura', 'Serigrafía', 'Fotografía', 'Photoshop', 'Maquetas', 'Dibujo técnico', 'Edición de vídeo'],
      bio: 'Ilustración editorial y carteles para TFGs. Campus de Pontevedra.',
      avisoBaneo: 'Tres tratos seguidos sin responder y dos valoraciones negativas. Si vuelve a pasar, la cuenta se bloquea.',
      color: '#10b981', instagram: 'sergio.leon', whatsapp: '34600555666' },
    { id: 'u6', nombre: 'Núria Costa', carrera: 'Derecho', rama: 'Ciencias Sociales y Jurídicas', curso: '5º',
      habilidades: ['Redacción', 'Debate', 'Inglés C1'], bio: 'Corrijo textos académicos y preparo defensas orales en la Facultad de Derecho.',
      color: '#8b5cf6', instagram: 'nuria.costa', whatsapp: '34600666777' },
    { id: 'u7', nombre: 'Tomás Vidal', carrera: 'Paisaje', rama: 'Ingeniería y Arquitectura', curso: '3º',
      habilidades: ['AutoCAD', 'Maquetas', 'Fotografía'], bio: 'Tercero de Paisaje en el campus de Lugo. Maquetas y planos para entregas de fin de grado.',
      color: '#ef4444', instagram: 'tomas.vidal', whatsapp: '34600777888' },
    { id: 'u8', nombre: 'Elena Sanz', carrera: 'Biología', rama: 'Ciencias', curso: '1º',
      habilidades: ['Laboratorio', 'Francés', 'Cocina'], bio: 'Primero de Biología. Llevo tupper vegano los martes a la ETSE.',
      color: '#14b8a6', instagram: 'elena.sanz', whatsapp: '34600888999' },
    { id: 'u9', nombre: 'Irene Bosch', carrera: 'Máster en Ciencia de Datos', rama: 'Ingeniería y Arquitectura', curso: 'Máster',
      habilidades: ['R', 'Visualización de datos', 'SQL'], bio: 'Máster de Ciencia de Datos. Busco encuestas para el TFM.',
      color: '#0f766e', instagram: 'irene.bosch', whatsapp: '34600999000' },
    { id: 'u10', nombre: 'Pau Mir', carrera: 'Doctorado en Física', rama: 'Ciencias', curso: 'Doctorado',
      habilidades: ['Física', 'Python', 'Divulgación'], bio: 'Investigando en física de materiales y dando prácticas en la Facultad de Física.',
      color: '#7c3aed', instagram: 'pau.mir', whatsapp: '34600123123' },
    { id: 'u11', nombre: 'Pau Ferrán', carrera: 'Doble Grado en Ingeniería Informática y Matemáticas', rama: 'Ingeniería y Arquitectura', curso: '5º',
      habilidades: ['Python', 'Álgebra', 'Cálculo'], bio: 'Quinto del doble grado. Repaso de mates para gente de primero.',
      color: '#2563eb', instagram: 'pau.ferran', whatsapp: '34600112233' },
    { id: 'u12', nombre: 'Uxía Nogueira', carrera: 'Farmacia', rama: 'Ciencias de la Salud', curso: '4º',
      habilidades: ['Química orgánica', 'Formulación', 'Excel'], bio: 'Cuarto de Farmacia. Resúmenes de formulación magistral en tablas.',
      color: '#c026d3', instagram: 'uxia.nogueira', whatsapp: '34600333455' },
    { id: 'u13', nombre: 'Brais Lema', carrera: 'Veterinaria', rama: 'Ciencias de la Salud', curso: '3º',
      habilidades: ['Anatomía animal', 'Cirugía', 'Gallego'], bio: 'Tercero de Veterinaria en el campus de Lugo. Cuido animales y presto apuntes con dibujos.',
      color: '#16a34a', instagram: 'brais.lema', whatsapp: '34600555677' },
    { id: 'u14', nombre: 'Sabela Ríos', carrera: 'Criminología', rama: 'Ciencias Sociales y Jurídicas', curso: '2º',
      habilidades: ['Derecho penal', 'Estadística', 'Oratoria'], bio: 'Segundo de Criminología. Defensas orales y análisis de datos.',
      color: '#64748b', instagram: 'sabela.rios', whatsapp: '34600777899' }
  ];

  /* ------------------------------------------------------- datos de acceso
     Demo sin backend: email único, fecha de nacimiento y contraseña hasheada.
     Todos los usuarios de ejemplo usan la contraseña "demo1234".
  */
  var ACCESO = {
    u1: ['ana.ferrer@usc.es', '2003-05-14'],
    u2: ['marc.puig@usc.es', '2004-11-02'],
    u3: ['lucia.romero@usc.es', '2001-03-27'],
    u4: ['javier.barcala@usc.es', '2003-09-09'],
    u5: ['sergio.leon@usc.es', '2005-01-30'],
    u6: ['nuria.costa@usc.es', '2000-07-19'],
    u7: ['tomas.vidal@usc.es', '2002-12-05'],
    u8: ['elena.sanz@usc.es', '2007-04-16'],
    u9: ['irene.bosch@usc.es', '1999-06-21'],
    u10: ['pau.mir@usc.es', '1996-02-08'],
    u11: ['pau.ferran@usc.es', '2002-04-11'],
    u12: ['uxia.nogueira@usc.es', '2002-08-23'],
    u13: ['brais.lema@usc.es', '2004-02-17'],
    u14: ['sabela.rios@usc.es', '2005-06-30']
  };

  USUARIOS.forEach(function (u) {
    var acceso = ACCESO[u.id] || [u.id + '@usc.es', '2000-01-01'];
    u.email = acceso[0];
    u.nacimiento = acceso[1];
    u.passwordHash = hashPass('demo1234');
    u.telVerificado = !!u.whatsapp;
    u.igVerificado = !!u.instagram;
    u.creadoEn = new Date().toISOString();
  });

  /* ----------------------------------------------------------------- ofertas
     id, titulo, descripcion, categoria, area (de la petición),
     autorId, estado ('abierta'|'acordada'|'cerrada'), creadaEn (ISO), destacada
     acuerdo: { proponente, confirmadoPor:[uids], fecha }
       - abierta   → nadie ha propuesto cerrar
       - acordada  → una parte ha propuesto/confirmado; falta la otra
       - cerrada   → las dos partes han confirmado; se puede valorar
  */
  function haceHoras(h) { return new Date(Date.now() - h * 3600 * 1000).toISOString(); }

  function ofertasBase() {
    var base = [
      { id: 'o1', titulo: 'Apuntes completos de Estadística II', categoria: 'Apuntes', area: 'Matemáticas', autorId: 'u2',
        descripcion: 'Busco el temario entero, problemas resueltos y los exámenes de otros años con soluciones. Me vale PDF o fotocopia en la Biblioteca Concepción Arenal.',
        estado: 'abierta', creadaEn: haceHoras(2), destacada: true },
      { id: 'o2', titulo: 'Clases de Python para principiantes', categoria: 'Enseñanza', area: 'Tecnología', autorId: 'u1',
        descripcion: 'Busco dos sesiones de una hora: variables, listas, bucles y funciones. Nivel cero, quedamos en la ETSE y llevo mi portátil.',
        estado: 'abierta', creadaEn: haceHoras(5), destacada: true },
      { id: 'o3', titulo: 'Compartir coche a la estación los viernes', categoria: 'Otros', area: 'Otros', autorId: 'u4',
        descripcion: 'Salgo a las 18:30 del parking de la ETSE hacia la estación de tren de Santiago y busco quien comparta coche.',
        estado: 'abierta', creadaEn: haceHoras(9) },
      { id: 'o4', titulo: 'Corrección de textos en inglés (nivel C1)', categoria: 'Enseñanza', area: 'Lenguaje', autorId: 'u6',
        descripcion: 'Busco revisión de mi TFG, abstract o carta de motivación, con comentarios y versión limpia en 48 h.',
        estado: 'abierta', creadaEn: haceHoras(14) },
      { id: 'o5', titulo: 'Ilustración para mi TFG', categoria: 'Favores', area: 'Habilidades', autorId: 'u5',
        descripcion: 'Busco portada ilustrada o infografía a mano digital, con dos rondas de cambios.',
        estado: 'abierta', creadaEn: haceHoras(20) },
      { id: 'o6', titulo: 'Tupper casero los martes', categoria: 'Favores', area: 'Otros', autorId: 'u8',
        descripcion: 'Busco menú semanal: lentejas, curry de garbanzos o pasta de verduras, que me lo lleven a la ETSE (Campus Vida).',
        estado: 'abierta', creadaEn: haceHoras(28) },
      { id: 'o8', titulo: 'Apuntes de Anatomía con dibujos a mano', categoria: 'Apuntes', area: 'Salud', autorId: 'u3',
        descripcion: 'Busco dos tomos encuadernados con esquemas dibujados a mano, para primero y segundo de Medicina.',
        estado: 'abierta', creadaEn: haceHoras(41) },
      /* Petición ya cerrada: sirve para demostrar el acuerdo a dos bandas y la valoración.
         Ana (u1) propuso el acuerdo y Marc (u2, autor) lo confirmó. */
      { id: 'o9', titulo: 'Apuntes de Cálculo I con ejercicios resueltos', categoria: 'Apuntes', area: 'Matemáticas', autorId: 'u2',
        descripcion: 'Busco temario completo, 40 ejercicios resueltos a mano y dos exámenes corregidos, con formulario resumen.',
        estado: 'cerrada', creadaEn: haceHoras(80),
        acuerdo: { proponente: 'u1', confirmadoPor: ['u1', 'u2'], fecha: haceHoras(20) } },
      { id: 'o10', titulo: 'Repaso de Derecho Civil para el examen', categoria: 'Enseñanza', area: 'Ciencias jurídicas', autorId: 'u6',
        descripcion: 'Busco dos sesiones de obligaciones y contratos, con casos prácticos y esquemas de respuesta.',
        estado: 'abierta', creadaEn: haceHoras(12) },
      { id: 'o11', titulo: '40 respuestas para mi encuesta del TFM', categoria: 'Favores', area: 'Ciencias sociales', autorId: 'u9',
        descripcion: 'Encuesta anónima de 5 minutos sobre hábitos de consumo en el campus. Comparto los resultados con quien la haga.',
        estado: 'abierta', creadaEn: haceHoras(7), destacada: true },
      { id: 'o12', titulo: 'Ayuda con las prácticas de laboratorio de Física', categoria: 'Enseñanza', area: 'Ciencias', autorId: 'u10',
        descripcion: 'Busco que me preparen el guion de prácticas y me ayuden con la toma de datos y el tratamiento de errores.',
        estado: 'abierta', creadaEn: haceHoras(30) },
      { id: 'o13', titulo: 'Cartel ilustrado para el concierto de Bellas Artes', categoria: 'Favores', area: 'Habilidades', autorId: 'u5',
        descripcion: 'Busco cartel y stories para el concierto del campus, con dos rondas de cambios.',
        estado: 'cerrada', creadaEn: haceHoras(60),
        acuerdo: { proponente: 'u5', confirmadoPor: ['u5', 'u6'], fecha: haceHoras(36) } },
      { id: 'o14', titulo: 'Serigrafía de camisetas para la tuna', categoria: 'Favores', area: 'Habilidades', autorId: 'u5',
        descripcion: 'Busco diseño y estampado de 20 camisetas con el escudo del grupo.',
        estado: 'cerrada', creadaEn: haceHoras(96),
        acuerdo: { proponente: 'u7', confirmadoPor: ['u5', 'u7'], fecha: haceHoras(70) } },
      { id: 'o15', titulo: 'Calculadora científica Casio FX-991', categoria: 'Objetos', area: 'Matemáticas', autorId: 'u7',
        descripcion: 'Busco una para estructuras; me vale usada si funciona bien y tiene tapa.',
        estado: 'abierta', creadaEn: haceHoras(18) },
      { id: 'o16', titulo: 'Repaso de Cálculo antes del parcial', categoria: 'Enseñanza', area: 'Matemáticas', autorId: 'u11',
        descripcion: 'Estoy en el doble grado y voy justo con límites, derivadas e integrales. Busco dos tardes de repaso.',
        estado: 'abierta', creadaEn: haceHoras(11) },
      { id: 'o17', titulo: 'Repaso de Química Orgánica', categoria: 'Enseñanza', area: 'Ciencias', autorId: 'u12',
        descripcion: 'Me lío con los mecanismos de reacción y necesito repaso antes del parcial de Farmacia.',
        estado: 'abierta', creadaEn: haceHoras(19) },
      { id: 'o18', titulo: 'Apuntes de Anatomía Animal', categoria: 'Apuntes', area: 'Salud', autorId: 'u13',
        descripcion: 'Me faltan los del segundo parcial de Veterinaria y entre semana no estoy en Santiago.',
        estado: 'abierta', creadaEn: haceHoras(24) },
      { id: 'o19', titulo: 'Apuntes de Derecho Penal', categoria: 'Apuntes', area: 'Ciencias jurídicas', autorId: 'u14',
        descripcion: 'Para el trabajo de fin de curso de Criminología, con el temario y una tabla de datos para el análisis.',
        estado: 'abierta', creadaEn: haceHoras(38) }
    ];

    /* toda oferta necesita el campo acuerdo, aunque esté vacío */
    return base.map(function (o) {
      if (!o.acuerdo) o.acuerdo = { proponente: null, confirmadoPor: [], fecha: null };
      return o;
    });
  }

  /* ------------------------------------------------------------- valoraciones
     id, ofertaId, deUsuarioId, aUsuarioId, estrellas (1-5), comentario, creadaEn
     Puntos: ★1 −20 · ★2 0 · ★3 +20 · ★4 +40 · ★5 +80. Sin reseñas, 0 puntos.
  */
  var COMENTARIOS = [
    'Muy puntual y todo clarísimo.',
    'Trato genial, repetiría sin duda.',
    'Cumplió exactamente lo acordado.',
    'Buen material, aunque tardó un poco.',
    'No respondió a los mensajes.',
    'Me ayudó muchísimo con el examen.'
  ];

  /* Reseñas del perfil de referencia (Sergio León): todas de 5 estrellas. */
  var COMENTARIOS_TOP = [
    'El mejor intercambio que he hecho en la USC.',
    'Rápido, claro y muy atento. Repetiré seguro.',
    'Material impecable y entrega puntual.',
    'Me salvó la entrega del TFG.',
    'Trato de diez, súper recomendable.',
    'Explicó todo con muchísima paciencia.'
  ];

  function valoracionesBase() {
    var patron = {
      u1: [5, 5, 4, 5],
      u2: [5, 4, 4, 5, 5],
      u3: [3, 4, 2, 5],
      u4: [4, 4, 5],
      u6: [5, 5, 4, 4, 5, 5],
      u7: [4, 2, 4],
      u8: [5, 3, 4]
    };
    var out = [], n = 0;
    Object.keys(patron).forEach(function (uid) {
      patron[uid].forEach(function (estrellas, i) {
        n += 1;
        var esTop = uid === 'u5';
        out.push({
          id: 'v' + n, ofertaId: 'seed',
          deUsuarioId: esTop ? 'u' + ((n % 4) + 1) : 'u' + ((n % 8) + 1),
          aUsuarioId: uid,
          estrellas: estrellas,
          comentario: esTop
            ? COMENTARIOS_TOP[i % COMENTARIOS_TOP.length]
            : COMENTARIOS[(n + i) % COMENTARIOS.length],
          creadaEn: haceHoras(n * 13)
        });
      });
    });
    return out;
  }

  /* ---------------------------------------------------------------- almacén */
  function copia(o) { return JSON.parse(JSON.stringify(o)); }

  function semilla() {
    return { version: VERSION, yo: 'u1', sesion: null, usuarios: copia(USUARIOS), ofertas: ofertasBase(), valoraciones: valoracionesBase() };
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
    CARRERAS: CARRERAS,

    estado: estado,
    guardar: guardarCambios,

    reset: function () {
      var anterior = (_estado && _estado.sesion) || null;
      _estado = semilla();
      if (anterior && _estado.usuarios.some(function (u) { return u.id === anterior; })) {
        _estado.sesion = anterior;
        _estado.yo = anterior;
      }
      _memoria = _estado;
      try { window.localStorage.setItem(KEY, JSON.stringify(_estado)); } catch (e) {}
      return _estado;
    },

    /* --- usuario actual (modo demo: se puede cambiar desde la cabecera) --- */
    yo: function () { var e = estado(); return e.sesion || e.yo; },
    setYo: function (uid) { var e = estado(); e.yo = uid; e.sesion = uid; persistir(); },

    /* --- sesión (demo sin backend: todo vive en localStorage) --- */
    sesion: function () { return estado().sesion || null; },
    sesionUsuario: function () {
      var id = estado().sesion;
      return id ? window.USWAP.usuario(id) : null;
    },
    salir: function () { estado().sesion = null; persistir(); },
    entrar: function (email, password) {
      var correo = String(email || '').trim().toLowerCase();
      var usuarios = estado().usuarios;
      for (var i = 0; i < usuarios.length; i++) {
        var u = usuarios[i];
        if (String(u.email || '').toLowerCase() === correo && u.passwordHash === hashPass(password)) {
          estado().sesion = u.id;
          estado().yo = u.id;
          persistir();
          return u;
        }
      }
      return null;
    },
    emailOcupado: function (email) {
      var correo = String(email || '').trim().toLowerCase();
      return estado().usuarios.some(function (u) {
        return String(u.email || '').toLowerCase() === correo;
      });
    },
    edad: function (fechaISO) {
      if (!fechaISO) return -1;
      var n = new Date(fechaISO), h = new Date();
      if (isNaN(n.getTime())) return -1;
      var anios = h.getFullYear() - n.getFullYear();
      var meses = h.getMonth() - n.getMonth();
      if (meses < 0 || (meses === 0 && h.getDate() < n.getDate())) anios -= 1;
      return anios;
    },
    registrar: function (datos) {
      var correo = String(datos.email || '').trim().toLowerCase();
      if (!correo) return { error: 'email' };
      if (window.USWAP.emailOcupado(correo)) return { error: 'email' };
      if (window.USWAP.edad(datos.nacimiento) < 16) return { error: 'edad' };
      if (!datos.telVerificado && !datos.igVerificado) return { error: 'contacto' };

      var colores = ['#6366f1', '#0ea5e9', '#ec4899', '#f59e0b', '#10b981', '#8b5cf6', '#ef4444', '#14b8a6'];
      var u = {
        id: id('u'),
        nombre: String(datos.nombre || '').trim(),
        carrera: String(datos.carrera || '').trim(),
        rama: datos.rama || RAMAS[0],
        curso: datos.curso || CURSOS[0],
        habilidades: datos.habilidades || [],
        bio: '',
        color: colores[estado().usuarios.length % colores.length],
        instagram: String(datos.instagram || '').replace(/^@+/, '').trim(),
        whatsapp: String(datos.whatsapp || '').replace(/\D/g, ''),
        email: correo,
        passwordHash: hashPass(datos.password),
        nacimiento: datos.nacimiento,
        telVerificado: !!datos.telVerificado,
        igVerificado: !!datos.igVerificado,
        creadoEn: new Date().toISOString()
      };
      estado().usuarios.push(u);
      estado().sesion = u.id;
      estado().yo = u.id;
      persistir();
      return { usuario: u };
    },

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
        id: id('o'), titulo: datos.titulo, descripcion: datos.descripcion,
        categoria: datos.categoria || 'Favores', area: datos.area || 'Otros', autorId: estado().yo,
        estado: 'abierta',
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

    /* --- reputación: puntos por reseña (★1 −20 · ★2 0 · ★3 +20 · ★4 +40 · ★5 +80)
       Al canjear un descuento se descuentan los puntos gastados, así que el
       perfil, el rango y el ranking bajan en cuanto gastas. --- */
    puntosDe: function (uid) {
      var ganados = estado().valoraciones.reduce(function (total, v) {
        if (v.aUsuarioId !== uid) return total;
        return total + puntosPorEstrellas(v.estrellas);
      }, 0);

      var gastados = (estado().canjes || []).reduce(function (total, c) {
        return c.uid === uid ? total + (c.precio || 0) : total;
      }, 0);

      return ganados - gastados;
    },
    mediaDe: function (uid) {
      var vs = window.USWAP.valoracionesDe(uid);
      if (!vs.length) return 0;
      var suma = vs.reduce(function (a, v) { return a + v.estrellas; }, 0);
      return Math.round((suma / vs.length) * 10) / 10;
    }
  };
})();
