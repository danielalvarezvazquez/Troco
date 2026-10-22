# AGENTS.md

Memoria compartida del proyecto **USwap**. Léela al empezar cada sesión.
Actualízala solo cuando cambie una decisión (stack, archivos, reglas), no por cambios de contenido.

---

## 1. Qué es USwap

App **móvil** (prototipo web) de intercambio de **favores y objetos** entre estudiantes de carreras y áreas distintas.

- **Tablón** con filtros por área, carrera y curso, y buscador.
- **Perfil**: carrera, curso, área, habilidades, reputación y puntos.
- **Publicar**: el estudiante dice qué ofrece y qué pide a cambio.
- **Contacto**: el chat es **externo** (WhatsApp/Instagram). La app solo genera enlaces `wa.me` e `instagram.com`.
- **Cierre**: el trato se cierra a dos bandas. Una parte pulsa "Hemos llegado a un acuerdo" y la otra lo confirma; hasta entonces queda "acuerdo pendiente".
- **Valoración**: solo cuando el trato está cerrado, cada parte valora a la otra **una vez**: ★1-5 + comentario opcional.
- **Perfil**: muestra las valoraciones recibidas con su comentario y la puntuación.
- **Ranking + recompensas**: ★4-5 suma 1 punto, ★3 no puntúa, ★1-2 resta 1 punto. Niveles: En observación → Bronce → Plata → Oro → Élite, cada uno con su recompensa.

Proyecto de hackathon de la ETSE. Quedan ~3 h 30 min y hay que **exponer una demo de 5 minutos**.

---

## 2. Stack decidido (no cambiar sin hablar con P1)

**HTML + CSS + JavaScript puro, multi-página. Sin build, sin `npm`, sin frameworks.**

El motivo: 4 personas sin conocimientos de programación, 3 h 30 min, y cero instalación en 4 portátiles (en esta máquina no hay Node).

Restricciones que esto impone — **los agentes las incumplen por defecto**, así que respétalas:

- ❌ **Nada de `type="module"`, `import`/`export` ni `fetch()`**: la app debe funcionar abriendo `index.html`.
- ❌ **Nada de librerías, CDN ni `npm install`.** Ya hay un CDN de fuente, no añadas más.
- ✅ Los `.js` son scripts clásicos que cuelgan su API de `window` (`USWAP`, `USWAP_UI`, `USWAP_RANK`).
- ✅ Los datos semilla van en `js/data.js`, no en JSON externo (no se puede leer por `fetch`).
- ✅ El estado compartido entre páginas es `localStorage` (clave `uswap.v1`).

---

## 3. Cómo se arranca y se comprueba

```powershell
# En la raíz del repo
py serve.py 8000           # luego abrir http://localhost:8000
# o doble clic en abrir-app.bat
```

- No hay tests ni linter. **La verificación es abrir la app y usarla.**
- Un error de JavaScript deja la página **en blanco o a medias**: la única pista está en la consola del navegador (F12 → Console). Mírala siempre antes de inventar una causa.
- Cada página se prueba con doble clic en el flujo real: tablón → oferta → valorar → ranking.
- Botón **↺** de la cabecera = `USWAP.reset()`: borra lo añadido y vuelve a los datos semilla.
- **Primera vez en un portátil** (clonar, GitHub Desktop, abrir OpenCode): `TAREAS/INSTALACION.md`.

---

## 4. Propiedad de archivos (regla más importante)

**Cada archivo tiene un único dueño. Un agente solo edita los archivos de su persona.**

| Persona | Usuario GitHub | Pantallas | Archivos que puede editar |
|---|---|---|---|
| **P1 · Daniel** (integrador) | `danielalvarezvazquez` | Detalle + valorar | `css/styles.css`, `js/data.js`, `js/ui.js`, `oferta.html`, `js/oferta.js`, `valorar.html`, `js/valorar.js`, `AGENTS.md`, `README.md` |
| **P2 · Javier** | `Javierbarcala` | Tablón | `index.html`, `js/board.js` |
| **P3 · Tomé** | `tome123456` | Ranking + publicar | `ranking.html`, `js/ranking.js`, `publicar.html`, `js/publicar.js` |
| **P4 · Sergio** | `sergiooleeonn` | Perfil | `perfil.html`, `editar-perfil.html`, `js/perfil.js`, `js/editar-perfil.js` |

Si alguien necesita un campo nuevo en los datos, un componente nuevo o un estilo nuevo: **se lo pide a P1**, no lo edita.
`js/ranking.js` lo cargan también `valorar.html` y `perfil.html` (solo lectura de `USWAP_RANK`), así que P3 no debe romper su API.

---

## 5. Contrato de datos

Definido en `js/data.js` (P1). Campos exactos, en español:

```js
usuario  { id, nombre, carrera, curso, area, bio, habilidades[], color, instagram, whatsapp }
oferta   { id, titulo, descripcion, tipo:'favor'|'objeto', categoria, autorId, pideACambio,
           estado:'abierta'|'acordada'|'cerrada', creadaEn, destacada,
           acuerdo:{ proponente, confirmadoPor:[uids], fecha } }
valoración { id, ofertaId, deUsuarioId, aUsuarioId, estrellas:1..5, comentario, creadaEn }
```

