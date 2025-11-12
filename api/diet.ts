import { GoogleGenAI, Type } from "@google/genai";
import type { UserProfile, DietRecommendation } from "../types";

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
    const profile = (await req.json()) as UserProfile;
    const API_KEY = process.env.API_KEY;

    if (!API_KEY) {
      throw new Error("API_KEY environment variable not set on the server");
    }

    const ai = new GoogleGenAI({ apiKey: API_KEY });
    
    const prompt = `
      You are an expert nutritionist. Based on the following user profile, generate a personalized diet recommendation.
      
      User Profile:
      - Age: ${profile.age} years
      - Weight: ${profile.weight} kg
      - Height: ${profile.height} cm
      - BMI: ${profile.bmi}
      - Dietary Goal: ${profile.goal}
      
      Please provide a concise and actionable diet plan. The output must be in JSON format.
      - The 'planTitle' should be a catchy name for the diet plan, reflecting the user's goal and BMI.
      - The 'details' should be an array of strings, where each string is a single, actionable diet recommendation or principle. Keep each point to one sentence.
    `;

    const planResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            planTitle: { type: Type.STRING },
            details: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["planTitle", "details"]
        }
      }
    });
    
    const planData = JSON.parse(planResponse.text);

    if (!planData || !planData.planTitle || !planData.details) {
        throw new Error("Invalid JSON structure received from API for plan details.");
    }
    
    const getBmiCategory = (bmi: number): string => {
        if (bmi < 18.5) return 'Underweight';
        if (bmi >= 18.5 && bmi < 25) return 'Normal weight';
        if (bmi >= 25 && bmi < 30) return 'Overweight';
        return 'Obese';
    };

    const bmiCategory = getBmiCategory(profile.bmi);
    
    const result: DietRecommendation = {
        planTitle: planData.planTitle,
        details: planData.details,
        bmi: profile.bmi,
        bmiCategory: bmiCategory
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Error in /api/diet:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
