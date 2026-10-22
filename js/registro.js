/* ==========================================================================
   CREAR CUENTA                          Propietario: P1 (Daniel)
   --------------------------------------------------------------------------
   Reglas:
   - Email obligatorio y único.
   - Contraseña obligatoria (mínimo 8 caracteres).
   - Fecha de nacimiento obligatoria y edad >= 16.
   - Al menos un contacto (teléfono o Instagram) VERIFICADO.
   La verificación es simulada: el código se muestra en pantalla porque no
   hay backend. En producción se enviaría por SMS/email.
   ========================================================================== */
(function () {
  'use strict';

  var UI = window.USWAP_UI;

  /* con sesión abierta no tiene sentido registrarse */
  if (USWAP.sesion()) { window.location.replace('index.html'); return; }

  var campos = {
    nombre: document.getElementById('nombre'),
    email: document.getElementById('email'),
    password: document.getElementById('password'),
    nacimiento: document.getElementById('nacimiento'),
    carrera: document.getElementById('carrera'),
    rama: document.getElementById('rama'),
    curso: document.getElementById('curso')
  };

  campos.rama.innerHTML = USWAP.RAMAS.map(function (r) {
    return '<option value="' + UI.esc(r) + '">' + UI.esc(r) + '</option>';
  }).join('');
  campos.curso.innerHTML = USWAP.CURSOS.map(function (c) {
    return '<option value="' + UI.esc(c) + '">' + UI.esc(c) + '</option>';
  }).join('');

  /* ------------------------------------------------------------ contacto */
  function digitos(valor) { return String(valor || '').replace(/\D/g, ''); }

  var CONTACTOS = {
    tel: {
      input: document.getElementById('whatsapp'),
      boton: document.getElementById('btn-codigo-tel'),
      aviso: document.getElementById('aviso-tel'),
      caja: document.getElementById('verif-tel'),
      codigo: document.getElementById('codigo-tel'),
      verificar: document.getElementById('btn-verif-tel'),
      estado: document.getElementById('estado-tel'),
      valido: function (valor) { var d = digitos(valor); return d.length >= 9 && d.length <= 15; },
      ayuda: 'El teléfono debe tener entre 9 y 15 dígitos'
    },
    ig: {
      input: document.getElementById('instagram'),
      boton: document.getElementById('btn-codigo-ig'),
      aviso: document.getElementById('aviso-ig'),
      caja: document.getElementById('verif-ig'),
      codigo: document.getElementById('codigo-ig'),
      verificar: document.getElementById('btn-verif-ig'),
      estado: document.getElementById('estado-ig'),
      valido: function (valor) {
        return /^[A-Za-z0-9._]{2,30}$/.test(String(valor || '').trim().replace(/^@+/, ''));
      },
      ayuda: 'El Instagram debe tener 2-30 caracteres: letras, números, puntos o guiones bajos'
    }
  };

  var estado = {
    tel: { codigo: null, verificado: false },
    ig: { codigo: null, verificado: false }
  };

  function limpiar(tipo) {
    estado[tipo].codigo = null;
    estado[tipo].verificado = false;
    CONTACTOS[tipo].aviso.innerHTML = '';
    CONTACTOS[tipo].caja.hidden = true;
    CONTACTOS[tipo].codigo.value = '';
    CONTACTOS[tipo].estado.innerHTML = '';
    CONTACTOS[tipo].input.disabled = false;
    CONTACTOS[tipo].boton.disabled = false;
    CONTACTOS[tipo].boton.textContent = 'Enviar código';
  }

  function enviarCodigo(tipo) {
    var c = CONTACTOS[tipo];
    if (!c.valido(c.input.value)) {
      UI.toast(c.ayuda);
      c.input.focus();
      return;
    }
    limpiar(tipo);
    estado[tipo].codigo = String(Math.floor(1000 + Math.random() * 9000));
    c.aviso.innerHTML = 'Código de demostración: <code>' + estado[tipo].codigo + '</code>';
    c.caja.hidden = false;
    c.boton.textContent = 'Reenviar código';
    c.codigo.focus();
  }

  function verificar(tipo) {
    var c = CONTACTOS[tipo];
    if (!estado[tipo].codigo) { UI.toast('Pulsa primero en "Enviar código"'); return; }
    if (String(c.codigo.value).trim() !== estado[tipo].codigo) {
      UI.toast('Código incorrecto');
      c.codigo.select();
      return;
    }
    estado[tipo].verificado = true;
    c.caja.hidden = true;
    c.aviso.innerHTML = '';
    c.input.disabled = true;
    c.boton.disabled = true;
    c.estado.innerHTML = '<span class="verificado">✓ Verificado</span>';
    UI.toast('Contacto verificado');
  }

  Object.keys(CONTACTOS).forEach(function (tipo) {
    var c = CONTACTOS[tipo];
    c.boton.addEventListener('click', function () { enviarCodigo(tipo); });
    c.verificar.addEventListener('click', function () { verificar(tipo); });
    c.input.addEventListener('input', function () {
      if (estado[tipo].verificado) limpiar(tipo);
      else if (estado[tipo].codigo) { estado[tipo].codigo = null; c.caja.hidden = true; c.aviso.innerHTML = ''; }
    });
  });

  /* -------------------------------------------------------------- validar */
  function emailValido(valor) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(valor || '').trim());
  }

  document.getElementById('form-registro').addEventListener('submit', function (e) {
    e.preventDefault();

    if (campos.nombre.value.trim().length < 2) {
      UI.toast('Escribe tu nombre'); campos.nombre.focus(); return;
    }
    if (!emailValido(campos.email.value)) {
      UI.toast('El correo no es válido'); campos.email.focus(); return;
    }
    if (USWAP.emailOcupado(campos.email.value)) {
      UI.toast('Ya existe una cuenta con ese correo'); campos.email.focus(); return;
    }
    if (campos.password.value.length < 8) {
      UI.toast('La contraseña debe tener al menos 8 caracteres'); campos.password.focus(); return;
    }
    if (!campos.nacimiento.value) {
      UI.toast('Indica tu fecha de nacimiento'); campos.nacimiento.focus(); return;
    }
    var edad = USWAP.edad(campos.nacimiento.value);
    if (edad < 16) {
      UI.toast('Debes tener al menos 16 años'); campos.nacimiento.focus(); return;
    }
    if (!estado.tel.verificado && !estado.ig.verificado) {
      UI.toast('Verifica al menos un contacto: teléfono o Instagram');
      return;
    }
    if (!campos.carrera.value.trim()) {
      UI.toast('Escribe tu carrera o programa'); campos.carrera.focus(); return;
    }

    var resultado = USWAP.registrar({
      nombre: campos.nombre.value.trim(),
      email: campos.email.value,
      password: campos.password.value,
      nacimiento: campos.nacimiento.value,
      carrera: campos.carrera.value.trim(),
      rama: campos.rama.value,
      curso: campos.curso.value,
      whatsapp: estado.tel.verificado ? digitos(CONTACTOS.tel.input.value) : '',
      instagram: estado.ig.verificado ? CONTACTOS.ig.input.value.trim().replace(/^@+/, '') : '',
      telVerificado: estado.tel.verificado,
      igVerificado: estado.ig.verificado
    });

    if (resultado.error === 'email') { UI.toast('Ya existe una cuenta con ese correo'); return; }
    if (resultado.error === 'edad') { UI.toast('Debes tener al menos 16 años'); return; }
    if (resultado.error === 'contacto') { UI.toast('Verifica al menos un contacto'); return; }

    UI.toast('Cuenta creada. ¡Bienvenido a Troco!');
    setTimeout(function () { window.location.href = 'index.html'; }, 800);
  });
})();
