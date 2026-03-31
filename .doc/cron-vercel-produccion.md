# Cron de Invitaciones de Eventos — Deploy en Vercel

## Qué hace

Cada lunes a las 9:00 AM (Chile, UTC-3) el sistema envía automáticamente un email de invitación masónico al próximo evento programado, filtrado por el grado del evento.

---

## Pasos para activar en producción

### 1. Agregar variable de entorno en Vercel

En el dashboard de Vercel → **Settings → Environment Variables**, agregar:

| Variable      | Valor                                 |
| ------------- | ------------------------------------- |
| `CRON_SECRET` | Generar con `openssl rand -base64 32` |

> El valor debe ser el mismo que está en el `.env` local. Si se genera uno nuevo, actualizar también el `.env` local.

Las demás variables de entorno ya necesarias (DATABASE*URL, BREVO*\*, NEXTAUTH_SECRET, etc.) deben estar configuradas previamente.

---

### 2. Verificar `vercel.json`

El archivo `vercel.json` en la raíz del proyecto ya está configurado:

```json
{
    "crons": [
        {
            "path": "/api/cron/eventos",
            "schedule": "0 12 * * 1"
        }
    ]
}
```

`0 12 * * 1` = todos los lunes a las 12:00 UTC = **09:00 AM Chile (UTC-3 / UTC-4 en verano)**.

> **Nota horaria:** Chile usa UTC-3 en invierno y UTC-4 en verano (horario de verano). Si se necesita ajustar a las 9 AM exactas en verano, cambiar a `0 13 * * 1`.

---

### 3. Deploy

```bash
git add .
git commit -m "feat: cron invitaciones eventos"
git push origin main
```

Vercel detecta automáticamente el `vercel.json` y registra el cron al hacer deploy.

---

### 4. Verificar que el cron está activo en Vercel

En el dashboard de Vercel → **Settings → Cron Jobs**.

Deberías ver:

```
/api/cron/eventos    0 12 * * 1    Next run: Monday...
```

---

### 5. Probar manualmente en producción

```bash
curl -s \
  -H "Authorization: Bearer TU_CRON_SECRET" \
  "https://tu-dominio.cl/api/cron/eventos?test=true"
```

Con `?test=true` el email se envía solo a:

- `edgardoruotolo@gmail.com`
- `edgardoruotolo@logiacaleuche.cl`

Sin `?test=true` se envía a todos los hermanos según el grado del evento.

---

## Cómo funciona el cron

1. Vercel llama a `GET /api/cron/eventos` cada lunes a las 12:00 UTC
2. El endpoint verifica el header `Authorization: Bearer CRON_SECRET`
3. Busca el próximo evento activo con fecha futura
4. Determina los destinatarios según el grado del evento:
    - **Aprendiz (1)** → todos los hermanos activos
    - **Compañero (2)** → hermanos de grado 2 y 3
    - **Maestro (3)** → solo hermanos de grado 3
5. Trae de la BD el nombre del Venerable Maestro (oficialidadId=2) y Secretario (oficialidadId=6)
6. Envía el email vía Brevo SMTP

---

## Plan Hobby de Vercel

Los cron jobs están disponibles en el **plan gratuito (Hobby)** de Vercel con las siguientes limitaciones:

- Máximo **2 cron jobs** por proyecto
- Frecuencia mínima: **1 vez por día**
- Timeout máximo por ejecución: **10 segundos**

La configuración actual (1 cron, 1 vez por semana) entra dentro del plan gratuito.

---

## Archivos relevantes

| Archivo                                 | Descripción                                      |
| --------------------------------------- | ------------------------------------------------ |
| `vercel.json`                           | Configuración del schedule                       |
| `src/app/api/cron/eventos/route.ts`     | Route handler del cron                           |
| `src/shared/lib/email.ts`               | Template del email (`sendInvitacionEvento`)      |
| `src/features/eventos/actions/index.ts` | `getProximoEvento()` y `getUsuariosParaEvento()` |
