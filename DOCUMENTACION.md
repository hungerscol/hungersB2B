
# Documentación Completa del Proyecto Hungers

## 1. Introducción

Hungers es una plataforma B2B que conecta empresas y cocineros locales. Su misión es transformar el almuerzo corporativo en una experiencia humana, saludable y con impacto social.

## 2. Configuración de Firebase (Backend Real)

### 2.1. Reglas de Seguridad (¡CRÍTICO!)

Si recibes el error `[code=permission-denied]`, significa que Firestore está bloqueado. Debes configurar las reglas en tu consola de Firebase:

1. Ve a [Firebase Console](https://console.firebase.google.com/).
2. Selecciona tu proyecto **hungers-app**.
3. En el menú lateral, ve a **Build > Firestore Database**.
4. Haz clic en la pestaña **Rules** (Reglas).
5. Borra todo y pega las siguientes reglas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Reglas para Usuarios
    match /users/{userId} {
      allow read: if true; // Permitir lectura para validación de emails en login
      allow write: if true; // Permitir registro y actualización de perfil
    }
    
    // Reglas para Menús
    match /menuItems/{itemId} {
      allow read: if true; // Público
      allow write: if request.auth != null; // Solo cocineros logueados o admin
    }
    
    // Reglas para Pedidos
    match /orders/{orderId} {
      allow read, write: if request.auth != null;
    }
    
    // Reglas para Empresas y otros
    match /{path=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```
6. Haz clic en **Publish**.

### 2.2. Variables de Entorno

Asegúrate de que tu archivo `.env` tenga las credenciales correctas:

```env
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=hungers-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=hungers-app
VITE_FIREBASE_STORAGE_BUCKET=hungers-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
API_KEY=tu_gemini_api_key
```

## 3. Estructura del Proyecto

(Se mantiene la estructura previa...)

## 4. Guía para el Desarrollador

*   **Autenticación**: Los usuarios se crean en Firebase Auth y sus perfiles en la colección `users` vinculados por el UID.
*   **Créditos**: Se gestionan directamente en el documento del usuario/empresa en Firestore.
*   **Imágenes**: Puedes usar el Generador de Imágenes IA incluido en el panel de Super Admin para crear visuales para los menús.
