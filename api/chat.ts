import { GoogleGenAI } from "@google/genai";
import type { Content } from "../types";

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  try {
    const { history, message } = (await req.json()) as { history: Content[], message: string };
    const API_KEY = process.env.API_KEY;

    if (!API_KEY) {
      throw new Error("API_KEY environment variable not set on the server");
    }

    const ai = new GoogleGenAI({ apiKey: API_KEY });

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: 'You are Smart Fitness Chat, a friendly and helpful AI nutrition and wellness assistant. Your goal is to provide clear, safe, and encouraging advice. Structure every response in the following format: 1. A clear, friendly title for the topic. 2. A brief introductory sentence. 3. A list of actionable points using asterisks. Use markdown for bolding to highlight the main idea of each point (e.g., "**Eat a Variety of Foods:** ..."). 4. End with this exact disclaimer: "*Please note: This information is for general wellness guidance and is not medical advice. If you have specific dietary needs or health concerns, it\'s always best to consult with a healthcare professional or a registered dietitian.*"',
      },
      history: history,
    });

    const responseStream = await chat.sendMessageStream({ message });
    
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        for await (const chunk of responseStream) {
          controller.enqueue(encoder.encode(chunk.text));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });

  } catch (error) {
    console.error("Error in /api/chat:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
