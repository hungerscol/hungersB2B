# 🎨 Especificaciones UX/UI - Hungers

Este documento define la identidad visual y las pautas de diseño para la plataforma Hungers, asegurando una experiencia coherente entre los paneles de Cliente, Cocinero, Empresa y SuperAdmin.

---

## 1. Identidad y Concepto
- **Estilo:** *High-Tech Brutalist*.
- **Mood:** Profesional, fresco, energético y confiable.
- **Filosofía:** Combinar la "fuerza" del brutalismo (tipografías pesadas, bordes definidos) con la "limpieza" de la tecnología moderna (espacios en blanco, sombras suaves, micro-interacciones).

---

## 2. Paleta de Colores

### Colores de Marca (Core)
- **Verde Hungers (Primary):** `#2c5234` (`hungers-green-900`)
  - Uso: Textos principales, fondos oscuros, botones secundarios.
- **Lima Hungers (Accent):** `#c1ff72` (`hungers-lime-500`)
  - Uso: Botones de acción primaria, resaltados, indicadores de energía.

### Colores de Soporte
- **Fondo General:** `#F9F9F9` (Gris ultra claro)
- **Fondo de Cards:** `#FFFFFF` (Blanco puro)
- **Bordes:** `#F3F4F6` (`gray-100`)
- **Éxito:** `#16a34a` (Verde esmeralda)
- **Error:** `#de0c3e` (Rojo vibrante)

---

## 3. Tipografía

### Fuentes
- **Sans-Serif (Cuerpo y UI):** `Inter`
  - Alternativa: `Roboto`
- **Display (Títulos):** `Nunito`
  - Alternativa: `Space Grotesk`

### Jerarquía Visual
- **H1 / Títulos de Panel:** `font-black`, `text-3xl`, `tracking-tighter`, `uppercase`.
- **Subtítulos:** `font-bold`, `text-lg`, `text-green-800`.
- **Micro-labels (Overlines):** `text-[10px]`, `font-black`, `uppercase`, `tracking-[0.2em]`.
- **Cuerpo de texto:** `text-sm`, `leading-relaxed`, `text-gray-600`.

---

## 4. Componentes y Estilos de UI

### Botones (Pill Style)
- **Forma:** `rounded-full` (Completamente redondeados).
- **Tipografía:** `font-black`, `uppercase`, `tracking-widest`, `text-xs`.
- **Feedback:** `active:scale-95`, `transition-all duration-300`.
- **Sombra:** `shadow-lime` para botones Lima, `shadow-premium` para botones Verdes.

### Cards y Contenedores
- **Bordes:** `rounded-[2.5rem]` (Esquinas muy redondeadas para un look orgánico).
- **Sombra:** `shadow-xl` con baja opacidad para evitar "suciedad" visual.
- **Borde:** `border border-gray-100` para definición sutil.

### Inputs y Formularios
- **Forma:** `rounded-2xl`.
- **Foco:** `focus:ring-2 focus:ring-[#c1ff72]`, `focus:border-green-700`.
- **Estilo:** Fondo blanco, texto verde oscuro, padding generoso.

---

## 5. Layout y Estructura
- **Sidebar:** Ancho fijo (`w-80`), fondo blanco, borde derecho sutil.
- **Main Content:** Fondo gris claro (`bg-gray-50`), padding masivo en desktop (`p-12`).
- **Contenedor Máximo:** `max-w-7xl` para evitar que el contenido se estire demasiado en pantallas ultra-wide.

---

## 6. Animaciones e Interacciones
- **Entrada:** `animate-fade-in` (Opacidad 0 a 1 con ligero desplazamiento hacia arriba).
- **Hover:** `hover:scale-105` en elementos interactivos (Cards, Botones).
- **Carga:** Spinner personalizado en verde Hungers con mensaje "Cocinando tu experiencia...".

---

## 7. Iconografía
- **Librería:** `Lucide React` (Líneas limpias, grosor 2px).
- **Uso de Emojis:** Se utilizan emojis como acentos visuales en títulos y botones para añadir un toque humano y juguetón (ej: 🍲, 💰, 📊).
