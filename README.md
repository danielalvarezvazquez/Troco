# USwap

App móvil de **intercambio de favores y objetos entre estudiantes** de distintas carreras y áreas.

Publicas lo que necesitas, filtras por carrera o área, contactas por WhatsApp/Instagram, cierras el trato y os valoráis. Las valoraciones alimentan un **ranking con recompensas**.

## Arrancar la app

**Windows:** doble clic en `abrir-app.bat` → se abre en `http://localhost:8000`.

**Manual:**

```powershell
py serve.py 8000
```

Y abre <http://localhost:8000>.

También funciona abriendo `index.html` con doble clic, pero el almacenamiento del navegador es menos fiable: usa el servidor para la demo.

## Acceso

La app arranca en la pantalla de acceso. Cuentas de demo (contraseña `demo1234`):

- `ana.ferrer@usc.es`
- `marc.puig@usc.es`

O crea una cuenta nueva: correo, contraseña, fecha de nacimiento (**+16 años**) y un teléfono o Instagram **verificado**. La verificación es simulada: el código se muestra en pantalla porque no hay backend.

## Guía para el equipo

- `AGENTS.md` — contexto del proyecto, reparto de trabajo y reglas. **Léelo antes de tocar nada.**
- `TAREAS/` — pasos concretos de cada persona, con los prompts listos para pegar en la IA.

## Estructura

```
login.html      Iniciar sesión             (P1)
registro.html   Crear cuenta               (P1)
index.html      Tablón con filtros        (P2)
oferta.html     Detalle de la oferta      (P1)
valorar.html    Valoración tras el trato  (P1)
ranking.html    Ranking y recompensas     (P3)
publicar.html   Publicar oferta           (P3)
perfil.html     Perfil público            (P4)
editar-perfil.html  Editar tu perfil      (P4)
css/styles.css  Estilos (solo P1)
js/data.js      Datos + "base de datos"   (solo P1)
js/ui.js        Cabecera, nav, avatares   (solo P1)
```

Sin frameworks, sin `npm`, sin instalación: HTML, CSS y JavaScript, con los datos en `localStorage`.

## Estado

Prototipo de hackathon (octubre 2026). No hay backend: el chat es externo (WhatsApp/Instagram) y los datos viven en el navegador.
