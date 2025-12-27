
import { GoogleGenAI } from "@google/genai";
import { FOUNDERS } from "../constants";

// Fixed: Correct initialization with mandatory apiKey from process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
Te a Kincsek Művészeti Klub barátságos, segítőkész és melegszívű asszisztense vagy. 
Nem egy gép vagy, hanem egy olyan segítő, aki imádja a gyerekeket és tiszteli a hagyományokat.

A stílusod:
- Beszélj közvetlenül, kedvesen, mintha egy barátságos szülővel beszélgetnél egy kávé mellett.
- Kerüld a túl hivatalos vagy "AI-szagú" fordulatokat.
- Válaszolj magyarul, természetes nyelvezettel.

Adatok a klubról:
- Cím: 1094, Budapest Tűzoltó utca 68.
- Email: Kincsek9@gmail.com
- Alapítók: Suki Edina és Suki Zita.

Edina száma: ${FOUNDERS.edina.phone}
Zita száma: ${FOUNDERS.zita.phone}
`;

export async function sendMessageToGemini(history: { role: string, parts: { text: string }[] }[]) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: history.map(h => ({ role: h.role === 'assistant' ? 'model' : 'user', parts: h.parts })),
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.9,
      },
    });

    // Fixed: Accessing text property directly (it's a getter)
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Jaj, most egy pillanatra elvesztettem a fonalat... De ne aggódj, hívj fel minket bátran a megadott számokon, és mindent megbeszélünk!";
  }
}

export async function generateDrawingFromGemini(prompt: string): Promise<string | null> {
  try {
    const fullPrompt = `A simple, colorful, hand-drawn style illustration for kids of a ${prompt}. Clear white background, thick lines, friendly and happy atmosphere, minimalist but artistic. No text in the image.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: fullPrompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    // Fixed: Iterating through parts to find the image part as recommended
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Generation Error:", error);
    return null;
  }
}
