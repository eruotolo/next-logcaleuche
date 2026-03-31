# Análisis de Brechas PHP → Next.js

**Fecha:** 2026-03-24
**Estado:** Pendiente de implementación

---

## Resumen Ejecutivo

La app Next.js es una reescritura de la intranet PHP de Logia Caleuche 250. El objetivo es **paridad funcional completa** con tecnología moderna (Next.js 16, TailwindCSS 4, Brevo). Este documento registra todas las brechas identificadas y el plan de ataque.

---

## Módulos Comparados

| Módulo                  | PHP                       | Next.js                                      | Estado        |
| ----------------------- | ------------------------- | -------------------------------------------- | ------------- |
| Auth (login)            | ✅                        | ✅                                           | OK            |
| Recuperación contraseña | ✅ email real             | ⚠️ stub sin email                            | **Pendiente** |
| Dashboard               | ✅                        | ✅                                           | OK            |
| Feed                    | ✅                        | ✅                                           | OK            |
| Noticias                | ✅ con galería            | ⚠️ sin galería                               | **Pendiente** |
| Eventos                 | ✅ con calendario         | ⚠️ solo lista                                | **Pendiente** |
| Biblioteca              | ✅ con eliminar           | ⚠️ sin eliminar                              | **Pendiente** |
| Trazados                | ✅ con eliminar           | ⚠️ sin eliminar                              | **Pendiente** |
| Boletines               | ✅ con eliminar           | ⚠️ sin eliminar                              | **Pendiente** |
| Actas                   | ✅ con eliminar           | ⚠️ sin eliminar                              | **Pendiente** |
| Documentos              | ✅ con eliminar           | ⚠️ sin eliminar                              | **Pendiente** |
| Tesorería               | ✅ completa               | ⚠️ sin edición, sin emails, cuotas variables | **Pendiente** |
| Usuarios                | ✅ con acciones admin     | ⚠️ sin baja/reset/set-admin                  | **Pendiente** |
| Mensajes                | ✅ con reply              | ⚠️ sin reply, sin vistas separadas           | **Pendiente** |
| Emails Brevo            | ✅ boleta, masivo, cumple | ❌ nada funciona                             | **Pendiente** |
| Calendario visual       | ✅ FullCalendar           | ❌ no existe                                 | **Pendiente** |

---

## Brechas Detalladas

### 1. 🔴 Emails con Brevo (CRÍTICO — base de todo)

| Funcionalidad                                                 | PHP                       | Next.js |
| ------------------------------------------------------------- | ------------------------- | ------- |
| Email automático al registrar entrada de dinero (boleta HTML) | ✅ `registro-entrada.php` | ❌      |
| Reenviar boleta manualmente por ID                            | ✅ `enviar-boleta.php`    | ❌      |
| Email masivo recordatorio cuotas (BCC todos usuarios)         | ✅ `tarea-email.php`      | ❌      |
| Recuperación de contraseña por email                          | ✅                        | ❌ stub |
| Email de cumpleaños                                           | ✅ `email-cumple.php`     | ❌      |

**Config SMTP PHP (Brevo):**

- Host: `smtp-relay.brevo.com` puerto `587` TLS
- From: `tesoreria@logiacaleuche.cl`
- From Name: `Tesoreria R:. L:. Caleuche 250`

**Boleta HTML incluye:**

- Logo Logia
- Número de boleta (ID entrada)
- Tabla: Nombre usuario, Mes cuota, Año, Motivo, Fecha pago, Monto
- Firma: _Q:.H:. Tesor. Edgardo Ruotolo Cardozo_

---

### 2. 🔴 Tesorería — Brechas

| Funcionalidad                                 | PHP                     | Next.js      |
| --------------------------------------------- | ----------------------- | ------------ |
| **Editar** entrada de dinero                  | ✅ `editar-entrada.php` | ❌           |
| **Editar** salida de dinero                   | ✅ `editar-salida.php`  | ❌           |
| Cuotas variables por RUT                      | ✅                      | ❌           |
| Cálculo correcto caja hospitalaria            | ✅ motivo=6 separado    | ❓ verificar |
| Total entrada excluye tesorero + motivo=1     | ✅                      | ❓ verificar |
| Informe: cuota esperada vs pagada por usuario | ✅                      | ❓ verificar |

**Cuotas variables PHP (hardcodeadas por RUT):**

