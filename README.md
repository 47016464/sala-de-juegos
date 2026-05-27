# Sala de Juegos - Sprint 1

## Alumno
- **Nombre:** Augusto Bottazzi

## 🚀 Deploy
[Vercel - Proyecto en línea](https://sala-de-juegos-aeb-git-sprint-1-47016464s-projects.vercel.app/home)

## 🛠️ Tecnologías usadas
- Angular
- Bootstrap 
- Vercel

## 📌 Sprint 1
En este sprint se implementaron las siguientes funcionalidades:
- Navbar funcional.
- Favicon personalizado.
- Sección **Quién Soy** con datos obtenidos automáticamente desde la API de GitHub.
- Idea del juego propio: *Esquivar Cajas* (descripción y reglas incluidas en la sección).
- Mejoras visuales:
  - Cambio de color de la página para una experiencia más agradable.
  - Reordenamiento de elementos para mejorar la claridad y navegación.

---

# Sala de Juegos - Sprint 2

## Alumno
- **Nombre:** Augusto Bottazzi

## 🚀 Deploy
[Enlace al proyecto en Vercel](https://sala-de-juegos-aeb-git-sprint-2-47016464s-projects.vercel.app/home)

## 🛠️ Tecnologías utilizadas
- Angular
- Supabase (Auth + Base de datos)
- Bootstrap / CSS propio
- Vercel (deploy)

## 📌 Sprint 2
- **Componente Home**:
  - Es el componente principal.
  - Si el usuario NO está logueado → muestra botones de Registro e Inicio de sesión.
  - Si el usuario está logueado → muestra su nombre/email y botón de Cerrar sesión.
  - Implementación de **Guards** para bloquear rutas protegidas (juegos, listados).
- **Inicio de sesión**:
  - Validación contra Supabase con correo y contraseña.
  - Navegación automática al Home si es exitoso.
  - Mensaje de error en caso de credenciales inválidas.
  - Tres botones de inicio rápido con usuarios de prueba.
- **Registro**:
  - Formulario con correo, nombre, apellido, edad y contraseña.
  - Creación de cuenta en Supabase Auth (email + password).
  - Inserción de datos adicionales en tabla `usuarios` (sin contraseña).
  - Inicio de sesión automático tras registro exitoso.
  - Mensaje si el usuario ya se encuentra registrado.

  ---
  # Sala de Juegos - Sprint 3

## 👤 Alumno
- **Nombre:** Augusto Bottazzi

## 🚀 Deploy
[Vercel - Proyecto en línea](https://sala-de-juegos-aeb-git-sprint-1-47016464s-projects.vercel.app/home)

## 🛠️ Tecnologías usadas
- Angular
- Supabase (Base de datos + Realtime)
- Bootstrap / PrimeNG
- Vercel

## 📌 Sprint 3
En este sprint se implementaron las siguientes funcionalidades:

### 🎮 Juego: Ahorcado
- Interfaz con botones para todas las letras del abecedario (entrada solo por clic, no teclado).
- Lógica completa de partida con detección de victoria/derrota.
- Al finalizar la partida se guarda en la base de datos:
  - Usuario que jugó.
  - Tiempo de finalización.
  - Cantidad de letras seleccionadas.
  - Palabra utilizada.

### 🎮 Juego: Mayor o Menor
- Se muestra una carta de la baraja y el jugador debe adivinar si la siguiente será mayor o menor.
- Lógica completa de aciertos y fallos.
- Al finalizar la partida se guarda en la base de datos:
  - Usuario que jugó.
  - Cantidad de cartas acertadas.

### 💬 Sala de Chat
- Chat global disponible para usuarios logueados.
- Envío de mensajes en tiempo real.
- Cada mensaje se guarda en la base de datos con:
  - Usuario que lo envió.
  - Texto del mensaje.
  - Fecha y hora de envío.
- Suscripción en tiempo real: los mensajes nuevos aparecen automáticamente en todos los clientes.
- Diferenciación visual entre mensajes propios y ajenos.

---

## 🎨 Mejoras visuales
En este sprint se trabajó fuertemente en la **mejora visual de la aplicación**:
- Interfaces más limpias y organizadas.
- Botones estilizados y consistentes.
- Animaciones y transiciones que mejoran la experiencia de usuario.
- Diferenciación clara de elementos interactivos.
- Estética general más atractiva y profesional.

---

# Sala de Juegos - Sprint 4

## 👤 Alumno
- **Nombre:** Augusto Bottazzi

## 🚀 Deploy
[Vercel - Proyecto en línea](https://sala-de-juegos-aeb-git-sprint-1-47016464s-projects.vercel.app/home)

## 🛠️ Tecnologías usadas
- Angular
- Supabase (Base de datos + Realtime)
- Bootstrap / PrimeNG
- Vercel

## 📌 Sprint 4
En este sprint se implementaron las siguientes funcionalidades:

### 🎮 Juegos
- **Preguntados**: integrado y guardando resultados con usuario, puntaje y tiempo.
- **Monkey Jump**: agregado a la sección de resultados con formato uniforme.

### 📊 Ranking y listados
- Ranking global de usuarios según puntaje acumulado.
- Listado de partidas jugadas con detalle de usuario, puntaje y fecha.

### 🎨 Mejoras visuales
- Animaciones y transiciones en botones y pantallas.
- Feedback visual en aciertos y errores.
- Estética general más atractiva y consistente.

### 🚀 Deploy
- Proyecto desplegado en Vercel.
- README actualizado con descripción de Sprint 4.

---

## ✅ Conclusión
La plataforma ahora cuenta con:
- Todos los juegos integrados.
- Resultados uniformes.
- Ranking global.
- Chat en tiempo real.
- Mejoras visuales significativas.

--
🔧 Correcciones realizadas
✅ Ruteo con Lazy Loading

Se implementó el sistema de Lazy Loading en las rutas principales de la aplicación para optimizar la carga inicial y mejorar el rendimiento general del proyecto.

✅ Bloqueo de acceso sin iniciar sesión

Se corrigió la navegación para que los juegos y funcionalidades protegidas solo puedan utilizarse si el usuario está autenticado.

Además:

Se muestran correctamente los botones del Home según el estado de sesión.
Se evita acceder manualmente por URL a componentes restringidos.
✅ Validación de edad en registro

Se agregó validación en el formulario de registro para impedir:

edades negativas
valores inválidos
campos vacíos
✅ Guardado de usuarios en Supabase

Al registrarse un usuario:

se crea la cuenta con Supabase Auth
y además se guardan los datos en la tabla usuarios

Campos almacenados:

email
nombre
apellido
edad
🎮 Correcciones de juegos
✅ Ahorcado

Se agregaron múltiples mejoras:

✔ Puntaje en tiempo real

El puntaje ahora:

aumenta dinámicamente
se acumula por victorias consecutivas
y el tiempo restante influye en los puntos obtenidos
✔ Temporizador en tiempo real

Se rehízo el sistema usando Signals para:

actualizar automáticamente la UI
evitar problemas con ChangeDetectorRef
perder automáticamente cuando el tiempo llega a 0
✔ Guardado correcto en Supabase

Ahora:

se guarda una sola partida por juego
se almacena correctamente:
usuario
victorias_consecutivas
✅ Mayor o Menor

Se corrigió completamente la lógica del juego.

✔ Inicio correcto

La primera carta ahora:

aparece al tocar el botón “Jugar”
utilizando Signals para refresco inmediato
✔ Flujo del juego
al acertar → aparece automáticamente la siguiente carta
al perder → se muestra la carta final correctamente
aparece inmediatamente el botón de reintentar
se evita el bug de necesitar otro click para finalizar
✔ Supabase

Las partidas ahora se guardan correctamente en la tabla correspondiente.

✅ Preguntados

Se solucionó:

el guardado de resultados
el cierre correcto de partida
la sincronización con Supabase

Ahora se guarda:

usuario
puntaje
✅ Monkey Jump

Se mejoró:

descripción del juego
funcionamiento general
integración con resultados

La descripción ahora explica:

controles
wrap horizontal
sistema de puntaje arcade
plataformas dinámicas
💬 Chat en tiempo real
✅ Realtime con Supabase

El chat ahora:

recibe mensajes instantáneamente usando Realtime
actualiza automáticamente usando Signals
✅ Auto-scroll

Cuando llega un nuevo mensaje:

el chat baja automáticamente al último mensaje
incluso si hay muchos mensajes acumulados
📊 Resultados
✅ Scroll en tablas

Se agregó scroll para evitar:

desbordes verticales
tablas demasiado largas
👤 Quién Soy
✅ Mejoras visuales

Se realizaron mejoras de UI:

texto más grande
contenido centrado
avatar alineado correctamente
diseño más limpio
✅ Título animado

Se aplicó el mismo efecto visual del título de “Quién Soy” al texto:

SALA DE JUEGOS

---

# Sala de Juegos - Sprint 5  

## 👤 Alumno
- **Nombre:** Augusto Bottazzi

## 🚀 Deploy
[Vercel - Proyecto en línea](https://sala-de-juegos-aeb-git-sprint-1-47016464s-projects.vercel.app/home)

## 🛠️ Tecnologías usadas
- Angular
- Supabase (Base de datos + Realtime)
- Bootstrap / PrimeNG
- Vercel

## 📌Sprint 5:

## ✅ Encuesta Gamer

Se incorporó una nueva sección de encuesta dentro de la aplicación.

La encuesta permite registrar información y preferencias de los usuarios sobre videojuegos.

### Datos solicitados

- Nombre
- Apellido
- Edad
- Número de teléfono

### Validaciones implementadas

- Edad entre 18 y 99 años.
- Número de teléfono:
  - Solo números.
  - Máximo 10 caracteres.
- Todos los campos son obligatorios.
- Cada usuario puede responder la encuesta una sola vez.

### Preguntas incorporadas

Se utilizaron distintos tipos de controles:

- Input de texto.
- Radio buttons.
- Checkboxes.
- Select.
- Textarea.

### Base de datos

Las respuestas se almacenan en Supabase junto al usuario autenticado que realizó la encuesta.

---

# 📊 Panel de Resultados

Se creó una sección exclusiva para administradores donde pueden visualizarse los resultados de las encuestas.

## Funcionalidades

- Total de encuestas realizadas.
- Edad promedio de los usuarios.
- Género favorito más elegido.
- Aspecto más valorado en un juego.
- Navegación entre encuestas individuales.

---

# 🔒 Protección con Guards

La ruta de administración de encuestas fue protegida utilizando:

- `authGuard`
- `adminGuard`

Solo usuarios administradores pueden acceder a:

```txt
/admin-encuestas
("augusebottazzi@gmail.com)