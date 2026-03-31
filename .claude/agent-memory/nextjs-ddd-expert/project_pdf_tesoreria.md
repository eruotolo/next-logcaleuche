---
name: pdf_tesoreria
description: Generación de PDF del informe de tesorería con @react-pdf/renderer v4 en route handler servidor
type: project
---

PDF del informe de tesorería implementado en 2026-03-30 usando @react-pdf/renderer 4.3.2.

**Archivos creados:**

- `src/features/tesoreria/components/InformePDF.tsx` — componente PDF puro (Document/Page/View/Text), sin 'use client', tipado con `Props` propios
- `src/app/api/tesoreria/informe-pdf/route.ts` — Route Handler GET que llama a `getInforme()`, genera el buffer server-side con `renderToBuffer` y devuelve `application/pdf`

**Archivos modificados:**

- `src/features/tesoreria/components/InformeTesoreria.tsx` — botón `DescargarPdfButton` agregado como subcomponente local, usa anchor programático para la descarga

**Por qué:** renderToBuffer en route handler es la única forma segura en Next.js — no importar @react-pdf/renderer en Server Components ni en Client Components directamente.

**Gotchas resueltos:**

1. `renderToBuffer` espera `ReactElement<DocumentProps>` — se castea vía `as unknown as ReactElement<DocumentProps, ...>`
2. `renderToBuffer` retorna `Buffer` de Node.js, incompatible con `Response` web — convertir con `new Uint8Array(nodeBuffer)`
3. `Font.registerHyphenationCallback` evita errores de hyphenation en producción

**How to apply:** Si en el futuro se agrega otro PDF (ej. boleta, acta), seguir el mismo patrón: componente en `features/[feature]/components/`, route handler en `api/[feature]/[accion]/route.ts`.
