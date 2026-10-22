# Instalación y acceso (una sola vez · 10-15 min)

Para quien **no programa**. Si algo no sale en 10 minutos, no improvises: salta al **Plan B** del final.

Al terminar tendrás:
- la carpeta del proyecto en tu portátil,
- permiso para subir tus cambios,
- la app funcionando en el navegador.

---

## Antes de empezar (2 min)

1. Entra en <https://github.com/danielalvarezvazquez/USwap> con **tu** cuenta. Si ves el repositorio, ya tienes acceso (no hay invitaciones pendientes). Si sale *Page not found*, estás con otra cuenta o sin sesión: ese es el 90 % de los problemas.
2. Tu usuario es uno de estos: `Javierbarcala`, `tome123456`, `sergiooleeonn`.
3. El proyecto ocupa menos de 1 MB. No hace falta instalar Node, ni Python obligatorio, ni nada de programación.

---

## Opción A · GitHub Desktop (recomendada)

Es la más fácil: instala Git, gestiona el login de GitHub y sube los cambios con botones.

1. Descarga **GitHub Desktop** desde <https://desktop.github.com> e instálalo (siguiente, siguiente, terminar).
2. Ábrelo y pulsa **Sign in to GitHub.com** → entra con tu usuario y contraseña.
3. Menú **File → Clone repository** → pestaña **URL** → pega:
   ```
   https://github.com/danielalvarezvazquez/USwap
   ```
4. En **Local path** elige una carpeta corta y sin espacios, por ejemplo:
   ```
   C:\Hackaton\USwap
   ```
5. Pulsa **Clone**. En ~5 segundos tendrás todos los archivos.

✅ **Comprobado si** ves `index.html`, `AGENTS.md` y la carpeta `TAREAS` en esa ruta.

> ¿Por qué no descargar el ZIP? Porque el ZIP no te deja subir cambios: solo sirve para mirar.

---

## Opción B · Terminal (solo si ya tienes Git instalado)

```powershell
git clone https://github.com/danielalvarezvazquez/USwap.git C:\Hackaton\USwap
cd C:\Hackaton\USwap
py serve.py 8000
```

Si Windows dice **"git no se reconoce como comando"**, no está instalado o no está en el PATH: usa la Opción A y no pierdas tiempo.

---

## Ver la app funcionando (2 min)

**Con Python** (lo normal en Windows):

```powershell
cd C:\Hackaton\USwap
py serve.py 8000
```

Abre <http://localhost:8000>. Para parar el servidor: `Ctrl + C`.
`serve.py` es un servidor mínimo que **desactiva la caché**: sin él, el navegador puede seguir usando un `.js` antiguo y parecer que tus cambios no se guardan.

**Sin Python:** doble clic en `index.html`. Funciona, pero el navegador guarda los datos de forma menos fiable; para la demo final se usa el servidor.

✅ **Comprobado si** ves el tablón con 9 ofertas, los filtros y la barra inferior (Tablón / Publicar / Ranking / Perfil).

Prueba el flujo entero una vez con la oferta **"Apuntes de Cálculo I"** (ya está cerrada): abrirla → "Valorar a Marc Puig" → 5 estrellas → enviar. Y pulsa el botón **↺** de arriba a la derecha para reiniciar los datos.

---

## Abrir el proyecto en OpenCode (2 min)

1. Abre **OpenCode**.
2. Elige como carpeta de trabajo **`C:\Hackaton\USwap`** (no una subcarpeta).
3. No hace falta pegar nada: **`AGENTS.md` se carga solo** y la IA ya conoce el proyecto, las reglas y qué archivos son de cada uno.
4. Escribe tu primera orden:

   > Soy **P2**. Lee `TAREAS/P2.md` y empecemos por el paso 1.

   Cambia `P2` por `P1`, `P3` o `P4` según quién seas.

✅ **Comprobado si** la IA te resume tu reparto y te propone el paso 1 sin que se lo expliques.

---

## Tu rutina de trabajo (el bucle)

| # | Qué haces | Dónde |
|---|---|---|
| 1 | **Pull**: traer lo de los demás | GitHub Desktop → *Fetch origin* / *Pull* |
| 2 | **Un paso**: pegas el prompt del paso | OpenCode |
| 3 | **Probar**: recargas (F5) y usas la pantalla | Navegador; si algo falla, **F12 → Console** |
| 4 | **Commit**: escribes el mensaje que indica el paso | GitHub Desktop → *Commit to main* |
| 5 | **Push**: subirlo | GitHub Desktop → *Push origin* |

Repite cada 15-20 minutos. **Pull antes de push, siempre.**

---

## Qué archivos son tuyos (no toques los demás)

| Persona | GitHub | Tus archivos |
|---|---|---|
| **P1** Daniel | `danielalvarezvazquez` | `css/styles.css`, `js/data.js`, `js/ui.js`, `oferta.html`, `js/oferta.js`, `valorar.html`, `js/valorar.js` |
| **P2** Javier | `Javierbarcala` | `index.html`, `js/board.js` |
| **P3** Tomé | `tome123456` | `ranking.html`, `js/ranking.js`, `publicar.html`, `js/publicar.js` |
| **P4** Sergio | `sergiooleeonn` | `perfil.html`, `editar-perfil.html`, `js/perfil.js`, `js/editar-perfil.js` |

Si necesitas un estilo o un campo nuevo: **pídeselo a P1** por el chat del equipo.

---

## Problemas típicos

| Síntoma | Qué significa | Qué hacer |
|---|---|---|
| *Page not found* en GitHub | Otra cuenta o sin sesión | Cerrar sesión y entrar con tu usuario |
| *"git no se reconoce"* | Git no instalado / no está en PATH | Usar **GitHub Desktop** (Opción A) |
| *Push rejected / fetch first* | Alguien subió algo antes que tú | **Pull** y vuelve a hacer push |
| Página en blanco o a medias | Error de JavaScript | **F12 → Console**, copia el error rojo y pásaselo a la IA |
| Cambio que no se ve | Caché del navegador o datos viejos | `Ctrl + F5`; luego pulsa **↺** |
| *Conflicting changes* | Dos personas tocaron el mismo archivo | **Para y avisa a P1**; no intentes resolverlo solo |
| No aparece la barra inferior | Ventana pequeña / zoom raro | `Ctrl + 0` y ensancha la ventana |

---

## Plan B (si en 10 minutos no está listo)

**No se negocia con la instalación.** Elige una:

- **Parejas:** te sientas con otra persona que ya lo tenga y le dictas los pasos mientras ella teclea. Tú eliges qué se hace, ella lo ejecuta.
- **Rol de presentación:** asumes el guion, los tiempos y las diapositivas de la demo. Es imprescindible y no depende del código.

Cuatro personas bloqueadas es peor que tres programando y una preparando la exposición.

---

## Las tres reglas que no se rompen

1. **No instales nada más**: nada de `npm`, Node, Vite ni frameworks. Este proyecto no los necesita.
2. **Pull antes de push** y no toques archivos de otra persona.
3. A las **2:15** se congela la funcionalidad: a partir de ahí, solo pulir y ensayar.
