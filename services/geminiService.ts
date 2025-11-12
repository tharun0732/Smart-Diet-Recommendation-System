import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, DietRecommendation } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * @internal
 * Interface for the response from the text model.
 */
interface PlanData {
  planTitle: string;
  details: string[];
}

function getBmiCategory(bmi: number): string {
    if (bmi < 18.5) return 'Underweight';
    if (bmi >= 18.5 && bmi < 25) return 'Normal weight';
    if (bmi >= 25 && bmi < 30) return 'Overweight';
    return 'Obese';
}

export async function getDietRecommendation(profile: UserProfile): Promise<DietRecommendation> {
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

  try {
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

    let jsonString = planResponse.text.trim();
    
    // The Gemini API can sometimes wrap the JSON in markdown backticks (\`\`\`json ... \`\`\`).
    // This code block robustly extracts the JSON content before parsing.
    const jsonMatch = jsonString.match(/```(json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[2]) {
        jsonString = jsonMatch[2];
    }

    const planData: PlanData = JSON.parse(jsonString);

    if (!planData || !planData.planTitle || !planData.details) {
        throw new Error("Invalid JSON structure received from API for plan details.");
    }
    
    const bmiCategory = getBmiCategory(profile.bmi);
    
    return {
        planTitle: planData.planTitle,
        details: planData.details,
        bmi: profile.bmi,
        bmiCategory: bmiCategory
    };

  } catch (error) {
    console.error("Error in getDietRecommendation flow:", error);
    if (error instanceof Error) {
        throw new Error(`Could not fetch diet recommendation. ${error.message}`);
    }
    throw new Error("An unknown error occurred while fetching the diet recommendation.");
  }
}