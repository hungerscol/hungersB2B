# 🚀 Plan de Despliegue a Producción - Hungers

Este documento detalla la hoja de ruta estratégica y técnica para mover la aplicación **Hungers** desde el entorno de desarrollo/staging hacia un entorno de producción estable y escalable.

---

## 1. Pre-Deployment Checklist (Lista de Verificación)

### Revisiones de Código y QA
- [ ] **Code Review Final:** Revisión por pares de los últimos cambios en `AuthContext` y `GlobalStoreContext` para asegurar que no existan fugas de memoria o bucles de re-renderizado.
- [ ] **Pruebas de Integración Firebase:** Verificar que las llamadas a Firestore en `data.ts` manejen correctamente los estados de carga y error (especialmente tras la eliminación de `orderBy` para evitar errores de índice).
- [ ] **QA de Roles:** Probar exhaustivamente el acceso a los 4 paneles (Cliente, Cocinero, Empresa, SuperAdmin) con usuarios de prueba reales.
- [ ] **Pruebas de Pasarela:** Simular recargas de créditos en el panel de Empresa para validar la lógica de `BilleteraView`.
- [ ] **Linting & Build:** Ejecución exitosa de `npm run lint` y `npm run build` sin advertencias críticas.

### Documentación Requerida
- [ ] **Manual de Variables de Entorno:** Actualizar `.env.example` con todas las llaves necesarias (Firebase Config, Google GenAI Key, etc.).
- [ ] **Guía de Configuración de Firebase:** Documento con las reglas de seguridad de Firestore y Storage.
- [ ] **Especificaciones UX/UI:** Referencia al archivo `UI_UX_SPECIFICATIONS.md` para validación visual post-deploy.

---

## 2. Firebase Synchronization (Sincronización)

### Configuración y Base de Datos
1.  **Creación de Proyecto Pro:** Crear un nuevo proyecto en la consola de Firebase (ej: `hungers-prod`).
2.  **Configuración de App Web:** Registrar la aplicación y obtener el objeto `firebaseConfig`.
3.  **Firestore Setup:**
    *   Habilitar Firestore en modo producción.
    *   Desplegar reglas desde `firestore.rules`.
    *   *Nota:* No se requieren índices compuestos manuales para las consultas actuales de pedidos (ordenamiento en memoria implementado).
4.  **Storage Setup:**
    *   Habilitar Firebase Storage para fotos de platos y documentos de cocineros.
    *   Desplegar reglas desde `storage.rules`.

### Autenticación y Seguridad
- **Métodos de Acceso:** Habilitar Email/Password en Firebase Auth.
- **Dominios Autorizados:** Agregar el dominio de producción a la lista blanca de Firebase Auth.
- **Seguridad:** Implementar validación de roles en las reglas de Firestore para que solo el SuperAdmin pueda modificar catálogos globales.

---

## 3. Google Cloud Integration (Integración GCP)

### Servicios y APIs
1.  **Habilitación de APIs:**
    *   Generative Language API (para Gemini AI).
    *   Cloud Storage API.
    *   Cloud Functions API (si se requieren triggers de backend).
2.  **Gestión de API Keys:**
    *   Generar una API Key restringida solo para los servicios necesarios.
    *   Configurar restricciones de referer HTTP para que la llave solo funcione en el dominio de Hungers.
3.  **Cloud Storage:** Configurar buckets para backups automáticos de la base de datos Firestore.

---

## 4. Deployment Process (Proceso de Despliegue)

### Guía Paso a Paso
1.  **Preparación de Entorno:**
    ```bash
    # Instalar dependencias limpias
    npm ci
    ```
2.  **Compilación de Producción:**
    ```bash
    # Generar el bundle optimizado
    npm run build
    ```
3.  **Despliegue de Hosting:**
    *   Si se usa Firebase Hosting: `firebase deploy --only hosting`.
    *   Si se usa un servidor custom (Express): Asegurar que `NODE_ENV=production` esté configurado.
4.  **Criterios de Promoción:**
    *   **Staging:** Entorno de pruebas con datos mock.
    *   **Producción:** Solo se mueve a producción si el 100% de los tests de integración en Staging pasan y el SuperAdmin aprueba el QA visual.

---

## 5. Post-Deployment Actions (Acciones Post-Despliegue)

### Monitoreo y Logging
- **Firebase Analytics:** Monitoreo de flujo de usuarios y conversiones.
- **Sentry / LogRocket:** Implementar para capturar errores de frontend en tiempo real.
- **Google Cloud Logging:** Revisar logs del servidor Express para detectar latencias en las APIs de IA.

### Plan de Rollback (Reversión)
- **Estrategia:** En caso de fallo crítico, se utilizará el comando `firebase rollback` (si aplica) o se redeplegará la versión anterior del bundle de `dist/` que haya sido previamente tagueada en Git.
- **Tiempo Estimado de Recuperación (RTO):** Menos de 5 minutos.

---

## 6. Communication Plan (Plan de Comunicación)

### Responsabilidades
- **Project Manager (PM):** Coordinación general y comunicación con stakeholders.
- **Lead Developer:** Ejecución técnica del despliegue y monitoreo de logs.
- **QA Engineer:** Validación final en el entorno de producción.

### Cronograma y Actualizaciones
- **T-2 Horas:** Notificación al equipo sobre el inicio de la ventana de mantenimiento.
- **T-0:** Inicio del despliegue.
- **T+30 Min:** Reporte de estado inicial (Smoke Test completado).
- **T+2 Horas:** Confirmación de estabilidad y cierre de ventana de despliegue.

---
*Documento preparado por el Project Manager de Hungers - Marzo 2026*
