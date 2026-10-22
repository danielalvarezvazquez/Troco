# AGENTS.md

Memoria compartida del proyecto. **Léelo al empezar cada sesión y actualízalo cuando cambien las decisiones de arquitectura, stack o comandos.**

## Qué es USwap

App **móvil** de intercambio de favores y objetos entre estudiantes de distintas carreras y ámbitos.

- **Tablón**: cada estudiante publica lo que necesita (o lo que ofrece).
- **Perfil**: carrera, curso, área y habilidades del estudiante; sirve para emparejar ofertas.
- **Búsqueda/filtros**: por carrera, área de la petición, curso, etc.
- **Oferta**: al abrirla se abre un **chat** para negociar y pedir algo a cambio.
- **Cierre**: se formaliza una oferta final y, al terminar el intercambio, ambas partes se **valoran**.
- Contexto: proyecto de hackathon de la ETSE.

## Estado actual (octubre 2026)

- Repo recién creado: solo `README.md`. **No hay código, manifiestos, build, tests ni CI.**
- **Stack sin decidir.** No asumas framework, lenguaje ni estructura de carpetas: pregunta al usuario antes de generar un scaffold.
- No inventes comandos de build/test/lint. Cuando existan, documéntalos aquí (comando exacto, no descripción).

## Convenciones

- **Git: ramas + Pull Request.** No hagas commits ni pushes directos a `main`; crea una rama (`feat/...`, `fix/...`, `docs/...`) y abre PR.
- Remoto: `origin` → `https://github.com/danielalvarezvazquez/USwap` (**privado**).
- Identidad de commit ya configurada globalmente con el correo *noreply* de GitHub; no la cambies.
- README y documentación en español.

## Entorno (Windows) — trampa habitual

`git` y `gh` **no están en el PATH** del sistema. En cada shell nuevo hay que anteponerlos:

```powershell
$env:PATH = "C:\Program Files\Git\cmd;C:\Program Files\GitHub CLI;" + $env:PATH
```

Sin esto, `gh auth setup-git` y demás comandos que invocan `git` fallan con "unable to find git executable in PATH".

Además, PowerShell trata la salida de error de `git`/`gh` como excepción (`NativeCommandError`): un "Exited with code 1" con texto en stderr no implica que el comando haya fallado — comprueba el resultado real.
