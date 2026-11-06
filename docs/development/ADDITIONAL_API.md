# Integraciones y Capacidades Adicionales (Google AI Studio)

Ya que el proyecto está utilizando el SDK oficial `@google/genai` y una llave de Google AI Studio, tienes a tu disposición una gran cantidad de servicios avanzados de Inteligencia Artificial de Google. 

A continuación se detalla qué otros servicios puedes llamar fácilmente, cómo usarlos, y si requieren una llave adicional o si la actual es suficiente.

---

## 1. Generación de Imágenes (Imagen 3)
En lugar de depender de servicios externos para generar imágenes, puedes utilizar **Imagen 3**, el modelo de generación de imágenes de vanguardia de Google, directamente desde el mismo SDK.

* **¿Funciona con la misma API Key?**: ✅ **SÍ**. Tu actual `GEMINI_API_KEY` de AI Studio es todo lo que necesitas.

### Ejemplo de uso (Generar un banner para tu perfil)
```typescript
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateProfileBanner() {
  const response = await ai.models.generateImages({
    model: 'imagen-3.0-generate-002', // Modelo de Imagen 3
    prompt: 'Un escritorio minimalista y profesional, teclado iluminado, fondo oscuro cibernético, 4k',
    config: {
      numberOfImages: 1,
      aspectRatio: '16:9',
      outputMimeType: 'image/jpeg',
    },
  });

  // La imagen se devuelve codificada en Base64
  const base64Image = response.generatedImages[0].image.imageBytes;
  return `data:image/jpeg;base64,${base64Image}`;
}
```

---


## 2. Análisis de Audio y Video (Comprensión Multimodal)
En lugar de generar audio, Gemini es excelente *escuchando* audio o *viendo* video. Si el usuario sube un archivo con su entrevista grabada, Gemini puede transcribir y analizar las fortalezas del candidato.

* **¿Funciona con la misma API Key?**: ✅ **SÍ**. Funciona con tu `GEMINI_API_KEY` actual.

### Ejemplo de uso (Analizar una grabación)
```typescript
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeInterview(filePath: string) {
  // 1. Subir el archivo de audio localmente usando la API de archivos
  const uploadResult = await ai.files.upload({
    file: filePath,
    mimeType: 'audio/mp3',
  });

  // 2. Pedirle a Gemini que analice el audio
  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: [
      uploadResult,
      { text: "Escucha esta entrevista. Resume las 3 principales fortalezas de este candidato." }
    ],
  });

  return response.text;
}
```

---

## 4. Embeddings (Vectores Semánticos)
Si más adelante quisieras crear un buscador semántico (por ejemplo, buscar "ofertas de trabajo similares" basadas en el significado del texto y no solo palabras clave), puedes usar los modelos de "Embeddings" de Google.

* **¿Funciona con la misma API Key?**: ✅ **SÍ**. Funciona con tu `GEMINI_API_KEY` actual.

### Ejemplo de uso
```typescript
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getTextVector(text: string) {
  const response = await ai.models.embedContent({
    model: 'text-embedding-004',
    contents: text,
  });
  
  // Devuelve un arreglo de números que representan el significado del texto
  return response.embeddings[0].values; 
}
```

---

## Resumen
Con tu configuración actual del SDK `@google/genai` y tu `GEMINI_API_KEY`, **ya tienes desbloqueado**:
1. Generación de Texto Inteligente (Modelos Pro / Flash)
2. Comprensión Multimodal (Fotos, Documentos PDF, Audios, Videos)
3. Generación de Imágenes (Imagen 3)
4. Vectores Semánticos (Embeddings)

Únicamente necesitas buscar integraciones externas (y llaves nuevas) si requieres **generación de voz clásica (TTS)**, traducción tradicional directa, u otros servicios de nube que pertenezcan estrictamente a Google Cloud Platform y no a AI Studio.
