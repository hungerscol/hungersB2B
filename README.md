
# 🍲 Hungers - Guía de Lanzamiento Final

¡Ya tienes el dominio y la base de datos! Sigue estos 3 bloques de pasos para que el sitio sea visible en **hungers.com.co**.

## 1. Preparar tu computadora (Solo una vez)
Si no tienes las herramientas de Firebase, abre una terminal (CMD o PowerShell en Windows, Terminal en Mac) y escribe:
```bash
npm install -g firebase-tools
```

## 2. Conectar este código con Google Cloud
En la misma terminal, dentro de la carpeta de tu proyecto:
1.  **Inicia sesión:** `firebase login` (se abrirá tu navegador).
2.  **Vincula el proyecto:** `firebase use gen-lang-client-0214596384`

## 3. ¡Subir el sitio! (El paso final)
Cada vez que quieras actualizar el sitio en vivo, ejecuta estos dos comandos:

1.  **Crea la versión de producción:**
    ```bash
    npm run build
    ```
    *(Esto crea la carpeta `dist` con todo optimizado).*

2.  **Súbelo a Google:**
    ```bash
    firebase deploy
    ```

---

### 💡 ¿Qué veré después de esto?
Al terminar el `firebase deploy`, entra a **https://hungers.com.co**. Verás la aplicación real. 

**Recuerda el último paso dentro de la web:**
Ve a "Acceder" -> "Acceso Administrativo" (abajo del botón) e ingresa con `admin@hungers.com` / `admin123`. Presiona el botón **"⚙️ Inicializar Base de Datos"** para que los menús de prueba se carguen en tu nueva base de datos.

¡Buen provecho! 🚀

---

Para más detalles técnicos, consulta la [Documentación Completa](./DOCUMENTACION.md).
