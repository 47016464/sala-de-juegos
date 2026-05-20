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