**Flujo del trato (no cambiarlo sin hablar con P1):**
`abierta` → alguien pulsa "Hemos llegado a un acuerdo" → `acordada` con esa persona en `confirmadoPor` →
la otra parte confirma → `cerrada` cuando `confirmadoPor` incluye al autor y hay 2 personas distintas.
Solo en `cerrada` se puede valorar, y **una sola vez por persona y trato**.

API disponible (`window.USWAP`): `yo()`, `setYo(id)`, `usuarios()`, `usuario(id)`, `ofertas()`, `oferta(id)`, `ofertasDe(uid)`, `valoracionesDe(uid)`, `addOferta(datos)`, `addValoracion(datos)`, `proponerAcuerdo(oid)`, `confirmarAcuerdo(oid)`, `participantes(oid)`, `otraParteDe(oid)`, `yaValoro(oid, uid)`, `actualizarPerfil(datos)`, `puntosDe(uid)`, `mediaDe(uid)`, `reset()`.

Componentes (`window.USWAP_UI`): `montarNav('inicio'|'publicar'|'ranking'|'perfil')`, `avatar(usuario, clase)`, `estrellas(media)`, `tiempo(fechaIso)`, `param('id')`, `toast(texto)`, `vacio(titulo, texto)`, `esc(texto)`.

**Trampa importante:** si cambias la forma de los datos semilla, sube `VERSION` en `js/data.js`. Si no, los navegadores que ya tienen datos guardados seguirán viendo los antiguos y parecerá que tu cambio no funciona.

---

## 6. Reglas para agentes

1. **Identifica a tu persona** (P1-P4) al empezar, por el nombre de usuario o porque te lo digan. Trabaja solo en su columna de la tabla del punto 4.
2. **Una tarea = una pantalla o un cambio acotado.** No refactorices, no reorganices carpetas, no renombres campos, no cambies el stack.
3. Reutiliza los componentes de `USWAP_UI` y las clases de `styles.css`. Si falta un estilo, pídeselo a P1 en vez de crear CSS nuevo.
4. Todo el texto visible va **en español**, cercano y sin jerga técnica. Es una demo para un jurado.
5. **No inventes datos**: usa `USWAP` como fuente de la verdad.
6. Nada de `alert()`; usa `USWAP_UI.toast()`.
7. Antes de dar algo por terminado: abre la página, usa el flujo completo y mira la consola (F12).
8. Si algo lleva **más de 10 minutos roto**, revertir (`git checkout -- .`) y simplificar. No se negocia con un bug.
9. Los pasos concretos de cada persona están en `TAREAS/P1.md`, `P2.md`, `P3.md`, `P4.md`. Si te piden "¿qué hago ahora?", lee ese archivo.

---

## 7. Git

- Repo: `https://github.com/danielalvarezvazquez/USwap` (**privado**), rama `main`.
- **Push directo a `main`** (decisión tomada por tiempo: las PRs cuestan más de lo que aportan aquí; la protección real es la propiedad de archivos). Antes de cada push: `git pull --rebase`.
- Commits pequeños y frecuentes (cada ~20 min), mensaje corto: `tablon: filtros por carrera`.
- **No tocar** archivos de otra persona: eso es lo que provoca conflictos.

---

## 8. Entorno (Windows) — trampas ya sufridas

`git` y `gh` **no están en el PATH**. En cada shell hay que anteponerlos:

```powershell
$env:PATH = "C:\Program Files\Git\cmd;C:\Program Files\GitHub CLI;" + $env:PATH
```

- Sin eso, `gh auth setup-git` y cualquier comando que invoque `git` fallan con *"unable to find git executable in PATH"*.
- PowerShell trata la salida de stderr de `git`/`gh` como excepción: un **"Exited with code 1" no significa que el comando haya fallado**. Comprueba el resultado real (`git log`, `git status`).
- Node **no está instalado** y no hace falta. No propongas `npm`, Vite ni Next.

---

## 9. Plan de las 3 h 45 (referencia)

| Bloque | Qué se hace |
|---|---|
| 0:00–0:20 | Esqueleto (ya hecho) + cada persona abre su `TAREAS/Px.md` |
| 0:20–1:45 | Construcción en paralelo, cada uno en sus archivos. Checkpoint a los 35 min |
| 1:45–2:15 | Integración y arreglo de bugs (P1 coordina) |
| **2:15** | 🔒 **Congelación de funcionalidad**: nada nuevo, solo pulir |
| 2:15–2:45 | Datos creíbles, estados vacíos, botón reiniciar demo |
| 2:45–3:15 | Ensayo de la demo (2 veces, cronometrada) + 5 diapositivas |
| 3:15–3:45 | Buffer, vídeo de respaldo, entrega |

---

## 10. Demo (5 min)

`Problema (P2)` → `tablón con filtros (P2)` → `oferta, acuerdo a dos bandas y valoración (P1)` → `ranking y recompensas (P3)` → `perfil con las valoraciones (P4)` → `cómo se hizo con IA (P1)` → `roadmap`.

Reglas de demo: usuario cambiado desde la cabecera para enseñar los dos lados, datos semilla ya cargados, **nunca** crear contenido en vivo, y **↺** antes de empezar.
