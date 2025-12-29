
import { GoogleGenAI, Type, Modality, GenerateContentResponse } from "@google/genai";

// Always initialize with process.env.API_KEY directly as per guidelines
export const getGeminiAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

// 1. Fast Listener (Gemini Flash Lite)
export async function chatFast(message: string, history: { role: 'user' | 'assistant', text: string }[]) {
  const ai = getGeminiAI();
  const response = await ai.models.generateContent({
    // Updated to the correct canonical name for flash lite
    model: 'gemini-flash-lite-latest',
    contents: [
      ...history.map(h => ({ role: h.role === 'user' ? 'user' : 'model', parts: [{ text: h.text }] })),
      { role: 'user', parts: [{ text: message }] }
    ],
    config: {
      systemInstruction: "You are a warm, empathetic 24/7 student mental health listener. Detect academic pressure and offer gentle validation. Keep responses conversational and supportive.",
    }
  });
  return response.text;
}

// 2. Thinking Mode (Gemini 3 Pro)
export async function chatDeepThinking(message: string) {
  const ai = getGeminiAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: [{ role: 'user', parts: [{ text: message }] }],
    config: {
      thinkingConfig: { thinkingBudget: 32768 },
      systemInstruction: "You are a senior student counselor. Provide deep, reasoned advice on mental health, academic pressure, and long-term well-being strategies.",
    }
  });
  return response.text;
}

// 3. Search Grounding (Gemini 3 Flash)
export async function searchResources(query: string) {
  const ai = getGeminiAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [{ role: 'user', parts: [{ text: query }] }],
    config: {
      tools: [{ googleSearch: {} }],
      systemInstruction: "Find current mental health resources, support groups, or evidence-based stress management tips for students.",
    }
  });
  return {
    text: response.text,
    links: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || 'Resource',
      uri: chunk.web?.uri || ''
    })) || []
  };
}

// 4. Maps Grounding (Gemini 2.5 Flash)
export async function findNearbyHelp(lat: number, lng: number) {
  const ai = getGeminiAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [{ role: 'user', parts: [{ text: "Find student health clinics, therapists, or counseling centers near me." }] }],
    config: {
      tools: [{ googleMaps: {} }],
      toolConfig: {
        retrievalConfig: {
          latLng: { latitude: lat, longitude: lng }
        }
      }
    }
  });
  return {
    text: response.text,
    links: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.maps?.title || 'Nearby Location',
      uri: chunk.maps?.uri || ''
    })) || []
  };
}

// 5. Image Analysis (Gemini 3 Pro)
export async function analyzeJournalImage(base64Data: string) {
  const ai = getGeminiAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Data, mimeType: 'image/jpeg' } },
        { text: "Analyze this image (e.g., a journal entry, an artwork, or a workspace). What emotions or stressors do you detect? Offer supportive feedback." }
      ]
    }
  });
  return response.text;
}

// 6. Image Editing (Gemini 2.5 Flash Image)
export async function editImage(base64Data: string, prompt: string, mimeType: string = 'image/jpeg') {
  const ai = getGeminiAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType,
          },
        },
        {
          text: prompt,
        },
      ],
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }
  return null;
}

// 7. Audio Transcription (Gemini 3 Flash)
export async function transcribeAudio(base64Audio: string) {
  const ai = getGeminiAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Audio, mimeType: 'audio/pcm;rate=16000' } },
        { text: "Transcribe this audio clip of a student speaking about their feelings. Return only the transcription." }
      ]
    }
  });
  return response.text;
}

// 8. TTS (Gemini 2.5 Flash Preview TTS)
export async function generateSpeech(text: string) {
  const ai = getGeminiAI();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });
  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
}
