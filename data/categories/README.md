# Categorías del Juego "El Impostor"

Esta carpeta contiene todas las categorías y palabras del juego organizadas en archivos JSON.

## 📁 Estructura

Cada categoría tiene su propia carpeta con 3 archivos JSON (uno por nivel de dificultad):

```
categories/
├── futbol-argentino/
│   ├── facil.json
│   ├── medio.json
│   └── dificil.json
├── futbol-internacional/
│   ├── facil.json
│   ├── medio.json
│   └── dificil.json
├── tenis/
│   ├── facil.json
│   ├── medio.json
│   └── dificil.json
└── basquet/
    ├── facil.json
    ├── medio.json
    └── dificil.json
```

## 📝 Formato de Archivos JSON

Cada archivo JSON debe seguir esta estructura:

```json
{
  "categoryName": "Nombre de la Categoría",
  "difficulty": "Facil|Medio|Dificil",
  "words": [
    "Palabra 1",
    "Palabra 2",
    "Palabra 3",
    ...
  ]
}
```

### Campos:
- **categoryName**: Nombre completo de la categoría (puede incluir espacios y tildes)
- **difficulty**: Nivel de dificultad. Debe ser exactamente: `"Facil"`, `"Medio"` o `"Dificil"`
- **words**: Array de strings con las palabras/nombres para esta categoría y dificultad

## ➕ Cómo Agregar una Nueva Categoría

1. **Crear carpeta**: Crea una nueva carpeta con el nombre de la categoría (usa guiones en lugar de espacios)
   ```
   Ejemplo: "Formula 1" → carpeta "formula-1"
   ```

2. **Crear archivos**: Dentro de la carpeta, crea 3 archivos:
   - `facil.json`
   - `medio.json`
   - `dificil.json`

3. **Completar datos**: Copia la estructura JSON de ejemplo y completa con tus datos

4. **Ejecutar seed**: Corre el comando de seed para actualizar la base de datos
   ```bash
   # Visita: http://localhost:3000/admin/seed
   ```

## ✏️ Cómo Agregar Palabras a una Categoría Existente

1. Abre el archivo JSON correspondiente (ej: `tenis/medio.json`)
2. Agrega las nuevas palabras al array `words`
3. Guarda el archivo
4. Ejecuta el seed nuevamente

## ⚠️ Reglas Importantes

- Cada categoría DEBE tener exactamente 3 archivos (facil, medio, dificil)
- El array de `words` NO puede estar vacío
- Los nombres de dificultad deben ser exactos: `"Facil"`, `"Medio"`, `"Dificil"` (con mayúscula inicial)
- Mantén al menos 20-50 palabras por dificultad para una buena experiencia de juego

## 🔄 Actualizar la Base de Datos

Después de hacer cambios en los archivos JSON:

1. Ve a: `http://localhost:3000/admin/seed`
2. Haz click en "Seed Database"
3. Verifica que el mensaje de éxito aparezca

¡Listo! Los cambios ya están en la base de datos.