- 8 RUTs específicos → $15.000/mes
- RUT 55348030 → $30.000/mes
- Resto → $45.000/mes

---

### 3. 🟠 Usuarios — Brechas

| Funcionalidad                                     | PHP                          | Next.js |
| ------------------------------------------------- | ---------------------------- | ------- |
| Resetear contraseña a valor default (desde admin) | ✅ `usuario-passdefault.php` | ❌      |
| Dar de baja usuario                               | ✅ `usuario-down.php`        | ❌      |
| Establecer permisos admin desde perfil            | ✅ `usuario-setadmin.php`    | ❌      |

---

### 4. 🟠 Documentos — Eliminar en todos los tipos

| Tipo                 | PHP                      | Next.js |
| -------------------- | ------------------------ | ------- |
| Actas                | ✅ `acta-remove.php`     | ❌      |
| Biblioteca           | ✅ `libro-remove.php`    | ❌      |
| Boletines            | ✅ `boletin-remove.php`  | ❌      |
| Trazados             | ✅ `trazado-remove.php`  | ❌      |
| Documentos generales | ✅ `document-remove.php` | ❌      |

---

### 5. 🟠 Mensajes — Brechas

| Funcionalidad                          | PHP                      | Next.js |
| -------------------------------------- | ------------------------ | ------- |
| Responder mensaje (reply)              | ✅ `email-replay.php`    | ❌      |
| Vista **leídos** separada de no leídos | ✅ `apps-email-read.php` | ❌      |

---

### 6. 🟡 Noticias — Galería de imágenes

| Funcionalidad                      | PHP                            | Next.js |
| ---------------------------------- | ------------------------------ | ------- |
| Subir múltiples imágenes (galería) | ✅ `gallery` campo concatenado | ❌      |
| Mostrar galería en detalle noticia | ✅                             | ❌      |

---

### 7. 🟡 Eventos — Calendario visual

| Funcionalidad                 | PHP                    | Next.js       |
| ----------------------------- | ---------------------- | ------------- |
| Vista calendario FullCalendar | ✅ `apps-calendar.php` | ❌ solo lista |
| Eliminar evento               | ✅ `evento-remove.php` | ❓ verificar  |

---

### 8. 🟡 Diseño y UX — A revisar visualmente

- Orden y estructura del menú sidebar
- Cards de tesorería (4 cajas con colores correctos)
- Tablas con búsqueda y paginación
- Calendario interactivo (FullCalendar)
- Formularios: campos, validaciones, mensajes de error
- Perfil de usuario: todos los campos presentes

---

## Plan de Implementación

### Orden de Prioridad

| #   | Módulo                 | Razón                                          |
| --- | ---------------------- | ---------------------------------------------- |
| 1   | **Emails / Brevo**     | Base de tesorería y recuperación de contraseña |
| 2   | **Tesorería completa** | Edición + cuotas variables + emails integrados |
| 3   | **Usuarios**           | Acciones admin faltantes                       |
| 4   | **Documentos**         | Eliminar en los 5 tipos                        |
| 5   | **Mensajes**           | Reply + vistas separadas                       |
| 6   | **Noticias**           | Galería múltiple                               |
| 7   | **Eventos**            | Calendario visual + eliminar                   |
| 8   | **Diseño**             | Revisión visual módulo por módulo              |

---

## Estado de Avance

- [x]   1. Emails Brevo — `sendBoleta`, `sendRecordatorioCuotas`, `sendRecovery` en `shared/lib/email.ts`
- [x]   2. Tesorería completa — edición entradas/salidas, cuotas variables (`lib/cuotas.ts`), caja hospitalaria, informe con estado de cuotas, recordatorio masivo
- [x]   3. Usuarios — `deactivateUsuario`, `resetPassword`, `setAdmin` implementados y en UI
- [x]   4. Documentos — `deleteActa`, `deleteLibro`, `deleteBoletin`, `deleteTrazado`, `deleteDocumento` implementados y en UI
- [x]   5. Mensajes — `replyMessage` implementado, detalle de mensaje con formulario de respuesta
- [x]   6. Noticias — galería múltiple en create/update, visualización en detalle
- [x]   7. Eventos — calendario FullCalendar con `CalendarWrapper` + `CalendarView`, `deleteEvento` en UI
- [ ]   8. Diseño — revisión visual módulo por módulo (pendiente comparación visual)
